import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import {
  hashPassword, comparePassword, generateUserToken, generateAdminToken,
  authUserMiddleware, authAdminMiddleware, type AuthRequest
} from "./auth";
import {
  registerSchema, loginSchema, adminLoginSchema, insertTestSchema,
  insertPackageSchema, createBookingSchema
} from "@shared/schema";
import { log } from "./index";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // ============ USER AUTHENTICATION ============
  
  // User Register
  app.post("/api/auth/register", async (req, res) => {
    try {
      const data = registerSchema.parse(req.body);
      
      // Check if email already exists
      const existing = await storage.getUserByEmail(data.email);
      if (existing) {
        return res.status(400).json({ message: "Email already registered" });
      }

      // Hash password
      const hashedPassword = await hashPassword(data.password);
      const user = await storage.createUser({ ...data, password: hashedPassword });
      
      const token = generateUserToken(user.id, user.email);
      res.status(201).json({ token, user: { id: user.id, email: user.email, name: user.name, phone: user.phone, gender: user.gender, age: user.age, address: user.address } });
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      res.status(500).json({ message: err.message });
    }
  });

  // User Login
  app.post("/api/auth/login", async (req, res) => {
    try {
      const data = loginSchema.parse(req.body);
      
      const user = await storage.getUserByEmail(data.email);
      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      const validPassword = await comparePassword(data.password, user.password);
      if (!validPassword) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      const token = generateUserToken(user.id, user.email);
      res.json({ token, user: { id: user.id, email: user.email, name: user.name, phone: user.phone, gender: user.gender, age: user.age, address: user.address } });
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      res.status(500).json({ message: err.message });
    }
  });

  // ============ ADMIN AUTHENTICATION ============

  // Admin Login
  app.post("/api/admin/login", async (req, res) => {
    try {
      const data = adminLoginSchema.parse(req.body);
      
      const admin = await storage.getAdminByEmail(data.email);
      if (!admin) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      const validPassword = await comparePassword(data.password, admin.password);
      if (!validPassword) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      const token = generateAdminToken(admin.id, admin.email);
      res.json({ token, admin: { id: admin.id, email: admin.email, name: admin.name } });
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      res.status(500).json({ message: err.message });
    }
  });

  // ============ USER PROFILE & DASHBOARD ============

  // Get user profile
  app.get("/api/user/profile", authUserMiddleware, async (req: AuthRequest, res) => {
    try {
      const user = await storage.getUserById(req.user!.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json({ id: user.id, email: user.email, name: user.name, phone: user.phone, gender: user.gender, age: user.age, address: user.address });
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  // Get user's bookings
  app.get("/api/user/bookings", authUserMiddleware, async (req: AuthRequest, res) => {
    try {
      const bookings = await storage.getBookingsByUser(req.user!.id);
      res.json(bookings);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  // Get user's payment history
  app.get("/api/user/payments", authUserMiddleware, async (req: AuthRequest, res) => {
    try {
      const payments = await storage.getPaymentsByUser(req.user!.id);
      res.json(payments);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  // Get user's reports
  app.get("/api/user/reports", authUserMiddleware, async (req: AuthRequest, res) => {
    try {
      const reports = await storage.getReportsByUser(req.user!.id);
      res.json(reports);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  // ============ TESTS (PUBLIC) ============

  // Get all tests
  app.get("/api/tests", async (req, res) => {
    try {
      const tests = await storage.getTests();
      res.json(tests);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  // Get single test
  app.get("/api/tests/:id", async (req, res) => {
    try {
      const test = await storage.getTest(Number(req.params.id));
      if (!test) return res.status(404).json({ message: "Test not found" });
      res.json(test);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  // ============ PACKAGES (PUBLIC) ============

  // Get all packages
  app.get("/api/packages", async (req, res) => {
    try {
      const packages = await storage.getPackages();
      res.json(packages);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  // Get single package
  app.get("/api/packages/:id", async (req, res) => {
    try {
      const pkg = await storage.getPackage(Number(req.params.id));
      if (!pkg) return res.status(404).json({ message: "Package not found" });
      res.json(pkg);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  // ============ REVIEWS (PUBLIC) ============

  // Get all reviews
  app.get("/api/reviews", async (req, res) => {
    try {
      const reviews = await storage.getReviews();
      res.json(reviews);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  // ============ BOOKINGS ============

  // Create booking (user authenticated)
  app.post("/api/bookings", authUserMiddleware, async (req: AuthRequest, res) => {
    try {
      const data = createBookingSchema.parse(req.body);
      const booking = await storage.createBooking(req.user!.id, data);
      res.status(201).json(booking);
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      res.status(500).json({ message: err.message });
    }
  });

  // Get booking by ID
  app.get("/api/bookings/:id", authUserMiddleware, async (req: AuthRequest, res) => {
    try {
      const booking = await storage.getBookingById(Number(req.params.id));
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }
      if (booking.userId !== req.user!.id) {
        return res.status(403).json({ message: "Unauthorized" });
      }
      res.json(booking);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  // Create payment (initiates payment process)
  app.post("/api/payments/initiate", authUserMiddleware, async (req: AuthRequest, res) => {
    try {
      const { bookingId, amount } = req.body;
      const booking = await storage.getBookingById(bookingId);
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }
      if (booking.userId !== req.user!.id) {
        return res.status(403).json({ message: "Unauthorized" });
      }
      // Update booking to pending verification
      await storage.updatePaymentStatus(bookingId, "pending_verification");
      res.json({ message: "Payment initiated", bookingId });
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  // Verify payment (admin only)
  app.post("/api/admin/payments/verify", authAdminMiddleware, async (req: AuthRequest, res) => {
    try {
      const { bookingId, verified } = req.body;
      const status = verified ? "verified" : "rejected";
      const booking = await storage.updatePaymentStatus(bookingId, status);
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }
      res.json(booking);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  // ============ ADMIN ROUTES ============

  // Get dashboard stats
  app.get("/api/admin/stats", authAdminMiddleware, async (req: AuthRequest, res) => {
    try {
      const allUsers = await storage.getAllUsers();
      const allBookings = await storage.getAllBookings();
      
      const totalUsers = allUsers.length;
      const totalBookings = allBookings.length;
      const completedTests = allBookings.filter(b => b.testStatus === "completed").length;
      const pendingTests = allBookings.filter(b => b.testStatus === "booked").length;

      res.json({ totalUsers, totalBookings, completedTests, pendingTests });
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  // Get all users (admin only)
  app.get("/api/admin/users", authAdminMiddleware, async (req: AuthRequest, res) => {
    try {
      const allUsers = await storage.getAllUsers();
      res.json(allUsers.map(u => ({ id: u.id, email: u.email, name: u.name, phone: u.phone, gender: u.gender, age: u.age })));
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  // Get all bookings (admin only)
  app.get("/api/admin/bookings", authAdminMiddleware, async (req: AuthRequest, res) => {
    try {
      const allBookings = await storage.getAllBookings();
      const users = await storage.getAllUsers();
      const tests = await storage.getTests();
      const packages = await storage.getPackages();

      const bookingDetails = allBookings.map(b => ({
        id: b.id,
        userId: b.userId,
        userName: users.find(u => u.id === b.userId)?.name || "Unknown",
        phone: users.find(u => u.id === b.userId)?.phone || "",
        testName: b.testId ? tests.find(t => t.id === b.testId)?.name : null,
        packageName: b.packageId ? packages.find(p => p.id === b.packageId)?.name : null,
        date: b.date,
        time: b.time,
        testStatus: b.testStatus,
        paymentStatus: b.paymentStatus,
        totalAmount: b.totalAmount,
        bookingMode: b.bookingMode,
        address: b.address,
        distance: b.distance,
      }));

      res.json(bookingDetails);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  // Update booking status (admin only)
  app.patch("/api/admin/bookings/:id", authAdminMiddleware, async (req: AuthRequest, res) => {
    try {
      const { testStatus, paymentStatus } = req.body;
      const booking = await storage.updateBookingStatus(Number(req.params.id), testStatus, paymentStatus);
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }
      res.json(booking);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  // ============ ADMIN TEST MANAGEMENT ============

  // Create test (admin only)
  app.post("/api/admin/tests", authAdminMiddleware, async (req: AuthRequest, res) => {
    try {
      const data = insertTestSchema.parse(req.body);
      const test = await storage.createTest(data);
      res.status(201).json(test);
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      res.status(500).json({ message: err.message });
    }
  });

  // Update test (admin only)
  app.put("/api/admin/tests/:id", authAdminMiddleware, async (req: AuthRequest, res) => {
    try {
      const data = insertTestSchema.parse(req.body);
      const test = await storage.updateTest(Number(req.params.id), data);
      if (!test) {
        return res.status(404).json({ message: "Test not found" });
      }
      res.json(test);
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      res.status(500).json({ message: err.message });
    }
  });

  // Delete test (admin only)
  app.delete("/api/admin/tests/:id", authAdminMiddleware, async (req: AuthRequest, res) => {
    try {
      await storage.deleteTest(Number(req.params.id));
      res.json({ message: "Test deleted" });
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  // ============ ADMIN PACKAGE MANAGEMENT ============

  // Create package (admin only)
  app.post("/api/admin/packages", authAdminMiddleware, async (req: AuthRequest, res) => {
    try {
      const data = insertPackageSchema.parse(req.body);
      const pkg = await storage.createPackage(data);
      res.status(201).json(pkg);
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      res.status(500).json({ message: err.message });
    }
  });

  // Update package (admin only)
  app.put("/api/admin/packages/:id", authAdminMiddleware, async (req: AuthRequest, res) => {
    try {
      const data = insertPackageSchema.parse(req.body);
      const pkg = await storage.updatePackage(Number(req.params.id), data);
      if (!pkg) {
        return res.status(404).json({ message: "Package not found" });
      }
      res.json(pkg);
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      res.status(500).json({ message: err.message });
    }
  });

  // Delete package (admin only)
  app.delete("/api/admin/packages/:id", authAdminMiddleware, async (req: AuthRequest, res) => {
    try {
      await storage.deletePackage(Number(req.params.id));
      res.json({ message: "Package deleted" });
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  // Get all generated reports (admin only)
  app.get("/api/admin/all-reports", authAdminMiddleware, async (req: AuthRequest, res) => {
    try {
      const allReports = await storage.getAllReports();
      const users = await storage.getAllUsers();
      
      const reportDetails = allReports.map(r => ({
        ...r,
        patientName: users.find(u => u.id === r.userId)?.name || "Unknown",
        patientPhone: users.find(u => u.id === r.userId)?.phone || "",
      }));
      
      res.json(reportDetails);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  // Create report (admin only)
  app.post("/api/admin/reports", authAdminMiddleware, async (req: AuthRequest, res) => {
    try {
      const report = await storage.createReport(req.body);
      // Update booking status to completed
      await storage.updateBookingStatus(req.body.bookingId, "completed");
      res.status(201).json(report);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  // Create walk-in collection (admin only)
  app.post("/api/admin/walk-in-collections", authAdminMiddleware, async (req: AuthRequest, res) => {
    try {
      const { reportId, doctorName, clinicName } = req.body;
      const collection = await storage.createWalkInCollection(reportId, doctorName, clinicName);
      res.status(201).json(collection);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  // Get walk-in collections by doctor (admin only)
  app.get("/api/admin/walk-in-collections/:doctorName", authAdminMiddleware, async (req: AuthRequest, res) => {
    try {
      const collections = await storage.getWalkInCollectionsByDoctor(req.params.doctorName);
      res.json(collections);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  return httpServer;
}
