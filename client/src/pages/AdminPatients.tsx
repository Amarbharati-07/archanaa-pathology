import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Search, Plus, UserPlus, FileText, Microscope, Calendar, Clock, CreditCard } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import { format } from "date-fns";

export default function AdminPatients() {
  const { adminToken } = useAuth();
  const { toast } = useToast();
  const [patients, setPatients] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [patientsRes, bookingsRes, testsRes, packagesRes] = await Promise.all([
        fetch("/api/admin/users", { headers: { Authorization: `Bearer ${adminToken}` } }),
        fetch("/api/admin/bookings", { headers: { Authorization: `Bearer ${adminToken}` } }),
        fetch("/api/tests"),
        fetch("/api/packages")
      ]);
      
      if (patientsRes.ok && bookingsRes.ok && testsRes.ok && packagesRes.ok) {
        const patientsData = await patientsRes.json();
        const bookingsData = await bookingsRes.json();
        const testsData = await testsRes.json();
        const packagesData = await packagesRes.json();

        const enrichedBookings = bookingsData.map((b: any) => ({
          ...b,
          testNames: (b.testIds && b.testIds.length > 0) ? b.testIds.map((id: number) => testsData.find((t: any) => t.id === id)?.name).filter(Boolean) : [],
          packageNames: (b.packageIds && b.packageIds.length > 0) ? b.packageIds.map((id: number) => packagesData.find((p: any) => p.id === id)?.name).filter(Boolean) : [],
        }));

        setPatients(patientsData);
        setBookings(enrichedBookings);
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to load data", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.phone.includes(searchQuery) ||
    `ARCH-20251228-${String(p.id).padStart(4, '0')}`.includes(searchQuery)
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Patients</h1>
          <p className="text-slate-500 mt-1">Manage patient records and create reports</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 gap-2">
          <UserPlus className="w-4 h-4" />
          Add Patient
        </Button>
      </div>

      <Card className="border-none shadow-sm bg-white">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input 
              placeholder="Search by Patient ID, name, phone, or email..." 
              className="pl-10 border-slate-200 focus-visible:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {loading ? (
          <p className="text-center py-8 text-slate-500">Loading patient data...</p>
        ) : filteredPatients.length > 0 ? (
          filteredPatients.map((patient) => {
            const patientBookings = bookings.filter(b => b.userId === patient.id);
            return (
              <Card key={patient.id} className="border-none shadow-sm bg-white hover:shadow-md transition-shadow group overflow-hidden">
                <CardContent className="p-0">
                  <div className="p-4 flex items-center justify-between border-b border-slate-50">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
                        <Users className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-slate-900">{patient.name}</h3>
                          <span className="text-xs font-mono px-1.5 py-0.5 bg-blue-50 text-blue-700 rounded border border-blue-100">
                            ARCH-20251228-{String(patient.id).padStart(4, '0')}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 mt-1 text-sm text-slate-500">
                          <span className="flex items-center gap-1">📞 {patient.phone}</span>
                          <span className="flex items-center gap-1">✉️ {patient.email}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {patientBookings.length > 0 ? (
                    <div className="bg-slate-50/50 p-4">
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Recent Bookings</p>
                      <div className="space-y-3">
                        {patientBookings.map((booking) => (
                          <div key={booking.id} className="flex items-center justify-between bg-white p-3 rounded-lg border border-slate-100 shadow-sm">
                            <div className="flex gap-6 items-center flex-1">
                              <div className="flex flex-col min-w-0">
                                <span className="text-sm font-bold text-slate-800 truncate">
                                  {[...(booking.testNames || []), ...(booking.packageNames || [])].join(", ") || "N/A"}
                                </span>
                                <span className="text-xs text-slate-500 flex items-center gap-1">
                                  <Calendar className="w-3 h-3" /> {format(new Date(booking.date), 'dd MMM yyyy')} | <Clock className="w-3 h-3" /> {booking.time}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 flex-shrink-0">
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                                  booking.testStatus === 'completed' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                                }`}>
                                  {booking.testStatus}
                                </span>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                                  booking.paymentStatus === 'verified' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                                }`}>
                                  {booking.paymentStatus}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 ml-4">
                              <Link href={`/admin/create-report/${booking.id}`}>
                                <Button variant="outline" size="sm" className="gap-2 border-slate-200 hover:border-blue-200 hover:bg-blue-50 text-blue-600 font-semibold h-8">
                                  <FileText className="w-3.5 h-3.5" />
                                  {booking.testStatus === 'completed' ? 'View/Edit' : 'Create Report'}
                                </Button>
                              </Link>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 text-center text-slate-400 text-sm italic">
                      No active bookings found for this patient
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })
        ) : (
          <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-200">
            <Users className="w-12 h-12 text-slate-200 mx-auto mb-4" />
            <p className="text-slate-500">No patients found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}
