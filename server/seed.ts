import { db } from "./db";
import { tests, packages, reviews, admins } from "@shared/schema";
import { hashPassword } from "./auth";
import { sql } from "drizzle-orm";

// Comprehensive All-India Standard Lab Tests Directory
const SEED_TESTS = [
  // ==================== HEMATOLOGY ====================
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
  // ==================== DIABETES TESTS ====================
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
    name: "HbA1c (Glycated Hemoglobin)",
    description: "Measures average blood sugar control over the past 2-3 months. Gold standard for diabetes monitoring.\n\nSample Type: Whole Blood (EDTA)\nFasting: No\nMethod: HPLC/Immunoturbidimetry",
    price: 550,
    reportTime: "24 hours",
    category: "Diabetes",
    isPopular: true,
  },
  // ==================== LIVER PROFILE (LFT) ====================
  {
    name: "Liver Function Test (LFT)",
    description: "Comprehensive panel to assess liver health, function, and detect liver diseases.\n\nSample Type: Serum\nFasting: Yes (10 hours)\nMethod: Colorimetric/Kinetic",
    price: 650,
    reportTime: "24 hours",
    category: "Hepatology",
    isPopular: true,
  },
  // ==================== KIDNEY PROFILE (KFT) ====================
  {
    name: "Kidney Function Test (KFT)",
    description: "Evaluates kidney health and function. Essential for detecting kidney diseases and monitoring kidney function.\n\nSample Type: Serum\nFasting: Yes (10 hours)\nMethod: Colorimetric/Enzymatic",
    price: 550,
    reportTime: "24 hours",
    category: "Nephrology",
    isPopular: true,
  },
  {
    name: "Electrolyte Panel",
    description: "Measures essential electrolytes in blood. Important for kidney function and fluid balance assessment.\n\nSample Type: Serum\nFasting: No\nMethod: Ion Selective Electrode (ISE)",
    price: 450,
    reportTime: "24 hours",
    category: "Nephrology",
    isPopular: true,
  },
  // ==================== LIPID PROFILE ====================
  {
    name: "Lipid Profile",
    description: "Measures cholesterol and triglyceride levels to assess cardiovascular health and heart disease risk.\n\nSample Type: Serum\nFasting: Yes (12 hours)\nMethod: Enzymatic Colorimetric",
    price: 500,
    reportTime: "24 hours",
    category: "Cardiology",
    isPopular: true,
  },
  // ==================== THYROID PROFILE ====================
  {
    name: "Thyroid Profile (T3, T4, TSH)",
    description: "Complete thyroid hormone assessment.\n\nSample Type: Serum\nFasting: No\nMethod: CLIA/ECLIA",
    price: 700,
    reportTime: "24 hours",
    category: "Endocrinology",
    isPopular: true,
  },
];

const SEED_PACKAGES = [
  {
    name: "Men's Basic Health Checkup",
    description: "Essential health screening package for men covering basic parameters for overall health assessment.",
    price: 1080, // 1800 * 0.6
    includes: ["Complete Blood Count (CBC)", "Blood Sugar Fasting", "Lipid Profile", "Liver Function Test (LFT)", "Kidney Function Test (KFT)", "Thyroid Profile (T3, T4, TSH)"],
    category: "Men",
    isFeatured: true,
  },
  {
    name: "Women's Basic Health Checkup",
    description: "Essential health screening package for women covering basic parameters for overall health assessment.",
    price: 1200, // 2000 * 0.6
    includes: ["Complete Blood Count (CBC)", "Blood Sugar Fasting", "Lipid Profile", "Liver Function Test (LFT)", "Kidney Function Test (KFT)", "Thyroid Profile (T3, T4, TSH)"],
    category: "Women",
    isFeatured: true,
  },
  {
    name: "Young Adult Health Checkup",
    description: "Basic health screening package for young adults aged 18-35 years.",
    price: 825, // 1500 * 0.55
    includes: ["Complete Blood Count (CBC)", "Blood Sugar Fasting", "Lipid Profile", "Thyroid Profile (T3, T4, TSH)"],
    category: "Young/General",
    isFeatured: true,
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
