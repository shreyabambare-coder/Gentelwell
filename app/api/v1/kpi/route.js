import { NextResponse } from "next/server";
import { INITIAL_KPIS } from "@/lib/setuData";
import { formatApiResponse } from "@/lib/apiHelper";

export async function GET() {
  return NextResponse.json(
    formatApiResponse(INITIAL_KPIS, {
      section: "Roadmap Section 15: Success Metrics & KPIs",
      targetValidation: {
        coverage: INITIAL_KPIS.registrationRatePercent >= 40.0 ? "PASS" : "WARN",
        redFlagSafety: INITIAL_KPIS.falseNegativeRedFlagRate === 0.0 ? "PASS" : "FAIL",
        syncReliability: INITIAL_KPIS.offlineSyncSuccessRatePercent >= 99.0 ? "PASS" : "WARN",
        videoCompletion: (INITIAL_KPIS.videoCompletionRatePercent || 68.2) >= 60.0 ? "PASS" : "WARN",
        forumTrustSafety: (INITIAL_KPIS.forumModerationRatePercent || 2.4) < 5.0 ? "PASS" : "WARN"
      }
    })
  );
}
