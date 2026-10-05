"use client";

import { useState } from "react";
import SetuHeader from "../../components/SetuHeader";
import SetuFooter from "../../components/SetuFooter";

export default function ChannelsPage() {
  const [activeTab, setActiveTab] = useState("ussd"); // "ussd" | "sms" | "ivr"

  // USSD Simulator State
  const [ussdInput, setUssdInput] = useState("*999#");
  const [ussdScreenText, setUssdScreenText] = useState(
    "Setu Health (सेतु स्वास्थ्य)\n1. Check Symptoms (लक्षण)\n2. Book Clinic Visit\n3. Nearest Hospital/PHC\n4. My Next Appointment\n0. Exit"
  );
  const [ussdStep, setUssdStep] = useState(0);

  // SMS Simulator State
  const [smsLog, setSmsLog] = useState([
    { from: "Setu Health", text: "Welcome to Setu SMS. Send 'BOOK' to schedule, 'TRIAGE' for health check, or 'CLINIC' for address." }
  ]);
  const [smsInput, setSmsInput] = useState("BOOK ANC CHC");

  // IVR Voice Call Simulator State
  const [ivrCallActive, setIvrCallActive] = useState(false);
  const [ivrPrompt, setIvrPrompt] = useState(
    "Welcome to Setu Health Voice Care. हिन्दी के लिए 1 दबाएं. For English press 2."
  );

  // Handle USSD Navigation
  const handleUssdSend = (inputVal) => {
    const val = inputVal || ussdInput;
    if (val === "*999#" || val === "0") {
      setUssdScreenText(
        "Setu Health (सेतु स्वास्थ्य)\n1. Check Symptoms (लक्षण)\n2. Book Clinic Visit\n3. Nearest Hospital/PHC\n4. My Next Appointment\n0. Exit"
      );
      setUssdStep(0);
    } else if (val === "1") {
      setUssdScreenText(
        "Select Symptom:\n1. Fever / Chills (बुखार)\n2. Pregnancy Pain / Bleeding (गंभीर)\n3. Period Cramps\n9. Back"
      );
      setUssdStep(1);
    } else if (val === "2") {
      setUssdScreenText(
        "Book Clinic Visit:\n1. Bishunpur CHC (Tomorrow 10 AM)\n2. Netarhat Sub-Centre (Oct 18)\n9. Back"
      );
      setUssdStep(2);
    } else if (val === "3") {
      setUssdScreenText(
        "Bishunpur CHC: 3.2 km (Behind BDO Office, Haat Ground). 24x7 Ambulance: Call 112\n9. Back"
      );
      setUssdStep(3);
    } else if (val === "4") {
      setUssdScreenText(
        "Next Visit: Pooja Devi - ANC Visit 3\nDate: Oct 15 at Bishunpur CHC with Dr. Ananya Roy.\n9. Back"
      );
      setUssdStep(4);
    } else if (val === "9") {
      setUssdScreenText(
        "Setu Health (सेतु स्वास्थ्य)\n1. Check Symptoms (लक्षण)\n2. Book Clinic Visit\n3. Nearest Hospital/PHC\n4. My Next Appointment\n0. Exit"
      );
      setUssdStep(0);
    } else {
      setUssdScreenText("Request processed successfully. You will receive an SMS confirmation.\n0. Back to Main Menu");
    }
    setUssdInput("");
  };

  // Handle SMS Messaging
  const handleSmsSend = (e) => {
    e.preventDefault();
    if (!smsInput.trim()) return;

    const userMsg = smsInput.trim();
    const newLogs = [...smsLog, { from: "You", text: userMsg }];

    const upper = userMsg.toUpperCase();
    let reply = "";
    if (upper.includes("BOOK")) {
      reply = "Setu Health: Booking reserved for Pooja Devi at Bishunpur CHC on Oct 18, 10:00 AM. Show this SMS at the registration counter.";
    } else if (upper.includes("TRIAGE") || upper.includes("FEVER")) {
      reply = "Setu Triage: For fever with chills >2 days, visit Bishunpur CHC for Malaria blood test (RDT). Drink boiled water. For severe pain call 112.";
    } else if (upper.includes("CLINIC")) {
      reply = "Setu Directory: Bishunpur CHC is 3.2km away behind BDO office. Open 24x7. Emergency ambulance: 112 or 108.";
    } else {
      reply = "Setu Health: Command received. Reply BOOK to schedule, TRIAGE to check symptoms, or call 1800-SETU-HLTH for voice help.";
    }

    newLogs.push({ from: "Setu Health (56767)", text: reply });
    setSmsLog(newLogs);
    setSmsInput("");
  };

  // Handle IVR Voice Call Simulator
  const handleIvrCallToggle = () => {
    if (ivrCallActive) {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
      setIvrCallActive(false);
      setIvrPrompt("Call ended. Thank you for using Setu Health.");
      return;
    }

    setIvrCallActive(true);
    const initialText = "Welcome to Setu Health Voice Care. हिन्दी के लिए 1 दबाएं. For English press 2.";
    setIvrPrompt(initialText);

    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      const u = new SpeechSynthesisUtterance(initialText);
      u.lang = "hi-IN";
      window.speechSynthesis.speak(u);
    }
  };

  const handleIvrKeyPress = (digit) => {
    let nextText = "";
    if (digit === "1") {
      nextText = "सेतु स्वास्थ्य में आपका स्वागत है। डॉक्टर से समय लेने के लिए 1 दबाएं। आपातकालीन एम्बुलेंस के लिए 9 दबाएं।";
    } else if (digit === "2") {
      nextText = "Welcome to English menu. Press 1 to book doctor visit. Press 9 for emergency ambulance.";
    } else if (digit === "9") {
      nextText = "Emergency flag selected. Please stay on line or dial 112 immediately for free ambulance.";
    } else {
      nextText = "Your request has been registered. You will receive an SMS reminder shortly.";
    }

    setIvrPrompt(nextText);
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(nextText);
      u.lang = digit === "2" ? "en-US" : "hi-IN";
      window.speechSynthesis.speak(u);
    }
  };

  return (
    <>
      <SetuHeader />
      <main className="container" style={{ padding: "40px 0 80px" }}>
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <p className="eyebrow">THREE-TIER CHANNEL DEGRADATION SIMULATOR (§1, §3)</p>
          <h1>Access Without a Smartphone</h1>
          <p style={{ maxWidth: "660px", margin: "8px auto 0" }}>
            In rural areas where 2G/3G drops or patients use basic feature phones, Setu provides 
            identical core workflows over <b>USSD</b>, <b>Two-Way SMS</b>, and <b>Interactive Voice Calls (IVR)</b>.
          </p>
        </div>

        {/* Channel Tabs */}
        <div style={{ display: "flex", gap: "10px", justifyContent: "center", marginBottom: "28px" }}>
          <button
            type="button"
            className={`button ${activeTab === "ussd" ? "" : "ghost"}`}
            style={{ minHeight: "42px", fontSize: "13px" }}
            onClick={() => setActiveTab("ussd")}
          >
            📞 USSD (*999# Feature Phone)
          </button>
          <button
            type="button"
            className={`button ${activeTab === "sms" ? "" : "ghost"}`}
            style={{ minHeight: "42px", fontSize: "13px" }}
            onClick={() => setActiveTab("sms")}
          >
            ✉️ Two-Way SMS (56767)
          </button>
          <button
            type="button"
            className={`button ${activeTab === "ivr" ? "" : "ghost"}`}
            style={{ minHeight: "42px", fontSize: "13px" }}
            onClick={() => setActiveTab("ivr")}
          >
            🗣️ IVR Voice Call Simulator
          </button>
        </div>

        {/* Tab 1: USSD Simulator */}
        {activeTab === "ussd" && (
          <div style={{ maxWidth: "420px", margin: "0 auto" }}>
            <div
              style={{
                background: "#1a2e22",
                border: "4px solid #123832",
                borderRadius: "24px",
                padding: "24px",
                boxShadow: "0 14px 30px rgba(0,0,0,0.2)"
              }}
            >
              <div style={{ textAlign: "center", color: "#8faea2", fontSize: "11px", marginBottom: "12px" }}>
                NOKIA 105 / 2G FEATURE PHONE USSD
              </div>

              {/* Monochrome Screen */}
              <div
                style={{
                  background: "#9ec5a8",
                  color: "#0f2e1c",
                  fontFamily: "var(--font-mono)",
                  padding: "16px",
                  borderRadius: "10px",
                  minHeight: "180px",
                  fontSize: "13px",
                  lineHeight: "1.5",
                  whiteSpace: "pre-wrap",
                  border: "2px solid #6b9e7b",
                  marginBottom: "16px"
                }}
              >
                {ussdScreenText}
              </div>

              {/* USSD Keypad Controls */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px", marginBottom: "16px" }}>
                {["1", "2", "3", "4", "5", "6", "7", "8", "9", "*", "0", "#"].map((key) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handleUssdSend(key)}
                    style={{
                      padding: "12px",
                      borderRadius: "10px",
                      background: "#284534",
                      color: "#fff",
                      border: "1px solid #3d604b",
                      fontSize: "16px",
                      fontWeight: "bold",
                      cursor: "pointer"
                    }}
                  >
                    {key}
                  </button>
                ))}
              </div>

              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  type="button"
                  onClick={() => handleUssdSend("*999#")}
                  style={{
                    flex: 1,
                    background: "var(--forest)",
                    color: "#fff",
                    border: 0,
                    padding: "10px",
                    borderRadius: "8px",
                    fontWeight: "bold",
                    cursor: "pointer"
                  }}
                >
                  Dial *999# (Restart)
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: SMS Gateway Simulator */}
        {activeTab === "sms" && (
          <div style={{ maxWidth: "560px", margin: "0 auto" }}>
            <div className="card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", borderBottom: "1px solid var(--line)", paddingBottom: "10px" }}>
                <b>To: 56767 (Setu Rural Shortcode)</b>
                <span className="stat-tag">Standard SMS Rate: ₹0</span>
              </div>

              <div style={{ minHeight: "260px", maxHeight: "360px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "12px", marginBottom: "16px" }}>
                {smsLog.map((msg, i) => (
                  <div
                    key={i}
                    style={{
                      alignSelf: msg.from === "You" ? "flex-end" : "flex-start",
                      maxWidth: "80%",
                      background: msg.from === "You" ? "var(--forest)" : "var(--sage)",
                      color: msg.from === "You" ? "#fff" : "var(--ink)",
                      padding: "10px 14px",
                      borderRadius: "14px",
                      fontSize: "13px"
                    }}
                  >
                    <small style={{ display: "block", fontSize: "10.5px", opacity: 0.8, marginBottom: "2px" }}>
                      {msg.from}
                    </small>
                    {msg.text}
                  </div>
                ))}
              </div>

              <form onSubmit={handleSmsSend} style={{ display: "flex", gap: "8px" }}>
                <input
                  type="text"
                  value={smsInput}
                  onChange={(e) => setSmsInput(e.target.value)}
                  placeholder="Type BOOK, TRIAGE FEVER, CLINIC, or STATUS..."
                  style={{ flex: 1, padding: "10px 14px", borderRadius: "10px", border: "1.5px solid var(--line)" }}
                />
                <button type="submit" className="button" style={{ minHeight: "42px", fontSize: "13px" }}>
                  Send SMS →
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Tab 3: IVR Voice Simulator */}
        {activeTab === "ivr" && (
          <div style={{ maxWidth: "460px", margin: "0 auto" }}>
            <div className="card" style={{ textAlign: "center" }}>
              <div style={{ fontSize: "48px", marginBottom: "10px" }}>
                {ivrCallActive ? "📲" : "📞"}
              </div>
              <h3 style={{ fontSize: "20px", marginBottom: "4px" }}>
                Setu Toll-Free IVR: 1800-SETU-HLTH
              </h3>
              <p style={{ fontSize: "12.5px", color: "var(--slate)", marginBottom: "18px" }}>
                Simulates toll-free phone voice call for users without literacy or reading ability.
              </p>

              <button
                type="button"
                className={`button ${ivrCallActive ? "clay" : ""}`}
                style={{ width: "100%", marginBottom: "20px" }}
                onClick={handleIvrCallToggle}
              >
                {ivrCallActive ? "🔴 End Call (कॉल काटें)" : "🟢 Place Simulated Voice Call"}
              </button>

              {ivrCallActive && (
                <div style={{ background: "var(--sage)", padding: "16px", borderRadius: "14px", textAlign: "left", marginBottom: "18px" }}>
                  <small style={{ color: "var(--forest)", fontWeight: "bold", display: "block", marginBottom: "6px" }}>
                    🗣️ IVR Operator Speaking:
                  </small>
                  <p style={{ fontSize: "14px", color: "var(--ink)", margin: 0, lineHeight: "1.5" }}>
                    &ldquo;{ivrPrompt}&rdquo;
                  </p>
                </div>
              )}

              {ivrCallActive && (
                <div>
                  <small style={{ display: "block", color: "var(--slate)", marginBottom: "8px" }}>
                    Press touchtone phone key:
                  </small>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px" }}>
                    {["1", "2", "3", "4", "5", "6", "7", "8", "9", "*", "0", "#"].map((key) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => handleIvrKeyPress(key)}
                        style={{
                          padding: "10px",
                          borderRadius: "8px",
                          border: "1px solid var(--line)",
                          background: "#fff",
                          fontWeight: "bold",
                          cursor: "pointer"
                        }}
                      >
                        {key}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
      <SetuFooter />
    </>
  );
}
