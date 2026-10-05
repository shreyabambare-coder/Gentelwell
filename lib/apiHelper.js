import { NextResponse } from "next/server";

// Valid Purpose-of-Use values per DPDP Act 2023 (§6, §9)
const VALID_PURPOSES = ["care-coordination", "triage", "emergency", "offline-sync", "research-audit"];

/**
 * Standard FHIR-aligned API Response Envelope (§6)
 */
export function formatApiResponse(data, meta = {}, errors = []) {
  return {
    data,
    meta: {
      timestamp: new Date().toISOString(),
      serverVersion: "1.0.0-setu-fhir-r4",
      dpdpCompliant: true,
      ...meta
    },
    errors
  };
}

/**
 * Enforce Purpose-of-Use Header (§6, §9)
 */
export function checkPurposeOfUse(req) {
  const purpose = req.headers.get("purpose-of-use") || req.headers.get("x-purpose-of-use");
  if (!purpose || !VALID_PURPOSES.includes(purpose.toLowerCase())) {
    return {
      valid: false,
      response: NextResponse.json(
        formatApiResponse(
          null,
          {},
          [
            {
              code: "SECURITY_CONSENT_VIOLATION",
              message: "Missing or invalid Purpose-of-Use header. Enforced per India DPDP Act 2023 (§6, §9)."
            }
          ]
        ),
        { status: 403 }
      )
    };
  }
  return { valid: true, purpose: purpose.toLowerCase() };
}

/**
 * Enforce Idempotency Key on all Write Operations (§6)
 */
export function checkIdempotency(req) {
  const key = req.headers.get("idempotency-key") || req.headers.get("x-idempotency-key");
  if (!key) {
    return {
      valid: false,
      response: NextResponse.json(
        formatApiResponse(
          null,
          {},
          [
            {
              code: "MISSING_IDEMPOTENCY_KEY",
              message: "Write operations require an Idempotency-Key header for offline retry-sync safety (§6)."
            }
          ]
        ),
        { status: 400 }
      )
    };
  }
  return { valid: true, idempotencyKey: key };
}

/**
 * Payload Shaping for 2G / Low-Bandwidth Clients (§6, §7)
 */
export function shapePayload(data, req) {
  try {
    const url = new URL(req.url);
    const compact = url.searchParams.get("compact") === "true";
    const fieldsParam = url.searchParams.get("fields");

    if (!fieldsParam && !compact) return data;

    const fields = fieldsParam ? fieldsParam.split(",") : null;

    if (Array.isArray(data)) {
      return data.map((item) => {
        if (fields) {
          const shaped = {};
          fields.forEach((f) => {
            const trimmed = f.trim();
            if (item[trimmed] !== undefined) shaped[trimmed] = item[trimmed];
          });
          return shaped;
        }
        return item;
      });
    }

    if (typeof data === "object" && data !== null && fields) {
      const shaped = {};
      fields.forEach((f) => {
        const trimmed = f.trim();
        if (data[trimmed] !== undefined) shaped[trimmed] = data[trimmed];
      });
      return shaped;
    }

    return data;
  } catch {
    return data;
  }
}
