import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, MapPin, Calendar, Phone, Search, CreditCard, Clock } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface BookingDetail {
  id: number;
  userId: number;
  userName: string;
  phone: string;
  testNames?: string[];
  packageNames?: string[];
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
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");

  const { data: bookingsData, isLoading } = useQuery({
    queryKey: ["/api/admin/bookings"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/admin/bookings");
      return res.json();
    },
  });

  const bookings = Array.isArray(bookingsData) ? bookingsData : [];

  const filteredBookings = bookings.filter((booking: BookingDetail) => {
    const matchesSearch = 
      booking.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.phone.includes(searchQuery) ||
      `ARCH-${format(new Date(booking.date), 'yyyyMMdd')}-${String(booking.id).padStart(4, '0')}`.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || booking.testStatus === statusFilter;
    const matchesPayment = paymentFilter === "all" || booking.paymentStatus === paymentFilter;

    return matchesSearch && matchesStatus && matchesPayment;
  });

  const getStatusBadge = (status: string) => {
    const s = status.toLowerCase();
    if (s === "pending" || s === "booked") return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-amber-200 capitalize">{status}</Badge>;
    if (s === "completed" || s === "verified") return <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-emerald-200 capitalize">{status}</Badge>;
    if (s === "delivered") return <Badge className="bg-emerald-500 text-white hover:bg-emerald-600 border-none capitalize">{status}</Badge>;
    return <Badge variant="outline" className="capitalize">{status}</Badge>;
  };

  const updateStatusMutation = useMutation({
    mutationFn: async ({ bookingId, status }: { bookingId: number, status: string }) =>
      apiRequest("PATCH", `/api/admin/bookings/${bookingId}`, { testStatus: status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/bookings"] });
      toast({ title: "Booking status updated" });
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 md:p-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-display font-bold text-slate-900">Bookings</h1>
        <p className="text-slate-500">Manage test appointments, sample collection, and payment verification</p>
      </div>

      <Card className="border-none shadow-sm bg-white/50 backdrop-blur-sm">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input 
                placeholder="Search by name, patient ID, or phone..." 
                className="pl-10 h-11 rounded-xl bg-white border-slate-200 focus-visible:ring-blue-600"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px] h-11 rounded-xl bg-white border-slate-200">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="booked">Booked</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
              </SelectContent>
            </Select>
            <Select value={paymentFilter} onValueChange={setPaymentFilter}>
              <SelectTrigger className="w-full md:w-[180px] h-11 rounded-xl bg-white border-slate-200">
                <SelectValue placeholder="All Payments" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Payments</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="verified">Verified</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {filteredBookings.map((booking: BookingDetail) => (
          <Card key={booking.id} className="border-none shadow-sm hover:shadow-md transition-shadow bg-white rounded-2xl overflow-hidden">
            <CardContent className="p-0">
              <div className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="h-14 w-14 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                    <MapPin className="h-7 w-7 text-blue-600" />
                  </div>
                  
                  <div className="flex-1 space-y-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                          <h3 className="font-bold text-lg text-slate-900 capitalize">{booking.userName}</h3>
                          <Badge variant="secondary" className="bg-slate-100 text-slate-600 border-none font-medium">
                            ARCH-{format(new Date(booking.date), 'yyyyMMdd')}-{String(booking.id).padStart(4, '0')}
                          </Badge>
                          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 capitalize">
                            {booking.bookingMode.replace('_', ' ')}
                          </span>
                        </div>
                        <p className="text-slate-600 font-medium">
                          {booking.testNames && booking.testNames.length > 0 ? booking.testNames.join(", ") : 
                           booking.packageNames && booking.packageNames.length > 0 ? booking.packageNames.join(", ") : "N/A"}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-slate-500">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="h-4 w-4" />
                            {format(new Date(booking.date), 'MMMM do, yyyy')}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Clock className="h-4 w-4" />
                            {booking.time}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Phone className="h-4 w-4" />
                            {booking.phone}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        {getStatusBadge(booking.testStatus)}
                        <Select 
                          value={booking.testStatus} 
                          onValueChange={(val) => updateStatusMutation.mutate({ bookingId: booking.id, status: val })}
                          disabled={updateStatusMutation.isPending}
                        >
                          <SelectTrigger className="w-[140px] h-9 rounded-lg bg-white border-slate-200">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="booked">Booked</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="delivered">Delivered</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4 text-slate-400" />
                        <span className="text-slate-500">Payment Information</span>
                        <div className="flex gap-2 ml-2">
                          <Button 
                            size="sm" 
                            variant={booking.paymentStatus === 'verified' ? 'outline' : 'default'}
                            className={cn(
                              "h-7 px-3 text-[10px] font-bold rounded-full transition-all",
                              booking.paymentStatus === 'verified' ? "border-emerald-200 text-emerald-600 hover:bg-emerald-50" : "bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
                            )}
                            onClick={() => {
                              const verified = booking.paymentStatus !== "verified";
                              apiRequest("POST", "/api/admin/payments/verify", { bookingId: booking.id, verified })
                                .then(() => {
                                  queryClient.invalidateQueries({ queryKey: ["/api/admin/bookings"] });
                                  toast({ title: `Payment status updated to ${verified ? 'verified' : 'pending'}` });
                                });
                            }}
                          >
                            {booking.paymentStatus === "verified" ? "Revoke Verification" : "Verify Payment"}
                          </Button>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-x-8 gap-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-slate-500">Status:</span>
                          <Badge className={cn(
                            "border-none flex items-center gap-1 h-6",
                            booking.paymentStatus === "verified" ? "bg-emerald-500 text-white" : "bg-blue-500 text-white"
                          )}>
                            <Clock className="h-3 w-3" /> {booking.paymentStatus.replace('_', ' ')}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-slate-500">Method:</span>
                          <span className="font-semibold text-slate-700 capitalize">Pay at Lab</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-slate-500">Amount:</span>
                          <span className="font-bold text-slate-900 font-mono">Rs. {booking.totalAmount.toFixed(2)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-slate-500">Payment Date:</span>
                          <span className="font-medium text-slate-700">
                            {format(new Date(booking.date), 'MMM do, yyyy, h:mm a')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredBookings.length === 0 && (
          <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-slate-200">
            <div className="h-16 w-16 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-slate-300" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">No bookings found</h3>
            <p className="text-slate-500">Try adjusting your filters or search query</p>
          </div>
        )}
      </div>
    </div>
  );
}
