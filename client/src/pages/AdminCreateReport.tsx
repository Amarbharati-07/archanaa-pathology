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

  const [pendingQueue, setPendingQueue] = useState<any[]>([]);
  const [currentQueueIndex, setCurrentQueueIndex] = useState(0);
  const [completedInQueue, setCompletedInQueue] = useState<number>(0);

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
      
      const pRes = await fetch("/api/admin/users", {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      const patients = await pRes.json();
      const patientData = patients.find((p: any) => p.id === currentBooking.userId);
      setPatient(patientData);

      const testsRes = await fetch("/api/tests");
      const allTests = await testsRes.json();
      const packagesRes = await fetch("/api/packages");
      const allPackages = await packagesRes.json();

      const queue: any[] = [];

      // Process Individual Tests
      if (currentBooking.testIds && currentBooking.testIds.length > 0) {
        currentBooking.testIds.forEach((id: number) => {
          const test = allTests.find((t: any) => t.id === id);
          if (test) {
            queue.push({
              type: 'test',
              id: test.id,
              name: test.name,
              parameters: test.parameters || [],
              bookingId: currentBooking.id
            });
          }
        });
      }

      // Process Packages (break down into individual tests)
      if (currentBooking.packageIds && currentBooking.packageIds.length > 0) {
        currentBooking.packageIds.forEach((id: number) => {
          const pkg = allPackages.find((p: any) => p.id === id);
          if (pkg) {
            const pkgTests = allTests.filter((t: any) => 
              pkg.includes?.some((name: string) => 
                name.trim().toLowerCase() === t.name.trim().toLowerCase()
              )
            );
            pkgTests.forEach((t: any) => {
              queue.push({
                type: 'package-test',
                packageId: pkg.id,
                packageName: pkg.name,
                id: t.id,
                name: t.name,
                parameters: t.parameters || [],
                bookingId: currentBooking.id
              });
            });
          }
        });
      }

      setPendingQueue(queue);
      
      // Calculate completed count from booking data
      const completedIds = currentBooking.completedTestIds || [];
      const completedPkgTests = currentBooking.completedPackageTestIds || [];
      
      let initialCompletedCount = 0;
      let firstPendingIndex = -1;

      queue.forEach((item, idx) => {
        const isCompleted = item.type === 'test' 
          ? completedIds.includes(item.id)
          : completedPkgTests.some((cp: any) => cp.packageId === item.packageId && cp.testId === item.id);
        
        if (isCompleted) {
          initialCompletedCount++;
        } else if (firstPendingIndex === -1) {
          firstPendingIndex = idx;
        }
      });

      setCompletedInQueue(initialCompletedCount);
      
      if (firstPendingIndex !== -1) {
        setCurrentQueueIndex(firstPendingIndex);
        loadQueueItem(queue[firstPendingIndex]);
      } else if (queue.length > 0) {
        // All completed, but let's load the last one for viewing/editing
        setCurrentQueueIndex(queue.length - 1);
        loadQueueItem(queue[queue.length - 1]);
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

  const loadQueueItem = (item: any) => {
    setTestDetails({ name: item.name, parameters: item.parameters, type: item.type, packageName: item.packageName });
    
    const initialValues: any = {};
    item.parameters.forEach((p: any) => {
      initialValues[p.name] = {
        value: "",
        unit: p.unit || "",
        normalRange: p.normalRange || ""
      };
    });
    setParamValues(initialValues);
    setParamStatuses({});
  };

  const handleGenerateReport = async () => {
    if (!technician) {
      toast({ title: "Validation Error", description: "Technician name is required", variant: "destructive" });
      return;
    }

    const currentItem = pendingQueue[currentQueueIndex];
    const parameters = Object.entries(paramValues).map(([name, data]: any) => ({
      name,
      value: data.value || "",
      unit: data.unit || "",
      normalRange: data.normalRange || "",
      status: paramStatuses[name] || "Unable to determine"
    }));

    try {
      const isLastItem = currentQueueIndex === pendingQueue.length - 1;
      
      const res = await fetch("/api/admin/reports", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminToken}` 
        },
        body: JSON.stringify({
          userId: booking.userId,
          bookingId: booking.id,
          testId: currentItem.type === 'test' ? currentItem.id : null,
          packageId: currentItem.type === 'package-test' ? currentItem.packageId : null,
          testName: currentItem.type === 'package-test' ? `${currentItem.packageName} - ${currentItem.name}` : currentItem.name,
          resultSummary: "Completed",
          doctorRemarks: remarks,
          technicianName: technician,
          referredBy: referredBy,
          clinicalRemarks: remarks,
          parameters,
          updateBookingStatus: isLastItem,
          completedTestIds: currentItem.type === 'test' 
            ? Array.from(new Set([...(booking.completedTestIds || []), currentItem.id]))
            : booking.completedTestIds || [],
          completedPackageTestIds: currentItem.type === 'package-test'
            ? [...(booking.completedPackageTestIds || []), { packageId: currentItem.packageId, testId: currentItem.id }]
            : booking.completedPackageTestIds || []
        })
      });

      if (res.ok) {
        toast({ title: "Success", description: `Report for ${currentItem.name} generated` });
        
        // Update local booking state with new completion info
        const updatedCompletedTests = [...(booking.completedTestIds || [])];
        const updatedCompletedPkgTests = [...(booking.completedPackageTestIds || [])];
        
        if (currentItem.type === 'test') {
          if (!updatedCompletedTests.includes(currentItem.id)) {
            updatedCompletedTests.push(currentItem.id);
          }
        } else {
          const alreadyExists = updatedCompletedPkgTests.some(
            (cp: any) => cp.packageId === currentItem.packageId && cp.testId === currentItem.id
          );
          if (!alreadyExists) {
            updatedCompletedPkgTests.push({ packageId: currentItem.packageId, testId: currentItem.id });
          }
        }

        const nextIndex = currentQueueIndex + 1;
        // Count total completed based on new lists
        const newCompletedCount = pendingQueue.filter((item, idx) => {
          if (idx < nextIndex) return true; // Items up to current are done
          return item.type === 'test' 
            ? updatedCompletedTests.includes(item.id)
            : updatedCompletedPkgTests.some((cp: any) => cp.packageId === item.packageId && cp.testId === item.id);
        }).length;

        setCompletedInQueue(newCompletedCount);
        
        if (nextIndex < pendingQueue.length) {
          setCurrentQueueIndex(nextIndex);
          loadQueueItem(pendingQueue[nextIndex]);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          toast({ title: "Completed", description: "All tests in this booking have been reported." });
          setLocation("/admin/reports");
        }
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
                    <span className="text-blue-600">{completedInQueue}/{pendingQueue.length} completed</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-600 transition-all duration-500" 
                      style={{ width: `${(completedInQueue / (pendingQueue.length || 1)) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                  {pendingQueue.length > 0 ? pendingQueue.map((item, idx) => (
                    <div 
                      key={idx} 
                      className={`p-3 rounded-lg border shadow-sm transition-all ${
                        idx === currentQueueIndex 
                          ? 'bg-blue-50 border-blue-200 ring-1 ring-blue-100' 
                          : idx < completedInQueue 
                            ? 'bg-emerald-50/30 border-emerald-100 opacity-70' 
                            : 'bg-slate-50 border-slate-100'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${
                          idx === currentQueueIndex 
                            ? 'bg-blue-600 text-white' 
                            : idx < completedInQueue 
                              ? 'bg-emerald-500 text-white' 
                              : 'bg-slate-200 text-slate-500'
                        }`}>
                          {idx < completedInQueue ? '✓' : idx + 1}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-bold truncate ${idx === currentQueueIndex ? 'text-blue-900' : 'text-slate-700'}`}>
                            {item.name}
                          </p>
                          <p className="text-[10px] text-slate-500 mt-0.5">
                            {item.type === 'package-test' ? `From: ${item.packageName}` : 'Individual Test'}
                          </p>
                        </div>
                      </div>
                    </div>
                  )) : (
                    <p className="text-xs text-slate-500 text-center py-4">Processing booking details...</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Middle/Right Column - Parameter Inputs */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-none shadow-sm min-h-[400px]">
            <CardHeader className="flex flex-row items-center justify-between border-b border-slate-50 bg-white sticky top-0 z-10">
              <div>
                <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  {testDetails?.packageName && (
                    <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-100 text-[10px]">
                      {testDetails.packageName}
                    </Badge>
                  )}
                  <span className="text-blue-600">{testDetails?.name}</span>
                </CardTitle>
                <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-medium">
                  Step {currentQueueIndex + 1} of {pendingQueue.length} | {testDetails?.parameters?.length || 0} parameters
                </p>
              </div>
              <Button 
                onClick={handleGenerateReport}
                className="bg-blue-600 hover:bg-blue-700 font-bold gap-2 shadow-lg shadow-blue-200 min-w-[160px]"
              >
                <ClipboardCheck className="w-4 h-4" />
                {currentQueueIndex === pendingQueue.length - 1 ? 'Finish & Save All' : 'Save & Next Test'}
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
