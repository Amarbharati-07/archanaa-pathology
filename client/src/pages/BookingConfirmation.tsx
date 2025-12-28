import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";
import { useState } from "react";
import { PaymentModal } from "@/components/PaymentModal";
import { Loader2, AlertCircle } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const bookingSchema = z.object({
  bookingMode: z.enum(["home_collection", "lab_visit"]),
  address: z.string().min(5, "Address must be at least 5 characters"),
  date: z.string().min(1, "Date required"),
  time: z.string().min(1, "Time required"),
});

export default function BookingConfirmation() {
  const { items, total, clearCart } = useCart();
  const { user } = useAuth();
  const [_, setLocation] = useLocation();
  const { toast } = useToast();
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [bookingData, setBookingData] = useState<any>(null);
  const [distance, setDistance] = useState(0);

  const form = useForm<z.infer<typeof bookingSchema>>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      bookingMode: "lab_visit",
      address: user?.address || "",
      date: "",
      time: "10:00 AM",
    },
  });

  if (items.length === 0) {
    setLocation("/cart");
    return null;
  }

  const calculatePrice = (mode: string, dist: number) => {
    if (mode === "lab_visit") return total;
    if (dist <= 5) return total;
    if (dist <= 40) return total + Math.ceil((dist - 5) * 15);
    return null;
  };

  const finalPrice = calculatePrice(form.watch("bookingMode"), distance);

  async function onSubmit(values: z.infer<typeof bookingSchema>) {
    if (form.watch("bookingMode") === "home_collection" && distance > 40) {
      toast({
        title: "Location unavailable",
        description: "Home collection not available beyond 40 km. Please select Lab Visit.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const firstItem = items[0];
      const bookingPayload = {
        testId: firstItem.type === "test" ? firstItem.id : undefined,
        packageId: firstItem.type === "package" ? firstItem.id : undefined,
        date: new Date(values.date).toISOString(),
        time: values.time,
        totalAmount: finalPrice,
        bookingMode: values.bookingMode,
        address: values.address,
        distance: form.watch("bookingMode") === "home_collection" ? distance : 0,
      };

      const booking = await apiRequest("POST", "/api/bookings", bookingPayload);
      setBookingData(booking);
      setPaymentOpen(true);
    } catch (error: any) {
      toast({
        title: "Booking failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  const handlePaymentComplete = async (transactionId: string) => {
    try {
      await apiRequest("POST", "/api/payments/initiate", {
        bookingId: bookingData.id,
        amount: finalPrice,
      });
      toast({
        title: "Payment initiated",
        description: "Your payment is pending admin verification",
      });
      clearCart();
      setLocation("/dashboard");
    } catch (error: any) {
      toast({
        title: "Payment failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="font-display font-bold text-3xl mb-8 text-center">Complete Your Booking</h1>

        <div className="grid gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Booking Details</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="bookingMode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Booking Mode</FormLabel>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="lab_visit">Lab Visit</SelectItem>
                            <SelectItem value="home_collection">Home Collection</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {form.watch("bookingMode") === "home_collection" && (
                    <>
                      <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Home Collection Address</FormLabel>
                            <FormControl>
                              <Textarea placeholder="Enter your complete address" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Distance (KM)</label>
                        <Input 
                          type="number" 
                          placeholder="Enter distance from lab"
                          value={distance}
                          onChange={(e) => setDistance(Number(e.target.value))}
                        />
                        {distance > 40 && (
                          <div className="flex items-start gap-2 p-3 bg-red-50 rounded border border-red-200">
                            <AlertCircle className="w-4 h-4 text-red-600 mt-0.5" />
                            <div className="text-sm text-red-700">
                              <div className="font-medium">Home collection not available</div>
                              <div>Distance exceeds 40 km limit. Please select Lab Visit.</div>
                            </div>
                          </div>
                        )}
                        {distance > 5 && distance <= 40 && (
                          <div className="text-sm text-blue-700 bg-blue-50 p-2 rounded">
                            Additional charge: ₹{Math.ceil((distance - 5) * 15)} (₹15 per km beyond 5 km)
                          </div>
                        )}
                        {distance <= 5 && distance > 0 && (
                          <div className="text-sm text-green-700 bg-green-50 p-2 rounded">
                            Free home collection within 5 km
                          </div>
                        )}
                      </div>
                    </>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Booking Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="time"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Preferred Time</FormLabel>
                          <FormControl>
                            <Input type="time" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="bg-slate-100 p-6 rounded-xl space-y-3">
                    {items.map((item) => (
                      <div key={`${item.type}-${item.id}`} className="flex justify-between text-sm">
                        <span>{item.name}</span>
                        <span className="font-medium">₹{item.price}</span>
                      </div>
                    ))}
                    {form.watch("bookingMode") === "home_collection" && distance > 5 && distance <= 40 && (
                      <div className="flex justify-between text-sm">
                        <span>Delivery Charge</span>
                        <span className="font-medium">₹{Math.ceil((distance - 5) * 15)}</span>
                      </div>
                    )}
                    <div className="border-t pt-3 flex justify-between font-bold">
                      <span>Total Amount</span>
                      <span className="text-primary text-xl">₹{finalPrice}</span>
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full h-12 text-lg font-bold" 
                    disabled={loading || (form.watch("bookingMode") === "home_collection" && distance > 40)}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      "Proceed to Payment"
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>

      <PaymentModal
        open={paymentOpen}
        onOpenChange={setPaymentOpen}
        amount={finalPrice || 0}
        bookingId={bookingData?.id || 0}
        onPaymentComplete={handlePaymentComplete}
      />
    </div>
  );
}
