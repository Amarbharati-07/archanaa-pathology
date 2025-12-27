import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Trash2, ArrowRight, ShoppingBag, Info } from "lucide-react";
import { Link, useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

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
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
        <div className="bg-blue-50 p-6 rounded-full mb-6">
          <ShoppingBag className="w-16 h-16 text-primary" />
        </div>
        <h1 className="font-display font-bold text-3xl mb-4">Your cart is empty</h1>
        <p className="text-muted-foreground mb-8">Looks like you haven't added any tests yet.</p>
        <Link href="/tests">
          <Button size="lg" className="px-8">Browse Tests</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="font-display font-bold text-3xl mb-8">Your Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-4">
            {!isAuthenticated && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3 mb-6">
                <Info className="w-5 h-5 text-amber-600 mt-0.5" />
                <div>
                  <h4 className="font-bold text-amber-800">Login to Book</h4>
                  <p className="text-sm text-amber-700">You can add items to your cart, but you'll need to log in to complete your booking. New users must fill all mandatory registration fields.</p>
                </div>
              </div>
            )}
            {items.map((item, index) => (
              <div 
                key={`${item.id}-${item.type}-${index}`} 
                className="bg-white p-6 rounded-xl shadow-sm border flex flex-col sm:flex-row items-center justify-between gap-4"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${item.type === 'package' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                      {item.type === 'package' ? 'Package' : 'Test'}
                    </span>
                  </div>
                  <h3 className="font-bold text-lg">{item.name}</h3>
                </div>
                <div className="flex items-center gap-6">
                  <span className="font-bold text-xl">₹{item.price}</span>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
                    onClick={() => removeItem(item.id, item.type)}
                  >
                    <Trash2 className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            ))}
            
            <div className="flex justify-end pt-4">
              <Button variant="outline" onClick={clearCart} className="text-muted-foreground">
                Clear Cart
              </Button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="shadow-lg border-0 sticky top-24">
              <CardHeader className="bg-slate-900 text-white rounded-t-xl">
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal ({items.length} items)</span>
                    <span className="font-medium">₹{total}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Home Collection Charges</span>
                    <span className="text-green-600 font-medium">FREE</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total Amount</span>
                    <span className="text-primary">₹{total}</span>
                  </div>
                </div>

                <Button 
                  className="w-full h-12 text-lg shadow-xl shadow-primary/20 bg-blue-600 hover:bg-blue-700 font-bold" 
                  onClick={handleCheckout}
                >
                  {isAuthenticated ? "Proceed to Checkout" : "Login to Book"} <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                
                {!isAuthenticated && (
                  <p className="text-xs text-center text-blue-600 mt-4 font-medium">
                    New patient? <Link href="/register" className="underline">Register here with all details</Link>
                  </p>
                )}
                
                <p className="text-xs text-center text-muted-foreground mt-4">
                  Secure booking & verified medical reports
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
