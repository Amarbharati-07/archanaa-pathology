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
    parameters: [
      { name: "Hemoglobin", unit: "g/dL", normalRange: "12-16 (F), 13-17 (M)", paramCode: "HGB" },
      { name: "RBC Count", unit: "million/mcL", normalRange: "4.0-5.5 (F), 4.5-6.0 (M)", paramCode: "RBC" },
      { name: "WBC Count", unit: "cells/mcL", normalRange: "4500-11000", paramCode: "WBC" },
      { name: "Platelets", unit: "cells/mcL", normalRange: "150000-400000", paramCode: "PLT" },
      { name: "Hematocrit (HCT/PCV)", unit: "%", normalRange: "36-46 (F), 40-54 (M)", paramCode: "HCT" },
      { name: "MCV", unit: "fL", normalRange: "80-100", paramCode: "MCV" },
      { name: "MCH", unit: "pg", normalRange: "27-33", paramCode: "MCH" },
      { name: "MCHC", unit: "g/dL", normalRange: "32-36", paramCode: "MCHC" },
      { name: "RDW-CV", unit: "%", normalRange: "11.5-14.5", paramCode: "RDWCV" },
      { name: "Neutrophils", unit: "%", normalRange: "40-70", paramCode: "NEUT" },
      { name: "Lymphocytes", unit: "%", normalRange: "20-40", paramCode: "LYMPH" },
      { name: "Monocytes", unit: "%", normalRange: "2-8", paramCode: "MONO" },
      { name: "Eosinophils", unit: "%", normalRange: "1-4", paramCode: "EOS" },
      { name: "Basophils", unit: "%", normalRange: "0-1", paramCode: "BASO" },
    ],
  },
  {
    name: "Erythrocyte Sedimentation Rate (ESR)",
    description: "Measures the rate at which red blood cells settle in a tube. Elevated ESR indicates inflammation in the body.\n\nSample Type: Whole Blood (EDTA)\nFasting: No\nMethod: Westergren Method",
    price: 150,
    reportTime: "4 hours",
    category: "Hematology",
    isPopular: false,
    parameters: [
      { name: "ESR", unit: "mm/hr", normalRange: "0-15 (M), 0-20 (F)", paramCode: "ESR" },
    ],
  },
  {
    name: "Peripheral Blood Smear",
    description: "Microscopic examination of blood cells to evaluate their shape, size, and appearance.\n\nSample Type: Whole Blood (EDTA)\nFasting: No\nMethod: Microscopy (Leishman Stain)",
    price: 300,
    reportTime: "24 hours",
    category: "Hematology",
    isPopular: false,
    parameters: [
      { name: "RBC Morphology", unit: "", normalRange: "Normocytic Normochromic", paramCode: "RBCM" },
      { name: "WBC Morphology", unit: "", normalRange: "Normal", paramCode: "WBCM" },
      { name: "Platelet Morphology", unit: "", normalRange: "Adequate", paramCode: "PLTM" },
      { name: "Parasites", unit: "", normalRange: "Not Seen", paramCode: "PARA" },
    ],
  },
  {
    name: "Blood Group & Rh Typing",
    description: "Determines blood group (A, B, AB, O) and Rh factor (positive or negative).\n\nSample Type: Whole Blood (EDTA)\nFasting: No\nMethod: Slide Agglutination",
    price: 200,
    reportTime: "4 hours",
    category: "Hematology",
    isPopular: true,
    parameters: [
      { name: "Blood Group", unit: "", normalRange: "A/B/AB/O", paramCode: "BG" },
      { name: "Rh Factor", unit: "", normalRange: "Positive/Negative", paramCode: "RH" },
    ],
  },
  {
    name: "Reticulocyte Count",
    description: "Measures young red blood cells to assess bone marrow function and response to anemia treatment.\n\nSample Type: Whole Blood (EDTA)\nFasting: No\nMethod: Automated/Manual Count",
    price: 350,
    reportTime: "24 hours",
    category: "Hematology",
    isPopular: false,
    parameters: [
      { name: "Reticulocyte Count", unit: "%", normalRange: "0.5-2.5", paramCode: "RETIC" },
      { name: "Absolute Reticulocyte Count", unit: "cells/mcL", normalRange: "25000-125000", paramCode: "ARC" },
    ],
  },
  // ==================== DIABETES TESTS ====================
  {
    name: "Blood Sugar Fasting",
    description: "Measures blood glucose levels after an overnight fast (8-12 hours). Primary screening test for diabetes.\n\nSample Type: Plasma (Fluoride)\nFasting: Yes (10 hours)\nMethod: Hexokinase/GOD-POD",
    price: 80,
    reportTime: "4 hours",
    category: "Diabetes",
    isPopular: true,
    parameters: [
      { name: "Fasting Blood Glucose", unit: "mg/dL", normalRange: "70-100", paramCode: "FBG" },
    ],
  },
  {
    name: "Blood Sugar PP (Postprandial)",
    description: "Measures blood glucose levels 2 hours after eating. Helps assess how body handles glucose after meals.\n\nSample Type: Plasma (Fluoride)\nFasting: No\nMethod: Hexokinase/GOD-POD",
    price: 80,
    reportTime: "4 hours",
    category: "Diabetes",
    isPopular: true,
    parameters: [
      { name: "Postprandial Blood Glucose", unit: "mg/dL", normalRange: "<140", paramCode: "PPBG" },
    ],
  },
  {
    name: "Blood Sugar Random",
    description: "Measures blood glucose at any time of day, regardless of when you last ate.\n\nSample Type: Plasma (Fluoride)\nFasting: No\nMethod: Hexokinase/GOD-POD",
    price: 80,
    reportTime: "4 hours",
    category: "Diabetes",
    isPopular: false,
    parameters: [
      { name: "Random Blood Glucose", unit: "mg/dL", normalRange: "<200", paramCode: "RBG" },
    ],
  },
  {
    name: "HbA1c (Glycated Hemoglobin)",
    description: "Measures average blood sugar control over the past 2-3 months. Gold standard for diabetes monitoring.\n\nSample Type: Whole Blood (EDTA)\nFasting: No\nMethod: HPLC/Immunoturbidimetry",
    price: 550,
    reportTime: "24 hours",
    category: "Diabetes",
    isPopular: true,
    parameters: [
      { name: "HbA1c", unit: "%", normalRange: "<5.7 (Normal), 5.7-6.4 (Prediabetes), ≥6.5 (Diabetes)", paramCode: "A1C" },
      { name: "Estimated Average Glucose", unit: "mg/dL", normalRange: "<117", paramCode: "EAG" },
    ],
  },
  {
    name: "Fasting Insulin",
    description: "Measures insulin levels in fasting state. Helps assess insulin resistance and beta cell function.\n\nSample Type: Serum\nFasting: Yes (10 hours)\nMethod: CLIA/ECLIA",
    price: 800,
    reportTime: "48 hours",
    category: "Diabetes",
    isPopular: false,
    parameters: [
      { name: "Fasting Insulin", unit: "µIU/mL", normalRange: "2.6-24.9", paramCode: "FINS" },
    ],
  },
  {
    name: "Liver Function Test (LFT)",
    description: "Comprehensive panel to assess liver health, function, and detect liver diseases.\n\nSample Type: Serum\nFasting: Yes (10 hours)\nMethod: Colorimetric/Kinetic",
    price: 650,
    reportTime: "24 hours",
    category: "Liver Profile",
    isPopular: true,
    parameters: [
      { name: "Bilirubin Total", unit: "mg/dL", normalRange: "0.1-1.2", paramCode: "TBIL" },
      { name: "Bilirubin Direct", unit: "mg/dL", normalRange: "0-0.3", paramCode: "DBIL" },
      { name: "Bilirubin Indirect", unit: "mg/dL", normalRange: "0.1-0.9", paramCode: "IBIL" },
      { name: "SGOT (AST)", unit: "U/L", normalRange: "10-40", paramCode: "AST" },
      { name: "SGPT (ALT)", unit: "U/L", normalRange: "7-56", paramCode: "ALT" },
      { name: "Alkaline Phosphatase (ALP)", unit: "U/L", normalRange: "44-147", paramCode: "ALP" },
      { name: "Gamma GT (GGT)", unit: "U/L", normalRange: "9-48 (M), 9-36 (F)", paramCode: "GGT" },
      { name: "Total Protein", unit: "g/dL", normalRange: "6.0-8.3", paramCode: "TP" },
      { name: "Albumin", unit: "g/dL", normalRange: "3.5-5.0", paramCode: "ALB" },
      { name: "Globulin", unit: "g/dL", normalRange: "2.0-3.5", paramCode: "GLOB" },
      { name: "A/G Ratio", unit: "", normalRange: "1.0-2.5", paramCode: "AGR" },
    ],
  },
  {
    name: "Kidney Function Test (KFT)",
    description: "Evaluates kidney health and function. Essential for detecting kidney diseases and monitoring kidney function.\n\nSample Type: Serum\nFasting: Yes (10 hours)\nMethod: Colorimetric/Enzymatic",
    price: 550,
    reportTime: "24 hours",
    category: "Kidney Profile",
    isPopular: true,
    parameters: [
      { name: "Blood Urea", unit: "mg/dL", normalRange: "15-45", paramCode: "UREA" },
      { name: "Blood Urea Nitrogen (BUN)", unit: "mg/dL", normalRange: "7-20", paramCode: "BUN" },
      { name: "Creatinine", unit: "mg/dL", normalRange: "0.6-1.2 (M), 0.5-1.1 (F)", paramCode: "CREAT" },
      { name: "Uric Acid", unit: "mg/dL", normalRange: "3.5-7.2 (M), 2.6-6.0 (F)", paramCode: "UA" },
      { name: "eGFR", unit: "mL/min/1.73m²", normalRange: ">90", paramCode: "EGFR" },
      { name: "BUN/Creatinine Ratio", unit: "", normalRange: "10-20", paramCode: "BCR" },
    ],
  },
  {
    name: "Electrolyte Panel",
    description: "Measures essential electrolytes in blood. Important for kidney function and fluid balance assessment.\n\nSample Type: Serum\nFasting: No\nMethod: Ion Selective Electrode (ISE)",
    price: 450,
    reportTime: "24 hours",
    category: "Kidney Profile",
    isPopular: true,
    parameters: [
      { name: "Sodium", unit: "mEq/L", normalRange: "136-145", paramCode: "NA" },
      { name: "Potassium", unit: "mEq/L", normalRange: "3.5-5.0", paramCode: "K" },
      { name: "Chloride", unit: "mEq/L", normalRange: "98-106", paramCode: "CL" },
      { name: "Bicarbonate", unit: "mEq/L", normalRange: "22-29", paramCode: "HCO3" },
    ],
  },
  {
    name: "Lipid Profile",
    description: "Measures cholesterol and triglyceride levels to assess cardiovascular health and heart disease risk.\n\nSample Type: Serum\nFasting: Yes (12 hours)\nMethod: Enzymatic Colorimetric",
    price: 500,
    reportTime: "24 hours",
    category: "Lipid Profile",
    isPopular: true,
    parameters: [
      { name: "Total Cholesterol", unit: "mg/dL", normalRange: "<200 (Desirable)", paramCode: "TC" },
      { name: "HDL Cholesterol", unit: "mg/dL", normalRange: ">40 (M), >50 (F)", paramCode: "HDL" },
      { name: "LDL Cholesterol", unit: "mg/dL", normalRange: "<100 (Optimal)", paramCode: "LDL" },
      { name: "VLDL Cholesterol", unit: "mg/dL", normalRange: "<30", paramCode: "VLDL" },
      { name: "Triglycerides", unit: "mg/dL", normalRange: "<150", paramCode: "TG" },
      { name: "Total Cholesterol/HDL Ratio", unit: "", normalRange: "<5", paramCode: "TCHDL" },
      { name: "LDL/HDL Ratio", unit: "", normalRange: "<3", paramCode: "LDLHDL" },
      { name: "Non-HDL Cholesterol", unit: "mg/dL", normalRange: "<130", paramCode: "NONHDL" },
    ],
  },
  {
    name: "Apolipoprotein A1",
    description: "Primary protein component of HDL cholesterol. Low levels indicate increased cardiovascular risk.\n\nSample Type: Serum\nFasting: Yes (12 hours)\nMethod: Immunoturbidimetry",
    price: 900,
    reportTime: "48 hours",
    category: "Lipid Profile",
    isPopular: false,
    parameters: [
      { name: "Apolipoprotein A1", unit: "mg/dL", normalRange: "104-202 (M), 108-225 (F)", paramCode: "APOA1" },
    ],
  },
  {
    name: "Apolipoprotein B",
    description: "Primary protein of LDL cholesterol. Elevated levels indicate increased cardiovascular risk.\n\nSample Type: Serum\nFasting: Yes (12 hours)\nMethod: Immunoturbidimetry",
    price: 900,
    reportTime: "48 hours",
    category: "Lipid Profile",
    isPopular: false,
    parameters: [
      { name: "Apolipoprotein B", unit: "mg/dL", normalRange: "66-133 (M), 60-117 (F)", paramCode: "APOB" },
    ],
  },
  {
    name: "Lipoprotein (a)",
    description: "Independent genetic risk factor for cardiovascular disease.\n\nSample Type: Serum\nFasting: Yes (12 hours)\nMethod: Immunoturbidimetry",
    price: 1200,
    reportTime: "48 hours",
    category: "Lipid Profile",
    isPopular: false,
    parameters: [
      { name: "Lipoprotein (a)", unit: "mg/dL", normalRange: "<30", paramCode: "LPA" },
    ],
  },
  {
    name: "Thyroid Profile (T3, T4, TSH)",
    description: "Comprehensive assessment of thyroid function. Detects hyperthyroidism, hypothyroidism, and other thyroid disorders.\n\nSample Type: Serum\nFasting: No\nMethod: CLIA/ECLIA",
    price: 700,
    reportTime: "24 hours",
    category: "Thyroid",
    isPopular: true,
    parameters: [
      { name: "TSH", unit: "µIU/mL", normalRange: "0.4-4.0", paramCode: "TSH" },
      { name: "Total T3", unit: "ng/dL", normalRange: "80-200", paramCode: "T3" },
      { name: "Total T4", unit: "µg/dL", normalRange: "5.0-12.0", paramCode: "T4" },
    ],
  },
  {
    name: "Free T3",
    description: "Measures unbound, active form of T3. More accurate than total T3 in certain conditions.\n\nSample Type: Serum\nFasting: No\nMethod: CLIA/ECLIA",
    price: 400,
    reportTime: "24 hours",
    category: "Thyroid",
    isPopular: false,
    parameters: [
      { name: "Free T3", unit: "pg/mL", normalRange: "2.3-4.2", paramCode: "FT3" },
    ],
  },
  {
    name: "Free T4",
    description: "Measures unbound, active form of T4. More accurate than total T4 in certain conditions.\n\nSample Type: Serum\nFasting: No\nMethod: CLIA/ECLIA",
    price: 400,
    reportTime: "24 hours",
    category: "Thyroid",
    isPopular: false,
    parameters: [
      { name: "Free T4", unit: "ng/dL", normalRange: "0.8-1.8", paramCode: "FT4" },
    ],
  },
  {
    name: "Anti-TPO Antibodies",
    description: "Detects antibodies against thyroid peroxidase. Elevated in autoimmune thyroid diseases like Hashimoto's.\n\nSample Type: Serum\nFasting: No\nMethod: CLIA/ECLIA",
    price: 800,
    reportTime: "48 hours",
    category: "Thyroid",
    isPopular: false,
    parameters: [
      { name: "Anti-TPO Antibodies", unit: "IU/mL", normalRange: "<34", paramCode: "ATPO" },
    ],
  },
  {
    name: "Anti-Thyroglobulin Antibodies",
    description: "Detects antibodies against thyroglobulin. Elevated in autoimmune thyroid diseases.\n\nSample Type: Serum\nFasting: No\nMethod: CLIA/ECLIA",
    price: 800,
    reportTime: "48 hours",
    category: "Thyroid",
    isPopular: false,
    parameters: [
      { name: "Anti-Thyroglobulin Antibodies", unit: "IU/mL", normalRange: "<115", paramCode: "ATG" },
    ],
  },
  {
    name: "Vitamin D (25-OH)",
    description: "Measures 25-hydroxyvitamin D levels. Essential for bone health and immune function.\n\nSample Type: Serum\nFasting: No\nMethod: CLIA/ECLIA",
    price: 1200,
    reportTime: "48 hours",
    category: "Vitamins",
    isPopular: true,
    parameters: [
      { name: "Vitamin D (25-OH)", unit: "ng/mL", normalRange: "30-100 (Sufficient), 20-29 (Insufficient), <20 (Deficient)", paramCode: "VITD" },
    ],
  },
  {
    name: "Vitamin B12",
    description: "Measures cobalamin levels. Essential for nerve function, red blood cell formation, and DNA synthesis.\n\nSample Type: Serum\nFasting: No\nMethod: CLIA/ECLIA",
    price: 750,
    reportTime: "48 hours",
    category: "Vitamins",
    isPopular: true,
    parameters: [
      { name: "Vitamin B12", unit: "pg/mL", normalRange: "200-900", paramCode: "B12" },
    ],
  },
  {
    name: "Folate (Folic Acid)",
    description: "Measures folate levels. Essential for DNA synthesis and red blood cell formation.\n\nSample Type: Serum\nFasting: No\nMethod: CLIA/ECLIA",
    price: 650,
    reportTime: "48 hours",
    category: "Vitamins",
    isPopular: false,
    parameters: [
      { name: "Serum Folate", unit: "ng/mL", normalRange: "3.0-17.0", paramCode: "FOL" },
    ],
  },
  {
    name: "Iron Studies",
    description: "Comprehensive iron assessment including serum iron, TIBC, and transferrin saturation.\n\nSample Type: Serum\nFasting: Yes (10 hours)\nMethod: Colorimetric",
    price: 600,
    reportTime: "24 hours",
    category: "Vitamins",
    isPopular: false,
    parameters: [
      { name: "Serum Iron", unit: "µg/dL", normalRange: "60-170 (M), 50-150 (F)", paramCode: "FE" },
      { name: "TIBC", unit: "µg/dL", normalRange: "250-400", paramCode: "TIBC" },
      { name: "Transferrin Saturation", unit: "%", normalRange: "20-50", paramCode: "TSAT" },
    ],
  },
  {
    name: "Ferritin",
    description: "Measures iron stores in the body. Best indicator of iron deficiency anemia.\n\nSample Type: Serum\nFasting: No\nMethod: CLIA/ECLIA",
    price: 550,
    reportTime: "24 hours",
    category: "Vitamins",
    isPopular: false,
    parameters: [
      { name: "Ferritin", unit: "ng/mL", normalRange: "12-300 (M), 12-150 (F)", paramCode: "FERR" },
    ],
  },
  {
    name: "Calcium",
    description: "Measures calcium levels. Essential for bones, muscles, nerves, and heart function.\n\nSample Type: Serum\nFasting: No\nMethod: Colorimetric",
    price: 150,
    reportTime: "24 hours",
    category: "Vitamins",
    isPopular: false,
    parameters: [
      { name: "Calcium", unit: "mg/dL", normalRange: "8.5-10.5", paramCode: "CA" },
    ],
  },
  {
    name: "Phosphorus",
    description: "Measures phosphorus levels. Important for bones, energy production, and kidney function.\n\nSample Type: Serum\nFasting: No\nMethod: Colorimetric",
    price: 150,
    reportTime: "24 hours",
    category: "Vitamins",
    isPopular: false,
    parameters: [
      { name: "Phosphorus", unit: "mg/dL", normalRange: "2.5-4.5", paramCode: "PHOS" },
    ],
  },
  {
    name: "Magnesium",
    description: "Measures magnesium levels. Essential for muscle function, nerve function, and heart rhythm.\n\nSample Type: Serum\nFasting: No\nMethod: Colorimetric",
    price: 200,
    reportTime: "24 hours",
    category: "Vitamins",
    isPopular: false,
    parameters: [
      { name: "Magnesium", unit: "mg/dL", normalRange: "1.7-2.4", paramCode: "MG" },
    ],
  },
  {
    name: "Troponin I",
    description: "Highly sensitive marker for heart muscle damage. Primary test for diagnosing heart attack.\n\nSample Type: Serum\nFasting: No\nMethod: CLIA/ECLIA",
    price: 1200,
    reportTime: "4 hours",
    category: "Cardiac",
    isPopular: true,
    parameters: [
      { name: "Troponin I", unit: "ng/mL", normalRange: "<0.04", paramCode: "TROPI" },
    ],
  },
  {
    name: "CK-MB",
    description: "Cardiac-specific creatine kinase. Used to diagnose heart attack and monitor heart damage.\n\nSample Type: Serum\nFasting: No\nMethod: CLIA/Immunoinhibition",
    price: 600,
    reportTime: "4 hours",
    category: "Cardiac",
    isPopular: false,
    parameters: [
      { name: "CK-MB", unit: "U/L", normalRange: "<25", paramCode: "CKMB" },
    ],
  },
  {
    name: "NT-proBNP",
    description: "Marker for heart failure. Elevated levels indicate heart strain or failure.\n\nSample Type: Serum\nFasting: No\nMethod: CLIA/ECLIA",
    price: 2500,
    reportTime: "48 hours",
    category: "Cardiac",
    isPopular: false,
    parameters: [
      { name: "NT-proBNP", unit: "pg/mL", normalRange: "<125 (Age <75), <450 (Age ≥75)", paramCode: "NTBNP" },
    ],
  },
  {
    name: "Homocysteine",
    description: "Elevated levels are a risk factor for cardiovascular disease and stroke.\n\nSample Type: Serum\nFasting: Yes (10 hours)\nMethod: CLIA/ECLIA",
    price: 1500,
    reportTime: "48 hours",
    category: "Cardiac",
    isPopular: false,
    parameters: [
      { name: "Homocysteine", unit: "µmol/L", normalRange: "5-15", paramCode: "HCY" },
    ],
  },
  {
    name: "hs-CRP (High Sensitivity CRP)",
    description: "Marker for cardiovascular inflammation. Helps assess heart disease risk.\n\nSample Type: Serum\nFasting: No\nMethod: Immunoturbidimetry",
    price: 800,
    reportTime: "24 hours",
    category: "Cardiac",
    isPopular: false,
    parameters: [
      { name: "hs-CRP", unit: "mg/L", normalRange: "<1 (Low Risk), 1-3 (Average), >3 (High Risk)", paramCode: "HSCRP" },
    ],
  },
  {
    name: "C-Reactive Protein (CRP)",
    description: "Marker for inflammation and infection. Elevated in bacterial infections and inflammatory conditions.\n\nSample Type: Serum\nFasting: No\nMethod: Immunoturbidimetry",
    price: 400,
    reportTime: "24 hours",
    category: "Infection",
    isPopular: true,
    parameters: [
      { name: "CRP", unit: "mg/L", normalRange: "<6", paramCode: "CRP" },
    ],
  },
  {
    name: "Procalcitonin",
    description: "Specific marker for bacterial sepsis. Helps differentiate bacterial from viral infections.\n\nSample Type: Serum\nFasting: No\nMethod: CLIA/ECLIA",
    price: 1800,
    reportTime: "24 hours",
    category: "Infection",
    isPopular: false,
    parameters: [
      { name: "Procalcitonin", unit: "ng/mL", normalRange: "<0.5", paramCode: "PCT" },
    ],
  },
  {
    name: "Dengue NS1 Antigen",
    description: "Early marker for dengue infection. Detectable from day 1 of fever.\n\nSample Type: Serum\nFasting: No\nMethod: ELISA/Rapid Card",
    price: 600,
    reportTime: "4 hours",
    category: "Infection",
    isPopular: true,
    parameters: [
      { name: "Dengue NS1 Antigen", unit: "", normalRange: "Negative", paramCode: "DNS1" },
    ],
  },
  {
    name: "Typhoid (Widal Test)",
    description: "Serological test for enteric (typhoid) fever.\n\nSample Type: Serum\nFasting: No\nMethod: Slide Agglutination",
    price: 250,
    reportTime: "4 hours",
    category: "Infection",
    isPopular: true,
    parameters: [
      { name: "S. Typhi O", unit: "Titre", normalRange: "<1:80", paramCode: "WIDO" },
      { name: "S. Typhi H", unit: "Titre", normalRange: "<1:80", paramCode: "WIDH" },
      { name: "S. Paratyphi AH", unit: "Titre", normalRange: "<1:80", paramCode: "WIDAH" },
      { name: "S. Paratyphi BH", unit: "Titre", normalRange: "<1:80", paramCode: "WIDBH" },
    ],
  },
  {
    name: "Malaria Parasite (MP) - Rapid",
    description: "Rapid detection of malarial antigens (P.falciparum & P.vivax).\n\nSample Type: Whole Blood (EDTA)\nFasting: No\nMethod: Rapid Card (ICT)",
    price: 250,
    reportTime: "4 hours",
    category: "Infection",
    isPopular: true,
    parameters: [
      { name: "Malaria P.f.", unit: "", normalRange: "Negative", paramCode: "MPF" },
      { name: "Malaria P.v.", unit: "", normalRange: "Negative", paramCode: "MPV" },
    ],
  },
  {
    name: "Testosterone (Total)",
    description: "Primary male sex hormone. Important for energy, libido, and muscle health assessment.\n\nSample Type: Serum\nFasting: No\nMethod: CLIA/ECLIA",
    price: 650,
    reportTime: "48 hours",
    category: "Hormones",
    isPopular: false,
    parameters: [
      { name: "Testosterone (Total)", unit: "ng/dL", normalRange: "240-870", paramCode: "TEST" },
    ],
  },
  {
    name: "Prolactin",
    description: "Reproductive hormone. Elevated levels can interfere with fertility and menstruation.\n\nSample Type: Serum\nFasting: No\nMethod: CLIA/ECLIA",
    price: 550,
    reportTime: "48 hours",
    category: "Hormones",
    isPopular: false,
    parameters: [
      { name: "Prolactin", unit: "ng/mL", normalRange: "4-15 (M), 4-23 (F)", paramCode: "PRL" },
    ],
  },
  {
    name: "LH (Luteinizing Hormone)",
    description: "Reproductive hormone. Important for fertility assessment in both men and women.\n\nSample Type: Serum\nFasting: No\nMethod: CLIA/ECLIA",
    price: 550,
    reportTime: "48 hours",
    category: "Hormones",
    isPopular: false,
    parameters: [
      { name: "LH", unit: "mIU/mL", normalRange: "1.5-9.3 (M), Varies by cycle phase (F)", paramCode: "LH" },
    ],
  },
  {
    name: "FSH (Follicle Stimulating Hormone)",
    description: "Reproductive hormone. Essential for fertility evaluation.\n\nSample Type: Serum\nFasting: No\nMethod: CLIA/ECLIA",
    price: 550,
    reportTime: "48 hours",
    category: "Hormones",
    isPopular: false,
    parameters: [
      { name: "FSH", unit: "mIU/mL", normalRange: "1.5-12.4 (M), Varies by cycle phase (F)", paramCode: "FSH" },
    ],
  },
  {
    name: "Estradiol (E2)",
    description: "Primary female sex hormone. Important for reproductive health and menopause assessment.\n\nSample Type: Serum\nFasting: No\nMethod: CLIA/ECLIA",
    price: 700,
    reportTime: "48 hours",
    category: "Hormones",
    isPopular: false,
    parameters: [
      { name: "Estradiol", unit: "pg/mL", normalRange: "Varies by cycle phase (F), 10-40 (M)", paramCode: "E2" },
    ],
  },
  {
    name: "Progesterone",
    description: "Hormone essential for pregnancy. Used to confirm ovulation and assess fertility.\n\nSample Type: Serum\nFasting: No\nMethod: CLIA/ECLIA",
    price: 650,
    reportTime: "48 hours",
    category: "Hormones",
    isPopular: false,
    parameters: [
      { name: "Progesterone", unit: "ng/mL", normalRange: "Varies by cycle phase (F), <1 (M)", paramCode: "PROG" },
    ],
  },
  {
    name: "Cortisol (Morning)",
    description: "Stress hormone produced by adrenal glands. Best measured in morning.\n\nSample Type: Serum\nFasting: Yes (10 hours)\nMethod: CLIA/ECLIA",
    price: 700,
    reportTime: "48 hours",
    category: "Hormones",
    isPopular: false,
    parameters: [
      { name: "Cortisol (8 AM)", unit: "µg/dL", normalRange: "6-23", paramCode: "CORT" },
    ],
  },
  {
    name: "DHEA-Sulfate",
    description: "Adrenal hormone. Elevated in PCOS and adrenal disorders.\n\nSample Type: Serum\nFasting: No\nMethod: CLIA/ECLIA",
    price: 900,
    reportTime: "48 hours",
    category: "Hormones",
    isPopular: false,
    parameters: [
      { name: "DHEA-S", unit: "µg/dL", normalRange: "Age and gender dependent", paramCode: "DHEAS" },
    ],
  },
  {
    name: "Parathyroid Hormone (PTH)",
    description: "Regulates calcium and phosphorus levels. Important for bone health assessment.\n\nSample Type: Serum\nFasting: No\nMethod: CLIA/ECLIA",
    price: 1200,
    reportTime: "48 hours",
    category: "Hormones",
    isPopular: false,
    parameters: [
      { name: "PTH (Intact)", unit: "pg/mL", normalRange: "15-65", paramCode: "PTH" },
    ],
  },
  {
    name: "Urine Routine Examination",
    description: "Complete physical, chemical, and microscopic examination of urine.\n\nSample Type: Urine (Midstream)\nFasting: No\nMethod: Dipstick/Microscopy",
    price: 150,
    reportTime: "4 hours",
    category: "Urine",
    isPopular: true,
    parameters: [
      { name: "Color", unit: "", normalRange: "Pale Yellow to Yellow", paramCode: "UCOL" },
      { name: "Appearance", unit: "", normalRange: "Clear", paramCode: "UAPP" },
      { name: "Specific Gravity", unit: "", normalRange: "1.005-1.030", paramCode: "USG" },
      { name: "pH", unit: "", normalRange: "4.5-8.0", paramCode: "UPH" },
      { name: "Protein", unit: "", normalRange: "Absent", paramCode: "UPRO" },
      { name: "Glucose", unit: "", normalRange: "Absent", paramCode: "UGLU" },
      { name: "Ketones", unit: "", normalRange: "Absent", paramCode: "UKET" },
      { name: "Bilirubin", unit: "", normalRange: "Absent", paramCode: "UBIL" },
      { name: "Urobilinogen", unit: "", normalRange: "Normal", paramCode: "UURO" },
      { name: "Nitrite", unit: "", normalRange: "Absent", paramCode: "UNIT" },
      { name: "Blood", unit: "", normalRange: "Absent", paramCode: "UBLD" },
      { name: "Pus Cells", unit: "/hpf", normalRange: "0-5", paramCode: "UPUS" },
      { name: "Epithelial Cells", unit: "/hpf", normalRange: "0-5", paramCode: "UEPI" },
      { name: "RBCs", unit: "/hpf", normalRange: "Absent", paramCode: "URBC" },
      { name: "Casts", unit: "/hpf", normalRange: "Absent", paramCode: "UCAST" },
      { name: "Crystals", unit: "/hpf", normalRange: "Absent", paramCode: "UCRY" },
    ],
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
