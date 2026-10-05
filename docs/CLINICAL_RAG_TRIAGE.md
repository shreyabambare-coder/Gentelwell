# Clinical Protocols & Medical RAG Specification

**Document:** Clinical Protocols, Safety Guardrails & Retrieval-Augmented Generation (RAG) Architecture  
**Focus:** Soft Tissue Masses, Lipomas, Angiolipomas, Cysts, and Emergency Red Flags  
**Clinical Evidence Standard:** Mayo Clinic, NIH StatPearls, Cleveland Clinic, NCCN Oncology Guidelines  

---

## 1. Clinical Safety Philosophy & Governance

Clinical AI systems deployed in rural and low-resource settings must adhere to a **strict harm-reduction paradigm**:
1. **Advisory Decision Support, Never Diagnostic:** The software acts as an assistive triaging tool for patients and Community Health Workers (CHWs). It **never diagnoses** a condition and explicitly frames all findings as possibilities requiring physician palpation.
2. **Deterministic Red-Flag Precedence:** Algorithmic models are **not permitted to guess or hallucinate on acute symptoms**. Pre-programmed hard-coded red flags (obstetric bleeding, chest pain, infant lethargy, soft tissue sarcomas) trigger immediate clinical escalation, bypassing any statistical confidence thresholds.
3. **Strict Target on False Negatives:** For acute red-flag symptoms, the target false-negative rate is **$0.0\%$**.

---

## 2. General Rural Triage Protocols (Decision Trees)

Modeled in [`lib/setuData.js`](file:///c:/cep_project2/project/sakhi-app/lib/setuData.js) and executed via [`app/triage/page.js`](file:///c:/cep_project2/project/sakhi-app/app/triage/page.js):

| Condition ID | Category | Red Flag? | Triggers & Clinical Criteria | Output Action | Plain-Language Rationale |
| :--- | :--- | :---: | :--- | :--- | :--- |
| `obstetric_hemorrhage` | Maternal Emergency | **YES** | Vaginal bleeding in pregnancy OR soaking $\ge 2$ pads/hr | **Immediate Emergency (112/102)** | High risk of placental abruption, miscarriage, or severe hemorrhage requiring transfusion readiness. |
| `severe_chest_pain_breathless` | Cardiovascular / Respiratory | **YES** | Crushing retrosternal chest pain radiating to arm/jaw OR dyspnea at rest | **Immediate Emergency Transfer** | Points toward acute coronary event or severe lower respiratory tract infection. |
| `infant_fever_lethargy` | Pediatric Danger Sign | **YES** | Infant under 6 months with high fever ($>101^\circ\text{F}$), refusal to nurse, or groaning | **Emergency Clinic Transfer** | Young infants deteriorate precipitously from systemic sepsis; feeding refusal is an urgent danger sign. |
| `prolonged_fever_chills_malaria` | Endemic Infection | No | Shivering rigors $>2\text{ days}$ in malaria-endemic zones | **Suggested Clinic Visit (24h)** | Suspected Plasmodium malaria or dengue requiring rapid diagnostic test (RDT) and blood smear. |
| `mild_period_cramps` | Routine Gynecological | No | Cyclical lower abdominal discomfort in first 48 hours of menses | **Self-Care Guidance** | Normal physiological uterine contractions. Warm compress and ginger/fennel hydration advised. |

---

## 3. Medical RAG Architecture for Soft Tissue Masses & Lipomas

Implemented in [`lib/medicalRagEngine.js`](file:///c:/cep_project2/project/sakhi-app/lib/medicalRagEngine.js), [`app/api/rag-triage/route.js`](file:///c:/cep_project2/project/sakhi-app/app/api/rag-triage/route.js), and [`app/lump-triage/page.js`](file:///c:/cep_project2/project/sakhi-app/app/lump-triage/page.js).

### 3.1 Five-Point Clinical Questionnaire

```
                  +-----------------------------------+
                  |   User Reports Soft Tissue Mass   |
                  +-----------------+-----------------+
                                    |
          +-------------------------+-------------------------+
          |                         |                         |
          v                         v                         v
+-------------------+     +-------------------+     +-------------------+
| 1. Location &     |     | 3. Pain Scale     |     | 5. Growth Rate    |
|    Depth          |     |    (0 to 10)      |     |    & Size         |
| * Forearm, Neck,  |     | * 0 = Painless    |     | * Multi-year slow |
|   Trunk, Thigh    |     | * 1-3 = Tender    |     | * Weeks (Rapid)   |
| * Under skin vs   |     | * 4-6 = Angiolip. |     | * <2cm, 2-5cm,    |
|   Deep muscle     |     | * 7-10 = Acute    |     |   >=5cm (Red Flag)|
+-------------------+     +-------------------+     +-------------------+
          |                         |                         |
          +-------------------------+-------------------------+
                                    |
                                    v
+-----------------------------------------------------------------------+
|                    DETERMINISTIC RED-FLAG GATEKEEPER                  |
|   1. Size >= 5 cm (Golf ball or larger)                               |
|   2. Rapid growth in weeks/months                                     |
|   3. Fixed/immobile to deep muscle or fascia                          |
|   4. Stony hard / rock-like consistency                               |
|   5. Severe constant pain (score >= 7/10)                             |
+-----------------------------------+-----------------------------------+
                                    |
            +-----------------------+-----------------------+
            | Has Red Flags?                                | Benign Pattern?
            v                                               v
+-----------------------------+               +-----------------------------+
|    EMERGENCY CLINICAL       |               |    GROUNDED RAG EVIDENCE    |
|    ESCALATION QUEUE         |               |    SYNTHESIS & DIFFERENTIAL |
| * Route to General Surgeon  |               | * Vector retrieval against  |
| * Flag for soft-tissue MRI  |               |   Mayo / NIH StatPearls     |
| * Warn against blind biopsy |               | * Lipoma vs Angiolipoma vs  |
|                             |               |   Cyst plain reasoning      |
+-----------------------------+               +-----------------------------+
```

---

## 4. Differential Diagnostic Criteria & Medical Citations

### 4.1 Standard Benign Lipoma
* **Pathology:** Benign mesenchymal tumor composed of mature adipocytes encased in a thin fibrous capsule.
* **Clinical Criteria:** Soft and doughy consistency; freely mobile beneath the skin; **characteristically painless** ($>90\%$ of cases); slow insidious growth over years; typical size $2\text{ to }5\text{ cm}$.
* **Citation:** Kolb L, Yarrarapu SNS, Cook C. *Lipoma*. StatPearls [Internet]. Treasure Island (FL): StatPearls Publishing, 2024.

### 4.2 Angiolipoma (Painful Vascular Variant)
* **Pathology:** Subcutaneous mass of mature fat interwoven with proliferating capillary blood vessels and microthrombi.
* **Clinical Criteria:** **Tender or painful upon palpation or temperature fluctuation**; soft to slightly firm; typically $1\text{ to }2\text{ cm}$; commonly found on the forearms and upper arms of young adults.
* **Clinical Distinction:** If a user reports a painful soft lump, the algorithm explains that standard lipomas are painless, making an angiolipoma or nerve compression the primary clinical considerations.
* **Citation:** Singh R, et al. *Angiolipoma: Clinical, Radiological, and Histopathological Evaluation*. J Cutan Aesthet Surg. 2021;14(2):210-214.

### 4.3 Epidermoid / Sebaceous Cyst
* **Pathology:** Ingrowth of stratified squamous epithelium producing a keratin-filled dermal cyst.
* **Clinical Criteria:** Presence of a central dark pore or **central punctum**; anchored to the epidermis (moves *with* the skin, unlike a lipoma which moves *under* the skin); releases thick, cheesy, foul-smelling keratin upon rupture; exquisite pain, redness, and heat when infected.
* **Citation:** Zito PM, Scharf R. *Epidermoid Cyst*. StatPearls [Internet]. Treasure Island (FL): StatPearls Publishing, 2023.

### 4.4 Soft Tissue Sarcoma Red Flags (NCCN 5-Point Rule)
* **High-Risk Triggers:**
  1. Size $\ge 5\text{ cm}$ (lemon / golf ball diameter).
  2. Rapid growth over a few weeks or months.
  3. Fixed or attached to deep muscular fascia.
  4. Stony hard consistency.
  5. Situated beneath deep investing fascia.
* **Precaution:** High-risk masses must **never undergo blind punch biopsy or office excision** prior to cross-sectional contrast MRI, to prevent contaminating surgical tissue margins.
* **Citation:** von Mehren M, et al. *Soft Tissue Sarcoma, Version 2.2022, NCCN Clinical Practice Guidelines in Oncology*. J Natl Compr Canc Netw. 2022;20(7):815-833.

---

## 5. System Prompt & Persona Guardrails

The RAG triage assistant operates under a strict, non-diagnostic persona:

```text
You are a medical information and triage assistant for a web application. You are NOT a doctor, and you cannot diagnose medical conditions.

Rules:
1. NEVER state that a user has a specific condition (e.g., do NOT say "You have a lipoma"). Instead, use phrases like "Symptoms you described are consistent with..." or "Possible causes include...".
2. Always include a prominent medical disclaimer in every response.
3. If the user reports RED FLAG symptoms (rapid growth, severe pain >=7/10, redness/heat, hard/fixed lump, size >=5cm), you MUST advise them to seek immediate medical attention.
4. Note that standard lipomas are usually painless. If a user reports a painful lump, explain that it could be an angiolipoma, an inflamed cyst, or nerve compression, and advise a doctor's examination.
5. Base answers ONLY on provided peer-reviewed medical context (Mayo Clinic, NIH, Cleveland Clinic). Do not guess.
```
