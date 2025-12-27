import { Package } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Clock, Check, X } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";

export function PackageCard({ pkg }: { pkg: Package }) {
  const { addItem } = useCart();
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const handleBook = () => {
    addItem({ id: pkg.id, type: "package", name: pkg.name, price: pkg.price });
    toast({
      title: "Added to Cart",
      description: `${pkg.name} has been added to your booking list.`,
    });
  };

  return (
    <div className="group bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col h-full overflow-hidden">
      {/* Image Header */}
      <div className="relative h-48 overflow-hidden">
        <img 
          src={`https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&q=80&w=800`}
          alt={pkg.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {pkg.isFeatured && (
          <div className="absolute top-3 left-3 bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider z-10">
            Best Value
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
      </div>

      <div className="p-6 flex-1 flex flex-col">
        <h3 className="font-bold text-2xl mb-3 text-slate-900">
          {pkg.name}
        </h3>
        
        <p className="text-slate-600 text-sm mb-6 flex-1">
          {pkg.description}
        </p>
        
        <div className="flex items-center gap-2 mb-6">
          <span className="text-blue-600 text-xl font-bold">₹{pkg.price}</span>
          <span className="text-slate-400 text-sm line-through">₹{pkg.price * 1.5}</span>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="h-11 rounded-lg border-slate-200 text-slate-700 font-bold hover:bg-slate-50">
                View Details
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl p-0 gap-0 overflow-hidden rounded-2xl border-none shadow-2xl">
              <div className="p-6 md:p-8 bg-white max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-start mb-4">
                  <DialogHeader className="text-left">
                    <DialogTitle className="text-2xl md:text-3xl font-bold text-slate-900 leading-tight">
                      {pkg.name}
                    </DialogTitle>
                    <div className="flex flex-wrap items-center gap-2 mt-3">
                      <Badge className="bg-slate-100 text-slate-600 hover:bg-slate-100 border-none rounded-md px-3 py-1 font-medium">
                        {pkg.category}
                      </Badge>
                      <Badge className="bg-red-500 text-white hover:bg-red-600 border-none rounded-md px-3 py-1 font-bold">
                        40% OFF
                      </Badge>
                      <div className="flex items-center gap-1.5 text-slate-500 text-sm font-medium ml-1">
                        <Clock className="w-4 h-4" />
                        <span>24-48 hours</span>
                      </div>
                    </div>
                  </DialogHeader>
                </div>

                <p className="text-slate-600 mb-8 leading-relaxed">
                  {pkg.description} Essential health screening package covering basic parameters for overall health assessment.
                </p>

                <div className="space-y-6">
                  <div className="flex items-center gap-2 text-blue-600 font-bold mb-4">
                    <div className="w-5 h-5 rounded-full border-2 border-blue-600 flex items-center justify-center text-[10px]">!</div>
                    <span className="text-lg">Tests Included ({pkg.includes?.length || 0})</span>
                  </div>

                  <div className="space-y-6">
                    {/* Simplified grouping logic for demo - in real app would group by actual test categories */}
                    {["HEMATOLOGY", "DIABETES", "LIVER PROFILE", "KIDNEY PROFILE", "LIPID PROFILE", "THYROID"].map((cat, idx) => (
                      <div key={cat} className="space-y-3">
                        <div className="flex items-center gap-2 text-slate-500 font-bold text-xs tracking-widest">
                          <div className="w-4 h-4 rounded-full border border-slate-300 flex items-center justify-center text-[8px]">&bull;</div>
                          {cat} (1)
                        </div>
                        <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                          <div className="flex items-start gap-3">
                            <Check className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                            <div>
                              <div className="font-bold text-slate-900">{pkg.includes?.[idx] || "Standard Diagnostic Test"}</div>
                              <p className="text-slate-500 text-sm mt-1 leading-snug">
                                Comprehensive clinical evaluation for accurate health assessment and diagnostic monitoring...
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Sticky Action Bar */}
              <div className="p-6 bg-white border-t border-slate-100 flex items-center justify-between shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)]">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-blue-600">₹{pkg.price}</span>
                    <span className="text-slate-400 line-through text-sm">₹{pkg.price * 1.5}</span>
                  </div>
                  <div className="text-green-600 text-sm font-bold mt-0.5">You save ₹{Math.floor(pkg.price * 0.5)}</div>
                </div>
                <div className="flex gap-3">
                  <DialogClose asChild>
                    <Button variant="outline" className="h-12 px-6 rounded-lg font-bold border-slate-200">
                      Close
                    </Button>
                  </DialogClose>
                  <Button 
                    onClick={handleBook}
                    className="h-12 px-8 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold flex items-center gap-2 shadow-lg shadow-blue-200"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Book Now
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          
          <Button 
            onClick={handleBook}
            className="bg-[#4488dd] hover:bg-[#3377cc] text-white rounded-lg h-11 font-bold flex items-center justify-center gap-2 shadow-sm"
          >
            <ShoppingCart className="w-4 h-4" />
            Book Now
          </Button>
        </div>
      </div>
    </div>
  );
}
