import { db } from "./db";
import { tests, packages, reviews } from "@shared/schema";

const SEED_TESTS = [
  // Blood Group & RBC Tests
  {
    name: "Complete Blood Count (CBC)",
    description: "Total WBC, RBC, Hemoglobin, Hematocrit, Platelets, MCV, MCH, MCHC",
    price: 500,
    reportTime: "24 hours",
    category: "Hematology",
    isPopular: true,
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=500&h=500&fit=crop",
  },
  {
    name: "Blood Group & RH Factor",
    description: "ABO and Rh typing with group compatibility",
    price: 300,
    reportTime: "2 hours",
    category: "Hematology",
    isPopular: true,
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=500&h=500&fit=crop",
  },
  {
    name: "Reticulocyte Count",
    description: "Immature RBC count for bone marrow function",
    price: 400,
    reportTime: "24 hours",
    category: "Hematology",
    isPopular: false,
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=500&h=500&fit=crop",
  },
  {
    name: "Peripheral Blood Smear",
    description: "Morphological examination of blood cells",
    price: 350,
    reportTime: "24 hours",
    category: "Hematology",
    isPopular: false,
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=500&h=500&fit=crop",
  },

  // Hemoglobin & Iron Tests
  {
    name: "Hemoglobin (Hb)",
    description: "Total hemoglobin level measurement",
    price: 200,
    reportTime: "2 hours",
    category: "Hematology",
    isPopular: true,
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=500&h=500&fit=crop",
  },
  {
    name: "Iron Studies",
    description: "Serum Iron, TIBC, Ferritin, Transferrin",
    price: 800,
    reportTime: "24 hours",
    category: "Hematology",
    isPopular: false,
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=500&h=500&fit=crop",
  },

  // Coagulation Tests
  {
    name: "PT & INR",
    description: "Prothrombin Time & International Normalized Ratio",
    price: 400,
    reportTime: "24 hours",
    category: "Coagulation",
    isPopular: true,
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=500&h=500&fit=crop",
  },
  {
    name: "aPTT",
    description: "Activated Partial Thromboplastin Time",
    price: 400,
    reportTime: "24 hours",
    category: "Coagulation",
    isPopular: true,
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=500&h=500&fit=crop",
  },
  {
    name: "Bleeding Time & Clotting Time",
    description: "Assessment of hemostatic function",
    price: 300,
    reportTime: "24 hours",
    category: "Coagulation",
    isPopular: false,
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=500&h=500&fit=crop",
  },

  // Liver Function Tests
  {
    name: "Liver Function Test (LFT)",
    description: "AST, ALT, ALP, Total Bilirubin, Direct Bilirubin, Albumin, Globulin",
    price: 700,
    reportTime: "24 hours",
    category: "Hepatology",
    isPopular: true,
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=500&h=500&fit=crop",
  },
  {
    name: "GGT (Gamma Glutamyl Transferase)",
    description: "Liver enzyme assessment",
    price: 350,
    reportTime: "24 hours",
    category: "Hepatology",
    isPopular: false,
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=500&h=500&fit=crop",
  },

  // Kidney Function Tests
  {
    name: "Kidney Function Test (KFT)",
    description: "Creatinine, BUN, Uric Acid, eGFR",
    price: 650,
    reportTime: "24 hours",
    category: "Nephrology",
    isPopular: true,
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=500&h=500&fit=crop",
  },
  {
    name: "Electrolytes Panel",
    description: "Sodium, Potassium, Chloride, CO2",
    price: 600,
    reportTime: "24 hours",
    category: "Nephrology",
    isPopular: true,
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=500&h=500&fit=crop",
  },

  // Thyroid Tests
  {
    name: "Thyroid Profile (T3, T4, TSH)",
    description: "Complete thyroid hormone assessment",
    price: 800,
    reportTime: "24 hours",
    category: "Endocrinology",
    isPopular: true,
    image: "https://images.unsplash.com/photo-1579154204601-01d82b27e763?w=500&h=500&fit=crop",
  },
  {
    name: "Free T3 & Free T4",
    description: "Free thyroid hormones measurement",
    price: 900,
    reportTime: "24 hours",
    category: "Endocrinology",
    isPopular: false,
    image: "https://images.unsplash.com/photo-1579154204601-01d82b27e763?w=500&h=500&fit=crop",
  },
  {
    name: "TSH (Thyroid Stimulating Hormone)",
    description: "Primary thyroid screening test",
    price: 400,
    reportTime: "24 hours",
    category: "Endocrinology",
    isPopular: true,
    image: "https://images.unsplash.com/photo-1579154204601-01d82b27e763?w=500&h=500&fit=crop",
  },

  // Lipid Profile
  {
    name: "Lipid Profile",
    description: "Total Cholesterol, HDL, LDL, Triglycerides",
    price: 600,
    reportTime: "12 hours",
    category: "Cardiology",
    isPopular: true,
    image: "https://images.unsplash.com/photo-1579154204601-01d82b27e763?w=500&h=500&fit=crop",
  },

  // Diabetes Tests
  {
    name: "Fasting Blood Glucose",
    description: "Blood sugar level after 8-10 hours fasting",
    price: 250,
    reportTime: "2 hours",
    category: "Endocrinology",
    isPopular: true,
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=500&h=500&fit=crop",
  },
  {
    name: "Post Meal Blood Glucose",
    description: "Blood sugar level 2 hours after meal",
    price: 250,
    reportTime: "2 hours",
    category: "Endocrinology",
    isPopular: true,
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=500&h=500&fit=crop",
  },
  {
    name: "HbA1c (Glycated Hemoglobin)",
    description: "Average blood sugar over 2-3 months",
    price: 400,
    reportTime: "24 hours",
    category: "Endocrinology",
    isPopular: true,
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=500&h=500&fit=crop",
  },
  {
    name: "GTT (Glucose Tolerance Test)",
    description: "Diabetes screening test",
    price: 600,
    reportTime: "24 hours",
    category: "Endocrinology",
    isPopular: false,
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=500&h=500&fit=crop",
  },

  // Protein Tests
  {
    name: "Total Protein & Albumin",
    description: "Serum protein fractionation",
    price: 400,
    reportTime: "24 hours",
    category: "Biochemistry",
    isPopular: false,
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=500&h=500&fit=crop",
  },

  // Muscle & Bone Tests
  {
    name: "Calcium & Phosphorus",
    description: "Minerals for bone health assessment",
    price: 350,
    reportTime: "24 hours",
    category: "Biochemistry",
    isPopular: false,
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=500&h=500&fit=crop",
  },
  {
    name: "Alkaline Phosphatase (ALP)",
    description: "Bone and liver enzyme",
    price: 300,
    reportTime: "24 hours",
    category: "Biochemistry",
    isPopular: false,
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=500&h=500&fit=crop",
  },
  {
    name: "Uric Acid",
    description: "Gout and kidney function marker",
    price: 300,
    reportTime: "24 hours",
    category: "Biochemistry",
    isPopular: false,
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=500&h=500&fit=crop",
  },

  // Cardiac Markers
  {
    name: "Troponin I & T",
    description: "Heart attack markers",
    price: 1000,
    reportTime: "4 hours",
    category: "Cardiology",
    isPopular: false,
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=500&h=500&fit=crop",
  },
  {
    name: "CK-MB (Creatine Kinase)",
    description: "Muscle damage enzyme",
    price: 600,
    reportTime: "24 hours",
    category: "Cardiology",
    isPopular: false,
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=500&h=500&fit=crop",
  },
  {
    name: "LDH (Lactate Dehydrogenase)",
    description: "Cell damage enzyme",
    price: 400,
    reportTime: "24 hours",
    category: "Cardiology",
    isPopular: false,
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=500&h=500&fit=crop",
  },

  // Inflammatory Markers
  {
    name: "CRP (C-Reactive Protein)",
    description: "Inflammation marker",
    price: 400,
    reportTime: "24 hours",
    category: "Immunology",
    isPopular: true,
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=500&h=500&fit=crop",
  },
  {
    name: "ESR (Erythrocyte Sedimentation Rate)",
    description: "Inflammation assessment",
    price: 250,
    reportTime: "24 hours",
    category: "Immunology",
    isPopular: true,
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=500&h=500&fit=crop",
  },

  // Infectious Disease Tests
  {
    name: "COVID-19 RT-PCR",
    description: "SARS-CoV-2 detection",
    price: 600,
    reportTime: "24 hours",
    category: "Virology",
    isPopular: true,
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=500&h=500&fit=crop",
  },
  {
    name: "COVID-19 Antigen Test",
    description: "Rapid COVID-19 detection",
    price: 400,
    reportTime: "30 minutes",
    category: "Virology",
    isPopular: true,
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=500&h=500&fit=crop",
  },
  {
    name: "COVID-19 Antibody (IgG, IgM)",
    description: "COVID-19 immunity assessment",
    price: 500,
    reportTime: "24 hours",
    category: "Virology",
    isPopular: true,
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=500&h=500&fit=crop",
  },
  {
    name: "HIV 1 & 2 Test",
    description: "HIV screening with 4th generation test",
    price: 800,
    reportTime: "24 hours",
    category: "Virology",
    isPopular: false,
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=500&h=500&fit=crop",
  },
  {
    name: "Hepatitis B (HBsAg)",
    description: "Hepatitis B surface antigen",
    price: 600,
    reportTime: "24 hours",
    category: "Virology",
    isPopular: false,
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=500&h=500&fit=crop",
  },
  {
    name: "Hepatitis C (Anti-HCV)",
    description: "Hepatitis C antibody test",
    price: 600,
    reportTime: "24 hours",
    category: "Virology",
    isPopular: false,
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=500&h=500&fit=crop",
  },
  {
    name: "Typhoid (Widal Test)",
    description: "Salmonella typhi antibodies",
    price: 400,
    reportTime: "24 hours",
    category: "Virology",
    isPopular: false,
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=500&h=500&fit=crop",
  },

  // Hormone Tests
  {
    name: "Testosterone",
    description: "Total testosterone level",
    price: 700,
    reportTime: "24 hours",
    category: "Endocrinology",
    isPopular: false,
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=500&h=500&fit=crop",
  },
  {
    name: "FSH & LH",
    description: "Reproductive hormones",
    price: 800,
    reportTime: "24 hours",
    category: "Endocrinology",
    isPopular: false,
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=500&h=500&fit=crop",
  },
  {
    name: "Prolactin",
    description: "Prolactin hormone level",
    price: 600,
    reportTime: "24 hours",
    category: "Endocrinology",
    isPopular: false,
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=500&h=500&fit=crop",
  },

  // Tumor Markers
  {
    name: "PSA (Prostate Specific Antigen)",
    description: "Prostate cancer screening",
    price: 700,
    reportTime: "24 hours",
    category: "Oncology",
    isPopular: true,
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=500&h=500&fit=crop",
  },
  {
    name: "CEA (Carcinoembryonic Antigen)",
    description: "Colon and lung cancer marker",
    price: 800,
    reportTime: "24 hours",
    category: "Oncology",
    isPopular: false,
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=500&h=500&fit=crop",
  },
  {
    name: "CA-125",
    description: "Ovarian cancer marker",
    price: 800,
    reportTime: "24 hours",
    category: "Oncology",
    isPopular: false,
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=500&h=500&fit=crop",
  },
];

const SEED_PACKAGES = [
  {
    name: "Basic Health Checkup",
    description: "Essential tests for general health screening",
    price: 1500,
    includes: ["Complete Blood Count (CBC)", "Fasting Blood Glucose", "Thyroid Profile (T3, T4, TSH)"],
    category: "Young/General",
    isFeatured: true,
    image: "https://images.unsplash.com/photo-1579154204601-01d82b27e763?w=500&h=500&fit=crop",
  },
  {
    name: "Cardiac Care Package",
    description: "Comprehensive heart health assessment",
    price: 2500,
    includes: ["Lipid Profile", "Troponin I & T", "LDH (Lactate Dehydrogenase)"],
    category: "Men",
    isFeatured: true,
    image: "https://images.unsplash.com/photo-1579154204601-01d82b27e763?w=500&h=500&fit=crop",
  },
  {
    name: "Women's Health Package",
    description: "Tailored health tests for women",
    price: 2000,
    includes: ["Complete Blood Count (CBC)", "Thyroid Profile (T3, T4, TSH)", "FSH & LH"],
    category: "Women",
    isFeatured: true,
    image: "https://images.unsplash.com/photo-1579154204601-01d82b27e763?w=500&h=500&fit=crop",
  },
  {
    name: "Liver & Kidney Care",
    description: "Complete liver and kidney function tests",
    price: 1800,
    includes: ["Liver Function Test (LFT)", "Kidney Function Test (KFT)", "Electrolytes Panel"],
    category: "Men",
    isFeatured: false,
    image: "https://images.unsplash.com/photo-1579154204601-01d82b27e763?w=500&h=500&fit=crop",
  },
  {
    name: "Diabetes Management",
    description: "Tests for diabetes screening and monitoring",
    price: 1200,
    includes: ["Fasting Blood Glucose", "HbA1c (Glycated Hemoglobin)", "Kidney Function Test (KFT)"],
    category: "Senior Citizen",
    isFeatured: true,
    image: "https://images.unsplash.com/photo-1579154204601-01d82b27e763?w=500&h=500&fit=crop",
  },
  {
    name: "Senior Citizen Wellness",
    description: "Comprehensive health package for seniors",
    price: 3500,
    includes: ["Complete Blood Count (CBC)", "Liver Function Test (LFT)", "Kidney Function Test (KFT)", "Lipid Profile"],
    category: "Senior Citizen",
    isFeatured: true,
    image: "https://images.unsplash.com/photo-1579154204601-01d82b27e763?w=500&h=500&fit=crop",
  },
  {
    name: "Full Body Checkup",
    description: "Complete body health assessment",
    price: 4000,
    includes: ["Complete Blood Count (CBC)", "Liver Function Test (LFT)", "Kidney Function Test (KFT)", "Lipid Profile", "HbA1c (Glycated Hemoglobin)"],
    category: "Young/General",
    isFeatured: true,
    image: "https://images.unsplash.com/photo-1579154204601-01d82b27e763?w=500&h=500&fit=crop",
  },
  {
    name: "Men's Health Package",
    description: "Specialized health tests for men",
    price: 2200,
    includes: ["Complete Blood Count (CBC)", "Lipid Profile", "PSA (Prostate Specific Antigen)", "Testosterone"],
    category: "Men",
    isFeatured: true,
    image: "https://images.unsplash.com/photo-1579154204601-01d82b27e763?w=500&h=500&fit=crop",
  },
  {
    name: "Infection Screening Package",
    description: "Tests for common infectious diseases",
    price: 2000,
    includes: ["HIV 1 & 2 Test", "Hepatitis B (HBsAg)", "Hepatitis C (Anti-HCV)"],
    category: "Young/General",
    isFeatured: false,
    image: "https://images.unsplash.com/photo-1579154204601-01d82b27e763?w=500&h=500&fit=crop",
  },
  {
    name: "COVID-19 Complete Test",
    description: "Multiple COVID-19 testing options",
    price: 1200,
    includes: ["COVID-19 RT-PCR", "COVID-19 Antigen Test", "COVID-19 Antibody (IgG, IgM)"],
    category: "Young/General",
    isFeatured: true,
    image: "https://images.unsplash.com/photo-1579154204601-01d82b27e763?w=500&h=500&fit=crop",
  },
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
  },
];

export async function seedDatabase() {
  try {
    console.log("[seed] Starting database seeding...");

    // Only seed if tables are empty (don't clear existing data)
    const existingTests = await db.select().from(tests).limit(1);
    
    if (existingTests.length === 0) {
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
    } else {
      console.log("[seed] Database already seeded, skipping...");
    }

    console.log("[seed] ✓ Database ready!");
  } catch (error) {
    console.error("[seed] Error seeding database:", error);
    throw error;
  }
}
