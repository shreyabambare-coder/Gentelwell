"use client";

import { useState } from "react";
import SetuHeader from "../../components/SetuHeader";
import SetuFooter from "../../components/SetuFooter";
import { EDUCATION_LIBRARY } from "../../lib/setuData";

export default function EducationPage() {
  const [downloadedIds, setDownloadedIds] = useState(["edu-1"]); // edu-1 pre-cached
  const [downloadingId, setDownloadingId] = useState(null);
  const [lang, setLang] = useState("hi"); // Hindi voice first (§1, §3.2)
  const [playingVideo, setPlayingVideo] = useState(null);

  const handleDownload = (id) => {
    setDownloadingId(id);
    setTimeout(() => {
      setDownloadedIds([...downloadedIds, id]);
      setDownloadingId(null);
    }, 1500);
  };

  const speakNarration = (text) => {
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
          <p className="eyebrow">OFFLINE AUDIO-VIDEO LIBRARY (§3.2)</p>
          <h1>Health Education with Voice Narration</h1>
          <p style={{ maxWidth: "660px", margin: "8px auto 0" }}>
            Mandatory voice narration in Hindi and English. Downloadable videos play 100% offline 
            with zero mobile data required after download.
          </p>
        </div>

        {/* Language & Storage Status Bar */}
        <div
          style={{
            maxWidth: "840px",
            margin: "0 auto 28px",
            background: "var(--sage)",
            padding: "14px 20px",
            borderRadius: "14px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "12px"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "13px", fontWeight: "600" }}>Voice Narration Track:</span>
            <button
              type="button"
              className={`button ${lang === "hi" ? "" : "ghost"}`}
              style={{ minHeight: "34px", padding: "4px 12px", fontSize: "12px" }}
              onClick={() => setLang("hi")}
            >
              हिन्दी (Hindi Voice)
            </button>
            <button
              type="button"
              className={`button ${lang === "en" ? "" : "ghost"}`}
              style={{ minHeight: "34px", padding: "4px 12px", fontSize: "12px" }}
              onClick={() => setLang("en")}
            >
              English
            </button>
          </div>

          <div style={{ fontSize: "12px", color: "var(--slate)" }}>
            💾 Offline Device Storage: <b>{downloadedIds.length} Videos Cached (Ready Offline)</b>
          </div>
        </div>

        {/* Video Player Modal */}
        {playingVideo && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.8)",
              zIndex: 100,
              display: "grid",
              placeItems: "center",
              padding: "20px"
            }}
            onClick={() => setPlayingVideo(null)}
          >
            <div
              style={{
                background: "#000",
                borderRadius: "16px",
                maxWidth: "720px",
                width: "100%",
                overflow: "hidden"
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ padding: "12px 18px", background: "var(--ink)", color: "#fff", display: "flex", justifyContent: "space-between" }}>
                <b>{playingVideo.title}</b>
                <button
                  type="button"
                  style={{ background: "none", border: 0, color: "#fff", fontSize: "18px", cursor: "pointer" }}
                  onClick={() => setPlayingVideo(null)}
                >
                  ✕
                </button>
              </div>
              <div style={{ position: "relative", paddingBottom: "56.25%", height: 0 }}>
                <iframe
                  src={playingVideo.videoUrl}
                  title={playingVideo.title}
                  style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: 0 }}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          </div>
        )}

        {/* Library Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "24px" }}>
          {EDUCATION_LIBRARY.map((item) => {
            const isDownloaded = downloadedIds.includes(item.id);
            const isDownloading = downloadingId === item.id;

            return (
              <div key={item.id} className="card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                    <span className="stat-tag">{item.category}</span>
                    <span style={{ fontSize: "12px", color: "var(--slate)" }}>⏱️ {item.duration}</span>
                  </div>

                  <h3 style={{ fontSize: "18px", marginBottom: "6px" }}>{item.title}</h3>
                  <div style={{ fontSize: "13px", color: "var(--forest)", fontWeight: "600", marginBottom: "10px" }}>
                    {item.titleHi}
                  </div>

                  <p style={{ fontSize: "13px", color: "var(--slate)", lineHeight: "1.5" }}>
                    {lang === "hi" ? item.summaryHi : item.summary}
                  </p>

                  {/* Key Takeaways */}
                  <div style={{ background: "var(--sage)", padding: "12px", borderRadius: "10px", margin: "14px 0", fontSize: "12px" }}>
                    <b style={{ color: "var(--forest)", display: "block", marginBottom: "4px" }}>
                      Key Takeaways (मुख्य बिंदु):
                    </b>
                    <ul style={{ margin: "4px 0 0 16px", padding: 0, color: "var(--ink)" }}>
                      {item.keyPoints.map((pt, i) => (
                        <li key={i}>{pt}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Actions: Voice Narration, Play, Download */}
                <div style={{ borderTop: "1px solid var(--line)", paddingTop: "14px", display: "flex", flexDirection: "column", gap: "8px" }}>
                  <button
                    type="button"
                    className="button ghost"
                    style={{ minHeight: "38px", fontSize: "12px" }}
                    onClick={() => speakNarration(lang === "hi" ? item.summaryHi : item.summary)}
                  >
                    🔊 Listen to Voice Summary ({lang === "hi" ? "हिन्दी" : "English"})
                  </button>

                  <div style={{ display: "flex", gap: "8px" }}>
                    <button
                      type="button"
                      className="button"
                      style={{ flex: 1, minHeight: "38px", fontSize: "12.5px" }}
                      onClick={() => setPlayingVideo(item)}
                    >
                      ▶ Watch Video
                    </button>

                    <button
                      type="button"
                      className={`button ${isDownloaded ? "ghost" : "clay"}`}
                      style={{ minHeight: "38px", fontSize: "12px", padding: "6px 12px" }}
                      onClick={() => handleDownload(item.id)}
                      disabled={isDownloaded || isDownloading}
                    >
                      {isDownloaded
                        ? "✓ Cached (Offline)"
                        : isDownloading
                        ? "Downloading..."
                        : `⬇ Download (${item.offlineSizeMb} MB)`}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>
      <SetuFooter />
    </>
  );
}
