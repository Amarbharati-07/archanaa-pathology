import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2, MapPin, Calendar, Phone } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";

interface BookingDetail {
  id: number;
  userId: number;
  userName: string;
  phone: string;
  testName?: string;
  packageName?: string;
  date: string;
  time: string;
  testStatus: string;
  paymentStatus: string;
  totalAmount: number;
  bookingMode: string;
  address: string;
  distance: number;
}

export default function AdminBookings() {
  const { toast } = useToast();
  const [selectedBooking, setSelectedBooking] = useState<BookingDetail | null>(null);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [reportData, setReportData] = useState({ result: "", remarks: "" });

  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ["/api/admin/bookings"],
    queryFn: () => apiRequest("GET", "/api/admin/bookings"),
  });

  const verifyPaymentMutation = useMutation({
    mutationFn: (bookingId: number) =>
      apiRequest("POST", "/api/admin/payments/verify", {
        bookingId,
        verified: true,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/bookings"] });
      toast({ title: "Payment verified" });
    },
  });

  const rejectPaymentMutation = useMutation({
    mutationFn: (bookingId: number) =>
      apiRequest("POST", "/api/admin/payments/verify", {
        bookingId,
        verified: false,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/bookings"] });
      toast({ title: "Payment rejected" });
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending_verification":
        return "bg-yellow-100 text-yellow-800";
      case "verified":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "booked":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Booking Management</h1>
        <p className="text-muted-foreground mt-2">Manage bookings, verify payments, and generate reports</p>
      </div>

      <div className="space-y-4">
        {bookings.map((booking: BookingDetail) => (
          <Card key={booking.id} className="hover-elevate">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">Booking #{booking.id}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">{booking.userName}</p>
                </div>
                <div className="flex gap-2">
                  <Badge className={getStatusColor(booking.paymentStatus)}>
                    {booking.paymentStatus.replace("_", " ")}
                  </Badge>
                  <Badge variant="outline">{booking.bookingMode.replace("_", " ")}</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Test/Package</p>
                  <p className="font-medium">{booking.testName || booking.packageName || "N/A"}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Amount</p>
                  <p className="font-medium">₹{booking.totalAmount}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Phone</p>
                    <p className="font-medium text-sm">{booking.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Date</p>
                    <p className="font-medium text-sm">{new Date(booking.date).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              {booking.bookingMode === "home_collection" && (
                <div className="flex items-start gap-2 bg-blue-50 p-3 rounded">
                  <MapPin className="w-4 h-4 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-blue-900">Home Collection</p>
                    <p className="text-xs text-blue-800 mt-1">{booking.address}</p>
                    <p className="text-xs text-blue-700 mt-1">Distance: {booking.distance} km</p>
                  </div>
                </div>
              )}

              <div className="flex gap-2 flex-wrap">
                {booking.paymentStatus === "pending_verification" && (
                  <>
                    <Button
                      size="sm"
                      onClick={() => verifyPaymentMutation.mutate(booking.id)}
                      disabled={verifyPaymentMutation.isPending}
                    >
                      Verify Payment
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => rejectPaymentMutation.mutate(booking.id)}
                      disabled={rejectPaymentMutation.isPending}
                    >
                      Reject Payment
                    </Button>
                  </>
                )}
                {booking.paymentStatus === "verified" && (
                  <Button
                    size="sm"
                    onClick={() => {
                      setSelectedBooking(booking);
                      setReportDialogOpen(true);
                    }}
                  >
                    Upload Report
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {bookings.length === 0 && (
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">No bookings found</p>
          </CardContent>
        </Card>
      )}

      <Dialog open={reportDialogOpen} onOpenChange={setReportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Report for Booking #{selectedBooking?.id}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Test Result</label>
              <Textarea
                placeholder="Enter test result summary"
                value={reportData.result}
                onChange={(e) => setReportData({ ...reportData, result: e.target.value })}
                className="mt-2"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Doctor Remarks</label>
              <Textarea
                placeholder="Enter doctor remarks"
                value={reportData.remarks}
                onChange={(e) => setReportData({ ...reportData, remarks: e.target.value })}
                className="mt-2"
              />
            </div>
            <Button
              onClick={() => {
                toast({ title: "Report uploaded successfully" });
                setReportDialogOpen(false);
              }}
              className="w-full"
            >
              Upload Report
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
