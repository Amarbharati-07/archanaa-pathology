import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Smartphone, Landmark } from "lucide-react";

interface PaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  amount: number;
  bookingId: number;
  onPaymentComplete: (transactionId: string) => void;
}

export function PaymentModal({ open, onOpenChange, amount, bookingId, onPaymentComplete }: PaymentModalProps) {
  const handlePaymentComplete = (method: string) => {
    const transactionId = `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    setTimeout(() => {
      onPaymentComplete(transactionId);
      onOpenChange(false);
    }, 1500);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Complete Payment</DialogTitle>
          <DialogDescription>
            Pay ₹{amount} to confirm your booking
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="bg-blue-50 p-4 rounded-lg text-center border border-blue-200">
            <div className="text-3xl font-bold text-blue-600">₹{amount}</div>
            <div className="text-sm text-blue-600">Amount to pay</div>
          </div>

          <Tabs defaultValue="upi" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="upi">UPI</TabsTrigger>
              <TabsTrigger value="card">Card</TabsTrigger>
            </TabsList>

            <TabsContent value="upi" className="space-y-4">
              <div className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => handlePaymentComplete("upi_scan")}
                >
                  <Smartphone className="w-4 h-4 mr-2" />
                  Scan QR Code
                </Button>

                <Card>
                  <CardContent className="pt-4">
                    <div className="text-sm font-medium mb-2">Enter UPI ID</div>
                    <Input 
                      placeholder="yourname@upi" 
                      className="mb-3"
                    />
                    <Button 
                      className="w-full"
                      onClick={() => handlePaymentComplete("upi_id")}
                    >
                      Pay with UPI
                    </Button>
                  </CardContent>
                </Card>

                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => handlePaymentComplete("upi_apps")}
                >
                  UPI Apps (Google Pay, PhonePe, Paytm)
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="card" className="space-y-4">
              <div className="space-y-3">
                <Input placeholder="Card Number" />
                <div className="grid grid-cols-2 gap-3">
                  <Input placeholder="MM/YY" />
                  <Input placeholder="CVV" />
                </div>
                <Input placeholder="Cardholder Name" />
                <Button 
                  className="w-full"
                  onClick={() => handlePaymentComplete("card")}
                >
                  <Landmark className="w-4 h-4 mr-2" />
                  Pay with Card
                </Button>
              </div>
            </TabsContent>
          </Tabs>

          <p className="text-xs text-center text-gray-500">
            Your payment is secure and encrypted
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
