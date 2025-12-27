import { Test } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Clock, ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";

export function TestCard({ test }: { test: Test }) {
  const { addItem } = useCart();

  const getCategoryImage = (category: string) => {
    switch (category.toLowerCase()) {
      case "hematology":
        return "https://images.unsplash.com/photo-1631815587646-b85a1bb027e1?auto=format&fit=crop&q=80&w=800"; // Blood sample
      case "biochemistry":
        return "https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&q=80&w=800"; // Lab beaker
      case "hormones":
        return "https://images.unsplash.com/photo-1624391151221-51206584c311?auto=format&fit=crop&q=80&w=800"; // Medical testing
      case "diabetes":
        return "https://images.unsplash.com/photo-1508847154043-be13a0a27474?auto=format&fit=crop&q=80&w=800"; // Glucose meter
      case "cardiology":
        return "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?auto=format&fit=crop&q=80&w=800"; // Heart health
      case "immunology":
        return "https://images.unsplash.com/photo-1581595221445-262de1ef92c1?auto=format&fit=crop&q=80&w=800"; // Microscope
      default:
        return "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=800"; // General medical
    }
  };

  return (
    <div className="group bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col h-full overflow-hidden">
      {/* Image Header */}
      <div className="relative h-48 overflow-hidden bg-slate-100">
        <img 
          src={getCategoryImage(test.category)}
          alt={test.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=800";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      </div>

      <div className="p-5 flex-1 flex flex-col">
        <h3 className="font-bold text-xl mb-3 text-slate-900 leading-tight">
          {test.name}
        </h3>
        
        <p className="text-slate-600 text-sm line-clamp-2 mb-5 flex-1">
          {test.description}
        </p>
        
        <div className="flex items-center gap-4 text-sm font-medium mb-5">
          <div className="flex items-center gap-1.5 text-blue-600">
            <span className="text-lg">₹</span>
            <span className="text-lg font-bold">{test.price}</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-500">
            <Clock className="w-4 h-4" />
            <span>{test.reportTime}</span>
          </div>
        </div>
        
        <Button 
          onClick={() => addItem({ id: test.id, type: "test", name: test.name, price: test.price })}
          className="w-full bg-[#4488dd] hover:bg-[#3377cc] text-white rounded-lg h-11 font-bold flex items-center justify-center gap-2 transition-colors"
        >
          <ShoppingCart className="w-4 h-4" />
          Book Now
        </Button>
      </div>
    </div>
  );
}
