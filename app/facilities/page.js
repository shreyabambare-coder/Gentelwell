"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import SetuHeader from "../../components/SetuHeader";
import SetuFooter from "../../components/SetuFooter";
import { FACILITIES, PILOT_REGION } from "../../lib/setuData";

export default function FacilitiesPage() {
  const [filterType, setFilterType] = useState("all");
  const [selectedDistrict, setSelectedDistrict] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [lang, setLang] = useState("en");

  useEffect(() => {
    try {
      const savedLang = localStorage.getItem("setu_lang");
      if (savedLang) setLang(savedLang);
    } catch {}

    const handleLangChange = (e) => {
      if (e.detail?.lang) setLang(e.detail.lang);
    };

    window.addEventListener("setu_lang_change", handleLangChange);
    return () => {
      window.removeEventListener("setu_lang_change", handleLangChange);
    };
  }, []);

  const isHi = lang === "hi";

  const districts = ["all", "Kolhapur", "Mumbai", "Pune", "Palghar", "Navi Mumbai"];

  const filteredFacilities = FACILITIES.filter((fac) => {
    const matchesDistrict = selectedDistrict === "all" || fac.district === selectedDistrict;

    let matchesType = true;
    if (filterType === "hospital") {
      matchesType =
        fac.type.toLowerCase().includes("hospital") ||
        fac.type.toLowerCase().includes("medical college");
    } else if (filterType === "centre") {
      matchesType =
        fac.type.toLowerCase().includes("centre") ||
        fac.type.toLowerCase().includes("phc") ||
        fac.type.toLowerCase().includes("chc") ||
        fac.type.toLowerCase().includes("sub-district");
    } else if (filterType === "pharmacy") {
      matchesType = fac.type.toLowerCase().includes("pharmacy");
    }

    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      fac.name.toLowerCase().includes(q) ||
      fac.district.toLowerCase().includes(q) ||
      fac.landmark.toLowerCase().includes(q) ||
      fac.services.some((s) => s.toLowerCase().includes(q)) ||
      (fac.doctorsAvailable &&
        fac.doctorsAvailable.some(
          (d) =>
            d.name.toLowerCase().includes(q) ||
            d.specialty.toLowerCase().includes(q)
        ));

    return matchesDistrict && matchesType && matchesSearch;
  });

  return (
    <>
      <SetuHeader />
      <main className="container" style={{ padding: "40px 0 80px" }}>
        {/* Header Banner */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <p className="eyebrow">
            {isHi
              ? "महाराष्ट्र स्वास्थ्य सेवा निर्देशिका (ऑफलाइन समर्थित)"
              : "MAHARASHTRA HEALTHCARE DIRECTORY (OFFLINE-CACHED)"}
          </p>
          <h1 style={{ fontSize: "32px", fontWeight: "800", margin: "8px 0" }}>
            {isHi
              ? "महाराष्ट्र के नजदीकी अस्पताल एवं क्लीनिक"
              : "Nearby Hospitals & Clinics in Maharashtra"}
          </h1>
          <p style={{ maxWidth: "700px", margin: "8px auto 0", color: "var(--slate)" }}>
            {isHi
              ? "महाराष्ट्र राज्य के प्रमुख मेडिकल कॉलेज, जिला सिविल अस्पताल, कोल्हापुर व अन्य जिलों के ग्रामीण प्राथमिक स्वास्थ्य केंद्र (PHC/CHC) और जन औषधि केंद्र। सभी विवरण आपके फोन पर सुरक्षित और ऑफलाइन उपलब्ध हैं।"
              : "Verified government medical colleges, district civil hospitals, rural primary health centres (PHC/CHC), and generic Jan Aushadhi pharmacies across Maharashtra (Kolhapur, Mumbai, Pune, Palghar, Navi Mumbai). Pre-cached for offline access."}
          </p>
        </div>

        {/* Search Bar */}
        <div style={{ maxWidth: "600px", margin: "0 auto 24px" }}>
          <div style={{ position: "relative" }}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                isHi
                  ? "अस्पताल का नाम, डॉक्टर, सेवा या जिला खोजें..."
                  : "Search hospital, doctor, specialty, or location in Maharashtra..."
              }
              style={{
                width: "100%",
                padding: "12px 16px",
                fontSize: "14px",
                borderRadius: "12px",
                border: "1.5px solid var(--line)",
                outline: "none"
              }}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "13px",
                  color: "var(--slate)"
                }}
              >
                {isHi ? "हटाएं" : "Clear"}
              </button>
            )}
          </div>
        </div>

        {/* District Filter Tabs */}
        <div style={{ display: "flex", gap: "8px", justifyContent: "center", flexWrap: "wrap", marginBottom: "16px" }}>
          <span style={{ fontSize: "12.5px", fontWeight: "700", alignSelf: "center", color: "var(--slate)", marginRight: "4px" }}>
            {isHi ? "जिला:" : "District:"}
          </span>
          {districts.map((d) => (
            <button
              key={d}
              type="button"
              className={`button ${selectedDistrict === d ? "" : "ghost"}`}
              style={{ minHeight: "34px", padding: "4px 12px", fontSize: "12px", borderRadius: "20px" }}
              onClick={() => setSelectedDistrict(d)}
            >
              {d === "all" ? (isHi ? "महाराष्ट्र के सभी जिले" : "All Maharashtra") : `${d}, MH`}
            </button>
          ))}
        </div>

        {/* Facility Category Filter */}
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", justifyContent: "center", marginBottom: "32px" }}>
          <button
            type="button"
            className={`button ${filterType === "all" ? "" : "ghost"}`}
            style={{ minHeight: "38px", fontSize: "13px" }}
            onClick={() => setFilterType("all")}
          >
            {isHi ? `सभी सुविधाएं (${FACILITIES.length})` : `All Facilities (${FACILITIES.length})`}
          </button>
          <button
            type="button"
            className={`button ${filterType === "hospital" ? "" : "ghost"}`}
            style={{ minHeight: "38px", fontSize: "13px" }}
            onClick={() => setFilterType("hospital")}
          >
            {isHi ? "अस्पताल एवं मेडिकल कॉलेज" : "Hospitals & Medical Colleges"}
          </button>
          <button
            type="button"
            className={`button ${filterType === "centre" ? "" : "ghost"}`}
            style={{ minHeight: "38px", fontSize: "13px" }}
            onClick={() => setFilterType("centre")}
          >
            {isHi ? "प्राथमिक एवं सामुदायिक स्वास्थ्य केंद्र" : "PHC & Health Centres"}
          </button>
          <button
            type="button"
            className={`button ${filterType === "pharmacy" ? "" : "ghost"}`}
            style={{ minHeight: "38px", fontSize: "13px" }}
            onClick={() => setFilterType("pharmacy")}
          >
            {isHi ? "सस्ती जेनेरिक दवाइयां" : "Generic Pharmacies"}
          </button>
        </div>

        {/* Results Count */}
        <div style={{ marginBottom: "16px", color: "var(--slate)", fontSize: "13px" }}>
          {isHi
            ? `कुल ${filteredFacilities.length} चिकित्सा केंद्र प्रदर्शित (महाराष्ट्र)`
            : `Showing ${filteredFacilities.length} verified healthcare facilities in Maharashtra`}
        </div>

        {/* Facilities Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(330px, 1fr))", gap: "24px" }}>
          {filteredFacilities.map((fac) => (
            <div
              key={fac.id}
              className="card"
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                padding: "24px",
                borderRadius: "14px",
                border: "1.5px solid var(--line)"
              }}
            >
              <div>
                {/* Top Badges & Distance */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px", gap: "8px" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                    <span className="stat-tag" style={{ width: "fit-content" }}>{fac.type}</span>
                    <span
                      style={{
                        fontSize: "11px",
                        fontWeight: "700",
                        color: "#065f46",
                        background: "#d1fae5",
                        padding: "2px 8px",
                        borderRadius: "4px",
                        width: "fit-content"
                      }}
                    >
                      {fac.district}, Maharashtra
                    </span>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <b style={{ color: "var(--forest)", fontSize: "17px" }}>{fac.distanceKm} km</b>
                    <small style={{ display: "block", color: "var(--slate)", fontSize: "11px" }}>
                      ~{fac.travelTimeMinutes} {isHi ? "मिनट यात्रा" : "mins travel"}
                    </small>
                  </div>
                </div>

                {/* Facility Name */}
                <h3 style={{ fontSize: "18px", fontWeight: "700", lineHeight: "1.3", marginBottom: "10px", color: "var(--ink)" }}>
                  {isHi ? (fac.nameHi || fac.name) : fac.name}
                </h3>

                {/* Maharashtra Landmark / Address */}
                <div
                  style={{
                    background: "var(--sage)",
                    padding: "10px 14px",
                    borderRadius: "10px",
                    fontSize: "12.5px",
                    marginBottom: "14px"
                  }}
                >
                  <b style={{ color: "var(--forest)", display: "block", marginBottom: "2px" }}>
                    {isHi ? "स्थान एवं मार्ग निर्देश:" : "Location & Address:"}
                  </b>
                  <div style={{ color: "var(--ink)", lineHeight: "1.4" }}>
                    {isHi ? fac.landmarkHi : fac.landmark}
                  </div>
                </div>

                {/* Operating Hours & Typical Wait */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "10px",
                    fontSize: "12px",
                    background: "#f8fafc",
                    padding: "10px 12px",
                    borderRadius: "8px",
                    marginBottom: "14px"
                  }}
                >
                  <div>
                    <span style={{ color: "var(--slate)", display: "block" }}>
                      {isHi ? "औसत प्रतीक्षा समय:" : "Typical Wait:"}
                    </span>
                    <b style={{ color: "var(--ink)" }}>
                      ~{fac.typicalWaitMinutes} {isHi ? "मिनट" : "minutes"}
                    </b>
                  </div>
                  <div>
                    <span style={{ color: "var(--slate)", display: "block" }}>
                      {isHi ? "कार्य समय:" : "Operating Hours:"}
                    </span>
                    <b style={{ color: "var(--ink)" }}>{fac.operatingHours}</b>
                  </div>
                </div>

                {/* Doctors Available */}
                {fac.doctorsAvailable && fac.doctorsAvailable.length > 0 && (
                  <div style={{ marginBottom: "14px" }}>
                    <b style={{ fontSize: "11.5px", color: "var(--slate)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                      {isHi ? "उपलब्ध चिकित्सक:" : "Available Specialists:"}
                    </b>
                    <div style={{ margin: "4px 0 0", fontSize: "12px", color: "var(--ink)" }}>
                      {fac.doctorsAvailable.map((doc, idx) => (
                        <div key={idx} style={{ padding: "2px 0" }}>
                          • <b>{doc.name}</b> — <span style={{ color: "var(--slate)" }}>{doc.specialty}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Services List */}
                <div style={{ marginBottom: "18px" }}>
                  <b style={{ fontSize: "11.5px", color: "var(--slate)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                    {isHi ? "उपलब्ध प्रमुख सेवाएं:" : "Key Services Available:"}
                  </b>
                  <ul style={{ margin: "6px 0 0 16px", padding: 0, fontSize: "12px", color: "var(--ink)", lineHeight: "1.5" }}>
                    {fac.services.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Buttons */}
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  borderTop: "1px solid var(--line)",
                  paddingTop: "16px",
                  marginTop: "8px"
                }}
              >
                <a
                  href={`tel:${fac.phone}`}
                  className="button ghost"
                  style={{
                    flex: 1,
                    minHeight: "40px",
                    fontSize: "12.5px",
                    padding: "8px 12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px"
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                  {isHi ? "कॉल करें" : "Call Facility"}
                </a>
                <Link
                  href="/booking"
                  className="button"
                  style={{
                    flex: 1,
                    minHeight: "40px",
                    fontSize: "12.5px",
                    padding: "8px 12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  {isHi ? "अपॉइंटमेंट बुक करें" : "Book Visit"}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>
      <SetuFooter />
    </>
  );
}
