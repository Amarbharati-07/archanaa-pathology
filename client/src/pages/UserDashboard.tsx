import { useEffect, useState } from "react";
import { useLocation, Link } from "wouter";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LogOut, BookOpen, CreditCard, FileText, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Booking {
  id: number;
  date: string;
  time: string;
  totalAmount: number;
  testStatus: string;
  paymentStatus: string;
}

interface Payment {
  id: number;
  amount: number;
  status: string;
  transactionId: string;
  date: string;
}

interface Report {
  id: number;
  testName: string;
  resultSummary: string;
  doctorRemarks: string;
  uploadDate: string;
  reportPath: string;
}

export default function UserDashboard() {
  const { user, userToken, logout, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      setLocation("/login");
      return;
    }
    loadDashboardData();
  }, [isAuthenticated]);

  const loadDashboardData = async () => {
    if (!userToken) return;
    setLoading(true);
    try {
      const headers = { Authorization: `Bearer ${userToken}` };

      const [bookingsRes, paymentsRes, reportsRes] = await Promise.all([
        fetch("/api/user/bookings", { headers }),
        fetch("/api/user/payments", { headers }),
        fetch("/api/user/reports", { headers }),
      ]);

      if (bookingsRes.ok) setBookings(await bookingsRes.json());
      if (paymentsRes.ok) setPayments(await paymentsRes.json());
      if (reportsRes.ok) setReports(await reportsRes.json());
    } catch (err: any) {
      console.error("Error loading dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    toast({ title: "Logged out successfully" });
    setLocation("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 p-6 flex items-center justify-center">
        <p className="text-slate-500">Loading your dashboard...</p>
      </div>
    );
  }

  const currentBookings = bookings.filter((b) => b.testStatus !== "completed");
  const pastBookings = bookings.filter((b) => b.testStatus === "completed");

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Welcome, {user?.name}</h1>
            <p className="text-slate-500 mt-1">{user?.email}</p>
          </div>
          <Button onClick={handleLogout} variant="outline" className="gap-2">
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>

        {/* Full Profile Details */}
        <div className="bg-white rounded-lg border border-slate-200 p-6 mb-8">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Your Profile</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-slate-600">Full Name</p>
              <p className="font-bold text-slate-900">{user?.name}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600">User ID</p>
              <p className="font-bold text-slate-900">#{user?.id}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600">Email</p>
              <p className="font-bold text-slate-900 text-sm">{user?.email}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600">Phone</p>
              <p className="font-bold text-slate-900">{user?.phone}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600">Gender</p>
              <p className="font-bold text-slate-900 capitalize">{user?.gender}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600">Age</p>
              <p className="font-bold text-slate-900">{user?.age} years</p>
            </div>
            <div className="lg:col-span-2">
              <p className="text-sm text-slate-600">Address</p>
              <p className="font-bold text-slate-900">{user?.address || "Not provided"}</p>
            </div>
          </div>
        </div>

        {/* Current Bookings */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-6 h-6" />
              Current Bookings
            </h2>
            <Link href="/tests">
              <Button className="bg-blue-600 hover:bg-blue-700">Book a Test</Button>
            </Link>
          </div>

          {currentBookings.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-slate-500 mb-4">No active bookings</p>
                <Link href="/tests">
                  <Button className="bg-blue-600 hover:bg-blue-700">Book Your First Test</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {currentBookings.map((booking) => (
                <Card key={booking.id}>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      <div>
                        <p className="text-sm text-slate-600">Appointment Date</p>
                        <p className="font-bold">{new Date(booking.date).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-600">Time Slot</p>
                        <p className="font-bold">{booking.time}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-600">Price</p>
                        <p className="font-bold">₹{booking.totalAmount}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-600">Test Status</p>
                        <p className="font-bold capitalize text-blue-600">{booking.testStatus}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-600">Payment Status</p>
                        <p className={`font-bold capitalize ${booking.paymentStatus === "paid" ? "text-green-600" : "text-yellow-600"}`}>
                          {booking.paymentStatus}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Booking History */}
        {pastBookings.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Booking History</h2>
            <div className="grid gap-4">
              {pastBookings.map((booking) => (
                <Card key={booking.id}>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm text-slate-600">Date</p>
                        <p className="font-bold">{new Date(booking.date).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-600">Status</p>
                        <p className="font-bold capitalize text-green-600">{booking.testStatus}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-600">Amount</p>
                        <p className="font-bold">₹{booking.totalAmount}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-600">Payment</p>
                        <p className={`font-bold capitalize ${booking.paymentStatus === "paid" ? "text-green-600" : "text-yellow-600"}`}>
                          {booking.paymentStatus}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Payment History */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
            <CreditCard className="w-6 h-6" />
            Payment History
          </h2>

          {payments.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-slate-500">No payments yet</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {payments.map((payment) => (
                <Card key={payment.id}>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm text-slate-600">Amount</p>
                        <p className="font-bold">₹{payment.amount}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-600">Status</p>
                        <p className={`font-bold capitalize ${payment.status === "completed" ? "text-green-600" : "text-yellow-600"}`}>
                          {payment.status}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-600">Transaction ID</p>
                        <p className="font-bold text-sm">{payment.transactionId || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-600">Date</p>
                        <p className="font-bold">{new Date(payment.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Reports Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
            <FileText className="w-6 h-6" />
            Your Reports
          </h2>

          {reports.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-slate-500">No reports uploaded yet</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {reports.map((report) => (
                <Card key={report.id}>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-slate-600">Test Name</p>
                        <p className="font-bold">{report.testName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-600">Upload Date</p>
                        <p className="font-bold">{new Date(report.uploadDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="mb-4">
                      <p className="text-sm text-slate-600">Result Summary</p>
                      <p className="text-slate-900">{report.resultSummary}</p>
                    </div>
                    <div className="mb-4">
                      <p className="text-sm text-slate-600">Doctor Remarks</p>
                      <p className="text-slate-900">{report.doctorRemarks || "No remarks"}</p>
                    </div>
                    {report.reportPath && (
                      <Button className="gap-2 bg-green-600 hover:bg-green-700">
                        <Download className="w-4 h-4" />
                        Download PDF Report
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
