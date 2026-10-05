"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import SetuHeader from "../../components/SetuHeader";
import SetuFooter from "../../components/SetuFooter";
import {
  getForumPosts,
  queueMutation,
  getHousehold,
  evaluateForumModeration,
  logAudit,
  getNetworkMode
} from "../../lib/offlineSync";
import { COMMUNITY_GUIDELINES, PILOT_REGION } from "../../lib/setuData";

export default function CommunityPage() {
  const [posts, setPosts] = useState([]);
  const [household, setHousehold] = useState(null);
  const [activeTopic, setActiveTopic] = useState("all");
  const [lang, setLang] = useState("en");
  const [networkMode, setNetworkMode] = useState("online");
  const [showGuidelines, setShowGuidelines] = useState(false);
  const [showNewPostModal, setShowNewPostModal] = useState(false);

  // New Post Form State
  const [postTopic, setPostTopic] = useState("Maternal Health");
  const [postTitle, setPostTitle] = useState("");
  const [postContent, setPostContent] = useState("");
  const [authorName, setAuthorName] = useState("Pooja Devi");
  const [authorRole, setAuthorRole] = useState("patient");
  const [submitting, setSubmitting] = useState(false);
  const [formFeedback, setFormFeedback] = useState("");

  // Reply Input State
  const [replyTextMap, setReplyTextMap] = useState({});

  useEffect(() => {
    setPosts(getForumPosts());
    setHousehold(getHousehold());
    setNetworkMode(getNetworkMode());

    try {
      const savedLang = localStorage.getItem("setu_lang");
      if (savedLang) setLang(savedLang);
    } catch {}

    const handleForumUpdate = (e) => {
      if (e.detail?.posts) setPosts(e.detail.posts);
    };

    const handleLangChange = (e) => {
      if (e.detail?.lang) setLang(e.detail.lang);
    };

    const handleNetChange = (e) => {
      if (e.detail?.mode) setNetworkMode(e.detail.mode);
    };

    window.addEventListener("setu_forum_update", handleForumUpdate);
    window.addEventListener("setu_lang_change", handleLangChange);
    window.addEventListener("setu_network_change", handleNetChange);

    return () => {
      window.removeEventListener("setu_forum_update", handleForumUpdate);
      window.removeEventListener("setu_lang_change", handleLangChange);
      window.removeEventListener("setu_network_change", handleNetChange);
    };
  }, []);

  const isHi = lang === "hi";

  const topics = [
    { id: "all", label: isHi ? "सभी विषय" : "All Topics" },
    { id: "Maternal Health", label: isHi ? "मातृत्व एवं प्रसव" : "Maternal Health" },
    { id: "Infant Care", label: isHi ? "शिशु पोषण एवं देखभाल" : "Infant Care" },
    { id: "Nutrition", label: isHi ? "स्थानीय आहार व नुस्खे" : "Nutrition" },
    { id: "Menstrual Health", label: isHi ? "माहवारी व स्वच्छता" : "Menstrual Health" }
  ];

  const filteredPosts = posts.filter((p) => {
    if (activeTopic === "all") return true;
    return p.topic === activeTopic;
  });

  // Upvote Action
  const handleUpvote = (postId) => {
    queueMutation({
      entityType: "ForumPost",
      action: "UPVOTE",
      payload: { id: postId },
      purposeOfUse: "care-coordination"
    });
    setPosts(getForumPosts());
  };

  // Report Action
  const handleReport = (postId) => {
    if (confirm(isHi ? "क्या आप इस पोस्ट को सुरक्षा जांच हेतु रिपोर्ट करना चाहते हैं?" : "Report this post for safety moderation review?")) {
      queueMutation({
        entityType: "ForumPost",
        action: "REPORT",
        payload: { id: postId },
        purposeOfUse: "care-coordination"
      });
      logAudit({
        action: "FORUM_POST_REPORTED",
        actor: authorName,
        detail: `Reported post ${postId} for moderator review.`
      });
      setPosts(getForumPosts());
      alert(isHi ? "✓ पोस्ट मॉडरेटर समीक्षा के लिए चिन्हित कर दी गई है।" : "✓ Post flagged for ASHA and clinical moderator review.");
    }
  };

  // Reply Submit
  const handleReplySubmit = (postId) => {
    const text = replyTextMap[postId];
    if (!text || !text.trim()) return;

    const evaluation = evaluateForumModeration(text);
    const newReply = {
      id: "rep-" + Date.now(),
      author: authorName,
      authorRole: authorRole,
      badge: authorRole === "asha" ? "Verified Community Health Worker" : authorRole === "clinician" ? "Verified Clinician" : "Community Member",
      timeAgo: "Just now",
      text: text.trim(),
      textHi: text.trim(),
      moderationStatus: evaluation.status
    };

    queueMutation({
      entityType: "ForumPost",
      action: "REPLY",
      payload: { postId, reply: newReply },
      purposeOfUse: "care-coordination"
    });

    if (evaluation.isEscalated) {
      queueMutation({
        entityType: "Escalation",
        action: "CREATE",
        payload: {
          id: "esc-" + Date.now(),
          patientName: authorName,
          village: "Banari",
          age: 26,
          reason: `Emergency keyword in forum reply: ${text.slice(0, 80)}`,
          urgency: "urgent",
          status: "pending_review",
          createdAt: new Date().toISOString(),
          assignedTo: "Dr. Snehal Shinde (Gyn/Obs)"
        },
        purposeOfUse: "emergency"
      });
    }

    setReplyTextMap({ ...replyTextMap, [postId]: "" });
    setPosts(getForumPosts());
  };

  // Create Post Submit
  const handleCreatePost = (e) => {
    e.preventDefault();
    if (!postTitle.trim() || !postContent.trim()) {
      setFormFeedback(isHi ? "कृपया शीर्षक और विवरण दोनों भरें।" : "Please provide both title and content.");
      return;
    }

    setSubmitting(true);

    const fullText = `${postTitle} ${postContent}`;
    const evaluation = evaluateForumModeration(fullText);

    const newPost = {
      id: "post-" + Date.now(),
      author: authorName,
      authorRole: authorRole,
      badge: authorRole === "asha" ? "Verified Community Health Worker" : authorRole === "clinician" ? "Verified Clinician" : "Community Member",
      cohort: "Palghar & Mokhada Maternal Circle",
      village: household?.village || "Mokhada, Maharashtra",
      timeAgo: "Just now",
      topic: postTopic,
      title: postTitle.trim(),
      titleHi: postTitle.trim(),
      content: postContent.trim(),
      contentHi: postContent.trim(),
      upvotes: 0,
      repliesCount: 0,
      moderationStatus: evaluation.status,
      isEscalatedToDoctor: evaluation.isEscalated,
      escalationNote: evaluation.isEscalated
        ? "🚨 AUTOMATED RED-FLAG SAFETY ALERT: Potential acute symptom detected. Escalated to Dr. Snehal Shinde."
        : null,
      replies: []
    };

    // If emergency symptoms detected, automatically create an Escalation Ticket for Clinicians!
    if (evaluation.isEscalated) {
      queueMutation({
        entityType: "Escalation",
        action: "CREATE",
        payload: {
          id: "esc-" + Date.now(),
          patientName: authorName,
          village: household?.village || "Palghar District",
          age: 26,
          reason: `Forum Red-Flag Auto-Escalation: "${postTitle}" - ${postContent.slice(0, 100)}`,
          urgency: "urgent",
          status: "pending_review",
          createdAt: new Date().toISOString(),
          assignedTo: "Dr. Snehal Shinde (Gyn/Obs)"
        },
        purposeOfUse: "emergency"
      });

      logAudit({
        action: "FORUM_EMERGENCY_ESCALATION",
        actor: authorName,
        detail: `Auto-escalated high-risk forum post to Clinician Review queue: "${postTitle}"`
      });
    }

    queueMutation({
      entityType: "ForumPost",
      action: "CREATE",
      payload: newPost,
      purposeOfUse: "care-coordination"
    });

    setPosts(getForumPosts());
    setPostTitle("");
    setPostContent("");
    setSubmitting(false);
    setShowNewPostModal(false);

    if (evaluation.isEscalated) {
      alert(isHi
        ? "⚠️ आपातकालीन लक्षण पाए गए! आपकी पोस्ट प्रकाशित होने के साथ-साथ डॉ. स्नेहल शिंदे के आपातकालीन डेस्क को सीधे भेज दी गई है।"
        : "⚠️ Emergency symptom detected! Your post has been published and simultaneously escalated to Dr. Snehal Shinde's Clinician Emergency Queue."
      );
    } else if (evaluation.status === "pending_review") {
      alert(isHi
        ? "ℹ️ इस पोस्ट में स्वास्थ्य दावा है, इसलिए यह आशा कार्यकर्ता / डॉक्टर की समीक्षा के बाद सभी को दिखेगी।"
        : "ℹ️ Post contains unverified health claims and will be visible to all once reviewed by certified ASHA moderator."
      );
    } else {
      alert(isHi ? "✓ आपकी पोस्ट सफलतापूर्वक साझा की गई!" : "✓ Post shared successfully with your local cohort!");
    }
  };

  // Voice narration of active posts
  const speakPost = (post) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const titleText = isHi ? (post.titleHi || post.title) : post.title;
    const bodyText = isHi ? (post.contentHi || post.content) : post.content;
    const u = new SpeechSynthesisUtterance(`${titleText}. ${bodyText}`);
    u.lang = isHi ? "hi-IN" : "en-US";
    window.speechSynthesis.speak(u);
  };

  return (
    <>
      <SetuHeader />
      <main className="container" style={{ padding: "40px 0 80px" }}>
        {/* Header Section */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px", marginBottom: "28px" }}>
          <div>
            <div className="voice-action-pill" style={{ marginBottom: "8px" }}>
              <span>{isHi ? "चरण 2: संचालित पायलट समूह" : "PHASE 2: MODERATED PILOT COHORT (§4, §11)"}</span>
            </div>
            <h1 style={{ margin: "4px 0 8px" }}>
              {isHi ? "सखी समुदाय सहायता मंच" : "Community Peer Support Forum"}
            </h1>
            <p style={{ margin: 0, maxWidth: "680px", color: "var(--slate)" }}>
              {isHi
                ? "माताओं, आशा कार्यकर्ताओं और डॉक्टरों का सुरक्षित स्थानीय समूह। सभी स्वास्थ्य दावों की प्री-मॉडरेशन जांच और आपातकालीन लक्षणों पर त्वरित डॉक्टर रेफरल।"
                : "A secure, invite-based circle connecting rural mothers, ASHAs, and clinicians. Features automated health-claim pre-moderation and instant emergency escalation."}
            </p>
          </div>

          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={() => setShowGuidelines(!showGuidelines)}
              className="button ghost"
              style={{ fontSize: "13px" }}
            >
              {showGuidelines ? (isHi ? "नियम छुपाएं" : "Hide Rules") : (isHi ? "सुरक्षा नियम व दिशानिर्देश" : "Community Guidelines")}
            </button>
            <button
              type="button"
              onClick={() => setShowNewPostModal(true)}
              className="button"
              style={{ fontSize: "13px" }}
            >
              {isHi ? "+ नया सवाल / अनुभव लिखें" : "+ Share Tip or Question"}
            </button>
          </div>
        </div>

        {/* Community Guidelines Box (§11) */}
        {showGuidelines && (
          <div
            style={{
              background: "var(--sage)",
              border: "1.5px solid var(--forest)",
              borderRadius: "16px",
              padding: "20px 24px",
              marginBottom: "32px"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
              <h3 style={{ margin: 0, color: "var(--forest)" }}>
                {isHi ? "🛡️ सुरक्षित समुदाय दिशानिर्देश (भारत DPDP अधिनियम 2023)" : "🛡️ Community Safety & Moderation Principles (§11)"}
              </h3>
              <span className="stat-tag" style={{ background: "#dcfce7", color: "#166534" }}>
                {isHi ? "सक्रिय प्री-मॉडरेशन" : "Active Pre-Moderation Engine"}
              </span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "16px" }}>
              {COMMUNITY_GUIDELINES.map((g) => (
                <div key={g.id} style={{ background: "#fff", borderRadius: "12px", padding: "14px", border: "1px solid var(--line)" }}>
                  <b style={{ color: "var(--forest)", fontSize: "14px" }}>{isHi ? g.titleHi : g.title}</b>
                  <p style={{ margin: "6px 0 0", fontSize: "12.5px", color: "var(--slate)" }}>
                    {isHi ? g.descHi : g.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Safety & Protocol Banner */}
        <div
          style={{
            background: "#eff6ff",
            border: "1px solid #bfdbfe",
            borderRadius: "14px",
            padding: "14px 18px",
            marginBottom: "24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "12px"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "20px" }}>🚨</span>
            <div style={{ fontSize: "13px", color: "#1e40af" }}>
              <b>{isHi ? "आपातकालीन सुरक्षा कवच:" : "Clinical Safety Protocol:"}</b>{" "}
              {isHi
                ? "यदि कोई बहन रक्तस्राव, तेज सिरदर्द या बेहोशी का जिक्र करती है, तो सिस्टम स्वचालित रूप से केस डॉक्टर को रेफर कर देता है।"
                : "Any mentions of severe pain, bleeding, or respiratory distress are automatically flagged to Dr. Snehal Shinde."}
            </div>
          </div>
          <Link href="/clinician" style={{ fontSize: "12px", fontWeight: "700", color: "#1d4ed8", textDecoration: "underline" }}>
            {isHi ? "डॉक्टर समीक्षा कतार देखें →" : "View Clinician Review Queue →"}
          </Link>
        </div>

        {/* Topic Filters */}
        <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "8px", marginBottom: "24px" }}>
          {topics.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveTopic(t.id)}
              style={{
                background: activeTopic === t.id ? "var(--forest)" : "#fff",
                color: activeTopic === t.id ? "#fff" : "var(--ink)",
                border: activeTopic === t.id ? "none" : "1px solid var(--line)",
                padding: "8px 16px",
                borderRadius: "20px",
                fontSize: "13px",
                fontWeight: "600",
                cursor: "pointer",
                whiteSpace: "nowrap"
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Post Feed */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {filteredPosts.map((post) => {
            const isEmergency = post.moderationStatus === "flagged_emergency" || post.isEscalatedToDoctor;
            const isPending = post.moderationStatus === "pending_review";
            const isReported = post.moderationStatus === "reported_under_review";

            return (
              <div
                key={post.id}
                className="card"
                style={{
                  borderLeft: isEmergency ? "6px solid #dc2626" : isPending ? "6px solid #f59e0b" : "6px solid var(--forest)",
                  position: "relative"
                }}
              >
                {/* Post Top Meta */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "10px", marginBottom: "10px" }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                      <b style={{ fontSize: "15px" }}>{post.author}</b>
                      {post.badge && (
                        <span
                          className="stat-tag"
                          style={{
                            background: post.authorRole === "clinician" ? "#dbeafe" : post.authorRole === "asha" ? "#dcfce7" : "var(--sage)",
                            color: post.authorRole === "clinician" ? "#1e40af" : post.authorRole === "asha" ? "#166534" : "var(--forest)",
                            fontSize: "11px"
                          }}
                        >
                          ✓ {post.badge}
                        </span>
                      )}
                      <span style={{ fontSize: "12px", color: "var(--slate)" }}>· {post.village}</span>
                      <span style={{ fontSize: "12px", color: "var(--slate)" }}>· {post.timeAgo}</span>
                    </div>
                    <div style={{ fontSize: "11.5px", color: "var(--clay)", fontWeight: "600", marginTop: "3px" }}>
                      👥 {post.cohort}
                    </div>
                  </div>

                  {/* Status Badges & Voice button */}
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <button
                      type="button"
                      onClick={() => speakPost(post)}
                      title={isHi ? "आवाज में सुनें" : "Read aloud with voice"}
                      style={{
                        background: "var(--sage)",
                        border: "1px solid var(--line)",
                        borderRadius: "50%",
                        width: "32px",
                        height: "32px",
                        display: "grid",
                        placeItems: "center",
                        cursor: "pointer"
                      }}
                    >
                      🔊
                    </button>

                    {isEmergency && (
                      <span className="stat-tag" style={{ background: "#fee2e2", color: "#b91c1c" }}>
                        🚨 {isHi ? "डॉक्टर आपातकालीन अलर्ट" : "Emergency Escalated"}
                      </span>
                    )}

                    {isPending && (
                      <span className="stat-tag" style={{ background: "#fef3c7", color: "#92400e" }}>
                        ⏳ {isHi ? "आशा समीक्षा लंबित" : "Under CHW Review"}
                      </span>
                    )}

                    {isReported && (
                      <span className="stat-tag" style={{ background: "#fee2e2", color: "#991b1b" }}>
                        ⚠️ {isHi ? "रिपोर्टेड" : "Reported"}
                      </span>
                    )}
                  </div>
                </div>

                {/* Emergency Alert Box inside post */}
                {isEmergency && post.escalationNote && (
                  <div
                    style={{
                      background: "#fff1f2",
                      border: "1px solid #fecdd3",
                      borderRadius: "10px",
                      padding: "10px 14px",
                      fontSize: "12.5px",
                      color: "#9f1239",
                      marginBottom: "12px",
                      fontWeight: "500"
                    }}
                  >
                    {post.escalationNote}
                    <div style={{ marginTop: "6px" }}>
                      <Link href="/triage?mode=emergency" style={{ color: "#be123c", fontWeight: "bold", textDecoration: "underline" }}>
                        {isHi ? "112 / 102 आपातकालीन एम्बुलेंस डायल करें →" : "Direct Ambulance / Emergency Contact →"}
                      </Link>
                    </div>
                  </div>
                )}

                {/* Title & Body */}
                <h3 style={{ margin: "0 0 8px", fontSize: "17px" }}>
                  {isHi ? (post.titleHi || post.title) : post.title}
                </h3>
                <p style={{ margin: "0 0 16px", fontSize: "14px", lineHeight: "1.55", color: "#374151" }}>
                  {isHi ? (post.contentHi || post.content) : post.content}
                </p>

                {/* Post Footer Actions */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingTop: "12px",
                    borderTop: "1px solid var(--line)",
                    flexWrap: "wrap",
                    gap: "10px"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <button
                      type="button"
                      onClick={() => handleUpvote(post.id)}
                      style={{
                        background: "var(--sage)",
                        border: "1px solid var(--line)",
                        borderRadius: "16px",
                        padding: "5px 12px",
                        fontSize: "12.5px",
                        fontWeight: "600",
                        color: "var(--forest)",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "5px"
                      }}
                    >
                      👍 {isHi ? "सहायक" : "Helpful"} ({post.upvotes || 0})
                    </button>

                    <span style={{ fontSize: "12.5px", color: "var(--slate)" }}>
                      💬 {post.repliesCount || 0} {isHi ? "उत्तर" : "Replies"}
                    </span>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <button
                      type="button"
                      onClick={() => handleReport(post.id)}
                      style={{
                        background: "transparent",
                        border: "none",
                        color: "#9ca3af",
                        fontSize: "11.5px",
                        cursor: "pointer",
                        textDecoration: "underline"
                      }}
                    >
                      {isHi ? "🚩 आपत्तिजनक रिपोर्ट करें" : "🚩 Report Post"}
                    </button>
                  </div>
                </div>

                {/* Replies Thread */}
                {post.replies && post.replies.length > 0 && (
                  <div style={{ marginTop: "16px", paddingLeft: "16px", borderLeft: "2px solid var(--line)" }}>
                    {post.replies.map((rep) => (
                      <div
                        key={rep.id}
                        style={{
                          background: rep.authorRole === "clinician" || rep.authorRole === "system" ? "#f0fdf4" : "var(--sage)",
                          padding: "10px 14px",
                          borderRadius: "10px",
                          marginBottom: "10px",
                          fontSize: "13px"
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                          <b>{rep.author}</b>
                          {rep.badge && (
                            <span className="stat-tag" style={{ fontSize: "10px", padding: "1px 6px" }}>
                              {rep.badge}
                            </span>
                          )}
                          <small style={{ color: "var(--slate)" }}>{rep.timeAgo}</small>
                        </div>
                        <p style={{ margin: 0, color: "#1f2937" }}>
                          {isHi ? (rep.textHi || rep.text) : rep.text}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add Reply Input */}
                <div style={{ marginTop: "14px", display: "flex", gap: "8px" }}>
                  <input
                    type="text"
                    value={replyTextMap[post.id] || ""}
                    onChange={(e) => setReplyTextMap({ ...replyTextMap, [post.id]: e.target.value })}
                    placeholder={isHi ? "अपनी सलाह या अनुभव लिखें..." : "Add your advice or supportive reply..."}
                    style={{
                      flex: 1,
                      padding: "8px 14px",
                      borderRadius: "8px",
                      border: "1px solid var(--line)",
                      fontSize: "13px"
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleReplySubmit(post.id);
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => handleReplySubmit(post.id)}
                    className="button"
                    style={{ padding: "8px 16px", fontSize: "12px" }}
                  >
                    {isHi ? "भेजें" : "Reply"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal for Creating New Post */}
        {showNewPostModal && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(0,0,0,0.55)",
              display: "grid",
              placeItems: "center",
              zIndex: 9999,
              padding: "20px"
            }}
          >
            <div
              style={{
                background: "#fff",
                borderRadius: "16px",
                maxWidth: "600px",
                width: "100%",
                padding: "28px",
                maxHeight: "90vh",
                overflowY: "auto"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <h3 style={{ margin: 0 }}>
                  {isHi ? "नया सवाल या अनुभव साझा करें" : "Share with Pilot Circle"}
                </h3>
                <button
                  type="button"
                  onClick={() => setShowNewPostModal(false)}
                  style={{ background: "none", border: "none", fontSize: "18px", cursor: "pointer" }}
                >
                  ✕
                </button>
              </div>

              {formFeedback && (
                <div style={{ background: "#fee2e2", color: "#b91c1c", padding: "10px 14px", borderRadius: "8px", marginBottom: "16px", fontSize: "13px" }}>
                  {formFeedback}
                </div>
              )}

              <form onSubmit={handleCreatePost}>
                {/* Author Info */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "14px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: "bold", marginBottom: "4px" }}>
                      {isHi ? "आपका नाम" : "Your Name"}
                    </label>
                    <input
                      type="text"
                      value={authorName}
                      onChange={(e) => setAuthorName(e.target.value)}
                      required
                      style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid var(--line)" }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: "bold", marginBottom: "4px" }}>
                      {isHi ? "आपकी भूमिका" : "Your Role"}
                    </label>
                    <select
                      value={authorRole}
                      onChange={(e) => setAuthorRole(e.target.value)}
                      style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid var(--line)" }}
                    >
                      <option value="patient">{isHi ? "माता / मरीज (Mother/Patient)" : "Mother / Patient"}</option>
                      <option value="asha">{isHi ? "आशा कार्यकर्ता (ASHA Worker)" : "ASHA Health Worker"}</option>
                      <option value="clinician">{isHi ? "डॉक्टर / नर्स (Clinician)" : "Doctor / Nurse"}</option>
                    </select>
                  </div>
                </div>

                {/* Topic */}
                <div style={{ marginBottom: "14px" }}>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: "bold", marginBottom: "4px" }}>
                    {isHi ? "विषय चुनें" : "Select Topic"}
                  </label>
                  <select
                    value={postTopic}
                    onChange={(e) => setPostTopic(e.target.value)}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid var(--line)" }}
                  >
                    <option value="Maternal Health">Maternal Health (मातृत्व एवं प्रसव)</option>
                    <option value="Infant Care">Infant Care (शिशु पोषण एवं देखभाल)</option>
                    <option value="Nutrition">Nutrition & Millets (स्थानीय आहार)</option>
                    <option value="Menstrual Health">Menstrual Health (माहवारी स्वच्छता)</option>
                  </select>
                </div>

                {/* Title */}
                <div style={{ marginBottom: "14px" }}>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: "bold", marginBottom: "4px" }}>
                    {isHi ? "शीर्षक (मुख्य सवाल)" : "Post Title"}
                  </label>
                  <input
                    type="text"
                    value={postTitle}
                    onChange={(e) => setPostTitle(e.target.value)}
                    placeholder={isHi ? "जैसे: 6 माह के शिशु को पहला आहार क्या दें?" : "e.g. Tips on taking iron tablets with morning meals"}
                    required
                    style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid var(--line)" }}
                  />
                </div>

                {/* Content */}
                <div style={{ marginBottom: "18px" }}>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: "bold", marginBottom: "4px" }}>
                    {isHi ? "विवरण (अनुभव या पूरी बात)" : "Details / Experience"}
                  </label>
                  <textarea
                    rows={4}
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value)}
                    placeholder={isHi ? "अपनी बात स्पष्ट शब्दों में लिखें..." : "Describe in simple terms..."}
                    required
                    style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid var(--line)", fontSize: "13px" }}
                  />
                  <small style={{ color: "var(--slate)", display: "block", marginTop: "4px" }}>
                    {isHi
                      ? "🛡️ भारतीय DPDP अधिनियम: आधार कार्ड या निजी फोन नंबर न लिखें।"
                      : "🛡️ Safety note: Do not share sensitive ID numbers. Automated filters check for urgent symptoms."}
                  </small>
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                  <button
                    type="button"
                    onClick={() => setShowNewPostModal(false)}
                    className="button ghost"
                  >
                    {isHi ? "रद्द करें" : "Cancel"}
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="button"
                  >
                    {submitting ? (isHi ? "सुरक्षा जांच..." : "Validating...") : (isHi ? "प्रकाशित करें →" : "Publish Post →")}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
      <SetuFooter />
    </>
  );
}
