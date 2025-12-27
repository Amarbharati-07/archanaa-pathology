import { useEffect, useState } from "react";
import { useLocation, Link } from "wouter";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  LogOut, 
  LayoutDashboard, 
  Calendar, 
  History, 
  FileText, 
  CreditCard, 
  Settings, 
  User,
  BadgeCheck,
  ShieldCheck,
  Download,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Activity,
  Microscope
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

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
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

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
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
          <p className="font-medium text-slate-600">Loading your health portal...</p>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    const s = status.toLowerCase();
    if (s === "pending") return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-amber-200 capitalize"><Clock className="w-3 h-3 mr-1" />{status}</Badge>;
    if (s === "confirmed" || s === "completed" || s === "paid") return <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-emerald-200 capitalize"><CheckCircle2 className="w-3 h-3 mr-1" />{status}</Badge>;
    if (s === "processing" || s === "in-progress") return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-blue-200 capitalize"><Activity className="w-3 h-3 mr-1" />{status}</Badge>;
    if (s === "cancelled") return <Badge className="bg-rose-100 text-rose-700 hover:bg-rose-100 border-rose-200 capitalize"><XCircle className="w-3 h-3 mr-1" />{status}</Badge>;
    return <Badge variant="outline" className="capitalize">{status}</Badge>;
  };

  const navItems = [
    { id: "overview", label: "Dashboard Overview", icon: LayoutDashboard },
    { id: "current", label: "Current Bookings", icon: Calendar },
    { id: "history", label: "Booking History", icon: History },
    { id: "reports", label: "Reports & Results", icon: FileText },
    { id: "payments", label: "Payments & Billing", icon: CreditCard },
    { id: "settings", label: "Profile Settings", icon: Settings },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50/50">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 hidden w-72 flex-col border-r bg-white lg:flex z-50">
        <div className="flex flex-col items-center p-8 border-b bg-slate-50/30">
          <Avatar className="h-24 w-24 border-4 border-white shadow-xl mb-4">
            <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user?.name}`} />
            <AvatarFallback>{user?.name?.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <h3 className="font-display font-bold text-lg text-slate-900 line-clamp-1">{user?.name}</h3>
          <p className="text-sm text-slate-500 mb-3">{user?.phone}</p>
          <div className="flex gap-2">
            <Badge className="bg-blue-50 text-blue-700 border-blue-100 hover:bg-blue-50">
              <BadgeCheck className="w-3 h-3 mr-1" /> Verified
            </Badge>
            <Badge className="bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-50">
              Active
            </Badge>
          </div>
        </div>

        <ScrollArea className="flex-1 px-4 py-6">
          <nav className="space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all",
                  activeTab === item.id
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-100"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <item.icon className={cn("h-5 w-5", activeTab === item.id ? "text-white" : "text-slate-400")} />
                {item.label}
              </button>
            ))}
          </nav>
        </ScrollArea>

        <div className="p-4 border-t">
          <Button 
            variant="ghost" 
            onClick={handleLogout}
            className="w-full justify-start gap-3 rounded-xl text-rose-600 hover:bg-rose-50 hover:text-rose-700"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-72 pb-12">
        <header className="sticky top-0 z-40 flex h-20 items-center justify-between border-b bg-white/80 px-8 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <h2 className="font-display font-bold text-2xl text-slate-900 capitalize">
              {activeTab.replace("-", " ")}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/tests">
              <Button className="bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-100 rounded-xl">
                Book a Test
              </Button>
            </Link>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto">
          {activeTab === "overview" && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-display font-bold text-slate-900">Welcome back, {user?.name?.split(' ')[0]}!</h1>
                <p className="text-slate-500">Your health dashboard is up to date. Have a great day.</p>
              </div>

              {/* Profile Card */}
              <Card className="border-none shadow-xl shadow-slate-200/50 overflow-hidden rounded-[2rem]">
                <CardHeader className="bg-slate-900 text-white p-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-2xl font-display font-bold">Personal Profile</CardTitle>
                      <p className="text-slate-400 mt-1">Manage your account information</p>
                    </div>
                    <User className="h-8 w-8 text-blue-400" />
                  </div>
                </CardHeader>
                <CardContent className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 bg-white">
                  <div className="space-y-1">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Full Name</p>
                    <p className="font-semibold text-slate-900 text-lg">{user?.name}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">User ID</p>
                    <p className="font-semibold text-slate-900 text-lg">#{user?.id}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Email Address</p>
                    <p className="font-semibold text-slate-900">{user?.email}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Phone Number</p>
                    <p className="font-semibold text-slate-900">{user?.phone}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Gender</p>
                    <p className="font-semibold text-slate-900 capitalize">{user?.gender || "Not specified"}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Age</p>
                    <p className="font-semibold text-slate-900">{user?.age || "N/A"} Years</p>
                  </div>
                  <div className="md:col-span-2 space-y-1">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Primary Address</p>
                    <p className="font-semibold text-slate-900">{user?.address || "No address provided yet"}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Summary Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="rounded-[1.5rem] border-none shadow-lg shadow-slate-100 p-6 flex items-center gap-4 bg-white">
                  <div className="h-14 w-14 rounded-2xl bg-blue-50 flex items-center justify-center">
                    <Calendar className="h-7 w-7 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-black text-slate-900">{bookings.filter(b => b.testStatus !== 'completed').length}</p>
                    <p className="text-sm font-medium text-slate-500">Active Bookings</p>
                  </div>
                </Card>
                <Card className="rounded-[1.5rem] border-none shadow-lg shadow-slate-100 p-6 flex items-center gap-4 bg-white">
                  <div className="h-14 w-14 rounded-2xl bg-emerald-50 flex items-center justify-center">
                    <FileText className="h-7 w-7 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-black text-slate-900">{reports.length}</p>
                    <p className="text-sm font-medium text-slate-500">Available Reports</p>
                  </div>
                </Card>
                <Card className="rounded-[1.5rem] border-none shadow-lg shadow-slate-100 p-6 flex items-center gap-4 bg-white">
                  <div className="h-14 w-14 rounded-2xl bg-amber-50 flex items-center justify-center">
                    <ShieldCheck className="h-7 w-7 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-black text-slate-900">100%</p>
                    <p className="text-sm font-medium text-slate-500">Data Secured</p>
                  </div>
                </Card>
              </div>
            </div>
          )}

          {activeTab === "current" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
              {bookings.filter(b => b.testStatus !== 'completed').length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[2rem] border-2 border-dashed border-slate-200">
                  <div className="h-20 w-20 rounded-full bg-slate-50 flex items-center justify-center mb-6">
                    <Calendar className="h-10 w-10 text-slate-300" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">No Active Bookings</h3>
                  <p className="text-slate-500 mb-8">You haven't booked any tests recently.</p>
                  <Link href="/tests">
                    <Button className="bg-blue-600 hover:bg-blue-700 px-8 h-12 rounded-xl font-bold shadow-lg shadow-blue-100">Book New Test</Button>
                  </Link>
                </div>
              ) : (
                <div className="grid gap-6">
                  {bookings.filter(b => b.testStatus !== 'completed').map((booking) => (
                    <Card key={booking.id} className="overflow-hidden border-none shadow-xl shadow-slate-200/50 rounded-[2rem] bg-white">
                      <div className="p-8">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                          <div className="flex items-center gap-4">
                            <div className="h-14 w-14 rounded-2xl bg-blue-100 flex items-center justify-center">
                              <Microscope className="h-7 w-7 text-blue-600" />
                            </div>
                            <div>
                              <h3 className="font-bold text-xl text-slate-900">Diagnostic Test Service</h3>
                              <p className="text-sm text-slate-500 font-medium">Booking ID: #BK-{booking.id}</p>
                            </div>
                          </div>
                          {getStatusBadge(booking.testStatus)}
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                          <div>
                            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Appointment Date</p>
                            <p className="font-bold text-slate-900">{new Date(booking.date).toLocaleDateString(undefined, { dateStyle: 'long' })}</p>
                          </div>
                          <div>
                            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Slot Time</p>
                            <p className="font-bold text-slate-900">{booking.time}</p>
                          </div>
                          <div>
                            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Total Price</p>
                            <p className="font-bold text-slate-900">₹{booking.totalAmount}</p>
                          </div>
                          <div>
                            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Payment</p>
                            {getStatusBadge(booking.paymentStatus)}
                          </div>
                        </div>
                        
                        <div className="mt-8 pt-6 border-t flex flex-col sm:flex-row justify-between items-center gap-4">
                          <div className="flex items-center gap-2 text-slate-500">
                            <AlertCircle className="w-4 h-4" />
                            <span className="text-sm">Please arrive 15 mins early with a valid ID.</span>
                          </div>
                          <Button variant="outline" className="rounded-xl border-slate-200 hover:bg-slate-50">View Full Details</Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "history" && (
            <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 overflow-hidden border-none animate-in fade-in slide-in-from-bottom-4">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50 border-b">
                      <th className="p-6 text-xs font-bold uppercase tracking-wider text-slate-500">Booking ID</th>
                      <th className="p-6 text-xs font-bold uppercase tracking-wider text-slate-500">Service Name</th>
                      <th className="p-6 text-xs font-bold uppercase tracking-wider text-slate-500">Appointment Date</th>
                      <th className="p-6 text-xs font-bold uppercase tracking-wider text-slate-500">Total Price</th>
                      <th className="p-6 text-xs font-bold uppercase tracking-wider text-slate-500">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {bookings.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="p-12 text-center text-slate-400 font-medium italic">No booking records found</td>
                      </tr>
                    ) : (
                      bookings.map((booking) => (
                        <tr key={booking.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="p-6 font-bold text-slate-900">#BK-{booking.id}</td>
                          <td className="p-6 font-medium text-slate-700">Comprehensive Checkup</td>
                          <td className="p-6 text-slate-600 font-medium">{new Date(booking.date).toLocaleDateString()}</td>
                          <td className="p-6 font-bold text-slate-900">₹{booking.totalAmount}</td>
                          <td className="p-6">{getStatusBadge(booking.testStatus)}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "reports" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4">
              {reports.length === 0 ? (
                <div className="col-span-full flex flex-col items-center justify-center py-20 bg-white rounded-[2rem] border-2 border-dashed border-slate-200">
                  <div className="h-20 w-20 rounded-full bg-slate-50 flex items-center justify-center mb-6">
                    <FileText className="h-10 w-10 text-slate-300" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">No Reports Yet</h3>
                  <p className="text-slate-500">Your lab results will appear here once processed.</p>
                </div>
              ) : (
                reports.map((report) => (
                  <Card key={report.id} className="border-none shadow-xl shadow-slate-200/50 rounded-[2rem] bg-white overflow-hidden group hover:scale-[1.02] transition-all">
                    <div className="p-6 h-full flex flex-col">
                      <div className="flex justify-between items-start mb-6">
                        <div className="h-12 w-12 rounded-xl bg-emerald-50 flex items-center justify-center group-hover:bg-emerald-600 transition-colors">
                          <FileText className="h-6 w-6 text-emerald-600 group-hover:text-white" />
                        </div>
                        <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">Completed</Badge>
                      </div>
                      
                      <h4 className="font-bold text-xl text-slate-900 mb-1 line-clamp-1">{report.testName}</h4>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Uploaded on {new Date(report.uploadDate).toLocaleDateString()}</p>
                      
                      <div className="bg-slate-50 p-4 rounded-xl mb-6 flex-1">
                        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Remarks</p>
                        <p className="text-sm text-slate-600 italic line-clamp-3">"{report.doctorRemarks || "Results are within normal clinical range. No immediate action required."}"</p>
                      </div>

                      <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white rounded-xl h-12 font-bold gap-2">
                        <Download className="w-4 h-4" /> Download PDF
                      </Button>
                    </div>
                  </Card>
                ))
              )}
            </div>
          )}

          {activeTab === "payments" && (
            <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 overflow-hidden border-none animate-in fade-in slide-in-from-bottom-4">
               <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50 border-b">
                      <th className="p-6 text-xs font-bold uppercase tracking-wider text-slate-500">Transaction ID</th>
                      <th className="p-6 text-xs font-bold uppercase tracking-wider text-slate-500">Method</th>
                      <th className="p-6 text-xs font-bold uppercase tracking-wider text-slate-500">Date</th>
                      <th className="p-6 text-xs font-bold uppercase tracking-wider text-slate-500">Amount</th>
                      <th className="p-6 text-xs font-bold uppercase tracking-wider text-slate-500">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {payments.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="p-12 text-center text-slate-400 font-medium italic">No payment transactions recorded</td>
                      </tr>
                    ) : (
                      payments.map((payment) => (
                        <tr key={payment.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="p-6 font-mono text-sm text-blue-600 font-medium uppercase tracking-tighter">
                            {payment.transactionId || "TRX-N/A"}
                          </td>
                          <td className="p-6 font-medium text-slate-700">Digital Payment</td>
                          <td className="p-6 text-slate-600 font-medium">{new Date(payment.date).toLocaleDateString()}</td>
                          <td className="p-6 font-bold text-slate-900">₹{payment.amount}</td>
                          <td className="p-6">{getStatusBadge(payment.status)}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="max-w-2xl bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 p-8 border-none animate-in fade-in slide-in-from-bottom-4">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">Security & Preferences</h3>
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                  <div>
                    <h4 className="font-bold text-slate-900">Email Notifications</h4>
                    <p className="text-sm text-slate-500">Receive reports and booking updates</p>
                  </div>
                  <div className="h-6 w-11 rounded-full bg-blue-600 relative cursor-pointer">
                    <div className="absolute right-1 top-1 h-4 w-4 rounded-full bg-white shadow-sm" />
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                  <div>
                    <h4 className="font-bold text-slate-900">Two-Factor Auth</h4>
                    <p className="text-sm text-slate-500">Enhance your account security</p>
                  </div>
                  <div className="h-6 w-11 rounded-full bg-slate-300 relative cursor-pointer">
                    <div className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white shadow-sm" />
                  </div>
                </div>
                <Button variant="outline" className="w-full h-12 rounded-xl border-slate-200 font-bold">Change Password</Button>
                <Button className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700 font-bold shadow-lg shadow-blue-100">Save Changes</Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
