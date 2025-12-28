import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Search, Plus, UserPlus, FileText, Microscope } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

export default function AdminPatients() {
  const { adminToken } = useAuth();
  const { toast } = useToast();
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    try {
      const res = await fetch("/api/admin/users", {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      if (res.ok) {
        setPatients(await res.json());
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to load patients", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.phone.includes(searchQuery)
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Patients</h1>
          <p className="text-slate-500 mt-1">Manage patient records</p>
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
          <p className="text-center py-8 text-slate-500">Loading patients...</p>
        ) : filteredPatients.length > 0 ? (
          filteredPatients.map((patient) => (
            <Card key={patient.id} className="border-none shadow-sm bg-white hover:shadow-md transition-shadow group">
              <CardContent className="p-4 flex items-center justify-between">
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
                      <span className="flex items-center gap-1">
                        <span className="w-4 h-4 rounded-full bg-slate-100 flex items-center justify-center text-[10px]">📞</span>
                        {patient.phone}
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="w-4 h-4 rounded-full bg-slate-100 flex items-center justify-center text-[10px]">✉️</span>
                        {patient.email}
                      </span>
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="gap-2 border-slate-200 hover:border-blue-200 hover:bg-blue-50 text-slate-600">
                  <FileText className="w-4 h-4" />
                  Create Report
                </Button>
              </CardContent>
            </Card>
          ))
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
