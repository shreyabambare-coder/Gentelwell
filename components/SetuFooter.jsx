"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function SetuFooter() {
  const [lang, setLang] = useState("en");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("setu_lang");
      if (saved) setLang(saved);
    } catch {}

    const handleGlobalLang = (e) => {
      if (e.detail?.lang) setLang(e.detail.lang);
    };
    window.addEventListener("setu_lang_change", handleGlobalLang);
    return () => window.removeEventListener("setu_lang_change", handleGlobalLang);
  }, []);

  const isHi = lang === "hi";

  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <Link href="/" className="logo" style={{ color: "#ffffff", marginBottom: "12px" }}>
            <span className="logo-icon" style={{ background: "#8d68bb", display: "grid", placeItems: "center" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2v20M2 12h20"/>
              </svg>
            </span>
            <div>
              <b>{isHi ? "सेतु स्वास्थ्य" : "Setu Health"}</b>
              <small style={{ color: "#d3ccdc" }}>
                {isHi ? "ग्रामीण स्वास्थ्य एवं मातृत्व देखभाल मंच" : "Offline-First Rural Healthcare Platform"}
              </small>
            </div>
          </Link>
          <p>
            {isHi
              ? "महाराष्ट्र के ग्रामीण एवं अर्ध-शहरी क्षेत्रों में अंतिम छोर तक नैदानिक व मातृत्व देखभाल पहुंचाना। कमजोर 2G नेटवर्क और एसएमएस/आईवीआर बैकअप के लिए विशेष रूप से निर्मित।"
              : "Bridging healthcare and maternal clinical care across Maharashtra districts (Mumbai, Pune, Palghar). Designed for low-bandwidth connections, low-literacy users, and fallback to SMS & IVR."}
          </p>
          <p style={{ fontSize: "12px", color: "#8faea2", marginTop: "10px" }}>
            <b>{isHi ? "आपातकालीन सेवाएं:" : "Emergency Services:"}</b> {isHi ? "कॉल करें" : "Call"} <b>112</b> {isHi ? "या" : "or"} <b>108</b> ({isHi ? "सरकारी एम्बुलेंस" : "Govt Ambulance"}) · <b>1091</b> ({isHi ? "महिला हेल्पलाइन" : "Women Helpline"})
          </p>
        </div>

        <div>
          <h4>{isHi ? "प्रमुख सेवाएं" : "Core Services"}</h4>
          <Link href="/triage">{isHi ? "प्राथमिक लक्षण जांच" : "Advisory Symptom Triage"}</Link>
          <Link href="/lump-triage">{isHi ? "गांठ / लिपोमा RAG मूल्यांकन" : "Lump & Lipoma RAG Triage"}</Link>
          <Link href="/booking">{isHi ? "क्लीनिक समय बुकिंग" : "Clinic Appointment Booking"}</Link>
          <Link href="/facilities">{isHi ? "नजदीकी स्वास्थ्य केंद्र" : "Nearby PHC / CHC Directory"}</Link>
          <Link href="/records">{isHi ? "डिजिटल स्वास्थ्य रिकॉर्ड" : "Longitudinal FHIR Health Records"}</Link>
          <Link href="/community">{isHi ? "समुदाय सहायता मंच" : "Community Support Forum"}</Link>
          <Link href="/marketplace">{isHi ? "जन औषधि दवा भंडार" : "Affordable Healthcare Marketplace"}</Link>
          <Link href="/nutrition">{isHi ? "पोषण एवं आहार मार्गदर्शिका" : "Local Rural Nutrition Guide"}</Link>
        </div>

        <div>
          <h4>{isHi ? "पहुंच के माध्यम" : "Access Channels (§1, §3)"}</h4>
          <Link href="/">{isHi ? "ऑफ़लाइन PWA ऐप" : "Offline PWA (Smartphones)"}</Link>
          <Link href="/channels">{isHi ? "एसएमएस सेवा (56767)" : "SMS Service (Reply to 56767)"}</Link>
          <Link href="/channels">{isHi ? "USSD त्वरित मेनू (*999#)" : "USSD (*999# Quick Menu)"}</Link>
          <Link href="/channels">{isHi ? "IVR वॉयस हेल्पलाइन" : "IVR Voice Dial-in (1800-SETU-HLTH)"}</Link>
          <Link href="/chatbot">{isHi ? "सखी महिला चैटबॉट" : "Sakhi Women's Health Chatbot"}</Link>
        </div>

        <div>
          <h4>{isHi ? "चिकित्सीय अनुपालन" : "Clinical & Compliance"}</h4>
          <Link href="/clinician">{isHi ? "डॉक्टर समीक्षा पोर्टल" : "Clinician Review Portal"}</Link>
          <Link href="/kpi">{isHi ? "प्रशासनिक KPI डैशबोर्ड" : "Program Admin KPI Dashboard"}</Link>
          <Link href="/auth">{isHi ? "डेटा संरक्षण सहमति" : "DPDP Act 2023 Consent Logs"}</Link>
          <a href="#compliance" style={{ cursor: "default" }}>
            {isHi ? "आयुष्मान भारत (ABDM) तैयार" : "ABDM FHIR R4 Ready"}
          </a>
          <a href="#chw" style={{ cursor: "default" }}>
            {isHi ? "आशा / सहिया समुदाय किट" : "ASHA / Sahiya Community Kit"}
          </a>
        </div>
      </div>

      <div className="container footer-disclaimer">
        <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "10px" }}>
          <span>
            {isHi
              ? "सेतु स्वास्थ्य भारत के डिजिटल व्यक्तिगत डेटा संरक्षण अधिनियम (DPDP) 2023 के अनुरूप एक सलाहकार मंच है। AI परिणाम केवल निर्णय सहायता के लिए हैं।"
              : "Setu Health is an advisory platform compliant with India's Digital Personal Data Protection (DPDP) Act 2023. AI symptom checker outputs are non-diagnostic decision support."}
          </span>
          <span>{isHi ? "महाराष्ट्र स्वास्थ्य नेटवर्क (मुंबई, पुणे, पालघर, कोल्हापुर)" : "Maharashtra Healthcare Network (Mumbai, Pune, Palghar, Kolhapur)"}</span>
        </div>
      </div>
    </footer>
  );
}
