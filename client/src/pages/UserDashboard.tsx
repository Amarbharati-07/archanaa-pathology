import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { useAuth } from "@/context/AuthContext";
import { Loader2, MapPin, Calendar, DollarSign, Clock, Download } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function UserDashboard() {
  const { user } = useAuth();
  const [_, setLocation] = useLocation();

  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ["/api/user/bookings"],
    queryFn: () => apiRequest("GET", "/api/user/bookings"),
    enabled: !!user,
  });

  if (!user) {
    setLocation("/login");
    return null;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "pending_verification":
        return "bg-yellow-100 text-yellow-800";
      case "verified":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusBadge = (paymentStatus: string, testStatus: string) => {
    if (paymentStatus === "pending_verification") {
      return <Badge className="bg-yellow-100 text-yellow-800">Payment Pending</Badge>;
    }
    if (paymentStatus === "rejected") {
      return <Badge variant="destructive">Payment Rejected</Badge>;
    }
    if (paymentStatus === "verified" && testStatus === "booked") {
      return <Badge className="bg-blue-100 text-blue-800">Report Pending</Badge>;
    }
    if (testStatus === "completed") {
      return <Badge className="bg-green-100 text-green-800">Report Generated</Badge>;
    }
    return <Badge variant="outline">{testStatus}</Badge>;
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user.name}</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{bookings.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pending Payments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {bookings.filter((b: any) => b.paymentStatus === "pending_verification").length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Verified Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {bookings.filter((b: any) => b.paymentStatus === "verified").length}
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="bookings" className="space-y-4">
          <TabsList>
            <TabsTrigger value="bookings">My Bookings</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="bookings" className="space-y-4">
            {bookings.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-muted-foreground mb-4">No bookings yet</p>
                  <Button onClick={() => setLocation("/tests")}>Book a Test</Button>
                </CardContent>
              </Card>
            ) : (
              bookings.map((booking: any) => (
                <Card key={booking.id} className="hover-elevate">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">Booking #{booking.id}</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          Created on {new Date(booking.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      {getStatusBadge(booking.paymentStatus, booking.testStatus)}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Amount</p>
                          <p className="font-medium">₹{booking.totalAmount}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Date</p>
                          <p className="font-medium text-sm">{new Date(booking.date).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Time</p>
                          <p className="font-medium text-sm">{booking.time}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Mode</p>
                        <p className="font-medium text-sm">{booking.bookingMode?.replace("_", " ")}</p>
                      </div>
                    </div>

                    {booking.bookingMode === "home_collection" && booking.address && (
                      <div className="flex items-start gap-2 bg-blue-50 p-3 rounded">
                        <MapPin className="w-4 h-4 text-blue-600 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-blue-900">Collection Address</p>
                          <p className="text-xs text-blue-800 mt-1">{booking.address}</p>
                          {booking.distance > 0 && (
                            <p className="text-xs text-blue-700 mt-1">Distance: {booking.distance} km</p>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2 flex-wrap">
                      <Badge className={getPaymentStatusColor(booking.paymentStatus)}>
                        {booking.paymentStatus.replace("_", " ")}
                      </Badge>
                      {booking.paymentStatus === "pending_verification" && (
                        <p className="text-xs text-amber-700">Waiting for admin verification</p>
                      )}
                      {booking.paymentStatus === "verified" && booking.testStatus === "completed" && (
                        <Button size="sm" variant="outline" className="gap-1">
                          <Download className="w-4 h-4" />
                          Download Report
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="profile" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Full Name</p>
                    <p className="font-medium">{user.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{user.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium">{user.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Age</p>
                    <p className="font-medium">{user.age}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Gender</p>
                    <p className="font-medium capitalize">{user.gender}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Address</p>
                    <p className="font-medium">{user.address || "Not provided"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
