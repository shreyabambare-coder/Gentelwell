# REST v1 & FHIR R4 API Specification

**Project:** Gentelwell / Setu Health  
**Base URL:** `http://localhost:3000/api`  
**API Version:** `v1`  
**Standard Compliance:** HL7 FHIR Release 4 (R4) / ABDM Ready / India DPDP Act 2023  

---

## 1. Global API Standards & Design Principles

### 1.1 Standard Response Envelope
All API endpoints return a predictable JSON envelope structure:

```json
{
  "data": { ... } | [ ... ] | null,
  "meta": {
    "timestamp": "2026-10-05T22:30:00.000Z",
    "serverVersion": "1.0.0-setu-fhir-r4",
    "dpdpCompliant": true
  },
  "errors": [
    {
      "code": "ERROR_CODE_STRING",
      "message": "Human-readable clinical or technical explanation."
    }
  ]
}
```

### 1.2 Mandatory Purpose-of-Use Header (`purpose-of-use`)
In accordance with Section 6 of the DPDP Act 2023, every read or write of clinical data must explicitly state its operational purpose via the `purpose-of-use` (or `x-purpose-of-use`) HTTP header.
- **Allowed Values:** `care-coordination`, `triage`, `emergency`, `offline-sync`, `research-audit`
- **Violation:** If omitted or invalid, endpoints reject the request with HTTP `403 Forbidden` (`SECURITY_CONSENT_VIOLATION`).

### 1.3 Idempotency Key Header (`idempotency-key`)
Every write mutation (`POST`) requires an `idempotency-key` header to ensure safe retries from offline queues without duplicate records.
- **Header:** `idempotency-key: idem_<timestamp>_<uuid>`
- **Violation:** Returns HTTP `400 Bad Request` (`MISSING_IDEMPOTENCY_KEY`).

### 1.4 Low-Bandwidth 2G Payload Shaping
Endpoints support query parameters to minimize data transfer across 2G/EDGE networks:
- `?compact=true`: Returns condensed records omitting large text descriptions.
- `?fields=id,name,dateTime,status`: Returns only the specified comma-separated fields.

---

## 2. API Endpoints Reference

### 2.1 Delta Sync Engine (`/api/v1/sync`)
Handles batched delta synchronizations from offline PWA clients.

* **`POST /api/v1/sync`**
  * **Headers:** `purpose-of-use: offline-sync`, `idempotency-key: <uuid>`
  * **Request Body:**
    ```json
    {
      "mutations": [
        {
          "id": "mut-101",
          "entityType": "Appointment",
          "action": "CREATE",
          "payload": {
            "id": "apt-901",
            "patientId": "pat-101",
            "facilityId": "fac-1",
            "dateTime": "2026-10-20T10:00:00"
          }
        }
      ]
    }
    ```
  * **Response (200 OK):**
    ```json
    {
      "data": {
        "batchSummary": {
          "totalReceived": 1,
          "appliedCount": 1,
          "conflictCount": 0
        },
        "mutations": [
          { "id": "mut-101", "status": "applied", "serverTimestamp": "2026-10-05T22:30:00Z" }
        ]
      },
      "meta": { "conflicts": [] }
    }
    ```

* **`GET /api/v1/sync`**
  * Returns gateway status, FHIR conformance version, and supported entity types.

---

### 2.2 Patients & Longitudinal Vitals (`/api/v1/patients`)
FHIR R4 `Patient` and `Observation` management.

* **`GET /api/v1/patients?patientId=pat-101`**
  * **Headers:** `purpose-of-use: care-coordination`
  * **Response (200 OK):**
    ```json
    {
      "data": {
        "id": "pat-101",
        "resourceType": "Patient",
        "name": "Pooja Devi",
        "age": 26,
        "abhaId": "91-4432-8819-2041",
        "pregnant": true,
        "gestationalWeeks": 22,
        "observations": [
          { "code": "Hemoglobin", "value": "10.2", "unit": "g/dL", "status": "borderline" }
        ],
        "carePlan": [
          { "activity": "Daily IFA Tablet", "frequency": "1 tablet after dinner with lemon water" }
        ]
      }
    }
    ```

* **`POST /api/v1/patients`**
  * **Headers:** `purpose-of-use: care-coordination`, `idempotency-key: <uuid>`
  * **Request Body:**
    ```json
    {
      "patientId": "pat-101",
      "observation": {
        "code": "Hemoglobin (Hb)",
        "value": "10.8",
        "unit": "g/dL"
      }
    }
    ```
  * **Response (201 Created):** Returns updated observation record with status `recorded`.

---

### 2.3 Appointments & Slot Conflict Gate (`/api/v1/appointments`)
FHIR R4 `Appointment` resources with double-booking collision detection.

* **`GET /api/v1/appointments?facilityId=fac-1`**
  * **Headers:** `purpose-of-use: care-coordination`
  * **Response (200 OK):** Returns bundle of booked appointments.

* **`POST /api/v1/appointments`**
  * **Headers:** `purpose-of-use: care-coordination`, `idempotency-key: <uuid>`
  * **Request Body:**
    ```json
    {
      "patientId": "pat-101",
      "patientName": "Pooja Devi",
      "facilityId": "fac-1",
      "facilityName": "KEM Hospital, Mumbai",
      "serviceType": "Antenatal Care (ANC Visit 3)",
      "clinician": "Dr. Snehal Shinde",
      "dateTime": "2026-10-18T10:00:00",
      "channel": "sms"
    }
    ```
  * **Success (201 Created):** Returns confirmed appointment with ID.
  * **Conflict (409 Conflict):** If slot is reserved:
    ```json
    {
      "data": null,
      "errors": [
        {
          "code": "APPOINTMENT_SLOT_CONFLICT",
          "message": "The requested appointment time slot is already reserved. Please select another slot."
        }
      ]
    }
    ```

---

### 2.4 Clinician Escalation Queue (`/api/v1/escalations`)
FHIR R4 `ServiceRequest` clinical triage and emergency tickets.

* **`GET /api/v1/escalations?urgency=urgent`**
  * **Headers:** `purpose-of-use: triage`
  * Returns active escalated cases awaiting doctor review.

* **`POST /api/v1/escalations`**
  * **Headers:** `purpose-of-use: emergency`, `idempotency-key: <uuid>`
  * **Request Body:**
    ```json
    {
      "patientName": "Sumitra Devi",
      "village": "Mokhada",
      "age": 48,
      "reason": "Post-menopausal bleeding for 3 days",
      "urgency": "urgent",
      "assignedTo": "Dr. Snehal Shinde (Gyn/Obs)"
    }
    ```
  * **Response (201 Created):** Escalation ticket dispatched to doctor portal.

---

### 2.5 Facility & Jan Aushadhi Directory (`/api/v1/facilities`)
FHIR R4 `Location` and `Organization` geo-directory.

* **`GET /api/v1/facilities?district=Palghar&type=hospital`**
  * Returns facilities with distance (km), travel time, beds available, operating hours, and 24x7 ambulance status.

---

### 2.6 DPDP Consent Management (`/api/v1/consent`)
FHIR R4 `Consent` resources under Digital Personal Data Protection Act 2023.

* **`GET /api/v1/consent`**
  * **Headers:** `purpose-of-use: care-coordination`
  * Returns active consent record version `v1.2-DPDP-2023`, legal basis, and permitted purposes.

* **`POST /api/v1/consent`**
  * Allows patients or guardians to modify purposes or revoke consent (`action: "WITHDRAW"`).

---

### 2.7 Healthcare Marketplace (`/api/v1/marketplace`)
Curated OTC essentials and Jan Aushadhi generic catalog.

* **`GET /api/v1/marketplace?category=Maternal Health`**
  * Returns products with MRP, Jan Aushadhi subsidized price, discount percentage, and stock count.

* **`POST /api/v1/marketplace`**
  * **Headers:** `purpose-of-use: care-coordination`, `idempotency-key: <uuid>`
  * Places order (`resourceType: "MedicationRequest"`) with payment method (`upi` or `cod_pickup`).

---

### 2.8 Program Observability KPIs (`/api/v1/kpi`)
Observability service returning real-time pilot performance metrics against Section 15 targets:
- `registrationRatePercent` ($\ge 40\%$)
- `falseNegativeRedFlagRate` (Strict $0.0\%$)
- `offlineSyncSuccessRatePercent` ($\ge 99\%$)
- `videoCompletionRatePercent` ($\ge 60\%$)
- `forumModerationRatePercent` ($< 5\%$)

---

### 2.9 Medical RAG Lump Triage (`/api/rag-triage`)
Vector retrieval endpoint for soft tissue masses and lipomas.

* **`POST /api/rag-triage`**
  * **Headers:** `purpose-of-use: triage`
  * **Request Body:**
    ```json
    {
      "location": "Forearm / Arm",
      "texture": "Soft and doughy",
      "mobility": "Moves freely under the skin",
      "painLevel": 3,
      "skinChanges": "Normal skin",
      "growthSpeed": "Slow / Same size for years",
      "sizeCm": 2.5
    }
    ```
  * **Response (200 OK):**
    ```json
    {
      "data": {
        "clinicalRiskTier": "Low / Typical Benign Pattern",
        "hasRedFlags": false,
        "isUrgentEmergency": false,
        "identifiedRedFlags": [],
        "differentials": [
          {
            "condition": "Possible Angiolipoma or Nerve Abutment",
            "likelihood": "Moderate",
            "rationale": "Soft, movable lump with mild tenderness is characteristic of an angiolipoma (containing blood vessels) or a lipoma pressing lightly on a cutaneous nerve."
          }
        ],
        "citations": [
          {
            "topic": "Angiolipoma",
            "source": "NIH National Library of Medicine & Cleveland Clinic",
            "citation": "Singh R, et al. J Cutan Aesthet Surg. 2021;14(2):210-214."
          }
        ],
        "disclaimer": "⚠️ Medical Disclaimer: This AI tool is for educational and triage-support purposes only..."
      }
    }
    ```
