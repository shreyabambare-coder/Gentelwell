import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { text, targetLang = "hi" } = await req.json();

    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    // Call Google Translate service
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
    const res = await fetch(url, { method: "GET" });

    if (!res.ok) {
      throw new Error(`Translation API error: ${res.status}`);
    }

    const data = await res.json();
    const translatedText = Array.isArray(data?.[0])
      ? data[0].map((item) => item[0]).join("")
      : text;

    return NextResponse.json({
      success: true,
      translatedText,
      targetLang
    });
  } catch (error) {
    console.error("Translation route error:", error);
    return NextResponse.json(
      { error: "Failed to translate text", details: error.message },
      { status: 500 }
    );
  }
}
