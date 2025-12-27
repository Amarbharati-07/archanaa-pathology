import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  FlaskConical, 
  CalendarCheck, 
  LogOut,
  Bell,
  Search,
  Plus,
  ArrowUpRight,
  TrendingUp,
  Clock,
  Activity,
  Sparkles,
  Settings,
  Megaphone,
  MessageSquare,
  Edit2,
  Trash2,
  Check,
  ChevronRight,
  Filter,
  MoreVertical,
  Upload
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useTests } from "@/hooks/use-tests";
import { usePackages } from "@/hooks/use-packages";

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("dashboard");
  const { data: tests, isLoading: testsLoading } = useTests();
  const { data: packages, isLoading: packagesLoading } = usePackages();
  
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);
  const [isPkgModalOpen, setIsPkgModalOpen] = useState(false);
  
  const [editingTest, setEditingTest] = useState<any>(null);
  const [editingPkg, setEditingPkg] = useState<any>(null);

  useEffect(() => {
    const isAuth = localStorage.getItem("admin_auth");
    if (!isAuth) {
      setLocation("/admin/login");
    }
  }, [setLocation]);

  const handleLogout = () => {
    localStorage.removeItem("admin_auth");
    toast({
      title: "Logged out",
      description: "You have been logged out of the admin panel.",
    });
    setLocation("/admin/login");
  };

  const stats = [
    { title: "Total Patients", value: "0", icon: Users, color: "bg-blue-500", trend: "+0%" },
    { title: "Total Reports", value: "0", icon: FileText, color: "bg-emerald-500", trend: "+0%" },
    { title: "Pending Bookings", value: "0", icon: CalendarCheck, color: "bg-amber-500", trend: "Stable" },
    { title: "Available Tests", value: tests?.length.toString() || "0", icon: FlaskConical, color: "bg-purple-500", trend: "Catalog" },
    { title: "Health Packages", value: packages?.length.toString() || "0", icon: Sparkles, color: "bg-rose-500", trend: "Active" },
  ];

  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "patients", label: "Patients", icon: Users },
    { id: "walk-in", label: "Walk-in Collections", icon: Activity },
    { id: "reports", label: "Reports", icon: FileText },
    { id: "tests", label: "Tests", icon: FlaskConical },
    { id: "packages", label: "Health Packages", icon: Sparkles },
    { id: "settings", label: "Lab Settings", icon: Settings },
    { id: "bookings", label: "Bookings", icon: CalendarCheck },
    { id: "ads", label: "Advertisements", icon: Megaphone },
    { id: "reviews", label: "Reviews", icon: MessageSquare },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              {stats.map((stat, idx) => (
                <Card key={idx} className="border-none shadow-sm shadow-slate-200/50 rounded-2xl overflow-hidden hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-bold text-slate-500 mb-1">{stat.title}</p>
                        <h3 className="text-3xl font-bold text-slate-900 tracking-tight">{stat.value}</h3>
                      </div>
                      <div className={`${stat.color} p-3 rounded-2xl text-white shadow-lg shadow-blue-100`}>
                        <stat.icon className="w-5 h-5" />
                      </div>
                    </div>
                    <div className="mt-4 flex items-center gap-1.5">
                      <span className="text-emerald-500 text-xs font-bold bg-emerald-50 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                        <ArrowUpRight className="w-3 h-3" />
                        {stat.trend}
                      </span>
                      <span className="text-slate-400 text-xs">since last month</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Dashboard Widgets */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-8">
                <Card className="border-none shadow-sm shadow-slate-200/50 rounded-2xl h-full">
                  <CardHeader className="flex flex-row items-center justify-between border-b px-6 py-4">
                    <CardTitle className="text-lg font-bold">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button className="h-16 justify-start gap-4 rounded-xl border border-slate-100 bg-slate-50 text-slate-900 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-100 transition-all font-bold group">
                      <div className="bg-white p-2 rounded-lg shadow-sm group-hover:bg-blue-100 transition-colors">
                        <Plus className="w-5 h-5 text-blue-600" />
                      </div>
                      Create New Report
                    </Button>
                    <Button className="h-16 justify-start gap-4 rounded-xl border border-slate-100 bg-slate-50 text-slate-900 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-100 transition-all font-bold group">
                      <div className="bg-white p-2 rounded-lg shadow-sm group-hover:bg-blue-100 transition-colors">
                        <Users className="w-5 h-5 text-blue-600" />
                      </div>
                      Register Patient
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <div className="lg:col-span-4">
                <Card className="border-none shadow-sm shadow-slate-200/50 rounded-2xl h-full">
                  <CardHeader className="border-b px-6 py-4">
                    <CardTitle className="text-lg font-bold">Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 flex flex-col items-center justify-center min-h-[200px] text-center">
                    <div className="bg-slate-50 p-4 rounded-full mb-4">
                      <Clock className="w-8 h-8 text-slate-300" />
                    </div>
                    <p className="text-slate-400 font-bold text-sm">No recent activity</p>
                    <p className="text-slate-300 text-xs mt-1 tracking-tight uppercase">Recent logs will appear here</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </>
        );
      case "tests":
        const testsByCategory = tests?.reduce((acc: any, test) => {
          if (!acc[test.category]) acc[test.category] = [];
          acc[test.category].push(test);
          return acc;
        }, {});

        return (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Tests</h2>
                <p className="text-slate-500 font-medium">Manage test catalog and parameters</p>
              </div>
              <Button onClick={() => { setEditingTest(null); setIsTestModalOpen(true); }} className="bg-blue-600 hover:bg-blue-700 h-11 px-6 rounded-xl font-bold shadow-lg shadow-blue-100 flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Add Test
              </Button>
            </div>

            {testsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map(i => <div key={i} className="h-48 bg-white rounded-2xl animate-pulse border border-slate-100" />)}
              </div>
            ) : testsByCategory && Object.keys(testsByCategory).map(category => (
              <div key={category} className="space-y-4">
                <div className="flex items-center gap-2">
                  <FlaskConical className="w-5 h-5 text-blue-500" />
                  <h3 className="text-lg font-bold text-slate-900">{category}</h3>
                  <Badge variant="outline" className="bg-slate-50 text-slate-500 border-slate-200 rounded-full">{testsByCategory[category].length}</Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {testsByCategory[category].map((test: any) => (
                    <Card key={test.id} className="border-none shadow-sm shadow-slate-200/50 rounded-2xl overflow-hidden hover:shadow-md transition-all group">
                      <CardContent className="p-5">
                        <div className="flex gap-4 mb-4">
                          <div className="w-16 h-16 rounded-xl bg-slate-100 overflow-hidden shrink-0">
                            <img src={test.image || `https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&q=80&w=100`} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-slate-900 truncate">{test.name}</h4>
                            <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">{test.category}</p>
                            <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-snug">{test.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                          <div className="flex flex-col">
                            <span className="text-blue-600 font-bold">₹{test.price}</span>
                            <span className="text-[10px] text-slate-400 flex items-center gap-1">
                              <Clock className="w-3 h-3" /> {test.reportTime}
                            </span>
                          </div>
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-slate-400 hover:text-blue-600" onClick={() => { setEditingTest(test); setIsTestModalOpen(true); }}>
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-slate-400 hover:text-red-600">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        );
      case "packages":
        return (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Health Packages</h2>
                <p className="text-slate-500 font-medium">Manage health checkup packages and pricing</p>
              </div>
              <Button onClick={() => { setEditingPkg(null); setIsPkgModalOpen(true); }} className="bg-blue-600 hover:bg-blue-700 h-11 px-6 rounded-xl font-bold shadow-lg shadow-blue-100 flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Add Package
              </Button>
            </div>

            {packagesLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => <div key={i} className="h-32 bg-white rounded-2xl animate-pulse border border-slate-100" />)}
              </div>
            ) : (
              <div className="space-y-4">
                {packages?.map((pkg) => (
                  <Card key={pkg.id} className="border-none shadow-sm shadow-slate-200/50 rounded-2xl overflow-hidden hover:shadow-md transition-all group">
                    <CardContent className="p-0">
                      <div className="flex flex-col md:flex-row items-center gap-6 p-6">
                        <div className="w-24 h-16 rounded-xl bg-slate-100 overflow-hidden shrink-0">
                          <img src={pkg.image || `https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&q=80&w=200`} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <h4 className="font-bold text-slate-900 text-lg">{pkg.name}</h4>
                            <Badge className="bg-blue-50 text-blue-600 border-none rounded-md px-2 py-0.5 text-[10px] font-bold uppercase">Active</Badge>
                            <Badge variant="outline" className="text-slate-400 border-slate-200 text-[10px] rounded-md">{pkg.category}</Badge>
                            <Badge className="bg-red-500 text-white border-none rounded-md px-2 py-0.5 text-[10px] font-bold">40% OFF</Badge>
                          </div>
                          <p className="text-sm text-slate-500 line-clamp-1">{pkg.description}</p>
                          <div className="flex flex-wrap items-center gap-4 mt-3 text-[11px] font-bold text-slate-400">
                            <span className="flex items-center gap-1.5"><FlaskConical className="w-3.5 h-3.5" /> {pkg.includes?.length || 0} tests</span>
                            <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Reports: 24-48 hours</span>
                            <span className="flex items-center gap-1.5 text-blue-600"><Check className="w-3.5 h-3.5" /> ₹{pkg.price} <span className="text-slate-300 line-through">₹{Math.floor(pkg.price * 1.6)}</span></span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl border-slate-100 text-slate-400 hover:text-blue-600 hover:bg-blue-50" onClick={() => { setEditingPkg(pkg); setIsPkgModalOpen(true); }}>
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl border-slate-100 text-slate-400 hover:text-red-600 hover:bg-red-50">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        );
      default:
        return (
          <div className="flex flex-col items-center justify-center min-h-[400px] bg-white rounded-2xl border border-dashed border-slate-200 p-8">
            <div className="bg-slate-50 p-6 rounded-3xl mb-6">
              <Activity className="w-12 h-12 text-slate-300 animate-pulse" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Management Interface Coming Soon</h3>
            <p className="text-slate-500 max-w-sm text-center font-medium leading-relaxed">
              We are working on bringing full {activeTab} management capabilities to the dashboard.
            </p>
            <Button variant="outline" className="mt-8 px-8 rounded-xl font-bold" onClick={() => setActiveTab("dashboard")}>
              Return to Dashboard
            </Button>
          </div>
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r flex flex-col fixed inset-y-0 z-50">
        <div className="p-6 border-b">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-1.5 rounded-lg">
              <FlaskConical className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight">Archana Pathology</span>
          </div>
        </div>
        
        <div className="px-6 py-4">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Menu</p>
        </div>
        
        <nav className="flex-1 px-4 space-y-0.5">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                activeTab === item.id 
                  ? "bg-blue-50 text-blue-600 shadow-sm shadow-blue-100/50" 
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t bg-slate-50/50">
          <div className="px-4 py-2 mb-2">
            <p className="text-[10px] font-medium text-slate-400">Logged in as: <span className="text-slate-900 font-bold">Admin User</span></p>
          </div>
          <Button 
            variant="ghost" 
            onClick={handleLogout}
            className="w-full justify-start gap-3 text-slate-500 hover:text-red-600 hover:bg-red-50 font-bold rounded-xl h-10 px-4"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 min-h-screen">
        {/* Header */}
        <header className="h-20 bg-white border-b sticky top-0 z-40 px-8 flex items-center justify-between shadow-sm shadow-slate-100/50">
          <h1 className="text-xl font-bold text-slate-900 capitalize">{activeTab.replace("-", " ")}</h1>
          
          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search anything..." 
                className="pl-10 pr-4 h-10 rounded-lg bg-slate-50 border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 w-64 transition-all"
              />
            </div>
            <button className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors">
              <Bell className="w-5 h-5" />
            </button>
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">
              AD
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-8">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {renderContent()}
          </motion.div>
        </div>
      </main>

      {/* Modals */}
      <Dialog open={isTestModalOpen} onOpenChange={setIsTestModalOpen}>
        <DialogContent className="max-w-xl rounded-2xl p-0 overflow-hidden border-none shadow-2xl">
          <DialogHeader className="p-6 md:p-8 bg-slate-50 border-b">
            <DialogTitle className="text-2xl font-bold text-slate-900">{editingTest ? 'Edit Test' : 'Add New Test'}</DialogTitle>
          </DialogHeader>
          <div className="p-6 md:p-8 bg-white space-y-5 max-h-[70vh] overflow-y-auto">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="font-bold text-slate-700">Test Name</Label>
                <Input defaultValue={editingTest?.name} placeholder="e.g. Complete Blood Count" className="rounded-xl bg-slate-50 border-slate-200 h-11" />
              </div>
              <div className="space-y-2">
                <Label className="font-bold text-slate-700">Category</Label>
                <Select defaultValue={editingTest?.category || "Hematology"}>
                  <SelectTrigger className="rounded-xl bg-slate-50 border-slate-200 h-11">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Hematology">Hematology</SelectItem>
                    <SelectItem value="Biochemistry">Biochemistry</SelectItem>
                    <SelectItem value="Hormones">Hormones</SelectItem>
                    <SelectItem value="Diabetes">Diabetes</SelectItem>
                    <SelectItem value="Cardiology">Cardiology</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="font-bold text-slate-700">Description</Label>
              <Textarea defaultValue={editingTest?.description} placeholder="Enter test details..." className="rounded-xl bg-slate-50 border-slate-200 min-h-[100px]" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="font-bold text-slate-700">Price (₹)</Label>
                <Input type="number" defaultValue={editingTest?.price} className="rounded-xl bg-slate-50 border-slate-200 h-11" />
              </div>
              <div className="space-y-2">
                <Label className="font-bold text-slate-700">Report Time</Label>
                <Input defaultValue={editingTest?.reportTime} placeholder="e.g. 12 Hours" className="rounded-xl bg-slate-50 border-slate-200 h-11" />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="font-bold text-slate-700">Image URL</Label>
              <div className="relative">
                <Upload className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input defaultValue={editingTest?.image} placeholder="https://images.unsplash.com/..." className="pl-10 rounded-xl bg-slate-50 border-slate-200 h-11" />
              </div>
            </div>
            <div className="flex items-center space-x-2 bg-slate-50 p-4 rounded-xl border border-slate-100">
              <Checkbox id="popular" defaultChecked={editingTest?.isPopular} />
              <label htmlFor="popular" className="text-sm font-bold text-slate-700 cursor-pointer">Mark as Popular Test</label>
            </div>
          </div>
          <DialogFooter className="p-6 md:p-8 bg-white border-t flex flex-row gap-3">
            <Button variant="outline" className="flex-1 h-11 rounded-xl font-bold" onClick={() => setIsTestModalOpen(false)}>Cancel</Button>
            <Button className="flex-1 h-11 rounded-xl font-bold bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-100" onClick={() => setIsTestModalOpen(false)}>Save Test</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isPkgModalOpen} onOpenChange={setIsPkgModalOpen}>
        <DialogContent className="max-w-xl rounded-2xl p-0 overflow-hidden border-none shadow-2xl">
          <DialogHeader className="p-6 md:p-8 bg-slate-50 border-b">
            <DialogTitle className="text-2xl font-bold text-slate-900">{editingPkg ? 'Edit Package' : 'Add New Package'}</DialogTitle>
          </DialogHeader>
          <div className="p-6 md:p-8 bg-white space-y-5 max-h-[70vh] overflow-y-auto">
            <div className="space-y-2">
              <Label className="font-bold text-slate-700">Package Name</Label>
              <Input defaultValue={editingPkg?.name} placeholder="e.g. Executive Men's Checkup" className="rounded-xl bg-slate-50 border-slate-200 h-11" />
            </div>
            <div className="space-y-2">
              <Label className="font-bold text-slate-700">Category</Label>
              <Select defaultValue={editingPkg?.category || "Men"}>
                <SelectTrigger className="rounded-xl bg-slate-50 border-slate-200 h-11">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Men">Men</SelectItem>
                  <SelectItem value="Women">Women</SelectItem>
                  <SelectItem value="Young/General">Young/General</SelectItem>
                  <SelectItem value="Senior Citizen">Senior Citizen</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="font-bold text-slate-700">Description</Label>
              <Textarea defaultValue={editingPkg?.description} placeholder="Enter package details..." className="rounded-xl bg-slate-50 border-slate-200 min-h-[100px]" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="font-bold text-slate-700">Price (₹)</Label>
                <Input type="number" defaultValue={editingPkg?.price} className="rounded-xl bg-slate-50 border-slate-200 h-11" />
              </div>
              <div className="space-y-2">
                <Label className="font-bold text-slate-700">Discount Label</Label>
                <Input placeholder="e.g. 40% OFF" className="rounded-xl bg-slate-50 border-slate-200 h-11" />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="font-bold text-slate-700">Image URL</Label>
              <div className="relative">
                <Upload className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input defaultValue={editingPkg?.image} placeholder="https://images.unsplash.com/..." className="pl-10 rounded-xl bg-slate-50 border-slate-200 h-11" />
              </div>
            </div>
            <div className="space-y-3">
              <Label className="font-bold text-slate-700">Included Tests</Label>
              <div className="grid grid-cols-2 gap-3 max-h-40 overflow-y-auto p-1">
                {tests?.map(test => (
                  <div key={test.id} className="flex items-center space-x-2 p-2 bg-slate-50 rounded-lg border border-slate-100">
                    <Checkbox id={`test-${test.id}`} defaultChecked={editingPkg?.includes?.includes(test.name)} />
                    <label htmlFor={`test-${test.id}`} className="text-xs font-medium text-slate-700 truncate cursor-pointer">{test.name}</label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter className="p-6 md:p-8 bg-white border-t flex flex-row gap-3">
            <Button variant="outline" className="flex-1 h-11 rounded-xl font-bold" onClick={() => setIsPkgModalOpen(false)}>Cancel</Button>
            <Button className="flex-1 h-11 rounded-xl font-bold bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-100" onClick={() => setIsPkgModalOpen(false)}>Save Package</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

