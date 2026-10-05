# System Architecture & Technical Design Document

**Project:** Gentelwell / Setu Health (Integrated Online + Offline Rural Healthcare Platform)  
**Version:** 1.0.0 (Production Roadmap Phase 0–3)  
**Prepared For:** Engineering Leadership, Clinical Advisory Board, and Technical Reviewers  
**Baseline Standard:** Offline-First PWA, FHIR R4, India DPDP Act 2023  

---

## 1. Executive Summary & Design Principles

Gentelwell is an integrated digital health platform architected specifically for low-resource and rural communities (such as rural Maharashtra districts including Palghar, Mokhada, Jawhar, Pune rural, and Kolhapur). It addresses the twin challenges of intermittent or absent telecommunication connectivity (deep 2G/EDGE or dead zones) and low-literacy users on low-end hardware.

Rather than building an "offline-tolerant" app, Gentelwell implements an **offline-first, local-first architecture**: every core clinical and operational workflow completes locally with zero connectivity, queuing mutations with idempotency guarantees, and synchronizing deterministically whenever a network connection is detected.

### Core Design Principles
1. **Offline-First, Not Offline-Tolerant:** All primary actions (viewing health records, booking clinic visits, checking triage decision trees, searching facilities) read and write to local device storage before attempting any network transfer.
2. **Three-Tier Graceful Degradation:** Users degraded gracefully across three hardware/network tiers: **Smartphone PWA $\rightarrow$ 2-Way SMS / USSD $\rightarrow$ Interactive Voice Response (IVR)**. No patient is excluded by device type.
3. **Voice & Visual-Led UX Before Text:** Icons, visual sequence auth (Cow, Diya, Peacock, Tractor), and dual-language (Hindi and English) voice synthesis ensure full accessibility for low-literacy users.
4. **AI Assists, Humans Decide:** All clinical AI algorithms (symptom checker, chatbot, soft-tissue RAG) act as non-diagnostic decision-support advisory tools with hard-coded red-flag emergency overrides and clinical escalation paths.
5. **Consent & Data Minimization by Default:** Strict adherence to India's Digital Personal Data Protection (DPDP) Act 2023, enforced through purpose-of-use verification at the API layer.

---

## 2. High-Level System Architecture

```
+-----------------------------------------------------------------------------------+
|                                 ACCESS CHANNELS                                   |
|  +--------------------+   +-------------------+   +----------------------------+  |
|  |   Smartphone PWA   |   |   Feature Phone   |   |        Voice Calls         |  |
|  |  (Offline-First)   |   |     SMS / USSD    |   |         IVR Dialer         |  |
|  +---------+----------+   +---------+---------+   +--------------+-------------+  |
+------------|------------------------|----------------------------|----------------+
             |                        |                            |                 
             v                        v                            v                 
+-----------------------------------------------------------------------------------+
|                        SECURITY, CONSENT & AUDIT BOUNDARY                         |
|   * DPDP Act 2023 Purpose-of-Use Verification   * TLS 1.3 / AES-256 at rest       |
|   * Idempotency-Key Deduplication Guard         * Immutable Audit Trail Logging   |
+-----------------------------------------------------------------------------------+
                                      |
                                      v
+-----------------------------------------------------------------------------------+
|                          API LAYER / BACKEND-FOR-FRONTEND                         |
|   REST v1 Services (/api/v1/...) with Payload Shaping for Low-Bandwidth Clients   |
|  +--------------+  +---------------+  +--------------+  +---------------------+   |
|  | /v1/patients |  | /v1/appoint.. |  | /v1/escalat..|  | /v1/facilities      |   |
|  +--------------+  +---------------+  +--------------+  +---------------------+   |
|  +--------------+  +---------------+  +--------------+  +---------------------+   |
|  | /v1/consent  |  | /v1/marketpl..|  | /v1/kpi      |  | /v1/sync (Gateway)  |   |
|  +--------------+  +---------------+  +--------------+  +---------------------+   |
|  +---------------------------------+  +---------------------------------------+   |
|  | /api/rag-triage (Vector Engine) |  | /api/chat (Clinical NLP Guardrails)   |   |
|  +---------------------------------+  +---------------------------------------+   |
+-----------------------------------------------------------------------------------+
                                      |
                                      v
+-----------------------------------------------------------------------------------+
|                          DATA & OFFLINE ENGINE LAYER                              |
|  +--------------------+   +-------------------+   +----------------------------+  |
|  | Local-First Store  |   | Background Delta  |   | Conflict Resolution Engine |  |
|  | (LocalStorage /    |   | Sync Manager with |   | (Clinician Precedence &    |  |
|  |  IndexedDB)        |   | Backoff & Retries |   |  Slot Collision Detection) |  |
|  +--------------------+   +-------------------+   +----------------------------+  |
+-----------------------------------------------------------------------------------+
```

---

## 3. Three-Tier Graceful Degradation Strategy

| Tier | Channel | Target Hardware | Connectivity Needed | Capabilities |
| :--- | :--- | :--- | :--- | :--- |
| **Tier 1** | **Progressive Web App (PWA)** | Basic Android smartphone ($\ge 2\text{ GB}$ RAM) | 100% Offline (syncs on 2G/3G/4G/Wi-Fi) | Full rich interface, health education video caching, RAG questionnaire, interactive appointment booking, longitudinal timeline. |
| **Tier 2** | **2-Way SMS & USSD** | Basic 2G feature phone (Nokia/JioBharat) | 2G Cellular Signal (No mobile data) | Text-based triage menu via shortcode `56767` (`BOOK ANC`, `TRIAGE FEVER`, `CLINIC`) and instant USSD interactive sessions (`*999#`). |
| **Tier 3** | **Interactive Voice Response (IVR)** | Any voice-capable telephone | Cellular or Landline voice connection | Automated spoken voice menu in local languages (Hindi, Marathi, English) for appointment booking, emergency triage prompts, and facility directions. |

---

## 4. Offline-First & Delta Sync Architecture

### 4.1 Local-First Data Flow
1. **Read Operations:** All UI components fetch data synchronously from local client storage (`lib/offlineSync.js`). The UI never blocks awaiting server responses.
2. **Write Operations:**
   - Client generates a globally unique **Idempotency Key** (`idem_<timestamp>_<random>`).
   - Mutation is optimistically written directly to the local store (e.g., appointment appears instantly in UI).
   - Mutation is appended to the local `MUTATION_QUEUE` with status `pending`.
   - Action is recorded into the on-device **Immutable Audit Trail**.
   - If network status is `online`, background sync is dispatched immediately; if `weak_2g` or `offline`, the mutation remains safely queued until connectivity is restored.

### 4.2 Deterministic Conflict Resolution Rules
When offline mutations synchronize with the central server via `POST /api/v1/sync`, conflicts are reconciled using explicit clinical business logic:
- **Clinician Edits Win Over CHW Edits:** If a community health worker (ASHA) and a doctor edit the same patient record or diagnosis while disconnected, the clinician's entry supersedes the CHW entry.
- **Appointment Slot Collisions:** If two disconnected patients book the same clinic time-slot at a facility, the earlier server-stamped or timestamped entry is reserved; the colliding mutation is tagged with status `conflict`, logged in the audit trail, and flagged for manual rescheduling without data loss.
- **Zero Silent Data Loss:** Unresolved conflicts are never dropped; they trigger an audit event and appear in the Clinician Review Queue.

---

## 5. Technology Stack & Component Structure

- **Client Runtime:** Next.js 16 (App Router), React 19, Vanilla CSS Design System with accessible high-contrast tap targets and Web Speech API narration.
- **Client Storage:** LocalStorage / IndexedDB persistence layer.
- **Backend API Layer:** Next.js Route Handlers (`/app/api/v1/...`) implementing versioned REST contracts and FHIR R4 JSON schemas.
- **Medical RAG Engine:** Grounded vector similarity retrieval against peer-reviewed surgical and oncological literature (Mayo Clinic, NIH StatPearls, Cleveland Clinic, NCCN).
- **Compliance & Security:** TLS 1.3 in transit, purpose-of-use header enforcement per India DPDP Act 2023, and SaMD non-diagnostic boundaries.

---

## 6. Performance Budget for Low-End Devices

- **Initial Bundle Load:** $< 2\text{ MB}$ compressed payload.
- **Interaction Latency:** $< 3\text{ seconds}$ interaction response on a $2\text{ GB}$ RAM Android 8.0+ device.
- **Battery & Memory Optimization:** Minimal background polling; event-driven reactive sync upon browser network state transitions (`window.addEventListener('online', ...)`).
