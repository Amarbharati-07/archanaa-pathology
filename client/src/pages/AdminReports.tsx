import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Download, Printer, Edit3 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

export default function AdminReports() {
  const { adminToken } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [generatedReports, setGeneratedReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      const headers = { Authorization: `Bearer ${adminToken}` };
      const res = await fetch("/api/admin/all-reports", { headers });
      if (res.ok) {
        const data = await res.json();
        setGeneratedReports(data);
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to load reports", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = (report: any) => {
    // Generate simple printable view
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const parametersHtml = report.parameters.map((p: any) => `
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #eee;">${p.name}</td>
        <td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>${p.value}</strong></td>
        <td style="padding: 8px; border-bottom: 1px solid #eee;">${p.unit}</td>
        <td style="padding: 8px; border-bottom: 1px solid #eee;">${p.normalRange}</td>
        <td style="padding: 8px; border-bottom: 1px solid #eee;">${p.status}</td>
      </tr>
    `).join('');

    printWindow.document.write(`
      <html>
        <head>
          <title>Report - ${report.patientName}</title>
          <style>
            body { font-family: sans-serif; padding: 40px; color: #333; }
            .header { border-bottom: 2px solid #2563eb; padding-bottom: 20px; margin-bottom: 30px; }
            .lab-name { font-size: 24px; font-bold: true; color: #2563eb; }
            .patient-info { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th { text-align: left; background: #f8fafc; padding: 10px; border-bottom: 2px solid #e2e8f0; }
            .footer { margin-top: 50px; border-top: 1px solid #eee; padding-top: 20px; font-size: 12px; color: #666; }
            @media print { .no-print { display: none; } }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="lab-name">Archana Pathology Lab</div>
            <div>Professional Diagnostic Services</div>
          </div>
          <div class="patient-info">
            <div>
              <strong>Patient Name:</strong> ${report.patientName}<br>
              <strong>Phone:</strong> ${report.patientPhone}<br>
              <strong>Date:</strong> ${new Date(report.uploadDate).toLocaleDateString()}
            </div>
            <div style="text-align: right;">
              <strong>Technician:</strong> ${report.technicianName || 'N/A'}<br>
              <strong>Referred By:</strong> ${report.referredBy || 'Self'}<br>
              <strong>Report ID:</strong> ARCH-RPT-${report.id}
            </div>
          </div>
          <h3>${report.testName}</h3>
          <table>
            <thead>
              <tr>
                <th>Parameter</th>
                <th>Result</th>
                <th>Unit</th>
                <th>Normal Range</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${parametersHtml}
            </tbody>
          </table>
          <div style="margin-top: 30px;">
            <strong>Remarks:</strong><br>
            ${report.doctorRemarks || 'No remarks provided.'}
          </div>
          <div class="footer">
            This is a computer-generated report and does not require a physical signature.
            <div class="no-print" style="margin-top: 20px;">
              <button onclick="window.print()" style="padding: 10px 20px; background: #2563eb; color: white; border: none; border-radius: 4px; cursor: pointer;">Print Now</button>
            </div>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleDownload = (report: any) => {
    toast({ title: "Downloading...", description: "Your report is being prepared." });
    // In a real app, this would call a PDF generation endpoint
    // For now, we'll trigger the print window which allows "Save as PDF"
    handlePrint(report);
  };

  const filteredReports = generatedReports.filter(r =>
    r.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.patientPhone.includes(searchQuery) ||
    r.testName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Reports</h1>
          <p className="text-slate-500 mt-1">View and manage generated reports</p>
        </div>
      </div>

      <div className="grid gap-6">
        <Card className="border-none shadow-sm bg-white">
          <CardHeader className="pb-0">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Generated Reports</CardTitle>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input 
                  placeholder="Search by patient name or test..." 
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
                    <th className="px-4 py-3 text-left font-semibold text-slate-600">Patient Name</th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-600">Phone</th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-600">Test / Package</th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-600">Technician</th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-600">Date</th>
                    <th className="px-4 py-3 text-right font-semibold text-slate-600">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {loading ? (
                    <tr><td colSpan={6} className="text-center py-8 text-slate-400">Loading...</td></tr>
                  ) : filteredReports.length === 0 ? (
                    <tr><td colSpan={6} className="text-center py-8 text-slate-400">No Reports Found.</td></tr>
                  ) : (
                    filteredReports.map((report) => (
                      <tr key={report.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3">
                          <div className="font-bold text-slate-900">{report.patientName}</div>
                        </td>
                        <td className="px-4 py-3 text-slate-600">{report.patientPhone}</td>
                        <td className="px-4 py-3">
                          <div className="text-blue-600 font-medium">{report.testName}</div>
                        </td>
                        <td className="px-4 py-3 text-slate-600">{report.technicianName || "N/A"}</td>
                        <td className="px-4 py-3 text-slate-600">
                          {new Date(report.uploadDate).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700"
                              onClick={() => setLocation(`/admin/create-report/${report.bookingId}`)}
                            >
                              <Edit3 className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 w-8 p-0 text-slate-600"
                              onClick={() => handleDownload(report)}
                            >
                              <Download className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 w-8 p-0 text-slate-600"
                              onClick={() => handlePrint(report)}
                            >
                              <Printer className="w-4 h-4" />
                            </Button>
                          </div>
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
