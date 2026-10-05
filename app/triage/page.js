"use client";

import { useState, useEffect } from "react";
import SetuHeader from "../../components/SetuHeader";
import SetuFooter from "../../components/SetuFooter";
import { TRIAGE_RULES } from "../../lib/setuData";
import { queueMutation, logAudit } from "../../lib/offlineSync";

export default function TriagePage() {
  const [selectedRuleId, setSelectedRuleId] = useState(null);
  const [customInput, setCustomInput] = useState("");
  const [triageResult, setTriageResult] = useState(null);
  const [isEscalating, setIsEscalating] = useState(false);
  const [escalated, setEscalated] = useState(false);
  const [lang, setLang] = useState("en");

  // Check query params if ?mode=emergency was clicked from home
  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get("mode") === "emergency") {
        handleRuleSelect("obstetric_hemorrhage");
      }
    }
  }, []);

  const handleRuleSelect = (ruleId) => {
    const rule = TRIAGE_RULES.find((r) => r.id === ruleId);
    if (!rule) return;

    setSelectedRuleId(ruleId);
    setTriageResult(rule);
    setEscalated(false);

    logAudit({
      action: "TRIAGE_CHECK",
      actor: "Patient / CHW Client",
      detail: `Evaluated symptom triage: ${rule.condition} -> Output: ${rule.outputLevel}`
    });
  };

  const handleFreeTextSubmit = (e) => {
    e.preventDefault();
    if (!customInput.trim()) return;

    const lower = customInput.toLowerCase();
    // Rule-based matching with hard-coded red-flags running first (§9, §3.5)
    let match = TRIAGE_RULES.find((r) =>
      r.triggers.some((trigger) => lower.includes(trigger.toLowerCase()))
    );

    // Fallback if below confidence threshold: default to "suggested clinic visit" (§3.5, §9)
    if (!match) {
      match = {
        id: "generic_uncertain",
        category: "Clinical Evaluation Needed",
        redFlag: false,
        condition: `Reported symptoms: "${customInput}"`,
        outputLevel: "suggested_clinic_visit",
        plainLanguageReason:
          "Your reported symptoms require physical examination by a trained health worker or doctor. Because AI triage is advisory, we never guess.",
        plainLanguageReasonHi:
          "आपके लक्षणों की जांच किसी प्रशिक्षित स्वास्थ्य कार्यकर्ता या डॉक्टर द्वारा की जानी चाहिए।",
        recommendedAction:
          "Visit KEM Hospital Mumbai, Palghar District Civil Hospital, or your nearest Maharashtra PHC/CHC. A doctor can check your vitals and give tailored advice.",
        recommendedActionHi:
          "केईएम अस्पताल, पालघर सिविल अस्पताल या अपने नजदीकी प्राथमिक स्वास्थ्य केंद्र पर जाकर जांच कराएं।",
        escalateToClinician: true
      };
    }

    setTriageResult(match);
    setSelectedRuleId(match.id);
    setEscalated(false);
  };

  const handleEscalateToDoctor = () => {
    if (!triageResult) return;
    setIsEscalating(true);

    // Create an escalation ticket via offline mutation queue (§3.5, §8)
    const newEscalation = {
      id: "esc-" + Date.now(),
      patientName: "Pooja Devi",
      village: "Banari",
      age: 26,
      reason: `Triage Escalation: ${triageResult.condition} (${triageResult.outputLevel})`,
      urgency: triageResult.redFlag ? "urgent_emergency" : "routine",
      status: "pending_review",
      createdAt: new Date().toISOString(),
      assignedTo: "Dr. Ananya Roy (Gyn/Obs)"
    };

    queueMutation({
      entityType: "Escalation",
      action: "CREATE",
      payload: newEscalation,
      purposeOfUse: "triage"
    });

    setTimeout(() => {
      setIsEscalating(false);
      setEscalated(true);
    }, 600);
  };

  const speakAdvice = (text) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang === "hi" ? "hi-IN" : "en-US";
    window.speechSynthesis.speak(u);
  };

  return (
    <>
      <SetuHeader />
      <main className="container" style={{ padding: "40px 0 80px" }}>
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div className="voice-action-pill" onClick={() => speakAdvice("Setu AI Symptom Checker. Rule-based advisory triage. Never gives a diagnosis.")}>
            <span>🔊</span>
            <span>Listen in Voice (आवाज में सुनें)</span>
          </div>
          <p className="eyebrow">RULE-BASED DECISION SUPPORT (§3.5, §9)</p>
          <h1>AI Symptom Checker & Advisory Triage</h1>
          <p style={{ maxWidth: "660px", margin: "8px auto 0" }}>
            <b>Advisory Only — Never outputs a diagnosis.</b> Evaluates symptoms against hardcoded clinical 
            safety rules and directs you to self-care, a clinic visit, or immediate emergency care.
          </p>
        </div>

        {/* Quick Common Rural Symptoms Selector */}
        <div style={{ maxWidth: "900px", margin: "0 auto 30px" }}>
          <h3 style={{ fontSize: "16px", marginBottom: "12px", color: "var(--slate)" }}>
            Select Common Symptoms or Type Below:
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "10px" }}>
            {TRIAGE_RULES.map((rule) => (
              <button
                key={rule.id}
                type="button"
                onClick={() => handleRuleSelect(rule.id)}
                style={{
                  background: selectedRuleId === rule.id ? "var(--sage2)" : "#fff",
                  border: selectedRuleId === rule.id
                    ? rule.redFlag ? "2px solid #ef4444" : "2px solid var(--forest)"
                    : rule.redFlag ? "1px solid #fecaca" : "1px solid var(--line)",
                  borderRadius: "12px",
                  padding: "12px",
                  textAlign: "left",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px"
                }}
              >
                <span style={{ fontSize: "20px" }}>
                  {rule.redFlag ? "🚨" : rule.outputLevel === "self_care_guidance" ? "🌸" : "🩺"}
                </span>
                <div>
                  <b style={{ display: "block", fontSize: "13px", color: rule.redFlag ? "#b91c1c" : "var(--ink)" }}>
                    {rule.condition}
                  </b>
                  <small style={{ fontSize: "11px", color: "var(--slate)" }}>{rule.category}</small>
                </div>
              </button>
            ))}
          </div>

          {/* Free Text Input */}
          <form onSubmit={handleFreeTextSubmit} style={{ display: "flex", gap: "10px", marginTop: "16px" }}>
            <input
              type="text"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              placeholder="Or describe symptoms (e.g. fever with chills, knee swelling, morning nausea)..."
              style={{
                flex: 1,
                padding: "12px 16px",
                borderRadius: "12px",
                border: "1.5px solid var(--line)",
                fontSize: "14px"
              }}
            />
            <button type="submit" className="button" style={{ minWidth: "140px" }}>
              Evaluate →
            </button>
          </form>
        </div>

        {/* Triage Decision Card */}
        {triageResult && (
          <div
            style={{
              maxWidth: "800px",
              margin: "0 auto",
              background: triageResult.redFlag ? "#fef2f2" : "#ffffff",
              border: triageResult.redFlag ? "2px solid #ef4444" : "1.5px solid var(--line)",
              borderRadius: "20px",
              padding: "28px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.06)"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px" }}>
              <div>
                <span
                  style={{
                    display: "inline-block",
                    padding: "4px 12px",
                    borderRadius: "20px",
                    fontSize: "12px",
                    fontWeight: "700",
                    background: triageResult.redFlag
                      ? "#fee2e2"
                      : triageResult.outputLevel === "suggested_clinic_visit"
                      ? "#faeede"
                      : "var(--sage)",
                    color: triageResult.redFlag
                      ? "#b91c1c"
                      : triageResult.outputLevel === "suggested_clinic_visit"
                      ? "var(--clay)"
                      : "var(--forest)"
                  }}
                >
                  {triageResult.redFlag
                    ? "🚨 RED FLAG: IMMEDIATE ESCALATION"
                    : triageResult.outputLevel === "suggested_clinic_visit"
                    ? "🏥 SUGGESTED CLINIC VISIT"
                    : "🌸 SELF-CARE GUIDANCE"}
                </span>
                <h2 style={{ fontSize: "24px", margin: "10px 0 4px" }}>
                  {triageResult.condition}
                </h2>
                <small style={{ color: "var(--slate)" }}>Category: {triageResult.category}</small>
              </div>

              <button
                type="button"
                className="button ghost"
                style={{ minHeight: "38px", fontSize: "12px" }}
                onClick={() =>
                  speakAdvice(
                    lang === "hi"
                      ? `${triageResult.plainLanguageReasonHi} ${triageResult.recommendedActionHi}`
                      : `${triageResult.plainLanguageReason} ${triageResult.recommendedAction}`
                  )
                }
              >
                🔊 Read Aloud
              </button>
            </div>

            <hr style={{ border: 0, borderTop: "1px solid var(--line)", margin: "18px 0" }} />

            {/* Plain Language Reasoning (§3.5, §9) */}
            <div style={{ marginBottom: "18px" }}>
              <h4 style={{ fontSize: "14px", textTransform: "uppercase", letterSpacing: "1px", color: "var(--slate)" }}>
                Why This Recommendation (पारदर्शी कारण):
              </h4>
              <p style={{ fontSize: "15px", color: "var(--ink)", lineHeight: "1.6", marginTop: "6px" }}>
                {lang === "hi" ? triageResult.plainLanguageReasonHi : triageResult.plainLanguageReason}
              </p>
            </div>

            {/* Recommended Action */}
            <div
              style={{
                background: triageResult.redFlag ? "#fee2e2" : "var(--sage)",
                padding: "16px",
                borderRadius: "14px",
                marginBottom: "20px"
              }}
            >
              <b style={{ display: "block", fontSize: "14px", marginBottom: "4px", color: triageResult.redFlag ? "#991b1b" : "var(--forest)" }}>
                Recommended Next Step:
              </b>
              <div style={{ fontSize: "14.5px", color: triageResult.redFlag ? "#7f1d1d" : "var(--ink)" }}>
                {lang === "hi" ? triageResult.recommendedActionHi : triageResult.recommendedAction}
              </div>
            </div>

            {/* Actions: Emergency Calling or Clinician Escalation Ticket */}
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center" }}>
              {triageResult.redFlag ? (
                <>
                  <a href="tel:112" className="button" style={{ background: "#dc2626" }}>
                    📞 Call 112 (National Ambulance)
                  </a>
                  <a href="tel:108" className="button" style={{ background: "#b91c1c" }}>
                    📞 Call 108 (Jharkhand State EMS)
                  </a>
                </>
              ) : null}

              {triageResult.escalateToClinician && !escalated && (
                <button
                  type="button"
                  className="button"
                  onClick={handleEscalateToDoctor}
                  disabled={isEscalating}
                >
                  {isEscalating ? "Creating Ticket..." : "Escalate to Dr. Ananya Roy (CHC) →"}
                </button>
              )}

              {escalated && (
                <div style={{ background: "#d1fae5", color: "#065f46", padding: "10px 16px", borderRadius: "10px", fontSize: "13px", fontWeight: "bold" }}>
                  ✓ Escalation ticket created for Dr. Ananya Roy! Target response time: &lt;24 hrs.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Safety Disclaimer (§9) */}
        <div style={{ maxWidth: "800px", margin: "30px auto 0", textAlign: "center", fontSize: "12px", color: "var(--slate)" }}>
          ⚠️ <b>Clinical Safety Policy:</b> This system is strictly advisory and does not provide medical diagnoses. 
          Hardcoded red-flag rules immediately route to emergency helplines. All triage logic changes are versioned 
          with clinical board oversight (Target false-negative rate: 0.0%).
        </div>
      </main>
      <SetuFooter />
    </>
  );
}
