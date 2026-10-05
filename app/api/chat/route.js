import { NextResponse } from "next/server";
import { CLINICAL_TOPICS, RESEARCH_CITATIONS } from "./medicalKnowledge";

// Deterministic safety & clinical matching engine
function matchClinicalKnowledge(query, lang = "en") {
  const normalized = query.toLowerCase().trim();

  // 1. Critical Red Flag Triage (Emergency Safety Layer)
  const emergencyKeywords = [
    "soaking", "soaked", "heavy bleeding", "large clot", "golf ball",
    "severe abdominal", "severe pelvic", "fainting", "fainted",
    "bleeding pregnant", "bleeding while pregnant", "miscarriage",
    "ectopic", "khoon beh raha", "bahut bleeding", "behosh", "ek taraf dard"
  ];

  const isEmergency = emergencyKeywords.some((kw) => normalized.includes(kw));
  if (isEmergency) {
    const redFlag = CLINICAL_TOPICS.find((t) => t.id === "emergency_red_flags");
    return {
      reply: lang === "hi" ? redFlag.hindiContent : redFlag.content,
      hindiReply: redFlag.hindiContent,
      englishReply: redFlag.content,
      suggestions: redFlag.suggestions,
      category: redFlag.category,
      citation: redFlag.citation,
      isEmergency: true
    };
  }

  // 2. Score against clinical topics
  let bestTopic = null;
  let highestScore = 0;

  for (const topic of CLINICAL_TOPICS) {
    let score = 0;
    for (const trigger of topic.triggers) {
      if (normalized.includes(trigger.toLowerCase())) {
        score += trigger.length;
      }
    }
    if (score > highestScore) {
      highestScore = score;
      bestTopic = topic;
    }
  }

  if (bestTopic && highestScore > 0) {
    return {
      reply: lang === "hi" ? bestTopic.hindiContent : bestTopic.content,
      hindiReply: bestTopic.hindiContent,
      englishReply: bestTopic.content,
      suggestions: bestTopic.suggestions,
      category: bestTopic.category,
      citation: bestTopic.citation,
      isEmergency: false
    };
  }

  // 3. Conversational greetings
  const greetings = ["hi", "hello", "hey", "namaste", "halo", "namaskar", "good morning", "good evening", "kaise ho", "kya haal hai"];
  if (greetings.some((g) => normalized === g || normalized.startsWith(g + " "))) {
    const greetingTextHi = `नमस्ते! 🙏 मैं **सखी (SheCare AI)** हूँ - महिला स्वास्थ्य और पोषण की आपकी निजी, साक्ष्य-आधारित (Evidence-Based) सहायक।\n\nमैं ICMR, WHO एवं ACOG के चिकित्सा मानकों के आधार पर आपको सही जानकारी प्रदान करती हूँ। आप मुझसे माहवारी, पीरियड्स में दर्द, PCOS, आयरन व एनीमिया, गर्भावस्था, या व्यक्तिगत स्वच्छता पर खुलकर चर्चा कर सकती हैं।\n\nआज मैं आपकी क्या सहायता कर सकती हूँ?`;
    const greetingTextEn = `Hello! 🌸 I am **Sakhi (SheCare AI)** — your confidential, evidence-based Women's Health Education Assistant.\n\nMy guidance is grounded in clinical research and guidelines from the **ICMR-NIN (National Institute of Nutrition)**, **WHO**, **ACOG**, and **2023 International PCOS Guidelines**.\n\nYou can ask me about **menstrual cycles, cramps, PCOS/PCOD, iron & hemoglobin, pregnancy care, intimate hygiene, or emotional wellbeing**.\n\nWhat health question can I help you explore today?`;

    return {
      reply: lang === "hi" ? greetingTextHi : greetingTextEn,
      hindiReply: greetingTextHi,
      englishReply: greetingTextEn,
      suggestions: [
        "How to relieve period cramps naturally?",
        "What are early signs of PCOS / PCOD?",
        "Top iron-rich Indian foods to fight anemia?",
        "What is a healthy menstrual cycle length?"
      ],
      category: "Welcome",
      citation: "WHO & ICMR-NIN Clinical Guidelines",
      isEmergency: false
    };
  }

  // 4. Default comprehensive clinical guidance
  const generalReplyEn = `Thank you for reaching out to **Sakhi AI**.

Women's bodies experience dynamic hormonal transitions across puberty, reproductive years, pregnancy, and menopause. Here are evidence-based foundational principles from the **Indian Council of Medical Research (ICMR)** and **WHO**:

1. **Holistic Assessment:** Cycle length, flow volume, energy, and intimate comfort are key vital signs of female reproductive and metabolic health.
2. **Nutritional Core:** A diet rich in non-heme iron (dark greens, legumes, jaggery), paired with Vitamin C (lemon, amla), with high protein and complex millets stabilizes hormonal balance.
3. **Clinical Checkups:** An annual well-woman checkup, including CBC (hemoglobin check), pelvic ultrasound if cycles are irregular, and cervical Pap smears, prevents long-term health complications.

> **Note:** As an AI health educator, I provide peer-reviewed scientific information, but cannot replace an in-person physical examination or clinical diagnostic test. 

Could you please specify your symptoms, cycle details, or the health condition you would like to know more about?`;

  const generalReplyHi = `सखी स्वास्थ्य मंच पर आपका स्वागत है।

महिला स्वास्थ्य से जुड़ी वैज्ञानिक और प्रामाणिक जानकारी के लिए मैं सदैव उपलब्ध हूँ:

1. **शरीर के संकेतों को समझना:** माहवारी की नियमितता, हीमोग्लोबिन और ऊर्जा स्तर हमारे समग्र स्वास्थ्य के महत्वपूर्ण संकेतक हैं।
2. **संतुलित पोषण:** हरी सब्जियां, दालें, और विटामिन C युक्त फल हार्मोन्स को संतुलित रखने में मदद करते हैं।
3. **डॉक्टर से सलाह:** यदि कोई भी लक्षण (जैसे दर्द, अनियमितता, या असामान्य डिस्चार्ज) लगातार बना रहे, तो महिला रोग विशेषज्ञ से परामर्श अवश्य लें।

कृपया मुझे अपने प्रश्न या लक्षण के बारे में थोड़ा और बताएं।`;

  return {
    reply: lang === "hi" ? generalReplyHi : generalReplyEn,
    hindiReply: generalReplyHi,
    englishReply: generalReplyEn,
    suggestions: [
      "What is considered an abnormal menstrual cycle?",
      "How to naturally boost hemoglobin levels?",
      "What are the best habits for intimate hygiene?"
    ],
    category: "General Health Education",
    citation: "ICMR & WHO Global Women's Health Protocols",
    isEmergency: false
  };
}

// Gemini live API call with clinical RAG context
async function callGemini(apiKey, message, history = [], lang = "en") {
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  const clinicalContextSummary = CLINICAL_TOPICS.map(
    (t) => `[Topic: ${t.title} | Category: ${t.category} | Source: ${t.citation}]\n${t.content}`
  ).join("\n\n---\n\n");

  const systemInstruction = `You are "Sakhi AI", an empathetic, culturally attuned, and medically rigorous Women's Health Assistant on the SheCare platform.
Grounding Medical Data:
Use the following peer-reviewed clinical data and guidelines (ICMR-NIN, Monash 2023 PCOS, WHO MHM, ACOG):
${clinicalContextSummary}

Core Guidelines:
1. Tone: Empathetic, supportive, respectful, destigmatizing, and scientifically clear.
2. Format: Use clean markdown with headers, bullet points, and bold terms for readability.
3. Language: If the user communicates in Hindi, respond in compassionate, clear Hindi. If in Hinglish, respond in accessible Hinglish. Otherwise, respond in English.
4. Medical Safety: You are an educational assistant. State clearly that you provide health education and not individual medical diagnosis.
5. Critical Triage: If the user describes soaking 2+ pads/hr, acute localized pelvic pain, faintness, or bleeding during pregnancy, immediately trigger an EMERGENCY WARNING, recommend an immediate hospital visit, and provide Indian emergency numbers (Ambulance: 112/102, Women Helpline: 1091).
6. Follow-ups: End your response with 2-3 short, relevant follow-up questions formatted under a header "### Suggested Follow-ups:".`;

  const contents = [];
  if (history && Array.isArray(history)) {
    for (const msg of history.slice(-6)) {
      contents.push({
        role: msg.who === "bot" ? "model" : "user",
        parts: [{ text: msg.text }]
      });
    }
  }
  contents.push({
    role: "user",
    parts: [{ text: message }]
  });

  const body = {
    contents,
    systemInstruction: {
      parts: [{ text: systemInstruction }]
    },
    generationConfig: {
      temperature: 0.5,
      maxOutputTokens: 1024
    }
  };

  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  const rawReply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

  let reply = rawReply;
  let suggestions = [
    "What lifestyle changes help with this?",
    "When should I visit a gynecologist?",
    "What tests should I ask my doctor for?"
  ];

  const followUpMatch = rawReply.match(/(?:### Suggested Follow-ups:|Suggested Follow-ups:|Follow-up questions:|सुझाए गए प्रश्न:)\s*([\s\S]*)$/i);
  if (followUpMatch && followUpMatch[1]) {
    reply = rawReply.replace(followUpMatch[0], "").trim();
    const lines = followUpMatch[1]
      .split("\n")
      .map((l) => l.replace(/^[-*•\d.)\s]+/, "").trim())
      .filter((l) => l.length > 5 && l.length < 90);
    if (lines.length > 0) {
      suggestions = lines.slice(0, 3);
    }
  }

  return {
    reply,
    suggestions,
    category: "AI Powered Clinical Response",
    citation: "Gemini 1.5 Flash grounded in ICMR, WHO & ACOG Literature",
    isEmergency: /emergency|soaking|immediate hospital|112|1091/i.test(reply)
  };
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { message, history = [], language = "en", apiKey = "" } = body;

    if (!message || typeof message !== "string" || !message.trim()) {
      return NextResponse.json(
        { error: "Message content is required" },
        { status: 400 }
      );
    }

    const effectiveApiKey = apiKey || process.env.GEMINI_API_KEY || "";

    // If Gemini API key is available, call Gemini with grounded context
    if (effectiveApiKey) {
      try {
        const geminiResult = await callGemini(effectiveApiKey, message.trim(), history, language);
        return NextResponse.json({
          success: true,
          source: "gemini_llm",
          citations: RESEARCH_CITATIONS,
          ...geminiResult
        });
      } catch (err) {
        console.warn("Gemini API call failed, falling back to local clinical knowledge engine:", err.message);
      }
    }

    // Default: Grounded deterministic clinical knowledge engine
    const localResult = matchClinicalKnowledge(message.trim(), language);

    return NextResponse.json({
      success: true,
      source: "clinical_knowledge_base",
      citations: RESEARCH_CITATIONS,
      ...localResult
    });
  } catch (error) {
    console.error("Chat API handler error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        message: "Unable to process message at this moment. Please try again."
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: "online",
    name: "Sakhi AI Clinical Chatbot API",
    version: "2.0.0",
    grounding: "ICMR-NIN, WHO, ACOG, FIGO & Monash 2023 Guidelines",
    citations: RESEARCH_CITATIONS,
    topicsCount: CLINICAL_TOPICS.length
  });
}
