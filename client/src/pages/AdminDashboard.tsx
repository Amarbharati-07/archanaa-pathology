import { useEffect, useState } from "react";
import { useLocation, Link } from "wouter";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LogOut, Users, BookOpen, CheckCircle2, Clock, Plus, Edit2, Trash2 } from "lucide-react";
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
    <div className="min-h-screen bg-slate-50">
      <div className="border-b bg-white p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <Button onClick={handleLogout2} variant="outline">
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>

      <div className="p-6 max-w-7xl mx-auto">
        {/* Navigation */}
        <div className="flex gap-4 mb-6 flex-wrap">
          {["dashboard", "users", "bookings", "tests"].map((tab) => (
            <Button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                loadData();
              }}
              variant={activeTab === tab ? "default" : "outline"}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Button>
          ))}
        </div>

        {/* Dashboard Tab */}
        {activeTab === "dashboard" && stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-slate-600 flex items-center gap-2">
                  <Users className="w-4 h-4" /> Total Users
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{stats.totalUsers}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-slate-600 flex items-center gap-2">
                  <BookOpen className="w-4 h-4" /> Total Bookings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{stats.totalBookings}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-slate-600 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> Completed
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{stats.completedTests}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-slate-600 flex items-center gap-2">
                  <Clock className="w-4 h-4" /> Pending
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{stats.pendingTests}</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === "users" && (
          <Card>
            <CardHeader>
              <CardTitle>All Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b">
                    <tr>
                      <th className="text-left p-2">Name</th>
                      <th className="text-left p-2">Email</th>
                      <th className="text-left p-2">Phone</th>
                      <th className="text-left p-2">Age</th>
                      <th className="text-left p-2">Gender</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} className="border-b hover:bg-slate-50">
                        <td className="p-2">{user.name}</td>
                        <td className="p-2">{user.email}</td>
                        <td className="p-2">{user.phone}</td>
                        <td className="p-2">{user.age}</td>
                        <td className="p-2 capitalize">{user.gender}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Bookings Tab */}
        {activeTab === "bookings" && (
          <Card>
            <CardHeader>
              <CardTitle>All Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b">
                    <tr>
                      <th className="text-left p-2">User</th>
                      <th className="text-left p-2">Test/Package</th>
                      <th className="text-left p-2">Date</th>
                      <th className="text-left p-2">Time</th>
                      <th className="text-left p-2">Status</th>
                      <th className="text-left p-2">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((booking) => (
                      <tr key={booking.id} className="border-b hover:bg-slate-50">
                        <td className="p-2">{booking.userName}</td>
                        <td className="p-2">{booking.testName || booking.packageName}</td>
                        <td className="p-2">{new Date(booking.date).toLocaleDateString()}</td>
                        <td className="p-2">{booking.time}</td>
                        <td className="p-2">
                          <span className={`px-2 py-1 rounded text-xs font-bold ${booking.testStatus === "completed" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                            {booking.testStatus}
                          </span>
                        </td>
                        <td className="p-2">₹{booking.totalAmount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tests Tab */}
        {activeTab === "tests" && (
          <div>
            <Button onClick={() => setIsTestModalOpen(true)} className="mb-4 gap-2">
              <Plus className="w-4 h-4" />
              Create Test
            </Button>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tests.map((test) => (
                <Card key={test.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{test.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <p className="text-slate-600">{test.description}</p>
                    <p><strong>Price:</strong> ₹{test.price}</p>
                    <p><strong>Category:</strong> {test.category}</p>
                    <p><strong>Report Time:</strong> {test.reportTime}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Create Test Modal */}
      <Dialog open={isTestModalOpen} onOpenChange={setIsTestModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Test</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Test Name</Label>
              <Input
                value={testForm.name}
                onChange={(e) => setTestForm({ ...testForm, name: e.target.value })}
                placeholder="e.g., Complete Blood Count"
              />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                value={testForm.description}
                onChange={(e) => setTestForm({ ...testForm, description: e.target.value })}
                placeholder="Test description"
              />
            </div>
            <div>
              <Label>Price</Label>
              <Input
                type="number"
                value={testForm.price}
                onChange={(e) => setTestForm({ ...testForm, price: e.target.value })}
                placeholder="e.g., 500"
              />
            </div>
            <div>
              <Label>Report Time</Label>
              <Input
                value={testForm.reportTime}
                onChange={(e) => setTestForm({ ...testForm, reportTime: e.target.value })}
                placeholder="e.g., 24 Hours"
              />
            </div>
            <div>
              <Label>Category</Label>
              <Input
                value={testForm.category}
                onChange={(e) => setTestForm({ ...testForm, category: e.target.value })}
                placeholder="e.g., Hematology"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsTestModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateTest}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
