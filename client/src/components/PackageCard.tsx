import { Package } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Check, Info } from "lucide-react";
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
    <div className="relative group bg-white rounded-2xl border hover:border-primary/50 shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col h-full overflow-hidden">
      {pkg.isFeatured && (
        <div className="absolute top-0 right-0 bg-primary text-white text-xs font-bold px-3 py-1 rounded-bl-xl z-10">
          Featured
        </div>
      )}
      
      <div className="p-6 flex-1 flex flex-col">
        <h3 className="font-display font-bold text-xl mb-2 text-center text-foreground">{pkg.name}</h3>
        <p className="text-muted-foreground text-center text-sm mb-6">{pkg.description}</p>
        
        <div className="bg-primary/5 rounded-2xl p-4 mb-6 text-center">
          <span className="text-sm text-muted-foreground">Package Price</span>
          <div className="font-display font-bold text-3xl text-primary">₹{pkg.price}</div>
        </div>
        
        <div className="space-y-3 mb-8 flex-1">
          <p className="text-sm font-semibold text-foreground">Includes {pkg.includes?.length} tests:</p>
          {pkg.includes?.slice(0, 3).map((item, i) => (
            <div key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
              <Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
              <span className="line-clamp-1">{item}</span>
            </div>
          ))}
          {(pkg.includes?.length || 0) > 3 && (
            <p className="text-xs text-muted-foreground pl-6 italic">
              +{((pkg.includes?.length || 0) - 3)} more tests
            </p>
          )}
        </div>
        
        <div className="grid grid-cols-2 gap-3 mt-auto">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full">
                <Info className="w-4 h-4 mr-2" /> Details
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="text-2xl font-display text-primary">{pkg.name}</DialogTitle>
                <DialogDescription>{pkg.description}</DialogDescription>
              </DialogHeader>
              <div className="mt-4">
                <h4 className="font-semibold mb-3">Included Tests:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {pkg.includes?.map((item, i) => (
                    <div key={i} className="flex items-start gap-2 p-2 rounded-lg bg-secondary/30">
                      <Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                      <span className="text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-6 flex justify-between items-center bg-primary/5 p-4 rounded-xl">
                 <div>
                   <span className="text-sm text-muted-foreground">Total Price</span>
                   <div className="font-bold text-2xl text-primary">₹{pkg.price}</div>
                 </div>
                 <Button onClick={() => addItem({ id: pkg.id, type: "package", name: pkg.name, price: pkg.price })}>
                   Add to Cart
                 </Button>
              </div>
            </DialogContent>
          </Dialog>
          
          <Button 
            onClick={() => addItem({ id: pkg.id, type: "package", name: pkg.name, price: pkg.price })}
            className="w-full shadow-md"
          >
            Book Now
          </Button>
        </div>
      </div>
    </div>
  );
}
