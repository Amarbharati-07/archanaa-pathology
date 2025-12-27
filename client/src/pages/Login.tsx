import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { Microscope } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const [_, setLocation] = useLocation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email);
    setLocation("/");
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/* Left side - Branding */}
      <div className="hidden md:flex bg-slate-900 text-white flex-col justify-center p-12 relative overflow-hidden">
         <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80')] opacity-20 bg-cover bg-center"></div>
         <div className="relative z-10">
            <Microscope className="w-16 h-16 text-primary mb-6" />
            <h1 className="font-display font-bold text-5xl mb-6">Welcome Back</h1>
            <p className="text-xl text-slate-300">Access your reports, bookings, and health history in one secure place.</p>
         </div>
      </div>

      {/* Right side - Form */}
      <div className="flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center md:text-left">
            <h2 className="font-display font-bold text-3xl">Sign In</h2>
            <p className="text-muted-foreground mt-2">Enter your credentials to access your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="name@example.com" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="password">Password</Label>
                <Link href="#" className="text-xs text-primary font-medium hover:underline">Forgot password?</Link>
              </div>
              <Input 
                id="password" 
                type="password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <Button type="submit" className="w-full h-11 font-bold shadow-lg">Sign In</Button>
          </form>

          <div className="text-center text-sm">
            <span className="text-muted-foreground">Don't have an account? </span>
            <Link href="/register" className="text-primary font-bold hover:underline">Register now</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
