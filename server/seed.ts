import { db } from "./db";
import { tests, packages, reviews } from "@shared/schema";

const SEED_TESTS = [
  {
    name: "Blood Test",
    description: "Complete blood count with differential",
    price: 500,
    reportTime: "24 hours",
    category: "Hematology",
    isPopular: true,
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=500&h=500&fit=crop",
  },
  {
    name: "Thyroid Profile",
    description: "TSH, T3, T4 levels",
    price: 800,
    reportTime: "24 hours",
    category: "Endocrinology",
    isPopular: true,
    image: "https://images.unsplash.com/photo-1579154204601-01d82b27e763?w=500&h=500&fit=crop",
  },
  {
    name: "Lipid Profile",
    description: "Cholesterol levels - HDL, LDL, Triglycerides",
    price: 600,
    reportTime: "12 hours",
    category: "Cardiology",
    isPopular: true,
    image: "https://images.unsplash.com/photo-1579154204601-01d82b27e763?w=500&h=500&fit=crop",
  },
  {
    name: "Liver Function Test",
    description: "AST, ALT, Bilirubin, Alkaline Phosphatase",
    price: 700,
    reportTime: "24 hours",
    category: "Hepatology",
    isPopular: false,
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=500&h=500&fit=crop",
  },
  {
    name: "Kidney Function Test",
    description: "Creatinine, BUN, Uric Acid",
    price: 650,
    reportTime: "24 hours",
    category: "Nephrology",
    isPopular: false,
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=500&h=500&fit=crop",
  },
  {
    name: "COVID-19 RT-PCR Test",
    description: "Real-time polymerase chain reaction",
    price: 500,
    reportTime: "12 hours",
    category: "Virology",
    isPopular: true,
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=500&h=500&fit=crop",
  },
  {
    name: "Diabetes Screening",
    description: "Fasting glucose and HbA1c",
    price: 400,
    reportTime: "24 hours",
    category: "Endocrinology",
    isPopular: true,
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=500&h=500&fit=crop",
  },
  {
    name: "Ultrasound Abdomen",
    description: "Liver, Spleen, Pancreas, Kidneys imaging",
    price: 1200,
    reportTime: "24 hours",
    category: "Imaging",
    isPopular: false,
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=500&h=500&fit=crop",
  },
  {
    name: "ECG Test",
    description: "Electrocardiogram for heart health",
    price: 300,
    reportTime: "12 hours",
    category: "Cardiology",
    isPopular: true,
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=500&h=500&fit=crop",
  },
  {
    name: "Chest X-Ray",
    description: "Lung and chest imaging",
    price: 400,
    reportTime: "24 hours",
    category: "Imaging",
    isPopular: false,
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=500&h=500&fit=crop",
  },
];

const SEED_PACKAGES = [
  {
    name: "Basic Health Checkup",
    description: "Essential tests for general health screening",
    price: 1500,
    includes: ["Blood Test", "Thyroid Profile", "ECG Test"],
    category: "Young/General",
    isFeatured: true,
    image: "https://images.unsplash.com/photo-1579154204601-01d82b27e763?w=500&h=500&fit=crop",
  },
  {
    name: "Cardiac Care Package",
    description: "Comprehensive heart health assessment",
    price: 2500,
    includes: ["Lipid Profile", "ECG Test", "Chest X-Ray"],
    category: "Men",
    isFeatured: true,
    image: "https://images.unsplash.com/photo-1579154204601-01d82b27e763?w=500&h=500&fit=crop",
  },
  {
    name: "Women's Health Package",
    description: "Tailored health tests for women",
    price: 2000,
    includes: ["Blood Test", "Thyroid Profile", "Ultrasound Abdomen"],
    category: "Women",
    isFeatured: true,
    image: "https://images.unsplash.com/photo-1579154204601-01d82b27e763?w=500&h=500&fit=crop",
  },
  {
    name: "Liver & Kidney Care",
    description: "Complete liver and kidney function tests",
    price: 1800,
    includes: ["Liver Function Test", "Kidney Function Test", "Blood Test"],
    category: "Men",
    isFeatured: false,
    image: "https://images.unsplash.com/photo-1579154204601-01d82b27e763?w=500&h=500&fit=crop",
  },
  {
    name: "Diabetes Management",
    description: "Tests for diabetes screening and monitoring",
    price: 1200,
    includes: ["Diabetes Screening", "Liver Function Test", "Kidney Function Test"],
    category: "Senior Citizen",
    isFeatured: true,
    image: "https://images.unsplash.com/photo-1579154204601-01d82b27e763?w=500&h=500&fit=crop",
  },
  {
    name: "Senior Citizen Wellness",
    description: "Comprehensive health package for seniors",
    price: 3500,
    includes: ["Blood Test", "ECG Test", "Chest X-Ray", "Ultrasound Abdomen"],
    category: "Senior Citizen",
    isFeatured: true,
    image: "https://images.unsplash.com/photo-1579154204601-01d82b27e763?w=500&h=500&fit=crop",
  },
  {
    name: "Full Body Checkup",
    description: "Complete body health assessment",
    price: 4000,
    includes: ["Blood Test", "Lipid Profile", "Liver Function Test", "Kidney Function Test", "Thyroid Profile"],
    category: "Young/General",
    isFeatured: true,
    image: "https://images.unsplash.com/photo-1579154204601-01d82b27e763?w=500&h=500&fit=crop",
  },
  {
    name: "Men's Health Package",
    description: "Specialized health tests for men",
    price: 2200,
    includes: ["Blood Test", "Lipid Profile", "ECG Test", "Prostate Health"],
    category: "Men",
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
    // Check if tests already exist
    const existingTests = await db.select().from(tests).limit(1);
    
    if (existingTests.length > 0) {
      console.log("[seed] Database already seeded, skipping...");
      return;
    }

    console.log("[seed] Starting database seeding...");

    // Insert tests
    await db.insert(tests).values(SEED_TESTS);
    console.log(`[seed] ✓ Inserted ${SEED_TESTS.length} tests`);

    // Insert packages
    await db.insert(packages).values(SEED_PACKAGES);
    console.log(`[seed] ✓ Inserted ${SEED_PACKAGES.length} packages`);

    // Insert reviews
    await db.insert(reviews).values(SEED_REVIEWS);
    console.log(`[seed] ✓ Inserted ${SEED_REVIEWS.length} reviews`);

    console.log("[seed] ✓ Database seeding completed successfully!");
  } catch (error) {
    console.error("[seed] Error seeding database:", error);
    throw error;
  }
}
