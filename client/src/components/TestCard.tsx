import { Test } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Clock, ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";

export function TestCard({ test }: { test: Test }) {
  const { addItem } = useCart();

  return (
    <div className="group bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col h-full overflow-hidden">
      {/* Image Header */}
      <div className="relative h-40 overflow-hidden">
        <img 
          src={`https://images.unsplash.com/photo-1581594658553-46ad0ea1fa21?auto=format&fit=crop&q=80&w=800`}
          alt={test.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
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
