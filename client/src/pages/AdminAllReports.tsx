import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Search, Download, Printer } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

export default function AdminAllReports() {
  const { adminToken } = useAuth();
  const { toast } = useToast();
  const [reports, setReports] = useState<any[]>([]);
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
        setReports(data);
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to load reports", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const filteredReports = reports.filter(r =>
    r.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.patientPhone.includes(searchQuery) ||
    r.testName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">View and manage generated reports</h1>
          <p className="text-slate-500 mt-1">All reports created in the system</p>
        </div>
      </div>

      <div className="grid gap-6">
        <Card className="border-none shadow-sm bg-white">
          <CardHeader className="pb-0">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Reports</CardTitle>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Search by patient ID, name, or test..."
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
                    <tr><td colSpan={6} className="text-center py-8 text-slate-400">No Reports Yet. Generated reports will appear here</td></tr>
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
                        <td className="px-4 py-3 text-right space-x-2">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Download className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Printer className="w-4 h-4" />
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
