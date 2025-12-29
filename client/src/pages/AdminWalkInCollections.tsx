import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Search, Beaker } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

export default function AdminWalkInCollections() {
  const { adminToken } = useAuth();
  const { toast } = useToast();
  const [doctors, setDoctors] = useState<string[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<string | null>(null);
  const [collections, setCollections] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newDoctor, setNewDoctor] = useState("");

  useEffect(() => {
    loadDoctors();
  }, []);

  const loadDoctors = async () => {
    try {
      setLoading(true);
      const headers = { Authorization: `Bearer ${adminToken}` };
      // Simulating doctor list - in production, you'd fetch actual doctors
      const mockDoctors = ["Dr. Raj Kumar", "Dr. Priya Singh", "Dr. Arun Sharma"];
      setDoctors(mockDoctors);
    } catch (error) {
      toast({ title: "Error", description: "Failed to load doctors", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const loadCollectionsForDoctor = async (doctorName: string) => {
    try {
      setLoading(true);
      const headers = { Authorization: `Bearer ${adminToken}` };
      const res = await fetch(`/api/admin/walk-in-collections/${encodeURIComponent(doctorName)}`, { headers });
      if (res.ok) {
        const data = await res.json();
        setCollections(data);
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to load collections", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleSelectDoctor = (doctorName: string) => {
    setSelectedDoctor(doctorName);
    loadCollectionsForDoctor(doctorName);
  };

  const handleAddDoctor = () => {
    if (newDoctor.trim()) {
      setDoctors([...doctors, newDoctor]);
      setSelectedDoctor(newDoctor);
      setNewDoctor("");
      setIsModalOpen(false);
      toast({ title: "Success", description: "Doctor added successfully" });
    }
  };

  const filteredCollections = collections.filter(c =>
    !c.report ? false :
      c.report.patientName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.report.patientPhone?.includes(searchQuery) ||
      c.report.testName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Walk-in Collections</h1>
          <p className="text-slate-500 mt-1">Direct sample collections from doctors/clinics</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 gap-2" onClick={() => setIsModalOpen(true)}>
          <Plus className="w-4 h-4" />
          New Doctor
        </Button>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Doctor</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Doctor Name</Label>
              <Input
                placeholder="Dr. Name"
                value={newDoctor}
                onChange={(e) => setNewDoctor(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleAddDoctor}>Add</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Doctors List */}
        <Card className="border-none shadow-sm bg-white h-fit">
          <CardHeader>
            <CardTitle className="text-base">Doctors</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {doctors.map((doctor) => (
              <Button
                key={doctor}
                variant={selectedDoctor === doctor ? "default" : "outline"}
                className="w-full justify-start"
                onClick={() => handleSelectDoctor(doctor)}
              >
                {doctor}
              </Button>
            ))}
          </CardContent>
        </Card>

        {/* Collections List */}
        <Card className="col-span-1 lg:col-span-3 border-none shadow-sm bg-white">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">
                {selectedDoctor ? `${selectedDoctor} - Collections` : "Select a doctor"}
              </CardTitle>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Search collections..."
                  className="pl-10 h-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0 mt-4">
            {!selectedDoctor ? (
              <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                <Beaker className="w-12 h-12 mb-4 opacity-20" />
                <p className="text-sm">Select a doctor to view collections</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 border-y">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold text-slate-600">Patient</th>
                      <th className="px-4 py-3 text-left font-semibold text-slate-600">Phone</th>
                      <th className="px-4 py-3 text-left font-semibold text-slate-600">Test</th>
                      <th className="px-4 py-3 text-left font-semibold text-slate-600">Clinic</th>
                      <th className="px-4 py-3 text-left font-semibold text-slate-600">Collection Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {loading ? (
                      <tr><td colSpan={5} className="text-center py-8 text-slate-400">Loading...</td></tr>
                    ) : filteredCollections.length === 0 ? (
                      <tr><td colSpan={5} className="text-center py-8 text-slate-400">No collections yet</td></tr>
                    ) : (
                      filteredCollections.map((collection) => (
                        <tr key={collection.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-4 py-3 font-bold text-slate-900">
                            {collection.report?.patientName || "Unknown"}
                          </td>
                          <td className="px-4 py-3 text-slate-600">
                            {collection.report?.patientPhone || "N/A"}
                          </td>
                          <td className="px-4 py-3 text-blue-600 font-medium">
                            {collection.report?.testName || "N/A"}
                          </td>
                          <td className="px-4 py-3 text-slate-600">{collection.clinicName}</td>
                          <td className="px-4 py-3 text-slate-600">
                            {new Date(collection.collectionDate).toLocaleDateString()}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
