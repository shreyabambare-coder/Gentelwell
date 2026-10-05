/**
 * Sakhi AI Clinical Knowledge Base
 * Sourced & verified against peer-reviewed literature and health guidelines:
 * 1. ICMR-NIN (National Institute of Nutrition, India): Dietary Guidelines & Anemia Mukt Bharat (AMB)
 * 2. ICMR-NIRRCH & Monash University (2023): International Evidence-Based Guidelines on PCOS
 * 3. WHO & UNICEF: Menstrual Hygiene Management (MHM) & FIGO Abnormal Uterine Bleeding Standards
 * 4. WHO & ACOG: Comprehensive Antenatal Care (ANC) & Maternal Danger Signs
 * 5. CDC & ICMR: Vaginal Flora, Candidiasis, Bacterial Vaginosis & UTI Protocols
 */

export const RESEARCH_CITATIONS = [
  {
    topic: "Anemia & Nutrition",
    source: "ICMR - National Institute of Nutrition (NIN) & Anemia Mukt Bharat",
    detail: "Screen & Treat strategy, dietary iron bioavailability, vitamin C synergy, and iron-folic acid (IFA) supplementation."
  },
  {
    topic: "PCOS / PCOD",
    source: "ICMR-NIRRCH & 2023 International Evidence-Based PCOS Guidelines (Monash)",
    detail: "Rotterdam diagnostic criteria, metabolic insulin resistance, lifestyle modification, and inositol therapy."
  },
  {
    topic: "Menstrual Cycle & Bleeding",
    source: "FIGO (International Federation of Gynecology and Obstetrics) & WHO",
    detail: "Cycle regularity (24-38 days), normal volume (5-80 ml), and abnormal uterine bleeding red flags."
  },
  {
    topic: "Pregnancy Care",
    source: "WHO Antenatal Care Guidelines & ACOG Practice Bulletins",
    detail: "8 ANC visits model, neural tube defect prevention with folic acid, and preeclampsia triage."
  },
  {
    topic: "Hygiene & Infections",
    source: "CDC STI Guidelines & WHO Menstrual Hygiene Management (MHM)",
    detail: "Intimate wash safety, pH balance (3.8-4.5), toxic shock syndrome (TSS) prevention, and UTI management."
  }
];

export const CLINICAL_TOPICS = [
  {
    id: "menstrual_cycle_basics",
    triggers: [
      "normal period", "cycle length", "menstrual cycle", "how many days", "period delay",
      "irregular periods", "period late", "chatar", "mahavari kitne din", "period cycle", "period calendar"
    ],
    title: "Normal Menstrual Cycle & Irregularity Guide",
    category: "Menstrual Health",
    citation: "FIGO Classification & WHO Reproductive Health Standards",
    content: `### Understanding a Normal Menstrual Cycle
According to **FIGO (International Federation of Gynecology & Obstetrics)** standards:
- **Normal Cycle Duration:** **24 to 38 days** (measured from Day 1 of one period to Day 1 of the next).
- **Normal Bleeding Length:** **3 to 8 days**.
- **Normal Blood Loss:** Typically 30–40 ml (up to 80 ml, or roughly 3–5 regular soaked pads/tampons per day).

---

### Common Causes of Delayed or Irregular Periods:
1. **Acute Stress & Cortisol:** High emotional or physical stress suppresses GnRH pulsatility from the hypothalamus, delaying ovulation (*Hypothalamic Oligomenorrhea*).
2. **Hormonal Conditions (PCOS/Thyroid):** Elevated androgens, insulin resistance, or hypothyroidism (elevated TSH) commonly prevent regular follicle maturation.
3. **Rapid Weight or Diet Changes:** Sudden calorie restriction or extreme athletic training lowers leptin, signaling the brain to pause reproductive cycles.
4. **Perimenopause:** Women in their late 30s or 40s experience fluctuating estrogen and shorter or skipped cycles.

---

### Evidence-Based Recommendations:
- Track your cycles for at least 3 consecutive months using a period log or app. Note symptoms, flow intensity, and cycle days.
- Ensure balanced caloric intake with sufficient healthy fats (avocado, nuts, seeds) for steroid hormone synthesis.
- **When to see a doctor:** If your period is absent for **>90 days** (amenorrhea), cycles are consistently shorter than 21 days or longer than 38 days, or you have sudden spotting between cycles.`,
    hindiContent: `### सामान्य माहवारी चक्र (Menstrual Cycle) के मानक
**FIGO एवं WHO (विश्व स्वास्थ्य संगठन)** के अनुसार:
- **सामान्य चक्र:** **24 से 38 दिन** (एक पीरियड के पहले दिन से अगले पीरियड के पहले दिन तक)।
- **रक्तस्राव के दिन:** **3 से 8 दिन**।
- **औसत रक्त प्रवाह:** 30 से 50 मिली (लगभग 3-5 पैड प्रतिदिन)।

---

### पीरियड्स लेट या अनियमित होने के मुख्य कारण:
1. **मानसिक तनाव:** अधिक तनाव से दिमाग के हाइपोथैलेमस पर असर पड़ता है जिससे ओव्यूलेशन टल जाता है।
2. **PCOS या थायरॉइड:** हार्मोन असंतुलन से अंडा समय पर परिपक्व नहीं होता।
3. **वजन में अचानक बदलाव:** बहुत सख्त डाइटिंग या अत्यधिक व्यायाम।

---

### सुझाव:
- कम से कम 3 महीने तक अपने पीरियड की तारीखें नोट करें।
- यदि पीरियड **90 दिनों** से अधिक न आए या दो माहवारियों के बीच बार-बार स्पॉटिंग हो, तो स्त्री रोग विशेषज्ञ से सोनोग्राफी व थायरॉइड टेस्ट कराएं।`,
    suggestions: [
      "How to naturally regulate irregular periods?",
      "What tests should I do for delayed periods?",
      "How can stress cause a missed period?"
    ]
  },
  {
    id: "menstrual_cramps",
    triggers: [
      "cramp", "cramps", "period pain", "dysmenorrhea", "stomach pain", "pet dard", "period me dard",
      "severe pain period", "pelvic cramp", "painkillers period", "meftal", "hot water bag"
    ],
    title: "Relief for Menstrual Pain (Dysmenorrhea)",
    category: "Menstrual Health",
    citation: "ACOG Practice Bulletin No. 907: Dysmenorrhea & Endometriosis",
    content: `### Science Behind Period Cramps
Menstrual cramps (*Primary Dysmenorrhea*) are caused by excessive production of **prostaglandins** (specifically PGF2α). Prostaglandins cause the uterine muscular wall (myometrium) to contract forcefully to expel the endometrial lining, briefly reducing blood supply and oxygen to local tissue.

---

### Evidence-Based Non-Pharmacological Relief:
1. **Continuous Local Heat Therapy (40°C / 104°F):** Clinical randomized trials show a warm heating pad or hot water bottle is **as effective as ibuprofen** by relaxing smooth muscle fibers and improving pelvic blood flow.
2. **Targeted Gentle Yoga:** Poses that lengthen the psoas and pelvic floor muscles (e.g., *Supta Baddha Konasana / Reclining Bound Angle*, *Balasana / Child's Pose*, *Marjaryasana / Cat-Cow*) significantly reduce cramp intensity.
3. **Anti-Inflammatory Nutrition:**
   - **Ginger:** 750–2000 mg of ginger powder or fresh ginger tea during the first 3 days of menses suppresses prostaglandin synthesis similarly to NSAIDs without stomach irritation.
   - **Magnesium (200-300 mg):** Relaxes uterine muscle contractions. Found in pumpkin seeds, soaked almonds, dark chocolate (>70%), and spinach.
   - **Chamomile & Fennel (Saunf):** Contains antispasmodic compounds (*anethole*) that soothe uterine spasms.

---

### Red Flags (Secondary Dysmenorrhea):
If pain begins days before bleeding, radiates severely down the legs or rectum, or fails to respond to heat and mild analgesics, consult a gynecologist to rule out **Endometriosis, Adenomyosis, or Uterine Fibroids**.`,
    hindiContent: `### माहवारी में दर्द (Dysmenorrhea) का वैज्ञानिक कारण
पीरियड्स के दौरान गर्भाशय से **प्रोस्टाग्लैंडीन (Prostaglandin)** नामक रसायन निकलता है, जो गर्भाशय की मांसपेशियों में खिंचाव पैदा करता है।

---

### दर्द से राहत के प्रमाणित घरेलू उपाय:
1. **गर्म पानी की थैली (सिकाई):** पेट के निचले हिस्से और कमर पर 15-20 मिनट सिकाई करने से गर्भाशय की मांसपेशियों को आराम मिलता है।
2. **अदरक व सौंफ का काढ़ा:** अदरक प्रोस्टाग्लैंडीन को कम करने में असरदार है। गुनगुने पानी में अदरक या सौंफ उबालकर पिएं।
3. **मैग्नीशियम युक्त भोजन:** केला, कद्दू के बीज (Pumpkin seeds) और भीगे बादाम मांसपेशियों के दर्द को कम करते हैं।
4. **हल्के योगासन:** तितली आसन (Baddha Konasana) और बालासन पेल्विक हिस्से का तनाव दूर करते हैं।

---

> **डॉक्टर से कब मिलें:** यदि दर्द के कारण स्कूल या ऑफिस जाना संभव न हो, या दर्द कमर और पैरों तक फैले, तो एंडोमेट्रियोसिस (Endometriosis) की जांच के लिए डॉक्टर से मिलें।`,
    suggestions: [
      "Can ginger tea really replace painkillers for cramps?",
      "What are the warning signs of endometriosis?",
      "Is it normal to have lower back pain during periods?"
    ]
  },
  {
    id: "pcos_pcod",
    triggers: [
      "pcos", "pcod", "polycystic", "facial hair", "hirsutism", "hormonal imbalance", "acne jawline",
      "weight gain period", "insulin resistance", "ovary cyst", "infertility pcos", "metformin pcos"
    ],
    title: "Comprehensive Clinical Guide to PCOS / PCOD",
    category: "Hormonal & Metabolic Health",
    citation: "2023 International Evidence-Based Guidelines on PCOS (Monash University / ICMR-NIRRCH)",
    content: `### What is PCOS? (Rotterdam Diagnostic Criteria)
According to the **2023 International PCOS Guidelines**, PCOS is confirmed if a woman meets at least **2 out of 3** criteria (after excluding thyroid/adrenal issues):
1. **Ovulatory Dysfunction:** Infrequent or absent periods (oligomenorrhea/amenorrhea).
2. **Hyperandrogenism:** Elevated clinical androgens (acne, excess facial/chin hair, scalp hair loss) or biochemical elevations (Free Testosterone/DHEA-S).
3. **Polycystic Ovarian Morphology:** Pelvic ultrasound showing ≥20 follicles per ovary or ovarian volume >10 ml.

---

### Root Driver: Insulin Resistance (75-80% of Cases)
High circulating insulin stimulates the ovarian theca cells to overproduce androgens while lowering Sex Hormone Binding Globulin (SHBG).

---

### Pillar 1: Evidence-Based Nutritional Strategy
- **Low Glycemic Index (GI) Carbohydrates:** Choose whole millets (jowar, ragi, bajra), brown rice, steel-cut oats instead of refined flour (maida) and white sugar.
- **Protein at Every Meal (25-30g):** Dal, chana, paneer, tofu, eggs, or Greek yogurt to blunt post-meal glucose spikes.
- **Healthy Fats & Fiber:** Flaxseeds, chia seeds, walnuts, and plenty of cruciferous vegetables to support estrogen elimination.
- **Targeted Supplements (with medical guidance):**
  - **Myo-Inositol & D-Chiro Inositol (40:1 ratio):** Improves insulin sensitivity and ovulation.
  - **Vitamin D3 & Omega-3 Fish Oil:** Lowers systemic inflammation.

---

### Pillar 2: Physical Activity
- Combine **resistance training (2–3 times weekly)** to increase muscle glucose uptake with daily **30-minute brisk walking** or zone-2 cardio.`,
    hindiContent: `### PCOS / PCOD क्या है? (रोटरडैम मानदंड)
**अंतरराष्ट्रीय दिशानिर्देश 2023** के अनुसार, PCOS एक हार्मोनल और मेटाबॉलिक स्थिति है जिसमें:
1. माहवारी का अनियमित होना (साल में 8 से कम पीरियड्स)।
2. मेल हार्मोन (Androgens) का बढ़ना, जिससे चेहरे पर अनचाहे बाल, मुंहासे और बाल झड़ना।
3. अंडाशय (Ovaries) में कई छोटे-छोटे फॉलिकल्स दिखना।

---

### मुख्य कारण: इंसुलिन प्रतिरोध (Insulin Resistance)
शरीर में इंसुलिन का सही इस्तेमाल न होने से अंडाशय ज्यादा मेल हार्मोन बनाने लगता है।

---

### सुधार के मुख्य कदम:
1. **कम ग्लाइसेमिक भोजन:** सफेद चावल, मैदा, और चीनी की जगह ज्वार, बाजरा, रागी, दालें और हरी सब्जियां लें।
2. **स्ट्रेंथ ट्रेनिंग व वॉक:** हफ्ते में 3 दिन मांसपेशियों का हल्का व्यायाम और रोजाना 30 मिनट तेज चाल इंसुलिन सुधारती है।
3. **पर्याप्त नींद (7-8 घंटे):** तनाव का हार्मोन कोर्टिसोल (Cortisol) कम करने के लिए समय पर सोएं।`,
    suggestions: [
      "What is the 40:1 inositol ratio for PCOS?",
      "Can PCOS be reversed or cured permanently?",
      "What are the best Indian breakfast options for PCOS?"
    ]
  },
  {
    id: "iron_anemia_deficiency",
    triggers: [
      "iron", "anemia", "anaemia", "hemoglobin", "low hb", "tiredness", "weakness", "dizziness",
      "khoon ki kami", "thakan", "ferritin", "pale skin", "shortness of breath", "iron rich food", "palak"
    ],
    title: "Iron Deficiency Anemia & Hemoglobin Optimization",
    category: "Nutrition & Vitality",
    citation: "ICMR-NIN Dietary Guidelines for Indians & Anemia Mukt Bharat (AMB)",
    content: `### Clinical Definition & Normal Ranges
According to **WHO & ICMR** criteria:
- **Non-Pregnant Adult Women:** Hemoglobin **≥12.0 g/dL**
- **Pregnant Women:** Hemoglobin **≥11.0 g/dL**
- Mild Anemia: 11.0–11.9 g/dL | Moderate: 8.0–10.9 g/dL | Severe: <8.0 g/dL.

---

### Key Clinical Signs of Iron Depletion:
- Unexplained chronic exhaustion, brain fog, and muscle weakness
- Brittle spoon-shaped nails (*koilonychia*) and hair shedding
- Pallor in inner lower eyelids, pale tongue, cold hands and feet
- Shortness of breath or rapid palpitations during light exertion
- Restless legs syndrome or unusual cravings for ice/clay (*Pica*)

---

### Sourcing & Maximizing Iron Absorption (ICMR-NIN):
1. **Plant-Based (Non-Heme) Iron Sources:**
   - Dark leafy greens: Fenugreek (methi), spinach, amaranth (chaulai)
   - Legumes & seeds: Black chana, horse gram (kulthi), rajma, soaked pumpkin seeds, roasted black sesame (*til*)
   - Traditional sweeteners: Organic dark jaggery (*gud*) with roasted peanuts
2. **The Vitamin C Absorption Multiplier:**
   - Non-heme iron requires an acidic gastric environment for reduction to ferrous form (Fe²⁺). Always squeeze **fresh lemon**, or consume **amla (Indian gooseberry)**, oranges, or tomatoes alongside iron-dense meals.
3. **Inhibitors to Separate by 1-2 Hours:**
   - **Tannins and Polyphenols:** Tea (*chai*) and coffee reduce iron absorption by up to 60–80%. Never drink tea with main meals.
   - **Phytates and Calcium:** Soak lentils overnight to degrade phytates; separate high-dose calcium supplements from iron supplements.`,
    hindiContent: `### खून की कमी (एनीमिया) और हीमोग्लोबिन सुधार
**ICMR एवं WHO** के अनुसार महिलाओं में सामान्य हीमोग्लोबिन स्तर **12.0 से 15.5 g/dL** होना चाहिए। भारत में हर दूसरी महिला आयरन की कमी से जूझ रही है।

---

### मुख्य लक्षण:
- हल्की सी मेहनत में सांस फूलना और अत्यधिक थकान
- आंखों के नीचे और जीभ का पीलापन
- चक्कर आना, सिरदर्द, और बालों का अधिक झड़ना

---

### हीमोग्लोबिन बढ़ाने के सबसे तेज उपाय:
1. **आंवला और नींबू (विटामिन C):** दाल या सलाद पर नींबू निचोड़ें या सुबह आंवला लें। विटामिन C आयरन के अवशोषण को 3 गुना बढ़ाता है।
2. **आयरन युक्त आहार:** काला चना, मेथी, पालक, बथुआ, तिल, किशमिश और थोड़ा गुड़।
3. **भोजन के साथ चाय-कॉफी बिल्कुल न पिएं:** चाय में मौजूद टैनिन (Tannin) आयरन को सोखने से रोकता है। चाय खाने से 1 घंटा पहले या बाद में ही पिएं।`,
    suggestions: [
      "What is the difference between Serum Ferritin and Hemoglobin?",
      "Which iron tablets cause the least nausea and constipation?",
      "Can drinking amla juice daily cure anemia?"
    ]
  },
  {
    id: "menstrual_hygiene_products",
    triggers: [
      "hygiene", "sanitary pad", "tampon", "menstrual cup", "cup size", "how to insert cup",
      "pad rash", "infection", "clean intimate", "soap intimate", "tss", "toxic shock", "smell vagina"
    ],
    title: "Menstrual Hygiene Management (MHM) & Product Safety",
    category: "Hygiene & Wellness",
    citation: "WHO / UNICEF Joint Monitoring Programme for MHM & CDC Infection Protocols",
    content: `### Evidence-Based Product Safety Guidelines

#### 1. Sanitary Pads
- **Change Interval:** Change every **4 to 6 hours**, regardless of how light the flow is. Blood, warmth, and sweat create a rapid breeding ground for bacteria (*Staphylococcus* & *Candida*).
- **Preventing Rashes:** Avoid synthetic plastic top-sheets; opt for unbleached cotton or bamboo pads. Apply pure organic coconut oil to friction-prone groin creases.

#### 2. Menstrual Cups (Medical Grade Silicone)
- **Safe Wear Time:** Up to **8 to 12 hours** safely.
- **Sterilization Protocol:** Boil in water for **5 to 7 minutes** before your cycle begins and after your period ends. During your cycle, rinse with plain drinking water and reinsert.
- **Sizing Guide:** Size Small for under 30 without vaginal delivery; Size Medium/Large for over 30 or after vaginal birth.

#### 3. Tampons
- Change every **4 to 8 hours**. Never leave a tampon in for longer than 8 hours to prevent **Toxic Shock Syndrome (TSS)**.

---

### Intimate Area Care (The Self-Cleaning Microbiome)
- The internal vagina contains beneficial *Lactobacillus* species producing lactic acid to maintain a healthy acidic pH (**3.8 to 4.5**).
- **Never douche or wash internally with soap.** Harsh alkaline soaps destroy protective flora, leading to Bacterial Vaginosis and yeast infections.
- Wash only the external skin (the vulva) with warm, clean water or a pH-balanced unscented wash. Always wipe **front to back**.`,
    hindiContent: `### माहवारी स्वच्छता (MHM) और सुरक्षा के नियम
**WHO एवं UNICEF** के अनुसार माहवारी में सही स्वच्छता संक्रमणों से रक्षा करती है।

---

### सुरक्षा के नियम:
1. **पैड बदलने का समय:** हर 4 से 6 घंटे में पैड अवश्य बदलें, चाहे फ्लो कम ही क्यों न हो।
2. **मेंस्ट्रुअल कप (Menstrual Cup):** 8-12 घंटे तक इस्तेमाल कर सकते हैं। हर महीने पीरियड शुरू होने से पहले 5 मिनट खौलते पानी में उबालें।
3. **प्राइवेट पार्ट की सफाई:** योनि (Vagina) अंदर से खुद को साफ रखती है। अंदर साबुन या डिटॉल कभी न लगाएं। केवल बाहर के हिस्से को सादे पानी से धोएं।
4. **टॉयलेट के बाद पोंछने का तरीका:** हमेशा **आगे से पीछे** की तरफ पोंछें ताकि बैक्टीरिया पेशाब की नली में न जाएं।`,
    suggestions: [
      "How to overcome fear of inserting a menstrual cup?",
      "What are the symptoms of Toxic Shock Syndrome?",
      "How to treat menstrual pad rashes naturally?"
    ]
  },
  {
    id: "pregnancy_nutrition_trimesters",
    triggers: [
      "pregnant", "pregnancy", "trimester", "morning sickness", "nausea pregnant", "baby kick",
      "folic acid", "foods avoid pregnancy", "garbhavastha", "first trimester", "third trimester",
      "ultrasound pregnancy", "preeclampsia", "swelling feet pregnant"
    ],
    title: "Clinical Trimester Milestones, Nutrition & Warning Signs",
    category: "Maternal Health",
    citation: "WHO Recommendations on Antenatal Care for a Positive Pregnancy Experience & ACOG",
    content: `### Trimester Breakdown & Essential Nutrition

#### First Trimester (Weeks 1 to 12):
- **Critical Micronutrient:** **Folic Acid (400–800 mcg daily)** is non-negotiable to prevent Neural Tube Defects (such as Spina Bifida). Begin taking it ideally preconception or as soon as pregnancy is suspected.
- **Managing Morning Sickness:** Keep dry crackers or roasted makhana on your bedside table; eat a few bites before rising. Sip ginger tea and consume small, frequent meals rather than large meals.

#### Second Trimester (Weeks 13 to 26):
- **Fetal Growth & Bone Development:** Calcium (1000 mg/day) and Elemental Iron (30–60 mg/day) starting after the 12th week. **Important:** Take Iron and Calcium at separate times (minimum 2 hours apart) for optimal absorption.
- **Fetal Movement (Quickening):** Usually felt between weeks 18 and 22 as gentle fluttering.

#### Third Trimester (Weeks 27 to 40):
- **Fetal Kick Counts:** Monitor daily. In a quiet, side-lying position, you should feel at least **10 distinct movements within 2 hours**.

---

### Foods Strictly to Avoid:
- Unpasteurized milk, raw cheeses, raw/runny eggs (*Listeria / Salmonella* risk).
- Raw papaya (contains high latex/papain that triggers uterine contractions) and excess unripened pineapple.
- High-mercury seafood and alcohol; limit caffeine to <200 mg/day.

---

### Urgent Warning Signs (Go to Hospital Immediately):
- **Any vaginal bleeding or fluid leakage**
- **Severe persistent headache, sudden facial puffiness, or visual spots (Preeclampsia signs)**
- **Sudden reduction in baby's kicks**
- **Sharp persistent lower abdominal pain or high fever**`,
    hindiContent: `### गर्भावस्था देखभाल, पोषण व जरूरी सावधानियां
**WHO एवं ACOG** दिशानिर्देशों के अनुसार 9 महीनों की आवश्यक जानकारी:

---

### तिमाही अनुसार पोषण:
1. **पहली तिमाही (1-12 हफ्ते):** **फॉलिक एसिड (Folic Acid)** अत्यंत जरूरी है ताकि शिशु की रीढ़ और मस्तिष्क का सही विकास हो। मतली दूर करने के लिए थोड़ा-थोड़ा करके सूखा नाश्ता लें।
2. **दूसरी तिमाही (13-26 हफ्ते):** डॉक्टर की सलाह से आयरन और कैल्शियम शुरू करें। दोनों गोलियां एक साथ न लें, 2-3 घंटे का अंतर रखें।
3. **तीसरी तिमाही (27-40 हफ्ते):** शिशु की हलचल (किक काउंट) पर ध्यान दें। 2 घंटे में कम से कम 10 हलचलें होनी चाहिए।

---

### क्या न खाएं:
- कच्चा पपीता (यह गर्भाशय में संकुचन ला सकता है)।
- कच्चा दूध, अधपका अंडा या अत्यधिक चाय/कॉफी।

---

### आपातकालीन खतरे के संकेत (तुरंत अस्पताल जाएं):
- कोई भी ब्लीडिंग या पानी का रिसाव
- चेहरे व हाथों पर अचानक सूजन और आंखों के आगे धुंधलापन
- शिशु की हलचल में अचानक कमी।`,
    suggestions: [
      "Why must iron and calcium tablets be taken separately in pregnancy?",
      "How to do fetal kick counts accurately?",
      "What are the warning signs of gestational diabetes?"
    ]
  },
  {
    id: "uti_vaginal_infections",
    triggers: [
      "uti", "urinary infection", "burning urination", "peshab me jalan", "white discharge",
      "curdy discharge", "itching private parts", "vaginal itching", "yeast infection",
      "bacterial vaginosis", "foul smell", "yellow discharge", "green discharge"
    ],
    title: "UTI, Candidiasis & Vaginal Discharge Clinical Triage",
    category: "Infection & Intimate Health",
    citation: "CDC Sexually Transmitted Infections Treatment Guidelines & ACOG Practice Bulletin No. 215",
    content: `### Distinguishing Normal vs Pathological Discharge

| Discharge Type | Likely Cause | Typical Symptoms | Action Needed |
| :--- | :--- | :--- | :--- |
| **Clear / Stretchy (Egg-white)** | Normal Ovulation | Odorless, slippery, mid-cycle | Healthy & normal |
| **Thick, White, Curd-like** | Yeast Infection (*Candida*) | Intense itching, redness, no strong odor | Antifungal treatment |
| **Thin, Grayish-White** | Bacterial Vaginosis (BV) | Strong "fishy" odor, especially after sex | Oral/topical antibiotics (Metronidazole) |
| **Yellowish-Green, Frothy** | Trichomoniasis / STI | Foul odor, painful urination & intercourse | Partner treatment + Antibiotics |

---

### Urinary Tract Infection (UTI) Protocol
Because the female urethra is short (~4 cm) and close to the anus, *E. coli* bacteria can easily ascend into the bladder (cystitis).
- **Core Symptoms:** Sharp burning during urination, urinary urgency with scant urine output, suprapubic pressure.
- **Home Recovery Measures:**
  - Drink **2.5 to 3 Liters of water daily** to mechanically flush the bladder lumen.
  - Urinate before and within 15 minutes after sexual activity.
  - Pure D-Mannose / Cranberry PACs prevent bacteria from binding to uroepithelial cells.

---

### When UTI is an Emergency:
If you have **fever (>101°F), chills, nausea, or flank/back pain**, the infection may have reached your kidneys (*Pyelonephritis*). This requires prompt medical evaluation and prescription antibiotics.`,
    hindiContent: `### सफेद पानी (डिस्चार्ज), खुजली और यूटीआई (UTI) की पहचान
योनि स्राव और पेशाब में जलन के लक्षण और सही पहचान:

---

### डिस्चार्ज के प्रकार:
1. **पारदर्शी और चिपचिपा:** यह ओव्यूलेशन (माहवारी के बीच) का सामान्य और स्वस्थ संकेत है।
2. **दही जैसा गाढ़ा सफेद व तेज खुजली:** यह फंगल/यीस्ट इन्फेक्शन (Candida) का लक्षण है।
3. **पतला मटमैला व मछली जैसी बदबू:** यह बैक्टीरियल वेजिनोसिस (BV) है, जिसमें डॉक्टर की एंटीबायोटिक की जरूरत होती है।
4. **पीला या हरा झागदार डिस्चार्ज:** यह इन्फेक्शन का संकेत है, तुरंत स्त्री रोग विशेषज्ञ से मिलें।

---

### पेशाब में जलन (UTI) के उपाय:
- दिनभर में 8-10 गिलास पानी पिएं।
- कभी भी पेशाब न रोकें।
- यदि तेज बुखार या कमर में दर्द हो, तो तुरंत डॉक्टर से यूरिन कल्चर टेस्ट कराएं।`,
    suggestions: [
      "How to tell if discharge is normal or an infection?",
      "Can drinking baking soda or lemon water cure a UTI?",
      "What causes recurrent fungal yeast infections?"
    ]
  },
  {
    id: "fertility_ovulation_contraception",
    triggers: [
      "ovulation", "fertile window", "pregnant chance", "how to get pregnant", "safe period",
      "contraception", "birth control", "ipill", "emergency contraceptive", "unprotected sex",
      "morning after pill", "pregnancy test kit", "prega news", "missed period test"
    ],
    title: "Ovulation, Fertile Window & Contraceptive Science",
    category: "Reproductive & Family Health",
    citation: "ACOG Practice Bulletin: Emergency Contraception & Family Planning",
    content: `### Determining the Fertile Window
- **Sperm Longevity:** Up to **5 days** in fertile, alkaline cervical mucus.
- **Ovum Longevity:** Only **12 to 24 hours** after release from the follicle.
- **The Window of Conception:** The 5 days leading up to ovulation plus the day of ovulation itself.
  - In a standard 28-day cycle, ovulation typically occurs on **Day 14** (fertile window: Days 9–15).
  - Physical signs: Cervical mucus becomes clear, slippery, and stretchy like raw egg-white (*spinnbarkeit*), alongside mild one-sided pelvic twinge (*mittelschmerz*).

---

### Emergency Contraceptive Pills (ECPs - Levonorgestrel 1.5 mg / i-Pill):
1. **Mechanism:** ECPs primarily **delay or inhibit ovulation**. They do *not* induce an abortion if fertilization and implantation have already occurred.
2. **Time Sensitivity:** Must be taken as soon as possible, ideally within **24 hours**, and no later than **72 hours** after unprotected intercourse. Efficacy drops significantly with each passing day.
3. **Side Effects & Misuse:** ECPs contain a high dose of synthetic progestin. They can cause nausea, breast tenderness, and temporary cycle disruption (period may arrive a week early or late). They should **never be used as a primary, recurring birth control method**.

---

### Accurate Pregnancy Testing
- The hormone **hCG (human Chorionic Gonadotropin)** is detectable in urine approximately 10–14 days after conception.
- **Best Practice:** Test using the **first morning urine sample** on the first day of your missed period for maximum accuracy.`,
    hindiContent: `### ओव्यूलेशन, गर्भधारण का सही समय और गर्भनिरोध
गर्भधारण और सुरक्षा से जुड़ी वैज्ञानिक जानकारी:

---

### गर्भधारण के अनुकूल दिन (Fertile Window):
- 28 दिन के चक्र में 12वें से 16वें दिन के बीच ओव्यूलेशन होता है।
- शुक्राणु महिला के शरीर में 5 दिन तक जीवित रह सकते हैं, जबकि अंडा सिर्फ 12-24 घंटे।
- ओव्यूलेशन के समय डिस्चार्ज अंडे की सफेदी जैसा चिकना और खिंचने वाला हो जाता है।

---

### इमरजेंसी पिल (Emergency Contraceptive Pill):
1. असुरक्षित संबंध के **72 घंटे (3 दिन)** के भीतर जितनी जल्दी हो सके लें (पहले 24 घंटे में सबसे असरदार)।
2. यह ओव्यूलेशन को टालती है, यह कोई गर्भपात की दवा नहीं है।
3. इसे हर महीने नियमित गर्भनिरोधक के रूप में न लें, इससे पीरियड्स काफी अनियमित हो सकते हैं।

---

### प्रेगनेंसी टेस्ट कब करें?
पीरियड मिस होने के **पहले दिन सुबह के पहले पेशाब** से टेस्ट करने पर सबसे सही परिणाम मिलता है।`,
    suggestions: [
      "How soon after sex can I take a pregnancy test?",
      "What are the long-term side effects of taking i-Pill frequently?",
      "How to track ovulation using basal body temperature?"
    ]
  },
  {
    id: "mental_health_pms_ppd",
    triggers: [
      "mental health", "stress", "anxiety", "depression", "crying spell", "pmdd", "pms mood",
      "irritated period", "postpartum blues", "postpartum depression", "cant sleep", "panic attack",
      "mood swing", "sad without reason", "tanaav", "gussa"
    ],
    title: "Neuro-Endocrine Mood Shifts, PMDD & Maternal Wellbeing",
    category: "Emotional & Mental Wellbeing",
    citation: "ACOG Clinical Guidance on Perinatal Depression & International Society for Premenstrual Disorders (ISPMD)",
    content: `### Why Your Cycle Affects Your Mood
Neurotransmitters such as **Serotonin** and **GABA** are intimately linked to cyclic progesterone and estrogen fluctuations.

#### 1. Luteal Phase Irritability & PMDD
- During the 7–10 days before menstruation (luteal phase), progesterone rapidly drops. In women sensitive to neurosteroid changes (*Allopregnanolone*), this triggers sharp serotonin dips.
- **PMDD (Premenstrual Dysphoric Disorder):** Severe mood swings, deep sadness, hopeless thoughts, and intense anger that resolve within 1–2 days after menstrual bleeding begins. It is a biological neuro-endocrine condition, not a personal flaw.

#### 2. Postpartum "Baby Blues" vs Postpartum Depression (PPD)
- **Baby Blues (Up to 80% of mothers):** Mild tearfulness, sleep difficulty, and mood volatility lasting **under 2 weeks** postpartum.
- **Postpartum Depression (PPD):** Persistent emptiness, severe anxiety, guilt, detachment from the infant, or intrusive thoughts lasting **longer than 2 weeks**. PPD is fully treatable through supportive psychotherapy and lactation-safe medical care.

---

### Somatic Grounding Interventions:
1. **Physiological Sigh (Huberman / Stanford):** Two quick inhalations through the nose followed by one long, slow exhalation through the mouth immediately resets autonomic arousal.
2. **Magnesium Glycinate (200-300 mg before sleep):** Enhances brain GABA levels, improving restorative slow-wave sleep.
3. **Compassionate Communication:** Validate your body's signals instead of fighting them. Schedule lower-stress activities during your luteal phase.`,
    hindiContent: `### हार्मोनल बदलाव, मूड स्विंग्स और मानसिक स्वास्थ्य
माहवारी से पहले या प्रसव के बाद मूड बदलना पूरी तरह से जैविक (हार्मोनल) कारणों से होता है।

---

### मूड स्विंग्स के मुख्य रूप:
1. **PMS / PMDD:** पीरियड शुरू होने से 7 दिन पहले अचानक गुस्सा आना, रोने का मन करना और चिड़चिड़ापन। पीरियड शुरू होते ही यह ठीक होने लगता है।
2. **प्रसवोत्तर अवसाद (Postpartum Depression):** डिलीवरी के 2 हफ्ते बाद भी यदि मां को अत्यधिक उदासी, बच्चे से जुड़ाव महसूस न होना या घबराहट रहे, तो यह PPD का संकेत है।

---

### मन को तुरंत शांत करने के तरीके:
- **गहरी सांस की तकनीक:** 2 छोटी सांसें नाक से लें और मुंह से धीरे-धीरे पूरी सांस छोड़ें।
- **खुद को दोष न दें:** यह समझें कि यह हार्मोन्स का उतार-चढ़ाव है।
- **काउंसलिंग की सहायता:** यदि मन में लगातार उदासी या घबराहट रहे, तो मानसिक स्वास्थ्य विशेषज्ञ से बात करें।`,
    suggestions: [
      "What are the diagnostic criteria for PMDD?",
      "How to tell difference between normal baby blues and PPD?",
      "What natural supplements support mood in the luteal phase?"
    ]
  },
  {
    id: "menopause_perimenopause",
    triggers: [
      "menopause", "perimenopause", "hot flashes", "night sweats", "estrogen", "bone density",
      "osteoporosis", "dryness menopause", "periods stopping", "age 45", "age 50"
    ],
    title: "Perimenopause, Hot Flashes & Bone Health Transition",
    category: "Menopausal Health",
    citation: "The North American Menopause Society (NAMS) & Endocrine Society Clinical Guidelines",
    content: `### Clinical Stages of the Menopausal Transition
- **Perimenopause (Typically ages 40–50):** Estrogen levels wildly fluctuate rather than steadily decline. Cycles become irregular, heavier or skipped, accompanied by sleep disruption, brain fog, and vasomotor symptoms (*hot flashes*).
- **Menopause:** Clinically defined as **12 consecutive months without a menstrual period** (average age: 51 years worldwide, 47-49 in India).

---

### Managing Vasomotor Symptoms (Hot Flashes & Night Sweats):
- Dress in layered, breathable fabrics (cotton/linen); keep cold water bedside.
- Limit triggers: Spicy foods, caffeine, alcohol, and warm sleeping environments.
- Regular aerobic exercise and mindfulness practices reduce sympathetic overdrive.

---

### Preserving Bone Density & Cardiovascular Health:
- When estrogen declines, osteoclast activity increases, causing accelerated bone loss (**Osteoporosis** risk).
- **Nutritional Defense:** Ensure **1200 mg Calcium** and **800–1000 IU Vitamin D3 daily**.
- **Weight-Bearing Resistance Exercises:** Squats, walking lunges, and light weights stimulate osteoblasts to maintain bone mineral density.`,
    hindiContent: `### पेरिमेनोपॉज और मेनोपॉज (रजोनिवृत्ति)
40 से 50 वर्ष की उम्र में महिलाओं के शरीर में एस्ट्रोजन हार्मोन कम होने लगता है।

---

### मुख्य लक्षण:
- अचानक शरीर और चेहरे पर तेज गर्मी व पसीना आना (Hot Flashes)
- माहवारी का अनियमित होना या कुछ महीनों का अंतर आना
- हड्डियों में कमजोरी, जोड़ों का दर्द और अनिद्रा।

---

### हड्डियों और स्वास्थ्य की सुरक्षा:
1. **कैल्शियम व विटामिन D3:** दूध, दही, तिल, हरी सब्जियां और धूप का सेवन करें।
2. **हल्का वजन उठाने का व्यायाम:** रोजाना 30 मिनट टहलना और हल्के व्यायाम हड्डियों को मजबूत रखते हैं।
3. **12 महीने तक पीरियड न आना:** जब लगातार 1 वर्ष तक पीरियड न आए, तो इसे मेनोपॉज कहा जाता है।`,
    suggestions: [
      "What natural remedies ease hot flashes?",
      "How to prevent osteoporosis after menopause?",
      "What is Hormone Replacement Therapy (HRT) and its safety?"
    ]
  },
  {
    id: "emergency_red_flags",
    triggers: [
      "heavy bleeding", "soaking pad", "soaked pad", "golf ball clot", "severe pelvic pain",
      "fainting", "fainted", "unbearable abdominal pain", "bleeding while pregnant",
      "bleeding pregnant", "ectopic", "high fever pelvic", "shortness of breath bleeding",
      "khoon beh raha", "bahut jyada bleeding", "behosh", "ek taraf tez dard"
    ],
    title: "Urgent Medical Red Flags & Triage Protocol",
    category: "Emergency Care",
    isEmergency: true,
    citation: "ACOG Committee Opinion on Emergency Triage in Obstetrics & Gynecology",
    content: `🚨 **IMMEDIATE CLINICAL RED FLAG ALERT: SEEK EMERGENCY MEDICAL EVALUATION**

The symptoms described require **immediate, in-person clinical assessment**. Do not attempt to manage these at home with home remedies.

---

### Symptoms Requiring an Immediate Emergency Room Visit:
1. **Hemorrhagic Menstrual Bleeding:**
   - Soaking through **2 or more heavy maxi pads per hour for 2 consecutive hours**.
   - Passing blood clots **larger than a quarter / golf ball**.
2. **Acute Severe Lower Pelvic Pain:**
   - Sudden, sharp, knife-like pain localized to one side of the lower abdomen (high risk for **Ruptured Ectopic Pregnancy** or **Ovarian Torsion**).
3. **Bleeding or Spotting During Pregnancy:**
   - Any vaginal bleeding during pregnancy must be evaluated urgently by an obstetrician.
4. **Septic / Pelvic Infection Warning Signs:**
   - Fever (>101°F / 38.3°C) accompanied by foul-smelling vaginal discharge and deep pelvic tenderness.
5. **Signs of Hypovolemic Shock:**
   - Sudden dizziness, lightheadedness upon standing, confusion, cold clammy extremities, or fainting (*syncope*).

---

### Emergency Contacts & Helplines (India):
- **National Emergency Ambulance:** **112** or **102**
- **National Women's Helpline:** **1091**
- **Disaster/Medical Helpline:** **108**

Please proceed to the nearest multi-specialty hospital emergency department or maternity emergency ward immediately.`,
    hindiContent: `🚨 **आपातकालीन चिकित्सा चेतावनी: तुरंत नजदीकी अस्पताल जाएं**

आपके द्वारा बताए गए लक्षणों के लिए तुरंत अस्पताल या आपातकालीन चिकित्सक (Casualty/Emergency) से संपर्क करना अनिवार्य है।

---

### तुरंत अस्पताल जाने के लक्षण:
1. **अत्यधिक रक्तस्राव:** लगातार 2 घंटे तक हर घंटे 2 या अधिक पैड पूरी तरह भीगना, या बड़े खून के थक्के आना।
2. **पेट में अचानक असहनीय दर्द:** विशेषकर पेट के एक तरफ तेज छुरा घोंपने जैसा दर्द (एक्टोपिक प्रेगनेंसी या ओवेरियन टॉर्शन का खतरा)।
3. **गर्भावस्था में रक्तस्राव (Bleeding):** प्रेगनेंसी में कोई भी ब्लीडिंग तुरंत डॉक्टर को दिखानी चाहिए।
4. **तेज बुखार के साथ पेल्विक दर्द व बदबूदार डिस्चार्ज।**
5. **चक्कर आकर बेहोश होना या बहुत कमजोरी महसूस होना।**

---

### आपातकालीन नंबर (भारत):
- **एम्बुलेंस:** **112** / **102** / **108**
- **महिला सुरक्षा हेल्पलाइन:** **1091**
कृपया बिना समय गंवाए निकटतम अस्पताल के इमरजेंसी विभाग में जाएं।`,
    suggestions: [
      "Where is the nearest 24/7 maternity hospital?",
      "What key medical details should I report to the ER doctor?",
      "How to position a patient who is dizzy from bleeding?"
    ]
  }
];
