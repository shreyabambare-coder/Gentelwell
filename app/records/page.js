"use client";

import { useState, useEffect } from "react";
import SetuHeader from "../../components/SetuHeader";
import SetuFooter from "../../components/SetuFooter";
import { getHousehold, getAuditLog, logAudit } from "../../lib/offlineSync";

export default function RecordsPage() {
  const [household, setHousehold] = useState(null);
  const [activePatientIndex, setActivePatientIndex] = useState(0);
  const [showAuditModal, setShowAuditModal] = useState(false);
  const [auditLogs, setAuditLogs] = useState([]);
  const [newObsValue, setNewObsValue] = useState("");
  const [newObsCode, setNewObsCode] = useState("Hemoglobin (Hb)");
  const [noteAdded, setNoteAdded] = useState(false);

  useEffect(() => {
    setHousehold(getHousehold());
    setAuditLogs(getAuditLog());
  }, []);

  const patient = household?.members?.[activePatientIndex] || {
    name: "Pooja Devi",
    age: 26,
    gender: "female",
    bloodGroup: "B+",
    abhaId: "91-4432-8819-2041",
    observations: [],
    conditions: [],
    carePlan: []
  };

  const handleAddVitals = (e) => {
    e.preventDefault();
    if (!newObsValue.trim()) return;

    const newObs = {
      date: new Date().toISOString().slice(0, 10),
      code: newObsCode,
      value: newObsValue,
      unit: newObsCode.includes("Hemoglobin") ? "g/dL" : "mmHg",
      status: "recorded_by_chw"
    };

    const updated = { ...household };
    updated.members[activePatientIndex].observations.unshift(newObs);
    setHousehold(updated);
    setNewObsValue("");
    setNoteAdded(true);

    logAudit({
      action: "FHIR_OBSERVATION_CREATE",
      actor: "CHW Kanti Devi (ASHA)",
      detail: `Recorded ${newObsCode} = ${newObsValue} for patient ${patient.name}`
    });
    setAuditLogs(getAuditLog());
    setTimeout(() => setNoteAdded(false), 3000);
  };

  return (
    <>
      <SetuHeader />
      <main className="container" style={{ padding: "40px 0 80px" }}>
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <p className="eyebrow">LONGITUDINAL FHIR R4-COMPATIBLE RECORDS (§3.8)</p>
          <h1>Comprehensive Patient Health Timeline</h1>
          <p style={{ maxWidth: "660px", margin: "8px auto 0" }}>
            Persists across CHW visits, clinics, and district hospitals. Fully offline creation 
            with purpose-specific DPDP consent verification and immutable provenance audit trails.
          </p>
        </div>

        {/* Family Member Switcher */}
        <div style={{ display: "flex", gap: "10px", justifyContent: "center", flexWrap: "wrap", marginBottom: "28px" }}>
          {household?.members?.map((m, idx) => (
            <button
              key={m.id}
              type="button"
              className={`button ${activePatientIndex === idx ? "" : "ghost"}`}
              style={{ minHeight: "42px", fontSize: "13px" }}
              onClick={() => setActivePatientIndex(idx)}
            >
              👤 {m.name} ({m.relationship})
            </button>
          ))}
          <button
            type="button"
            className="button clay"
            style={{ minHeight: "42px", fontSize: "13px" }}
            onClick={() => setShowAuditModal(true)}
          >
            🔒 View Audit Trail ({auditLogs.length})
          </button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "0.9fr 1.1fr", gap: "26px", maxWidth: "1020px", margin: "0 auto" }}>
          {/* Patient Card & ABHA Linkage */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div className="card">
              <span className="stat-tag">FHIR R4 Patient Resource</span>
              <div style={{ display: "flex", alignItems: "center", gap: "14px", margin: "14px 0" }}>
                <div
                  style={{
                    width: "56px",
                    height: "56px",
                    borderRadius: "16px",
                    background: "var(--sage2)",
                    display: "grid",
                    placeItems: "center",
                    fontSize: "26px"
                  }}
                >
                  {patient.gender === "female" ? "👩" : "👨"}
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: "20px" }}>{patient.name}</h3>
                  <div style={{ color: "var(--slate)", fontSize: "12.5px", marginTop: "2px" }}>
                    {patient.age} yrs · {patient.gender.toUpperCase()} · Blood: <b>{patient.bloodGroup || "O+"}</b>
                  </div>
                </div>
              </div>

              <div style={{ background: "var(--sage)", padding: "12px", borderRadius: "10px", fontSize: "12.5px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                  <span>Ayushman Bharat ID (ABHA):</span>
                  <b style={{ fontFamily: "var(--font-mono)", color: "var(--forest)" }}>{patient.abhaId}</b>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                  <span>Assigned Sahiya/ASHA:</span>
                  <b>{patient.primaryCHW || "Kanti Devi (ASHA)"}</b>
                </div>
                {patient.pregnant && (
                  <div style={{ display: "flex", justifyContent: "space-between", color: "#be185d", fontWeight: "bold" }}>
                    <span>Pregnancy Status:</span>
                    <span>22 Weeks (ANC-2 Completed)</span>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Offline CHW Vitals Entry Tool (§3.8) */}
            <div className="card">
              <span className="stat-tag" style={{ background: "#fef3c7", color: "#92400e" }}>
                CHW Offline Quick Entry
              </span>
              <h4 style={{ margin: "6px 0 10px", fontSize: "15px" }}>Record New Clinical Observation</h4>
              {noteAdded && (
                <div style={{ background: "#ecfdf5", color: "#065f46", padding: "8px 12px", borderRadius: "8px", fontSize: "12px", marginBottom: "10px" }}>
                  ✓ Observation saved locally and queued for delta sync!
                </div>
              )}
              <form onSubmit={handleAddVitals}>
                <div style={{ marginBottom: "10px" }}>
                  <select
                    value={newObsCode}
                    onChange={(e) => setNewObsCode(e.target.value)}
                    style={{ width: "100%", padding: "8px", borderRadius: "8px", border: "1px solid var(--line)" }}
                  >
                    <option value="Hemoglobin (Hb)">Hemoglobin (Hb) - g/dL</option>
                    <option value="Blood Pressure">Blood Pressure - mmHg</option>
                    <option value="Fetal Heart Rate">Fetal Heart Rate - bpm</option>
                    <option value="Blood Sugar Fasting">Blood Sugar (RDT) - mg/dL</option>
                  </select>
                </div>
                <div style={{ display: "flex", gap: "8px" }}>
                  <input
                    type="text"
                    value={newObsValue}
                    onChange={(e) => setNewObsValue(e.target.value)}
                    placeholder="Enter value (e.g. 10.4)"
                    style={{ flex: 1, padding: "8px 12px", borderRadius: "8px", border: "1px solid var(--line)" }}
                  />
                  <button type="submit" className="button" style={{ minHeight: "38px", fontSize: "12px", padding: "6px 14px" }}>
                    + Record
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Timeline: Conditions, Observations & CarePlan */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {/* Active Conditions */}
            <div className="card">
              <h4 style={{ fontSize: "15px", marginBottom: "10px" }}>Active Health Conditions (FHIR Condition)</h4>
              {patient.conditions && patient.conditions.length > 0 ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {patient.conditions.map((cond, i) => (
                    <div
                      key={i}
                      style={{
                        background: "#fffbeb",
                        border: "1px solid #fef3c7",
                        padding: "10px 14px",
                        borderRadius: "10px",
                        fontSize: "12.5px"
                      }}
                    >
                      <b style={{ color: "#92400e" }}>{cond.display}</b>
                      <div style={{ color: "#b45309", fontSize: "11px", marginTop: "2px" }}>
                        ICD-10: {cond.code} · Diagnosed: {cond.recordedDate} by Dr. Ananya Roy
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ fontSize: "12.5px", color: "var(--slate)", margin: 0 }}>
                  No active chronic or acute conditions recorded.
                </p>
              )}
            </div>

            {/* Longitudinal Vitals & Observations */}
            <div className="card">
              <h4 style={{ fontSize: "15px", marginBottom: "10px" }}>Clinical Observations Timeline</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {patient.observations?.map((obs, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "10px 12px",
                      background: "var(--sage)",
                      borderRadius: "10px",
                      fontSize: "12.5px"
                    }}
                  >
                    <div>
                      <b>{obs.code}</b>
                      <small style={{ display: "block", color: "var(--slate)", fontSize: "11px" }}>
                        Recorded on {obs.date}
                      </small>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <span style={{ fontSize: "15px", fontWeight: "bold", color: "var(--forest)" }}>
                        {obs.value} {obs.unit}
                      </span>
                      <small style={{ display: "block", fontSize: "10px", color: "var(--slate)" }}>
                        {obs.status}
                      </small>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Active CarePlan */}
            <div className="card">
              <h4 style={{ fontSize: "15px", marginBottom: "10px" }}>Personal Care Plan (FHIR CarePlan)</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {patient.carePlan?.map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: "#f0fdf4",
                      border: "1px solid #bbf7d0",
                      padding: "10px 14px",
                      borderRadius: "10px",
                      fontSize: "12.5px"
                    }}
                  >
                    <b style={{ color: "#166534" }}>{item.activity}</b>
                    <div style={{ color: "#15803d", fontSize: "11px", marginTop: "2px" }}>
                      {item.frequency || `Due: ${item.dueDate}`}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Audit Trail Modal (§10) */}
        {showAuditModal && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(18, 56, 50, 0.6)",
              backdropFilter: "blur(3px)",
              zIndex: 100,
              display: "grid",
              placeItems: "center",
              padding: "20px"
            }}
            onClick={() => setShowAuditModal(false)}
          >
            <div
              style={{
                background: "#fff",
                borderRadius: "20px",
                maxWidth: "680px",
                width: "100%",
                padding: "24px",
                maxHeight: "85vh",
                overflowY: "auto"
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <h3 style={{ margin: 0, fontSize: "18px" }}>🔒 Immutable Provenance Audit Trail (§10)</h3>
                <button
                  type="button"
                  style={{ background: "none", border: 0, fontSize: "18px", cursor: "pointer" }}
                  onClick={() => setShowAuditModal(false)}
                >
                  ✕
                </button>
              </div>
              <p style={{ fontSize: "12.5px", color: "var(--slate)", margin: "0 0 16px" }}>
                Every clinical read, write, and sync mutation is logged with timestamp, actor, and purpose. 
                Compliant with India's DPDP Act 2023.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {auditLogs.map((log) => (
                  <div
                    key={log.id}
                    style={{
                      background: "var(--sage)",
                      border: "1px solid var(--line)",
                      padding: "10px 14px",
                      borderRadius: "10px",
                      fontSize: "12px"
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", color: "var(--forest)", fontWeight: "bold" }}>
                      <span>{log.action}</span>
                      <small style={{ color: "var(--slate)" }}>{new Date(log.timestamp).toLocaleTimeString()}</small>
                    </div>
                    <div style={{ color: "var(--slate)", margin: "3px 0" }}>{log.detail}</div>
                    <small style={{ color: "var(--slate-2)", fontStyle: "italic" }}>Actor: {log.actor}</small>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
      <SetuFooter />
    </>
  );
}
