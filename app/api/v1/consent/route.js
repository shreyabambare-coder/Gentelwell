import { NextResponse } from "next/server";
import { INITIAL_HOUSEHOLD } from "@/lib/setuData";
import {
  formatApiResponse,
  checkPurposeOfUse,
  checkIdempotency
} from "@/lib/apiHelper";

let consentRecord = {
  resourceType: "Consent",
  id: "consent-dpdp-84321",
  status: "active",
  scope: "patient-privacy",
  category: "DPDP_ACT_2023_SENSITIVE_HEALTH_DATA",
  patient: "Pooja Devi (pat-101)",
  dateTime: "2026-09-01T10:00:00Z",
  version: "v1.2-DPDP-2023",
  policyRule: "India Digital Personal Data Protection Act 2023",
  purposes: ["triage", "care-coordination", "offline-sync"],
  revocable: true,
  dataMinimizationVerified: true
};

export async function GET(req) {
  const purposeCheck = checkPurposeOfUse(req);
  if (!purposeCheck.valid) return purposeCheck.response;

  return NextResponse.json(
    formatApiResponse(consentRecord, {
      legalBasis: "DPDP Act 2023 Section 6 & 7",
      auditEnforced: true
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
    const { action, purposes, status } = body;

    if (action === "WITHDRAW") {
      consentRecord.status = "inactive";
      consentRecord.withdrawnAt = new Date().toISOString();
    } else if (purposes) {
      consentRecord.purposes = purposes;
      consentRecord.lastUpdated = new Date().toISOString();
    }

    if (status) {
      consentRecord.status = status;
    }

    return NextResponse.json(
      formatApiResponse(consentRecord, {
        idempotencyKey: idempCheck.idempotencyKey,
        auditAction: `CONSENT_${action || "UPDATE"}`
      })
    );
  } catch (err) {
    return NextResponse.json(
      formatApiResponse(null, {}, [{ code: "INVALID_REQUEST", message: err.message }]),
      { status: 400 }
    );
  }
}
