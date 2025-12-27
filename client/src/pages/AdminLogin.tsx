import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ShieldCheck, User, Lock, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Static credentials as requested
    if (username === "admin" && password === "admin123") {
      setTimeout(() => {
        localStorage.setItem("admin_auth", "true");
        toast({
          title: "Login Successful",
          description: "Welcome to the admin dashboard.",
        });
        setLocation("/admin");
      }, 1000);
    } else {
      setTimeout(() => {
        setIsLoading(false);
        toast({
          title: "Login Failed",
          description: "Invalid admin credentials.",
          variant: "destructive",
        });
      }, 800);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <div className="p-4 border-b bg-white flex items-center gap-2">
        <Link href="/" className="text-slate-500 hover:text-slate-900 transition-colors flex items-center gap-1 text-sm font-medium">
          <ArrowLeft className="w-4 h-4" /> Back to Website
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="flex justify-center mb-8">
            <div className="p-3 bg-blue-600 rounded-2xl shadow-xl shadow-blue-200">
              <ShieldCheck className="w-8 h-8 text-white" />
            </div>
          </div>

          <Card className="border-none shadow-2xl shadow-slate-200/50 rounded-2xl overflow-hidden">
            <CardHeader className="space-y-1 text-center pt-8">
              <CardTitle className="text-2xl font-bold tracking-tight">Admin Login</CardTitle>
              <CardDescription>
                Enter your credentials to access the admin dashboard
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8 pt-4">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      id="username"
                      placeholder="admin"
                      className="pl-10 h-12 rounded-xl bg-slate-50 border-slate-200"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      className="pl-10 h-12 rounded-xl bg-slate-50 border-slate-200"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <Button 
                  type="submit" 
                  className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700 font-bold shadow-lg shadow-blue-100 transition-all active:scale-[0.98]"
                  disabled={isLoading}
                >
                  {isLoading ? "Authenticating..." : "Login"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
