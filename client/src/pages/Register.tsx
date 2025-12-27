import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/context/AuthContext";
import { Microscope, User, Mail, Phone, Lock, Calendar, ChevronRight } from "lucide-react";

export default function Register() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    gender: "",
    dob: ""
  });
  const { login } = useAuth();
  const [_, setLocation] = useLocation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, we would validate all fields here
    login(formData.email);
    setLocation("/");
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-white rounded-3xl shadow-xl border border-slate-100 p-6 md:p-8">
        <div className="text-center mb-6">
          <div className="bg-slate-900 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Microscope className="w-8 h-8 text-blue-500" />
          </div>
          <h1 className="font-display font-bold text-2xl text-slate-900">Create Account</h1>
          <p className="text-sm text-slate-500 mt-1">Fill in mandatory fields for your medical reports.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="fullName" className="text-sm text-slate-700 font-semibold">Full Name *</Label>
            <div className="relative">
              <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <Input 
                id="fullName" 
                placeholder="Full name" 
                className="pl-9 h-10 bg-slate-50 border-slate-200 text-sm" 
                required 
                value={formData.fullName}
                onChange={(e) => handleChange("fullName", e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm text-slate-700 font-semibold">Email *</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="Email" 
                  className="pl-9 h-10 bg-slate-50 border-slate-200 text-sm" 
                  required 
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="phone" className="text-sm text-slate-700 font-semibold">Phone *</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <Input 
                  id="phone" 
                  placeholder="Phone" 
                  className="pl-9 h-10 bg-slate-50 border-slate-200 text-sm" 
                  required 
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-sm text-slate-700 font-semibold">Password *</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="Password" 
                  className="pl-9 h-10 bg-slate-50 border-slate-200 text-sm" 
                  required 
                  value={formData.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="confirmPassword" className="text-sm text-slate-700 font-semibold">Confirm *</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <Input 
                  id="confirmPassword" 
                  type="password" 
                  placeholder="Confirm" 
                  className="pl-9 h-10 bg-slate-50 border-slate-200 text-sm" 
                  required 
                  value={formData.confirmPassword}
                  onChange={(e) => handleChange("confirmPassword", e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-sm text-slate-700 font-semibold">Gender *</Label>
              <Select onValueChange={(v) => handleChange("gender", v)} required>
                <SelectTrigger className="h-10 bg-slate-50 border-slate-200 text-sm">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="dob" className="text-sm text-slate-700 font-semibold">DOB *</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 z-10" />
                <Input 
                  id="dob" 
                  type="date" 
                  className="pl-9 h-10 bg-slate-50 border-slate-200 text-sm" 
                  required 
                  value={formData.dob}
                  onChange={(e) => handleChange("dob", e.target.value)}
                />
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-50 mt-2">
            Create Account
          </Button>
        </form>

        <div className="text-center mt-6 pt-4 border-t border-slate-100">
          <span className="text-xs text-slate-500">Already have an account? </span>
          <Link href="/login" className="text-xs text-blue-600 font-bold hover:underline">Log in</Link>
        </div>
      </div>
    </div>
  );
}
