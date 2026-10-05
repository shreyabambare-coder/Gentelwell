import { NextResponse } from "next/server";
import { INITIAL_APPOINTMENTS } from "@/lib/setuData";
import {
  formatApiResponse,
  checkPurposeOfUse,
  checkIdempotency,
  shapePayload
} from "@/lib/apiHelper";

let appointmentsStore = [...INITIAL_APPOINTMENTS];

export async function GET(req) {
  const purposeCheck = checkPurposeOfUse(req);
  if (!purposeCheck.valid) return purposeCheck.response;

  const url = new URL(req.url);
  const patientId = url.searchParams.get("patientId");
  const facilityId = url.searchParams.get("facilityId");

  let filtered = [...appointmentsStore];
  if (patientId) filtered = filtered.filter((a) => a.patientId === patientId);
  if (facilityId) filtered = filtered.filter((a) => a.facilityId === facilityId);

  const shaped = shapePayload(filtered, req);
  return NextResponse.json(
    formatApiResponse(shaped, {
      resourceType: "Bundle",
      entryType: "Appointment",
      total: shaped.length,
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
    const { patientId, patientName, facilityId, facilityName, serviceType, clinician, dateTime, channel } = body;

    // Check for double booking conflict (§6, §8)
    const slotConflict = appointmentsStore.find(
      (a) => a.facilityId === facilityId && a.dateTime === dateTime && a.status === "booked"
    );

    if (slotConflict) {
      return NextResponse.json(
        formatApiResponse(
          null,
          { conflictWith: slotConflict.id },
          [
            {
              code: "APPOINTMENT_SLOT_CONFLICT",
              message: "The requested appointment time slot is already reserved. Please select another slot."
            }
          ]
        ),
        { status: 409 }
      );
    }

    const newAppointment = {
      id: "apt-" + Date.now(),
      resourceType: "Appointment",
      patientId: patientId || "pat-101",
      patientName: patientName || "Pooja Devi",
      facilityId: facilityId || "fac-1",
      facilityName: facilityName || "KEM Hospital, Mumbai",
      serviceType: serviceType || "Antenatal Care",
      clinician: clinician || "Dr. Snehal Shinde",
      dateTime,
      status: "booked",
      channel: channel || "app",
      syncStatus: "synced",
      createdAt: new Date().toISOString()
    };

    appointmentsStore.push(newAppointment);

    return NextResponse.json(
      formatApiResponse(newAppointment, {
        idempotencyKey: idempCheck.idempotencyKey,
        status: "created"
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
