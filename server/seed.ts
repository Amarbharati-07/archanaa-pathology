import { db } from "./db";
import { tests, packages, reviews, admins } from "@shared/schema";
import { hashPassword } from "./auth";
import { sql } from "drizzle-orm";

const SEED_TESTS = [
  {
    name: "Complete Blood Count (CBC)",
    description: "Comprehensive blood test that evaluates overall health and detects a wide range of disorders including anemia, infection, and blood diseases.\n\nSample Type: Whole Blood (EDTA)\nFasting: No\nMethod: Automated Cell Counter",
    price: 450,
    reportTime: "24 hours",
    category: "Hematology",
    isPopular: true,
  },
  {
    name: "Erythrocyte Sedimentation Rate (ESR)",
    description: "Measures the rate at which red blood cells settle in a tube. Elevated ESR indicates inflammation in the body.\n\nSample Type: Whole Blood (EDTA)\nFasting: No\nMethod: Westergren Method",
    price: 150,
    reportTime: "4 hours",
    category: "Hematology",
    isPopular: false,
  },
  {
    name: "Peripheral Blood Smear",
    description: "Microscopic examination of blood cells to evaluate their shape, size, and appearance.\n\nSample Type: Whole Blood (EDTA)\nFasting: No\nMethod: Microscopy (Leishman Stain)",
    price: 300,
    reportTime: "24 hours",
    category: "Hematology",
    isPopular: false,
  },
  {
    name: "Blood Group & Rh Typing",
    description: "Determines blood group (A, B, AB, O) and Rh factor (positive or negative).\n\nSample Type: Whole Blood (EDTA)\nFasting: No\nMethod: Slide Agglutination",
    price: 200,
    reportTime: "4 hours",
    category: "Hematology",
    isPopular: true,
  },
  {
    name: "Reticulocyte Count",
    description: "Measures young red blood cells to assess bone marrow function and response to anemia treatment.\n\nSample Type: Whole Blood (EDTA)\nFasting: No\nMethod: Automated/Manual Count",
    price: 350,
    reportTime: "24 hours",
    category: "Hematology",
    isPopular: false,
  },
  {
    name: "Blood Sugar Fasting",
    description: "Measures blood glucose levels after an overnight fast (8-12 hours). Primary screening test for diabetes.\n\nSample Type: Plasma (Fluoride)\nFasting: Yes (10 hours)\nMethod: Hexokinase/GOD-POD",
    price: 80,
    reportTime: "4 hours",
    category: "Diabetes",
    isPopular: true,
  },
  {
    name: "Blood Sugar PP (Postprandial)",
    description: "Measures blood glucose levels 2 hours after eating. Helps assess how body handles glucose after meals.\n\nSample Type: Plasma (Fluoride)\nFasting: No\nMethod: Hexokinase/GOD-POD",
    price: 80,
    reportTime: "4 hours",
    category: "Diabetes",
    isPopular: true,
  },
  {
    name: "Blood Sugar Random",
    description: "Measures blood glucose at any time of day, regardless of when you last ate.\n\nSample Type: Plasma (Fluoride)\nFasting: No\nMethod: Hexokinase/GOD-POD",
    price: 80,
    reportTime: "4 hours",
    category: "Diabetes",
    isPopular: false,
  },
  {
    name: "HbA1c (Glycated Hemoglobin)",
    description: "Measures average blood sugar control over the past 2-3 months. Gold standard for diabetes monitoring.\n\nSample Type: Whole Blood (EDTA)\nFasting: No\nMethod: HPLC/Immunoturbidimetry",
    price: 550,
    reportTime: "24 hours",
    category: "Diabetes",
    isPopular: true,
  },
  {
    name: "Fasting Insulin",
    description: "Measures insulin levels in fasting state. Helps assess insulin resistance and beta cell function.\n\nSample Type: Serum\nFasting: Yes (10 hours)\nMethod: CLIA/ECLIA",
    price: 800,
    reportTime: "48 hours",
    category: "Diabetes",
    isPopular: false,
  },
  {
    name: "Liver Function Test (LFT)",
    description: "Comprehensive panel to assess liver health, function, and detect liver diseases.\n\nSample Type: Serum\nFasting: Yes (10 hours)\nMethod: Colorimetric/Kinetic",
    price: 650,
    reportTime: "24 hours",
    category: "Liver Profile",
    isPopular: true,
  },
  {
    name: "Kidney Function Test (KFT)",
    description: "Evaluates kidney health and function. Essential for detecting kidney diseases and monitoring kidney function.\n\nSample Type: Serum\nFasting: Yes (10 hours)\nMethod: Colorimetric/Enzymatic",
    price: 550,
    reportTime: "24 hours",
    category: "Kidney Profile",
    isPopular: true,
  },
  {
    name: "Electrolyte Panel",
    description: "Measures essential electrolytes in blood. Important for kidney function and fluid balance assessment.\n\nSample Type: Serum\nFasting: No\nMethod: Ion Selective Electrode (ISE)",
    price: 450,
    reportTime: "24 hours",
    category: "Kidney Profile",
    isPopular: true,
  },
  {
    name: "Lipid Profile",
    description: "Measures cholesterol and triglyceride levels to assess cardiovascular health and heart disease risk.\n\nSample Type: Serum\nFasting: Yes (12 hours)\nMethod: Enzymatic Colorimetric",
    price: 500,
    reportTime: "24 hours",
    category: "Lipid Profile",
    isPopular: true,
  },
  {
    name: "Apolipoprotein A1",
    description: "Primary protein component of HDL cholesterol. Low levels indicate increased cardiovascular risk.\n\nSample Type: Serum\nFasting: Yes (12 hours)\nMethod: Immunoturbidimetry",
    price: 900,
    reportTime: "48 hours",
    category: "Lipid Profile",
    isPopular: false,
  },
  {
    name: "Apolipoprotein B",
    description: "Primary protein of LDL cholesterol. Elevated levels indicate increased cardiovascular risk.\n\nSample Type: Serum\nFasting: Yes (12 hours)\nMethod: Immunoturbidimetry",
    price: 900,
    reportTime: "48 hours",
    category: "Lipid Profile",
    isPopular: false,
  },
  {
    name: "Lipoprotein (a)",
    description: "Independent genetic risk factor for cardiovascular disease.\n\nSample Type: Serum\nFasting: Yes (12 hours)\nMethod: Immunoturbidimetry",
    price: 1200,
    reportTime: "48 hours",
    category: "Lipid Profile",
    isPopular: false,
  },
  {
    name: "Thyroid Profile (T3, T4, TSH)",
    description: "Comprehensive assessment of thyroid function. Detects hyperthyroidism, hypothyroidism, and other thyroid disorders.\n\nSample Type: Serum\nFasting: No\nMethod: CLIA/ECLIA",
    price: 700,
    reportTime: "24 hours",
    category: "Thyroid",
    isPopular: true,
  },
  {
    name: "Free T3",
    description: "Measures unbound, active form of T3. More accurate than total T3 in certain conditions.\n\nSample Type: Serum\nFasting: No\nMethod: CLIA/ECLIA",
    price: 400,
    reportTime: "24 hours",
    category: "Thyroid",
    isPopular: false,
  },
  {
    name: "Free T4",
    description: "Measures unbound, active form of T4. More accurate than total T4 in certain conditions.\n\nSample Type: Serum\nFasting: No\nMethod: CLIA/ECLIA",
    price: 400,
    reportTime: "24 hours",
    category: "Thyroid",
    isPopular: false,
  },
  {
    name: "Anti-TPO Antibodies",
    description: "Detects antibodies against thyroid peroxidase. Elevated in autoimmune thyroid diseases like Hashimoto's.\n\nSample Type: Serum\nFasting: No\nMethod: CLIA/ECLIA",
    price: 800,
    reportTime: "48 hours",
    category: "Thyroid",
    isPopular: false,
  },
  {
    name: "Anti-Thyroglobulin Antibodies",
    description: "Detects antibodies against thyroglobulin. Elevated in autoimmune thyroid diseases.\n\nSample Type: Serum\nFasting: No\nMethod: CLIA/ECLIA",
    price: 800,
    reportTime: "48 hours",
    category: "Thyroid",
    isPopular: false,
  },
  {
    name: "Vitamin D (25-OH)",
    description: "Measures 25-hydroxyvitamin D levels. Essential for bone health and immune function.\n\nSample Type: Serum\nFasting: No\nMethod: CLIA/ECLIA",
    price: 1200,
    reportTime: "48 hours",
    category: "Vitamins",
    isPopular: true,
  },
  {
    name: "Vitamin B12",
    description: "Measures cobalamin levels. Essential for nerve function, red blood cell formation, and DNA synthesis.\n\nSample Type: Serum\nFasting: No\nMethod: CLIA/ECLIA",
    price: 750,
    reportTime: "48 hours",
    category: "Vitamins",
    isPopular: true,
  },
  {
    name: "Folate (Folic Acid)",
    description: "Measures folate levels. Essential for DNA synthesis and red blood cell formation.\n\nSample Type: Serum\nFasting: No\nMethod: CLIA/ECLIA",
    price: 650,
    reportTime: "48 hours",
    category: "Vitamins",
    isPopular: false,
  },
  {
    name: "Iron Studies",
    description: "Comprehensive iron assessment including serum iron, TIBC, and transferrin saturation.\n\nSample Type: Serum\nFasting: Yes (10 hours)\nMethod: Colorimetric",
    price: 600,
    reportTime: "24 hours",
    category: "Vitamins",
    isPopular: false,
  },
  {
    name: "Ferritin",
    description: "Measures iron stores in the body. Best indicator of iron deficiency anemia.\n\nSample Type: Serum\nFasting: No\nMethod: CLIA/ECLIA",
    price: 550,
    reportTime: "24 hours",
    category: "Vitamins",
    isPopular: false,
  },
  {
    name: "Calcium",
    description: "Measures calcium levels. Essential for bones, muscles, nerves, and heart function.\n\nSample Type: Serum\nFasting: No\nMethod: Colorimetric",
    price: 150,
    reportTime: "24 hours",
    category: "Vitamins",
    isPopular: false,
  },
  {
    name: "Phosphorus",
    description: "Measures phosphorus levels. Important for bones, energy production, and kidney function.\n\nSample Type: Serum\nFasting: No\nMethod: Colorimetric",
    price: 150,
    reportTime: "24 hours",
    category: "Vitamins",
    isPopular: false,
  },
  {
    name: "Magnesium",
    description: "Measures magnesium levels. Essential for muscle function, nerve function, and heart rhythm.\n\nSample Type: Serum\nFasting: No\nMethod: Colorimetric",
    price: 200,
    reportTime: "24 hours",
    category: "Vitamins",
    isPopular: false,
  },
  {
    name: "Troponin I",
    description: "Highly sensitive marker for heart muscle damage. Primary test for diagnosing heart attack.\n\nSample Type: Serum\nFasting: No\nMethod: CLIA/ECLIA",
    price: 1200,
    reportTime: "4 hours",
    category: "Cardiac",
    isPopular: true,
  },
  {
    name: "CK-MB",
    description: "Cardiac-specific creatine kinase. Used to diagnose heart attack and monitor heart damage.\n\nSample Type: Serum\nFasting: No\nMethod: CLIA/Immunoinhibition",
    price: 600,
    reportTime: "4 hours",
    category: "Cardiac",
    isPopular: false,
  },
  {
    name: "NT-proBNP",
    description: "Marker for heart failure. Elevated levels indicate heart strain or failure.\n\nSample Type: Serum\nFasting: No\nMethod: CLIA/ECLIA",
    price: 2500,
    reportTime: "48 hours",
    category: "Cardiac",
    isPopular: false,
  },
  {
    name: "Homocysteine",
    description: "Elevated levels are a risk factor for cardiovascular disease and stroke.\n\nSample Type: Serum\nFasting: Yes (10 hours)\nMethod: CLIA/ECLIA",
    price: 1500,
    reportTime: "48 hours",
    category: "Cardiac",
    isPopular: false,
  },
  {
    name: "hs-CRP (High Sensitivity CRP)",
    description: "Marker for cardiovascular inflammation. Helps assess heart disease risk.\n\nSample Type: Serum\nFasting: No\nMethod: Immunoturbidimetry",
    price: 800,
    reportTime: "24 hours",
    category: "Cardiac",
    isPopular: false,
  },
  {
    name: "C-Reactive Protein (CRP)",
    description: "Marker for inflammation and infection. Elevated in bacterial infections and inflammatory conditions.\n\nSample Type: Serum\nFasting: No\nMethod: Immunoturbidimetry",
    price: 400,
    reportTime: "24 hours",
    category: "Infection",
    isPopular: true,
  },
  {
    name: "Procalcitonin",
    description: "Specific marker for bacterial sepsis. Helps differentiate bacterial from viral infections.\n\nSample Type: Serum\nFasting: No\nMethod: CLIA/ECLIA",
    price: 1800,
    reportTime: "24 hours",
    category: "Infection",
    isPopular: false,
  },
  {
    name: "Dengue NS1 Antigen",
    description: "Early marker for dengue infection. Detectable from day 1 of fever.\n\nSample Type: Serum\nFasting: No\nMethod: ELISA/Rapid Card",
    price: 600,
    reportTime: "4 hours",
    category: "Infection",
    isPopular: true,
  },
  {
    name: "Typhoid (Widal Test)",
    description: "Serological test for enteric (typhoid) fever.\n\nSample Type: Serum\nFasting: No\nMethod: Slide Agglutination",
    price: 250,
    reportTime: "4 hours",
    category: "Infection",
    isPopular: true,
  },
  {
    name: "Malaria Parasite (MP) - Rapid",
    description: "Rapid detection of malarial antigens (P.falciparum & P.vivax).\n\nSample Type: Whole Blood (EDTA)\nFasting: No\nMethod: Rapid Card (ICT)",
    price: 250,
    reportTime: "4 hours",
    category: "Infection",
    isPopular: true,
  },
  {
    name: "Testosterone (Total)",
    description: "Primary male sex hormone. Important for energy, libido, and muscle health assessment.\n\nSample Type: Serum\nFasting: No\nMethod: CLIA/ECLIA",
    price: 650,
    reportTime: "48 hours",
    category: "Hormones",
    isPopular: false,
  },
  {
    name: "Prolactin",
    description: "Reproductive hormone. Elevated levels can interfere with fertility and menstruation.\n\nSample Type: Serum\nFasting: No\nMethod: CLIA/ECLIA",
    price: 550,
    reportTime: "48 hours",
    category: "Hormones",
    isPopular: false,
  },
  {
    name: "LH (Luteinizing Hormone)",
    description: "Reproductive hormone. Important for fertility assessment in both men and women.\n\nSample Type: Serum\nFasting: No\nMethod: CLIA/ECLIA",
    price: 550,
    reportTime: "48 hours",
    category: "Hormones",
    isPopular: false,
  },
  {
    name: "FSH (Follicle Stimulating Hormone)",
    description: "Reproductive hormone. Essential for fertility evaluation.\n\nSample Type: Serum\nFasting: No\nMethod: CLIA/ECLIA",
    price: 550,
    reportTime: "48 hours",
    category: "Hormones",
    isPopular: false,
  },
  {
    name: "Estradiol (E2)",
    description: "Primary female sex hormone. Important for reproductive health and menopause assessment.\n\nSample Type: Serum\nFasting: No\nMethod: CLIA/ECLIA",
    price: 700,
    reportTime: "48 hours",
    category: "Hormones",
    isPopular: false,
  },
  {
    name: "Progesterone",
    description: "Hormone essential for pregnancy. Used to confirm ovulation and assess fertility.\n\nSample Type: Serum\nFasting: No\nMethod: CLIA/ECLIA",
    price: 650,
    reportTime: "48 hours",
    category: "Hormones",
    isPopular: false,
  },
  {
    name: "Cortisol (Morning)",
    description: "Stress hormone produced by adrenal glands. Best measured in morning.\n\nSample Type: Serum\nFasting: Yes (10 hours)\nMethod: CLIA/ECLIA",
    price: 700,
    reportTime: "48 hours",
    category: "Hormones",
    isPopular: false,
  },
  {
    name: "DHEA-Sulfate",
    description: "Adrenal hormone. Elevated in PCOS and adrenal disorders.\n\nSample Type: Serum\nFasting: No\nMethod: CLIA/ECLIA",
    price: 900,
    reportTime: "48 hours",
    category: "Hormones",
    isPopular: false,
  },
  {
    name: "Parathyroid Hormone (PTH)",
    description: "Regulates calcium and phosphorus levels. Important for bone health assessment.\n\nSample Type: Serum\nFasting: No\nMethod: CLIA/ECLIA",
    price: 1200,
    reportTime: "48 hours",
    category: "Hormones",
    isPopular: false,
  },
  {
    name: "Urine Routine Examination",
    description: "Complete physical, chemical, and microscopic examination of urine.\n\nSample Type: Urine (Midstream)\nFasting: No\nMethod: Dipstick/Microscopy",
    price: 150,
    reportTime: "4 hours",
    category: "Urine",
    isPopular: true,
  }
];

const SEED_PACKAGES = [
  {
    name: "Men's Basic Health Checkup",
    description: "Essential health screening package for men covering basic parameters for overall health assessment.",
    price: 1080,
    includes: ["Complete Blood Count (CBC)", "Blood Sugar Fasting", "Lipid Profile", "Liver Function Test (LFT)", "Kidney Function Test (KFT)", "Thyroid Profile (T3, T4, TSH)", "Urine Routine Examination"],
    category: "Men",
    isFeatured: true,
  },
  {
    name: "Men's Comprehensive Health Checkup",
    description: "Complete health evaluation for men including cardiac markers, hormones, and vitamins.",
    price: 2925,
    includes: ["Complete Blood Count (CBC)", "Erythrocyte Sedimentation Rate (ESR)", "Blood Sugar Fasting", "Blood Sugar PP (Postprandial)", "HbA1c (Glycated Hemoglobin)", "Lipid Profile", "Liver Function Test (LFT)", "Kidney Function Test (KFT)", "Thyroid Profile (T3, T4, TSH)", "Vitamin D (25-OH)", "Vitamin B12", "Ferritin", "Iron Studies", "Testosterone (Total)", "Urine Routine Examination"],
    category: "Men",
    isFeatured: true,
  },
  {
    name: "Men's Heart Health Package",
    description: "Comprehensive cardiac assessment for men to evaluate heart disease risk factors.",
    price: 2450,
    includes: ["Complete Blood Count (CBC)", "Lipid Profile", "Apolipoprotein A1", "Apolipoprotein B", "Lipoprotein (a)", "hs-CRP (High Sensitivity CRP)", "Homocysteine", "HbA1c (Glycated Hemoglobin)", "Thyroid Profile (T3, T4, TSH)"],
    category: "Men",
    isFeatured: true,
  },
  {
    name: "Women's Basic Health Checkup",
    description: "Essential health screening package for women covering basic parameters for overall health assessment.",
    price: 1200,
    includes: ["Complete Blood Count (CBC)", "Blood Sugar Fasting", "Lipid Profile", "Liver Function Test (LFT)", "Kidney Function Test (KFT)", "Thyroid Profile (T3, T4, TSH)", "Iron Studies", "Urine Routine Examination"],
    category: "Women",
    isFeatured: true,
  },
  {
    name: "Women's Comprehensive Health Checkup",
    description: "Complete health evaluation for women including hormones, vitamins, and essential markers.",
    price: 3250,
    includes: ["Complete Blood Count (CBC)", "Erythrocyte Sedimentation Rate (ESR)", "Blood Sugar Fasting", "Blood Sugar PP (Postprandial)", "HbA1c (Glycated Hemoglobin)", "Lipid Profile", "Liver Function Test (LFT)", "Kidney Function Test (KFT)", "Thyroid Profile (T3, T4, TSH)", "Free T3", "Free T4", "Anti-TPO Antibodies", "Vitamin D (25-OH)", "Vitamin B12", "Ferritin", "Iron Studies", "Folate (Folic Acid)", "Calcium", "Urine Routine Examination"],
    category: "Women",
    isFeatured: true,
  },
  {
    name: "Women's Hormone Panel",
    description: "Complete hormonal assessment for women to evaluate reproductive health and hormonal balance.",
    price: 3000,
    includes: ["Thyroid Profile (T3, T4, TSH)", "Free T3", "Free T4", "FSH (Follicle Stimulating Hormone)", "LH (Luteinizing Hormone)", "Estradiol (E2)", "Progesterone", "Prolactin", "Testosterone (Total)", "DHEA-Sulfate"],
    category: "Women",
    isFeatured: true,
  },
  {
    name: "PCOD/PCOS Profile",
    description: "Specialized package for detecting and monitoring Polycystic Ovarian Syndrome.",
    price: 2450,
    includes: ["Thyroid Profile (T3, T4, TSH)", "FSH (Follicle Stimulating Hormone)", "LH (Luteinizing Hormone)", "Testosterone (Total)", "DHEA-Sulfate", "Fasting Insulin", "Blood Sugar Fasting", "HbA1c (Glycated Hemoglobin)", "Lipid Profile"],
    category: "Women",
    isFeatured: true,
  },
  {
    name: "Young Adult Health Checkup",
    description: "Basic health screening package for young adults aged 18-35 years.",
    price: 825,
    includes: ["Complete Blood Count (CBC)", "Blood Sugar Fasting", "Lipid Profile", "Thyroid Profile (T3, T4, TSH)", "Vitamin D (25-OH)", "Urine Routine Examination"],
    category: "Young/General",
    isFeatured: true,
  },
  {
    name: "Full Body Checkup Basic",
    description: "Complete body health screening covering all major organ systems.",
    price: 1375,
    includes: ["Complete Blood Count (CBC)", "Blood Sugar Fasting", "Lipid Profile", "Liver Function Test (LFT)", "Kidney Function Test (KFT)", "Thyroid Profile (T3, T4, TSH)", "Iron Studies", "Urine Routine Examination"],
    category: "Young/General",
    isFeatured: true,
  },
  {
    name: "Senior Citizen Wellness (Male)",
    description: "Comprehensive health package tailored for senior men.",
    price: 2400,
    includes: ["Complete Blood Count (CBC)", "Blood Sugar Fasting", "HbA1c (Glycated Hemoglobin)", "Lipid Profile", "Liver Function Test (LFT)", "Kidney Function Test (KFT)", "Thyroid Profile (T3, T4, TSH)", "Vitamin D (25-OH)", "Vitamin B12", "Calcium", "Urine Routine Examination"],
    category: "Senior Citizen",
    isFeatured: true,
  },
  {
    name: "Senior Citizen Wellness (Female)",
    description: "Comprehensive health package tailored for senior women.",
    price: 2400,
    includes: ["Complete Blood Count (CBC)", "Blood Sugar Fasting", "HbA1c (Glycated Hemoglobin)", "Lipid Profile", "Liver Function Test (LFT)", "Kidney Function Test (KFT)", "Thyroid Profile (T3, T4, TSH)", "Vitamin D (25-OH)", "Vitamin B12", "Calcium", "Urine Routine Examination"],
    category: "Senior Citizen",
    isFeatured: true,
  },
  {
    name: "Diabetes Care Package",
    description: "Specialized tests for monitoring diabetes and its impact on organs.",
    price: 1500,
    includes: ["Blood Sugar Fasting", "Blood Sugar PP (Postprandial)", "HbA1c (Glycated Hemoglobin)", "Kidney Function Test (KFT)", "Lipid Profile", "Urine Routine Examination"],
    category: "General",
    isFeatured: true,
  },
  {
    name: "Cardiac Health Profile",
    description: "Tests to evaluate heart health and cardiovascular risk.",
    price: 1800,
    includes: ["Lipid Profile", "hs-CRP (High Sensitivity CRP)", "Homocysteine", "HbA1c (Glycated Hemoglobin)", "Thyroid Profile (T3, T4, TSH)", "Electrolyte Panel"],
    category: "General",
    isFeatured: true,
  },
  {
    name: "Liver Care Profile",
    description: "Detailed evaluation of liver health and function.",
    price: 1200,
    includes: ["Liver Function Test (LFT)", "Lipid Profile", "Blood Sugar Fasting", "Complete Blood Count (CBC)"],
    category: "General",
    isFeatured: true,
  },
  {
    name: "Kidney Care Profile",
    description: "Detailed evaluation of kidney health and function.",
    price: 1200,
    includes: ["Kidney Function Test (KFT)", "Electrolyte Panel", "Urine Routine Examination", "Complete Blood Count (CBC)"],
    category: "General",
    isFeatured: true,
  },
  {
    name: "Vitamin & Mineral Profile",
    description: "Comprehensive screening for essential vitamins and minerals.",
    price: 1800,
    includes: ["Vitamin D (25-OH)", "Vitamin B12", "Calcium", "Phosphorus", "Magnesium", "Iron Studies", "Ferritin"],
    category: "General",
    isFeatured: true,
  },
  {
    name: "Fever Screening Profile",
    description: "Initial screening tests for acute fever.",
    price: 1000,
    includes: ["Complete Blood Count (CBC)", "Erythrocyte Sedimentation Rate (ESR)", "C-Reactive Protein (CRP)", "Urine Routine Examination", "Dengue NS1 Antigen", "Malaria Parasite (MP) - Rapid", "Typhoid (Widal Test)"],
    category: "General",
    isFeatured: true,
  }
];

const SEED_REVIEWS = [
  {
    name: "Raj Kumar",
    rating: 5,
    comment: "Excellent service and very professional staff. Got my reports quickly.",
    date: "2024-12-20",
  },
  {
    name: "Priya Sharma",
    rating: 5,
    comment: "Very clean and hygienic. Doctor was very helpful and explained everything clearly.",
    date: "2024-12-18",
  },
  {
    name: "Amit Patel",
    rating: 4,
    comment: "Good service but a bit crowded during peak hours. Overall satisfied.",
    date: "2024-12-15",
  },
  {
    name: "Sneha Singh",
    rating: 5,
    comment: "Amazing experience! Staff is courteous and efficient.",
    date: "2024-12-12",
  },
  {
    name: "Vikram Gupta",
    rating: 4,
    comment: "Good quality tests and reasonable prices.",
    date: "2024-12-10",
  }
];

export async function seedDatabase() {
  try {
    console.log("[seed] Starting database seeding...");

    // Clear existing data to ensure update
    await db.delete(reviews);
    await db.delete(packages);
    await db.delete(tests);

    console.log("[seed] Seeding tests, packages, and reviews...");
    
    // Insert tests
    await db.insert(tests).values(SEED_TESTS);
    console.log(`[seed] ✓ Inserted ${SEED_TESTS.length} tests`);

    // Insert packages
    await db.insert(packages).values(SEED_PACKAGES);
    console.log(`[seed] ✓ Inserted ${SEED_PACKAGES.length} packages`);

    // Insert reviews
    await db.insert(reviews).values(SEED_REVIEWS);
    console.log(`[seed] ✓ Inserted ${SEED_REVIEWS.length} reviews`);

    // Seed admin if not exists
    const existingAdmin = await db.select().from(admins).limit(1);
    if (existingAdmin.length === 0) {
      const hashedPassword = await hashPassword("sourav0788");
      await db.insert(admins).values({
        email: "souravz@gmail.com",
        password: hashedPassword,
        name: "Admin",
      });
      console.log("[seed] ✓ Admin user created (email: souravz@gmail.com, password: sourav0788)");
    }

    console.log("[seed] ✓ Database ready!");
  } catch (error) {
    console.error("[seed] Error seeding database:", error);
    throw error;
  }
}
