"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import SetuHeader from "../components/SetuHeader";
import SetuFooter from "../components/SetuFooter";
import { initLocalStore, getHousehold, getNetworkMode } from "../lib/offlineSync";
import { PILOT_REGION } from "../lib/setuData";

export default function SetuHomePage() {
  const [household, setHousehold] = useState(null);
  const [networkMode, setNetworkMode] = useState("online");
  const [lang, setLang] = useState("en");

  useEffect(() => {
    initLocalStore();
    setHousehold(getHousehold());
    setNetworkMode(getNetworkMode());

    try {
      const savedLang = localStorage.getItem("setu_lang");
      if (savedLang) setLang(savedLang);
    } catch {}

    const handleNetworkChange = (e) => setNetworkMode(e.detail.mode);
    const handleLangChange = (e) => {
      if (e.detail?.lang) setLang(e.detail.lang);
    };

    window.addEventListener("setu_network_change", handleNetworkChange);
    window.addEventListener("setu_lang_change", handleLangChange);
    return () => {
      window.removeEventListener("setu_network_change", handleNetworkChange);
      window.removeEventListener("setu_lang_change", handleLangChange);
    };
  }, []);

  const isHi = lang === "hi";
  const activePatient = household?.members?.[0] || { name: isHi ? "पूजा देवी" : "Pooja Devi", age: 26 };

  return (
    <>
      <SetuHeader />
      <main>
        {/* Setu Hero Section */}
        <section className="setu-hero">
          <div className="container setu-hero-grid">
            <div>
              <div className="voice-action-pill">
                <span>{isHi ? "ऑडियो गाइड उपलब्ध" : "Audio Guide Available (Low-Bandwidth Support)"}</span>
              </div>
              <p className="eyebrow">
                {isHi ? "ऑफ़लाइन-प्रथम ग्रामीण स्वास्थ्य · विशुनपुर प्रखंड" : `OFFLINE-FIRST RURAL HEALTH · ${PILOT_REGION.name.toUpperCase()}`}
              </p>
              <h1>
                {isHi ? (
                  <>स्वास्थ्य सेवा जो पहुंचे <i>हर गांव तक,</i> हर सिग्नल पर।</>
                ) : (
                  <>Healthcare that reaches <i>every village,</i> at any signal.</>
                )}
              </h1>
              <p style={{ fontSize: "16px", marginTop: "12px" }}>
                {isHi
                  ? "सेतु महाराष्ट्र के ग्रामीण एवं अर्ध-शहरी परिवारों के लिए प्राथमिक जांच, डॉक्टर परामर्श, मातृत्व निगरानी और स्वास्थ्य रिकॉर्ड को जोड़ता है। बेसिक फोन पर 100% ऑफ़लाइन काम करता है, साथ ही एसएमएस और आईवीआर वॉयस कॉल बैकअप भी उपलब्ध है।"
                  : "Setu bridges clinical triage, doctor visits, maternal tracking, and health records for families across Maharashtra. Works 100% offline on basic phones, with fallback to SMS and IVR voice calls."}
              </p>

              <div className="button-row" style={{ marginTop: "24px" }}>
                <Link href="/triage" className="button">
                  {isHi ? "लक्षण जांचें →" : "Check Symptoms →"}
                </Link>
                <Link href="/booking" className="button ghost">
                  {isHi ? "अस्पताल समय बुक करें" : "Book Clinic Visit"}
                </Link>
                <Link href="/channels" className="button clay">
                  {isHi ? "SMS / IVR सेवाएं" : "SMS / IVR Simulator"}
                </Link>
              </div>
            </div>

            {/* Active Household Context Card */}
            <div>
              <div className="rural-stat-card">
                <span className="stat-tag">{isHi ? "सक्रिय परिवार प्रोफ़ाइल" : "Active Household Profile"}</span>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "14px" }}>
                  <div
                    style={{
                      width: "48px",
                      height: "48px",
                      borderRadius: "50%",
                      background: "var(--sage2)",
                      display: "grid",
                      placeItems: "center",
                      color: "var(--forest)"
                    }}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: "17px" }}>{isHi ? "पूजा देवी" : activePatient.name}</h3>
                    <small style={{ color: "var(--slate)" }}>
                      {isHi ? "26 वर्ष · पालघर, महाराष्ट्र · 22 सप्ताह गर्भवती" : `${activePatient.age} yrs · Palghar, Maharashtra · 22w Pregnant`}
                    </small>
                  </div>
                </div>

                <div
                  style={{
                    background: "var(--sage)",
                    borderRadius: "12px",
                    padding: "12px",
                    fontSize: "12.5px",
                    marginBottom: "14px"
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                    <b>{isHi ? "अगली प्रसवपूर्व जांच (ANC):" : "Next ANC Checkup:"}</b>
                    <span style={{ color: "var(--forest)", fontWeight: "bold" }}>{isHi ? "15 अक्टूबर, 2026" : "Oct 15, 2026"}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                    <b>{isHi ? "स्वास्थ्य केंद्र:" : "Facility:"}</b>
                    <span>{isHi ? "केईएम अस्पताल, मुंबई (डॉ. स्नेहल शिंदे)" : "KEM Hospital, Mumbai (Dr. Snehal Shinde)"}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <b>{isHi ? "देखभाल योजना:" : "Care Plan:"}</b>
                    <span>{isHi ? "आईएफए + कैल्शियम दैनिक" : "IFA + Calcium Daily"}</span>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "8px" }}>
                  <Link
                    href="/records"
                    style={{
                      flex: 1,
                      textAlign: "center",
                      background: "var(--forest)",
                      color: "#fff",
                      padding: "8px 12px",
                      borderRadius: "8px",
                      fontSize: "12px",
                      fontWeight: "600"
                    }}
                  >
                    {isHi ? "समयरेखा देखें" : "View Timeline"}
                  </Link>
                  <Link
                    href="/auth"
                    style={{
                      flex: 1,
                      textAlign: "center",
                      background: "#fff",
                      border: "1px solid var(--line)",
                      color: "var(--ink)",
                      padding: "8px 12px",
                      borderRadius: "8px",
                      fontSize: "12px",
                      fontWeight: "600"
                    }}
                  >
                    {isHi ? `सदस्य बदलें (${household?.members?.length || 3})` : `Switch Member (${household?.members?.length || 3})`}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Actions Grid */}
        <section className="section container">
          <div style={{ textAlign: "center", marginBottom: "28px" }}>
            <p className="eyebrow">{isHi ? "सेवा का चयन करें" : "SELECT A SERVICE TO BEGIN"}</p>
            <h2>{isHi ? "त्वरित स्वास्थ्य सेवाएं" : "Quick Action Grid"}</h2>
            <p>
              {isHi
                ? "प्राथमिक स्वास्थ्य सेवाओं तक सीधी पहुंच के लिए नीचे दिए गए विकल्पों का उपयोग करें।"
                : "Fast access to primary care, appointments, records, and clinical triage."}
            </p>
          </div>

          <div className="icon-action-grid">
            <Link href="/triage" className="icon-action-card">
              <span className="action-icon-badge">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3"/>
                  <path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4"/>
                  <circle cx="20" cy="10" r="2"/>
                </svg>
              </span>
              <span className="action-label">{isHi ? "लक्षण जांचें" : "Check Symptoms"}</span>
            </Link>

            <Link href="/booking" className="icon-action-card">
              <span className="action-icon-badge">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
              </span>
              <span className="action-label">{isHi ? "अस्पताल समय बुक करें" : "Book Appointment"}</span>
            </Link>

            <Link href="/facilities" className="icon-action-card">
              <span className="action-icon-badge">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 21h18"/>
                  <path d="M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16"/>
                  <path d="M9 10h6"/>
                  <path d="M12 7v6"/>
                </svg>
              </span>
              <span className="action-label">{isHi ? "नजदीकी स्वास्थ्य केंद्र" : "Find Clinics & Haat"}</span>
            </Link>

            <Link href="/records" className="icon-action-card">
              <span className="action-icon-badge">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
                  <line x1="12" y1="11" x2="12" y2="17"/>
                  <line x1="9" y1="14" x2="15" y2="14"/>
                </svg>
              </span>
              <span className="action-label">{isHi ? "मेरा स्वास्थ्य पर्चा" : "My Health Records"}</span>
            </Link>

            <Link href="/education" className="icon-action-card">
              <span className="action-icon-badge">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
                  <polygon points="10 8 16 12 10 16 10 8" fill="currentColor"/>
                </svg>
              </span>
              <span className="action-label">{isHi ? "स्वास्थ्य शिक्षा वीडियो" : "Learn & Videos"}</span>
            </Link>

            <Link href="/chatbot" className="icon-action-card">
              <span className="action-icon-badge">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
              </span>
              <span className="action-label">{isHi ? "सखी महिला सहायता" : "Women's Care"}</span>
            </Link>

            <Link href="/community" className="icon-action-card">
              <span className="action-icon-badge">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              </span>
              <span className="action-label">{isHi ? "समुदाय सहायता मंच" : "Community Forum"}</span>
            </Link>

            <Link href="/marketplace" className="icon-action-card">
              <span className="action-icon-badge">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="9" cy="21" r="1"/>
                  <circle cx="20" cy="21" r="1"/>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                </svg>
              </span>
              <span className="action-label">{isHi ? "जन औषधि भंडार" : "Jan Aushadhi"}</span>
            </Link>

            <Link href="/nutrition" className="icon-action-card">
              <span className="action-icon-badge">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/>
                  <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
                </svg>
              </span>
              <span className="action-label">{isHi ? "स्थानीय पोषण व आहार" : "Local Nutrition"}</span>
            </Link>

            <Link href="/triage?mode=emergency" className="icon-action-card urgent">
              <span className="action-icon-badge">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
                  <line x1="12" y1="9" x2="12" y2="13"/>
                  <line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
              </span>
              <span className="action-label" style={{ color: "#dc2626" }}>{isHi ? "आपातकालीन एम्बुलेंस" : "Emergency Red Flag"}</span>
            </Link>
          </div>
        </section>

        {/* Three-Tier Channel Degradation Banner (§1, §3, §4) */}
        <section className="section alt">
          <div className="container">
            <div className="channel-strip">
              <div>
                <p className="eyebrow" style={{ color: "var(--forest)" }}>{isHi ? "बहु-माध्यम कनेक्टिविटी" : "MULTI-CHANNEL DEGRADATION"}</p>
                <h3 style={{ marginBottom: "6px" }}>{isHi ? "कोई मरीज न छूटे — हर फोन पर काम करता है" : "No Patient Left Behind — Works on Any Phone"}</h3>
                <p style={{ margin: 0, fontSize: "13.5px" }}>
                  {isHi
                    ? "जब 3G/4G सिग्नल न हो, तो सेतु स्वचालित रूप से एसएमएस और इंटरैक्टिव वॉयस कॉल (IVR) पर चलता है।"
                    : "When 3G/4G fails, Setu automatically continues via SMS and interactive voice call (IVR)."}
                </p>
              </div>

              <div className="channel-pill-group">
                <Link href="/" className="channel-pill active">
                  {isHi ? "स्मार्टफोन PWA (ऑफ़लाइन)" : "Smartphone PWA (Offline)"}
                </Link>
                <Link href="/channels" className="channel-pill">
                  {isHi ? "SMS (56767 पर भेजें)" : "SMS (Reply 56767)"}
                </Link>
                <Link href="/channels" className="channel-pill">
                  {isHi ? "USSD (*999#)" : "USSD (*999#)"}
                </Link>
                <Link href="/channels" className="channel-pill">
                  {isHi ? "IVR वॉयस कॉल" : "IVR Voice Call"}
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Clinician & Admin Portals Quick Overview (§2, §14) */}
        <section className="section container">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
            <div className="card">
              <span className="stat-tag">{isHi ? "स्वास्थ्य कार्यकर्ताओं एवं डॉक्टरों के लिए" : "For Health Workers & Doctors"}</span>
              <h3>{isHi ? "डॉक्टर व सहिया रेफरल पोर्टल" : "Clinician & ASHA Referral Portal"}</h3>
              <p>
                {isHi
                  ? "डॉ. अनन्या रॉय और सिस्टर सुनीता मिंज के लिए आपातकालीन अलर्ट देखने, प्रसवपूर्व जांच समय तय करने और एम्बुलेंस भेजने का पोर्टल।"
                  : "Lightweight portal for Dr. Ananya Roy and Sister Sunita Minz to review escalated triage alerts, manage upcoming ANC appointments, and dispatch emergency ambulances."}
              </p>
              <Link href="/clinician" className="button" style={{ width: "fit-content" }}>
                {isHi ? "डॉक्टर पोर्टल खोलें →" : "Open Clinician Portal →"}
              </Link>
            </div>

            <div className="card">
              <span className="stat-tag" style={{ background: "#faeede", color: "var(--clay)" }}>
                {isHi ? "प्रशासनिक निगरानी" : "Program Oversight"}
              </span>
              <h3>{isHi ? "विशुनपुर पायलट KPI डैशबोर्ड" : "Bishunpur Pilot KPI Dashboard"}</h3>
              <p>
                {isHi
                  ? "8 गांवों में 1,840 पंजीकृत मरीजों की वास्तविक निगरानी, 0% आपातकालीन त्रुटि दर, और 99.4% ऑफ़लाइन सिंक सफलता दर।"
                  : "Live monitoring of 1,840 registered patients across 8 villages, 0% red-flag false negative rate, 99.4% offline sync success rate, and 100% DPDP consent compliance."}
              </p>
              <Link href="/kpi" className="button clay" style={{ width: "fit-content" }}>
                {isHi ? "पायलट KPI देखें →" : "View Pilot KPIs →"}
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SetuFooter />
    </>
  );
}
