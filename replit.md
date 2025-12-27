# Pathology Portal - MongoDB Version (In Progress)

## Current Status
**Migrating from PostgreSQL to MongoDB with comprehensive user dashboards and admin panel**

## Project Requirements

### User Module Requirements
1. **Registration & Login**
   - Email, password, phone, gender, age (no dummy auto-creation)
   - Password hashing with bcrypt
   - Unique email validation
   - Only real MongoDB data - no mock users

2. **User Dashboard - Complete Profile**
   - Unique User ID
   - Full Name, Email, Phone Number
   - Gender, Address
   - Account creation date

3. **Current Bookings**
   - Test name & Package name
   - Appointment date & time slot
   - Price (individual & total)
   - Status: Booked / In Progress / Completed

4. **Booking History**
   - All past bookings with dates
   - Test details for each booking
   - Status tracking
   - Searchable/filterable

5. **Payment History**
   - Amount paid
   - Payment status (Pending/Completed)
   - Transaction ID
   - Payment date
   - Downloadable receipts

6. **Reports Section**
   - Test name for each report
   - Result summary
   - Doctor remarks
   - Upload date
   - **Downloadable PDF reports** (uploaded by admin)
   - Real-time update when admin uploads

### Admin Module Requirements
1. **Secure Admin Login**
   - Separate from user login
   - JWT authentication
   - Email & password validation

2. **Admin Dashboard**
   - View all registered users
   - See all user bookings with details
   - User name, test/package booked, date, price, status
   - Booking list with filters

3. **Booking Management**
   - Update booking status: Booked → In Progress → Completed
   - Real-time status changes visible to user

4. **Report Management**
   - Upload pathology reports as PDF for specific user & test
   - Report immediately appears in that user's dashboard
   - Add test name, result summary, doctor remarks
   - Store with upload date

5. **Payment Management**
   - View all payments from all users
   - Payment status tracking
   - Analytics & reports
   - Transaction history

6. **Security**
   - Strict JWT authentication for all admin routes
   - Role-based access control
   - Admin-only protected endpoints

### Technical Stack
- **Database**: MongoDB (Mongoose)
- **Backend**: Express.js, TypeScript
- **Frontend**: React, Vite, TailwindCSS
- **Auth**: JWT tokens + bcrypt
- **File Handling**: Multer for PDF uploads
- **Validation**: Zod schemas

### Database Models (MongoDB Collections)
- **users** - Email, password, phone, gender, age, address, createdAt
- **admins** - Email, password, name, createdAt
- **tests** - Name, description, price, reportTime, category, isPopular
- **packages** - Name, description, price, includes[], category, isFeatured
- **bookings** - userId, testId/packageId, appointmentDate, timeSlot, price, status, createdAt
- **payments** - userId, bookingId, amount, status, transactionId, date
- **reports** - userId, testId, bookingId, resultSummary, doctorRemarks, pdfPath, uploadDate

### API Endpoints (MongoDB)

#### Auth
- `POST /api/auth/register` - User registration (MongoDB save)
- `POST /api/auth/login` - User login (JWT token)
- `POST /api/admin/login` - Admin login (separate JWT)

#### User Routes (Protected JWT)
- `GET /api/user/profile` - Full profile data
- `GET /api/user/bookings` - Current & past bookings
- `GET /api/user/payments` - Payment history
- `GET /api/user/reports` - Available reports with PDF links

#### Admin Routes (Protected + Admin JWT)
- `GET /api/admin/users` - All users
- `GET /api/admin/bookings` - All bookings with user details
- `PATCH /api/admin/bookings/:id` - Update booking status
- `POST /api/admin/reports/upload` - Upload report (multipart form)
- `GET /api/admin/payments` - Payment list & analytics
- `GET /api/reports/:reportId/download` - Download PDF

### UI Requirements
- Clean, professional design (TailwindCSS)
- Responsive mobile-friendly
- No dummy data visible
- Real-time updates for admin actions
- Smooth loading states
- Error handling & validation messages

### File Handling
- Store PDF reports in `/server/uploads/reports/`
- Secure file serving with JWT validation
- Delete old reports when replaced
- Max file size: 10MB

### Data Integrity
- NO auto-generated dummy data
- NO hardcoded test users
- NO mock bookings or payments
- ONLY MongoDB real data
- All operations persist to database

## Implementation Status
- ✅ MongoDB driver installed (mongoose)
- ✅ File upload handler installed (multer)
- ⏳ Database migration in progress
- ⏳ Mongoose models to be created
- ⏳ API endpoints to be refactored
- ⏳ User dashboard to be rebuilt
- ⏳ Admin panel to be rebuilt
- ⏳ Report upload system to be implemented
- ⏳ Payment tracking to be implemented

## Next Steps
1. Create MongoDB connection setup
2. Define Mongoose schemas for all collections
3. Rewrite server routes for MongoDB operations
4. Build complete user dashboard UI
5. Build complete admin panel UI
6. Implement report upload & download
7. Implement payment tracking
8. Test end-to-end flow
