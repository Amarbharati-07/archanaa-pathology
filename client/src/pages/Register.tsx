import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/context/AuthContext";
import { Microscope, User, Mail, Phone, Lock, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    gender: "",
    age: ""
  });
  const { userRegister, loading } = useAuth();
  const [_, setLocation] = useLocation();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast({ title: "Error", description: "Passwords don't match", variant: "destructive" });
      return;
    }

    try {
      await userRegister({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        gender: formData.gender,
        age: parseInt(formData.age),
      });
      toast({ title: "Registration successful!", description: "Welcome!" });
      setLocation("/dashboard");
    } catch (err: any) {
      toast({ title: "Registration failed", description: err.message, variant: "destructive" });
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl border border-slate-100 p-6 md:p-8">
        <div className="text-center mb-6">
          <div className="bg-slate-900 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Microscope className="w-8 h-8 text-blue-500" />
          </div>
          <h1 className="font-display font-bold text-2xl text-slate-900">Create Account</h1>
          <p className="text-sm text-slate-500 mt-1">Register to book your health tests</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div className="space-y-1">
            <Label htmlFor="name" className="text-xs text-slate-700 font-bold uppercase tracking-wider">Full Name *</Label>
            <div className="relative">
              <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <Input 
                id="name" 
                placeholder="Full name" 
                className="pl-9 h-10 bg-slate-50 border-slate-200 text-sm focus:bg-white transition-all" 
                required 
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="email" className="text-xs text-slate-700 font-bold uppercase tracking-wider">Email *</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="Email" 
                  className="pl-9 h-10 bg-slate-50 border-slate-200 text-sm focus:bg-white transition-all" 
                  required 
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-1">
              <Label htmlFor="phone" className="text-xs text-slate-700 font-bold uppercase tracking-wider">Phone *</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <Input 
                  id="phone" 
                  placeholder="Phone" 
                  className="pl-9 h-10 bg-slate-50 border-slate-200 text-sm focus:bg-white transition-all" 
                  required 
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="password" className="text-xs text-slate-700 font-bold uppercase tracking-wider">Password *</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="Password" 
                  className="pl-9 h-10 bg-slate-50 border-slate-200 text-sm focus:bg-white transition-all" 
                  required 
                  value={formData.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-1">
              <Label htmlFor="confirmPassword" className="text-xs text-slate-700 font-bold uppercase tracking-wider">Confirm Password *</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <Input 
                  id="confirmPassword" 
                  type="password" 
                  placeholder="Confirm Password" 
                  className="pl-9 h-10 bg-slate-50 border-slate-200 text-sm focus:bg-white transition-all" 
                  required 
                  value={formData.confirmPassword}
                  onChange={(e) => handleChange("confirmPassword", e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="gender" className="text-xs text-slate-700 font-bold uppercase tracking-wider">Gender *</Label>
              <Select value={formData.gender} onValueChange={(val) => handleChange("gender", val)}>
                <SelectTrigger className="h-10 bg-slate-50 border-slate-200 text-sm focus:bg-white transition-all">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label htmlFor="age" className="text-xs text-slate-700 font-bold uppercase tracking-wider">Age *</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <Input 
                  id="age" 
                  type="number" 
                  placeholder="Age" 
                  className="pl-9 h-10 bg-slate-50 border-slate-200 text-sm focus:bg-white transition-all" 
                  required 
                  value={formData.age}
                  onChange={(e) => handleChange("age", e.target.value)}
                />
              </div>
            </div>
          </div>

          <Button 
            type="submit" 
            disabled={loading}
            className="w-full h-12 bg-blue-600 hover:bg-blue-700 font-bold shadow-lg shadow-blue-100 mt-6"
          >
            {loading ? "Creating account..." : "Create Account"}
          </Button>
        </form>

        <div className="text-center text-sm pt-4 border-t border-slate-100">
          <span className="text-slate-500">Already have an account? </span>
          <Link href="/login" className="text-blue-600 font-bold hover:underline">Sign in</Link>
        </div>
      </div>
    </div>
  );
}
