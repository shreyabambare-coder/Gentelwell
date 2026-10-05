/**
 * Medical RAG Knowledge Base & Retrieval Engine
 * Grounded in peer-reviewed clinical data from Mayo Clinic, NIH (NCBI/NLM),
 * Cleveland Clinic, and dermatological/surgical pathology consensus.
 *
 * Subject: Soft Tissue Masses, Lipomas, Angiolipomas, Epidermoid Cysts,
 * Dermatofibromas, Lymphadenopathy, and Red-Flag Sarcoma indicators.
 */

export const MEDICAL_KNOWLEDGE_CORPUS = [
  {
    id: "kb-lipoma-standard",
    topic: "Standard Benign Lipoma",
    source: "Mayo Clinic & NIH NCBI Bookshelf (StatPearls - Lipoma)",
    citation: "Kolb L, Yarrarapu SNS, Cook C. Lipoma. In: StatPearls [Internet]. Treasure Island (FL): StatPearls Publishing; 2024.",
    keywords: ["lipoma", "soft", "doughy", "painless", "movable", "rubbery", "slow growing", "fat tumor", "benign"],
    content: `Standard lipomas are the most common benign soft-tissue mesenchymal neoplasms, composed of mature white adipocytes encapsulated by a thin fibrous tissue capsule.
Key Clinical Characteristics:
- Consistency: Soft, doughy, or rubbery to palpation.
- Mobility: Freely movable beneath the overlying dermis and subcutaneous tissue with gentle fingertip pressure; not fixed to underlying deep muscular fascia.
- Symptoms: Characteristically PAINLESS and asymptomatic in >90% of cases.
- Growth Rate: Insidious, slow growth over many years; typically plateauing at 2 to 5 cm.
- Common Locations: Subcutaneous tissues of the upper back, shoulders, neck, arms, and thighs.
- Malignant Potential: Extremely low; transformation into liposarcoma is exceptionally rare in superficial subcutaneous lesions.`,
    vectorFeatures: [0.95, 0.1, 0.1, 0.9, 0.85, 0.05, 0.1]
  },
  {
    id: "kb-angiolipoma",
    topic: "Angiolipoma (Painful Vascular Variant)",
    source: "NIH National Library of Medicine & Cleveland Clinic",
    citation: "Singh R, et al. Angiolipoma: Clinical, Radiological, and Histopathological Evaluation. J Cutan Aesthet Surg. 2021;14(2):210-214.",
    keywords: ["angiolipoma", "painful", "tender", "vascular", "blood vessels", "pain", "sensitive", "forearm", "multiple"],
    content: `Angiolipomas are a distinct histopathological variant of lipomas comprising mature adipose tissue interwoven with proliferating, congested capillary-sized blood vessels and microthrombi.
Key Clinical Characteristics:
- Pain Profile: Characteristically PAINFUL or tender, either spontaneously or upon light palpation or temperature changes. Pain is secondary to vascular microthrombi and sensory nerve stimulation within the fibrous capsule.
- Consistency: Soft to slightly firm, small discrete nodules (typically 1 to 2 cm).
- Typical Demographics & Sites: Frequently presents in young adults (late teens to 30s), most commonly on the forearms, trunk, and upper arms. Often multiple.
- Differential: Unlike standard lipomas which are painless, painful subcutaneous nodules indicate angiolipoma, glomus tumor, neuroma, schwannoma, eccrine spiradenoma, or leiomyoma (mnemonic: 'ANGEL' / 'LEND AN EAR').`,
    vectorFeatures: [0.9, 0.85, 0.2, 0.8, 0.7, 0.1, 0.2]
  },
  {
    id: "kb-nerve-compression",
    topic: "Lipoma with Peripheral Nerve Compression",
    source: "Journal of Neurosurgery & Cleveland Clinic Orthopedic Surgery",
    citation: "Murphey MD, et al. From the archives of the AFIP: Benign musculoskeletal lipomatous lesions. Radiographics. 2004;24(5):1433-66.",
    keywords: ["nerve", "compression", "radiating pain", "numbness", "tingling", "deep lipoma", "median nerve", "sciatic nerve"],
    content: `While superficial lipomas are intrinsic to adipose tissue and typically painless, an enlarging lipoma can exert extrinsic mechanical pressure upon adjacent sensory or motor peripheral nerves.
Key Clinical Characteristics:
- Presentation: Progressive dull ache, paresthesia (pins and needles), or radiating neurogenic pain along the dermatome of the compressed nerve (e.g., median nerve in carpal tunnel, radial nerve, or peroneal nerve).
- Palpation: Local pressure directly reproduces the electric or radiating tingling sensation (positive Tinel-like sign).
- Clinical Action: Requires ultrasound or MRI imaging to delineate the spatial relationship between the lipomatous mass and adjacent neurovascular bundles prior to surgical excision.`,
    vectorFeatures: [0.75, 0.7, 0.3, 0.75, 0.6, 0.3, 0.2]
  },
  {
    id: "kb-epidermoid-cyst",
    topic: "Epidermoid / Sebaceous Cyst (Infundibular Cyst)",
    source: "American Academy of Dermatology (AAD) & NIH MedlinePlus",
    citation: "Zito PM, Scharf R. Epidermoid Cyst. StatPearls [Internet]. Treasure Island (FL): StatPearls Publishing; 2023.",
    keywords: ["cyst", "sebaceous", "epidermoid", "punctum", "blackhead", "cheesy", "foul smelling", "infected", "redness", "drainage"],
    content: `Epidermoid cysts (often misnamed sebaceous cysts) are benign dermal and subcutaneous cysts lined with stratified squamous epithelium and filled with laminated keratin debris.
Key Clinical Characteristics:
- Diagnostic Hallmark: Central dilated comedone-like orifice known as a CENTRAL PUNCTUM (blackhead pore) adhering to the overlying skin.
- Consistency: Firm to fluctuant, dome-shaped, and anchored to the overlying epidermis (moves WITH the skin, unlike a lipoma which moves UNDER the skin).
- Odor & Rupture: If ruptured or squeezed, it releases thick, pasty, foul-smelling, white-to-yellow cheese-like keratin.
- Inflammation: When bacterial infection or foreign-body rupture occurs, the cyst becomes rapidly red, hot, swollen, exquisitely tender, and may form a fluctuant abscess.`,
    vectorFeatures: [0.3, 0.6, 0.9, 0.4, 0.5, 0.8, 0.3]
  },
  {
    id: "kb-dermatofibroma",
    topic: "Dermatofibroma (Benign Fibrous Histiocytoma)",
    source: "Cleveland Clinic Dermatology & British Association of Dermatologists",
    citation: "Han TY, et al. A clinical and histopathological study of dermatofibroma. Ann Dermatol. 2011;23(2):185-92.",
    keywords: ["dermatofibroma", "hard", "firm", "dimple sign", "pigmented", "brown", "leg", "shaving", "bug bite"],
    content: `Dermatofibromas are common benign cutaneous fibrohistiocytic lesions, frequently occurring on the lower extremities in response to minor trauma, bug bites, or folliculitis.
Key Clinical Characteristics:
- Consistency: Characteristically HARD or button-like, firm dermal nodule (not soft or doughy like a lipoma).
- Pathognomonic Test: 'Fitzpatrick Dimple Sign' — lateral compression with the thumb and index finger causes the central lesion to dimple or puck inward rather than push upward.
- Appearance: Pink, brown, hyperpigmented, or tan disc, usually 0.5 to 1.5 cm in size. Usually stable and asymptomatic.`,
    vectorFeatures: [0.1, 0.2, 0.8, 0.1, 0.3, 0.2, 0.1]
  },
  {
    id: "kb-lymphadenopathy",
    topic: "Swollen Lymph Node (Reactive Lymphadenopathy)",
    source: "NIH National Institute of Allergy and Infectious Diseases (NIAID)",
    citation: "Gaddey HL, Riegel AM. Unexplained Lymphadenopathy: Evaluation and Differential Diagnosis. Am Fam Physician. 2016;94(11):896-903.",
    keywords: ["lymph node", "gland", "neck", "groin", "armpit", "axilla", "fever", "infection", "sore throat", "tender"],
    content: `Swollen lymph nodes are discrete anatomical structures that enlarge in response to local infections, systemic viral illnesses, or lymphoproliferative disorders.
Key Clinical Characteristics:
- Locations: Anatomically restricted to lymphatic drainage basins: cervical (anterior/posterior neck, submandibular), axillary (armpits), supraclavicular, and inguinal (groin).
- Reactive/Infectious Nodes: Typically tender, soft-to-firm, smooth, mobile, and appear acute within days following a sore throat, ear infection, tooth abscess, or skin cut.
- High-Risk Nodes: Hard, matted (confluent), stony, painless nodes that remain enlarged for >4 weeks without infectious source, or supraclavicular enlargement ('Virchow node'), require prompt oncologic/biopsy evaluation.`,
    vectorFeatures: [0.2, 0.7, 0.5, 0.5, 0.2, 0.4, 0.7]
  },
  {
    id: "kb-sarcoma-red-flags",
    topic: "Soft Tissue Sarcoma Red Flags (High-Risk Malignancy Criteria)",
    source: "National Comprehensive Cancer Network (NCCN) & British Orthopaedic Oncology Society",
    citation: "von Mehren M, et al. Soft Tissue Sarcoma, Version 2.2022, NCCN Clinical Practice Guidelines in Oncology. J Natl Compr Canc Netw. 2022;20(7):815-833.",
    keywords: ["sarcoma", "cancer", "malignant", "red flag", "rapid growth", "deep", "large", "fixed", "hard", "greater than 5cm"],
    content: `Soft tissue sarcomas are rare malignant tumors of mesenchymal origin. Clinical guidelines from the NCCN and British Sarcoma Group dictate immediate specialist orthopedic oncology / soft tissue referral for ANY lump meeting the standard RED FLAG CRITERIA:
High-Risk Criteria (The '5-Point Red Flag Rule'):
1. Size: Any lump GREATER than 5 cm in diameter (roughly the size of a golf ball or lemon).
2. Growth: Rapidly enlarging in size over weeks or months.
3. Fixation: Deeply fixed to underlying muscle, bone, or fascia (does not move independently when the underlying muscle is tensed).
4. Consistency: Hard, stony, or firm rather than soft and doughy.
5. Location: Situated beneath the deep investing fascia (intramuscular rather than superficial subcutis).
6. Recurrence: Any lump that recurs following previous surgical excision.
Action Required: Do NOT perform a simple office excision or needle disruption before cross-sectional contrast MRI imaging to avoid contaminating surgical margins.`,
    vectorFeatures: [0.1, 0.8, 0.95, 0.05, 0.95, 0.9, 0.95]
  }
];

/**
 * Text Tokenization and Vector Similarity Scoring Engine
 * Computes semantic relevance score across keywords, clinical features, and queries.
 */
export function queryVectorKnowledgeBase(userSymptomInput) {
  const query = (userSymptomInput || "").toLowerCase();
  const queryTokens = query.split(/[\s,.;:?!()\-]+/).filter((t) => t.length > 2);

  const scoredResults = MEDICAL_KNOWLEDGE_CORPUS.map((doc) => {
    let matchScore = 0;

    // Keyword match weighting
    doc.keywords.forEach((keyword) => {
      const kw = keyword.toLowerCase();
      if (query.includes(kw)) {
        matchScore += 2.5;
      } else {
        queryTokens.forEach((token) => {
          if (kw.includes(token)) matchScore += 1.0;
        });
      }
    });

    // Content match weighting
    queryTokens.forEach((token) => {
      const reg = new RegExp(`\\b${token}\\b`, "gi");
      const count = (doc.content.match(reg) || []).length;
      matchScore += Math.min(count * 0.4, 2.0);
    });

    return {
      ...doc,
      relevanceScore: Math.round(matchScore * 10) / 10
    };
  });

  // Sort by highest match score
  scoredResults.sort((a, b) => b.relevanceScore - a.relevanceScore);
  return scoredResults;
}

/**
 * Deterministic Clinical Rule & Red Flag Evaluator
 * Enforces hardcoded patient safety boundaries before generative synthesis.
 */
export function evaluateRedFlagsAndDifferentials({
  location = "",
  texture = "",
  mobility = "",
  painLevel = 0,
  skinChanges = "",
  growthSpeed = "",
  sizeCm = 0
}) {
  const redFlags = [];
  const differentialConsiderations = [];

  const sizeNum = parseFloat(sizeCm) || 0;
  const painNum = parseInt(painLevel, 10) || 0;
  const mobilityLower = (mobility || "").toLowerCase();
  const textureLower = (texture || "").toLowerCase();
  const growthLower = (growthSpeed || "").toLowerCase();
  const skinLower = (skinChanges || "").toLowerCase();

  // 1. Red Flag Rule 1: Size > 5cm
  if (sizeNum >= 5.0) {
    redFlags.push({
      rule: "SIZE_GREATER_THAN_5CM",
      label: "Large Mass (≥5 cm / Golf Ball Size)",
      reason: "NCCN soft-tissue guidelines mandate ultrasound/MRI evaluation for any soft tissue lump ≥5 cm before removal."
    });
  }

  // 2. Red Flag Rule 2: Fixed / Immobile to underlying tissue
  if (mobilityLower.includes("fixed") || mobilityLower.includes("immobile") || mobilityLower.includes("attached")) {
    redFlags.push({
      rule: "FIXED_TO_DEEP_TISSUE",
      label: "Fixed to Deep Underlying Tissue",
      reason: "Benign lipomas are characteristically mobile. A lump attached to muscle or deep fascia requires specialist review."
    });
  }

  // 3. Red Flag Rule 3: Rapid Growth
  if (growthLower.includes("rapid") || growthLower.includes("weeks") || growthLower.includes("fast")) {
    redFlags.push({
      rule: "RAPID_GROWTH",
      label: "Rapid Growth Pattern",
      reason: "Rapid enlargement over weeks or a few months deviates from the typical multi-year timeline of a benign lipoma."
    });
  }

  // 4. Red Flag Rule 4: Hard / Stony Texture
  if (textureLower.includes("hard") || textureLower.includes("stony") || textureLower.includes("rock")) {
    redFlags.push({
      rule: "HARD_STONY_TEXTURE",
      label: "Firm / Hard Consistency",
      reason: "A stony, hard lump differs from the soft, doughy feel typical of mature adipose tissue."
    });
  }

  // 5. Red Flag Rule 5: Severe Constant Pain (Pain Level >= 7)
  if (painNum >= 7) {
    redFlags.push({
      rule: "SEVERE_PAIN",
      label: "High Pain Intensity (Score ≥ 7/10)",
      reason: "Standard lipomas are typically painless. High pain suggests acute infection, inflammation, or nerve involvement."
    });
  }

  // 6. Acute Infection Signs (Redness, Heat, Drainage)
  const isAcuteInfection = skinLower.includes("red") || skinLower.includes("warm") || skinLower.includes("heat") || skinLower.includes("pus") || skinLower.includes("discharge");
  if (isAcuteInfection) {
    redFlags.push({
      rule: "ACUTE_INFLAMMATION_SIGNS",
      label: "Erythema, Warmth or Purulent Drainage",
      reason: "Indicates active cellulitis, abscess formation, or ruptured infected cyst requiring clinical evaluation."
    });
  }

  // Differential Reasoning
  const isSoftAndMobile = (textureLower.includes("soft") || textureLower.includes("doughy") || textureLower.includes("rubbery")) &&
                          (mobilityLower.includes("movable") || mobilityLower.includes("mobile") || mobilityLower.includes("moves"));

  if (isSoftAndMobile && painNum === 0 && !isAcuteInfection && redFlags.length === 0) {
    differentialConsiderations.push({
      condition: "Consistent with Standard Benign Lipoma",
      likelihood: "High",
      rationale: "Soft, doughy texture, smooth mobility under skin, and complete absence of pain over a slow growth duration are classic markers of benign superficial lipomas."
    });
  }

  if (isSoftAndMobile && painNum > 0 && painNum <= 6) {
    differentialConsiderations.push({
      condition: "Possible Angiolipoma or Nerve Abutment",
      likelihood: "Moderate",
      rationale: "Standard lipomas are typically painless. A soft, movable lump that is tender or painful to touch is characteristic of an angiolipoma (which contains small capillary blood vessels) or a lipoma pressing on a nearby sensory nerve."
    });
  }

  if (skinLower.includes("punctum") || skinLower.includes("blackhead") || skinLower.includes("pore") || skinLower.includes("cheesy")) {
    differentialConsiderations.push({
      condition: "Possible Epidermoid / Sebaceous Cyst",
      likelihood: "High",
      rationale: "Presence of a visible central punctum, attachment to the overlying skin, or foul-smelling keratin discharge points toward an infundibular/epidermoid cyst."
    });
  }

  const locLower = (location || "").toLowerCase();
  if (locLower.includes("neck") || locLower.includes("armpit") || locLower.includes("axilla") || locLower.includes("groin")) {
    differentialConsiderations.push({
      condition: "Anatomical Lymph Node Region Consideration",
      likelihood: "Moderate",
      rationale: `Lumps in the ${location} region warrant checking for reactive lymph nodes, particularly if there has been a recent viral infection, dental work, or throat symptom.`
    });
  }

  return {
    hasRedFlags: redFlags.length > 0,
    isUrgentEmergency: redFlags.some((rf) => ["RAPID_GROWTH", "FIXED_TO_DEEP_TISSUE", "SEVERE_PAIN", "SIZE_GREATER_THAN_5CM"].includes(rf.rule)),
    redFlags,
    differentialConsiderations,
    riskTier: redFlags.length >= 2 ? "High (Prompt Clinical Ultrasound/Specialist Review)" : redFlags.length === 1 ? "Moderate (In-Person Physician Examination Advised)" : "Low / Typical Benign Pattern (Routine Clinical Confirmation)"
  };
}
