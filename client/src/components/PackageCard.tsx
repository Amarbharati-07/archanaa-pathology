import { Package } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Info } from "lucide-react";
import { useCart } from "@/context/CartContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function PackageCard({ pkg }: { pkg: Package }) {
  const { addItem } = useCart();

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
                Details
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md rounded-2xl">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-slate-900">{pkg.name}</DialogTitle>
                <DialogDescription className="text-slate-600 pt-2">{pkg.description}</DialogDescription>
              </DialogHeader>
              <div className="mt-6 space-y-4">
                <h4 className="font-bold text-slate-900">Included Tests:</h4>
                <div className="grid grid-cols-1 gap-2">
                  {pkg.includes?.map((item, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                      <span className="text-sm font-medium text-slate-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-8 flex items-center justify-between p-4 rounded-xl bg-blue-50 border border-blue-100">
                 <div className="font-bold text-2xl text-blue-700">₹{pkg.price}</div>
                 <Button 
                   onClick={() => addItem({ id: pkg.id, type: "package", name: pkg.name, price: pkg.price })}
                   className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-6 font-bold"
                 >
                   Add to Cart
                 </Button>
              </div>
            </DialogContent>
          </Dialog>
          
          <Button 
            onClick={() => addItem({ id: pkg.id, type: "package", name: pkg.name, price: pkg.price })}
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
