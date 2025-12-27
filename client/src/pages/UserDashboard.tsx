import { useEffect, useState } from "react";
import { useLocation, Link } from "wouter";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LogOut, BookOpen } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function UserDashboard() {
  const { user, userToken, logout, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      setLocation("/login");
      return;
    }

    loadBookings();
  }, [isAuthenticated]);

  const loadBookings = async () => {
    if (!userToken) return;
    setLoading(true);
    try {
      const res = await fetch("/api/user/bookings", {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      if (res.ok) {
        const data = await res.json();
        setBookings(data);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    toast({ title: "Logged out successfully" });
    setLocation("/");
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Welcome, {user?.name}</h1>
            <p className="text-slate-500 mt-1">{user?.email}</p>
          </div>
          <Button onClick={handleLogout} variant="outline" className="gap-2">
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Phone</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-bold">{user?.phone}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Gender</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-bold capitalize">{user?.gender}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Age</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-bold">{user?.age} years</p>
            </CardContent>
          </Card>
        </div>

        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-6 h-6" />
              Your Bookings
            </h2>
            <Link href="/tests">
              <Button className="bg-blue-600 hover:bg-blue-700">Book a Test</Button>
            </Link>
          </div>

          {loading ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-slate-500">Loading bookings...</p>
              </CardContent>
            </Card>
          ) : bookings.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-slate-500 mb-4">No bookings yet</p>
                <Link href="/tests">
                  <Button className="bg-blue-600 hover:bg-blue-700">Book Your First Test</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {bookings.map((booking) => (
                <Card key={booking.id}>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm text-slate-600">Date</p>
                        <p className="font-bold">{new Date(booking.date).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-600">Time</p>
                        <p className="font-bold">{booking.time}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-600">Amount</p>
                        <p className="font-bold">₹{booking.totalAmount}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-600">Status</p>
                        <p className="font-bold capitalize text-blue-600">{booking.testStatus}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
