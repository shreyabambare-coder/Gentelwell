"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

function subscribeToLang(callback) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("setu_lang_change", callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener("setu_lang_change", callback);
    window.removeEventListener("storage", callback);
  };
}

function getLangSnapshot() {
  if (typeof window === "undefined") return "en";
  try {
    return localStorage.getItem("setu_lang") || "en";
  } catch {
    return "en";
  }
}

function getLangServerSnapshot() {
  return "en";
}

export default function AiTriageRobot() {
  const pathname = usePathname();
  const lang = useSyncExternalStore(subscribeToLang, getLangSnapshot, getLangServerSnapshot);
  const [showTooltip, setShowTooltip] = useState(true);

  const isHi = lang === "hi";
  const isTriage = pathname === "/triage";
  const isMobileSim = pathname === "/mobile";

  if (isMobileSim) return null;

  return (
    <>
      <div className="ai-triage-floating-widget" aria-label="Sakhi AI Triage Assistant">
        {/* Floating Speech Bubble / Tooltip */}
        {showTooltip && (
          <div className="ai-triage-bubble">
            <span className="bubble-icon">🩺</span>
            <div className="bubble-text">
              <b>{isHi ? "मदद चाहिए?" : "Need help?"}</b>
              <small>{isHi ? "सखी से लक्षण जांचें" : "Check symptoms with Sakhi"}</small>
            </div>
            <button
              type="button"
              className="bubble-close-btn"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowTooltip(false);
              }}
              title={isHi ? "बंद करें" : "Dismiss"}
            >
              ×
            </button>
            <div className="bubble-arrow" />
          </div>
        )}

        {/* Main Floating Robot Button */}
        <Link
          href="/triage"
          className={`ai-robot-btn ${isTriage ? "is-active" : ""}`}
          title={isHi ? "सखी पर जाएं (लक्षण जांच)" : "Ask Sakhi (AI Triage)"}
        >
          {/* Pulsing Green "Online/Ready" Status Dot */}
          <span className="robot-status-dot" title="Sakhi AI Ready">
            <span className="robot-status-ping" />
          </span>

          {/* Cute Robot Avatar */}
          <div className="robot-avatar">
            <svg
              width="40"
              height="40"
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="robot-svg"
            >
              {/* Antenna */}
              <line x1="24" y1="10" x2="24" y2="4" stroke="#ffd166" strokeWidth="2.5" strokeLinecap="round" />
              <circle cx="24" cy="3.5" r="3" fill="#ffd166" className="antenna-glow" />

              {/* Ears */}
              <rect x="5" y="18" width="4" height="9" rx="2" fill="#c084fc" />
              <rect x="39" y="18" width="4" height="9" rx="2" fill="#c084fc" />

              {/* Head Shell */}
              <rect
                x="8"
                y="9"
                width="32"
                height="27"
                rx="10"
                fill="#ffffff"
                stroke="#c084fc"
                strokeWidth="2.2"
              />

              {/* Medical Red Cross on Forehead */}
              <path
                d="M24 11.5v4M22 13.5h4"
                stroke="#ef4444"
                strokeWidth="2"
                strokeLinecap="round"
              />

              {/* Dark Visor Display */}
              <rect x="12" y="16.5" width="24" height="13.5" rx="5" fill="#1e1635" />

              {/* Glowing LED Eyes */}
              <circle cx="18" cy="23" r="2.8" fill="#38bdf8" />
              <circle cx="30" cy="23" r="2.8" fill="#38bdf8" />

              {/* Eye Catchlights */}
              <circle cx="19" cy="22" r="0.9" fill="#ffffff" />
              <circle cx="31" cy="22" r="0.9" fill="#ffffff" />

              {/* Friendly LED Smile */}
              <path
                d="M20.5 26.5 Q24 28.5 27.5 26.5"
                stroke="#38bdf8"
                strokeWidth="1.6"
                strokeLinecap="round"
                fill="none"
              />

              {/* Rosy Cheeks */}
              <ellipse cx="13.5" cy="26" rx="1.6" ry="1.2" fill="#f472b6" opacity="0.85" />
              <ellipse cx="34.5" cy="26" rx="1.6" ry="1.2" fill="#f472b6" opacity="0.85" />

              {/* Neck & Body base */}
              <path
                d="M16 36.5v2.5c0 2 3.5 3 8 3s8-1 8-3v-2.5"
                stroke="#c084fc"
                strokeWidth="2"
                fill="#f5f3ff"
              />

              {/* ECG Heartbeat line on chest */}
              <path
                d="M19.5 39.5h1.5l1.2-2.2 1.6 4.2 1.5-3 1.2 1h2"
                stroke="#ef4444"
                strokeWidth="1.3"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </svg>
          </div>

          {/* Text Badge */}
          <div className="robot-label">
            <div className="robot-title">
              <span>{isHi ? "सखी AI" : "SAKHI"}</span>
              <span className="live-pill">{isTriage ? "ACTIVE" : "AI"}</span>
            </div>
            <div className="robot-subtitle">
              {isHi ? "लक्षण जांच" : "AI Triage"}
            </div>
          </div>
        </Link>
      </div>

      <style jsx global>{`
        .ai-triage-floating-widget {
          position: fixed;
          bottom: 24px;
          right: 24px;
          z-index: 9999;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 10px;
          font-family: var(--font-body, system-ui, -apple-system, sans-serif);
          pointer-events: auto;
        }

        /* Speech Bubble */
        .ai-triage-bubble {
          background: #ffffff;
          color: #2b223d;
          padding: 8px 12px;
          border-radius: 14px;
          box-shadow: 0 8px 24px rgba(43, 34, 61, 0.16), 0 2px 6px rgba(0, 0, 0, 0.06);
          border: 1.5px solid #e9e1ef;
          display: flex;
          align-items: center;
          gap: 8px;
          position: relative;
          max-width: 260px;
          animation: robotBubbleFloat 3.5s ease-in-out infinite;
        }

        .bubble-icon {
          font-size: 20px;
          line-height: 1;
        }

        .bubble-text {
          display: flex;
          flex-direction: column;
          line-height: 1.25;
        }

        .bubble-text b {
          font-size: 12.5px;
          color: #352c4a;
        }

        .bubble-text small {
          font-size: 11px;
          color: #716a7e;
        }

        .bubble-close-btn {
          background: transparent;
          border: none;
          color: #9ca3af;
          cursor: pointer;
          font-size: 18px;
          padding: 0 4px;
          line-height: 1;
          border-radius: 50%;
          transition: color 0.15s ease;
        }

        .bubble-close-btn:hover {
          color: #4b5563;
        }

        .bubble-arrow {
          position: absolute;
          bottom: -6px;
          right: 32px;
          width: 11px;
          height: 11px;
          background: #ffffff;
          border-right: 1.5px solid #e9e1ef;
          border-bottom: 1.5px solid #e9e1ef;
          transform: rotate(45deg);
        }

        /* Robot Button Pill */
        .ai-robot-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          background: linear-gradient(135deg, #7551a6 0%, #df6d91 100%);
          padding: 7px 18px 7px 8px;
          border-radius: 40px;
          box-shadow: 0 10px 28px rgba(117, 81, 166, 0.42), 0 3px 10px rgba(223, 109, 145, 0.28);
          cursor: pointer;
          text-decoration: none;
          position: relative;
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          border: 2px solid rgba(255, 255, 255, 0.35);
          animation: robotPulseSlow 4s ease-in-out infinite;
        }

        .ai-robot-btn:hover {
          transform: translateY(-4px) scale(1.04);
          box-shadow: 0 14px 34px rgba(117, 81, 166, 0.55), 0 4px 14px rgba(223, 109, 145, 0.4);
        }

        .ai-robot-btn:active {
          transform: translateY(0) scale(0.97);
        }

        .ai-robot-btn.is-active {
          background: linear-gradient(135deg, #5b3c8b 0%, #c44f77 100%);
          border-color: #22c55e;
        }

        /* Status Dot */
        .robot-status-dot {
          position: absolute;
          top: 4px;
          left: 42px;
          width: 12px;
          height: 12px;
          background: #22c55e;
          border: 2px solid #ffffff;
          border-radius: 50%;
          z-index: 2;
        }

        .robot-status-ping {
          position: absolute;
          top: -2px;
          left: -2px;
          width: 12px;
          height: 12px;
          background: #22c55e;
          border-radius: 50%;
          opacity: 0.75;
          animation: statusPing 2s cubic-bezier(0, 0, 0.2, 1) infinite;
        }

        /* Avatar Container */
        .robot-avatar {
          width: 46px;
          height: 46px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.18);
          backdrop-filter: blur(6px);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: transform 0.3s ease;
        }

        .ai-robot-btn:hover .robot-avatar {
          transform: rotate(8deg) scale(1.08);
        }

        .robot-svg {
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
        }

        .antenna-glow {
          animation: antennaFlash 2s infinite ease-in-out;
        }

        /* Text Label */
        .robot-label {
          color: #ffffff;
          display: flex;
          flex-direction: column;
          line-height: 1.15;
        }

        .robot-title {
          font-size: 13.5px;
          font-weight: 800;
          letter-spacing: 0.5px;
          display: flex;
          align-items: center;
          gap: 6px;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.25);
        }

        .live-pill {
          font-size: 9.5px;
          font-weight: 700;
          background: rgba(255, 255, 255, 0.25);
          padding: 2px 6px;
          border-radius: 8px;
          letter-spacing: 0.4px;
        }

        .robot-subtitle {
          font-size: 10.5px;
          opacity: 0.92;
          font-weight: 500;
          margin-top: 2px;
        }

        /* Keyframe Animations */
        @keyframes robotBubbleFloat {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-4px);
          }
        }

        @keyframes robotPulseSlow {
          0%, 100% {
            box-shadow: 0 10px 28px rgba(117, 81, 166, 0.42), 0 3px 10px rgba(223, 109, 145, 0.28);
          }
          50% {
            box-shadow: 0 12px 34px rgba(117, 81, 166, 0.6), 0 4px 14px rgba(223, 109, 145, 0.4);
          }
        }

        @keyframes antennaFlash {
          0%, 100% {
            fill: #ffd166;
            filter: drop-shadow(0 0 2px #ffd166);
          }
          50% {
            fill: #f59e0b;
            filter: drop-shadow(0 0 6px #f59e0b);
          }
        }

        @keyframes statusPing {
          0% {
            transform: scale(1);
            opacity: 0.8;
          }
          75%, 100% {
            transform: scale(2.2);
            opacity: 0;
          }
        }

        /* Mobile adaptation */
        @media (max-width: 640px) {
          .ai-triage-floating-widget {
            bottom: 18px;
            right: 14px;
          }
          .ai-robot-btn {
            padding: 6px 14px 6px 6px;
          }
          .robot-avatar {
            width: 42px;
            height: 42px;
          }
          .robot-status-dot {
            left: 36px;
          }
          .robot-title {
            font-size: 12.5px;
          }
          .ai-triage-bubble {
            max-width: 220px;
          }
        }
      `}</style>
    </>
  );
}
