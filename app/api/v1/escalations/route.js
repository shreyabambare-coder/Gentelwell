import { NextResponse } from "next/server";
import { INITIAL_ESCALATIONS } from "@/lib/setuData";
import {
  formatApiResponse,
  checkPurposeOfUse,
  checkIdempotency,
  shapePayload
} from "@/lib/apiHelper";

let escalationsStore = [...INITIAL_ESCALATIONS];

export async function GET(req) {
  const purposeCheck = checkPurposeOfUse(req);
  if (!purposeCheck.valid) return purposeCheck.response;

  const url = new URL(req.url);
  const urgency = url.searchParams.get("urgency");

  let filtered = [...escalationsStore];
  if (urgency && urgency !== "all") {
    filtered = filtered.filter((e) => e.urgency === urgency);
  }

  const shaped = shapePayload(filtered, req);
  return NextResponse.json(
    formatApiResponse(shaped, {
      resourceType: "Bundle",
      entryType: "ServiceRequest",
      total: shaped.length,
      urgentCount: escalationsStore.filter((e) => e.urgency.includes("urgent")).length,
      purposeOfUse: purposeCheck.purpose
    })
  );
}

export async function POST(req) {
  const purposeCheck = checkPurposeOfUse(req);
  if (!purposeCheck.valid) return purposeCheck.response;

  const idempCheck = checkIdempotency(req);
  if (!idempCheck.valid) return idempCheck.response;

  try {
    const body = await req.json();
    const { patientName, village, age, reason, urgency = "urgent", assignedTo } = body;

    const newEscalation = {
      id: "esc-" + Date.now(),
      resourceType: "ServiceRequest",
      patientName: patientName || "Pooja Devi",
      village: village || "Palghar District",
      age: age || 26,
      reason,
      urgency,
      status: "pending_review",
      createdAt: new Date().toISOString(),
      assignedTo: assignedTo || "Dr. Snehal Shinde (Gyn/Obs)"
    };

    escalationsStore.unshift(newEscalation);

    return NextResponse.json(
      formatApiResponse(newEscalation, {
        idempotencyKey: idempCheck.idempotencyKey,
        resourceType: "ServiceRequest",
        status: "escalated_to_clinician"
      }),
      { status: 201 }
    );
  } catch (err) {
    return NextResponse.json(
      formatApiResponse(null, {}, [{ code: "INVALID_REQUEST", message: err.message }]),
      { status: 400 }
    );
  }
}
