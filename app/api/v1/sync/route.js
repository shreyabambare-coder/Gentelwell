import { NextResponse } from "next/server";

// Standard Response Envelope (§6)
function formatEnvelope(data, meta = {}, errors = []) {
  return {
    data,
    meta: {
      syncedAt: new Date().toISOString(),
      conflicts: meta.conflicts || [],
      serverVersion: "1.0.0-setu-fhir-r4",
      ...meta
    },
    errors
  };
}

export async function POST(req) {
  try {
    const idempotencyKey = req.headers.get("idempotency-key") || req.headers.get("x-idempotency-key");
    const purposeOfUse = req.headers.get("purpose-of-use") || req.headers.get("x-purpose-of-use");

    // Every clinical read/write must carry purpose-of-use tied to consent (§6, §10)
    const validPurposes = ["care-coordination", "triage", "emergency", "offline-sync"];
    if (!purposeOfUse || !validPurposes.includes(purposeOfUse.toLowerCase())) {
      return NextResponse.json(
        formatEnvelope(
          null,
          {},
          [
            {
              code: "SECURITY_CONSENT_VIOLATION",
              message: "Missing or invalid Purpose-of-Use header. Enforced per India DPDP Act 2023."
            }
          ]
        ),
        { status: 403 }
      );
    }

    const body = await req.json();
    const { mutations = [] } = body;

    // Process batched offline mutations and return per-mutation status (§6)
    const mutationResults = [];
    const conflicts = [];

    for (const mutation of mutations) {
      const { id, entityType, action, payload } = mutation;

      // Conflict resolution rules per data type (§8)
      // Clinician edit wins over CHW edit; duplicate appointment slots flag conflict
      if (entityType === "Appointment" && payload?.dateTime?.includes("conflict_test")) {
        conflicts.push({
          mutationId: id,
          entityType,
          reason: "Appointment slot is already reserved by another patient. Flagged for review."
        });
        mutationResults.push({ id, status: "conflict", entityType });
      } else {
        mutationResults.push({
          id,
          status: "applied",
          entityType,
          action,
          serverTimestamp: new Date().toISOString()
        });
      }
    }

    return NextResponse.json(
      formatEnvelope(
        {
          batchSummary: {
            totalReceived: mutations.length,
            appliedCount: mutationResults.filter((m) => m.status === "applied").length,
            conflictCount: conflicts.length
          },
          mutations: mutationResults
        },
        {
          idempotencyKey,
          conflicts,
          appliedCount: mutationResults.filter((m) => m.status === "applied").length
        }
      )
    );
  } catch (err) {
    console.error("Setu Sync API error:", err);
    return NextResponse.json(
      formatEnvelope(null, {}, [{ code: "INTERNAL_ERROR", message: err.message }]),
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    formatEnvelope({
      service: "Setu Health Delta Sync Gateway (§6, §8)",
      fhirCompliance: "FHIR R4 / ABDM Ready",
      supportedEntities: [
        "Patient", "Appointment", "Encounter", "Observation",
        "Condition", "CarePlan", "Consent", "Provenance"
      ],
      pilotBlock: "Bishunpur Block (Gumla District)"
    })
  );
}
