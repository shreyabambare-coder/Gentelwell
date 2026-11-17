"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import {
  getNetworkMode,
  setNetworkMode,
  getMutationQueue,
  syncPendingMutations
} from "../lib/offlineSync";

export default function SetuHeader() {
  const [open, setOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [networkMode, setMode] = useState(() => getNetworkMode());
  const [pendingCount, setPendingCount] = useState(() => {
    return getMutationQueue().filter((m) => m.syncStatus === "pending").length;
  });
  const [isSyncing, setIsSyncing] = useState(false);
  const [lang, setLang] = useState(() => {
    if (typeof window !== "undefined") {
      try {
        return localStorage.getItem("setu_lang") || "en";
      } catch {}
    }
    return "en";
  });

  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleNetworkChange = (e) => setMode(e.detail.mode);
    const handleSyncUpdate = () => {
      setPendingCount(getMutationQueue().filter((m) => m.syncStatus === "pending").length);
    };

    window.addEventListener("setu_network_change", handleNetworkChange);
    window.addEventListener("setu_sync_update", handleSyncUpdate);

    const handleGlobalLang = (e) => {
      if (e.detail?.lang) setLang(e.detail.lang);
    };
    window.addEventListener("setu_lang_change", handleGlobalLang);

    // Close 'More' dropdown when clicking outside
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setMoreOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("setu_network_change", handleNetworkChange);
      window.removeEventListener("setu_sync_update", handleSyncUpdate);
      window.removeEventListener("setu_lang_change", handleGlobalLang);
      document.removeEventListener("mousedown", handleClickOutside);
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
        ? "सांकेतिका में आपका स्वागत है। यहां आप डॉक्टर से मिलने का समय ले सकते हैं, लक्षण जांच सकते हैं, और नजदीकी अस्पताल ढूंढ सकते हैं।"
        : "Welcome to Sanketika. Tap any large button below to check symptoms, book clinic visits, or view your medical records.";
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

            {/* Mobile Simulator View Button */}
            <Link
              href="/mobile"
              style={{
                background: "rgba(255,255,255,0.18)",
                border: "1px solid rgba(255,255,255,0.3)",
                color: "#fff",
                padding: "2px 8px",
                borderRadius: "12px",
                fontSize: "11px",
                fontWeight: "600",
                display: "inline-flex",
                alignItems: "center",
                gap: "4px"
              }}
              title={isHi ? "मोबाइल व्यू सिम्युलेटर खोलें" : "Open Interactive Mobile Simulator"}
            >
              <span>📱</span>
              <span>{isHi ? "मोबाइल व्यू" : "Mobile View"}</span>
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
          <Link href="/" className="logo" aria-label="Sanketika Home">
            <img
              src="/logo.png"
              alt="Sanketika Logo"
              className="site-logo-img"
            />
            <div>
              <b>{isHi ? "सांकेतिका" : "Sanketika"}</b>
              <small>{isHi ? "महिला स्वास्थ्य एवं मातृत्व सेवा मंच" : "Women's Health & Maternal Platform"}</small>
            </div>
          </Link>

          {/* Center: Streamlined Primary Navigation (Zero Wrapping) */}
          <div className={`nav-links ${open ? "show" : ""}`}>
            <span className="mobile-nav-section-title">{isHi ? "मुख्य सेवाएं" : "Primary Services"}</span>

            <Link href="/" onClick={() => setOpen(false)}>
              {isHi ? "होम" : "Home"}
            </Link>
            <Link href="/triage" onClick={() => setOpen(false)}>
              {isHi ? "सखी AI" : "Sakhi AI"}
            </Link>
            <Link href="/lump-triage" onClick={() => setOpen(false)}>
              {isHi ? "गांठ जांच" : "Lump Check"}
            </Link>
            <Link href="/booking" onClick={() => setOpen(false)}>
              {isHi ? "अपॉइंटमेंट" : "Book Visit"}
            </Link>
            <Link href="/records" onClick={() => setOpen(false)}>
              {isHi ? "स्वास्थ्य रिकॉर्ड" : "My Records"}
            </Link>

            {/* Desktop 'More ▾' Dropdown / Mobile Grouped Sections */}
            <div className={`nav-dropdown ${moreOpen ? "is-open" : ""}`} ref={dropdownRef}>
              <button
                type="button"
                className="nav-dropdown-btn"
                onClick={() => setMoreOpen(!moreOpen)}
                aria-expanded={moreOpen}
              >
                <span>{isHi ? "अधिक सेवाएं" : "More"}</span>
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ transform: moreOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s ease" }}
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>

              {(moreOpen || open) && (
                <div className="nav-dropdown-menu">
                  <span className="nav-dropdown-header mobile-nav-section-title">
                    {isHi ? "देखभाल व समुदाय" : "Care & Resources"}
                  </span>
                  <Link href="/facilities" className="nav-dropdown-item" onClick={() => { setOpen(false); setMoreOpen(false); }}>
                    <span>🏥</span>
                    <span>{isHi ? "क्लीनिक व हाट" : "Clinics & Haat"}</span>
                  </Link>
                  <Link href="/chatbot" className="nav-dropdown-item" onClick={() => { setOpen(false); setMoreOpen(false); }}>
                    <span>💬</span>
                    <span>{isHi ? "महिला स्वास्थ्य चैट" : "Women's Care"}</span>
                  </Link>
                  <Link href="/education" className="nav-dropdown-item" onClick={() => { setOpen(false); setMoreOpen(false); }}>
                    <span>📚</span>
                    <span>{isHi ? "स्वास्थ्य शिक्षा" : "Learn"}</span>
                  </Link>
                  <Link href="/community" className="nav-dropdown-item" onClick={() => { setOpen(false); setMoreOpen(false); }}>
                    <span>👥</span>
                    <span>{isHi ? "समुदाय मंच" : "Community"}</span>
                  </Link>
                  <Link href="/marketplace" className="nav-dropdown-item" onClick={() => { setOpen(false); setMoreOpen(false); }}>
                    <span>💊</span>
                    <span>{isHi ? "जन औषधि केंद्र" : "Jan Aushadhi Store"}</span>
                  </Link>

                  <div className="nav-dropdown-divider" />

                  <span className="nav-dropdown-header mobile-nav-section-title">
                    {isHi ? "स्टाफ व डैशबोर्ड" : "Staff & Dashboards"}
                  </span>
                  <Link href="/clinician" className="nav-dropdown-item" onClick={() => { setOpen(false); setMoreOpen(false); }}>
                    <span>🩺</span>
                    <span>{isHi ? "डॉक्टर पोर्टल" : "Clinician Portal"}</span>
                  </Link>
                  <Link href="/kpi" className="nav-dropdown-item" onClick={() => { setOpen(false); setMoreOpen(false); }}>
                    <span>📊</span>
                    <span>{isHi ? "पायलट KPIs" : "Bishunpur KPIs"}</span>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile-only Household CTA */}
            <div className="mobile-only-household" style={{ display: "none" }}>
              <span className="mobile-nav-section-title">{isHi ? "खाता" : "Account"}</span>
              <Link
                href="/auth"
                className="nav-btn"
                onClick={() => setOpen(false)}
                style={{ width: "100%", justifyContent: "center", marginTop: "8px" }}
              >
                {isHi ? "परिवार खाता लॉगिन" : "Household Login"}
              </Link>
            </div>
          </div>

          {/* Right: Actions Group (Voice Guide + Household Button + Mobile Hamburger) */}
          <div className="nav-right-group">
            {/* Voice Prompt Button */}
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
                gap: "6px",
                whiteSpace: "nowrap"
              }}
              title={isHi ? "आवाज में निर्देश सुनें" : "Listen to page instructions in voice"}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
              </svg>
              <span className="hide-on-mobile">{isHi ? "आवाज सहायक" : "Voice Guide"}</span>
            </button>

            {/* Desktop Household CTA Button */}
            <Link href="/auth" className="nav-btn hide-on-mobile">
              {isHi ? "परिवार खाता" : "Household"}
            </Link>

            {/* Mobile Hamburger Toggle Button */}
            <button
              className="menu-button"
              onClick={() => setOpen(!open)}
              aria-label="Toggle navigation"
              aria-expanded={open}
            >
              {open ? "✕" : "☰"}
            </button>
          </div>
        </nav>
      </header>
    </>
  );
}
