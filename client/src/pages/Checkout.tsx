import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createBookingSchema } from "@shared/schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { useCreateBooking } from "@/hooks/use-bookings";
import { useLocation } from "wouter";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";

// Extend schema for frontend validation nuances if needed
const formSchema = createBookingSchema.extend({
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
});

export default function Checkout() {
  const { items, total, clearCart } = useCart();
  const { mutate, isPending, isSuccess } = useCreateBooking();
  const [_, setLocation] = useLocation();
  const { toast } = useToast();

  const form = useForm<any>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
      items: items, // This will be set on submit effectively
      totalAmount: total,
    },
  });

  function onSubmit(values: any) {
    const bookingData = {
      ...values,
      items: items, 
      totalAmount: total,
      date: new Date().toISOString(), // Ensure date is provided as string
      time: "10:00 AM", // Placeholder or from form if added
    };
    
    // For now, handling single item booking as per schema
    const firstItem = items[0];
    const payload = {
      testId: firstItem.type === 'test' ? firstItem.id : undefined,
      packageId: firstItem.type === 'package' ? firstItem.id : undefined,
      date: bookingData.date,
      time: bookingData.time,
      totalAmount: total
    };

    mutate(payload, {
      onSuccess: () => {
        clearCart();
        toast({ title: "Success", description: "Your booking has been confirmed!" });
      },
      onError: (error: any) => {
        toast({ 
          title: "Booking Failed", 
          description: error.message, 
          variant: "destructive" 
        });
      }
    });
  }

  if (items.length === 0 && !isSuccess) {
     setLocation("/cart"); // Redirect if empty
     return null;
  }


  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="font-display font-bold text-3xl mb-8 text-center">Checkout</h1>

        <div className="grid gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Patient Details</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input placeholder="+1234567890" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input placeholder="john@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Home Collection Address</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Enter your full address with landmark" className="min-h-[100px]" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="bg-slate-100 p-6 rounded-xl space-y-2">
                     <div className="flex justify-between font-bold">
                       <span>Total Payable Amount</span>
                       <span className="text-primary text-xl">₹{total}</span>
                     </div>
                     <p className="text-xs text-muted-foreground">By confirming, you agree to our terms of service.</p>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full h-12 text-lg font-bold" 
                    disabled={isPending}
                    onClick={() => setLocation("/booking-confirmation")}
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      "Continue to Booking"
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
