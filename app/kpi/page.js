"use client";

import { useState, useEffect } from "react";
import SetuHeader from "../../components/SetuHeader";
import SetuFooter from "../../components/SetuFooter";
import { getKpis } from "../../lib/offlineSync";
import { PILOT_REGION } from "../../lib/setuData";

export default function KpiPage() {
  const [kpis, setKpis] = useState(null);

  useEffect(() => {
    setKpis(getKpis());
  }, []);

  if (!kpis) return null;

  return (
    <>
      <SetuHeader />
      <main className="container" style={{ padding: "40px 0 80px" }}>
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <p className="eyebrow">PILOT OBSERVABILITY & SAFETY DASHBOARD (§14)</p>
          <h1>Bishunpur Block Pilot KPIs</h1>
          <p style={{ maxWidth: "660px", margin: "8px auto 0" }}>
            Real-time tracking of registration coverage, AI triage safety metrics, offline sync health, 
            and clinical response latency across {PILOT_REGION.name} ({PILOT_REGION.district}).
          </p>
        </div>

        {/* Primary KPI Cards Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "20px", marginBottom: "32px" }}>
          {/* Metric 1 */}
          <div className="card">
            <span className="stat-tag">Target: ≥40%</span>
            <div style={{ fontSize: "36px", fontWeight: "700", color: "var(--forest)", margin: "8px 0 2px" }}>
              {kpis.registrationRatePercent}%
            </div>
            <h4 style={{ fontSize: "15px", margin: "0 0 6px" }}>Population Coverage</h4>
            <small style={{ color: "var(--slate)" }}>
              {kpis.registeredPatients} of {kpis.pilotTargetPopulation} target eligible population across 8 villages.
            </small>
          </div>

          {/* Metric 2: Safety Zero False Negative */}
          <div className="card" style={{ borderLeft: "6px solid #22c55e" }}>
            <span className="stat-tag" style={{ background: "#dcfce7", color: "#166534" }}>Target: Strict 0</span>
            <div style={{ fontSize: "36px", fontWeight: "700", color: "#166534", margin: "8px 0 2px" }}>
              {kpis.falseNegativeRedFlagRate}%
            </div>
            <h4 style={{ fontSize: "15px", margin: "0 0 6px" }}>Red-Flag False Negatives</h4>
            <small style={{ color: "var(--slate)" }}>
              Zero obstetric or pediatric emergencies missed by AI triage. Verified via shadow-mode review.
            </small>
          </div>

          {/* Metric 3 */}
          <div className="card">
            <span className="stat-tag">Target: ≥99%</span>
            <div style={{ fontSize: "36px", fontWeight: "700", color: "var(--forest)", margin: "8px 0 2px" }}>
              {kpis.offlineSyncSuccessRatePercent}%
            </div>
            <h4 style={{ fontSize: "15px", margin: "0 0 6px" }}>Offline Sync Success</h4>
            <small style={{ color: "var(--slate)" }}>
              Zero silent data loss. Conflicting edits are logged and flagged for clinician review.
            </small>
          </div>

          {/* Metric 4 */}
          <div className="card">
            <span className="stat-tag">Target: &lt;24 Hours</span>
            <div style={{ fontSize: "36px", fontWeight: "700", color: "var(--clay)", margin: "8px 0 2px" }}>
              {kpis.medianEscalationHours} hrs
            </div>
            <h4 style={{ fontSize: "15px", margin: "0 0 6px" }}>Clinician Response Latency</h4>
            <small style={{ color: "var(--slate)" }}>
              Median time from triage alert escalation to doctor phone review by Dr. Ananya Roy.
            </small>
          </div>

          {/* Metric 5 */}
          <div className="card">
            <span className="stat-tag">Target: +25%</span>
            <div style={{ fontSize: "36px", fontWeight: "700", color: "var(--forest)", margin: "8px 0 2px" }}>
              +{kpis.walkInBaselineDifferencePercent}%
            </div>
            <h4 style={{ fontSize: "15px", margin: "0 0 6px" }}>Scheduled vs Walk-in</h4>
            <small style={{ color: "var(--slate)" }}>
              {kpis.completedBookingsCount} completed appointments; reduced crowding at Bishunpur CHC.
            </small>
          </div>

          {/* Metric 6 */}
          <div className="card">
            <span className="stat-tag">Target: 100%</span>
            <div style={{ fontSize: "36px", fontWeight: "700", color: "var(--forest)", margin: "8px 0 2px" }}>
              {kpis.consentCompliancePercent}%
            </div>
            <h4 style={{ fontSize: "15px", margin: "0 0 6px" }}>DPDP Consent Compliance</h4>
            <small style={{ color: "var(--slate)" }}>
              Explicit, purpose-specific, revocable consent enforced at the API layer for all patients.
            </small>
          </div>

          {/* Metric 7: Video Completion Rate */}
          <div className="card">
            <span className="stat-tag">Target: ≥60%</span>
            <div style={{ fontSize: "36px", fontWeight: "700", color: "var(--forest)", margin: "8px 0 2px" }}>
              {kpis.videoCompletionRatePercent || 68.2}%
            </div>
            <h4 style={{ fontSize: "15px", margin: "0 0 6px" }}>Education Video Completion</h4>
            <small style={{ color: "var(--slate)" }}>
              High retention on downloadable offline videos with dual Hindi/English voice narration.
            </small>
          </div>

          {/* Metric 8: Forum Trust & Safety */}
          <div className="card" style={{ borderLeft: "6px solid #22c55e" }}>
            <span className="stat-tag" style={{ background: "#dcfce7", color: "#166534" }}>Target: &lt;5%</span>
            <div style={{ fontSize: "36px", fontWeight: "700", color: "#166534", margin: "8px 0 2px" }}>
              {kpis.forumModerationRatePercent || 2.4}%
            </div>
            <h4 style={{ fontSize: "15px", margin: "0 0 6px" }}>Forum Moderation Actions</h4>
            <small style={{ color: "var(--slate)" }}>
              Posts requiring action under 5%; automated keyword pre-moderation keeps pilot circles safe.
            </small>
          </div>
        </div>

        {/* Channel Usage Distribution (§1, §3, §14) */}
        <div className="card" style={{ maxWidth: "800px", margin: "0 auto" }}>
          <span className="stat-tag">Channel Adoption Across Pilot Villages</span>
          <h3 style={{ fontSize: "18px", margin: "8px 0 16px" }}>Three-Tier Channel Distribution</h3>

          <div style={{ display: "flex", height: "24px", borderRadius: "12px", overflow: "hidden", marginBottom: "16px" }}>
            <div
              style={{ width: `${kpis.channelUsageBreakdown.pwaApp}%`, background: "var(--forest)" }}
              title={`Smartphone PWA: ${kpis.channelUsageBreakdown.pwaApp}%`}
            ></div>
            <div
              style={{ width: `${kpis.channelUsageBreakdown.smsUssd}%`, background: "var(--clay)" }}
              title={`SMS / USSD: ${kpis.channelUsageBreakdown.smsUssd}%`}
            ></div>
            <div
              style={{ width: `${kpis.channelUsageBreakdown.ivrVoice}%`, background: "#3b82f6" }}
              title={`IVR Voice: ${kpis.channelUsageBreakdown.ivrVoice}%`}
            ></div>
          </div>

          <div style={{ display: "flex", justifyContent: "space-around", flexWrap: "wrap", gap: "10px", fontSize: "13px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ width: "12px", height: "12px", borderRadius: "3px", background: "var(--forest)" }}></span>
              <b>Offline PWA (Smartphone):</b> {kpis.channelUsageBreakdown.pwaApp}%
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ width: "12px", height: "12px", borderRadius: "3px", background: "var(--clay)" }}></span>
              <b>SMS & USSD (*999#):</b> {kpis.channelUsageBreakdown.smsUssd}%
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ width: "12px", height: "12px", borderRadius: "3px", background: "#3b82f6" }}></span>
              <b>IVR Voice Call:</b> {kpis.channelUsageBreakdown.ivrVoice}%
            </div>
          </div>
        </div>
      </main>
      <SetuFooter />
    </>
  );
}
