"use client";

import { useState } from "react";
import SetuHeader from "../../components/SetuHeader";
import SetuFooter from "../../components/SetuFooter";
import { LOCAL_NUTRITION_ITEMS } from "../../lib/setuData";
import { queueMutation } from "../../lib/offlineSync";

export default function NutritionPage() {
  const [activeStage, setActiveStage] = useState("pregnancy");
  const [selectedSigns, setSelectedSigns] = useState([]);
  const [checklistNotice, setChecklistNotice] = useState("");

  const stages = [
    { id: "pregnancy", label: "🤰 Pregnancy (गर्भावस्था)", desc: "Focus: Iron, Calcium & Folic Acid to prevent low birth weight and anemia." },
    { id: "lactation", label: "🤱 Breastfeeding (धात्री माता)", desc: "Focus: Fluid intake, Moringa greens for milk production, and high-protein dals." },
    { id: "infant", label: "👶 Infant 6-24 Months", desc: "Focus: Timely weaning (Annaprashan) with mashed marua, dal khichdi, and banana." },
    { id: "family", label: "🌾 Family General Nutrition", desc: "Focus: Diversifying away from polished rice; reintroducing millets and forest greens." }
  ];

  const malnutritionSigns = [
    { id: "sign-1", label: "Inner eyelid or tongue is pale white (पीलापन - Anemia)" },
    { id: "sign-2", label: "Child not gaining weight for 2 consecutive monthly Anganwadi checks" },
    { id: "sign-3", label: "Swelling in both feet or face during pregnancy (सूजन)" },
    { id: "sign-4", label: "Extreme fatigue or breathlessness while walking uphill" }
  ];

  const handleToggleSign = (id) => {
    if (selectedSigns.includes(id)) {
      setSelectedSigns(selectedSigns.filter((s) => s !== id));
    } else {
      setSelectedSigns([...selectedSigns, id]);
    }
  };

  const handleChecklistSubmit = (e) => {
    e.preventDefault();
    if (selectedSigns.length === 0) {
      setChecklistNotice("No risk signs selected. Keep continuing your balanced local diet!");
      return;
    }

    // Queue escalation to ASHA / Clinician (§3.7)
    queueMutation({
      entityType: "Escalation",
      action: "CREATE",
      payload: {
        id: "esc-" + Date.now(),
        patientName: "Pooja Devi",
        village: "Banari",
        age: 26,
        reason: `Nutritional Risk Checklist Flag: ${selectedSigns.join(", ")}`,
        urgency: "routine",
        status: "pending_review",
        createdAt: new Date().toISOString(),
        assignedTo: "Dr. Ananya Roy (Gyn/Obs)"
      },
      purposeOfUse: "care-coordination"
    });

    setChecklistNotice("⚠️ Risk signs noted. An escalation has been queued for your ASHA worker Kanti Devi and Dr. Ananya Roy.");
  };

  return (
    <>
      <SetuHeader />
      <main className="container" style={{ padding: "40px 0 80px" }}>
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <p className="eyebrow">LOCAL FOREST & FARM DIET (§3.7)</p>
          <h1>Affordable Rural Nutrition Guidance</h1>
          <p style={{ maxWidth: "660px", margin: "8px auto 0" }}>
            Life-stage guidance built <b>only</b> from affordable, locally available Jharkhand foods 
            (Moringa, Marua/Ragi, Kulthi, Amla). No expensive urban health supplements.
          </p>
        </div>

        {/* Life-Stage Selector */}
        <div style={{ display: "flex", gap: "10px", justifyContent: "center", flexWrap: "wrap", marginBottom: "28px" }}>
          {stages.map((st) => (
            <button
              key={st.id}
              type="button"
              className={`button ${activeStage === st.id ? "" : "ghost"}`}
              style={{ minHeight: "42px", fontSize: "13px" }}
              onClick={() => setActiveStage(st.id)}
            >
              {st.label}
            </button>
          ))}
        </div>

        {/* Selected Stage Banner */}
        <div style={{ maxWidth: "800px", margin: "0 auto 28px", background: "var(--sage)", padding: "16px 20px", borderRadius: "14px", textAlign: "center" }}>
          <b style={{ color: "var(--forest)", fontSize: "15px" }}>
            {stages.find((s) => s.id === activeStage)?.label}
          </b>
          <p style={{ margin: "4px 0 0", fontSize: "13.5px", color: "var(--ink)" }}>
            {stages.find((s) => s.id === activeStage)?.desc}
          </p>
        </div>

        {/* Local Food Items Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "20px", marginBottom: "40px" }}>
          {LOCAL_NUTRITION_ITEMS.map((item) => (
            <div key={item.id} className="card">
              <span className="stat-tag">{item.category}</span>
              <h3 style={{ fontSize: "18px", margin: "8px 0 4px" }}>{item.name}</h3>
              <small style={{ color: "var(--clay-dark)", fontWeight: "bold", display: "block", marginBottom: "10px" }}>
                💰 Cost: {item.costRating}
              </small>

              <div style={{ fontSize: "12.5px", marginBottom: "8px" }}>
                <b>Key Nutrients:</b>
                <div style={{ color: "var(--slate)" }}>{item.nutrients}</div>
              </div>

              <div style={{ fontSize: "12.5px", marginBottom: "10px" }}>
                <b>Clinical Role:</b>
                <div style={{ color: "var(--ink)" }}>{item.role}</div>
              </div>

              <div style={{ background: "var(--sage)", padding: "10px", borderRadius: "8px", fontSize: "11.5px" }}>
                <b>🧑‍🍳 Village Kitchen Tip:</b> {item.preparationTip}
              </div>
            </div>
          ))}
        </div>

        {/* Malnutrition / Risk Signs Checklist (§3.7) */}
        <div className="card" style={{ maxWidth: "760px", margin: "0 auto" }}>
          <span className="stat-tag" style={{ background: "#fef3c7", color: "#92400e" }}>
            Nutrition Risk Screening Tool (§3.7)
          </span>
          <h3 style={{ fontSize: "18px", margin: "8px 0 4px" }}>
            Check for Malnutrition & Anemia Warning Signs
          </h3>
          <p style={{ fontSize: "13px", color: "var(--slate)", marginBottom: "16px" }}>
            Select any symptoms you or your child are experiencing. Flagged responses escalate directly to a clinician:
          </p>

          {checklistNotice && (
            <div style={{ background: checklistNotice.includes("⚠️") ? "#fef2f2" : "#ecfdf5", color: checklistNotice.includes("⚠️") ? "#b91c1c" : "#065f46", padding: "10px 14px", borderRadius: "10px", fontSize: "13px", fontWeight: "bold", marginBottom: "14px" }}>
              {checklistNotice}
            </div>
          )}

          <form onSubmit={handleChecklistSubmit}>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "16px" }}>
              {malnutritionSigns.map((sign) => (
                <label
                  key={sign.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    background: selectedSigns.includes(sign.id) ? "var(--sage)" : "#fff",
                    border: "1px solid var(--line)",
                    padding: "10px 14px",
                    borderRadius: "10px",
                    cursor: "pointer",
                    fontSize: "13px"
                  }}
                >
                  <input
                    type="checkbox"
                    checked={selectedSigns.includes(sign.id)}
                    onChange={() => handleToggleSign(sign.id)}
                  />
                  <span>{sign.label}</span>
                </label>
              ))}
            </div>

            <button type="submit" className="button" style={{ minHeight: "42px", fontSize: "13px" }}>
              Submit Nutrition Assessment (जांचें) →
            </button>
          </form>
        </div>
      </main>
      <SetuFooter />
    </>
  );
}
