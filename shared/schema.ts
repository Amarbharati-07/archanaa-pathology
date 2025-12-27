import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// === TABLE DEFINITIONS ===

export const tests = pgTable("tests", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: integer("price").notNull(),
  reportTime: text("report_time").notNull(),
  category: text("category").notNull(),
  isPopular: boolean("is_popular").default(false),
  image: text("image"),
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
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  address: text("address").notNull(),
  items: jsonb("items").notNull(), // Stores array of { type: 'test'|'package', id: number, name: string, price: number }
  totalAmount: integer("total_amount").notNull(),
  date: timestamp("date").defaultNow(),
  status: text("status").default("pending"),
});

// === SCHEMAS ===

export const insertTestSchema = createInsertSchema(tests).omit({ id: true });
export const insertPackageSchema = createInsertSchema(packages).omit({ id: true });
export const insertReviewSchema = createInsertSchema(reviews).omit({ id: true });
export const insertBookingSchema = createInsertSchema(bookings).omit({ id: true, date: true, status: true });

// === TYPES ===

export type Test = typeof tests.$inferSelect;
export type Package = typeof packages.$inferSelect;
export type Review = typeof reviews.$inferSelect;
export type Booking = typeof bookings.$inferSelect;
export type InsertBooking = z.infer<typeof insertBookingSchema>;
