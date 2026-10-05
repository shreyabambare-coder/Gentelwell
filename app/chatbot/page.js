"use client";

import { useState, useRef, useEffect } from "react";
import SetuHeader from "../../components/SetuHeader";
import SetuFooter from "../../components/SetuFooter";

// Clean Markdown-to-JSX renderer for clinical messages
function renderMarkdown(content) {
  if (!content) return null;

  const lines = content.split("\n");
  const elements = [];
  let currentList = null;
  let currentListType = null;
  let currentTable = null;

  const flushList = () => {
    if (currentList) {
      if (currentListType === "ol") {
        elements.push(<ol key={`ol-${elements.length}`}>{currentList}</ol>);
      } else {
        elements.push(<ul key={`ul-${elements.length}`}>{currentList}</ul>);
      }
      currentList = null;
      currentListType = null;
    }
  };

  const flushTable = () => {
    if (currentTable) {
      elements.push(
        <div key={`tbl-wrap-${elements.length}`} style={{ overflowX: "auto" }}>
          <table>
            <thead>
              <tr>
                {currentTable.headers.map((h, i) => (
                  <th key={i}>{formatInline(h)}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentTable.rows.map((row, rIdx) => (
                <tr key={rIdx}>
                  {row.map((cell, cIdx) => (
                    <td key={cIdx}>{formatInline(cell)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      currentTable = null;
    }
  };

  const formatInline = (text) => {
    // Process bold **text** and italic *text*
    const parts = [];
    const regex = /(\*\*.*?\*\*|\*.*?\*|`.*?`)/g;
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }
      const token = match[0];
      if (token.startsWith("**") && token.endsWith("**")) {
        parts.push(<strong key={match.index}>{token.slice(2, -2)}</strong>);
      } else if (token.startsWith("*") && token.endsWith("*")) {
        parts.push(<em key={match.index}>{token.slice(1, -1)}</em>);
      } else if (token.startsWith("`") && token.endsWith("`")) {
        parts.push(
          <code key={match.index} style={{ background: "#f0eaf7", padding: "1px 5px", borderRadius: 4 }}>
            {token.slice(1, -1)}
          </code>
        );
      }
      lastIndex = regex.lastIndex;
    }
    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }
    return parts.length > 0 ? parts : text;
  };

  for (let idx = 0; idx < lines.length; idx++) {
    const rawLine = lines[idx];
    const line = rawLine.trim();

    if (!line) {
      flushList();
      flushTable();
      continue;
    }

    // Markdown Table parsing
    if (line.startsWith("|") && line.endsWith("|")) {
      flushList();
      const cells = line.split("|").slice(1, -1).map((c) => c.trim());
      if (line.includes("---")) {
        // Table separator row, ignore
        continue;
      }
      if (!currentTable) {
        currentTable = { headers: cells, rows: [] };
      } else {
        currentTable.rows.push(cells);
      }
      continue;
    } else {
      flushTable();
    }

    // Horizontal Rule
    if (line === "---" || line === "***") {
      flushList();
      elements.push(<hr key={`hr-${idx}`} />);
      continue;
    }

    // Headers
    if (line.startsWith("# ")) {
      flushList();
      elements.push(<h1 key={`h1-${idx}`}>{formatInline(line.replace("# ", ""))}</h1>);
      continue;
    }
    if (line.startsWith("### ")) {
      flushList();
      elements.push(<h3 key={`h3-${idx}`}>{formatInline(line.replace("### ", ""))}</h3>);
      continue;
    }
    if (line.startsWith("## ")) {
      flushList();
      elements.push(<h2 key={`h2-${idx}`}>{formatInline(line.replace("## ", ""))}</h2>);
      continue;
    }

    // Blockquote
    if (line.startsWith("> ")) {
      flushList();
      elements.push(
        <blockquote key={`bq-${idx}`}>
          {formatInline(line.replace(/^>\s*/, ""))}
        </blockquote>
      );
      continue;
    }

    // Unordered List
    if (line.startsWith("- ") || line.startsWith("* ")) {
      if (currentListType !== "ul") flushList();
      currentListType = "ul";
      if (!currentList) currentList = [];
      currentList.push(<li key={`li-${idx}`}>{formatInline(line.replace(/^[-*]\s+/, ""))}</li>);
      continue;
    }

    // Ordered List
    const olMatch = line.match(/^(\d+)\.\s+(.*)/);
    if (olMatch) {
      if (currentListType !== "ol") flushList();
      currentListType = "ol";
      if (!currentList) currentList = [];
      currentList.push(<li key={`li-${idx}`}>{formatInline(olMatch[2])}</li>);
      continue;
    }

    // Default Paragraph
    flushList();
    elements.push(<p key={`p-${idx}`}>{formatInline(line)}</p>);
  }

  flushList();
  flushTable();
  return <div className="bot-markdown">{elements}</div>;
}

const welcomeMessageEn = `Hello! I am **Sakhi AI** — your evidence-based Women's Health Education Companion.

My guidance is grounded in peer-reviewed clinical literature and official protocols from the **ICMR-NIN (National Institute of Nutrition)**, **WHO**, **ACOG**, and **2023 International PCOS Guidelines**.

Feel free to ask me anything about your cycle, nutrition, hormonal health, or hygiene in a safe, confidential environment.`;

const welcomeMessageHi = `नमस्ते! मैं **सखी AI** हूँ — आपकी साक्ष्य-आधारित महिला स्वास्थ्य और पोषण साथी।

मेरा मार्गदर्शन **ICMR-NIN (राष्ट्रीय पोषण संस्थान)**, **WHO**, **ACOG**, और **2023 अंतर्राष्ट्रीय PCOS दिशानिर्देशों** के आधिकारिक क्लिनिकल प्रोटोकॉल पर आधारित है।

आप अपने माहवारी चक्र, पोषण, हार्मोनल स्वास्थ्य या स्वच्छता से संबंधित कोई भी प्रश्न यहाँ पूरी गोपनीयता और सुरक्षा के साथ पूछ सकती हैं।`;

const welcomeSuggestionsEn = [
  "What are the best natural remedies for menstrual cramps?",
  "What are the earliest signs of PCOS / PCOD?",
  "Top iron-rich Indian foods to boost hemoglobin?",
  "What is a healthy menstrual cycle length?"
];

const welcomeSuggestionsHi = [
  "माहवारी के गंभीर दर्द और ऐंठन से प्राकृतिक राहत कैसे पाएं?",
  "PCOS / PCOD के शुरुआती लक्षण क्या हैं और इसे कैसे नियंत्रित करें?",
  "एनीमिया दूर करने और हीमोग्लोबिन बढ़ाने के लिए श्रेष्ठ भारतीय आहार क्या हैं?",
  "एक स्वस्थ माहवारी चक्र की सामान्य अवधि कितनी होती है?"
];

const categoryTranslations = {
  "Welcome": "स्वागत",
  "Fresh Conversation": "नई बातचीत",
  "Health Guidance": "स्वास्थ्य मार्गदर्शन",
  "System Notice": "सिस्टम सूचना",
  "PCOS Guidance": "PCOS मार्गदर्शन",
  "Menstrual Health": "माहवारी स्वास्थ्य",
  "Anemia & Nutrition": "एनीमिया व पोषण",
  "Pregnancy Care": "गर्भावस्था देखभाल",
  "General Health Education": "सामान्य स्वास्थ्य शिक्षा",
  "Urgent Care": "आपातकालीन देखभाल"
};

const getCategoryLabel = (cat, isHi) => {
  if (!cat) return "";
  if (!isHi) return cat;
  return categoryTranslations[cat] || cat;
};

const getCitationLabel = (citation, isHi) => {
  if (!citation) return "";
  if (!isHi) return citation;
  if (citation.includes("ICMR") && citation.includes("WHO")) return "ICMR एवं WHO क्लिनिकल साक्ष्य आधार";
  if (citation.includes("Monash") || citation.includes("PCOS")) return "मोनाश 2023 अंतर्राष्ट्रीय PCOS साक्ष्य आधार";
  if (citation.includes("WHO")) return "WHO एवं यूनिसेफ क्लिनिकल स्वास्थ्य दिशानिर्देश";
  if (citation.includes("FIGO")) return "FIGO एवं WHO क्लिनिकल मानक";
  return citation;
};

export default function ChatbotPage() {
  const [messages, setMessages] = useState([
    {
      id: "msg-welcome",
      who: "bot",
      text: welcomeMessageEn,
      hindiReply: welcomeMessageHi,
      englishReply: welcomeMessageEn,
      category: "Welcome",
      citation: "ICMR & WHO Clinical Health Education Framework",
      isEmergency: false,
      suggestions: welcomeSuggestionsEn,
      suggestionsHindi: welcomeSuggestionsHi,
      time: "Just now"
    }
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState("en"); // "en" or "hi"
  const [isRecording, setIsRecording] = useState(false);
  const [speakingId, setSpeakingId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [likedIds, setLikedIds] = useState(new Set());
  const [showSettings, setShowSettings] = useState(false);
  const [showCitations, setShowCitations] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [speechError, setSpeechError] = useState("");
  const [translatedMessages, setTranslatedMessages] = useState({});
  const [translatingIds, setTranslatingIds] = useState(new Set());
  const [isHindiTranslated, setIsHindiTranslated] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const recognitionRef = useRef(null);

  // Load custom API key and language preference on mount
  useEffect(() => {
    try {
      const savedKey = localStorage.getItem("sakhi_gemini_key");
      if (savedKey) setApiKey(savedKey);

      const savedLang = localStorage.getItem("setu_lang");
      if (savedLang) {
        setLanguage(savedLang);
        setIsHindiTranslated(savedLang === "hi");
      }
    } catch {
      // ignore localStorage security restrictions
    }

    const handleGlobalLang = (e) => {
      if (e.detail?.lang) {
        handleLanguageChange(e.detail.lang);
      }
    };
    window.addEventListener("setu_lang_change", handleGlobalLang);
    return () => window.removeEventListener("setu_lang_change", handleGlobalLang);
  }, []);

  // Auto-scroll on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Voice recognition setup (Web Speech API)
  const toggleRecording = () => {
    if (isRecording) {
      if (recognitionRef.current) recognitionRef.current.stop();
      setIsRecording(false);
      return;
    }

    const SpeechRecognition =
      typeof window !== "undefined" &&
      (window.SpeechRecognition || window.webkitSpeechRecognition);

    if (!SpeechRecognition) {
      setSpeechError("Voice input is not supported by your current browser. Please use Chrome, Edge, or Safari.");
      setTimeout(() => setSpeechError(""), 4000);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = language === "hi" ? "hi-IN" : "en-US";
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsRecording(true);
        setSpeechError("");
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
        }
      };

      recognition.onerror = (event) => {
        console.warn("Speech recognition error:", event.error);
        setIsRecording(false);
        if (event.error === "not-allowed") {
          setSpeechError("Microphone permission was denied. Please allow microphone access in your browser.");
          setTimeout(() => setSpeechError(""), 5000);
        }
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error("Speech recognition initiation error:", err);
      setIsRecording(false);
    }
  };

  // Text to Speech (Web Speech Synthesis)
  const toggleSpeech = (id, text) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    if (speakingId === id) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
      return;
    }

    window.speechSynthesis.cancel();

    // Clean markdown symbols for natural audio speech
    const cleanText = text
      .replace(/[#*`_>]/g, "")
      .replace(/\|/g, " ")
      .replace(/-{3,}/g, "");

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = language === "hi" ? "hi-IN" : "en-US";
    utterance.rate = 0.95;

    utterance.onend = () => setSpeakingId(null);
    utterance.onerror = () => setSpeakingId(null);

    setSpeakingId(id);
    window.speechSynthesis.speak(utterance);
  };

  // Copy message text
  const handleCopy = (id, text) => {
    navigator.clipboard?.writeText(text).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  // Like message
  const handleLike = (id) => {
    setLikedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Export conversation as TXT file
  const exportChat = () => {
    const transcript = messages
      .map(
        (m) =>
          `[${m.time || "Time"}] ${m.who === "user" ? "YOU" : "SAKHI AI"}:\n${m.text}\n`
      )
      .join("\n----------------------------------------\n\n");

    const blob = new Blob([transcript], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `sakhi-health-chat-${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Clear conversation
  const clearChat = () => {
    if (window.confirm("Do you want to reset and start a fresh conversation?")) {
      window.speechSynthesis?.cancel();
      setSpeakingId(null);
      setMessages([
        {
          id: `msg-${Date.now()}`,
          who: "bot",
          text:
            language === "hi"
              ? "नमस्ते! मैं सखी AI हूँ। महिला स्वास्थ्य और पोषण से जुड़ा कोई भी प्रश्न पूछें।"
              : "Hello! I am Sakhi AI. Please ask any women's health or nutrition question in confidence.",
          category: "Fresh Conversation",
          time: "Just now",
          suggestions: [
            "How to relieve period cramps naturally?",
            "What are early signs of PCOS / PCOD?",
            "Top iron-rich Indian foods to fight anemia?"
          ]
        }
      ]);
    }
  };

  // Send question to backend API
  const handleSend = async (queryText) => {
    const textToSend = (queryText || input).trim();
    if (!textToSend || loading) return;

    if (isRecording && recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
      setIsRecording(false);
    }

    const userMsgId = `user-${Date.now()}`;
    const nowTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    const newUserMsg = {
      id: userMsgId,
      who: "user",
      text: textToSend,
      time: nowTime
    };

    setMessages((prev) => [...prev, newUserMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend,
          history: messages.slice(-6),
          language,
          apiKey
        })
      });

      if (!res.ok) {
        throw new Error(`Server responded with ${res.status}`);
      }

      const data = await res.json();

      const botMsgId = `bot-${Date.now()}`;
      const botResponse = {
        id: botMsgId,
        who: "bot",
        text: data.reply || "I am here to support you with evidence-based health guidance.",
        hindiReply: data.hindiReply,
        englishReply: data.englishReply,
        category: data.category || (language === "hi" ? "स्वास्थ्य मार्गदर्शन" : "Health Guidance"),
        citation: data.citation || "ICMR & WHO Clinical Evidence Base",
        isEmergency: Boolean(data.isEmergency),
        suggestions: data.suggestions || (language === "hi"
          ? [
              "इसके लिए सही खान-पान क्या होना चाहिए?",
              "डॉक्टर को कब दिखाना जरूरी है?",
              "मुझे किन लक्षणों पर ध्यान देना चाहिए?"
            ]
          : [
              "Tell me more about diet for this",
              "When should I visit a gynecologist?",
              "What symptoms should I monitor?"
            ]),
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };

      if ((isHindiTranslated || language === "hi") && data.hindiReply) {
        setTranslatedMessages((prev) => ({ ...prev, [botMsgId]: data.hindiReply }));
      }

      setMessages((prev) => [...prev, botResponse]);
    } catch (err) {
      console.error("Chat request failed:", err);
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-err-${Date.now()}`,
          who: "bot",
          text: language === "hi"
            ? `⚠️ संपर्क में अस्थायी समस्या आई। आपातकालीन स्थिति में तुरंत एम्बुलेंस (**112 / 102**) या महिला हेल्पलाइन (**1091**) पर संपर्क करें।`
            : `⚠️ I encountered a temporary connection issue. 

Please note that for urgent symptoms or emergency care, please contact local emergency medical services (Ambulance: **112 / 102**, Women Helpline: **1091**) or visit a nearby healthcare facility.`,
          category: language === "hi" ? "सूचना" : "System Notice",
          isEmergency: false,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleLanguageChange = async (newLang) => {
    const isHi = newLang === "hi";
    setLanguage(newLang);
    setIsHindiTranslated(isHi);

    try {
      localStorage.setItem("setu_lang", newLang);
    } catch {}

    // Broadcast to SetuHeader and SetuFooter
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("setu_lang_change", { detail: { lang: newLang } }));
    }

    if (isHi) {
      // Translate all bot messages that don't already have Hindi text
      for (const m of messages) {
        if (m.who === "bot") {
          if (m.hindiReply) {
            setTranslatedMessages((prev) => ({ ...prev, [m.id]: m.hindiReply }));
          } else if (!translatedMessages[m.id]) {
            setTranslatingIds((prev) => new Set(prev).add(m.id));
            try {
              const res = await fetch("/api/translate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: m.text, targetLang: "hi" })
              });
              if (res.ok) {
                const data = await res.json();
                if (data.translatedText) {
                  setTranslatedMessages((prev) => ({ ...prev, [m.id]: data.translatedText }));
                }
              }
            } catch (err) {
              console.error("Auto translation error:", err);
            } finally {
              setTranslatingIds((prev) => {
                const n = new Set(prev);
                n.delete(m.id);
                return n;
              });
            }
          }
        }
      }
    } else {
      // Clear translations to display original English text
      setTranslatedMessages({});
    }
  };

  // Right corner toggle: Translates all conversation text into Hindi (or back to English)
  const handleToggleRightCornerTranslate = () => {
    const nextState = !isHindiTranslated;
    handleLanguageChange(nextState ? "hi" : "en");
  };

  // Translate an individual message on demand
  const handleTranslateSingleMessage = async (msgId, text, hindiReply) => {
    if (translatedMessages[msgId]) {
      setTranslatedMessages((prev) => {
        const next = { ...prev };
        delete next[msgId];
        return next;
      });
      return;
    }

    if (hindiReply) {
      setTranslatedMessages((prev) => ({ ...prev, [msgId]: hindiReply }));
      return;
    }

    setTranslatingIds((prev) => new Set(prev).add(msgId));
    try {
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, targetLang: "hi" })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.translatedText) {
          setTranslatedMessages((prev) => ({ ...prev, [msgId]: data.translatedText }));
        }
      }
    } catch (err) {
      console.error("Single message translation error:", err);
    } finally {
      setTranslatingIds((prev) => {
        const next = new Set(prev);
        next.delete(msgId);
        return next;
      });
    }
  };

  const starterTopics = language === "hi" ? [
    {
      icon: "•",
      label: "माहवारी दर्द व प्राकृतिक राहत",
      query: "माहवारी के गंभीर दर्द और ऐंठन से प्राकृतिक राहत कैसे पाएं?"
    },
    {
      icon: "•",
      label: "आयरन व हीमोग्लोबिन (ICMR)",
      query: "एनीमिया दूर करने और हीमोग्लोबिन बढ़ाने के लिए श्रेष्ठ भारतीय आहार क्या हैं?"
    },
    {
      icon: "•",
      label: "PCOS / PCOD लक्षण व आहार",
      query: "PCOS के शुरुआती लक्षण क्या हैं और इसे नियंत्रित करने के लिए क्या खाएं?"
    },
    {
      icon: "•",
      label: "गर्भावस्था देखभाल व पोषण",
      query: "गर्भावस्था में कौन से पोषण और सावधानियां सबसे आवश्यक हैं?"
    },
    {
      icon: "•",
      label: "निजी स्वच्छता व UTI बचाव",
      query: "UTI संक्रमण के मुख्य लक्षण क्या हैं और इससे बचाव के सुरक्षित उपाय क्या हैं?"
    }
  ] : [
    {
      icon: "•",
      label: "Period Pain & Natural Relief",
      query: "What are effective home remedies for severe menstrual cramps?"
    },
    {
      icon: "•",
      label: "Iron & Hemoglobin (ICMR Diet)",
      query: "Best Indian dietary sources to boost hemoglobin and treat anemia?"
    },
    {
      icon: "•",
      label: "PCOS / PCOD Symptoms & Diet",
      query: "Early warning signs of PCOS and lifestyle adjustments to manage it?"
    },
    {
      icon: "•",
      label: "Pregnancy Care & Nutrition",
      query: "Essential nutrition and first-trimester safety guidelines?"
    },
    {
      icon: "•",
      label: "Intimate Hygiene & UTI Care",
      query: "Key symptoms of UTI and prevention practices for daily hygiene?"
    }
  ];

  const isHi = language === "hi" || isHindiTranslated;

  return (
    <>
      <SetuHeader />
      <main className="chat-container">
        {/* Header intro */}
        <div className="chat-header-banner">
          <div className="chat-badge">
            <span className="pulse-dot"></span>
            {isHi ? "साक्ष्य-आधारित AI स्वास्थ्य साथी" : "Evidence-Based AI Companion"}
          </div>
          <h1>
            {isHi ? (
              <>सखी से पूछें <i>विश्वास के साथ।</i></>
            ) : (
              <>Ask Sakhi with <i>confidence.</i></>
            )}
          </h1>
          <p className="hero-copy" style={{ margin: "8px auto 0" }}>
            {isHi
              ? "ICMR-NIN, WHO और 2023 अंतर्राष्ट्रीय PCOS दिशानिर्देशों पर आधारित एक सुरक्षित, निजी और वैज्ञानिक महिला स्वास्थ्य साथी।"
              : "A safe, private, and research-backed women’s health educator grounded in ICMR-NIN, WHO, and 2023 International PCOS Clinical Guidelines."}
          </p>
        </div>

        {/* Main Chat Shell */}
        <section className="chat-card" aria-label="Interactive AI Chatbot">
          {/* Top Bar */}
          <div className="chat-topbar">
            <div className="chat-assistant-meta">
              <div className="chat-avatar" aria-hidden="true" style={{ display: "grid", placeItems: "center" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
                </svg>
              </div>
              <div>
                <h3>
                  {isHi ? "सखी AI स्वास्थ्य सहायक" : "Sakhi AI Assistant"}
                  <span style={{ fontSize: "11px", fontWeight: "normal", color: "#16a34a" }}>
                    ● {isHi ? "सक्रिय" : "Active"}
                  </span>
                </h3>
                <small>
                  {isHi ? "प्रमाणित शोध · चिकित्सा शिक्षा · पूर्णतः निजी" : "Research-backed · Medical Education · Private"}
                </small>
              </div>
            </div>

            <div className="chat-topbar-actions">
              {/* Right Corner Option: Direct One-Click Hindi / English buttons */}
              <div className="right-corner-lang-cluster" role="group" aria-label="Website Language Selection">
                <button
                  type="button"
                  id="btn-lang-hindi"
                  className={`right-corner-translate-btn ${isHi ? "active" : ""}`}
                  onClick={() => handleLanguageChange("hi")}
                  title="वेबसाइट के सभी शब्द हिंदी में करें"
                  aria-label="Hindi language"
                >
                  <span className="pulse-translate-dot"></span>
                  <span>हिंदी</span>
                  {isHi && <span className="translate-badge">सक्रिय</span>}
                </button>
                <button
                  type="button"
                  id="btn-lang-english"
                  className={`right-corner-translate-btn ${!isHi ? "active" : ""}`}
                  onClick={() => handleLanguageChange("en")}
                  title="Switch all website text and words to English"
                  aria-label="English language"
                >
                  <span>English</span>
                  {!isHi && <span className="translate-badge">Active</span>}
                </button>
              </div>

              {/* Research Citations Modal Button */}
              <button
                type="button"
                className="topbar-icon-btn"
                onClick={() => setShowCitations(true)}
                title={isHi ? "चिकित्सा शोध संदर्भ व स्रोत" : "Clinical Research Citations & Sources"}
                aria-label="View Research Citations"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
                </svg>
              </button>

              {/* Settings (Gemini Key) */}
              <button
                type="button"
                className="topbar-icon-btn"
                onClick={() => setShowSettings(true)}
                title={isHi ? "AI सेटिंग्स व मॉडल कॉन्फ़िगरेशन" : "AI Settings & API Configuration"}
                aria-label="Settings"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="3"/>
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                </svg>
              </button>

              {/* Export Transcript */}
              <button
                type="button"
                className="topbar-icon-btn"
                onClick={exportChat}
                title={isHi ? "बातचीत डाउनलोड करें" : "Export conversation history"}
                aria-label="Export chat"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7 10 12 15 17 10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
              </button>

              {/* Clear Chat */}
              <button
                type="button"
                className="topbar-icon-btn"
                onClick={clearChat}
                title={isHi ? "बातचीत रीसेट करें" : "Clear conversation"}
                aria-label="Clear chat"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6"/>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                </svg>
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="chat-messages-area">
            {/* Initial Welcome & Starter Topics (displayed when only welcome message exists) */}
            {messages.length <= 1 && (
              <div className="chat-welcome-banner">
                <h2>{isHi ? "सखी स्वास्थ्य स्पेस में आपका स्वागत है" : "Welcome to Sakhi Health Space"}</h2>
                <p>
                  {isHi
                    ? "चिकित्सा विशेषज्ञों द्वारा प्रमाणित विषयों पर तुरंत चर्चा शुरू करने के लिए किसी भी कार्ड पर टैप करें:"
                    : "Explore curated topics verified by clinical obstetric and nutritional guidelines. Tap any topic to start an instant discussion:"}
                </p>
                <div className="citations-strip">
                  <span className="citation-pill">{isHi ? "ICMR-NIN एनीमिया दिशानिर्देश" : "ICMR-NIN Anemia Guidelines"}</span>
                  <span className="citation-pill">{isHi ? "मोनाश 2023 PCOS सर्वसम्मति" : "Monash 2023 PCOS Consensus"}</span>
                  <span className="citation-pill">{isHi ? "WHO माहवारी स्वच्छता ढांचा" : "WHO Menstrual Hygiene Framework"}</span>
                  <span className="citation-pill">{isHi ? "ACOG मातृ देखभाल मानक" : "ACOG Maternal Care Standards"}</span>
                </div>
                <div className="quick-topics-grid">
                  {starterTopics.map((topic) => (
                    <button
                      key={topic.label}
                      type="button"
                      className="quick-topic-card"
                      onClick={() => handleSend(topic.query)}
                    >
                      <span style={{ fontSize: "14px", fontWeight: "bold", color: "var(--purple)" }}>{topic.icon}</span>
                      <span>{topic.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Message Stream */}
            {messages.map((m) => {
              const activeText = isHi
                ? (m.hindiReply || translatedMessages[m.id] || m.text)
                : (m.englishReply || (m.who === "bot" ? m.text : (translatedMessages[m.id] || m.text)));
              const isMsgTranslated = Boolean(translatedMessages[m.id]) || isHi;

              return (
                <div key={m.id} className={`msg-row ${m.who}`}>
                  <div className="msg-avatar" aria-hidden="true" style={{ display: "grid", placeItems: "center" }}>
                    {m.who === "bot" ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
                      </svg>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                        <circle cx="12" cy="7" r="4"/>
                      </svg>
                    )}
                  </div>
                  <div className="msg-bubble-container">
                    <div className="msg-meta-line">
                      <span>{m.who === "bot" ? (isHi ? "सखी AI" : "Sakhi AI") : (isHi ? "आप" : "You")}</span>
                      {m.category && <span className="msg-category-tag">{getCategoryLabel(m.category, isHi)}</span>}
                      <span>• {m.time === "Just now" ? (isHi ? "अभी-अभी" : "Just now") : m.time}</span>
                    </div>

                    <div className="msg-bubble">
                      {/* Translated Badge Indicator */}
                      {isMsgTranslated && (
                        <div className="translated-notice-badge">
                          {isHi ? "हिंदी अनुवाद" : "Translated into Hindi"}
                        </div>
                      )}

                      {m.who === "bot" ? (
                        renderMarkdown(activeText)
                      ) : (
                        <p style={{ margin: 0 }}>{activeText}</p>
                      )}

                      {/* Emergency Red Flag Alert Box */}
                      {m.isEmergency && (
                        <div className="emergency-alert-card">
                          <h4 style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
                              <line x1="12" y1="9" x2="12" y2="13"/>
                              <line x1="12" y1="17" x2="12.01" y2="17"/>
                            </svg>
                            {isHi ? "गंभीर आपातकालीन खतरे का लक्षण" : "Urgent Medical Red Flag Detected"}
                          </h4>
                          <p style={{ margin: "0 0 6px", fontSize: "12px", lineHeight: "1.5" }}>
                            {isHi
                              ? "ये लक्षण गंभीर चिकित्सीय जोखिम (जैसे अत्यधिक रक्तस्राव, एक्टोपिक जटिलता, या तीव्र श्रोणि विकृति) का संकेत हो सकते हैं। तुरंत नजदीकी अस्पताल आपातकालीन डॉक्टर या महिला रोग विशेषज्ञ से जांच कराएं।"
                              : "These symptoms may indicate acute clinical risk (e.g. severe hemorrhage, ectopic complications, or acute pelvic pathology). Immediate evaluation by a hospital emergency doctor or gynecologist is strongly advised."}
                          </p>
                          <div className="emergency-hotlines">
                            <a href="tel:112" className="hotline-btn">
                              {isHi ? "एम्बुलेंस: 112" : "Ambulance: 112"}
                            </a>
                            <a href="tel:1091" className="hotline-btn" style={{ background: "#be185d" }}>
                              {isHi ? "महिला हेल्पलाइन: 1091" : "Women Helpline: 1091"}
                            </a>
                          </div>
                        </div>
                      )}

                      {/* Source Citation Badge */}
                      {m.who === "bot" && m.citation && (
                        <div className="citation-footer-badge">
                          {isHi ? "साक्ष्य स्रोत:" : "Grounding Source:"} {getCitationLabel(m.citation, isHi)}
                        </div>
                      )}
                    </div>

                    {/* Actions for Bot Message */}
                    {m.who === "bot" && (
                      <div className="msg-footer-bar">
                        {/* Translate button on message */}
                        <button
                          type="button"
                          className={`msg-tool-btn ${isMsgTranslated ? "active" : ""}`}
                          onClick={() => handleTranslateSingleMessage(m.id, m.text, m.hindiReply)}
                          title={isMsgTranslated ? "Show original text" : "Translate this response into Hindi"}
                          aria-label="Translate message"
                        >
                          {translatingIds.has(m.id)
                            ? (isHi ? "अनुवाद हो रहा है..." : "Translating...")
                            : isMsgTranslated
                            ? "Original (EN)"
                            : (isHi ? "हिंदी अनुवाद" : "Translate (HI)")}
                        </button>
                        <button
                          type="button"
                          className={`msg-tool-btn ${speakingId === m.id ? "active" : ""}`}
                          onClick={() => toggleSpeech(m.id, activeText)}
                          title={isHi ? "इस उत्तर को सुनें" : "Listen to this response"}
                          aria-label="Listen"
                        >
                          {speakingId === m.id ? (isHi ? "रोकें" : "Stop") : (isHi ? "सुनें" : "Listen")}
                        </button>
                        <button
                          type="button"
                          className={`msg-tool-btn ${copiedId === m.id ? "active" : ""}`}
                          onClick={() => handleCopy(m.id, activeText)}
                          title={isHi ? "क्लिपबोर्ड में कॉपी करें" : "Copy to clipboard"}
                          aria-label="Copy"
                        >
                          {copiedId === m.id ? (isHi ? "कॉपी हुआ" : "Copied") : (isHi ? "कॉपी" : "Copy")}
                        </button>
                        <button
                          type="button"
                          className={`msg-tool-btn ${likedIds.has(m.id) ? "active" : ""}`}
                          onClick={() => handleLike(m.id)}
                          title={isHi ? "क्या यह जानकारी उपयोगी थी?" : "Was this helpful?"}
                          aria-label="Helpful"
                        >
                          {likedIds.has(m.id) ? (isHi ? "उपयोगी लगा" : "Helpful") : (isHi ? "उपयोगी" : "Helpful")}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Loading / Typing Indicator */}
            {loading && (
              <div className="msg-row bot">
                <div className="msg-avatar" aria-hidden="true" style={{ display: "grid", placeItems: "center" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
                  </svg>
                </div>
                <div className="msg-bubble-container">
                  <div className="msg-meta-line">
                    <span>
                      {isHi ? "सखी AI चिकित्सकीय दिशानिर्देशों का विश्लेषण कर रही है..." : "Sakhi AI is analyzing clinical guidelines..."}
                    </span>
                  </div>
                  <div className="typing-box">
                    <span className="typing-dot"></span>
                    <span className="typing-dot"></span>
                    <span className="typing-dot"></span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Follow-up Suggestion Chips from latest bot message */}
          {!loading &&
            messages.length > 0 &&
            messages[messages.length - 1].who === "bot" && (
              <div className="followup-chips-row">
                <span style={{ fontSize: "11px", color: "var(--muted)", alignSelf: "center" }}>
                  {isHi ? "सुझाए गए प्रश्न:" : "Suggested follow-ups:"}
                </span>
                {(
                  (isHi && messages[messages.length - 1].suggestionsHindi)
                    ? messages[messages.length - 1].suggestionsHindi
                    : (messages[messages.length - 1].suggestions || [])
                ).map((sug, i) => (
                  <button
                    key={i}
                    type="button"
                    className="followup-chip"
                    onClick={() => handleSend(sug)}
                  >
                    <span>•</span> {sug}
                  </button>
                ))}
              </div>
            )}

          {/* Speech Error Banner */}
          {speechError && (
            <div
              style={{
                background: "#fef2f2",
                color: "#b91c1c",
                fontSize: "12px",
                padding: "8px 20px",
                borderTop: "1px solid #fecaca"
              }}
            >
              {speechError}
            </div>
          )}

          {/* Chat Input Bar */}
          <form
            className="chat-input-wrapper"
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
          >
            {/* Voice Input Microphone */}
            <button
              type="button"
              className={`mic-btn ${isRecording ? "recording" : ""}`}
              onClick={toggleRecording}
              title={
                isRecording
                  ? isHi ? "सुन रहे हैं... रोकने के लिए क्लिक करें" : "Listening... Click to stop"
                  : isHi ? "बोलकर प्रश्न पूछें (वॉयस इनपुट)" : "Speak your question (Voice Input)"
              }
              aria-label="Voice input microphone"
            >
              {isRecording ? (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="4" y="4" width="16" height="16" rx="2" ry="2"/>
                </svg>
              ) : (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/>
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                  <line x1="12" y1="19" x2="12" y2="22"/>
                </svg>
              )}
            </button>

            {/* Main Text Input */}
            <input
              ref={inputRef}
              type="text"
              className="chat-input-field"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                isRecording
                  ? isHi ? "आपकी आवाज सुनी जा रही है..." : "Listening to your voice..."
                  : isHi
                  ? "महिला स्वास्थ्य, माहवारी, दर्द, पोषण, PCOS या गर्भावस्था के बारे में पूछें..."
                  : "Ask about periods, cramps, PCOS, anemia, pregnancy, nutrition..."
              }
              aria-label="Type your health question"
              disabled={loading}
            />

            {/* Send Button */}
            <button
              type="submit"
              className="send-btn"
              disabled={loading || !input.trim()}
              title={isHi ? "प्रश्न भेजें" : "Send question"}
              aria-label="Send"
            >
              ↑
            </button>
          </form>
        </section>

        {/* Clinical Disclaimer */}
        <p className="chat-disclaimer" style={{ marginTop: "18px" }}>
          <b>{isHi ? "शैक्षणिक सूचना:" : "Educational Notice:"}</b>{" "}
          {isHi
            ? "सखी AI ICMR, WHO एवं ACOG मानकों पर आधारित साक्ष्य-सम्मत स्वास्थ्य शिक्षा प्रदान करती है। यह किसी डॉक्टर के व्यक्तिगत निदान, शारीरिक परीक्षण या पर्चे का विकल्प नहीं है। आपात स्थिति में तुरंत 112 पर कॉल करें।"
            : "Sakhi AI provides peer-reviewed health education grounded in ICMR, WHO, and ACOG standards. It does not replace clinical diagnosis, physical examination, or personal prescription from a licensed healthcare provider. For medical emergencies, call 112."}
        </p>

        {/* Modal: Research Citations & Sources */}
        {showCitations && (
          <div className="modal-overlay" onClick={() => setShowCitations(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>{isHi ? "क्लिनिकल रिसर्च स्रोत एवं संदर्भ" : "Clinical Research Sources & Citations"}</h3>
                <button
                  type="button"
                  className="modal-close-btn"
                  onClick={() => setShowCitations(false)}
                >
                  ✕
                </button>
              </div>
              <p style={{ fontSize: "13px", color: "var(--muted)", lineHeight: "1.6" }}>
                {isHi
                  ? "सखी AI प्रमुख अंतरराष्ट्रीय और भारतीय स्वास्थ्य अनुसंधान निकायों से प्राप्त साक्ष्य-आधारित आंकड़ों का संश्लेषण करती है:"
                  : "Sakhi AI synthesizes real-world clinical data and peer-reviewed literature from leading health research bodies:"}
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "14px" }}>
                <div style={{ padding: "12px", background: "#faf7fc", borderRadius: "10px", border: "1px solid #ecdff1" }}>
                  <b style={{ color: "var(--purple)", fontSize: "13px" }}>
                    {isHi ? "1. ICMR - राष्ट्रीय पोषण संस्थान (NIN)" : "1. ICMR - National Institute of Nutrition (NIN)"}
                  </b>
                  <p style={{ fontSize: "12px", color: "var(--muted)", margin: "4px 0 0" }}>
                    {isHi
                      ? "भारतीयों के लिए पोषण दिशानिर्देश एवं एनीमिया मुक्त भारत (AMB): गैर-हीम आयरन अवशोषण, विटामिन C का संयोजन और IFA पूरकता।"
                      : "Dietary Guidelines for Indians & Anemia Mukt Bharat (AMB): Non-heme iron absorption, Vitamin C synergy, and IFA supplementation protocols."}
                  </p>
                </div>
                <div style={{ padding: "12px", background: "#faf7fc", borderRadius: "10px", border: "1px solid #ecdff1" }}>
                  <b style={{ color: "var(--purple)", fontSize: "13px" }}>
                    {isHi ? "2. 2023 अंतर्राष्ट्रीय PCOS दिशानिर्देश" : "2. 2023 International Evidence-Based Guidelines on PCOS"}
                  </b>
                  <p style={{ fontSize: "12px", color: "var(--muted)", margin: "4px 0 0" }}>
                    {isHi
                      ? "मोनाश विश्वविद्यालय, ASRM व ESHRE: रॉटरडैम मानदंड, इंसुलिन प्रतिरोध, इनोसिटोल (40:1) और जीवनशैली प्रबंधन।"
                      : "Monash University, ASRM & ESHRE with ICMR-NIRRCH: Rotterdam criteria, insulin resistance, inositol ratios (40:1), and lifestyle management."}
                  </p>
                </div>
                <div style={{ padding: "12px", background: "#faf7fc", borderRadius: "10px", border: "1px solid #ecdff1" }}>
                  <b style={{ color: "var(--purple)", fontSize: "13px" }}>
                    {isHi ? "3. WHO व UNICEF माहवारी स्वच्छता प्रबंधन (MHM)" : "3. WHO & UNICEF Menstrual Hygiene Management (MHM)"}
                  </b>
                  <p style={{ fontSize: "12px", color: "var(--muted)", margin: "4px 0 0" }}>
                    {isHi
                      ? "FIGO असामान्य गर्भाशय रक्तस्राव मानक, चक्र अवधि (24-38 दिन), इंटीमेट वॉश सुरक्षा और टॉक्सिक शॉक सिंड्रोम रोकथाम।"
                      : "FIGO abnormal uterine bleeding standards, cycle duration (24-38 days), intimate wash safety, and Toxic Shock Syndrome (TSS) prevention."}
                  </p>
                </div>
                <div style={{ padding: "12px", background: "#faf7fc", borderRadius: "10px", border: "1px solid #ecdff1" }}>
                  <b style={{ color: "var(--purple)", fontSize: "13px" }}>
                    {isHi ? "4. WHO व ACOG प्रसवपूर्व मातृत्व देखभाल (ANC)" : "4. WHO & ACOG Maternal & Antenatal Care (ANC)"}
                  </b>
                  <p style={{ fontSize: "12px", color: "var(--muted)", margin: "4px 0 0" }}>
                    {isHi
                      ? "त्रैमासिक मील के पत्थर, दैनिक किक काउंट ट्रैकिंग, फोलिक एसिड से तंत्रिका दोष रोकथाम, और प्री-एक्लेम्पसिया चेतावनी।"
                      : "Trimester milestones, daily kick count tracking, neural tube defect prevention with folic acid, and preeclampsia red flags."}
                  </p>
                </div>
              </div>
              <div className="modal-actions">
                <button
                  type="button"
                  className="button"
                  onClick={() => setShowCitations(false)}
                >
                  {isHi ? "बंद करें" : "Close"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Gemini API Key & Model Settings */}
        {showSettings && (
          <div className="modal-overlay" onClick={() => setShowSettings(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>{isHi ? "AI मॉडल एवं API कॉन्फ़िगरेशन" : "AI Model & API Configuration"}</h3>
                <button
                  type="button"
                  className="modal-close-btn"
                  onClick={() => setShowSettings(false)}
                >
                  ✕
                </button>
              </div>

              <div className="settings-field">
                <label htmlFor="gemini-key">{isHi ? "Google Gemini API Key (वैकल्पिक)" : "Google Gemini API Key (Optional)"}</label>
                <input
                  id="gemini-key"
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="AIzaSy..."
                />
                <small>
                  {isHi
                    ? "वैकल्पिक। खाली छोड़ने पर सखी अपने इन-बिल्ट ICMR एवं WHO क्लिनिकल नॉलेज इंजन पर बिना किसी सेटअप के काम करती है। Gemini Key जोड़ने से Google Gemini 1.5 Flash सक्रिय होता है।"
                    : "Optional. If left blank, Sakhi seamlessly runs on its built-in, high-accuracy ICMR & WHO Clinical Evidence Engine with zero setup. Adding a Gemini key enables dynamic Google Gemini 1.5 Flash generation."}
                </small>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="button ghost"
                  onClick={() => {
                    setApiKey("");
                    try {
                      localStorage.removeItem("sakhi_gemini_key");
                    } catch {
                      // ignore
                    }
                    setShowSettings(false);
                  }}
                >
                  {isHi ? "स्थानीय AI पर रीसेट करें" : "Reset to Local AI"}
                </button>
                <button
                  type="button"
                  className="button"
                  onClick={() => {
                    try {
                      localStorage.setItem("sakhi_gemini_key", apiKey.trim());
                    } catch {
                      // ignore
                    }
                    setShowSettings(false);
                  }}
                >
                  {isHi ? "सहेजें और लागू करें" : "Save & Apply"}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
      <SetuFooter />
    </>
  );
}
