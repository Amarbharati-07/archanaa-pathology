import { useEffect, useState } from "react";
import { useLocation, Link } from "wouter";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LogOut, Users, BookOpen, CheckCircle2, Clock, Plus, Edit2, Trash2, Microscope, FileText, BarChart3, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

export default function AdminDashboard() {
  const { admin, adminToken, logout, isAdminAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [tests, setTests] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [loading, setLoading] = useState(false);

  const [isTestModalOpen, setIsTestModalOpen] = useState(false);
  const [testForm, setTestForm] = useState({ name: "", description: "", price: "", reportTime: "", category: "" });

  useEffect(() => {
    if (!isAdminAuthenticated) {
      setLocation("/admin/login");
      return;
    }

    loadData();
  }, [isAdminAuthenticated, activeTab]);

  const loadData = async () => {
    if (!adminToken) return;
    setLoading(true);
    try {
      const headers = { Authorization: `Bearer ${adminToken}` };

      const statsRes = await fetch("/api/admin/stats", { headers });
      if (statsRes.ok) setStats(await statsRes.json());
      else console.error("Stats load failed:", statsRes.status);

      if (activeTab === "users" || activeTab === "dashboard") {
        const usersRes = await fetch("/api/admin/users", { headers });
        if (usersRes.ok) {
          const userData = await usersRes.json();
          setUsers(userData);
          console.log("Users loaded:", userData);
        } else {
          console.error("Users load failed:", usersRes.status);
        }
      }

      if (activeTab === "bookings" || activeTab === "dashboard") {
        const bookingsRes = await fetch("/api/admin/bookings", { headers });
        if (bookingsRes.ok) setBookings(await bookingsRes.json());
        else console.error("Bookings load failed:", bookingsRes.status);
      }

      if (activeTab === "tests" || activeTab === "dashboard") {
        const testsRes = await fetch("/api/tests", { headers });
        if (testsRes.ok) setTests(await testsRes.json());
        else console.error("Tests load failed:", testsRes.status);
      }
    } catch (error) {
      console.error("Data load error:", error);
      toast({ title: "Error loading data", description: String(error), variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    toast({ title: "Logged out successfully" });
    setLocation("/");
  };

  const handleCreateTest = async () => {
    if (!adminToken) return;
    try {
      const res = await fetch("/api/admin/tests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({
          ...testForm,
          price: parseInt(testForm.price),
        }),
      });

      if (res.ok) {
        toast({ title: "Test created successfully" });
        setIsTestModalOpen(false);
        setTestForm({ name: "", description: "", price: "", reportTime: "", category: "" });
        loadData();
      } else {
        const err = await res.json();
        toast({ title: "Error", description: err.message, variant: "destructive" });
      }
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const handleLogout2 = () => {
    logout();
    setLocation("/admin/login");
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Dashboard</h1>
        <p className="text-slate-500 mt-1">Overview of lab operations</p>
      </div>

      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-none shadow-sm bg-white hover:shadow-md transition-shadow">
            <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
              <div className="space-y-1">
                <CardTitle className="text-sm font-medium text-slate-500">Total Patients</CardTitle>
                <p className="text-3xl font-bold text-slate-900">{stats.totalUsers || 0}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-slate-400">Registered patients</p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-white hover:shadow-md transition-shadow">
            <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
              <div className="space-y-1">
                <CardTitle className="text-sm font-medium text-slate-500">Total Reports</CardTitle>
                <p className="text-3xl font-bold text-slate-900">{stats.completedTests || 0}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center">
                <FileText className="w-5 h-5 text-indigo-600" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-slate-400">Generated reports</p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-white hover:shadow-md transition-shadow">
            <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
              <div className="space-y-1">
                <CardTitle className="text-sm font-medium text-slate-500">Pending Bookings</CardTitle>
                <p className="text-3xl font-bold text-slate-900">{stats.pendingTests || 0}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center">
                <Clock className="w-5 h-5 text-orange-600" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-slate-400">Awaiting collection</p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-white hover:shadow-md transition-shadow">
            <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
              <div className="space-y-1">
                <CardTitle className="text-sm font-medium text-slate-500">Available Tests</CardTitle>
                <p className="text-3xl font-bold text-slate-900">{tests.length || 0}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center">
                <Microscope className="w-5 h-5 text-emerald-600" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-slate-400">Test catalog</p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-white hover:shadow-md transition-shadow">
            <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
              <div className="space-y-1">
                <CardTitle className="text-sm font-medium text-slate-500">Today's Reports</CardTitle>
                <p className="text-3xl font-bold text-slate-900">0</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-violet-50 flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-violet-600" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-slate-400">Generated today</p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-white hover:shadow-md transition-shadow">
            <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
              <div className="space-y-1">
                <CardTitle className="text-sm font-medium text-slate-500">Recent Bookings</CardTitle>
                <p className="text-3xl font-bold text-slate-900">{bookings.length > 0 ? 1 : 0}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-sky-50 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-sky-600" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-slate-400">Last 7 days</p>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-slate-900">Quick Actions</h2>
          <div className="grid gap-4">
            {[
              { title: "Create New Report", desc: "Enter test results and generate PDF", icon: FileText, color: "blue", action: () => setLocation("/admin/reports") },
              { title: "Search Patients", desc: "Find patient by ID, name, or phone", icon: Users, color: "indigo", action: () => setLocation("/admin/patients") },
              { title: "View Bookings", desc: "Manage pending sample collections", icon: Calendar, color: "orange", action: () => setLocation("/admin/bookings") },
            ].map((action) => (
              <Button
                key={action.title}
                variant="outline"
                className="h-auto p-4 flex items-center justify-start gap-4 border-slate-200 hover:border-blue-200 hover:bg-blue-50 group transition-all"
                onClick={action.action}
              >
                <div className={`w-10 h-10 rounded-lg bg-${action.color}-50 flex items-center justify-center group-hover:bg-white transition-colors`}>
                  <action.icon className={`w-5 h-5 text-${action.color}-600`} />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-slate-900">{action.title}</p>
                  <p className="text-sm text-slate-500">{action.desc}</p>
                </div>
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-bold text-slate-900">Recent Activity</h2>
          <Card className="border-none shadow-sm bg-white min-h-[300px] flex flex-col items-center justify-center text-slate-400">
            <Clock className="w-12 h-12 mb-4 opacity-20" />
            <p className="text-sm">Activity log will appear here</p>
          </Card>
        </div>
      </div>
    </div>
  );
}
