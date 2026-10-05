"use client";

import { useState, useEffect } from "react";
import SetuHeader from "../../components/SetuHeader";
import SetuFooter from "../../components/SetuFooter";
import { getHousehold, logAudit } from "../../lib/offlineSync";
import { PILOT_REGION, AUTH_ICONS } from "../../lib/setuData";

export default function AuthPage() {
  const [household, setHousehold] = useState(null);
  const [authMethod, setAuthMethod] = useState("icon_pin"); // "otp" | "icon_pin"
  const [phoneNumber, setPhoneNumber] = useState("9876543210");
  const [otpCode, setOtpCode] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [pin, setPin] = useState("");
  const [selectedIcons, setSelectedIcons] = useState([]);
  const [activeMemberId, setActiveMemberId] = useState("pat-101");
  const [notification, setNotification] = useState("");

  useEffect(() => {
    setHousehold(getHousehold());
  }, []);

  const handleIconClick = (iconId) => {
    if (selectedIcons.includes(iconId)) {
      setSelectedIcons(selectedIcons.filter((i) => i !== iconId));
    } else {
      if (selectedIcons.length < 4) {
        setSelectedIcons([...selectedIcons, iconId]);
      }
    }
  };

  const handleIconPinLogin = (e) => {
    e.preventDefault();
    if (pin.length !== 4) {
      setNotification("⚠️ Please enter a 4-digit numeric PIN.");
      return;
    }
    if (selectedIcons.length !== 4) {
      setNotification("⚠️ Please select your 4 secret icons in order.");
      return;
    }

    setNotification("✓ Iconic authentication verified! Signed in to household.");
    logAudit({
      action: "AUTH_ICON_PIN_SUCCESS",
      actor: `Phone ${phoneNumber}`,
      detail: `Low-literacy iconic authentication succeeded on device.`
    });
  };

  const handleSendOtp = () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      setNotification("⚠️ Please enter a valid 10-digit mobile number.");
      return;
    }
    setOtpSent(true);
    setOtpCode("8421"); // Simulated SMS OTP
    setNotification("📲 Simulated SMS OTP sent: 8421 (Valid for 10 minutes)");
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (otpCode !== "8421") {
      setNotification("❌ Incorrect OTP. Rate limited: 3 attempts remaining.");
      return;
    }
    setNotification("✓ Mobile OTP verified successfully!");
    logAudit({
      action: "AUTH_OTP_SUCCESS",
      actor: `Phone ${phoneNumber}`,
      detail: `OTP authentication succeeded for household ${household?.householdId}`
    });
  };

  return (
    <>
      <SetuHeader />
      <main className="container" style={{ padding: "40px 0 80px" }}>
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <p className="eyebrow">HOUSEHOLD IDENTITY & CONSENT (§3.1, §10)</p>
          <h1>Access Your Family Health Account</h1>
          <p style={{ maxWidth: "600px", margin: "8px auto 0" }}>
            Designed for rural households with shared devices. Sign in via Phone OTP or 
            use the iconic visual sequence for low-literacy accessibility.
          </p>
        </div>

        {notification && (
          <div
            style={{
              maxWidth: "600px",
              margin: "0 auto 24px",
              padding: "12px 18px",
              borderRadius: "12px",
              background: notification.includes("✓") ? "#ecfdf5" : "#fffbeb",
              color: notification.includes("✓") ? "#065f46" : "#92400e",
              border: "1px solid",
              borderColor: notification.includes("✓") ? "#a7f3d0" : "#fde68a",
              fontSize: "13.5px",
              fontWeight: "600"
            }}
          >
            {notification}
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: "30px", maxWidth: "980px", margin: "0 auto" }}>
          {/* Left Column: Login Methods */}
          <div className="card">
            {/* Method Tabs */}
            <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
              <button
                type="button"
                className={`button ${authMethod === "icon_pin" ? "" : "ghost"}`}
                style={{ flex: 1, minHeight: "44px", fontSize: "13px" }}
                onClick={() => setAuthMethod("icon_pin")}
              >
                🌾 Iconic PIN (Low-Literacy)
              </button>
              <button
                type="button"
                className={`button ${authMethod === "otp" ? "" : "ghost"}`}
                style={{ flex: 1, minHeight: "44px", fontSize: "13px" }}
                onClick={() => setAuthMethod("otp")}
              >
                📱 Mobile OTP
              </button>
            </div>

            {/* Method 1: Low-Literacy Iconic PIN (§3.1) */}
            {authMethod === "icon_pin" && (
              <form onSubmit={handleIconPinLogin}>
                <div style={{ background: "var(--sage)", padding: "12px", borderRadius: "10px", marginBottom: "16px", fontSize: "12.5px" }}>
                  💡 <b>Low-Literacy Mode:</b> Enter your 4-digit PIN, then tap your household's 4 secret icons in order. 
                  Does not require reading SMS messages.
                </div>

                <div style={{ marginBottom: "16px" }}>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: "700", marginBottom: "6px" }}>
                    4-Digit Numeric PIN (पासवर्ड पिन)
                  </label>
                  <input
                    type="password"
                    maxLength={4}
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    placeholder="e.g. 1234"
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "10px",
                      border: "1.5px solid var(--line)",
                      fontSize: "18px",
                      letterSpacing: "4px"
                    }}
                  />
                  <small style={{ color: "var(--slate)" }}>Demo PIN: 1234</small>
                </div>

                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: "700", marginBottom: "8px" }}>
                    Select Your 4 Household Icons ({selectedIcons.length}/4 Selected)
                  </label>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px" }}>
                    {AUTH_ICONS.map((icon) => {
                      const isSelected = selectedIcons.includes(icon.id);
                      return (
                        <button
                          key={icon.id}
                          type="button"
                          onClick={() => handleIconClick(icon.id)}
                          style={{
                            padding: "12px 6px",
                            borderRadius: "12px",
                            border: isSelected ? "2px solid var(--forest)" : "1.5px solid var(--line)",
                            background: isSelected ? "var(--sage2)" : "#fff",
                            cursor: "pointer",
                            textAlign: "center"
                          }}
                        >
                          <div style={{ fontSize: "28px" }}>{icon.symbol}</div>
                          <div style={{ fontSize: "11px", fontWeight: "600", marginTop: "4px" }}>
                            {icon.id}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  <small style={{ color: "var(--slate)", display: "block", marginTop: "6px" }}>
                    Demo sequence: Cow 🐄 + Diya 🪔 + Peacock 🦚 + Tractor 🚜
                  </small>
                </div>

                <button type="submit" className="button" style={{ width: "100%" }}>
                  Verify & Unlock Household →
                </button>
              </form>
            )}

            {/* Method 2: Mobile OTP */}
            {authMethod === "otp" && (
              <form onSubmit={handleVerifyOtp}>
                <div style={{ marginBottom: "16px" }}>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: "700", marginBottom: "6px" }}>
                    Mobile Number (मोबाइल नंबर)
                  </label>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="10-digit phone number"
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "10px",
                      border: "1.5px solid var(--line)",
                      fontSize: "16px"
                    }}
                  />
                </div>

                {!otpSent ? (
                  <button type="button" className="button" style={{ width: "100%" }} onClick={handleSendOtp}>
                    Send OTP (ओटीपी भेजें) →
                  </button>
                ) : (
                  <div>
                    <div style={{ marginBottom: "16px" }}>
                      <label style={{ display: "block", fontSize: "13px", fontWeight: "700", marginBottom: "6px" }}>
                        Enter 4-Digit OTP
                      </label>
                      <input
                        type="text"
                        maxLength={4}
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value)}
                        placeholder="8421"
                        style={{
                          width: "100%",
                          padding: "12px",
                          borderRadius: "10px",
                          border: "1.5px solid var(--line)",
                          fontSize: "18px",
                          letterSpacing: "4px"
                        }}
                      />
                    </div>
                    <button type="submit" className="button" style={{ width: "100%" }}>
                      Verify & Sign In →
                    </button>
                  </div>
                )}
              </form>
            )}
          </div>

          {/* Right Column: Household Multi-Member Profiles (§3.1) & DPDP Consent */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {/* Household Members */}
            <div className="card">
              <span className="stat-tag">Household Profiles (§3.1)</span>
              <h3 style={{ fontSize: "18px", marginBottom: "6px" }}>
                {household?.headName}&apos;s Family
              </h3>
              <p style={{ fontSize: "12.5px", margin: "0 0 14px" }}>
                Ration Card: {household?.rationCardNo} · Village: {household?.village}
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {household?.members?.map((member) => (
                  <div
                    key={member.id}
                    onClick={() => setActiveMemberId(member.id)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "12px 14px",
                      borderRadius: "12px",
                      border: activeMemberId === member.id ? "2px solid var(--forest)" : "1px solid var(--line)",
                      background: activeMemberId === member.id ? "var(--sage)" : "#fff",
                      cursor: "pointer"
                    }}
                  >
                    <div>
                      <b style={{ display: "block", fontSize: "14px" }}>{member.name}</b>
                      <small style={{ color: "var(--slate)", fontSize: "11px" }}>
                        {member.relationship} · {member.age} yrs · ABHA: {member.abhaId}
                      </small>
                    </div>
                    <span>{activeMemberId === member.id ? "🟢 Active" : "Select"}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* DPDP Act 2023 Consent Status (§10) */}
            <div className="card" style={{ background: "#f8faf9" }}>
              <span className="stat-tag" style={{ background: "#dbece2", color: "var(--forest)" }}>
                DPDP Act 2023 Consent Log
              </span>
              <h4 style={{ margin: "6px 0", fontSize: "14px" }}>
                Purpose-Specific Consent ({household?.consentStatus?.consentVersion})
              </h4>
              <ul style={{ margin: "8px 0 12px 18px", padding: 0, fontSize: "12px", color: "var(--slate)" }}>
                <li>✓ Clinical triage and advisory symptom checking</li>
                <li>✓ Care coordination with ASHA worker Kanti Devi</li>
                <li>✓ Encrypted offline local storage & delta synchronization</li>
              </ul>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "var(--slate)" }}>
                <span>Granted: Sep 01, 2026</span>
                <span style={{ color: "var(--forest)", fontWeight: "bold" }}>Status: Active & Revocable</span>
              </div>
            </div>
          </div>
        </div>
      </main>
      <SetuFooter />
    </>
  );
}
