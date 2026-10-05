# Gentelwell (Setu Health / Sakhi App)
> **Integrated Online + Offline Rural Healthcare Platform**  
> A prioritized, multi-channel, offline-first digital health web application serving rural and low-resource communities across Maharashtra.

---

## 🌟 Overview & Proven Value Loop
Gentelwell sequences healthcare delivery around a proven core loop:
1. **Learn**: Downloadable offline health education videos with dual-language Hindi & English voice narration.
2. **Get Seen**: Appointment booking and emergency triage escalation with multi-channel fallback to SMS, USSD, and IVR voice calls.
3. **Be Tracked**: Longitudinal FHIR R4-compatible health records, ABHA ID linkage, vitals monitoring, and care plans.

---

## 🚀 Key Features

### 📱 1. Offline-First PWA & 3-Tier Channel Fallback
- **Zero-Connectivity Capable**: Works 100% offline in deep forest / rural areas using LocalStorage and IndexedDB.
- **Background Delta Sync**: Automatic sync with conflict resolution rules (clinician edits take precedence over CHW edits).
- **Graceful Channel Degradation**:
  - **Smartphone PWA**: Full interactive web application.
  - **SMS Gateway (`56767`)**: 2-way SMS booking and emergency triage keywords.
  - **USSD Menu (`*999#`)**: Basic feature-phone interactive menu.
  - **IVR Voice Dial-in**: Automated interactive voice response in local languages.

### 🔐 2. Low-Literacy & OTP Authentication
- Phone OTP verification with lockout protection.
- 4-icon sequence + 4-digit PIN fallback for shared family or feature phones.
- Active household profile switching and DPDP Act 2023 consent records.

### 🩺 3. Explainable Clinical AI Triage & Red-Flag Safety
- Decision-tree clinical triage validated against clinical protocols.
- **Hard-coded Red-Flag Bypasses**: Suspected obstetric emergencies (bleeding), acute chest pain, and infant lethargy trigger immediate 112/102 ambulance and clinician escalation.
- **Zero Black-Box Scores**: Plain-language explanations ("Why am I being asked to see a doctor?").
- Target: Strict **0.0% false-negative rate** on red-flag emergencies.

### 💬 4. Sakhi Women's Health Chatbot
- Conversational assistant for maternal, menstrual, adolescent, and reproductive health.
- Multilingual voice input and text-to-speech output.
- Automated disclaimers and human-in-the-loop clinician handoff.

### 👥 5. Moderated Community Support Forum
- Invite-based pilot circles for rural mothers, ASHA workers, and clinicians.
- **Automated Pre-Moderation**: Instant keyword scanning for emergency symptoms (auto-escalates to doctor review) and unverified health claims (held for ASHA approval).
- Upvoting, helpful replies, and community report/block safety tooling.

### 🛒 6. Affordable Healthcare Marketplace
- Curated catalog of OTC essentials, biodegradable sanitary pads, WHO ORS packets, and Clean Delivery Kits.
- Integrated with **Pradhan Mantri Jan Aushadhi Kendras** for up to 90% savings.
- Instant UPI QR payment and Cash on Delivery/Pickup.

### 👩‍⚕️ 7. Clinician Review Portal & Admin KPIs
- Dedicated lightweight portal for doctors to review escalated triage tickets and dispatch ambulances.
- Real-time observability dashboard tracking all **Section 15 KPIs** (population coverage, sync health, clinician response latency, video completion).

---

## 🛠️ Technology Stack & Backend Architecture

- **Frontend**: Next.js 16 (App Router), React 19, Vanilla CSS Design System with accessible high-contrast tap targets and Web Speech API narration.
- **Backend API**: Versioned REST API (`/api/v1/...`) with FHIR R4 resource models:
  - `POST /api/v1/sync`: Delta sync gateway with batch reconciliation.
  - `GET / POST /api/v1/patients`: FHIR `Patient` & `Observation` resources.
  - `GET / POST /api/v1/appointments`: FHIR `Appointment` resources with slot conflict detection.
  - `GET / POST /api/v1/escalations`: FHIR `ServiceRequest` clinical tickets.
  - `GET /api/v1/facilities`: FHIR `Location` & `Organization` directory.
  - `GET / POST /api/v1/consent`: DPDP Act 2023 versioned consent records.
  - `GET / POST /api/v1/marketplace`: FHIR `MedicationRequest` order management.
  - `GET /api/v1/kpi`: Program observability metrics.
  - `POST /api/chat`: Clinical NLP & emergency override gateway.
- **Security & Privacy**: India Digital Personal Data Protection (DPDP) Act 2023 compliance, purpose-of-use header enforcement, idempotency keys on write endpoints, and immutable audit logging.

---

## 💻 Getting Started Locally

```bash
# Clone the repository
git clone https://github.com/shreyabambare-coder/Gentelwell.git
cd Gentelwell

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

Open [http://localhost:3000](http://localhost:3000) in your browser.