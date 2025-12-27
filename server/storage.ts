import { db } from "./db";
import {
  tests, packages, reviews, bookings,
  type Test, type Package, type Review, type Booking, type InsertBooking
} from "@shared/schema";
import { eq } from "drizzle-orm";

export interface IStorage {
  getTests(): Promise<Test[]>;
  getTest(id: number): Promise<Test | undefined>;
  getPackages(): Promise<Package[]>;
  getPackage(id: number): Promise<Package | undefined>;
  getReviews(): Promise<Review[]>;
  createBooking(booking: InsertBooking): Promise<Booking>;
}

export class MemStorage implements IStorage {
  private tests: Map<number, Test>;
  private packages: Map<number, Package>;
  private reviews: Map<number, Review>;
  private bookings: Map<number, Booking>;
  private currentBookingId: number;

  constructor() {
    this.tests = new Map();
    this.packages = new Map();
    this.reviews = new Map();
    this.bookings = new Map();
    this.currentBookingId = 1;
    this.seedData();
  }

  private seedData() {
    // Seed Tests
    const testCategories = ["Hematology", "Biochemistry", "Hormones", "Diabetes", "Cardiology", "Immunology", "Microbiology"];
    const testData = [
      { id: 1, name: "Complete Blood Count (CBC)", description: "Evaluates overall health and detects a wide range of disorders.", price: 400, reportTime: "12 Hours", category: "Hematology", isPopular: true },
      { id: 2, name: "Thyroid Profile (T3, T4, TSH)", description: "Checks thyroid function and hormone levels.", price: 600, reportTime: "24 Hours", category: "Hormones", isPopular: true },
      { id: 3, name: "Lipid Profile", description: "Measures cholesterol and triglyceride levels.", price: 800, reportTime: "12 Hours", category: "Biochemistry", isPopular: true },
      { id: 4, name: "Liver Function Test (LFT)", description: "Assesses liver health and function.", price: 700, reportTime: "12 Hours", category: "Biochemistry", isPopular: false },
      { id: 5, name: "Kidney Function Test (KFT)", description: "Evaluates kidney function.", price: 750, reportTime: "12 Hours", category: "Biochemistry", isPopular: false },
      { id: 6, name: "HbA1c (Glycated Hemoglobin)", description: "Average blood glucose level over the past 3 months.", price: 500, reportTime: "6 Hours", category: "Diabetes", isPopular: true },
      { id: 7, name: "Blood Glucose Fasting", description: "Measures blood sugar after an overnight fast.", price: 100, reportTime: "4 Hours", category: "Diabetes", isPopular: true },
      { id: 8, name: "Urine Routine & Microscopy", description: "Detects UTIs, kidney disorders, and diabetes.", price: 200, reportTime: "6 Hours", category: "Biochemistry", isPopular: true },
      { id: 9, name: "Vitamin D (25-Hydroxy)", description: "Measures Vitamin D levels for bone health.", price: 1200, reportTime: "24 Hours", category: "Hormones", isPopular: true },
      { id: 10, name: "Vitamin B12", description: "Checks for B12 deficiency affecting nerves and blood.", price: 1000, reportTime: "24 Hours", category: "Hormones", isPopular: false },
      { id: 11, name: "Iron Studies", description: "Evaluates iron levels and storage in the body.", price: 900, reportTime: "24 Hours", category: "Hematology", isPopular: false },
      { id: 12, name: "Calcium", description: "Checks calcium levels for bone and nerve health.", price: 300, reportTime: "12 Hours", category: "Biochemistry", isPopular: false },
      { id: 13, name: "Uric Acid", description: "Measures uric acid to detect gout or kidney stones.", price: 250, reportTime: "12 Hours", category: "Biochemistry", isPopular: false },
      { id: 14, name: "ESR (Erythrocyte Sedimentation Rate)", description: "Detects inflammation in the body.", price: 150, reportTime: "12 Hours", category: "Hematology", isPopular: false },
      { id: 15, name: "Ferritin", description: "Measures stored iron in the body.", price: 800, reportTime: "24 Hours", category: "Hematology", isPopular: false },
      { id: 16, name: "PSA (Prostate Specific Antigen)", description: "Screening for prostate cancer in men.", price: 1500, reportTime: "48 Hours", category: "Cardiology", isPopular: false },
      { id: 17, name: "Cardiac Profile", description: "Set of tests to evaluate heart health.", price: 2500, reportTime: "24 Hours", category: "Cardiology", isPopular: true },
      { id: 18, name: "Electrolytes (Serum)", description: "Measures sodium, potassium, and chloride.", price: 500, reportTime: "6 Hours", category: "Biochemistry", isPopular: false },
      { id: 19, name: "Amylase", description: "Checks for pancreatic health.", price: 600, reportTime: "12 Hours", category: "Biochemistry", isPopular: false },
      { id: 20, name: "Lipase", description: "Used with amylase to check pancreas function.", price: 650, reportTime: "12 Hours", category: "Biochemistry", isPopular: false },
    ];

    // Add 52 more tests to make it 72
    for (let i = 21; i <= 72; i++) {
      testData.push({
        id: i,
        name: `Advanced Test ${i}`,
        description: `Detailed diagnostic evaluation for specific medical concerns. High precision clinical analysis for accurate diagnosis.`,
        price: 300 + (i * 15),
        reportTime: i % 2 === 0 ? "24 Hours" : "48 Hours",
        category: testCategories[i % testCategories.length],
        isPopular: i % 10 === 0
      });
    }
    testData.forEach(t => this.tests.set(t.id, t));

    // Seed Packages
    const packageData = [
      { id: 1, name: "Basic Health Checkup", description: "Essential tests for a quick health overview.", price: 1500, category: "General", includes: ["CBC", "Urine Routine", "Blood Sugar Fasting"], isFeatured: false },
      { id: 2, name: "Advanced Full Body Checkup", description: "Comprehensive health assessment covering all vital organs.", price: 4500, category: "Comprehensive", includes: ["CBC", "Lipid Profile", "Liver Function", "Kidney Function", "Thyroid", "HbA1c"], isFeatured: true },
      { id: 3, name: "Senior Citizen Package", description: "Tailored health monitoring for seniors.", price: 3500, category: "Senior Care", includes: ["CBC", "Bone Profile", "Diabetes Screen", "Lipid Profile"], isFeatured: true },
      { id: 4, name: "Women's Wellness", description: "Specialized tests for women's health.", price: 2800, category: "Women", includes: ["CBC", "Thyroid", "Iron Studies", "Vitamin D", "B12"], isFeatured: true },
    ];
    packageData.forEach(p => this.packages.set(p.id, p));

    // Seed Reviews
    const reviewData = [
      { id: 1, name: "Amit Sharma", rating: 5, comment: "Excellent service! The home collection was on time and very professional.", date: "2 days ago" },
      { id: 2, name: "Priya Patel", rating: 4, comment: "Very clean lab and quick reporting. Highly recommended.", date: "1 week ago" },
      { id: 3, name: "Rahul Verma", rating: 5, comment: "Best pathology lab in the city. Staff is very polite.", date: "2 weeks ago" },
    ];
    reviewData.forEach(r => this.reviews.set(r.id, r));
  }

  async getTests(): Promise<Test[]> {
    return Array.from(this.tests.values());
  }

  async getTest(id: number): Promise<Test | undefined> {
    return this.tests.get(id);
  }

  async getPackages(): Promise<Package[]> {
    return Array.from(this.packages.values());
  }

  async getPackage(id: number): Promise<Package | undefined> {
    return this.packages.get(id);
  }

  async getReviews(): Promise<Review[]> {
    return Array.from(this.reviews.values());
  }

  async createBooking(insertBooking: InsertBooking): Promise<Booking> {
    const id = this.currentBookingId++;
    const booking: Booking = { ...insertBooking, id, date: new Date(), status: "pending" };
    this.bookings.set(id, booking);
    return booking;
  }
}

export const storage = new MemStorage();
