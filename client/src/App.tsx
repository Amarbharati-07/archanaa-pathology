import { Switch, Route, useLocation } from "wouter";
import { useState, useEffect } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import NotFound from "@/pages/not-found";
import { motion, AnimatePresence } from "framer-motion";
import logoImg from "@/assets/logo.png";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import Home from "@/pages/Home";
import Tests from "@/pages/Tests";
import Packages from "@/pages/Packages";
import Cart from "@/pages/Cart";
import Checkout from "@/pages/Checkout";
import BookingConfirmation from "@/pages/BookingConfirmation";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import ForgotPassword from "@/pages/ForgotPassword";
import Contact from "@/pages/Contact";
import AdminLogin from "@/pages/AdminLogin";
import AdminDashboard from "@/pages/AdminDashboard";
import AdminBookings from "@/pages/AdminBookings";
import AdminPatients from "@/pages/AdminPatients";
import AdminTests from "@/pages/AdminTests";
import AdminPackages from "@/pages/AdminPackages";
import AdminCreateReport from "@/pages/AdminCreateReport";
import AdminReports from "@/pages/AdminReports";
import UserDashboard from "@/pages/UserDashboard";

function AppLoader() {
  return (
    <div className="fixed inset-0 bg-white z-[9999] flex flex-col items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center"
      >
        <div className="relative mb-8">
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5] 
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute inset-0 bg-blue-100 rounded-full blur-2xl"
          />
          <div className="relative bg-white p-2 rounded-3xl shadow-2xl shadow-blue-100 border border-blue-50 overflow-hidden">
            <img 
              src={logoImg} 
              alt="Archana Pathology Lab Logo" 
              className="w-24 h-24 object-contain"
            />
          </div>
        </div>
        
        <h2 className="text-3xl font-display font-bold text-slate-900 mb-2 tracking-tight">Archana Pathology Lab</h2>
        <p className="text-slate-500 font-medium mb-8">Initializing secure health portal...</p>
        
        <div className="w-48 h-1.5 bg-slate-100 rounded-full overflow-hidden relative">
          <motion.div
            initial={{ left: "-100%" }}
            animate={{ left: "100%" }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute top-0 bottom-0 w-1/2 bg-gradient-to-r from-transparent via-blue-600 to-transparent"
          />
        </div>
      </motion.div>
    </div>
  );
}

function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const isAuthPage = location === "/login" || location === "/register" || location === "/forgot-password" || location === "/admin/login";
  const isAdminPage = location.startsWith("/admin");
  const isDashboardPage = location === "/dashboard" || location === "/user/dashboard";

  return (
    <div className="flex flex-col min-h-screen font-sans">
      {!isAuthPage && !isAdminPage && !isDashboardPage && <Header />}
      <main className="flex-1">
        {children}
      </main>
      {!isAuthPage && !isAdminPage && !isDashboardPage && <Footer />}
    </div>
  );
}

import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/AdminSidebar";
import { Button } from "@/components/ui/button";
import { Clock, Users } from "lucide-react";

function Router() {
  const [location] = useLocation();
  const isAdminPage = location.startsWith("/admin") && location !== "/admin/login";

  if (isAdminPage) {
    return (
      <SidebarProvider>
        <div className="flex min-h-screen w-full bg-slate-50/50">
          <AdminSidebar />
          <div className="flex-1 flex flex-col min-w-0">
            <header className="h-16 border-b bg-white flex items-center justify-between px-6 sticky top-0 z-20">
              <div className="flex items-center gap-4">
                <h2 className="text-sm font-medium text-slate-500">Overview of lab operations</h2>
              </div>
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" className="text-slate-500">
                  <Clock className="w-5 h-5" />
                </Button>
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <Users className="w-4 h-4 text-blue-600" />
                </div>
              </div>
            </header>
            <main className="p-6">
              <Switch>
                <Route path="/admin" component={AdminDashboard} />
                <Route path="/admin/patients" component={AdminPatients} />
                <Route path="/admin/tests" component={AdminTests} />
                <Route path="/admin/packages" component={AdminPackages} />
                <Route path="/admin/bookings" component={AdminBookings} />
                <Route path="/admin/reports" component={AdminReports} />
                <Route path="/admin/create-report/:bookingId" component={AdminCreateReport} />
                {/* Placeholder for other admin routes */}
                <Route path="/admin/:rest*" component={AdminDashboard} />
              </Switch>
            </main>
          </div>
        </div>
      </SidebarProvider>
    );
  }

  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/tests" component={Tests} />
        <Route path="/packages" component={Packages} />
        <Route path="/cart" component={Cart} />
        <Route path="/checkout" component={Checkout} />
        <Route path="/booking-confirmation" component={BookingConfirmation} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/forgot-password" component={ForgotPassword} />
        <Route path="/contact" component={Contact} />
        <Route path="/dashboard" component={UserDashboard} />
        <Route path="/about" component={Contact} /> 
        <Route path="/admin/login" component={AdminLogin} />
        <Route path="/user/dashboard" component={UserDashboard} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000); // Reduced loading time for better UX
    return () => clearTimeout(timer);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <CartProvider>
            <AnimatePresence>
              {loading && <AppLoader />}
            </AnimatePresence>
            <Toaster />
            <Router />
          </CartProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
