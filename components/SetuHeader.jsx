"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  getNetworkMode,
  setNetworkMode,
  getMutationQueue,
  syncPendingMutations
} from "../lib/offlineSync";

export default function SetuHeader() {
  const [open, setOpen] = useState(false);
  const [networkMode, setMode] = useState("online");
  const [pendingCount, setPendingCount] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lang, setLang] = useState("en");

  useEffect(() => {
    setMode(getNetworkMode());
    setPendingCount(getMutationQueue().filter((m) => m.syncStatus === "pending").length);

    const handleNetworkChange = (e) => setMode(e.detail.mode);
    const handleSyncUpdate = (e) => {
      setPendingCount(getMutationQueue().filter((m) => m.syncStatus === "pending").length);
    };

    window.addEventListener("setu_network_change", handleNetworkChange);
    window.addEventListener("setu_sync_update", handleSyncUpdate);

    // Sync language from localStorage and global event
    try {
      const saved = localStorage.getItem("setu_lang");
      if (saved) setLang(saved);
    } catch {}

    const handleGlobalLang = (e) => {
      if (e.detail?.lang) setLang(e.detail.lang);
    };
    window.addEventListener("setu_lang_change", handleGlobalLang);

    return () => {
      window.removeEventListener("setu_network_change", handleNetworkChange);
      window.removeEventListener("setu_sync_update", handleSyncUpdate);
      window.removeEventListener("setu_lang_change", handleGlobalLang);
    };
  }, []);

  const handleLangToggle = (newLang) => {
    setLang(newLang);
    try {
      localStorage.setItem("setu_lang", newLang);
    } catch {}
    window.dispatchEvent(new CustomEvent("setu_lang_change", { detail: { lang: newLang } }));
  };

  const handleNetworkSelect = (e) => {
    const newMode = e.target.value;
    setNetworkMode(newMode);
    setMode(newMode);
  };

  const handleManualSync = async () => {
    if (isSyncing || networkMode === "offline") return;
    setIsSyncing(true);
    await syncPendingMutations();
    setIsSyncing(false);
  };

  // Voice narration of current screen for low-literacy users (§1, §11)
  const speakScreenIntro = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const text =
      lang === "hi"
        ? "सेतु स्वास्थ्य में आपका स्वागत है। यहां आप डॉक्टर से मिलने का समय ले सकते हैं, लक्षण जांच सकते हैं, और नजदीकी अस्पताल ढूंढ सकते हैं।"
        : "Welcome to Setu Health. Tap any large button below to check symptoms, book clinic visits, or view your medical records.";
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang === "hi" ? "hi-IN" : "en-US";
    window.speechSynthesis.speak(u);
  };

  const isHi = lang === "hi";

  return (
    <>
      {/* Setu Global Connectivity & Offline Status Bar (§1, §8, §12) */}
      <div className="setu-top-strip">
        <div className="container setu-top-strip-inner">
          <div className="signal-status-group">
            {/* Ascending Signal Bars Motif */}
            <div
              className={`signal-bars signal-level-${networkMode}`}
              title={`Network Connectivity: ${networkMode.toUpperCase()}`}
            >
              <div className="signal-bar"></div>
              <div className="signal-bar"></div>
              <div className="signal-bar"></div>
              <div className="signal-bar"></div>
            </div>
            <span>
              <b>{isHi ? "सिग्नल:" : "Signal:"}</b>{" "}
              {networkMode === "online"
                ? isHi ? "3G/4G मजबूत" : "3G/4G Strong"
                : networkMode === "weak_2g"
                ? isHi ? "2G कमजोर (पहाड़ी क्षेत्र)" : "2G Edge (Intermittent)"
                : isHi ? "सिग्नल नहीं (ऑफ़लाइन मोड)" : "No Signal (Offline-First Mode)"}
            </span>

            {/* Test Simulation Switcher */}
            <select
              className="network-toggle-select"
              value={networkMode}
              onChange={handleNetworkSelect}
              title="Simulate Rural Network Signal"
            >
              <option value="online">{isHi ? "🟢 ऑनलाइन (4G/WiFi)" : "🟢 Online (4G/WiFi)"}</option>
              <option value="weak_2g">{isHi ? "🟡 कमजोर 2G (महाराष्ट्र)" : "🟡 2G Weak (Maharashtra Rural)"}</option>
              <option value="offline">{isHi ? "🔴 ऑफ़लाइन (शून्य सिग्नल)" : "🔴 Offline (Deep Forest Zero-Signal)"}</option>
            </select>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {/* Offline Sync Status Badge */}
            <div
              className="sync-badge"
              onClick={handleManualSync}
              title={isHi ? "सर्वर से डेटा सिंक करने के लिए क्लिक करें" : "Click to trigger delta sync with regional server"}
            >
              <span>{isSyncing ? "🔄" : pendingCount > 0 ? "⏳" : "✓"}</span>
              <span>
                {isSyncing
                  ? isHi ? "सिंक हो रहा है..." : "Syncing..."
                  : pendingCount > 0
                  ? isHi ? `${pendingCount} ऑफ़लाइन कतारबद्ध (सिंक करें)` : `${pendingCount} Offline Queued (Sync)`
                  : isHi ? "सभी रिकॉर्ड सिंक हैं" : "All Records Synced"}
              </span>
            </div>

            {/* Multi-Channel Fallback Quick Link (§1, §3) */}
            <Link
              href="/channels"
              style={{
                background: "var(--rose)",
                color: "#fff",
                padding: "3px 9px",
                borderRadius: "10px",
                fontSize: "11px",
                fontWeight: "bold"
              }}
            >
              {isHi ? "SMS / कॉल सेवा" : "USSD / SMS / IVR"}
            </Link>

            {/* Language Switcher */}
            <button
              type="button"
              onClick={() => handleLangToggle(isHi ? "en" : "hi")}
              style={{
                background: isHi ? "var(--purple)" : "rgba(255,255,255,0.15)",
                border: "1px solid rgba(255,255,255,0.4)",
                color: "#fff",
                borderRadius: "12px",
                padding: "2px 8px",
                fontSize: "11px",
                fontWeight: "600",
                cursor: "pointer"
              }}
            >
              {isHi ? "English" : "हिन्दी"}
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <header className="site-header">
        <nav className="container nav">
          <Link href="/" className="logo">
            <span className="logo-icon" style={{ background: "#8d68bb", color: "#fff", display: "grid", placeItems: "center" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2v20M2 12h20"/>
              </svg>
            </span>
            <div>
              <b>{isHi ? "सेतु स्वास्थ्य" : "Setu Health"}</b>
              <small>{isHi ? "महाराष्ट्र स्वास्थ्य सेवा मंच" : "Maharashtra Healthcare Platform"}</small>
            </div>
          </Link>

          {/* Voice Prompt Button for Low-Literacy Users (§1, §2) */}
          <button
            type="button"
            onClick={speakScreenIntro}
            style={{
              background: "var(--sage)",
              border: "1.5px solid var(--line)",
              color: "var(--forest)",
              padding: "6px 12px",
              borderRadius: "20px",
              fontSize: "12px",
              fontWeight: "600",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px"
            }}
            title={isHi ? "आवाज में निर्देश सुनें" : "Listen to page instructions in voice"}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
            </svg>
            <span className="hide-on-mobile">{isHi ? "आवाज सहायक" : "Voice Guide"}</span>
          </button>

          <button
            className="menu-button"
            onClick={() => setOpen(!open)}
            aria-label="Toggle navigation"
            aria-expanded={open}
          >
            ☰
          </button>

          <div className={`nav-links ${open ? "show" : ""}`}>
            <Link href="/" onClick={() => setOpen(false)}>
              {isHi ? "होम" : "Home"}
            </Link>
            <Link href="/triage" onClick={() => setOpen(false)}>
              {isHi ? "लक्षण जांच" : "Triage AI"}
            </Link>
            <Link href="/lump-triage" onClick={() => setOpen(false)}>
              {isHi ? "गांठ / लिपोमा RAG" : "Lump RAG"}
            </Link>
            <Link href="/booking" onClick={() => setOpen(false)}>
              {isHi ? "अपॉइंटमेंट" : "Book Visit"}
            </Link>
            <Link href="/facilities" onClick={() => setOpen(false)}>
              {isHi ? "क्लीनिक व अस्पताल" : "Clinics & Haat"}
            </Link>
            <Link href="/records" onClick={() => setOpen(false)}>
              {isHi ? "स्वास्थ्य रिकॉर्ड" : "My Records"}
            </Link>
            <Link href="/education" onClick={() => setOpen(false)}>
              {isHi ? "शिक्षा" : "Learn"}
            </Link>
            <Link href="/chatbot" onClick={() => setOpen(false)}>
              {isHi ? "महिला स्वास्थ्य" : "Women's Care"}
            </Link>
            <Link href="/community" onClick={() => setOpen(false)}>
              {isHi ? "समुदाय मंच" : "Community"}
            </Link>
            <Link href="/marketplace" onClick={() => setOpen(false)}>
              {isHi ? "जन औषधि केंद्र" : "Jan Aushadhi"}
            </Link>
            <Link href="/clinician" onClick={() => setOpen(false)}>
              {isHi ? "डॉक्टर पोर्टल" : "Clinician"}
            </Link>
            <Link href="/kpi" onClick={() => setOpen(false)}>
              {isHi ? "डैशबोर्ड" : "KPIs"}
            </Link>
            <Link href="/auth" className="nav-btn" onClick={() => setOpen(false)}>
              {isHi ? "परिवार खाता" : "Household"}
            </Link>
          </div>
        </nav>
      </header>
    </>
  );
}
