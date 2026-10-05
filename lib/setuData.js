/**
 * Setu Health — Core Data Store & FHIR R4-Aligned Mock Database
 * Region: Maharashtra Health Network (Mumbai, Pune, Palghar, Navi Mumbai)
 * Covers: Tertiary Medical Colleges, District Civil Hospitals, Rural PHC/CHCs & Jan Aushadhi Pharmacies
 */

export const PILOT_REGION = {
  name: "Maharashtra Healthcare Network",
  district: "Mumbai, Pune, Palghar & Kolhapur Districts",
  state: "Maharashtra",
  villages: [
    "Palghar", "Jawhar", "Mokhada", "Wada",
    "Wagholi", "Panhala", "Shiroli", "Kagal"
  ],
  populationCoverage: 48500,
  languages: [
    { code: "en", name: "English" },
    { code: "hi", name: "हिन्दी (Hindi)" }
  ]
};

// Low-Literacy Iconic Sequence Elements for PIN/Icon Auth (§3.1)
export const AUTH_ICONS = [
  { id: "cow", symbol: "🐄", label: "Cow" },
  { id: "diya", symbol: "🪔", label: "Diya" },
  { id: "peacock", symbol: "🦚", label: "Peacock" },
  { id: "tractor", symbol: "🚜", label: "Tractor" },
  { id: "tree", symbol: "🌳", label: "Tree" },
  { id: "sun", symbol: "☀️", label: "Sun" },
  { id: "wheat", symbol: "🌾", label: "Wheat" },
  { id: "flower", symbol: "🌸", label: "Flower" }
];

// FHIR R4: Location & Organization (Facility Directory - §3.4)
// Exclusively verified hospitals, health centres, and clinics located in Maharashtra
export const FACILITIES = [
  {
    id: "fac-1",
    resourceType: "Location",
    name: "KEM Hospital & Seth GS Medical College",
    nameHi: "केईएम अस्पताल एवं सेठ जीएस मेडिकल कॉलेज",
    type: "Tertiary Care Hospital & Medical College",
    district: "Mumbai",
    state: "Maharashtra",
    distanceKm: 4.2,
    travelTimeMinutes: 20,
    landmark: "Acharya Donde Marg, Parel, Mumbai, Maharashtra",
    landmarkHi: "आचार्य दोंदे मार्ग, परेल, मुंबई, महाराष्ट्र",
    coordinates: { lat: 19.0024, lng: 72.8427 },
    operatingHours: "24x7 Emergency; OPD 8:00 AM - 2:00 PM",
    typicalWaitMinutes: 30,
    phone: "+91 22 2410 7000",
    services: [
      "24x7 Emergency & Trauma Care",
      "Maternal & High-Risk Obstetric Delivery Unit",
      "Neonatal Intensive Care Unit (NICU)",
      "Comprehensive Diagnostic Pathology & Radiology",
      "Specialty Clinics: Oncology, Cardiology & Gynecology"
    ],
    doctorsAvailable: [
      { name: "Dr. Snehal Shinde, MBBS, MS (Obs/Gyn)", specialty: "Obstetrics & Maternal Health" },
      { name: "Dr. Pravin Kulkarni, MD (Internal Medicine)", specialty: "General Medicine" }
    ],
    bedsAvailable: 1800,
    ambulanceStationed: true
  },
  {
    id: "fac-2",
    resourceType: "Location",
    name: "Sassoon General Hospital & B.J. Govt Medical College",
    nameHi: "ससून जनरल अस्पताल एवं बी.जे. मेडिकल कॉलेज",
    type: "Government Medical College Hospital",
    district: "Pune",
    state: "Maharashtra",
    distanceKm: 5.6,
    travelTimeMinutes: 25,
    landmark: "Near Pune Railway Station, Sassoon Road, Pune, Maharashtra",
    landmarkHi: "पुणे रेलवे स्टेशन के पास, ससून रोड, पुणे, महाराष्ट्र",
    coordinates: { lat: 18.5262, lng: 73.8736 },
    operatingHours: "24x7 Emergency; OPD 8:30 AM - 1:30 PM",
    typicalWaitMinutes: 25,
    phone: "+91 20 2612 8000",
    services: [
      "24x7 Maternal & Neonatal Emergency Care",
      "Pediatrics OPD & Routine Child Immunization",
      "Anemia Screening & Blood Bank Facility",
      "Dialysis & Multi-Specialty Consultation"
    ],
    doctorsAvailable: [
      { name: "Dr. Rajesh Deshmukh, MBBS, DNB", specialty: "Maternal & Child Health" },
      { name: "Dr. Meera Joshi, MBBS, MD", specialty: "Pediatrics & Neonatology" }
    ],
    bedsAvailable: 1290,
    ambulanceStationed: true
  },
  {
    id: "fac-3",
    resourceType: "Location",
    name: "District Civil Hospital & Maternal Care Unit",
    nameHi: "जिला सिविल अस्पताल एवं मातृ सेवा केंद्र",
    type: "District Civil Hospital",
    district: "Palghar",
    state: "Maharashtra",
    distanceKm: 6.8,
    travelTimeMinutes: 22,
    landmark: "Opposite District Sessions Court, Tembhode Road, Palghar West, Maharashtra",
    landmarkHi: "जिला सत्र न्यायालय के सामने, तेंभोडे रोड, पालघर पश्चिम, महाराष्ट्र",
    coordinates: { lat: 19.6967, lng: 72.7655 },
    operatingHours: "24x7 Emergency; OPD 9:00 AM - 2:00 PM",
    typicalWaitMinutes: 20,
    phone: "+91 2525 252102",
    services: [
      "24x7 Emergency Obstetric Care & Institutional Deliveries",
      "Malnutrition Treatment Centre (MTC)",
      "Ultrasonography, X-Ray & Comprehensive Lab (CBC, Hb)",
      "Tuberculosis & Malaria Rapid Screening Centre"
    ],
    doctorsAvailable: [
      { name: "Dr. Vaibhav Patil, MBBS, MS", specialty: "General & Emergency Surgery" },
      { name: "Dr. Supriya Gawande, MBBS, DGO", specialty: "Gynecology & Antenatal Care" }
    ],
    bedsAvailable: 200,
    ambulanceStationed: true
  },
  {
    id: "fac-4",
    resourceType: "Location",
    name: "Sub-District Hospital Jawhar",
    nameHi: "उप-जिला अस्पताल जव्हार",
    type: "Sub-District Hospital",
    district: "Palghar",
    state: "Maharashtra",
    distanceKm: 14.5,
    travelTimeMinutes: 40,
    landmark: "Near Jawhar ST Bus Depot, Palace Road, Jawhar, Maharashtra",
    landmarkHi: "जव्हार एसटी बस डिपो के पास, पैलेस रोड, जव्हार, महाराष्ट्र",
    coordinates: { lat: 19.9142, lng: 73.2325 },
    operatingHours: "24x7 Emergency; OPD 9:00 AM - 1:00 PM",
    typicalWaitMinutes: 15,
    phone: "+91 2520 222415",
    services: [
      "24x7 Normal & Assisted Deliveries",
      "Tribal Malnutrition & Pediatric Rehabilitation",
      "Routine Childhood Immunization",
      "Emergency Ambulance & Tele-Referral to Palghar Civil"
    ],
    doctorsAvailable: [
      { name: "Dr. Amol Jadhav, MBBS, DCH", specialty: "Pediatrics & Child Health" },
      { name: "Dr. Sunita Kadam, BAMS", specialty: "Medical Officer" }
    ],
    bedsAvailable: 100,
    ambulanceStationed: true
  },
  {
    id: "fac-5",
    resourceType: "Location",
    name: "Arogya Mandir Primary Health Centre (PHC)",
    nameHi: "आरोग्य मंदिर प्राथमिक स्वास्थ्य केंद्र (PHC)",
    type: "Primary Health Centre (PHC)",
    district: "Palghar",
    state: "Maharashtra",
    distanceKm: 8.4,
    travelTimeMinutes: 30,
    landmark: "Opposite Panchayat Samiti Office, Nashik Highway, Mokhada, Maharashtra",
    landmarkHi: "पंचायत समिति कार्यालय के सामने, नासिक हाईवे, मोखाडा, महाराष्ट्र",
    coordinates: { lat: 19.9367, lng: 73.3401 },
    operatingHours: "Mon-Sat 8:30 AM - 4:30 PM; Emergency on-call",
    typicalWaitMinutes: 10,
    phone: "+91 2520 244220",
    services: [
      "Antenatal Care (ANC Checkups & Weight Monitoring)",
      "Free Iron-Folic Acid & Calcium Supplement Distribution",
      "Fever & Malaria Rapid Diagnostic Testing (RDT)",
      "First Aid, Triage & Direct Tele-escalation"
    ],
    doctorsAvailable: [
      { name: "Dr. Nitin More, MBBS", specialty: "Medical Officer (Rural Health)" }
    ],
    bedsAvailable: 12,
    ambulanceStationed: false
  },
  {
    id: "fac-6",
    resourceType: "Location",
    name: "Wagholi Community Health Centre (CHC)",
    nameHi: "वाघोली सामुदायिक स्वास्थ्य केंद्र (CHC)",
    type: "Community Health Centre",
    district: "Pune",
    state: "Maharashtra",
    distanceKm: 11.2,
    travelTimeMinutes: 32,
    landmark: "Pune-Nagar Highway, Near Wagholi Gram Panchayat, Pune, Maharashtra",
    landmarkHi: "पुणे-नगर हाईवे, वाघोली ग्राम पंचायत के पास, पुणे, महाराष्ट्र",
    coordinates: { lat: 18.5793, lng: 73.9806 },
    operatingHours: "24x7 Emergency; OPD 9:00 AM - 3:00 PM",
    typicalWaitMinutes: 20,
    phone: "+91 20 2705 1102",
    services: [
      "Maternal & Child Health OPD",
      "Emergency Minor Operation Theatre",
      "Blood Sugar, Hemoglobin & Urine Diagnostics",
      "Free Government Medicine Dispensary"
    ],
    doctorsAvailable: [
      { name: "Dr. Ganesh Shinde, MBBS", specialty: "Community Health Medical Officer" }
    ],
    bedsAvailable: 30,
    ambulanceStationed: true
  },
  {
    id: "fac-7",
    resourceType: "Location",
    name: "Tata Memorial Centre - ACTREC",
    nameHi: "टाटा मेमोरियल सेंटर - ACTREC",
    type: "Specialized Cancer Hospital & Research Centre",
    district: "Navi Mumbai",
    state: "Maharashtra",
    distanceKm: 16.0,
    travelTimeMinutes: 35,
    landmark: "Sector 22, Kharghar, Navi Mumbai, Maharashtra",
    landmarkHi: "सेक्टर 22, खारघर, नवी मुंबई, महाराष्ट्र",
    coordinates: { lat: 19.0350, lng: 73.0722 },
    operatingHours: "Mon-Sat 8:00 AM - 5:00 PM; Emergency 24x7",
    typicalWaitMinutes: 30,
    phone: "+91 22 2740 5000",
    services: [
      "Early Screening for Cervical & Oral Cancers",
      "Specialized Women's Oncology Consultation",
      "Advanced Diagnostic Biopsy & Mammography",
      "Daycare Chemotherapy & Preventive Counselling"
    ],
    doctorsAvailable: [
      { name: "Dr. Arvind Salve, MD, DM", specialty: "Medical Oncology" },
      { name: "Dr. Neha Thakur, MS, MCh", specialty: "Surgical Oncology" }
    ],
    bedsAvailable: 500,
    ambulanceStationed: true
  },
  {
    id: "fac-8",
    resourceType: "Location",
    name: "Pradhan Mantri Jan Aushadhi Kendra (Dadar)",
    nameHi: "प्रधानमंत्री जन औषधि केंद्र (दादर)",
    type: "Affordable Pharmacy",
    district: "Mumbai",
    state: "Maharashtra",
    distanceKm: 4.8,
    travelTimeMinutes: 18,
    landmark: "Opposite Dadar Western Railway Station, Senapati Bapat Marg, Mumbai, Maharashtra",
    landmarkHi: "दादर पश्चिम रेलवे स्टेशन के सामने, सेनापति बापट मार्ग, मुंबई, महाराष्ट्र",
    coordinates: { lat: 19.0178, lng: 72.8478 },
    operatingHours: "8:00 AM - 9:00 PM Daily",
    typicalWaitMinutes: 5,
    phone: "+91 22 2422 1890",
    services: [
      "Subsidized High-Quality Generic Medicines (50% to 90% savings)",
      "Maternal Nutritional Supplements (Iron, Calcium, Folic Acid)",
      "Oxytocin & Essential Maternity Delivery Supplies",
      "Sanitary Pads, First Aid Kits & ORS Packets"
    ],
    doctorsAvailable: [],
    bedsAvailable: 0,
    ambulanceStationed: false
  },
  {
    id: "fac-9",
    resourceType: "Location",
    name: "Pradhan Mantri Jan Aushadhi Kendra (FC Road)",
    nameHi: "प्रधानमंत्री जन औषधि केंद्र (एफसी रोड)",
    type: "Affordable Pharmacy",
    district: "Pune",
    state: "Maharashtra",
    distanceKm: 6.2,
    travelTimeMinutes: 20,
    landmark: "Deccan Gymkhana, FC Road, Shivajinagar, Pune, Maharashtra",
    landmarkHi: "डेक्कन जिमखाना, एफसी रोड, शिवाजीनगर, पुणे, महाराष्ट्र",
    coordinates: { lat: 18.5186, lng: 73.8415 },
    operatingHours: "8:30 AM - 8:30 PM Daily",
    typicalWaitMinutes: 5,
    phone: "+91 20 2567 4321",
    services: [
      "Subsidized Chronic Illness Medicines (Diabetes, Hypertension)",
      "Prenatal & Postnatal Multivitamin Formulations",
      "Infant Rehydration Salts & Zinc Drops",
      "Standard First-Aid & Surgical Dressings"
    ],
    doctorsAvailable: [],
    bedsAvailable: 0,
    ambulanceStationed: false
  },
  {
    id: "fac-10",
    resourceType: "Location",
    name: "Chhatrapati Pramila Raje (CPR) Hospital & RCSM Govt Medical College",
    nameHi: "छत्रपति प्रमिला राजे (सीपीआर) अस्पताल एवं मेडिकल कॉलेज",
    type: "Government Medical College Hospital",
    district: "Kolhapur",
    state: "Maharashtra",
    distanceKm: 5.1,
    travelTimeMinutes: 20,
    landmark: "Near Dasara Chowk, Bhausingji Road, Kolhapur, Maharashtra",
    landmarkHi: "दसरा चौक के पास, भावसिंगजी रोड, कोल्हापुर, महाराष्ट्र",
    coordinates: { lat: 16.7028, lng: 74.2255 },
    operatingHours: "24x7 Emergency; OPD 8:30 AM - 1:30 PM",
    typicalWaitMinutes: 25,
    phone: "+91 231 264 1583",
    services: [
      "24x7 Emergency & Trauma Centre",
      "Maternal Delivery Suite & High-Risk Obstetric Care",
      "Sick Newborn Care Unit (SNCU) & Pediatric ICU",
      "Advanced Diagnostics: CT Scan, Ultrasonography & CBC Lab",
      "Specialty Clinics: Gynecology, Pediatrics & Orthopedics"
    ],
    doctorsAvailable: [
      { name: "Dr. Vijay Shinde, MS (Obs/Gyn)", specialty: "Obstetrics & High-Risk Pregnancy" },
      { name: "Dr. Sujata Mane, MD (Pediatrics)", specialty: "Neonatology & Child Health" }
    ],
    bedsAvailable: 850,
    ambulanceStationed: true
  },
  {
    id: "fac-11",
    resourceType: "Location",
    name: "D. Y. Patil Medical College Hospital & Research Centre",
    nameHi: "डी. वाई. पाटिल मेडिकल कॉलेज अस्पताल एवं रिसर्च सेंटर",
    type: "Multispecialty Teaching Hospital",
    district: "Kolhapur",
    state: "Maharashtra",
    distanceKm: 7.4,
    travelTimeMinutes: 24,
    landmark: "Kasaba Bawada Road, Line Bazar, Kolhapur, Maharashtra",
    landmarkHi: "कसबा बावडा रोड, लाइन बाजार, कोल्हापुर, महाराष्ट्र",
    coordinates: { lat: 16.7314, lng: 74.2501 },
    operatingHours: "24x7 Emergency & Inpatient; OPD 9:00 AM - 4:00 PM",
    typicalWaitMinutes: 15,
    phone: "+91 231 260 1234",
    services: [
      "24x7 Critical Care & Neonatal ICU",
      "Maternal-Fetal Medicine & Advanced Sonography",
      "Pediatric Care & Specialized Surgical Ward",
      "Comprehensive Cardiology, Dialysis & Preventive Health Checks"
    ],
    doctorsAvailable: [
      { name: "Dr. Ashok Patil, MD (Internal Medicine)", specialty: "General & Critical Medicine" },
      { name: "Dr. Anjali Deshpande, MS (Obs/Gyn)", specialty: "Maternal Health & Laparoscopy" }
    ],
    bedsAvailable: 650,
    ambulanceStationed: true
  },
  {
    id: "fac-12",
    resourceType: "Location",
    name: "Panhala Rural Sub-District Hospital & Maternal Clinic",
    nameHi: "पन्हाळा ग्रामीण उप-जिला अस्पताल एवं मातृ सेवा केंद्र",
    type: "Sub-District Hospital & Clinic",
    district: "Kolhapur",
    state: "Maharashtra",
    distanceKm: 18.2,
    travelTimeMinutes: 38,
    landmark: "Near Panhala ST Bus Stand, Tabak Udyan Road, Panhala, Kolhapur, Maharashtra",
    landmarkHi: "पन्हाळा एसटी बस स्टैंड के पास, तबक उद्यान रोड, पन्हाळा, कोल्हापुर, महाराष्ट्र",
    coordinates: { lat: 16.8123, lng: 74.1168 },
    operatingHours: "24x7 Emergency; OPD 9:00 AM - 2:00 PM",
    typicalWaitMinutes: 15,
    phone: "+91 2328 235122",
    services: [
      "24x7 Normal & Assisted Deliveries",
      "Antenatal (ANC) Checkups & Postnatal Follow-ups",
      "Emergency First Aid, Triage & Stabilization",
      "Childhood Routine Immunization & Vitamin A Administration"
    ],
    doctorsAvailable: [
      { name: "Dr. Sachin Kamble, MBBS, DGO", specialty: "Gynecologist & Medical Superintendent" }
    ],
    bedsAvailable: 50,
    ambulanceStationed: true
  },
  {
    id: "fac-13",
    resourceType: "Location",
    name: "Arogya Mandir Primary Health Centre (PHC), Shiroli",
    nameHi: "आरोग्य मंदिर प्राथमिक स्वास्थ्य केंद्र (PHC), शिरोली",
    type: "Primary Health Centre (PHC)",
    district: "Kolhapur",
    state: "Maharashtra",
    distanceKm: 9.0,
    travelTimeMinutes: 22,
    landmark: "Near Shiroli Gram Panchayat, NH48 Old Highway, Shiroli Pulachi, Kolhapur, Maharashtra",
    landmarkHi: "शिरोली ग्राम पंचायत के पास, पुराना हाईवे, शिरोली पुलाची, कोल्हापुर, महाराष्ट्र",
    coordinates: { lat: 16.7495, lng: 74.2755 },
    operatingHours: "Mon-Sat 8:30 AM - 4:30 PM; Emergency on-call",
    typicalWaitMinutes: 10,
    phone: "+91 231 246 8110",
    services: [
      "Antenatal Care (ANC) & Maternal Nutrition Counselling",
      "Free Iron-Folic Acid (IFA) & Calcium Supplement Dispensing",
      "Infant Growth Monitoring & Complete Routine Immunization",
      "Fever, Malaria & Water-borne Infection Screening"
    ],
    doctorsAvailable: [
      { name: "Dr. Priya Powar, MBBS", specialty: "Medical Officer (Rural Community Health)" }
    ],
    bedsAvailable: 10,
    ambulanceStationed: false
  },
  {
    id: "fac-14",
    resourceType: "Location",
    name: "Pradhan Mantri Jan Aushadhi Kendra (Mahadwar Road)",
    nameHi: "प्रधानमंत्री जन औषधि केंद्र (महाद्वार रोड, कोल्हापुर)",
    type: "Affordable Pharmacy",
    district: "Kolhapur",
    state: "Maharashtra",
    distanceKm: 4.5,
    travelTimeMinutes: 15,
    landmark: "Mahadwar Road, Near Mahalaxmi Temple, Kolhapur, Maharashtra",
    landmarkHi: "महाद्वार रोड, महालक्ष्मी मंदिर के पास, कोल्हापुर, महाराष्ट्र",
    coordinates: { lat: 16.6946, lng: 74.2238 },
    operatingHours: "8:00 AM - 9:00 PM Daily",
    typicalWaitMinutes: 5,
    phone: "+91 231 254 7890",
    services: [
      "Subsidized Essential Generic Medications (up to 90% savings)",
      "Prenatal, Lactation & Pediatric Multivitamin Formulations",
      "Chronic Disease Care: Blood Pressure & Diabetes Maintenance",
      "Sanitary Pads, First Aid Kits & ORS Rehydration Packs"
    ],
    doctorsAvailable: [],
    bedsAvailable: 0,
    ambulanceStationed: false
  }
];

// FHIR R4: Initial Household & Patient Profiles (§3.1, §3.8)
export const INITIAL_HOUSEHOLD = {
  householdId: "hh-84321",
  headName: "Rameshwar Oraon",
  primaryPhone: "9876543210",
  village: "Banari, Bishunpur",
  rationCardNo: "JH-GUM-882194",
  authPin: "1234",
  authIconSequence: ["cow", "diya", "peacock", "tractor"],
  consentStatus: {
    consentVersion: "v1.2-DPDP-2023",
    grantedAt: "2026-09-01T10:00:00Z",
    purpose: ["triage", "care-coordination", "offline-sync"],
    revocable: true
  },
  members: [
    {
      id: "pat-101",
      resourceType: "Patient",
      name: "Pooja Devi",
      relationship: "Self (Mother)",
      age: 26,
      gender: "female",
      bloodGroup: "B+",
      abhaId: "91-4432-8819-2041",
      pregnant: true,
      gestationalWeeks: 22,
      lastLmp: "2026-04-28",
      primaryCHW: "Kanti Devi (ASHA worker)",
      conditions: [
        {
          code: "O26.8",
          display: "Mild Gestational Anemia (Hb 10.2 g/dL)",
          clinicalStatus: "active",
          recordedDate: "2026-08-14"
        }
      ],
      observations: [
        { date: "2026-09-15", code: "Hemoglobin", value: "10.2", unit: "g/dL", status: "borderline" },
        { date: "2026-09-15", code: "Blood Pressure", value: "116/74", unit: "mmHg", status: "normal" },
        { date: "2026-09-15", code: "Fetal Heart Rate", value: "144", unit: "bpm", status: "normal" }
      ],
      carePlan: [
        { activity: "Daily IFA (Iron-Folic Acid) Tablet", frequency: "1 tablet after dinner with lemon water" },
        { activity: "Calcium 500mg Tablet", frequency: "1 tablet after breakfast (never with iron)" },
        { activity: "Next ANC-3 Checkup at KEM Hospital, Mumbai", dueDate: "2026-10-15" }
      ]
    },
    {
      id: "pat-102",
      resourceType: "Patient",
      name: "Rameshwar Oraon",
      relationship: "Husband / Household Head",
      age: 30,
      gender: "male",
      bloodGroup: "O+",
      abhaId: "91-7712-4431-9012",
      pregnant: false,
      primaryCHW: "Kanti Devi (ASHA)",
      conditions: [],
      observations: [
        { date: "2026-07-10", code: "Blood Pressure", value: "122/80", unit: "mmHg", status: "normal" }
      ],
      carePlan: []
    },
    {
      id: "pat-103",
      resourceType: "Patient",
      name: "Aman Oraon",
      relationship: "Child (Son)",
      age: 3,
      gender: "male",
      bloodGroup: "B+",
      abhaId: "91-1123-5567-3341",
      pregnant: false,
      primaryCHW: "Kanti Devi (ASHA)",
      conditions: [],
      observations: [
        { date: "2026-08-20", code: "Weight", value: "13.8", unit: "kg", status: "normal" },
        { date: "2026-08-20", code: "Height", value: "94", unit: "cm", status: "normal" }
      ],
      carePlan: [
        { activity: "Vitamin A bi-annual dose", dueDate: "2026-11-10" }
      ]
    }
  ]
};

// FHIR R4: Appointments Mock Store (§3.3)
export const INITIAL_APPOINTMENTS = [
  {
    id: "apt-501",
    resourceType: "Appointment",
    patientId: "pat-101",
    patientName: "Pooja Devi",
    facilityId: "fac-1",
    facilityName: "KEM Hospital & Seth GS Medical College, Mumbai",
    serviceType: "Antenatal Care (ANC Visit 3)",
    clinician: "Dr. Snehal Shinde (Gyn/Obs)",
    dateTime: "2026-10-15T10:00:00",
    status: "booked",
    channel: "app",
    reminderSentT24: false,
    reminderSentT2: false,
    syncStatus: "synced"
  },
  {
    id: "apt-502",
    resourceType: "Appointment",
    patientId: "pat-103",
    patientName: "Aman Oraon",
    facilityId: "fac-3",
    facilityName: "District Civil Hospital, Palghar",
    serviceType: "Childhood Growth & Immunization",
    clinician: "Dr. Supriya Gawande (Gynecology & Child Health)",
    dateTime: "2026-10-20T11:30:00",
    status: "booked",
    channel: "sms",
    reminderSentT24: false,
    reminderSentT2: false,
    syncStatus: "synced"
  }
];

// Clinical Triage Decision Tree & Red-Flag Rules (§3.5)
export const TRIAGE_RULES = [
  {
    id: "obstetric_hemorrhage",
    category: "Maternal Emergency",
    redFlag: true,
    condition: "Vaginal bleeding during pregnancy OR soaking >=2 pads/hr",
    triggers: ["bleeding pregnant", "soaking pad", "khoon beh raha", "garbh me bleeding"],
    outputLevel: "urgent_care_emergency",
    plainLanguageReason: "Heavy bleeding in pregnancy or soaking 2+ pads/hr indicates possible placenta issue, miscarriage, or severe hemorrhage requiring emergency transfusion readiness.",
    plainLanguageReasonHi: "गर्भावस्था में रक्तस्राव या 2 से अधिक पैड भीगना अत्यधिक रक्तहानि का संकेत है। तुरंत एम्बुलेंस और अस्पताल की आवश्यकता है।",
    recommendedAction: "Call 112 / 102 immediately. Do NOT take home medicines. Keep patient lying down with legs elevated.",
    recommendedActionHi: "तुरंत 112 या 102 पर कॉल करें। कोई घरेलू दवा न दें। मरीज को सीधा लिटाकर पैर थोड़े ऊपर रखें।",
    escalateToClinician: true
  },
  {
    id: "severe_chest_pain_breathless",
    category: "Cardiovascular / Respiratory",
    redFlag: true,
    condition: "Crushing chest pain radiating to jaw/arm OR severe breathlessness at rest",
    triggers: ["chest pain", "breathless", "seene me dard", "saans lene me takleef"],
    outputLevel: "urgent_care_emergency",
    plainLanguageReason: "Sudden central chest pain or gasping for breath can signify acute coronary event or severe lung infection.",
    plainLanguageReasonHi: "सीने में तेज दबाव या सांस फूलना हृदय या गंभीर फेफड़ों के संक्रमण का संकेत हो सकता है।",
    recommendedAction: "Urgent transfer to nearest District Hospital / KEM / Sassoon emergency ward. Administer Sorbitrate/Aspirin only if previously prescribed by doctor.",
    recommendedActionHi: "तुरंत नजदीकी जिला अस्पताल या आपातकालीन वार्ड ले जाएं।",
    escalateToClinician: true
  },
  {
    id: "infant_fever_lethargy",
    category: "Pediatric Risk",
    redFlag: true,
    condition: "Infant under 6 months with high fever (>101F), refusal to feed, or groaning",
    triggers: ["baby fever", "bachha doodh nahi pee raha", "infant fever", "bachhe ko tez bukhar"],
    outputLevel: "urgent_care_emergency",
    plainLanguageReason: "Young infants deteriorate rapidly from systemic infections; refusal to feed is a clinical danger sign.",
    plainLanguageReasonHi: "छोटे बच्चे में तेज बुखार और दूध न पीना गंभीर संक्रमण का संकेत है।",
    recommendedAction: "Take baby to nearest Health Centre immediately. Continue breastfeeding if possible.",
    recommendedActionHi: "बच्चे को तुरंत नजदीकी स्वास्थ्य केंद्र ले जाएं। यदि संभव हो तो स्तनपान जारी रखें।",
    escalateToClinician: true
  },
  {
    id: "prolonged_fever_chills_malaria",
    category: "Endemic Infection",
    redFlag: false,
    condition: "Fever with shivering/rigors for >2 days in malaria-endemic tribal zone",
    triggers: ["fever chills", "bukhar sardi", "shivering fever", "malaria"],
    outputLevel: "suggested_clinic_visit",
    plainLanguageReason: "Fever with alternate-day chills frequently points to Plasmodium malaria, dengue or viral fever requiring blood testing.",
    plainLanguageReasonHi: "कंपकंपी के साथ बुखार मलेरिया या डेंगू का संकेत हो सकता है। खून की जांच (RDT) जरूरी है।",
    recommendedAction: "Visit your nearest Maharashtra PHC or Civil Hospital for Rapid Diagnostic Test (RDT) and blood smear for malaria. Drink boiled ORS water.",
    recommendedActionHi: "नजदीकी प्राथमिक स्वास्थ्य केंद्र जाकर मलेरिया व रक्त की जांच कराएं। ओआरएस और उबला पानी पिएं।",
    escalateToClinician: true
  },
  {
    id: "mild_period_cramps",
    category: "Gynecological Routine",
    redFlag: false,
    condition: "Regular cyclical lower abdominal discomfort during first 2 days of period",
    triggers: ["period cramp", "period pain", "mahavari dard", "dard period"],
    outputLevel: "self_care_guidance",
    plainLanguageReason: "Mild uterine contractions caused by normal prostaglandins during menses.",
    plainLanguageReasonHi: "पीरियड्स के पहले 2 दिनों में हल्का दर्द गर्भाशय के संकुचन के कारण सामान्य है।",
    recommendedAction: "Use warm water bag on lower abdomen. Drink ginger/fennel tea. Eat soaked raisins and pumpkin seeds.",
    recommendedActionHi: "पेट के निचले हिस्से पर गर्म पानी की सिकाई करें। अदरक-सौंफ की चाय पिएं।",
    escalateToClinician: false
  },
  {
    id: "mild_anemia_fatigue",
    category: "Nutritional Deficiency",
    redFlag: false,
    condition: "General tiredness, pale inner eyelids, sluggishness without fever",
    triggers: ["tiredness", "fatigue", "thakan", "kamzori", "anemia", "khoon ki kami"],
    outputLevel: "suggested_clinic_visit",
    plainLanguageReason: "Gradual reduction in red blood cells or iron stores common in reproductive-age rural women.",
    plainLanguageReasonHi: "थकान और कमजोरी आयरन की कमी और कम हीमोग्लोबिन के लक्षण हो सकते हैं।",
    recommendedAction: "Get a free Hemoglobin check at your Anganwadi / Sub-Centre. Consume moringa (sahjan) leaves, black chana, and jaggery.",
    recommendedActionHi: "आंगनवाड़ी या उप-केंद्र पर हीमोग्लोबिन टेस्ट कराएं। सहजन (मुनगा) की पत्तियां, चना और गुड़ खाएं।",
    escalateToClinician: true
  }
];

// Health Education Categorized Videos (§3.2)
export const EDUCATION_LIBRARY = [
  {
    id: "edu-1",
    title: "Understanding Your Menstrual Cycle & Hygiene",
    titleHi: "माहवारी चक्र और स्वच्छता की सही जानकारी",
    category: "Menstrual Health",
    duration: "4:12 min",
    offlineSizeMb: 12.4,
    voiceNarration: true,
    languages: ["hi", "en"],
    summary: "Clear guide on what is normal, pad changing rules, and preventing pad rashes and pelvic infections.",
    summaryHi: "माहवारी में क्या सामान्य है, पैड बदलने का सही समय और संक्रमण से बचाव के आसान नियम।",
    keyPoints: [
      "Change pads every 4 to 6 hours",
      "Wash only external intimate skin with plain clean water",
      "Pain so severe that daily work stops requires doctor checkup"
    ],
    videoUrl: "https://www.youtube.com/embed/vXnqW_KOYRg"
  },
  {
    id: "edu-2",
    title: "Maternal Care & 4 Vital ANC Visits",
    titleHi: "गर्भावस्था में 4 जरूरी जांच (ANC) और पोषण",
    category: "Maternal Health",
    duration: "5:30 min",
    offlineSizeMb: 15.8,
    voiceNarration: true,
    languages: ["hi", "en"],
    summary: "Why every pregnant mother must complete at least 4 ANC visits, ultrasound timing, and kick counts.",
    summaryHi: "हर गर्भवती मां के लिए 4 एएनसी जांच, अल्ट्रासाउंड और शिशु की हलचल गिनने की विधि।",
    keyPoints: [
      "Folic acid in first 3 months prevents spine defects",
      "Take Iron and Calcium at separate meal times",
      "Monitor for at least 10 baby kicks in 2 hours in 3rd trimester"
    ],
    videoUrl: "https://www.youtube.com/embed/1DwUtdU5TfU"
  },
  {
    id: "edu-3",
    title: "Fighting Anemia with Local Forest & Farm Foods",
    titleHi: "सहजन, महुआ और रागी से खून की कमी (एनीमिया) दूर करें",
    category: "Nutrition",
    duration: "3:45 min",
    offlineSizeMb: 9.6,
    voiceNarration: true,
    languages: ["hi", "en"],
    summary: "Low-cost local nutrition: drumstick leaves (sahjan), finger millet (marua/ragi), black gram, and amla.",
    summaryHi: "सस्ते स्थानीय पोषण: सहजन के पत्ते, मड़ुआ (रागी), कुल्थी की दाल और आंवला से हीमोग्लोबिन बढ़ाएं।",
    keyPoints: [
      "Squeeze fresh lemon on dal to triple iron absorption",
      "Do not drink tea with meals (tea destroys absorbed iron)",
      "Cook in traditional iron kadai (cast iron skillet)"
    ],
    videoUrl: "https://www.youtube.com/embed/y0P4WcXDs80"
  },
  {
    id: "edu-4",
    title: "Cancer Awareness: Early Signs in Women",
    titleHi: "महिला कैंसर जागरूकता: शुरुआती लक्षण व स्क्रीनिंग",
    category: "Cancer Awareness",
    duration: "6:10 min",
    offlineSizeMb: 18.2,
    voiceNarration: true,
    languages: ["hi", "en"],
    summary: "Simple signs of breast lumps, unusual bleeding after menopause, and free VIA testing at government CHCs.",
    summaryHi: "स्तन में गांठ की पहचान, माहवारी बंद होने के बाद ब्लीडिंग, और सरकारी अस्पताल में मुफ्त जांच।",
    keyPoints: [
      "Monthly self breast examination after periods",
      "Any bleeding after menopause must be examined by a doctor",
      "Oral white patches from khaini/tobacco need immediate biopsy"
    ],
    videoUrl: "https://www.youtube.com/embed/vXnqW_KOYRg"
  }
];

// Localized Nutrition Guidance (§3.7)
export const LOCAL_NUTRITION_ITEMS = [
  {
    id: "nut-1",
    name: "Moringa / Sahjan Leaves (मुनगा के पत्ते)",
    category: "Superfood Green",
    costRating: "Free / Backyard Harvest",
    nutrients: "Iron, Calcium, Vitamin A & C",
    role: "Prevents gestational anemia, boosts breastmilk supply, strengthens child immunity.",
    preparationTip: "Lightly sauté with garlic and mustard oil, or mix powdered leaves into roti dough."
  },
  {
    id: "nut-2",
    name: "Finger Millet / Marua / Ragi (मड़ुआ)",
    category: "Traditional Grain",
    costRating: "Very Affordable",
    nutrients: "High Calcium (344 mg/100g), Fiber, Low Glycemic Index",
    role: "Prevents bone mineral loss during lactation; controls gestational diabetes.",
    preparationTip: "Make marua roti, halwa, or ragi porridge with jaggery."
  },
  {
    id: "nut-3",
    name: "Black Chana & Kulthi Dal (काला चना और कुल्थी)",
    category: "Protein & Iron",
    costRating: "Affordable Staple",
    nutrients: "Protein (20g/100g), Non-Heme Iron, B-complex",
    role: "Builds hemoglobin; repairs maternal postpartum tissue.",
    preparationTip: "Sprout black chana overnight and eat raw with jaggery and a squeeze of fresh lemon."
  },
  {
    id: "nut-4",
    name: "Wild Amla & Forest Berries (जंगली आंवला)",
    category: "Vitamin C Booster",
    costRating: "Wild Forest Harvest",
    nutrients: "Concentrated Vitamin C (600 mg/100g)",
    role: "Multiplies plant iron absorption by 300%; prevents scurvy and gum bleeding in pregnancy.",
    preparationTip: "Consume 1 fresh amla daily or store in salt brine."
  }
];

// Clinician Escalation Tickets Mock Store (§2, §3.5)
export const INITIAL_ESCALATIONS = [
  {
    id: "esc-901",
    patientName: "Pooja Devi",
    village: "Banari",
    age: 26,
    reason: "Mild Gestational Anemia (Hb 10.2 g/dL) at 22 weeks - Review Supplementation",
    urgency: "routine",
    status: "pending_review",
    createdAt: "2026-09-28T09:15:00Z",
    assignedTo: "Dr. Ananya Roy (Gyn/Obs)"
  },
  {
    id: "esc-902",
    patientName: "Sumitra Devi",
    village: "Jobhipat",
    age: 48,
    reason: "Post-menopausal bleeding for 3 days - Suspected Endometrial/Cervical pathology",
    urgency: "urgent",
    status: "in_review",
    createdAt: "2026-09-29T14:30:00Z",
    assignedTo: "Dr. Ananya Roy (Gyn/Obs)"
  }
];

// Program Admin KPIs (§14)
export const INITIAL_KPIS = {
  registeredPatients: 1840,
  pilotTargetPopulation: 3500,
  registrationRatePercent: 52.5,
  falseNegativeRedFlagRate: 0.0, // Strict zero target!
  completedBookingsCount: 412,
  walkInBaselineDifferencePercent: 28.4,
  videoCompletionRatePercent: 68.2,
  offlineSyncSuccessRatePercent: 99.4,
  medianEscalationHours: 14.5,
  consentCompliancePercent: 100.0,
  forumModerationRatePercent: 2.4, // <5% target per Section 15
  channelUsageBreakdown: {
    pwaApp: 58,
    smsUssd: 28,
    ivrVoice: 14
  }
};

// Moderated Community Support Forum (§4, §11)
export const INITIAL_FORUM_POSTS = [
  {
    id: "post-1",
    author: "Sunita Minz (ASHA Facilitator)",
    authorRole: "asha",
    badge: "Verified Community Health Worker",
    cohort: "Palghar & Mokhada Maternal Circle",
    village: "Mokhada",
    timeAgo: "2 hours ago",
    topic: "Maternal Health",
    title: "Tips for taking IFA tablets without nausea",
    titleHi: "बिना उल्टी या मतली के आयरन (IFA) की गोली लेने के सरल उपाय",
    content: "Many mothers in our village complained of mild nausea when taking iron tablets. Please remember: always take IFA after dinner with water or lemon water. Never take with tea, coffee, or milk! If you still feel sick, inform your ASHA worker.",
    contentHi: "हमारे गांव में कई बहनों को आयरन की गोली खाने पर उल्टी या जी मिचलाने की शिकायत होती है। याद रखें: गोली हमेशा रात के खाने के बाद नींबू पानी या सादे पानी से लें। चाय या दूध के साथ कभी न लें।",
    upvotes: 18,
    repliesCount: 2,
    moderationStatus: "approved",
    isEscalatedToDoctor: false,
    replies: [
      {
        id: "rep-1",
        author: "Pooja Devi",
        authorRole: "patient",
        timeAgo: "1 hour ago",
        text: "Thank you Didi! Squeezing half a lemon made a big difference for me.",
        textHi: "धन्यवाद दीदी! नींबू पानी के साथ लेने से अब मुझे कोई परेशानी नहीं होती।"
      },
      {
        id: "rep-2",
        author: "Dr. Snehal Shinde (Obs/Gyn)",
        authorRole: "clinician",
        badge: "Verified Clinician",
        timeAgo: "30 mins ago",
        text: "Excellent guidance, Sunita. Vitamin C in lemon multiplies iron absorption significantly.",
        textHi: "बहुत सही मार्गदर्शन, सुनीता। नींबू का विटामिन सी शरीर में आयरन सोखने की क्षमता को बढ़ाता है।"
      }
    ]
  },
  {
    id: "post-2",
    author: "Radha Kamble",
    authorRole: "patient",
    cohort: "Kolhapur Breastfeeding Circle",
    village: "Panhala",
    timeAgo: "5 hours ago",
    topic: "Infant Care",
    title: "Starting solid foods at 6 months — what local recipes work best?",
    titleHi: "6 महीने बाद शिशु का ऊपरी आहार (अन्नप्राशन) — घर पर क्या बनाएं?",
    content: "My baby turns 6 months next Tuesday. Which local food should I prepare first along with breastfeeding? Any recipes using ragi or dal?",
    contentHi: "मेरी बेटी अगले मंगलवार को 6 महीने की हो रही है। स्तनपान के साथ सबसे पहले घर का क्या आहार शुरू करूं? रागी या दाल की खिचड़ी कैसे बनाएं?",
    upvotes: 12,
    repliesCount: 1,
    moderationStatus: "approved",
    isEscalatedToDoctor: false,
    replies: [
      {
        id: "rep-3",
        author: "Kanti Devi (ASHA)",
        authorRole: "asha",
        badge: "Verified Community Health Worker",
        timeAgo: "3 hours ago",
        text: "Start with soft cooked and mashed Moong dal khichdi with a drop of ghee, and thin Ragi (marua) porridge cooked with boiled water.",
        textHi: "शुरुआत में मूंग दाल और चावल की पतली खिचड़ी को मसलकर थोड़ा घी डालकर दें, या मड़ुआ (रागी) की पतली खीर दें।"
      }
    ]
  },
  {
    id: "post-3",
    author: "Meena Jadhav",
    authorRole: "patient",
    cohort: "Palghar & Mokhada Maternal Circle",
    village: "Jawhar",
    timeAgo: "Yesterday",
    topic: "Nutrition",
    title: "How we grow moringa in our backyard for anemia",
    titleHi: "घर के आंगन में सहजन (मुनगा) लगाकर खून की कमी कैसे दूर करें",
    content: "We planted two moringa drumstick saplings behind our house last monsoon. Now we add fresh leaves to our dal twice every week. My hemoglobin went up from 9.5 to 11.1 g/dL!",
    contentHi: "हमने पिछले साल घर के पीछे सहजन के दो पेड़ लगाए थे। अब हम हफ्ते में दो बार दाल में सहजन के पत्ते डालते हैं। मेरा हीमोग्लोबिन 9.5 से बढ़कर 11.1 हो गया!",
    upvotes: 24,
    repliesCount: 0,
    moderationStatus: "approved",
    isEscalatedToDoctor: false,
    replies: []
  },
  {
    id: "post-4",
    author: "Anonymized Patient",
    authorRole: "patient",
    cohort: "Palghar High-Risk Triage Watch",
    village: "Wada",
    timeAgo: "15 mins ago",
    topic: "Maternal Health",
    title: "Severe headache with blurred vision at 32 weeks pregnancy",
    titleHi: "गर्भावस्था के 8वें महीने में तेज सिरदर्द और आंखों के आगे धुंधलापन",
    content: "I have had severe throbbing headache since morning and seeing flashing spots. My hands feel puffy.",
    contentHi: "सुबह से तेज सिरदर्द हो रहा है और आंखों के सामने धब्बे दिख रहे हैं। हाथों में सूजन भी है।",
    upvotes: 1,
    repliesCount: 1,
    moderationStatus: "flagged_emergency",
    isEscalatedToDoctor: true,
    escalationNote: "🚨 AUTOMATED RED-FLAG SAFETY ALERT: Suspected Pre-eclampsia / High Blood Pressure Emergency. Escalated to Dr. Snehal Shinde & ambulance dispatch.",
    replies: [
      {
        id: "rep-4",
        author: "Setu Safety Bot & Dr. Snehal Shinde",
        authorRole: "system",
        badge: "Automated Clinical Protocol",
        timeAgo: "12 mins ago",
        text: "⚠️ URGENT CLINICAL ALERT: Sudden headache with visual aura in third trimester indicates possible pre-eclampsia. Case escalated to Palghar Civil Hospital emergency desk. Ambulance team notified.",
        textHi: "⚠️ तत्काल चेतावनी: गर्भावस्था के अंतिम महीनों में सिरदर्द व धुंधलापन प्री-एक्लेम्पसिया (उच्च रक्तचाप) का लक्षण हो सकता है। केस तुरंत जिला अस्पताल रेफर किया गया है।"
      }
    ]
  }
];

export const COMMUNITY_GUIDELINES = [
  {
    id: "g1",
    title: "Advisory & Peer Support Only",
    titleHi: "केवल सहकर्मी सहायता व अनुभव साझा करना",
    desc: "This forum is for peer sharing and CHW guidance. It does NOT replace doctor diagnosis or prescription medicine.",
    descHi: "यह मंच केवल अनुभव साझा करने व स्वास्थ्य सलाह के लिए है। यह डॉक्टर के इलाज या दवाई का विकल्प नहीं है।"
  },
  {
    id: "g2",
    title: "Strict Red-Flag Pre-Moderation",
    titleHi: "आपातकालीन लक्षणों की त्वरित निगरानी",
    desc: "Posts mentioning chest pain, heavy bleeding, high fever in infants, or blurred vision are instantly flagged to the Clinician Review Queue.",
    descHi: "रक्तस्राव, सीने में दर्द या तेज बुखार का उल्लेख होते ही पोस्ट सीधे डॉक्टर आपातकालीन समीक्षा में भेजी जाती है।"
  },
  {
    id: "g3",
    title: "Respect & Patient Privacy (DPDP Act)",
    titleHi: "गोपनीयता और सम्मान (DPDP अधिनियम)",
    desc: "Do not post national ID numbers (Aadhaar/Ration Card). All data is processed with explicit consent.",
    descHi: "आधार या राशन कार्ड नंबर पोस्ट न करें। सभी डेटा भारतीय DPDP 2023 के तहत सुरक्षित है।"
  },
  {
    id: "g4",
    title: "Verified Health Worker Badges",
    titleHi: "सत्यापित स्वास्थ्य कार्यकर्ता बैज",
    desc: "Guidance from certified ASHA workers and doctors carries verified badges so you always know who is giving medical information.",
    descHi: "आशा कार्यकर्ताओं और डॉक्टरों के उत्तरों पर प्रमाणित बैज होता है जिससे सही सलाह की पहचान होती है।"
  }
];

// Healthcare Product Marketplace Catalog (§4 Phase 3)
export const MARKETPLACE_PRODUCTS = [
  {
    id: "prod-1",
    name: "Iron & Folic Acid (IFA) Tablets (100 tabs)",
    nameHi: "आयरन एवं फोलिक एसिड गोलियां (100 गोलियां)",
    category: "Maternal Health",
    price: 32,
    mrp: 140,
    subsidyPercent: 77,
    source: "Pradhan Mantri Jan Aushadhi Kendra",
    inStock: true,
    stockCount: 420,
    dosage: "1 tablet daily after food",
    dosageHi: "प्रतिदिन भोजन के बाद 1 गोली",
    description: "Government-certified generic iron-folic acid supplement to treat and prevent gestational anemia in pregnant and lactating mothers.",
    descriptionHi: "गर्भवती व धात्री माताओं में खून की कमी दूर करने के लिए सरकारी प्रमाणित जेनेरिक पूरक आहार।"
  },
  {
    id: "prod-2",
    name: "Biodegradable Sanitary Pads (Pack of 10)",
    nameHi: "बायोडिग्रेडेबल सैनिटरी पैड (10 का पैक)",
    category: "Hygiene",
    price: 25,
    mrp: 90,
    subsidyPercent: 72,
    source: "Jan Aushadhi Suvidha",
    inStock: true,
    stockCount: 650,
    dosage: "Change every 4 to 6 hours",
    dosageHi: "प्रत्येक 4 से 6 घंटे में बदलें",
    description: "Oxo-biodegradable sanitary napkins designed for rural adolescent girls and women. Soft, rash-free, and eco-friendly.",
    descriptionHi: "ग्रामीण बहनों और किशोरियों के लिए मुलायम, रैश-मुक्त और पर्यावरण अनुकूल सैनिटरी नैपकिन।"
  },
  {
    id: "prod-3",
    name: "WHO Formula ORS Rehydration Salts (5 Packets)",
    nameHi: "डब्ल्यूएचओ फॉर्मूला ओआरएस घोल (5 पैकेट)",
    category: "OTC Essentials",
    price: 18,
    mrp: 65,
    subsidyPercent: 72,
    source: "Jan Aushadhi Kendra",
    inStock: true,
    stockCount: 890,
    dosage: "Dissolve 1 packet in 1 liter clean drinking water",
    dosageHi: "1 पैकेट को 1 लीटर उबले व ठंडे पानी में घोलें",
    description: "Life-saving oral rehydration salt for infants and children during diarrhea, vomiting, and high fever dehydrations.",
    descriptionHi: "दस्त, उल्टी व बुखार के दौरान निर्जलीकरण से बचाव के लिए जीवनरक्षक घोल।"
  },
  {
    id: "prod-4",
    name: "Clean Delivery Kit (Safe Home/PHC Birth)",
    nameHi: "सुरक्षित प्रसव किट (जननी सुरक्षा किट)",
    category: "Maternal Health",
    price: 85,
    mrp: 350,
    subsidyPercent: 76,
    source: "National Health Mission / Jan Aushadhi",
    inStock: true,
    stockCount: 110,
    dosage: "For single birth event delivery",
    dosageHi: "एक सुरक्षित प्रसव के लिए",
    description: "Sterile delivery sheet, sterile cord clamp, sterilized surgical blade, soap, and clean baby wrapping towel to prevent neonatal tetanus and sepsis.",
    descriptionHi: "नवजात टिटनेस व संक्रमण से बचाव के लिए जीवाणुरहित प्रसव शीट, कॉर्ड क्लैंप, ब्लेड और साबुन।"
  },
  {
    id: "prod-5",
    name: "Digital Rapid Clinical Thermometer",
    nameHi: "डिजिटल थर्मामीटर (बुखार मापक)",
    category: "OTC Essentials",
    price: 95,
    mrp: 260,
    subsidyPercent: 63,
    source: "Jan Aushadhi Kendra",
    inStock: true,
    stockCount: 85,
    dosage: "Oral / Underarm measurement with beep alarm",
    dosageHi: "मुंह या बगल में 1 मिनट रखकर बीप की आवाज सुनें",
    description: "Waterproof, battery-operated digital thermometer with fever alarm for timely detection of infant and maternal infections.",
    descriptionHi: "बच्चों व बड़ों में बुखार की त्वरित पहचान के लिए सुरक्षित व आसान डिजिटल थर्मामीटर।"
  },
  {
    id: "prod-6",
    name: "Moringa Superfood Powder (200g Pouch)",
    nameHi: "सहजन (मुनगा) पत्ती का चूर्ण (200 ग्राम)",
    category: "Nutrition",
    price: 45,
    mrp: 180,
    subsidyPercent: 75,
    source: "Rural SHG / Tribal Forest Co-op",
    inStock: true,
    stockCount: 140,
    dosage: "1 teaspoon daily with warm dal or roti dough",
    dosageHi: "प्रतिदिन 1 चम्मच दाल में या रोटी के आटे में मिलाकर खाएं",
    description: "Pure shade-dried moringa oleifera leaf powder from rural Palghar tribal farmer self-help groups. Packed with natural plant iron and calcium.",
    descriptionHi: "पालघर के महिला स्वयं सहायता समूह द्वारा तैयार शुद्ध सहजन चूर्ण। प्राकृतिक आयरन और कैल्शियम से भरपूर।"
  }
];
