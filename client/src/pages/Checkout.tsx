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
import { Loader2, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { z } from "zod";

// Extend schema for frontend validation nuances if needed
const formSchema = createBookingSchema.extend({
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
});

export default function Checkout() {
  const { items, total, clearCart } = useCart();
  const { mutate, isPending, isSuccess } = useCreateBooking();
  const [_, setLocation] = useLocation();

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
    // Ensure current items/total are used
    const bookingData = {
      ...values,
      items: items, 
      totalAmount: total
    };
    mutate(bookingData, {
      onSuccess: () => {
        clearCart();
        setTimeout(() => setLocation("/"), 5000); // Redirect after 5s
      }
    });
  }

  if (items.length === 0 && !isSuccess) {
     setLocation("/cart"); // Redirect if empty
     return null;
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-green-50 px-4">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-display font-bold text-green-800 mb-4">Booking Confirmed!</h1>
          <p className="text-green-700 mb-8">Thank you for choosing Archana Pathology Lab. We have sent a confirmation email to you. Our team will contact you shortly.</p>
          <Button onClick={() => setLocation("/")} className="bg-green-600 hover:bg-green-700">
            Back to Home
          </Button>
        </div>
      </div>
    );
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

                  <Button type="submit" className="w-full h-12 text-lg font-bold" disabled={isPending}>
                    {isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      "Confirm Booking"
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
