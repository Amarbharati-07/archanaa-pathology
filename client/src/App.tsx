import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import NotFound from "@/pages/not-found";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import Home from "@/pages/Home";
import Tests from "@/pages/Tests";
import Packages from "@/pages/Packages";
import Cart from "@/pages/Cart";
import Checkout from "@/pages/Checkout";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Contact from "@/pages/Contact";

function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const isAuthPage = location === "/login" || location === "/register";

  return (
    <div className="flex flex-col min-h-screen font-sans">
      {!isAuthPage && <Header />}
      <main className="flex-1">
        {children}
      </main>
      {!isAuthPage && <Footer />}
    </div>
  );
}

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/tests" component={Tests} />
        <Route path="/packages" component={Packages} />
        <Route path="/cart" component={Cart} />
        <Route path="/checkout" component={Checkout} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/contact" component={Contact} />
        {/* Placeholder for About - reuse Contact or Home for now since content wasn't specified */}
        <Route path="/about" component={Contact} /> 
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <CartProvider>
            <Toaster />
            <Router />
          </CartProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
