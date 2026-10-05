import { NextResponse } from "next/server";
import { MARKETPLACE_PRODUCTS } from "@/lib/setuData";
import {
  formatApiResponse,
  checkPurposeOfUse,
  checkIdempotency,
  shapePayload
} from "@/lib/apiHelper";

let ordersStore = [];

export async function GET(req) {
  const url = new URL(req.url);
  const category = url.searchParams.get("category");

  let filtered = [...MARKETPLACE_PRODUCTS];
  if (category && category !== "all") {
    filtered = filtered.filter((p) => p.category === category);
  }

  const shaped = shapePayload(filtered, req);
  return NextResponse.json(
    formatApiResponse(shaped, {
      resourceType: "Bundle",
      entryType: "MedicationKnowledge",
      total: shaped.length,
      ordersPlacedCount: ordersStore.length
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
    const { patientName, phone, facilityId, items = [], totalAmount, paymentMethod } = body;

    const newOrder = {
      id: "ord-" + Date.now(),
      resourceType: "MedicationRequest",
      patientName: patientName || "Pooja Devi",
      phone: phone || "9876543210",
      facilityId: facilityId || "fac-8",
      items,
      totalAmount,
      paymentMethod: paymentMethod || "upi",
      status: "active",
      createdAt: new Date().toISOString()
    };

    ordersStore.unshift(newOrder);

    return NextResponse.json(
      formatApiResponse(newOrder, {
        idempotencyKey: idempCheck.idempotencyKey,
        resourceType: "MedicationRequest",
        status: "confirmed"
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
