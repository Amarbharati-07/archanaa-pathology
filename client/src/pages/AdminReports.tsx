import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Search, Plus, Calendar, User, Microscope, Activity, CheckCircle2, AlertCircle, Printer, Download } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function AdminReports() {
  const { adminToken } = useAuth();
  const { toast } = useToast();
  const [bookings, setBookings] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [reportForm, setReportForm] = useState({
    technicianName: "Dr. Arun Kumar",
    referredBy: "Self",
    clinicalRemarks: "Correlation with clinical findings is recommended.",
  });
  const [testResults, setTestResults] = useState<any[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const headers = { Authorization: `Bearer ${adminToken}` };
      const [bookingsRes, testsRes] = await Promise.all([
        fetch("/api/admin/bookings", { headers }),
        fetch("/api/tests")
      ]);
      
      if (bookingsRes.ok) {
        const data = await bookingsRes.json();
        // Only show bookings that need reports (in_progress or completed)
        setBookings(data.filter((b: any) => b.testStatus !== "booked"));
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to load bookings", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenReportModal = async (booking: any) => {
    setSelectedBooking(booking);
    let parameters: any[] = [];

    try {
      if (booking.testId) {
        const res = await fetch(`/api/tests/${booking.testId}`);
        const test = await res.json();
        parameters = test.parameters || [];
      } else if (booking.packageId) {
        const res = await fetch(`/api/packages/${booking.packageId}`);
        const pkg = await res.json();
        // Fetch all tests in the package to get parameters
        const testsRes = await fetch("/api/tests");
        const allTests = await testsRes.json();
        const packageTests = allTests.filter((t: any) => pkg.includes.includes(t.name));
        packageTests.forEach((t: any) => {
          if (t.parameters) parameters = [...parameters, ...t.parameters];
        });
      }

      setTestResults(parameters.map(p => ({
        ...p,
        result: "",
        status: "Normal"
      })));
      setIsModalOpen(true);
    } catch (error) {
      toast({ title: "Error", description: "Failed to load test parameters", variant: "destructive" });
    }
  };

  const updateResult = (index: number, value: string) => {
    const newResults = [...testResults];
    newResults[index].result = value;
    
    // Auto-status logic (simple range check)
    if (value && newResults[index].normalRange) {
      const range = newResults[index].normalRange.match(/(\d+\.?\d*)\s*-\s*(\d+\.?\d*)/);
      if (range) {
        const val = parseFloat(value);
        const min = parseFloat(range[1]);
        const max = parseFloat(range[2]);
        if (val < min) newResults[index].status = "LOW";
        else if (val > max) newResults[index].status = "HIGH";
        else newResults[index].status = "Normal";
      }
    }
    setTestResults(newResults);
  };

  const handleSubmitReport = async () => {
    if (testResults.some(r => !r.result)) {
      toast({ title: "Validation Error", description: "Please fill all test results", variant: "destructive" });
      return;
    }

    try {
      const res = await fetch("/api/admin/reports", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify({
          userId: selectedBooking.userId,
          bookingId: selectedBooking.id,
          testId: selectedBooking.testId,
          packageId: selectedBooking.packageId,
          testName: selectedBooking.testName || selectedBooking.packageName,
          parameters: testResults,
          ...reportForm
        })
      });

      if (res.ok) {
        toast({ title: "Success", description: "Report generated successfully" });
        setIsModalOpen(false);
        loadData();
      } else {
        const err = await res.json();
        toast({ title: "Error", description: err.message, variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Error", description: "Something went wrong", variant: "destructive" });
    }
  };

  const filteredBookings = bookings.filter(b => 
    b.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (b.testName || b.packageName).toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Medical Reports</h1>
          <p className="text-slate-500 mt-1">Generate and manage professional pathology reports</p>
        </div>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-blue-600 flex items-center gap-2">
              <FileText className="w-6 h-6" />
              Professional Report Generator
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            {/* Patient Header Info */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-lg border border-slate-100">
              <div>
                <Label className="text-xs text-slate-500 uppercase">Patient Name</Label>
                <p className="font-bold text-slate-900">{selectedBooking?.userName}</p>
              </div>
              <div>
                <Label className="text-xs text-slate-500 uppercase">Phone</Label>
                <p className="font-bold text-slate-900">{selectedBooking?.phone}</p>
              </div>
              <div>
                <Label className="text-xs text-slate-500 uppercase">Test/Package</Label>
                <p className="font-bold text-blue-600">{selectedBooking?.testName || selectedBooking?.packageName}</p>
              </div>
              <div>
                <Label className="text-xs text-slate-500 uppercase">Date</Label>
                <p className="font-bold text-slate-900">{selectedBooking?.date ? new Date(selectedBooking.date).toLocaleDateString() : ""}</p>
              </div>
            </div>

            {/* Report Metadata */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Technician / Pathologist Name</Label>
                <Input 
                  value={reportForm.technicianName}
                  onChange={(e) => setReportForm({ ...reportForm, technicianName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Referred By</Label>
                <Input 
                  value={reportForm.referredBy}
                  onChange={(e) => setReportForm({ ...reportForm, referredBy: e.target.value })}
                />
              </div>
            </div>

            {/* Parameters Table */}
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-slate-700">Parameter</th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-700">Result</th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-700 w-24">Unit</th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-700">Normal Range</th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-700 w-24">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {testResults.map((res, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-4 py-3 font-medium text-slate-900">{res.name}</td>
                      <td className="px-4 py-3">
                        <Input 
                          value={res.result}
                          onChange={(e) => updateResult(idx, e.target.value)}
                          className={`h-8 w-24 font-bold ${res.status !== 'Normal' ? 'text-red-600 border-red-200 bg-red-50' : ''}`}
                        />
                      </td>
                      <td className="px-4 py-3 text-slate-500">{res.unit}</td>
                      <td className="px-4 py-3 text-slate-600 font-mono">{res.normalRange}</td>
                      <td className="px-4 py-3">
                        {res.status !== 'Normal' ? (
                          <Badge variant="destructive" className="text-[10px] px-1.5 h-5 uppercase font-bold animate-pulse">
                            {res.status}
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-[10px] px-1.5 h-5 uppercase text-emerald-600 border-emerald-200 bg-emerald-50">
                            Normal
                          </Badge>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="space-y-2">
              <Label>Clinical Remarks</Label>
              <Textarea 
                value={reportForm.clinicalRemarks}
                onChange={(e) => setReportForm({ ...reportForm, clinicalRemarks: e.target.value })}
                className="h-20"
              />
            </div>
          </div>

          <DialogFooter className="border-t pt-4">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Discard</Button>
            <Button className="bg-blue-600 hover:bg-blue-700 gap-2" onClick={handleSubmitReport}>
              <CheckCircle2 className="w-4 h-4" />
              Generate Official Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bookings List for Report Generation */}
      <div className="grid gap-6">
        <Card className="border-none shadow-sm bg-white">
          <CardHeader className="pb-0">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Pending Reports</CardTitle>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input 
                  placeholder="Search by patient..." 
                  className="pl-10 h-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0 mt-4">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-y">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-slate-600">Patient</th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-600">Test / Package</th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-600">Booking Date</th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-600">Status</th>
                    <th className="px-4 py-3 text-right font-semibold text-slate-600">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {loading ? (
                    <tr><td colSpan={5} className="text-center py-8 text-slate-400">Loading...</td></tr>
                  ) : filteredBookings.length === 0 ? (
                    <tr><td colSpan={5} className="text-center py-8 text-slate-400">No pending reports found.</td></tr>
                  ) : (
                    filteredBookings.map((booking) => (
                      <tr key={booking.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3">
                          <div className="font-bold text-slate-900">{booking.userName}</div>
                          <div className="text-xs text-slate-500">{booking.phone}</div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-blue-600 font-medium">{booking.testName || booking.packageName}</div>
                          <Badge variant="outline" className="text-[10px] px-1 mt-1">
                            {booking.testId ? "Single Test" : "Health Package"}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-slate-600">
                          {new Date(booking.date).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3">
                          <Badge className={booking.testStatus === 'completed' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-orange-50 text-orange-600 border-orange-100'}>
                            {booking.testStatus.replace('_', ' ')}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <Button 
                            variant="default" 
                            size="sm" 
                            className="bg-blue-600 hover:bg-blue-700 h-8"
                            onClick={() => handleOpenReportModal(booking)}
                          >
                            Create Report
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
