import { NextResponse } from "next/server";
import {
  queryVectorKnowledgeBase,
  evaluateRedFlagsAndDifferentials
} from "@/lib/medicalRagEngine";
import { formatApiResponse, checkPurposeOfUse } from "@/lib/apiHelper";

const MANDATORY_MEDICAL_DISCLAIMER =
  "⚠️ Medical Disclaimer: This AI tool is for educational and triage-support purposes only and does NOT constitute a medical diagnosis, prescription, or doctor's consult. Always seek the advice of a qualified physician or healthcare provider for in-person palpation and ultrasound/MRI imaging.";

export async function POST(req) {
  // Validate Purpose of Use per DPDP Act 2023 (§6, §9)
  const purposeCheck = checkPurposeOfUse(req);
  if (!purposeCheck.valid) return purposeCheck.response;

  try {
    const body = await req.json();
    const {
      location = "Unspecified",
      texture = "Soft",
      mobility = "Movable",
      painLevel = 0,
      skinChanges = "None",
      growthSpeed = "Slow / Stable",
      sizeCm = 2,
      freeText = ""
    } = body;

    // 1. Run Deterministic Red-Flag & Differential Analysis
    const clinicalEvaluation = evaluateRedFlagsAndDifferentials({
      location,
      texture,
      mobility,
      painLevel,
      skinChanges,
      growthSpeed,
      sizeCm
    });

    // 2. Query Vector Knowledge Base for Grounded Medical Context (Mayo Clinic, NIH, Cleveland Clinic)
    const combinedSearchText = `${location} ${texture} ${mobility} pain level ${painLevel} ${skinChanges} ${growthSpeed} size ${sizeCm}cm ${freeText}`;
    const retrievedDocs = queryVectorKnowledgeBase(combinedSearchText);
    const topRetrievedContext = retrievedDocs.slice(0, 3);

    // 3. Construct Grounded Clinical Advisory Synthesis
    let synthesisMessage = "";
    let recommendedAction = "";
    const citations = topRetrievedContext.map((d) => ({
      topic: d.topic,
      source: d.source,
      citation: d.citation
    }));

    if (clinicalEvaluation.hasRedFlags) {
      const redFlagDescriptions = clinicalEvaluation.redFlags.map((rf) => `• ${rf.label}: ${rf.reason}`).join("\n");
      synthesisMessage = `The details provided indicate clinical features that warrant professional medical evaluation:
${redFlagDescriptions}

Based on peer-reviewed surgical and oncological guidelines (NCCN / NIH StatPearls), soft tissue lumps that are rapidly growing, firm/hard, larger than 5 cm, painful (score ${painLevel}/10), or fixed to underlying muscle require direct physical examination and soft-tissue ultrasound or MRI prior to any intervention.`;

      recommendedAction = "Schedule an in-person physical examination with a general surgeon, dermatologist, or primary care physician. Do NOT squeeze or attempt home drainage.";
    } else {
      // Benign profile synthesis
      const painNum = parseInt(painLevel, 10) || 0;
      if (painNum > 0) {
        synthesisMessage = `Symptoms described (soft or rubbery texture, mobile beneath the skin, with mild/moderate tenderness of ${painLevel}/10) are consistent with:
• Possible Angiolipoma: A benign variant of lipoma containing small blood vessels, which frequently causes localized tenderness.
• Nerve Abutment: A standard lipoma pressing lightly against a nearby cutaneous nerve.
• Early Inflamed Cyst: If an epidermal pore or punctum is present.

Note: Standard lipomas are typically completely painless. Because your lump has tenderness, a doctor's examination will help differentiate between an angiolipoma and a simple lipoma.`;
      } else {
        synthesisMessage = `Symptoms described (soft, doughy, movable under the skin, painless, and slow-growing) are consistent with typical features of a benign subcutaneous lipoma according to Mayo Clinic and NIH guidelines.
Possible causes also include a non-inflamed epidermoid cyst or benign soft-tissue fat lobule. Only an in-person physical exam and imaging can provide an absolute confirmation.`;
      }

      recommendedAction = "Consult a physician at your convenience for routine physical palpation. Monitor for changes in size, mobility, or onset of pain.";
    }

    return NextResponse.json(
      formatApiResponse(
        {
          clinicalRiskTier: clinicalEvaluation.riskTier,
          hasRedFlags: clinicalEvaluation.hasRedFlags,
          isUrgentEmergency: clinicalEvaluation.isUrgentEmergency,
          identifiedRedFlags: clinicalEvaluation.redFlags,
          differentials: clinicalEvaluation.differentialConsiderations,
          groundedSynthesis: synthesisMessage,
          recommendedAction,
          citations,
          disclaimer: MANDATORY_MEDICAL_DISCLAIMER,
          inputSummary: {
            location,
            texture,
            mobility,
            painLevel,
            skinChanges,
            growthSpeed,
            sizeCm
          }
        },
        {
          ragRetrievedChunks: topRetrievedContext.length,
          modelGrounded: true,
          evidenceBase: "Mayo Clinic, NIH StatPearls, Cleveland Clinic, NCCN"
        }
      )
    );
  } catch (err) {
    return NextResponse.json(
      formatApiResponse(null, {}, [{ code: "RAG_PROCESSING_ERROR", message: err.message }]),
      { status: 500 }
    );
  }
}
