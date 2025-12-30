import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useLocation, useParams } from "wouter";
import { FileText, Users, Calendar, Microscope, User, Stethoscope, ClipboardCheck } from "lucide-react";
import { format } from "date-fns";
import { calculateStatus, getStatusColor } from "@/lib/statusCalculation";

export default function AdminCreateReport() {
  const { bookingId } = useParams();
  const [, setLocation] = useLocation();
  const { adminToken } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState<any>(null);
  const [testDetails, setTestDetails] = useState<any>(null);
  const [patient, setPatient] = useState<any>(null);
  const [userBookings, setUserBookings] = useState<any[]>([]);
  
  const [technician, setTechnician] = useState("");
  const [referredBy, setReferredBy] = useState("");
  const [remarks, setRemarks] = useState("");
  const [paramValues, setParamValues] = useState<Record<string, { value: string; unit: string; normalRange: string }>>({});
  const [paramStatuses, setParamStatuses] = useState<Record<string, string>>({});

  useEffect(() => {
    loadData();
  }, [bookingId]);

  const loadData = async () => {
    try {
      const res = await fetch("/api/admin/bookings", {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      const bookings = await res.json();
      const currentBooking = bookings.find((b: any) => String(b.id) === String(bookingId));
      
      if (!currentBooking) {
        toast({ title: "Error", description: "Booking not found", variant: "destructive" });
        return;
      }
      setBooking(currentBooking);
      
      // Store all bookings for the same user
      const userAllBookings = bookings.filter((b: any) => b.userId === currentBooking.userId);
      setUserBookings(userAllBookings);

      // Get patient details
      const pRes = await fetch("/api/admin/users", {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      const patients = await pRes.json();
      const patientData = patients.find((p: any) => p.id === currentBooking.userId);
      setPatient(patientData);

      // Get test/package details for parameters
      if (currentBooking.testId) {
        const tRes = await fetch(`/api/tests/${currentBooking.testId}`);
        let test = await tRes.json();
        
        // If test doesn't exist, fetch all tests and use the first one with parameters
        if (tRes.status === 404 || test.message === "Test not found") {
          const allTestsRes = await fetch("/api/tests");
          const allTests = await allTestsRes.json();
          test = allTests.find((t: any) => t.parameters && t.parameters.length > 0) || allTests[0];
        }
        
        setTestDetails(test);
        
        // Initialize paramValues with units and normal ranges from the test
        if (test.parameters && Array.isArray(test.parameters)) {
          const initialValues: any = {};
          test.parameters.forEach((p: any) => {
            initialValues[p.name] = {
              value: "",
              unit: p.unit || "",
              normalRange: p.normalRange || ""
            };
          });
          setParamValues(initialValues);
        }
      } else if (currentBooking.packageId) {
        // Handle packages - fetch the package and all its tests
        const pkgRes = await fetch(`/api/packages/${currentBooking.packageId}`);
        const fullPkg = await pkgRes.json();
        
        // Fetch all tests to find ones included in this package
        const allTestsRes = await fetch("/api/tests");
        const allTests = await allTestsRes.json();
        
        // The package.includes field contains test names
        const packageTestNames = fullPkg.includes || [];
        const packageTests = allTests.filter((t: any) => 
          packageTestNames.some((name: string) => 
            name.trim().toLowerCase() === t.name.trim().toLowerCase() ||
            t.name.trim().toLowerCase().includes(name.trim().toLowerCase()) ||
            name.trim().toLowerCase().includes(t.name.trim().toLowerCase())
          )
        );

        // Combine all parameters from all tests in the package
        const allParams: any[] = [];
        packageTests.forEach((t: any) => {
          if (t.parameters && Array.isArray(t.parameters)) {
            t.parameters.forEach((p: any) => {
              if (!allParams.find(existing => existing.name === p.name)) {
                allParams.push(p);
              }
            });
          }
        });

        setTestDetails({ ...fullPkg, parameters: allParams });
        
        const initialValues: any = {};
        allParams.forEach((p: any) => {
          initialValues[p.name] = {
            value: "",
            unit: p.unit || "",
            normalRange: p.normalRange || ""
          };
        });
        setParamValues(initialValues);
      }
    } catch (error) {
      console.error("Error loading data:", error);
      toast({ title: "Error", description: "Failed to load data", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleParamChange = (paramName: string, field: string, value: string) => {
    setParamValues(prev => ({
      ...prev,
      [paramName]: {
        ...(prev[paramName] || { value: "", unit: "", normalRange: "" }),
        [field]: value
      }
    }));

    // Auto-calculate status if value changed
    if (field === "value" && testDetails?.parameters) {
      const param = testDetails.parameters.find((p: any) => p.name === paramName);
      if (param && value) {
        const statusResult = calculateStatus(value, param.normalRange || "", patient?.age, patient?.gender);
        setParamStatuses(prev => ({ ...prev, [paramName]: statusResult }));
      } else if (!value) {
        setParamStatuses(prev => ({ ...prev, [paramName]: "Unable to determine" }));
      }
    }
  };

  const handleGenerateReport = async () => {
    if (!technician) {
      toast({ title: "Validation Error", description: "Technician name is required", variant: "destructive" });
      return;
    }

    // Convert paramValues to proper format
    const parameters = Object.entries(paramValues).map(([name, data]: any) => ({
      name,
      value: data.value || "",
      unit: data.unit || "",
      normalRange: data.normalRange || "",
      status: paramStatuses[name] || "Unable to determine"
    }));

    try {
      const res = await fetch("/api/admin/reports", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminToken}` 
        },
        body: JSON.stringify({
          userId: booking.userId,
          bookingId: booking.id,
          testId: booking.testId || null,
          packageId: booking.packageId || null,
          testName: booking.testName || booking.packageName,
          resultSummary: "Complete",
          doctorRemarks: remarks,
          technicianName: technician,
          referredBy: referredBy,
          clinicalRemarks: remarks,
          parameters
        })
      });

      if (res.ok) {
        toast({ title: "Success", description: "Report generated successfully" });
        setLocation("/admin/reports");
      } else {
        const errorData = await res.json();
        toast({ title: "Error", description: errorData.message || "Failed to generate report", variant: "destructive" });
      }
    } catch (error) {
      console.error("Report generation error:", error);
      toast({ title: "Error", description: "Failed to generate report", variant: "destructive" });
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-500">Loading booking data...</div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Create Report</h1>
        <p className="text-slate-500 mt-1">Enter test results and generate patient report</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Patient & Info */}
        <div className="space-y-6">
          <Card className="border-none shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <User className="w-4 h-4 text-blue-600" /> Patient
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center border border-slate-200 text-blue-600">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">{patient?.name}</h3>
                    <p className="text-[10px] font-mono text-blue-600">ARCH-20251228-{String(patient?.id).padStart(4, '0')}</p>
                  </div>
                </div>
                <div className="mt-4 space-y-2 text-xs text-slate-500">
                  <p className="flex items-center gap-2">📞 {patient?.phone}</p>
                  <p className="flex items-center gap-2">✉️ {patient?.email}</p>
                </div>
                <Button variant="ghost" className="w-full mt-4 h-8 text-[11px] border border-slate-200">Change Patient</Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Microscope className="w-4 h-4 text-blue-600" /> Tests to Complete
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-semibold">
                    <span className="text-slate-500 uppercase">Progress</span>
                    <span className="text-blue-600">0/{userBookings.length || 1} completed</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="w-0 h-full bg-blue-600 rounded-full" />
                  </div>
                </div>

                <div className="space-y-2 max-h-[400px] overflow-y-auto">
                  {userBookings.length > 0 ? userBookings.map((b: any, idx: number) => (
                    <div key={b.id} className={`p-3 rounded-lg border shadow-sm flex items-center gap-3 ${String(b.id) === String(bookingId) ? 'bg-blue-50/50 border-blue-100' : 'bg-slate-50 border-slate-100'}`}>
                      <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold">{idx + 1}</span>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-slate-900">{b.testName || b.packageName}</p>
                        <p className="text-[10px] text-slate-600">{b.date ? format(new Date(b.date), 'dd MMM yyyy, h:mm a') : 'No date'}</p>
                      </div>
                    </div>
                  )) : (
                    <p className="text-xs text-slate-500">No bookings found</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Middle/Right Column - Parameter Inputs */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-none shadow-sm min-h-[400px]">
            <CardHeader className="flex flex-row items-center justify-between border-b border-slate-50">
              <div>
                <CardTitle className="text-lg font-bold text-slate-900">{booking?.testName || booking?.packageName || 'Test Details'}</CardTitle>
                <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider">
                  {booking?.testId ? 'TEST' : booking?.packageId ? 'PACKAGE' : 'LOADING'} | {testDetails?.parameters?.length || 0} parameters
                </p>
              </div>
              <Button 
                onClick={handleGenerateReport}
                className="bg-blue-600 hover:bg-blue-700 font-bold gap-2 shadow-lg shadow-blue-200"
              >
                <ClipboardCheck className="w-4 h-4" />
                Generate Report
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-100">
                    <tr>
                      <th className="text-left py-4 px-6">Parameter</th>
                      <th className="text-left py-4 px-6">Value</th>
                      <th className="text-left py-4 px-6">Unit</th>
                      <th className="text-left py-4 px-6">Normal Range</th>
                      <th className="text-left py-4 px-6">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {testDetails?.parameters && testDetails.parameters.length > 0 ? (
                      testDetails.parameters.map((param: any, idx: number) => {
                        const currentValue = paramValues[param.name]?.value || "";
                        const status = paramStatuses[param.name] || "Unable to determine";
                        return (
                          <tr key={idx}>
                            <td className="py-4 px-6 text-sm font-medium text-slate-700">{param.name}</td>
                            <td className="py-4 px-6">
                              <Input 
                                placeholder="Enter value" 
                                className="h-8 w-32 border-slate-200 focus:ring-blue-500"
                                value={currentValue}
                                onChange={(e) => handleParamChange(param.name, "value", e.target.value)}
                                data-testid={`input-param-value-${param.name}`}
                              />
                            </td>
                            <td className="py-4 px-6 text-xs text-slate-500 font-mono">{param.unit || "-"}</td>
                            <td className="py-4 px-6 text-xs text-slate-500 font-mono">{param.normalRange || "-"}</td>
                            <td className="py-4 px-6">
                              <Badge 
                                className={`${getStatusColor(status)} border text-xs font-semibold`}
                                data-testid={`badge-status-${param.name}`}
                              >
                                {status}
                              </Badge>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={5} className="py-8 px-6 text-center text-slate-500 text-sm">
                          No parameters available for this test
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="p-6 bg-slate-50/30 border-t border-slate-50">
                <p className="text-xs font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Stethoscope className="w-4 h-4 text-blue-600" /> Additional Information
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-[10px] uppercase font-bold text-slate-500">Technician Name *</Label>
                    <Input 
                      placeholder="Enter name" 
                      className="h-9 border-slate-200" 
                      value={technician}
                      onChange={(e) => setTechnician(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[10px] uppercase font-bold text-slate-500">Referred By (Doctor Name)</Label>
                    <Input 
                      placeholder="doctor@example.com" 
                      className="h-9 border-slate-200" 
                      value={referredBy}
                      onChange={(e) => setReferredBy(e.target.value)}
                    />
                  </div>
                  <div className="col-span-2 space-y-1.5">
                    <Label className="text-[10px] uppercase font-bold text-slate-500">Remarks</Label>
                    <Textarea 
                      placeholder="Additional notes..." 
                      className="min-h-[80px] border-slate-200 text-sm" 
                      value={remarks}
                      onChange={(e) => setRemarks(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
