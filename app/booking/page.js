"use client";

import { useState, useEffect } from "react";
import SetuHeader from "../../components/SetuHeader";
import SetuFooter from "../../components/SetuFooter";
import { FACILITIES } from "../../lib/setuData";
import {
  getHousehold,
  getAppointments,
  queueMutation,
  getNetworkMode
} from "../../lib/offlineSync";

export default function BookingPage() {
  const [household, setHousehold] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [selectedMemberId, setSelectedMemberId] = useState("pat-101");
  const [selectedFacilityId, setSelectedFacilityId] = useState("fac-1");
  const [selectedService, setSelectedService] = useState("Antenatal Care (ANC Visit)");
  const [selectedDate, setSelectedDate] = useState("2026-10-18");
  const [selectedSlot, setSelectedSlot] = useState("10:00 AM");
  const [reminderChannel, setReminderChannel] = useState("sms"); // "sms" | "ivr" | "app"
  const [bookingSuccess, setBookingSuccess] = useState(null);
  const [networkMode, setNetworkMode] = useState("online");

  useEffect(() => {
    setHousehold(getHousehold());
    setAppointments(getAppointments());
    setNetworkMode(getNetworkMode());

    const handleSync = () => setAppointments(getAppointments());
    const handleNet = (e) => setNetworkMode(e.detail.mode);

    window.addEventListener("setu_sync_update", handleSync);
    window.addEventListener("setu_network_change", handleNet);

    return () => {
      window.removeEventListener("setu_sync_update", handleSync);
      window.removeEventListener("setu_network_change", handleNet);
    };
  }, []);

  const handleBookingSubmit = (e) => {
    e.preventDefault();

    const member = household?.members?.find((m) => m.id === selectedMemberId) || { name: "Pooja Devi" };
    const facility = FACILITIES.find((f) => f.id === selectedFacilityId) || FACILITIES[0];

    const newAppointment = {
      id: "apt-" + Date.now(),
      resourceType: "Appointment",
      patientId: member.id,
      patientName: member.name,
      facilityId: facility.id,
      facilityName: facility.name,
      serviceType: selectedService,
      clinician: facility.doctorsAvailable[0]?.name || "Medical Officer",
      dateTime: `${selectedDate}T${selectedSlot === "10:00 AM" ? "10:00:00" : "11:30:00"}`,
      status: "booked",
      channel: reminderChannel,
      reminderSentT24: false,
      reminderSentT2: false,
      syncStatus: networkMode === "offline" ? "queued_locally" : "synced"
    };

    // Queue through the offline-first mutation engine (§3.3, §8)
    queueMutation({
      entityType: "Appointment",
      action: "CREATE",
      payload: newAppointment,
      purposeOfUse: "care-coordination"
    });

    setAppointments(getAppointments());
    setBookingSuccess(newAppointment);
  };

  const handleCancel = (aptId) => {
    if (confirm("Are you sure you want to cancel this booking?")) {
      queueMutation({
        entityType: "Appointment",
        action: "CANCEL",
        payload: { id: aptId },
        purposeOfUse: "care-coordination"
      });
      setAppointments(getAppointments());
    }
  };

  return (
    <>
      <SetuHeader />
      <main className="container" style={{ padding: "40px 0 80px" }}>
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <p className="eyebrow">MULTI-CHANNEL CLINIC SCHEDULING (§3.3)</p>
          <h1>Book a Healthcare Visit</h1>
          <p style={{ maxWidth: "620px", margin: "8px auto 0" }}>
            Real-time appointment scheduling across partner health facilities.
            Works completely offline; queued bookings reconcile automatically on reconnect.
          </p>
        </div>

        {bookingSuccess && (
          <div
            style={{
              maxWidth: "750px",
              margin: "0 auto 24px",
              background: "#ecfdf5",
              border: "1.5px solid #10b981",
              borderRadius: "14px",
              padding: "16px 20px"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <b style={{ color: "#065f46", fontSize: "15px" }}>
                  ✓ Visit Scheduled for {bookingSuccess.patientName}!
                </b>
                <p style={{ margin: "4px 0 0", fontSize: "13px", color: "#047857" }}>
                  {bookingSuccess.serviceType} at {bookingSuccess.facilityName} on {selectedDate} ({selectedSlot}).
                  {networkMode === "offline" ? " (Queued locally for offline sync)" : " (Synced with server)"}
                </p>
                <small style={{ color: "#059669" }}>
                  Automated reminders configured via {reminderChannel.toUpperCase()} for T-24h and T-2h.
                </small>
              </div>
              <button
                type="button"
                className="button ghost"
                style={{ minHeight: "36px", fontSize: "12px" }}
                onClick={() => setBookingSuccess(null)}
              >
                Close
              </button>
            </div>
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "30px", maxWidth: "980px", margin: "0 auto" }}>
          {/* Booking Form */}
          <div className="card">
            <h3 style={{ fontSize: "18px", marginBottom: "16px" }}>Schedule New Appointment</h3>
            <form onSubmit={handleBookingSubmit}>
              {/* Member Selection */}
              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", fontSize: "13px", fontWeight: "700", marginBottom: "6px" }}>
                  Family Member
                </label>
                <select
                  value={selectedMemberId}
                  onChange={(e) => setSelectedMemberId(e.target.value)}
                  style={{ width: "100%", padding: "10px", borderRadius: "10px", border: "1.5px solid var(--line)" }}
                >
                  {household?.members?.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.relationship}, {m.age} yrs)
                    </option>
                  ))}
                </select>
              </div>

              {/* Service Selection */}
              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", fontSize: "13px", fontWeight: "700", marginBottom: "6px" }}>
                  Service Type
                </label>
                <select
                  value={selectedService}
                  onChange={(e) => setSelectedService(e.target.value)}
                  style={{ width: "100%", padding: "10px", borderRadius: "10px", border: "1.5px solid var(--line)" }}
                >
                  <option value="Antenatal Care (ANC Visit)">Antenatal Care (ANC Checkup for Pregnancy)</option>
                  <option value="Child Growth & Immunization">Child Growth & Routine Immunization</option>
                  <option value="General OPD Consultation">General OPD / Chronic Care Consultation</option>
                  <option value="Anemia & Hemoglobin Check">Anemia Screening & IFA Refill</option>
                  <option value="Cancer Awareness & Screening">Cancer Screening (Oral & Cervical VIA)</option>
                </select>
              </div>

              {/* Facility Selection */}
              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", fontSize: "13px", fontWeight: "700", marginBottom: "6px" }}>
                  Partner Health Facility (Maharashtra)
                </label>
                <select
                  value={selectedFacilityId}
                  onChange={(e) => setSelectedFacilityId(e.target.value)}
                  style={{ width: "100%", padding: "10px", borderRadius: "10px", border: "1.5px solid var(--line)" }}
                >
                  {FACILITIES.filter((f) => f.type !== "Affordable Pharmacy").map((fac) => (
                    <option key={fac.id} value={fac.id}>
                      {fac.name} (~{fac.distanceKm} km, {fac.typicalWaitMinutes} min wait)
                    </option>
                  ))}
                </select>
              </div>

              {/* Date & Slot */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: "700", marginBottom: "6px" }}>
                    Date
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min="2026-10-01"
                    max="2026-11-30"
                    style={{ width: "100%", padding: "10px", borderRadius: "10px", border: "1.5px solid var(--line)" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: "700", marginBottom: "6px" }}>
                    Time Slot
                  </label>
                  <select
                    value={selectedSlot}
                    onChange={(e) => setSelectedSlot(e.target.value)}
                    style={{ width: "100%", padding: "10px", borderRadius: "10px", border: "1.5px solid var(--line)" }}
                  >
                    <option value="09:30 AM">09:30 AM - Morning</option>
                    <option value="10:00 AM">10:00 AM - Morning</option>
                    <option value="11:30 AM">11:30 AM - Late Morning</option>
                    <option value="01:00 PM">01:00 PM - Afternoon</option>
                  </select>
                </div>
              </div>

              {/* Reminder Channel Preference (§3.3) */}
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "13px", fontWeight: "700", marginBottom: "6px" }}>
                  Reminder Delivery Channel (T-24h & T-2h)
                </label>
                <div style={{ display: "flex", gap: "10px" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "13px" }}>
                    <input
                      type="radio"
                      name="chan"
                      checked={reminderChannel === "sms"}
                      onChange={() => setReminderChannel("sms")}
                    />
                    ✉️ SMS Alert
                  </label>
                  <label style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "13px" }}>
                    <input
                      type="radio"
                      name="chan"
                      checked={reminderChannel === "ivr"}
                      onChange={() => setReminderChannel("ivr")}
                    />
                    🗣️ IVR Voice Call
                  </label>
                  <label style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "13px" }}>
                    <input
                      type="radio"
                      name="chan"
                      checked={reminderChannel === "app"}
                      onChange={() => setReminderChannel("app")}
                    />
                    📱 In-App Notification
                  </label>
                </div>
              </div>

              <button type="submit" className="button" style={{ width: "100%" }}>
                Confirm Booking (समय बुक करें) →
              </button>
            </form>
          </div>

          {/* Active Appointments List */}
          <div>
            <div className="card">
              <span className="stat-tag">Active Bookings ({appointments.length})</span>
              <h3 style={{ fontSize: "18px", marginBottom: "14px" }}>Scheduled Visits</h3>

              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {appointments.map((apt) => (
                  <div
                    key={apt.id}
                    style={{
                      background: "var(--sage)",
                      border: "1px solid var(--line)",
                      borderRadius: "12px",
                      padding: "14px",
                      fontSize: "12.5px"
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                      <b style={{ fontSize: "14px", color: "var(--ink)" }}>{apt.patientName}</b>
                      <span
                        style={{
                          fontSize: "10.5px",
                          fontWeight: "bold",
                          padding: "2px 8px",
                          borderRadius: "10px",
                          background: apt.syncStatus === "synced" ? "#dcfce7" : "#fef3c7",
                          color: apt.syncStatus === "synced" ? "#166534" : "#92400e"
                        }}
                      >
                        {apt.syncStatus === "synced" ? "✓ Synced" : "⏳ Queued Offline"}
                      </span>
                    </div>

                    <div style={{ color: "var(--forest)", fontWeight: "600", marginBottom: "4px" }}>
                      {apt.serviceType}
                    </div>
                    <div style={{ color: "var(--slate)", marginBottom: "4px" }}>
                      🏥 {apt.facilityName} ({apt.clinician})
                    </div>
                    <div style={{ color: "var(--slate)", marginBottom: "8px" }}>
                      📅 {apt.dateTime.replace("T", " at ")} · Reminders via {apt.channel.toUpperCase()}
                    </div>

                    <div style={{ display: "flex", justifyContent: "flex-end" }}>
                      <button
                        type="button"
                        onClick={() => handleCancel(apt.id)}
                        style={{
                          background: "transparent",
                          border: "0",
                          color: "#ef4444",
                          fontSize: "11px",
                          cursor: "pointer",
                          fontWeight: "600"
                        }}
                      >
                        Cancel Booking
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      <SetuFooter />
    </>
  );
}
