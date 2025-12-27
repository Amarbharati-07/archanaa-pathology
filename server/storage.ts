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
    const testData = [
      { id: 1, name: "Complete Blood Count (CBC)", description: "Evaluates overall health and detects a wide range of disorders.", price: 400, reportTime: "12 Hours", category: "Hematology", isPopular: true },
      { id: 2, name: "Thyroid Profile", description: "Checks thyroid function and hormone levels.", price: 600, reportTime: "24 Hours", category: "Hormones", isPopular: true },
      { id: 3, name: "Lipid Profile", description: "Measures cholesterol and triglyceride levels.", price: 800, reportTime: "12 Hours", category: "Biochemistry", isPopular: true },
      { id: 4, name: "Liver Function Test", description: "Assesses liver health and function.", price: 700, reportTime: "12 Hours", category: "Biochemistry", isPopular: false },
      { id: 5, name: "Kidney Function Test", description: "Evaluates kidney function.", price: 750, reportTime: "12 Hours", category: "Biochemistry", isPopular: false },
      { id: 6, name: "HbA1c", description: "Average blood glucose level over the past 3 months.", price: 500, reportTime: "6 Hours", category: "Diabetes", isPopular: true },
    ];
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
