import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Trash2, ArrowRight, ShoppingBag, Info, ShieldCheck } from "lucide-react";
import { Link, useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

export default function Cart() {
  const { items, removeItem, total, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [_, setLocation] = useLocation();
  const { toast } = useToast();

  const handleCheckout = () => {
    if (!isAuthenticated) {
      toast({
        title: "Login Required",
        description: "Please login or register to book these tests. All registration fields are mandatory for accurate medical records.",
        variant: "destructive",
      });
      setLocation("/login");
      return;
    }
    setLocation("/checkout");
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 bg-white">
        <div className="bg-blue-50 w-24 h-24 rounded-full flex items-center justify-center mb-6 animate-in zoom-in duration-500">
          <ShoppingBag className="w-10 h-10 text-blue-600" />
        </div>
        <h1 className="font-display font-bold text-3xl mb-4 text-slate-900">Your cart is empty</h1>
        <p className="text-slate-500 mb-8 max-w-xs text-center">Looks like you haven't added any diagnostic tests or health packages yet.</p>
        <Link href="/tests">
          <Button size="lg" className="px-10 h-14 rounded-xl bg-blue-600 hover:bg-blue-700 font-bold shadow-lg shadow-blue-200">
            Browse Tests
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 py-12 md:py-20">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
          <div>
            <h1 className="font-display font-bold text-4xl text-slate-900 mb-2">My Booking Cart</h1>
            <p className="text-slate-500">Review your selected tests and health packages</p>
          </div>
          <Button variant="ghost" onClick={clearCart} className="text-red-500 hover:text-red-600 hover:bg-red-50 font-bold h-10 px-4 rounded-lg">
            <Trash2 className="w-4 h-4 mr-2" />
            Clear All
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Cart Items List */}
          <div className="lg:col-span-8 space-y-6">
            {!isAuthenticated && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-amber-50 border border-amber-200 rounded-2xl p-6 flex items-start gap-4"
              >
                <div className="bg-amber-100 p-2 rounded-lg">
                  <Info className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h4 className="font-bold text-amber-900 mb-1">Mandatory Login for Booking</h4>
                  <p className="text-sm text-amber-800 leading-relaxed">
                    You can browse and add items, but you must log in to complete your booking. New patients are required to fill all mandatory profile fields for accurate medical records.
                  </p>
                </div>
              </motion.div>
            )}

            <div className="space-y-4">
              <AnimatePresence>
                {items.map((item, index) => (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95, x: -20 }}
                    key={`${item.id}-${item.type}-${index}`} 
                    className="bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-6 hover:shadow-md transition-all group"
                  >
                    <div className="flex items-center gap-5 w-full sm:w-auto">
                      <div className={`w-14 h-14 rounded-xl flex items-center justify-center shrink-0 ${
                        item.type === 'package' ? 'bg-purple-50 text-purple-600' : 'bg-blue-50 text-blue-600'
                      }`}>
                        {item.type === 'package' ? <ShoppingBag size={24} /> : <Info size={24} />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className={`text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 rounded ${
                            item.type === 'package' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                          }`}>
                            {item.type === 'package' ? 'Health Package' : 'Diagnostic Test'}
                          </span>
                        </div>
                        <h3 className="font-bold text-lg text-slate-900 group-hover:text-blue-600 transition-colors">{item.name}</h3>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between sm:justify-end gap-8 w-full sm:w-auto pt-4 sm:pt-0 border-t sm:border-0 border-slate-50">
                      <div className="flex flex-col items-end">
                        <span className="text-xs text-slate-400 uppercase font-bold tracking-tighter mb-0.5">Price</span>
                        <span className="font-black text-2xl text-slate-900">₹{item.price}</span>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="text-slate-300 hover:text-red-500 hover:bg-red-50 w-12 h-12 rounded-xl border border-transparent hover:border-red-100 transition-all"
                        onClick={() => removeItem(item.id, item.type)}
                      >
                        <Trash2 className="w-5 h-5" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-4">
            <Card className="shadow-2xl shadow-slate-200 border-none rounded-[2rem] overflow-hidden sticky top-24">
              <div className="bg-slate-900 p-8 text-white relative overflow-hidden">
                <div className="relative z-10">
                  <h3 className="font-display font-bold text-2xl">Order Summary</h3>
                  <p className="text-slate-400 text-sm mt-1 font-medium">Archana Pathology Lab</p>
                </div>
                {/* Abstract shape */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
              </div>
              
              <CardContent className="p-8 bg-white">
                <div className="space-y-6 mb-10">
                  <div className="flex justify-between items-center text-slate-600">
                    <span className="font-medium">Subtotal ({items.length} items)</span>
                    <span className="font-bold text-slate-900 text-lg">₹{total}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-slate-600">Home Collection</span>
                    <div className="flex flex-col items-end">
                      <span className="text-green-600 font-black text-sm uppercase tracking-widest">Free</span>
                      <span className="text-[10px] text-slate-400 font-bold italic">Limited time offer</span>
                    </div>
                  </div>
                  
                  <div className="pt-6 border-t border-slate-100">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-slate-500 font-bold uppercase tracking-wider text-xs">Total Payable</span>
                      <span className="text-blue-600 font-black text-3xl">₹{total}</span>
                    </div>
                    <p className="text-[10px] text-slate-400 font-medium">Inclusive of all taxes and processing fees</p>
                  </div>
                </div>

                <Button 
                  className="w-full h-16 text-lg rounded-2xl bg-blue-600 hover:bg-blue-700 font-bold shadow-xl shadow-blue-200 transition-all active:scale-[0.98] group" 
                  onClick={handleCheckout}
                >
                  {isAuthenticated ? (
                    <>Confirm Booking <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" /></>
                  ) : (
                    <>Login to Book <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" /></>
                  )}
                </Button>
                
                {!isAuthenticated ? (
                  <div className="text-center mt-6 p-4 rounded-xl bg-slate-50 border border-slate-100">
                    <p className="text-xs text-slate-500 font-medium leading-relaxed">
                      New patient? <Link href="/register" className="text-blue-600 font-bold hover:underline">Register with all mandatory fields</Link> to access your reports online.
                    </p>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2 mt-6 text-slate-400">
                    <ShieldCheck className="w-4 h-4 text-green-500" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Safe & Secure Booking</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
