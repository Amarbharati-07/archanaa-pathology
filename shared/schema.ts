import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// === TABLE DEFINITIONS ===

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  phone: text("phone").notNull(),
  gender: text("gender").notNull(),
  age: integer("age").notNull(),
  address: text("address").default(""),
  createdAt: timestamp("created_at").defaultNow(),
});

export const admins = pgTable("admins", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const tests = pgTable("tests", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: integer("price").notNull(),
  reportTime: text("report_time").notNull(),
  category: text("category").notNull(),
  isPopular: boolean("is_popular").default(false),
  image: text("image"),
  parameters: jsonb("parameters").default([]),
  createdAt: timestamp("created_at").defaultNow(),
});

export const packages = pgTable("packages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: integer("price").notNull(),
  includes: text("includes").array(),
  category: text("category").notNull(),
  isFeatured: boolean("is_featured").default(false),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  rating: integer("rating").notNull(),
  comment: text("comment").notNull(),
  date: text("date").notNull(),
});

export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  testId: integer("test_id"),
  packageId: integer("package_id"),
  date: timestamp("date").notNull(),
  time: text("time").notNull(),
  totalAmount: integer("total_amount").notNull(),
  paymentStatus: text("payment_status").default("pending"),
  testStatus: text("test_status").default("booked"),
  bookingMode: text("booking_mode").default("lab_visit"),
  address: text("address").default(""),
  distance: integer("distance").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const payments = pgTable("payments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  bookingId: integer("booking_id").notNull(),
  amount: integer("amount").notNull(),
  status: text("status").default("pending"),
  transactionId: text("transaction_id").unique(),
  date: timestamp("date").defaultNow(),
});

export const reports = pgTable("reports", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  bookingId: integer("booking_id").notNull(),
  testId: integer("test_id"), // Nullable for packages
  packageId: integer("package_id"), // Added for package reports
  testName: text("test_name").notNull(),
  resultSummary: text("result_summary").notNull(),
  doctorRemarks: text("doctor_remarks").default(""),
  parameters: jsonb("parameters").notNull(), // List of { name, result, unit, normalRange, status }
  technicianName: text("technician_name"),
  referredBy: text("referred_by"),
  clinicalRemarks: text("clinical_remarks"),
  signaturePath: text("signature_path"),
  reportPath: text("report_path"),
  uploadDate: timestamp("upload_date").defaultNow(),
});

export const walkInCollections = pgTable("walk_in_collections", {
  id: serial("id").primaryKey(),
  reportId: integer("report_id").notNull(),
  doctorName: text("doctor_name").notNull(),
  clinicName: text("clinic_name").notNull(),
  collectionDate: timestamp("collection_date").defaultNow(),
});

// === SCHEMAS ===

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone: z.string().min(10, "Phone must be at least 10 digits"),
  gender: z.enum(["male", "female", "other"]),
  age: z.number().min(1).max(150),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password required"),
});

export const adminLoginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password required"),
});

export const insertTestSchema = z.object({
  name: z.string().min(1, "Name required"),
  description: z.string().min(1, "Description required"),
  price: z.number().min(1, "Price must be positive"),
  reportTime: z.string().min(1, "Report time required"),
  category: z.string().min(1, "Category required"),
  isPopular: z.boolean().optional(),
  image: z.string().optional(),
});

export const insertPackageSchema = z.object({
  name: z.string().min(1, "Name required"),
  description: z.string().min(1, "Description required"),
  price: z.number().min(1, "Price must be positive"),
  includes: z.array(z.string()).min(1, "Must include at least one test"),
  category: z.string().min(1, "Category required"),
  isFeatured: z.boolean().optional(),
  image: z.string().optional(),
});

export const createBookingSchema = z.object({
  testId: z.number().optional(),
  packageId: z.number().optional(),
  date: z.string().min(1, "Date required").transform(d => new Date(d)),
  time: z.string().min(1, "Time required"),
  totalAmount: z.number().min(1, "Amount must be positive"),
  bookingMode: z.enum(["home_collection", "lab_visit"]).default("lab_visit"),
  address: z.string().optional(),
  distance: z.number().optional(),
});

// === TYPES ===

export type User = typeof users.$inferSelect;
export type Admin = typeof admins.$inferSelect;
export type Test = typeof tests.$inferSelect;
export type Package = typeof packages.$inferSelect;
export type Review = typeof reviews.$inferSelect;
export type Booking = typeof bookings.$inferSelect;
export type Payment = typeof payments.$inferSelect;
export type Report = typeof reports.$inferSelect;

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type AdminLoginInput = z.infer<typeof adminLoginSchema>;
