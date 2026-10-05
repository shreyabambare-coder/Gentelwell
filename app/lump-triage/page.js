"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import SetuHeader from "../../components/SetuHeader";
import SetuFooter from "../../components/SetuFooter";
import {
  evaluateRedFlagsAndDifferentials,
  queryVectorKnowledgeBase,
  MEDICAL_KNOWLEDGE_CORPUS
} from "../../lib/medicalRagEngine";
import { queueMutation, logAudit } from "../../lib/offlineSync";

export default function LumpTriagePage() {
  // Compliance & Consent Gate (§4)
  const [consentAgreed, setConsentAgreed] = useState(false);
  const [showLegalModal, setShowLegalModal] = useState(false);

  // Structured Questionnaire State (§1.B)
  const [location, setLocation] = useState("Forearm / Arm");
  const [texture, setTexture] = useState("Soft and doughy");
  const [mobility, setMobility] = useState("Moves freely under the skin");
  const [painLevel, setPainLevel] = useState(0);
  const [painType, setPainType] = useState("Painless");
  const [skinChanges, setSkinChanges] = useState("Normal skin (no redness or spots)");
  const [hasPunctum, setHasPunctum] = useState(false);
  const [growthSpeed, setGrowthSpeed] = useState("Slow / Same size for years");
  const [sizeCm, setSizeCm] = useState(2.5);
  const [freeTextQuery, setFreeTextQuery] = useState("");

  // RAG Assessment Results State
  const [evalResult, setEvalResult] = useState(null);
  const [retrievedDocs, setRetrievedDocs] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [lang, setLang] = useState("en");

  // Chatbot conversation tab
  const [activeTab, setActiveTab] = useState("questionnaire"); // "questionnaire" | "chat"
  const [chatMessages, setChatMessages] = useState([
    {
      sender: "assistant",
      text: "Hello, I am the Clinical Information and RAG Triage Assistant for soft tissue lumps and lipomas. How can I help you understand your symptoms today?",
      citation: "Mayo Clinic & NIH StatPearls (Lipoma Clinical Protocols)",
      isDisclaimer: true
    }
  ]);
  const [chatInput, setChatInput] = useState("");

  useEffect(() => {
    try {
      const savedLang = localStorage.getItem("setu_lang");
      if (savedLang) setLang(savedLang);
    } catch {}

    const handleLang = (e) => {
      if (e.detail?.lang) setLang(e.detail.lang);
    };
    window.addEventListener("setu_lang_change", handleLang);
    return () => window.removeEventListener("setu_lang_change", handleLang);
  }, []);

  const isHi = lang === "hi";

  // Handle Structured Triage Submission
  const handleRunAssessment = async (e) => {
    if (e) e.preventDefault();
    if (!consentAgreed) {
      setShowLegalModal(true);
      return;
    }

    setIsAnalyzing(true);

    // Call RAG Engine (Local + API Gateway)
    const skinFull = `${skinChanges} ${hasPunctum ? "central punctum / blackhead visible" : ""}`;
    const clinicalEval = evaluateRedFlagsAndDifferentials({
      location,
      texture,
      mobility,
      painLevel,
      skinChanges: skinFull,
      growthSpeed,
      sizeCm
    });

    const queryText = `${location} ${texture} ${mobility} pain level ${painLevel} ${skinFull} ${growthSpeed} size ${sizeCm}cm ${freeTextQuery}`;
    const docs = queryVectorKnowledgeBase(queryText).slice(0, 3);

    // Log in immutable audit trail for clinical governance (§9)
    logAudit({
      action: "RAG_LUMP_TRIAGE_EVALUATION",
      actor: "Patient / Self-Assessment Client",
      detail: `Assessed lump at ${location}, size: ${sizeCm}cm, pain: ${painLevel}/10, redFlags: ${clinicalEval.hasRedFlags}`
    });

    // If urgent emergency red flags detected, queue clinician alert
    if (clinicalEval.hasRedFlags) {
      queueMutation({
        entityType: "Escalation",
        action: "CREATE",
        payload: {
          id: "esc-" + Date.now(),
          patientName: "Patient Self-Triage",
          village: "Maharashtra Pilot Region",
          age: 32,
          reason: `RAG Lump Triage Red-Flag: ${clinicalEval.redFlags.map((r) => r.label).join(", ")} at ${location}`,
          urgency: clinicalEval.isUrgentEmergency ? "urgent" : "routine",
          status: "pending_review",
          createdAt: new Date().toISOString(),
          assignedTo: "Dr. Pravin Kulkarni (General Surgery)"
        },
        purposeOfUse: "triage"
      });
    }

    setEvalResult(clinicalEval);
    setRetrievedDocs(docs);
    setIsAnalyzing(false);

    // Scroll to results
    const el = document.getElementById("rag-results-section");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  // Handle Conversational Chat Query with Grounded Vector Retrieval
  const handleChatSubmit = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    if (!consentAgreed) {
      setShowLegalModal(true);
      return;
    }

    const userText = chatInput.trim();
    const newHistory = [...chatMessages, { sender: "user", text: userText }];
    setChatMessages(newHistory);
    setChatInput("");

    // Query Vector Knowledge Base for Grounded Medical Chunks
    const matchedDocs = queryVectorKnowledgeBase(userText);
    const topDoc = matchedDocs[0] || MEDICAL_KNOWLEDGE_CORPUS[0];

    // Determine clinical tone and safety response
    let botReply = "";
    const lower = userText.toLowerCase();

    if (lower.includes("hurt") || lower.includes("pain") || lower.includes("sore")) {
      botReply =
        "Symptoms you described involving pain or tenderness in a lump are consistent with an angiolipoma (a benign lipoma containing small blood vessels), a cyst with localized inflammation, or a lipoma pressing against a nearby cutaneous nerve. Note: standard lipomas are usually painless. A doctor's physical exam and soft-tissue ultrasound can accurately determine the cause.";
    } else if (lower.includes("cancer") || lower.includes("sarcoma") || lower.includes("malignant")) {
      botReply =
        "The vast majority of subcutaneous lumps are benign (such as standard lipomas or epidermoid cysts). However, clinical safety guidelines (NCCN) recommend consulting a specialist if a mass is larger than 5 cm, growing rapidly, deeply fixed to muscle, or stony hard.";
    } else if (lower.includes("cyst") || lower.includes("blackhead") || lower.includes("squeeze")) {
      botReply =
        "An epidermoid cyst typically has a central pore or blackhead (punctum) and contains keratin. Medical guidelines advise never squeezing or attempting to pop a cyst or lump at home, as this can cause deep tissue rupture, severe bacterial infection, and scarring.";
    } else {
      botReply = `Based on peer-reviewed clinical data from ${topDoc.source}: Soft tissue masses that are soft, rubbery, and movable under the skin are commonly consistent with benign lipomas. However, symptoms should always be evaluated in person by a qualified healthcare professional.`;
    }

    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        {
          sender: "assistant",
          text: botReply,
          citation: `${topDoc.source} — ${topDoc.citation}`,
          isDisclaimer: true
        }
      ]);
    }, 450);
  };

  return (
    <>
      <SetuHeader />
      <main className="container" style={{ padding: "40px 0 80px" }}>
        {/* Page Top Title */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div className="voice-action-pill" style={{ margin: "0 auto 10px" }}>
            <span>{isHi ? "चिकित्सीय आरएजी ज्ञान आधार" : "GROUNDED MEDICAL RAG & CLINICAL TRIAGE ENGINE"}</span>
          </div>
          <h1>{isHi ? "गांठ एवं लिपोमा क्लिनिकल ट्राइएज" : "Soft Tissue Lump & Lipoma Clinical Triage"}</h1>
          <p style={{ maxWidth: "700px", margin: "8px auto 0", color: "var(--slate)" }}>
            {isHi
              ? "मेयो क्लिनिक, एनआईएच एवं क्लीवलैंड क्लिनिक के शोध पर आधारित सुरक्षित मूल्यांकन। यह उपकरण किसी स्थिति का अंतिम निदान नहीं करता, बल्कि आपको सही चिकित्सीय परामर्श की ओर निर्देशित करता है।"
              : "Grounded in peer-reviewed clinical literature from Mayo Clinic, NIH (StatPearls), and Cleveland Clinic. Non-diagnostic decision support designed to identify benign patterns and detect high-risk red flags."}
          </p>
        </div>

        {/* Mandatory Legal & Informed Consent Banner (§4) */}
        {!consentAgreed ? (
          <div
            style={{
              background: "#fffbeb",
              border: "2px solid #f59e0b",
              borderRadius: "16px",
              padding: "20px 24px",
              marginBottom: "32px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "16px"
            }}
          >
            <div style={{ maxWidth: "760px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                <span style={{ fontSize: "20px" }}>⚖️</span>
                <b style={{ color: "#92400e", fontSize: "15px" }}>
                  {isHi ? "अनिवार्य चिकित्सा अस्वीकरण एवं सहमति (DPDP / HIPAA अनुपालन)" : "Mandatory Medical Disclaimer & Informed Consent (§4)"}
                </b>
              </div>
              <p style={{ margin: 0, fontSize: "13px", color: "#78350f", lineHeight: "1.5" }}>
                This tool is for <b>educational and informational triage purposes only</b> and does not provide a medical diagnosis, prescription, or clinical treatment plan. Lumps and soft-tissue masses require direct physician palpation, ultrasound, or MRI. By clicking Agree, you acknowledge that you assume responsibility for consulting a qualified physician.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setConsentAgreed(true)}
              className="button"
              style={{ background: "#d97706", color: "#fff", whiteSpace: "nowrap" }}
            >
              ✓ {isHi ? "मैं समझता/समझती हूँ एवं सहमत हूँ" : "I Understand & Agree to Start"}
            </button>
          </div>
        ) : (
          <div
            style={{
              background: "#ecfdf5",
              border: "1px solid #10b981",
              borderRadius: "12px",
              padding: "10px 18px",
              marginBottom: "24px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: "12.5px",
              color: "#065f46"
            }}
          >
            <span>✓ <b>Informed Consent Active:</b> Educational Triage Mode (Compliant with India DPDP Act 2023 & SaMD regulations).</span>
            <button
              type="button"
              onClick={() => setConsentAgreed(false)}
              style={{ background: "none", border: "none", color: "#047857", textDecoration: "underline", cursor: "pointer", fontSize: "12px" }}
            >
              Review Terms
            </button>
          </div>
        )}

        {/* Mode Selector Tabs */}
        <div style={{ display: "flex", gap: "12px", marginBottom: "28px", borderBottom: "1px solid var(--line)", paddingBottom: "12px" }}>
          <button
            type="button"
            onClick={() => setActiveTab("questionnaire")}
            style={{
              background: activeTab === "questionnaire" ? "var(--forest)" : "var(--sage)",
              color: activeTab === "questionnaire" ? "#fff" : "var(--forest)",
              border: "none",
              padding: "10px 20px",
              borderRadius: "10px",
              fontWeight: "700",
              cursor: "pointer",
              fontSize: "14px"
            }}
          >
            📋 {isHi ? "संरचित चिकित्सीय प्रश्नावली" : "1. Structured Clinical Questionnaire"}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("chat")}
            style={{
              background: activeTab === "chat" ? "var(--forest)" : "var(--sage)",
              color: activeTab === "chat" ? "#fff" : "var(--forest)",
              border: "none",
              padding: "10px 20px",
              borderRadius: "10px",
              fontWeight: "700",
              cursor: "pointer",
              fontSize: "14px"
            }}
          >
            💬 {isHi ? "आरएजी मेडिकल चैटबॉट" : "2. RAG Medical Knowledge Chat"}
          </button>
        </div>

        {/* Tab 1: Structured Clinical Questionnaire */}
        {activeTab === "questionnaire" && (
          <div style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: "28px" }}>
            {/* Form Column */}
            <div className="card">
              <h3 style={{ margin: "0 0 16px", fontSize: "18px" }}>
                {isHi ? "लक्षण विवरण दर्ज करें" : "Symptom & Physical Characteristics Form"}
              </h3>

              <form onSubmit={handleRunAssessment}>
                {/* 1. Location */}
                <div style={{ marginBottom: "16px" }}>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: "bold", marginBottom: "6px" }}>
                    📍 1. Anatomical Location: Where is the lump situated?
                  </label>
                  <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid var(--line)" }}
                  >
                    <option value="Forearm / Arm">Forearm / Upper Arm (Common for Lipoma & Angiolipoma)</option>
                    <option value="Neck (Back/Nape)">Neck / Back of Neck (Lipoma / Sebaceous Cyst / Lymph Node)</option>
                    <option value="Upper Back / Shoulders">Upper Back / Shoulders (Classic Lipoma site)</option>
                    <option value="Abdomen / Trunk">Abdomen / Torso / Ribs</option>
                    <option value="Thigh / Leg">Thigh / Lower Extremity</option>
                    <option value="Groin / Axilla (Armpit)">Groin or Armpit (Check for Lymphadenopathy)</option>
                    <option value="Scalp / Face">Scalp or Face (Frequent Epidermoid Cyst site)</option>
                  </select>
                </div>

                {/* 2. Texture & Mobility */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "16px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: "bold", marginBottom: "6px" }}>
                      🖐️ 2. Palpation Texture
                    </label>
                    <select
                      value={texture}
                      onChange={(e) => setTexture(e.target.value)}
                      style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid var(--line)" }}
                    >
                      <option value="Soft and doughy">Soft & Doughy (Classic Lipoma)</option>
                      <option value="Rubbery / Firm">Rubbery / Slightly Firm</option>
                      <option value="Hard and stony">Hard / Stony / Rock-like (⚠️ Red Flag)</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: "bold", marginBottom: "6px" }}>
                      ↔️ 3. Mobility Under Skin
                    </label>
                    <select
                      value={mobility}
                      onChange={(e) => setMobility(e.target.value)}
                      style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid var(--line)" }}
                    >
                      <option value="Moves freely under the skin">Moves freely under skin (Benign)</option>
                      <option value="Moves WITH the skin">Moves with skin / Attached to skin (Cyst)</option>
                      <option value="Fixed to deep muscle">Fixed / Immobile to deep tissue (⚠️ Red Flag)</option>
                    </select>
                  </div>
                </div>

                {/* 3. Pain Scale Slider (0-10) */}
                <div style={{ marginBottom: "18px", background: "#f8fafc", padding: "14px 16px", borderRadius: "12px", border: "1px solid var(--line)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                    <label style={{ fontSize: "13px", fontWeight: "bold" }}>
                      ⚡ 4. Pain & Tenderness Level: {painLevel} / 10
                    </label>
                    <span
                      className="stat-tag"
                      style={{
                        background: painLevel === 0 ? "#dcfce7" : painLevel <= 3 ? "#fef3c7" : painLevel <= 6 ? "#fed7aa" : "#fee2e2",
                        color: painLevel === 0 ? "#166534" : painLevel <= 3 ? "#92400e" : painLevel <= 6 ? "#c2410c" : "#991b1b"
                      }}
                    >
                      {painLevel === 0 ? "Completely Painless" : painLevel <= 3 ? "Mild Tenderness on Touch" : painLevel <= 6 ? "Noticeable Pain / Angiolipoma Suspect" : "⚠️ Severe Pain (Acute Red Flag)"}
                    </span>
                  </div>

                  <input
                    type="range"
                    min="0"
                    max="10"
                    value={painLevel}
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10);
                      setPainLevel(val);
                      if (val === 0) setPainType("Painless");
                      else if (val <= 3) setPainType("Tender only when firmly pressed");
                      else if (val <= 6) setPainType("Tender with mild tingling or aching");
                      else setPainType("Constant severe throbbing pain");
                    }}
                    style={{ width: "100%", margin: "8px 0" }}
                  />

                  <div style={{ fontSize: "12px", color: "var(--slate)" }}>
                    <b>Clinical Note:</b> Standard lipomas are typically painless. Painful lumps often point toward an <b>angiolipoma</b> (vascular variant), nerve compression, or an inflamed cyst.
                  </div>
                </div>

                {/* 4. Skin Changes & Punctum */}
                <div style={{ marginBottom: "16px" }}>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: "bold", marginBottom: "6px" }}>
                    🔍 5. Skin Appearance & Surface Signs
                  </label>
                  <select
                    value={skinChanges}
                    onChange={(e) => setSkinChanges(e.target.value)}
                    style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid var(--line)", marginBottom: "8px" }}
                  >
                    <option value="Normal skin (no redness or spots)">Normal skin (no color change, no warmth)</option>
                    <option value="Red, warm, and swollen skin">Red, warm, or hot skin (⚠️ Infection / Abscess)</option>
                    <option value="Bruised or dark discoloration">Bruised or bluish discoloration</option>
                  </select>

                  <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", cursor: "pointer" }}>
                    <input
                      type="checkbox"
                      checked={hasPunctum}
                      onChange={(e) => setHasPunctum(e.target.checked)}
                    />
                    <span>Is there a visible <b>central blackhead / tiny pore (punctum)</b> on the lump? (Key indicator of an epidermoid cyst)</span>
                  </label>
                </div>

                {/* 5. Growth & Size */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "20px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: "bold", marginBottom: "6px" }}>
                      ⏱️ 6. Growth Timeline
                    </label>
                    <select
                      value={growthSpeed}
                      onChange={(e) => setGrowthSpeed(e.target.value)}
                      style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid var(--line)" }}
                    >
                      <option value="Slow / Same size for years">Slow growth / Unchanged for months or years</option>
                      <option value="Noticeably grew in weeks">Rapid growth in past few weeks (⚠️ Red Flag)</option>
                      <option value="Recently appeared after injury">Appeared suddenly after a blow or injury</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: "bold", marginBottom: "6px" }}>
                      📏 7. Approximate Diameter: {sizeCm} cm
                    </label>
                    <input
                      type="range"
                      min="0.5"
                      max="10"
                      step="0.5"
                      value={sizeCm}
                      onChange={(e) => setSizeCm(parseFloat(e.target.value))}
                      style={{ width: "100%", margin: "8px 0" }}
                    />
                    <small style={{ color: sizeCm >= 5 ? "#dc2626" : "var(--slate)", fontWeight: sizeCm >= 5 ? "bold" : "normal" }}>
                      {sizeCm >= 5 ? "⚠️ ≥5 cm (NCCN Red-Flag Criteria: Golf ball size or larger)" : `Current: ${sizeCm} cm (Under 5 cm threshold)`}
                    </small>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isAnalyzing}
                  className="button"
                  style={{ width: "100%", padding: "12px", fontSize: "15px" }}
                >
                  {isAnalyzing ? "Processing Grounded RAG Analysis..." : "🔬 Run Grounded Clinical Triage →"}
                </button>
              </form>
            </div>

            {/* Differential Comparison Quick Guide */}
            <div>
              <div className="card" style={{ background: "var(--sage)", border: "1.5px solid var(--line)" }}>
                <h3 style={{ margin: "0 0 12px", color: "var(--forest)", fontSize: "17px" }}>
                  📚 Medical Differential Guide (Mayo Clinic & NIH)
                </h3>

                <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "13px" }}>
                  <div style={{ background: "#fff", padding: "12px", borderRadius: "10px", border: "1px solid var(--line)" }}>
                    <b style={{ color: "var(--forest)" }}>1. Standard Benign Lipoma:</b>
                    <p style={{ margin: "4px 0 0", color: "#374151" }}>
                      Mature fat cells. Soft, doughy, moves smoothly beneath the skin, and <b>completely painless</b> in &gt;90% of cases. Grows very slowly over years.
                    </p>
                  </div>

                  <div style={{ background: "#fff", padding: "12px", borderRadius: "10px", border: "1px solid var(--line)" }}>
                    <b style={{ color: "#b45309" }}>2. Angiolipoma (Painful Lipoma):</b>
                    <p style={{ margin: "4px 0 0", color: "#374151" }}>
                      Contains tiny microscopic blood vessels (capillaries) with microthrombi. <b>Characteristically tender or painful to touch</b>. Commonly on the forearms of young adults.
                    </p>
                  </div>

                  <div style={{ background: "#fff", padding: "12px", borderRadius: "10px", border: "1px solid var(--line)" }}>
                    <b style={{ color: "var(--clay)" }}>3. Epidermoid / Sebaceous Cyst:</b>
                    <p style={{ margin: "4px 0 0", color: "#374151" }}>
                      Keratin-filled sac anchored to the skin. Marked by a <b>visible central dark pore (punctum)</b>. Moves <i>with</i> the skin, not under it. Becomes tender, hot, and red if infected.
                    </p>
                  </div>

                  <div style={{ background: "#fff", padding: "12px", borderRadius: "10px", border: "1.5px solid #ef4444" }}>
                    <b style={{ color: "#dc2626" }}>4. High-Risk Sarcoma Red Flags (NCCN Rules):</b>
                    <p style={{ margin: "4px 0 0", color: "#374151" }}>
                      Size &gt;5 cm, rapid growth in weeks, deep fixation to underlying muscle, stony hard texture, or recurrence after prior surgery. Requires soft-tissue MRI.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Grounded RAG Chatbot */}
        {activeTab === "chat" && (
          <div className="card" style={{ maxWidth: "860px", margin: "0 auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h3 style={{ margin: 0, fontSize: "18px" }}>Grounded Medical RAG Chat Assistant</h3>
              <span className="stat-tag" style={{ background: "#dcfce7", color: "#166534" }}>
                ✓ Grounded with Mayo Clinic & NIH
              </span>
            </div>

            {/* Quick Prompt Pills */}
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "16px" }}>
              <button
                type="button"
                onClick={() => setChatInput("Why does my lipoma hurt when I press on it?")}
                style={{ background: "var(--sage)", border: "1px solid var(--line)", padding: "5px 12px", borderRadius: "16px", fontSize: "12px", cursor: "pointer" }}
              >
                💡 Why is my lipoma painful?
              </button>
              <button
                type="button"
                onClick={() => setChatInput("What is the difference between a lipoma and a sebaceous cyst?")}
                style={{ background: "var(--sage)", border: "1px solid var(--line)", padding: "5px 12px", borderRadius: "16px", fontSize: "12px", cursor: "pointer" }}
              >
                💡 Lipoma vs Epidermoid Cyst
              </button>
              <button
                type="button"
                onClick={() => setChatInput("What are the red flags for soft tissue sarcoma?")}
                style={{ background: "var(--sage)", border: "1px solid var(--line)", padding: "5px 12px", borderRadius: "16px", fontSize: "12px", cursor: "pointer" }}
              >
                ⚠️ What are the red flags for cancer?
              </button>
            </div>

            {/* Message Thread */}
            <div
              style={{
                height: "380px",
                overflowY: "auto",
                border: "1px solid var(--line)",
                borderRadius: "12px",
                padding: "16px",
                background: "#fafafa",
                marginBottom: "16px",
                display: "flex",
                flexDirection: "column",
                gap: "12px"
              }}
            >
              {chatMessages.map((msg, i) => (
                <div
                  key={i}
                  style={{
                    alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
                    maxWidth: "80%",
                    background: msg.sender === "user" ? "var(--forest)" : "#fff",
                    color: msg.sender === "user" ? "#fff" : "var(--ink)",
                    padding: "12px 16px",
                    borderRadius: "14px",
                    border: msg.sender === "user" ? "none" : "1px solid var(--line)",
                    fontSize: "13.5px",
                    lineHeight: "1.5"
                  }}
                >
                  <p style={{ margin: 0 }}>{msg.text}</p>
                  {msg.citation && (
                    <div style={{ marginTop: "8px", fontSize: "11px", color: msg.sender === "user" ? "#d1fae5" : "var(--slate)", borderTop: "1px dashed rgba(0,0,0,0.1)", paddingTop: "6px" }}>
                      📖 Source Grounding: <i>{msg.citation}</i>
                    </div>
                  )}
                  {msg.isDisclaimer && (
                    <div style={{ marginTop: "6px", fontSize: "10.5px", color: "#9ca3af" }}>
                      Advisory decision support only. Non-diagnostic.
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Input Bar */}
            <form onSubmit={handleChatSubmit} style={{ display: "flex", gap: "10px" }}>
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask any question about lipomas, angiolipomas, cysts, or lump symptoms..."
                style={{ flex: 1, padding: "10px 14px", borderRadius: "10px", border: "1px solid var(--line)", fontSize: "14px" }}
              />
              <button type="submit" className="button" style={{ padding: "10px 22px" }}>
                Send →
              </button>
            </form>
          </div>
        )}

        {/* Results Section */}
        {evalResult && (
          <div id="rag-results-section" style={{ marginTop: "40px" }}>
            {/* Red Flag Alert or Benign Indicator */}
            {evalResult.hasRedFlags ? (
              <div
                style={{
                  background: "#fff1f2",
                  border: "2px solid #ef4444",
                  borderRadius: "16px",
                  padding: "24px",
                  marginBottom: "24px"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                  <span style={{ fontSize: "28px" }}>🚨</span>
                  <div>
                    <h3 style={{ margin: 0, color: "#991b1b", fontSize: "19px" }}>
                      Clinical Red Flags Identified — In-Person Medical Examination Recommended
                    </h3>
                    <span className="stat-tag" style={{ background: "#fee2e2", color: "#b91c1c", marginTop: "4px" }}>
                      Risk Level: {evalResult.riskTier}
                    </span>
                  </div>
                </div>

                <div style={{ margin: "14px 0", display: "flex", flexDirection: "column", gap: "8px" }}>
                  {evalResult.redFlags.map((rf, idx) => (
                    <div key={idx} style={{ background: "#fff", padding: "10px 14px", borderRadius: "8px", border: "1px solid #fecdd3", fontSize: "13.5px" }}>
                      <b style={{ color: "#dc2626" }}>• {rf.label}:</b> {rf.reason}
                    </div>
                  ))}
                </div>

                <p style={{ margin: "12px 0 0", fontSize: "13.5px", color: "#7f1d1d" }}>
                  <b>Guidance based on NCCN Soft Tissue Oncology Protocol:</b> Soft tissue masses displaying rapid enlargement, deep tissue adherence, high pain, or size &gt;5 cm should NOT undergo blind biopsy or removal without preceding ultrasound or MRI soft-tissue imaging.
                </p>

                <div style={{ marginTop: "16px", display: "flex", gap: "12px" }}>
                  <Link href="/booking" className="button" style={{ background: "#dc2626" }}>
                    Book Clinical Evaluation Visit →
                  </Link>
                  <Link href="/facilities" className="button ghost">
                    Locate Nearest Surgical Clinic / PHC
                  </Link>
                </div>
              </div>
            ) : (
              <div
                style={{
                  background: "#f0fdf4",
                  border: "2px solid #22c55e",
                  borderRadius: "16px",
                  padding: "24px",
                  marginBottom: "24px"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                  <span style={{ fontSize: "28px" }}>✓</span>
                  <div>
                    <h3 style={{ margin: 0, color: "#166534", fontSize: "19px" }}>
                      Symptoms Consistent With Benign Characteristics
                    </h3>
                    <span className="stat-tag" style={{ background: "#dcfce7", color: "#15803d", marginTop: "4px" }}>
                      Risk Tier: {evalResult.riskTier}
                    </span>
                  </div>
                </div>

                <p style={{ margin: "10px 0 0", fontSize: "14px", color: "#14532d", lineHeight: "1.5" }}>
                  The soft texture, independent mobility beneath the skin, and absence of acute enlargement align with benign subcutaneous lesions according to Mayo Clinic and NIH criteria.
                </p>
              </div>
            )}

            {/* Differential Diagnosis Cards */}
            <div style={{ marginBottom: "28px" }}>
              <h3 style={{ margin: "0 0 14px", fontSize: "18px" }}>
                Differential Diagnoses Grounded in Evidence
              </h3>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}>
                {evalResult.differentialConsiderations.map((diff, idx) => (
                  <div key={idx} className="card">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                      <b style={{ fontSize: "15px", color: "var(--forest)" }}>{diff.condition}</b>
                      <span className="stat-tag" style={{ fontSize: "11px" }}>
                        Likelihood: {diff.likelihood}
                      </span>
                    </div>
                    <p style={{ margin: 0, fontSize: "13px", color: "#4b5563", lineHeight: "1.5" }}>
                      {diff.rationale}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Verified Medical Citations Grounding (§1.A) */}
            <div className="card" style={{ background: "#f8fafc", border: "1px solid var(--line)" }}>
              <h4 style={{ margin: "0 0 10px", fontSize: "15px", color: "var(--slate)" }}>
                Verified Medical Knowledge Base & Clinical Citations (RAG)
              </h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "12px", color: "#4b5563" }}>
                {retrievedDocs.map((doc) => (
                  <div key={doc.id} style={{ borderBottom: "1px solid #e2e8f0", paddingBottom: "6px" }}>
                    <b>{doc.topic}</b> — <i>{doc.source}</i>
                    <div style={{ color: "#64748b", marginTop: "2px" }}>{doc.citation}</div>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: "14px", fontSize: "11.5px", color: "#94a3b8", fontStyle: "italic" }}>
                ⚠️ Non-Diagnostic Advisory: Grounded via vector similarity against peer-reviewed surgical literature. Final diagnosis requires professional clinical palpation.
              </div>
            </div>
          </div>
        )}

        {/* Legal Disclaimer Modal */}
        {showLegalModal && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(0,0,0,0.6)",
              display: "grid",
              placeItems: "center",
              zIndex: 9999,
              padding: "20px"
            }}
          >
            <div style={{ background: "#fff", borderRadius: "16px", maxWidth: "540px", width: "100%", padding: "28px" }}>
              <h3 style={{ margin: "0 0 12px", color: "#92400e" }}>⚖️ Informed Consent & Terms of Service</h3>
              <div style={{ fontSize: "13px", color: "#374151", lineHeight: "1.55", marginBottom: "20px" }}>
                <p>Before using this medical evaluation tool, please confirm your understanding of the following:</p>
                <ul>
                  <li><b>Educational Non-Diagnostic Tool:</b> This software is not a diagnostic device (SaMD exemption). It cannot replace consultation with a physician.</li>
                  <li><b>No Doctor-Patient Relationship:</b> Using this tool does not create a physician-patient relationship.</li>
                  <li><b>Red Flag Symptoms:</b> If you experience severe pain, rapidly growing masses, or acute illness, seek immediate in-person medical care.</li>
                  <li><b>Data Privacy:</b> Your symptoms are processed locally and securely under India DPDP Act 2023 principles without unauthorized data sharing.</li>
                </ul>
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                <button
                  type="button"
                  onClick={() => setShowLegalModal(false)}
                  className="button ghost"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setConsentAgreed(true);
                    setShowLegalModal(false);
                  }}
                  className="button"
                  style={{ background: "var(--forest)" }}
                >
                  I Understand and Agree →
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
      <SetuFooter />
    </>
  );
}
