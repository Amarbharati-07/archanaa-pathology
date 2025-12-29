import { db } from "./db";
import { eq, and } from "drizzle-orm";
import {
  users, admins, tests, packages, reviews, bookings, payments, reports, walkInCollections,
  type User, type Admin, type Test, type Package, type Review, type Booking, type Payment, type Report,
  type RegisterInput, type LoginInput, type AdminLoginInput,
} from "@shared/schema";

export interface IStorage {
  // Users
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserById(id: number): Promise<User | undefined>;
  createUser(data: RegisterInput): Promise<User>;
  getAllUsers(): Promise<User[]>;

  // Admins
  getAdminByEmail(email: string): Promise<Admin | undefined>;
  getAdminById(id: number): Promise<Admin | undefined>;
  createAdmin(email: string, password: string, name: string): Promise<Admin>;

  // Tests
  getTests(): Promise<Test[]>;
  getTest(id: number): Promise<Test | undefined>;
  createTest(data: any): Promise<Test>;
  updateTest(id: number, data: any): Promise<Test | undefined>;
  deleteTest(id: number): Promise<boolean>;

  // Packages
  getPackages(): Promise<Package[]>;
  getPackage(id: number): Promise<Package | undefined>;
  createPackage(data: any): Promise<Package>;
  updatePackage(id: number, data: any): Promise<Package | undefined>;
  deletePackage(id: number): Promise<boolean>;

  // Reviews
  getReviews(): Promise<Review[]>;

  // Bookings
  createBooking(userId: number, data: any): Promise<Booking>;
  getBookingsByUser(userId: number): Promise<Booking[]>;
  getAllBookings(): Promise<Booking[]>;
  getBookingById(id: number): Promise<Booking | undefined>;
  updateBookingStatus(id: number, testStatus: string, paymentStatus?: string): Promise<Booking | undefined>;
  updatePaymentStatus(bookingId: number, paymentStatus: string): Promise<Booking | undefined>;

  // Payments
  getPaymentsByUser(userId: number): Promise<Payment[]>;
  createPayment(userId: number, bookingId: number, amount: number, transactionId: string): Promise<Payment>;

  // Reports
  getReportsByUser(userId: number): Promise<Report[]>;
  getAllReports(): Promise<Report[]>;
  createReport(data: any): Promise<Report>;
  createWalkInCollection(reportId: number, doctorName: string, clinicName: string): Promise<any>;
  getWalkInCollectionsByDoctor(doctorName: string): Promise<any[]>;
  getAllWalkInCollections(): Promise<any[]>;
}

export class DatabaseStorage implements IStorage {
  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.email, email));
    return result[0];
  }

  async getUserById(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async createUser(data: RegisterInput): Promise<User> {
    const result = await db.insert(users).values(data).returning();
    return result[0];
  }

  async getAllUsers(): Promise<User[]> {
    return db.select().from(users);
  }

  async getAdminByEmail(email: string): Promise<Admin | undefined> {
    const result = await db.select().from(admins).where(eq(admins.email, email));
    return result[0];
  }

  async getAdminById(id: number): Promise<Admin | undefined> {
    const result = await db.select().from(admins).where(eq(admins.id, id));
    return result[0];
  }

  async createAdmin(email: string, password: string, name: string): Promise<Admin> {
    const result = await db.insert(admins).values({ email, password, name }).returning();
    return result[0];
  }

  async getTests(): Promise<Test[]> {
    return db.select().from(tests);
  }

  async getTest(id: number): Promise<Test | undefined> {
    const result = await db.select().from(tests).where(eq(tests.id, id));
    return result[0];
  }

  async createTest(data: any): Promise<Test> {
    const result = await db.insert(tests).values(data).returning();
    return result[0];
  }

  async updateTest(id: number, data: any): Promise<Test | undefined> {
    const result = await db.update(tests).set(data).where(eq(tests.id, id)).returning();
    return result[0];
  }

  async deleteTest(id: number): Promise<boolean> {
    await db.delete(tests).where(eq(tests.id, id));
    return true;
  }

  async getPackages(): Promise<Package[]> {
    return db.select().from(packages);
  }

  async getPackage(id: number): Promise<Package | undefined> {
    const result = await db.select().from(packages).where(eq(packages.id, id));
    return result[0];
  }

  async createPackage(data: any): Promise<Package> {
    const result = await db.insert(packages).values(data).returning();
    return result[0];
  }

  async updatePackage(id: number, data: any): Promise<Package | undefined> {
    const result = await db.update(packages).set(data).where(eq(packages.id, id)).returning();
    return result[0];
  }

  async deletePackage(id: number): Promise<boolean> {
    await db.delete(packages).where(eq(packages.id, id));
    return true;
  }

  async getReviews(): Promise<Review[]> {
    return db.select().from(reviews);
  }

  async createBooking(userId: number, data: any): Promise<Booking> {
    const result = await db.insert(bookings).values({ userId, ...data }).returning();
    return result[0];
  }

  async getBookingsByUser(userId: number): Promise<Booking[]> {
    return db.select().from(bookings).where(eq(bookings.userId, userId));
  }

  async getAllBookings(): Promise<Booking[]> {
    return db.select().from(bookings);
  }

  async getBookingById(id: number): Promise<Booking | undefined> {
    const result = await db.select().from(bookings).where(eq(bookings.id, id));
    return result[0];
  }

  async updateBookingStatus(id: number, testStatus: string, paymentStatus?: string): Promise<Booking | undefined> {
    const updates: any = { testStatus };
    if (paymentStatus) updates.paymentStatus = paymentStatus;
    const result = await db.update(bookings).set(updates).where(eq(bookings.id, id)).returning();
    return result[0];
  }

  async updatePaymentStatus(bookingId: number, paymentStatus: string): Promise<Booking | undefined> {
    const result = await db.update(bookings).set({ paymentStatus }).where(eq(bookings.id, bookingId)).returning();
    return result[0];
  }

  async getPaymentsByUser(userId: number): Promise<Payment[]> {
    return db.select().from(payments).where(eq(payments.userId, userId));
  }

  async createPayment(userId: number, bookingId: number, amount: number, transactionId: string): Promise<Payment> {
    const result = await db.insert(payments).values({ userId, bookingId, amount, transactionId }).returning();
    return result[0];
  }

  async getReportsByUser(userId: number): Promise<Report[]> {
    return db.select().from(reports).where(eq(reports.userId, userId));
  }

  async getAllReports(): Promise<Report[]> {
    return db.select().from(reports);
  }

  async createReport(data: any): Promise<Report> {
    const result = await db.insert(reports).values({
      userId: data.userId,
      bookingId: data.bookingId,
      testId: data.testId || null,
      packageId: data.packageId || null,
      testName: data.testName,
      resultSummary: data.resultSummary || "Completed",
      doctorRemarks: data.doctorRemarks || "",
      parameters: data.parameters || [],
      technicianName: data.technicianName || "",
      referredBy: data.referredBy || "",
      clinicalRemarks: data.clinicalRemarks || "",
    }).returning();
    return result[0];
  }

  async createWalkInCollection(reportId: number, doctorName: string, clinicName: string): Promise<any> {
    const result = await db.insert(walkInCollections).values({ reportId, doctorName, clinicName }).returning();
    return result[0];
  }

  async getWalkInCollectionsByDoctor(doctorName: string): Promise<any[]> {
    const collections = await db.select().from(walkInCollections).where(eq(walkInCollections.doctorName, doctorName));
    // Join with reports to get full details
    return Promise.all(collections.map(async (collection) => {
      const report = await db.select().from(reports).where(eq(reports.id, collection.reportId));
      return { ...collection, report: report[0] };
    }));
  }

  async getAllWalkInCollections(): Promise<any[]> {
    const collections = await db.select().from(walkInCollections);
    // Join with reports to get full details
    return Promise.all(collections.map(async (collection) => {
      const report = await db.select().from(reports).where(eq(reports.id, collection.reportId));
      const user = report[0] ? await db.select().from(users).where(eq(users.id, report[0].userId)) : null;
      return {
        ...collection,
        report: report[0],
        patientName: user?.[0]?.name || report?.[0]?.testName || 'N/A',
        patientPhone: user?.[0]?.phone || 'N/A',
        testName: report?.[0]?.testName || 'N/A'
      };
    }));
  }
}

export const storage = new DatabaseStorage();
