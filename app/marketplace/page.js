"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import SetuHeader from "../../components/SetuHeader";
import SetuFooter from "../../components/SetuFooter";
import { MARKETPLACE_PRODUCTS, FACILITIES, PILOT_REGION } from "../../lib/setuData";
import { queueMutation, getHousehold, getNetworkMode, logAudit } from "../../lib/offlineSync";

export default function MarketplacePage() {
  const [products] = useState(MARKETPLACE_PRODUCTS);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [lang, setLang] = useState("en");
  const [cart, setCart] = useState({});
  const [selectedFacility, setSelectedFacility] = useState("fac-8"); // Dadar Jan Aushadhi Kendra
  const [paymentMethod, setPaymentMethod] = useState("upi"); // "upi" | "cod_pickup"
  const [household, setHousehold] = useState(null);
  const [networkMode, setNetworkMode] = useState("online");
  const [checkoutModal, setCheckoutModal] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(null);

  useEffect(() => {
    setHousehold(getHousehold());
    setNetworkMode(getNetworkMode());

    try {
      const savedLang = localStorage.getItem("setu_lang");
      if (savedLang) setLang(savedLang);
    } catch {}

    const handleLang = (e) => {
      if (e.detail?.lang) setLang(e.detail.lang);
    };
    const handleNet = (e) => {
      if (e.detail?.mode) setNetworkMode(e.detail.mode);
    };

    window.addEventListener("setu_lang_change", handleLang);
    window.addEventListener("setu_network_change", handleNet);

    return () => {
      window.removeEventListener("setu_lang_change", handleLang);
      window.removeEventListener("setu_network_change", handleNet);
    };
  }, []);

  const isHi = lang === "hi";

  const categories = [
    { id: "all", label: isHi ? "सभी उत्पाद" : "All Products" },
    { id: "Maternal Health", label: isHi ? "मातृत्व एवं प्रसव" : "Maternal Care" },
    { id: "Hygiene", label: isHi ? "स्वच्छता व पैड" : "Hygiene" },
    { id: "OTC Essentials", label: isHi ? "प्राथमिक दवाएं व ओआरएस" : "OTC Essentials" },
    { id: "Nutrition", label: isHi ? "स्थानीय पूरक पोषण" : "Nutrition" }
  ];

  const filtered = products.filter((p) => {
    if (selectedCategory === "all") return true;
    return p.category === selectedCategory;
  });

  const addToCart = (prodId) => {
    setCart((prev) => ({
      ...prev,
      [prodId]: (prev[prodId] || 0) + 1
    }));
  };

  const removeFromCart = (prodId) => {
    setCart((prev) => {
      const next = { ...prev };
      if (next[prodId] > 1) {
        next[prodId] -= 1;
      } else {
        delete next[prodId];
      }
      return next;
    });
  };

  const cartItemCount = Object.values(cart).reduce((sum, qty) => sum + qty, 0);
  const cartTotal = Object.entries(cart).reduce((sum, [pId, qty]) => {
    const prod = products.find((p) => p.id === pId);
    return sum + (prod ? prod.price * qty : 0);
  }, 0);

  const cartMrpTotal = Object.entries(cart).reduce((sum, [pId, qty]) => {
    const prod = products.find((p) => p.id === pId);
    return sum + (prod ? prod.mrp * qty : 0);
  }, 0);

  const totalSavings = cartMrpTotal - cartTotal;

  // Speak product info aloud for low-literacy users
  const speakProduct = (prod) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const title = isHi ? prod.nameHi : prod.name;
    const desc = isHi ? prod.descriptionHi : prod.description;
    const priceText = isHi ? `मूल्य केवल ${prod.price} रुपये।` : `Price only ${prod.price} rupees.`;
    const u = new SpeechSynthesisUtterance(`${title}. ${priceText} ${desc}`);
    u.lang = isHi ? "hi-IN" : "en-US";
    window.speechSynthesis.speak(u);
  };

  // Place Order
  const handlePlaceOrder = () => {
    const facilityObj = FACILITIES.find((f) => f.id === selectedFacility) || FACILITIES[7];
    const orderItems = Object.entries(cart).map(([pId, qty]) => {
      const p = products.find((prod) => prod.id === pId);
      return { id: pId, name: p.name, price: p.price, quantity: qty };
    });

    const newOrder = {
      id: "ord-" + Date.now(),
      resourceType: "MedicationRequest",
      patientName: household?.members?.[0]?.name || "Pooja Devi",
      phone: household?.primaryPhone || "9876543210",
      village: household?.village || "Mokhada",
      facilityId: facilityObj.id,
      facilityName: facilityObj.name,
      items: orderItems,
      totalAmount: cartTotal,
      savingsAmount: totalSavings,
      paymentMethod,
      paymentStatus: paymentMethod === "upi" ? "paid_via_upi" : "pay_on_pickup",
      orderStatus: "confirmed",
      createdAt: new Date().toISOString()
    };

    queueMutation({
      entityType: "MarketplaceOrder",
      action: "CREATE",
      payload: newOrder,
      purposeOfUse: "care-coordination"
    });

    logAudit({
      action: "MARKETPLACE_ORDER_PLACED",
      actor: newOrder.patientName,
      detail: `Placed order ${newOrder.id} for ₹${cartTotal} via ${paymentMethod} at ${facilityObj.name}`
    });

    setOrderConfirmed(newOrder);
    setCart({});
    setCheckoutModal(false);
  };

  return (
    <>
      <SetuHeader />
      <main className="container" style={{ padding: "40px 0 80px" }}>
        {/* Header Section */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px", marginBottom: "28px" }}>
          <div>
            <div className="voice-action-pill" style={{ marginBottom: "8px" }}>
              <span>{isHi ? "चरण 3: प्रधानमंत्री जन औषधि केंद्र मंच" : "PHASE 3: HEALTHCARE MARKETPLACE & SCALE (§4)"}</span>
            </div>
            <h1 style={{ margin: "4px 0 8px" }}>
              {isHi ? "सुलभ दवा एवं स्वास्थ्य उत्पाद भंडार" : "Affordable Healthcare Marketplace"}
            </h1>
            <p style={{ margin: 0, maxWidth: "680px", color: "var(--slate)" }}>
              {isHi
                ? "प्रधानमंत्री जन औषधि केंद्रों से प्रमाणित जेनेरिक दवाएं, मातृत्व किट और सैनिटरी पैड। 50% से 90% तक सरकारी सब्सिडी और यूपीआई / नकद भुगतान।"
                : "Curated catalog of OTC essentials, maternal care, clean delivery kits, and hygiene products synced with Jan Aushadhi partner pharmacies across Maharashtra."}
            </p>
          </div>

          {/* Cart Floating Status */}
          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <button
              type="button"
              onClick={() => {
                if (cartItemCount > 0) setCheckoutModal(true);
              }}
              className="button"
              style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 18px"
              }}
            >
              <span>🛒</span>
              <span>{isHi ? "थैला (ऑर्डर करें)" : "My Cart"}</span>
              <span
                style={{
                  background: "#fff",
                  color: "var(--forest)",
                  borderRadius: "50%",
                  width: "22px",
                  height: "22px",
                  display: "grid",
                  placeItems: "center",
                  fontSize: "12px",
                  fontWeight: "bold"
                }}
              >
                {cartItemCount}
              </span>
              {cartTotal > 0 && <span style={{ fontWeight: "700" }}>₹{cartTotal}</span>}
            </button>
          </div>
        </div>

        {/* Subsidy Highlight Banner */}
        <div
          style={{
            background: "var(--sage)",
            border: "1.5px solid var(--forest)",
            borderRadius: "14px",
            padding: "14px 20px",
            marginBottom: "28px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "12px"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "24px" }}>🏷️</span>
            <div>
              <b style={{ color: "var(--forest)", fontSize: "14px" }}>
                {isHi ? "जन औषधि योजना: 50% से 90% तक की भारी बचत" : "Govt Subsidized Jan Aushadhi Pricing"}
              </b>
              <p style={{ margin: "2px 0 0", fontSize: "12.5px", color: "var(--ink)" }}>
                {isHi
                  ? "सभी दवाएं भारतीय गुणवत्ता मानकों के अनुरूप जांची गई हैं। नजदीकी केंद्र से पिकअप करें या आशा दीदी से प्राप्त करें।"
                  : "All generic formulations are certified for rural maternal & primary care. Verified stock at nearest CHC / PHC dispensaries."}
              </p>
            </div>
          </div>
          <span className="stat-tag" style={{ background: "#dcfce7", color: "#166534" }}>
            {isHi ? "100% प्रामाणिक" : "WHO-GMP / Jan Aushadhi Certified"}
          </span>
        </div>

        {/* Order Confirmation Notice */}
        {orderConfirmed && (
          <div
            style={{
              background: "#ecfdf5",
              border: "1.5px solid #10b981",
              borderRadius: "14px",
              padding: "18px 24px",
              marginBottom: "28px"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <h3 style={{ margin: 0, color: "#065f46" }}>
                ✓ {isHi ? "ऑर्डर सफलतापूर्वक दर्ज हुआ!" : "Order Confirmed & Queued!"}
              </h3>
              <span className="stat-tag" style={{ background: "#d1fae5", color: "#065f46" }}>
                {orderConfirmed.id}
              </span>
            </div>
            <p style={{ margin: 0, fontSize: "13.5px", color: "#065f46" }}>
              {isHi
                ? `मरीज: ${orderConfirmed.patientName} · कुल राशि: ₹${orderConfirmed.totalAmount} (आपने ₹${orderConfirmed.savingsAmount} बचाए!) · पिकअप केंद्र: ${orderConfirmed.facilityName}`
                : `Patient: ${orderConfirmed.patientName} · Total: ₹${orderConfirmed.totalAmount} (You saved ₹${orderConfirmed.savingsAmount}!) · Pickup Station: ${orderConfirmed.facilityName}`}
            </p>
            <small style={{ display: "block", marginTop: "6px", color: "#047857" }}>
              {orderConfirmed.paymentMethod === "upi"
                ? (isHi ? "📲 यूपीआई भुगतान सफल। पुष्टिकरण एसएमएस 56767 से भेज दिया गया है।" : "📲 UPI Payment completed. SMS confirmation dispatched via 56767 gateway.")
                : (isHi ? "💵 जन औषधि केंद्र पर नकद देकर दवा प्राप्त करें।" : "💵 Pay on delivery/pickup at Jan Aushadhi Kendra.")}
            </small>
          </div>
        )}

        {/* Category Tabs */}
        <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "8px", marginBottom: "24px" }}>
          {categories.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setSelectedCategory(c.id)}
              style={{
                background: selectedCategory === c.id ? "var(--forest)" : "#fff",
                color: selectedCategory === c.id ? "#fff" : "var(--ink)",
                border: selectedCategory === c.id ? "none" : "1px solid var(--line)",
                padding: "8px 16px",
                borderRadius: "20px",
                fontSize: "13px",
                fontWeight: "600",
                cursor: "pointer",
                whiteSpace: "nowrap"
              }}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))", gap: "20px" }}>
          {filtered.map((prod) => {
            const inCartCount = cart[prod.id] || 0;

            return (
              <div
                key={prod.id}
                className="card"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  position: "relative"
                }}
              >
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                    <span className="stat-tag" style={{ background: "#faeede", color: "var(--clay)", fontSize: "11px" }}>
                      {prod.category}
                    </span>

                    <button
                      type="button"
                      onClick={() => speakProduct(prod)}
                      title={isHi ? "आवाज में सुनें" : "Listen in voice"}
                      style={{
                        background: "var(--sage)",
                        border: "1px solid var(--line)",
                        borderRadius: "50%",
                        width: "30px",
                        height: "30px",
                        display: "grid",
                        placeItems: "center",
                        cursor: "pointer"
                      }}
                    >
                      🔊
                    </button>
                  </div>

                  <h3 style={{ fontSize: "16px", margin: "0 0 6px" }}>
                    {isHi ? prod.nameHi : prod.name}
                  </h3>

                  <p style={{ fontSize: "12.5px", color: "var(--slate)", margin: "0 0 10px", lineHeight: "1.4" }}>
                    {isHi ? prod.descriptionHi : prod.description}
                  </p>

                  <div style={{ background: "#f8fafc", padding: "8px 10px", borderRadius: "8px", fontSize: "11.5px", marginBottom: "12px", border: "1px solid #e2e8f0" }}>
                    <b>{isHi ? "उपयोग विधि:" : "Recommended Dosage:"}</b> {isHi ? prod.dosageHi : prod.dosage}
                  </div>
                </div>

                <div>
                  {/* Price Comparison */}
                  <div style={{ display: "flex", alignItems: "baseline", gap: "8px", marginBottom: "12px" }}>
                    <span style={{ fontSize: "22px", fontWeight: "800", color: "var(--forest)" }}>
                      ₹{prod.price}
                    </span>
                    <span style={{ fontSize: "13px", color: "#9ca3af", textDecoration: "line-through" }}>
                      ₹{prod.mrp}
                    </span>
                    <span
                      style={{
                        background: "#dcfce7",
                        color: "#15803d",
                        fontSize: "11px",
                        fontWeight: "700",
                        padding: "2px 6px",
                        borderRadius: "4px"
                      }}
                    >
                      {prod.subsidyPercent}% OFF
                    </span>
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "11px", color: "var(--slate)", marginBottom: "12px" }}>
                    <span>📦 {isHi ? `उपलब्ध: ${prod.stockCount} पैकेट` : `Stock: ${prod.stockCount} units`}</span>
                    <span>🏥 {prod.source}</span>
                  </div>

                  {/* Add / Quantity Row */}
                  {inCartCount === 0 ? (
                    <button
                      type="button"
                      onClick={() => addToCart(prod.id)}
                      className="button"
                      style={{ width: "100%", padding: "9px" }}
                    >
                      + {isHi ? "थैले में डालें" : "Add to Cart"}
                    </button>
                  ) : (
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "var(--sage)", borderRadius: "8px", padding: "4px 8px" }}>
                      <button
                        type="button"
                        onClick={() => removeFromCart(prod.id)}
                        style={{ background: "#fff", border: "1px solid var(--line)", width: "30px", height: "30px", borderRadius: "6px", fontWeight: "bold", cursor: "pointer" }}
                      >
                        -
                      </button>
                      <span style={{ fontWeight: "700", fontSize: "14px" }}>{inCartCount} in cart</span>
                      <button
                        type="button"
                        onClick={() => addToCart(prod.id)}
                        style={{ background: "var(--forest)", color: "#fff", border: "none", width: "30px", height: "30px", borderRadius: "6px", fontWeight: "bold", cursor: "pointer" }}
                      >
                        +
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Checkout Modal */}
        {checkoutModal && (
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
                maxWidth: "520px",
                width: "100%",
                padding: "26px",
                maxHeight: "90vh",
                overflowY: "auto"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <h3 style={{ margin: 0 }}>{isHi ? "ऑर्डर सारांश एवं भुगतान" : "Checkout & Pickup Selection"}</h3>
                <button
                  type="button"
                  onClick={() => setCheckoutModal(false)}
                  style={{ background: "none", border: "none", fontSize: "18px", cursor: "pointer" }}
                >
                  ✕
                </button>
              </div>

              {/* Items List */}
              <div style={{ borderBottom: "1px solid var(--line)", paddingBottom: "12px", marginBottom: "16px" }}>
                {Object.entries(cart).map(([pId, qty]) => {
                  const p = products.find((prod) => prod.id === pId);
                  if (!p) return null;
                  return (
                    <div key={pId} style={{ display: "flex", justifyContent: "space-between", fontSize: "13.5px", marginBottom: "8px" }}>
                      <span>{isHi ? p.nameHi : p.name} × {qty}</span>
                      <b>₹{p.price * qty}</b>
                    </div>
                  );
                })}

                <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "800", fontSize: "16px", marginTop: "12px", paddingTop: "8px", borderTop: "1px dashed var(--line)" }}>
                  <span>{isHi ? "कुल भुगतान योग्य राशि:" : "Total Payable Amount:"}</span>
                  <span style={{ color: "var(--forest)" }}>₹{cartTotal}</span>
                </div>
                <div style={{ fontSize: "12px", color: "#166534", marginTop: "4px" }}>
                  🎉 {isHi ? `सरकारी सब्सिडी से आपकी कुल बचत: ₹${totalSavings}` : `Total Govt Subsidy Savings: ₹${totalSavings}`}
                </div>
              </div>

              {/* Pickup Kendra */}
              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "bold", marginBottom: "4px" }}>
                  {isHi ? "दवा पिकअप केंद्र चुनें (महाराष्ट्र)" : "Select Pickup Jan Aushadhi Kendra / CHC"}
                </label>
                <select
                  value={selectedFacility}
                  onChange={(e) => setSelectedFacility(e.target.value)}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid var(--line)", fontSize: "13px" }}
                >
                  {FACILITIES.map((fac) => (
                    <option key={fac.id} value={fac.id}>
                      {fac.name} ({fac.district}) · {fac.distanceKm} km
                    </option>
                  ))}
                </select>
              </div>

              {/* Payment Method */}
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "bold", marginBottom: "6px" }}>
                  {isHi ? "भुगतान का माध्यम" : "Payment Method"}
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("upi")}
                    style={{
                      padding: "10px",
                      borderRadius: "8px",
                      border: paymentMethod === "upi" ? "2px solid var(--forest)" : "1px solid var(--line)",
                      background: paymentMethod === "upi" ? "var(--sage)" : "#fff",
                      cursor: "pointer",
                      textAlign: "center",
                      fontSize: "12.5px",
                      fontWeight: "600"
                    }}
                  >
                    📲 {isHi ? "UPI (फोनपे / जीपे)" : "Instant UPI"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("cod_pickup")}
                    style={{
                      padding: "10px",
                      borderRadius: "8px",
                      border: paymentMethod === "cod_pickup" ? "2px solid var(--forest)" : "1px solid var(--line)",
                      background: paymentMethod === "cod_pickup" ? "var(--sage)" : "#fff",
                      cursor: "pointer",
                      textAlign: "center",
                      fontSize: "12.5px",
                      fontWeight: "600"
                    }}
                  >
                    💵 {isHi ? "केंद्र पर नकद भुगतान" : "Cash on Pickup"}
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  type="button"
                  onClick={() => setCheckoutModal(false)}
                  className="button ghost"
                  style={{ flex: 1 }}
                >
                  {isHi ? "वापस जाएं" : "Back"}
                </button>
                <button
                  type="button"
                  onClick={handlePlaceOrder}
                  className="button"
                  style={{ flex: 2 }}
                >
                  {isHi ? `₹${cartTotal} ऑर्डर की पुष्टि करें →` : `Confirm Order for ₹${cartTotal} →`}
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
