"use client";

import { useState, useEffect } from "react";
import SetuHeader from "../../components/SetuHeader";
import SetuFooter from "../../components/SetuFooter";
import { getEscalations, getAppointments } from "../../lib/offlineSync";

export default function ClinicianPortal() {
  const [escalations, setEscalations] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [filterUrgency, setFilterUrgency] = useState("all");
  const [actionNotice, setActionNotice] = useState("");

  useEffect(() => {
    setEscalations(getEscalations());
    setAppointments(getAppointments());
  }, []);

  const handleResolve = (id, action) => {
    setActionNotice(`✓ Escalation ${id} updated: ${action}`);
    setEscalations(
      escalations.map((e) => (e.id === id ? { ...e, status: "resolved", resolvedAction: action } : e))
    );
    setTimeout(() => setActionNotice(""), 3500);
  };

  const filtered = escalations.filter((e) =>
    filterUrgency === "all" ? true : e.urgency === filterUrgency
  );

  return (
    <>
      <SetuHeader />
      <main className="container" style={{ padding: "40px 0 80px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px", marginBottom: "28px" }}>
          <div>
            <p className="eyebrow">LIGHTWEIGHT CLINICAL INTERFACE (§2, §4)</p>
            <h1>Clinician & ASHA Referral Portal</h1>
            <p style={{ margin: "4px 0 0" }}>
              Active Clinician: <b>Dr. Ananya Roy, MBBS, MS (Obs/Gyn)</b> · Bishunpur CHC
            </p>
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            <span className="stat-tag" style={{ background: "#fee2e2", color: "#b91c1c" }}>
              🚨 {escalations.filter((e) => e.urgency.includes("urgent")).length} High-Risk Escalations
            </span>
            <span className="stat-tag">
              📅 {appointments.length} Total Bookings
            </span>
          </div>
        </div>

        {actionNotice && (
          <div style={{ background: "#ecfdf5", color: "#065f46", border: "1px solid #a7f3d0", padding: "12px 18px", borderRadius: "12px", marginBottom: "20px", fontWeight: "bold" }}>
            {actionNotice}
          </div>
        )}

        {/* Filter Pills */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
          <button
            type="button"
            className={`button ${filterUrgency === "all" ? "" : "ghost"}`}
            style={{ minHeight: "36px", padding: "4px 14px", fontSize: "12px" }}
            onClick={() => setFilterUrgency("all")}
          >
            All Referrals ({escalations.length})
          </button>
          <button
            type="button"
            className={`button ${filterUrgency === "urgent" || filterUrgency === "urgent_emergency" ? "" : "ghost"}`}
            style={{ minHeight: "36px", padding: "4px 14px", fontSize: "12px" }}
            onClick={() => setFilterUrgency("urgent")}
          >
            🚨 Urgent Only
          </button>
          <button
            type="button"
            className={`button ${filterUrgency === "routine" ? "" : "ghost"}`}
            style={{ minHeight: "36px", padding: "4px 14px", fontSize: "12px" }}
            onClick={() => setFilterUrgency("routine")}
          >
            📋 Routine Follow-ups
          </button>
        </div>

        {/* Escalation Queue */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "40px" }}>
          {filtered.map((esc) => (
            <div
              key={esc.id}
              className="card"
              style={{
                borderLeft: esc.urgency.includes("urgent") ? "6px solid #ef4444" : "6px solid var(--forest)"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "10px" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                    <span
                      style={{
                        padding: "2px 8px",
                        borderRadius: "10px",
                        fontSize: "11px",
                        fontWeight: "bold",
                        background: esc.urgency.includes("urgent") ? "#fee2e2" : "var(--sage)",
                        color: esc.urgency.includes("urgent") ? "#b91c1c" : "var(--forest)"
                      }}
                    >
                      {esc.urgency.toUpperCase()}
                    </span>
                    <span style={{ fontSize: "11px", color: "var(--slate)" }}>
                      Ticket #{esc.id} · Created {new Date(esc.createdAt).toLocaleTimeString()}
                    </span>
                  </div>

                  <h3 style={{ fontSize: "18px", margin: "4px 0" }}>
                    {esc.patientName} ({esc.age} yrs, Village {esc.village})
                  </h3>
                  <p style={{ margin: "4px 0 10px", fontSize: "13.5px", color: "var(--ink)", fontWeight: "500" }}>
                    Clinical Reason: {esc.reason}
                  </p>
                </div>

                <div style={{ textAlign: "right" }}>
                  <span
                    style={{
                      fontSize: "11.5px",
                      padding: "4px 10px",
                      borderRadius: "12px",
                      background: esc.status === "resolved" ? "#dcfce7" : "#fef3c7",
                      color: esc.status === "resolved" ? "#166534" : "#92400e",
                      fontWeight: "bold"
                    }}
                  >
                    {esc.status === "resolved" ? "✓ Resolved" : "⏳ Pending Review"}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", borderTop: "1px solid var(--line)", paddingTop: "12px", marginTop: "10px" }}>
                <button
                  type="button"
                  className="button"
                  style={{ minHeight: "36px", fontSize: "12px", padding: "6px 14px" }}
                  onClick={() => handleResolve(esc.id, "Tele-call initiated & prescription sent via SMS")}
                >
                  📞 Call Patient / ASHA
                </button>
                <button
                  type="button"
                  className="button ghost"
                  style={{ minHeight: "36px", fontSize: "12px", padding: "6px 14px" }}
                  onClick={() => handleResolve(esc.id, "Referral approved for Bishunpur CHC OPD")}
                >
                  ✓ Approve CHC Referral
                </button>
                {esc.urgency.includes("urgent") && (
                  <button
                    type="button"
                    className="button"
                    style={{ minHeight: "36px", fontSize: "12px", padding: "6px 14px", background: "#dc2626" }}
                    onClick={() => handleResolve(esc.id, "Emergency 108 Ambulance dispatched to village")}
                  >
                    🚨 Dispatch 108 Ambulance
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>
      <SetuFooter />
    </>
  );
}
