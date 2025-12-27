import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { Microscope } from "lucide-react";

export default function Register() {
  const [email, setEmail] = useState("");
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
      <div className="hidden md:flex bg-primary text-white flex-col justify-center p-12 relative overflow-hidden">
         <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&q=80')] opacity-20 bg-cover bg-center"></div>
         <div className="relative z-10">
            <Microscope className="w-16 h-16 text-white mb-6" />
            <h1 className="font-display font-bold text-5xl mb-6">Join Us Today</h1>
            <p className="text-xl text-blue-100">Create an account to track your health journey with Archana Pathology Lab.</p>
         </div>
      </div>

      {/* Right side - Form */}
      <div className="flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center md:text-left">
            <h2 className="font-display font-bold text-3xl">Create Account</h2>
            <p className="text-muted-foreground mt-2">Enter your details to register</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                 <Label htmlFor="fname">First Name</Label>
                 <Input id="fname" placeholder="John" required />
               </div>
               <div className="space-y-2">
                 <Label htmlFor="lname">Last Name</Label>
                 <Input id="lname" placeholder="Doe" required />
               </div>
            </div>
            
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
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" required />
            </div>

            <Button type="submit" className="w-full h-11 font-bold shadow-lg">Create Account</Button>
          </form>

          <div className="text-center text-sm">
            <span className="text-muted-foreground">Already have an account? </span>
            <Link href="/login" className="text-primary font-bold hover:underline">Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
