import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { motion } from "framer-motion";
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
  MessageSquare
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("dashboard");

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
    { title: "Available Tests", value: "78", icon: FlaskConical, color: "bg-purple-500", trend: "Catalog" },
    { title: "Health Packages", value: "6", icon: Sparkles, color: "bg-rose-500", trend: "Active" },
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
          <h1 className="text-xl font-bold text-slate-900 capitalize">{activeTab}</h1>
          
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
            {activeTab === "dashboard" ? (
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
            ) : (
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
            )}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
