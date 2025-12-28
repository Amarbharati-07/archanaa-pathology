import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createBookingSchema } from "@shared/schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { useCreateBooking } from "@/hooks/use-bookings";
import { useLocation } from "wouter";
import { Loader2, MapPin, Clock, CheckCircle2, ArrowLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formSchema = createBookingSchema.extend({
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
});

export default function Checkout() {
  const { items, total, clearCart } = useCart();
  const { mutate, isPending } = useCreateBooking();
  const [_, setLocation] = useLocation();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedPayment, setSelectedPayment] = useState("");
  const [collectionType, setCollectionType] = useState("lab-visit");

  const form = useForm<any>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      items: items,
      totalAmount: total,
    },
  });

  const timeSlots = [
    "07:00 AM", "08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM",
    "12:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"
  ];

  const paymentMethods = [
    { id: "upi", label: "UPI", description: "Pay using Google Pay, PhonePe, Paytm, etc.", icon: "💳" },
    { id: "debit", label: "Debit Card", description: "Pay using your debit card", icon: "🏦" },
    { id: "credit", label: "Credit Card", description: "Pay using your credit card", icon: "💳" },
    { id: "netbanking", label: "Net Banking", description: "Pay using your bank's internet banking", icon: "🏛️" },
    { id: "wallet", label: "Wallet", description: "Pay using digital wallets", icon: "💰" },
  ];

  const handleNext = async () => {
    if (currentStep === 1) {
      const isValid = await form.trigger(["name", "email", "phone"]);
      if (!isValid) return;
    }
    if (currentStep === 2) {
      if (!selectedDate || !selectedTime) {
        toast({ title: "Please select date and time", variant: "destructive" });
        return;
      }
    }
    if (currentStep === 3) {
      if (!selectedPayment) {
        toast({ title: "Please select a payment method", variant: "destructive" });
        return;
      }
      handleCheckout();
      return;
    }
    setCurrentStep(currentStep + 1);
  };

  const handleCheckout = async () => {
    const firstItem = items[0];
    const payload = {
      testId: firstItem.type === 'test' ? firstItem.id : undefined,
      packageId: firstItem.type === 'package' ? firstItem.id : undefined,
      date: selectedDate,
      time: selectedTime,
      totalAmount: total,
      bookingMode: collectionType === "lab-visit" ? "lab_visit" : "home_collection",
      paymentMethod: selectedPayment,
    };

    mutate(payload, {
      onSuccess: () => {
        clearCart();
        toast({ title: "Success", description: "Your booking has been confirmed!" });
        setLocation("/booking-confirmation");
      },
      onError: (error: any) => {
        toast({ 
          title: "Booking Failed", 
          description: error.message, 
          variant: "destructive" 
        });
      }
    });
  };

  if (items.length === 0) {
    setLocation("/cart");
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-12">
          <h1 className="font-display font-bold text-4xl text-slate-900 mb-2">Checkout</h1>
          <p className="text-slate-600">Complete your booking in just a few steps</p>
        </div>

        {/* Step Indicator */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center flex-1">
                <button
                  onClick={() => step < currentStep && setCurrentStep(step)}
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all ${
                    currentStep >= step
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                      : "bg-slate-200 text-slate-600"
                  }`}
                >
                  {currentStep > step ? <CheckCircle2 className="w-6 h-6" /> : step}
                </button>
                {step < 3 && (
                  <div className={`flex-1 h-1 mx-2 rounded-full ${currentStep > step ? "bg-blue-600" : "bg-slate-200"}`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-sm font-medium text-slate-600">
            <span>Details</span>
            <span>Schedule</span>
            <span>Payment</span>
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <Card className="rounded-2xl border-none shadow-xl shadow-slate-200/50 overflow-hidden bg-white">
              <CardContent className="p-8">
                {/* Step 1: Details */}
                {currentStep === 1 && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                    <div>
                      <h2 className="font-display font-bold text-2xl text-slate-900 mb-2">Your Details & Collection Type</h2>
                      <p className="text-slate-600">Provide your information for sample collection</p>
                    </div>

                    <Form {...form}>
                      <form className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-slate-700 font-semibold">Full Name *</FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="John Doe" 
                                    className="h-12 border-slate-200 bg-slate-50 focus:bg-white rounded-lg"
                                    {...field} 
                                  />
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
                                <FormLabel className="text-slate-700 font-semibold">Phone Number *</FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="9999999999" 
                                    className="h-12 border-slate-200 bg-slate-50 focus:bg-white rounded-lg"
                                    {...field} 
                                  />
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
                              <FormLabel className="text-slate-700 font-semibold">Email (for report delivery) *</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="your@email.com" 
                                  className="h-12 border-slate-200 bg-slate-50 focus:bg-white rounded-lg"
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div>
                          <label className="text-slate-700 font-semibold block mb-4">Collection Type</label>
                          <div className="grid grid-cols-2 gap-4">
                            {[
                              { id: "lab-visit", label: "Lab Visit", description: "Visit our lab center", icon: "🏥" },
                              { id: "home-collection", label: "Home Collection", description: "Free sample pickup", icon: "🚗" }
                            ].map((option) => (
                              <button
                                key={option.id}
                                onClick={() => setCollectionType(option.id)}
                                className={`p-4 rounded-xl border-2 transition-all text-left ${
                                  collectionType === option.id
                                    ? "border-blue-600 bg-blue-50"
                                    : "border-slate-200 bg-white hover:border-blue-300"
                                }`}
                              >
                                <div className="text-2xl mb-2">{option.icon}</div>
                                <p className="font-semibold text-slate-900">{option.label}</p>
                                <p className="text-xs text-slate-600 mt-1">{option.description}</p>
                              </button>
                            ))}
                          </div>
                        </div>
                      </form>
                    </Form>
                  </div>
                )}

                {/* Step 2: Schedule */}
                {currentStep === 2 && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                    <div>
                      <h2 className="font-display font-bold text-2xl text-slate-900 mb-2">Select Date & Time</h2>
                      <p className="text-slate-600">Choose your preferred appointment slot</p>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <label className="text-slate-700 font-semibold block mb-3">Select Date</label>
                        <input 
                          type="date"
                          value={selectedDate}
                          onChange={(e) => setSelectedDate(e.target.value)}
                          className="w-full h-12 px-4 rounded-lg border-2 border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-600 outline-none transition-all"
                        />
                      </div>

                      <div>
                        <label className="text-slate-700 font-semibold block mb-3">Select Time Slot</label>
                        <div className="grid grid-cols-5 gap-3">
                          {timeSlots.map((time) => (
                            <button
                              key={time}
                              onClick={() => setSelectedTime(time)}
                              className={`p-3 rounded-lg border-2 font-medium transition-all text-sm ${
                                selectedTime === time
                                  ? "border-blue-600 bg-blue-50 text-blue-700"
                                  : "border-slate-200 bg-white text-slate-600 hover:border-blue-300"
                              }`}
                            >
                              {time}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Payment */}
                {currentStep === 3 && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                    <div>
                      <h2 className="font-display font-bold text-2xl text-slate-900 mb-2">Select Payment Method</h2>
                      <p className="text-slate-600">Choose how you'd like to pay</p>
                    </div>

                    <div className="space-y-3">
                      {paymentMethods.map((method) => (
                        <button
                          key={method.id}
                          onClick={() => setSelectedPayment(method.id)}
                          className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                            selectedPayment === method.id
                              ? "border-blue-600 bg-blue-50"
                              : "border-slate-200 bg-white hover:border-blue-300"
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className="text-2xl mt-1">{method.icon}</div>
                            <div>
                              <p className="font-semibold text-slate-900">{method.label}</p>
                              <p className="text-sm text-slate-600 mt-1">{method.description}</p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex gap-4 mt-8 pt-8 border-t border-slate-200">
                  <Button
                    variant="outline"
                    onClick={() => currentStep > 1 ? setCurrentStep(currentStep - 1) : setLocation("/cart")}
                    className="flex items-center gap-2 rounded-lg border-slate-200 hover:bg-slate-50 h-11"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    {currentStep === 1 ? "Back to Cart" : "Back"}
                  </Button>
                  <Button
                    onClick={handleNext}
                    disabled={isPending}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 h-11 rounded-lg font-semibold shadow-lg shadow-blue-200"
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : currentStep === 3 ? (
                      "Proceed to Payment"
                    ) : (
                      "Continue"
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="rounded-2xl border-none shadow-xl shadow-slate-200/50 overflow-hidden bg-white sticky top-24 h-fit">
              <CardContent className="p-6">
                <h3 className="font-display font-bold text-lg text-slate-900 mb-6">Order Summary</h3>
                
                <div className="space-y-4 mb-6 pb-6 border-b border-slate-200">
                  {items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-slate-900 line-clamp-2">{item.name}</p>
                        <p className="text-xs text-slate-500 mt-1">Qty: 1</p>
                      </div>
                      <p className="font-bold text-slate-900">₹ {item.price}</p>
                    </div>
                  ))}
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal</span>
                    <span>₹ {total}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Discount</span>
                    <span className="text-emerald-600 font-semibold">₹ 0</span>
                  </div>
                  <div className="pt-3 border-t border-slate-200 flex justify-between font-bold text-lg">
                    <span className="text-slate-900">Total</span>
                    <span className="text-blue-600">₹ {total}</span>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <p className="text-xs text-blue-900">
                    <span className="font-semibold">✓ </span>
                    NABL accredited laboratory with latest equipment
                  </p>
                </div>

                {/* Step Info */}
                <div className="mt-6 pt-6 border-t border-slate-200">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Current Step</p>
                  <div className="space-y-2">
                    {["Your Details", "Schedule Slot", "Payment Method"].map((step, idx) => (
                      <p key={idx} className={`text-sm ${currentStep === idx + 1 ? "font-bold text-blue-600" : "text-slate-500"}`}>
                        {idx + 1}. {step}
                      </p>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
