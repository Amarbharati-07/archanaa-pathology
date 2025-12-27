import { Test } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Clock, CheckCircle2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { Badge } from "@/components/ui/badge";

export function TestCard({ test }: { test: Test }) {
  const { addItem } = useCart();

  return (
    <div className="group bg-card rounded-2xl border hover:border-primary/50 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full overflow-hidden">
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-4">
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            {test.category}
          </Badge>
          {test.isPopular && (
            <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-none shadow-none">
              Popular
            </Badge>
          )}
        </div>
        
        <h3 className="font-display font-bold text-lg mb-2 text-foreground group-hover:text-primary transition-colors">
          {test.name}
        </h3>
        
        <p className="text-muted-foreground text-sm line-clamp-2 mb-4 flex-1">
          {test.description}
        </p>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground bg-secondary/50 p-2 rounded-lg mb-4">
          <Clock className="w-4 h-4 text-primary" />
          <span>Report in {test.reportTime}</span>
        </div>
        
        <div className="flex items-center justify-between mt-auto pt-4 border-t">
          <span className="font-bold text-xl text-primary">₹{test.price}</span>
          <Button 
            onClick={() => addItem({ id: test.id, type: "test", name: test.name, price: test.price })}
            className="shadow-md hover:shadow-lg font-semibold"
          >
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
}
