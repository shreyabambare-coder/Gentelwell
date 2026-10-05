import { NextResponse } from "next/server";
import { INITIAL_HOUSEHOLD } from "@/lib/setuData";
import {
  formatApiResponse,
  checkPurposeOfUse,
  checkIdempotency,
  shapePayload
} from "@/lib/apiHelper";

// In-memory server-side patient store initialized with pilot data
let householdStore = { ...INITIAL_HOUSEHOLD };

export async function GET(req) {
  const purposeCheck = checkPurposeOfUse(req);
  if (!purposeCheck.valid) return purposeCheck.response;

  const url = new URL(req.url);
  const patientId = url.searchParams.get("patientId");

  let resultData = householdStore.members;
  if (patientId) {
    const member = householdStore.members.find((m) => m.id === patientId);
    if (!member) {
      return NextResponse.json(
        formatApiResponse(null, {}, [{ code: "PATIENT_NOT_FOUND", message: `Patient ${patientId} not found` }]),
        { status: 404 }
      );
    }
    resultData = member;
  }

  const shaped = shapePayload(resultData, req);
  return NextResponse.json(
    formatApiResponse(shaped, {
      resourceType: patientId ? "Patient" : "Bundle",
      total: Array.isArray(shaped) ? shaped.length : 1,
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
    const { patientId, observation, condition } = body;

    const patient = householdStore.members.find((m) => m.id === patientId);
    if (!patient) {
      return NextResponse.json(
        formatApiResponse(null, {}, [{ code: "PATIENT_NOT_FOUND", message: `Patient ${patientId} not found` }]),
        { status: 404 }
      );
    }

    if (observation) {
      const newObs = {
        date: new Date().toISOString().slice(0, 10),
        code: observation.code,
        value: observation.value,
        unit: observation.unit || "",
        status: "final",
        recordedVia: "REST_v1_API"
      };
      patient.observations.unshift(newObs);
    }

    if (condition) {
      patient.conditions.unshift(condition);
    }

    return NextResponse.json(
      formatApiResponse(
        { patientId, updatedObservations: patient.observations },
        {
          idempotencyKey: idempCheck.idempotencyKey,
          resourceType: "Observation",
          status: "recorded"
        }
      ),
      { status: 201 }
    );
  } catch (err) {
    return NextResponse.json(
      formatApiResponse(null, {}, [{ code: "INVALID_PAYLOAD", message: err.message }]),
      { status: 400 }
    );
  }
}
