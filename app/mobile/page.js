"use client";

import { useState } from "react";
import Link from "next/link";

const DEVICES = [
  { name: "iPhone 15 Pro", width: 393, height: 852, notch: "island" },
  { name: "Google Pixel 8", width: 412, height: 915, notch: "punch" },
  { name: "Samsung Galaxy S24", width: 360, height: 780, notch: "punch" },
  { name: "Compact Phone (Rural 2G)", width: 320, height: 600, notch: "top-bar" },
  { name: "iPad / Tablet", width: 768, height: 1024, notch: "none" }
];

const PAGES = [
  { name: "🏠 Home", path: "/" },
  { name: "🩺 Sakhi AI Triage", path: "/triage" },
  { name: "🔬 Lump & Swelling Check", path: "/lump-triage" },
  { name: "💬 Women's Care Chat", path: "/chatbot" },
  { name: "📅 Book Clinic Visit", path: "/booking" },
  { name: "🏥 Clinics & Haat", path: "/facilities" },
  { name: "📋 My Medical Records", path: "/records" },
  { name: "📚 Health Education", path: "/education" },
  { name: "💊 Jan Aushadhi Store", path: "/marketplace" },
  { name: "📊 Bishunpur Pilot KPIs", path: "/kpi" },
  { name: "📞 USSD / SMS / Channels", path: "/channels" }
];

export default function MobileSimulatorPage() {
  const [selectedDevice, setSelectedDevice] = useState(DEVICES[0]);
  const [currentPath, setCurrentPath] = useState("/");
  const [isLandscape, setIsLandscape] = useState(false);
  const [zoom, setZoom] = useState(1);

  const screenWidth = isLandscape ? selectedDevice.height : selectedDevice.width;
  const screenHeight = isLandscape ? selectedDevice.width : selectedDevice.height;

  return (
    <div className="mobile-sim-container">
      {/* Top Controls Toolbar */}
      <header className="mobile-sim-toolbar">
        <div className="sim-toolbar-left">
          <Link href="/" className="sim-back-link">
            ← Back to Desktop Site
          </Link>
          <div className="sim-title-group">
            <h1>📱 Mobile Responsive Simulator</h1>
            <span className="sim-badge">Live Interactive Preview</span>
          </div>
        </div>

        <div className="sim-controls-grid">
          {/* Device Selector */}
          <div className="sim-control-item">
            <label>Device Preset:</label>
            <select
              value={selectedDevice.name}
              onChange={(e) => {
                const dev = DEVICES.find((d) => d.name === e.target.value);
                if (dev) setSelectedDevice(dev);
              }}
            >
              {DEVICES.map((d) => (
                <option key={d.name} value={d.name}>
                  {d.name} ({d.width}×{d.height}px)
                </option>
              ))}
            </select>
          </div>

          {/* Page Selector */}
          <div className="sim-control-item">
            <label>Screen Page:</label>
            <select
              value={currentPath}
              onChange={(e) => setCurrentPath(e.target.value)}
            >
              {PAGES.map((p) => (
                <option key={p.path} value={p.path}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* Orientation Toggle */}
          <button
            type="button"
            className={`sim-btn ${isLandscape ? "active" : ""}`}
            onClick={() => setIsLandscape(!isLandscape)}
            title="Rotate phone orientation"
          >
            🔄 {isLandscape ? "Landscape" : "Portrait"}
          </button>

          {/* Zoom controls */}
          <div className="sim-control-item">
            <label>Scale:</label>
            <select
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
            >
              <option value="0.8">80%</option>
              <option value="0.9">90%</option>
              <option value="1">100% (Real Size)</option>
            </select>
          </div>
        </div>
      </header>

      {/* Network Testing Banner */}
      <div className="sim-network-strip">
        <span>📶 <b>Physical Phone Testing:</b> Open <code>http://192.168.1.7:3000</code> on your mobile device browser connected to the same Wi-Fi.</span>
        <span>💡 <b>Browser Shortcut:</b> Press <code>Ctrl + Shift + M</code> (or <code>F12</code>) in Chrome/Edge to toggle DevTools device mode.</span>
      </div>

      {/* Center Phone Frame Stage */}
      <main className="mobile-sim-stage">
        <div
          className="phone-frame"
          style={{
            width: `${screenWidth + 24}px`,
            height: `${screenHeight + 28}px`,
            transform: `scale(${zoom})`,
            transformOrigin: "top center"
          }}
        >
          {/* Outer Bezel */}
          <div className="phone-bezel">
            {/* Top Notch / Dynamic Island */}
            {selectedDevice.notch === "island" && !isLandscape && (
              <div className="dynamic-island">
                <span className="camera-lens" />
                <span className="sensor" />
              </div>
            )}
            {selectedDevice.notch === "punch" && !isLandscape && (
              <div className="camera-punch" />
            )}

            {/* Inner Interactive Screen Iframe */}
            <iframe
              src={currentPath}
              className="phone-screen"
              title="Mobile Responsive Preview"
              style={{
                width: `${screenWidth}px`,
                height: `${screenHeight}px`
              }}
            />

            {/* Home Bar Indicator (iOS style) */}
            {!isLandscape && <div className="phone-home-indicator" />}
          </div>
        </div>
      </main>

      <style jsx>{`
        .mobile-sim-container {
          min-height: 100vh;
          background: #181424;
          color: #f1edfa;
          font-family: var(--font-body, system-ui, -apple-system, sans-serif);
          display: flex;
          flex-direction: column;
        }

        .mobile-sim-toolbar {
          background: #231c34;
          border-bottom: 1px solid #3c3254;
          padding: 14px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 16px;
        }

        .sim-toolbar-left {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .sim-back-link {
          color: #df6d91;
          font-size: 13px;
          font-weight: 600;
          text-decoration: none;
          transition: color 0.15s;
        }

        .sim-back-link:hover {
          color: #f48fb1;
          text-decoration: underline;
        }

        .sim-title-group {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .sim-title-group h1 {
          font-size: 20px;
          margin: 0;
          font-weight: 700;
          color: #ffffff;
        }

        .sim-badge {
          background: rgba(34, 197, 94, 0.2);
          color: #4ade80;
          border: 1px solid rgba(74, 222, 128, 0.4);
          font-size: 11px;
          padding: 2px 8px;
          border-radius: 12px;
          font-weight: 600;
        }

        .sim-controls-grid {
          display: flex;
          align-items: center;
          gap: 14px;
          flex-wrap: wrap;
        }

        .sim-control-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
        }

        .sim-control-item label {
          color: #a49cb5;
          font-size: 12px;
          font-weight: 500;
        }

        .sim-control-item select {
          background: #31284a;
          color: #ffffff;
          border: 1px solid #4a3f6a;
          padding: 6px 12px;
          border-radius: 8px;
          font-size: 13px;
          outline: none;
          cursor: pointer;
        }

        .sim-btn {
          background: #31284a;
          color: #ffffff;
          border: 1px solid #4a3f6a;
          padding: 6px 12px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .sim-btn:hover {
          background: #413562;
        }

        .sim-btn.active {
          background: #7551a6;
          border-color: #9d74d6;
        }

        .sim-network-strip {
          background: #2b223d;
          border-bottom: 1px solid #3c3254;
          padding: 8px 24px;
          font-size: 12px;
          color: #d1c7e6;
          display: flex;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 8px;
        }

        .sim-network-strip code {
          background: rgba(0, 0, 0, 0.35);
          color: #ffd166;
          padding: 2px 6px;
          border-radius: 4px;
          font-family: monospace;
          font-weight: bold;
        }

        .mobile-sim-stage {
          flex: 1;
          display: flex;
          justify-content: center;
          padding: 30px 20px 60px;
          overflow-x: auto;
        }

        /* Phone Mockup Styling */
        .phone-frame {
          position: relative;
          background: #2a2833;
          border: 4px solid #474354;
          border-radius: 48px;
          box-shadow: 0 25px 60px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.1);
          padding: 10px;
          box-sizing: border-box;
          transition: width 0.3s ease, height 0.3s ease;
        }

        .phone-bezel {
          position: relative;
          background: #000000;
          border-radius: 38px;
          overflow: hidden;
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .dynamic-island {
          position: absolute;
          top: 11px;
          width: 110px;
          height: 28px;
          background: #000000;
          border-radius: 20px;
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: space-around;
          padding: 0 10px;
        }

        .camera-lens {
          width: 10px;
          height: 10px;
          background: #141726;
          border: 1px solid #232946;
          border-radius: 50%;
        }

        .sensor {
          width: 8px;
          height: 8px;
          background: #0d1117;
          border-radius: 50%;
        }

        .camera-punch {
          position: absolute;
          top: 10px;
          width: 14px;
          height: 14px;
          background: #141726;
          border-radius: 50%;
          z-index: 100;
        }

        .phone-screen {
          border: none;
          background: #ffffff;
          overflow: hidden;
        }

        .phone-home-indicator {
          position: absolute;
          bottom: 8px;
          width: 120px;
          height: 4px;
          background: rgba(255, 255, 255, 0.4);
          border-radius: 4px;
          z-index: 100;
        }
      `}</style>
    </div>
  );
}

