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
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-100 p-8 space-y-8">
        <div className="text-center">
          <div className="bg-slate-900 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Microscope className="w-10 h-10 text-blue-500" />
          </div>
          <h2 className="font-display font-bold text-3xl text-slate-900">Sign In</h2>
          <p className="text-slate-500 mt-2">Enter your credentials to access your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="name@example.com" 
              className="h-12 bg-slate-50 border-slate-200 focus:bg-white transition-all"
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="password">Password</Label>
              <Link href="#" className="text-xs text-blue-600 font-medium hover:underline">Forgot password?</Link>
            </div>
            <Input 
              id="password" 
              type="password" 
              className="h-12 bg-slate-50 border-slate-200 focus:bg-white transition-all"
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <Button type="submit" className="w-full h-12 bg-blue-600 hover:bg-blue-700 font-bold shadow-lg shadow-blue-100">Sign In</Button>
        </form>

        <div className="text-center text-sm pt-4 border-t border-slate-100">
          <span className="text-slate-500">Don't have an account? </span>
          <Link href="/register" className="text-blue-600 font-bold hover:underline">Register now</Link>
        </div>
      </div>
    </div>
  );
}
