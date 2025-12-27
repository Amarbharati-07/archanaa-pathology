import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Microscope, Mail, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate sending reset email
    setSubmitted(true);
    toast({
      title: "Reset link sent",
      description: "If an account exists for this email, you will receive reset instructions shortly.",
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-100 p-8 space-y-6">
        <div className="text-center">
          <div className="bg-slate-900 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Microscope className="w-10 h-10 text-blue-500" />
          </div>
          <h2 className="font-display font-bold text-2xl text-slate-900">Reset Password</h2>
          <p className="text-slate-500 mt-2 text-sm">
            Enter your registered email address and we'll send you a link to reset your password.
          </p>
        </div>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm font-semibold">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="your@email.com" 
                  className="pl-10 h-11 bg-slate-50 border-slate-200" 
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            <Button type="submit" className="w-full h-11 bg-blue-600 hover:bg-blue-700 font-bold shadow-lg">
              Send Reset Link
            </Button>
          </form>
        ) : (
          <div className="bg-blue-50 p-4 rounded-xl text-center">
            <p className="text-sm text-blue-700 font-medium">
              Check your inbox! We've sent password reset instructions to <strong>{email}</strong>.
            </p>
          </div>
        )}

        <div className="text-center pt-4 border-t border-slate-100">
          <Link href="/login" className="text-sm text-blue-600 font-bold hover:underline inline-flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
