import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Plus, Search } from "lucide-react";

export default function AdminWalkInCollections() {
  const { adminToken } = useAuth();
  const { toast } = useToast();
  const [collections, setCollections] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Create Collection Modal
  const [isCreateCollectionModalOpen, setIsCreateCollectionModalOpen] = useState(false);
  const [tests, setTests] = useState<any[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [collectionForm, setCollectionForm] = useState({
    patientId: "",
    isNewPatient: false,
    patientName: "",
    patientPhone: "",
    patientAge: "",
    patientGender: "",
    doctorName: "",
    clinicName: "",
    selectedTests: [] as number[],
    notes: "",
  });

  useEffect(() => {
    loadTests();
    loadPatients();
    loadCollections();
  }, []);

  const loadTests = async () => {
    try {
      const res = await fetch("/api/tests");
      if (res.ok) {
        const data = await res.json();
        setTests(data);
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to load tests", variant: "destructive" });
    }
  };

  const loadPatients = async () => {
    try {
      const res = await fetch("/api/users");
      if (res.ok) {
        const data = await res.json();
        setPatients(data);
      }
    } catch (error) {
      // Silently fail for patients
    }
  };

  const loadCollections = async () => {
    try {
      setLoading(true);
      const headers = { Authorization: `Bearer ${adminToken}` };
      const res = await fetch("/api/admin/walk-in-collections", { headers });
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

  const handleOpenCreateCollection = () => {
    setCollectionForm({
      patientId: "",
      isNewPatient: false,
      patientName: "",
      patientPhone: "",
      patientAge: "",
      patientGender: "",
      doctorName: "",
      clinicName: "",
      selectedTests: [],
      notes: "",
    });
    setIsCreateCollectionModalOpen(true);
  };

  const handleToggleTest = (testId: number) => {
    setCollectionForm(prev => ({
      ...prev,
      selectedTests: prev.selectedTests.includes(testId)
        ? prev.selectedTests.filter(id => id !== testId)
        : [...prev.selectedTests, testId]
    }));
  };

  const handleCreateCollection = async () => {
    // Validation
    if (!collectionForm.doctorName.trim()) {
      toast({ title: "Error", description: "Please enter doctor name", variant: "destructive" });
      return;
    }

    if (collectionForm.selectedTests.length === 0) {
      toast({ title: "Error", description: "Please select at least one test", variant: "destructive" });
      return;
    }

    if (collectionForm.isNewPatient) {
      if (!collectionForm.patientName.trim() || !collectionForm.patientPhone.trim()) {
        toast({ title: "Error", description: "Please fill all patient details", variant: "destructive" });
        return;
      }
    } else if (!collectionForm.patientId) {
      toast({ title: "Error", description: "Please select a patient", variant: "destructive" });
      return;
    }

    try {
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`
      };

      const payload = {
        doctorName: collectionForm.doctorName,
        clinicName: collectionForm.clinicName,
        selectedTests: collectionForm.selectedTests,
        notes: collectionForm.notes,
        isNewPatient: collectionForm.isNewPatient,
        patientId: collectionForm.patientId,
        patientName: collectionForm.patientName,
        patientPhone: collectionForm.patientPhone,
        patientAge: collectionForm.patientAge,
        patientGender: collectionForm.patientGender,
      };

      const res = await fetch("/api/admin/walk-in-collections", {
        method: "POST",
        headers,
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        toast({ title: "Success", description: "Walk-in collection created successfully" });
        setIsCreateCollectionModalOpen(false);
        loadCollections();
      } else {
        const err = await res.json();
        toast({ title: "Error", description: err.message || "Failed to create collection", variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Error", description: "Something went wrong", variant: "destructive" });
    }
  };

  const filteredCollections = collections.filter(c =>
    c.patientName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.patientPhone?.includes(searchQuery) ||
    c.testName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Walk-in Collections</h1>
          <p className="text-slate-500 mt-1">Direct sample collections from doctors/clinics</p>
        </div>
        <Button onClick={handleOpenCreateCollection} className="gap-2">
          <Plus className="w-4 h-4" />
          New Collection
        </Button>
      </div>

      {/* Collections List */}
      <div className="grid gap-6">
        <Card className="border-none shadow-sm bg-white">
          <CardHeader className="pb-0">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Collections</CardTitle>
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
            {loading ? (
              <div className="p-8 text-center text-slate-500">Loading collections...</div>
            ) : filteredCollections.length === 0 ? (
              <div className="p-8 text-center text-slate-500">No collections found</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 border-y">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold text-slate-600">Patient Name</th>
                      <th className="px-4 py-3 text-left font-semibold text-slate-600">Phone</th>
                      <th className="px-4 py-3 text-left font-semibold text-slate-600">Doctor Name</th>
                      <th className="px-4 py-3 text-left font-semibold text-slate-600">Test</th>
                      <th className="px-4 py-3 text-left font-semibold text-slate-600">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {filteredCollections.map((collection: any, idx: number) => (
                      <tr key={idx} className="hover:bg-slate-50" data-testid={`row-collection-${idx}`}>
                        <td className="px-4 py-3 text-slate-900">{collection.patientName || "N/A"}</td>
                        <td className="px-4 py-3 text-slate-600">{collection.patientPhone || "N/A"}</td>
                        <td className="px-4 py-3 text-slate-600">{collection.doctorName || "N/A"}</td>
                        <td className="px-4 py-3 text-slate-600">{collection.testName || "N/A"}</td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                            Collected
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Create Collection Modal */}
      <Dialog open={isCreateCollectionModalOpen} onOpenChange={setIsCreateCollectionModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Walk-in Collection</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Doctor Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-slate-700">Doctor Name *</label>
                <Input
                  placeholder="Enter doctor name"
                  value={collectionForm.doctorName}
                  onChange={(e) => setCollectionForm({...collectionForm, doctorName: e.target.value})}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">Clinic Name</label>
                <Input
                  placeholder="Enter clinic name (optional)"
                  value={collectionForm.clinicName}
                  onChange={(e) => setCollectionForm({...collectionForm, clinicName: e.target.value})}
                  className="mt-1"
                />
              </div>
            </div>

            {/* Patient Selection */}
            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={collectionForm.isNewPatient}
                  onCheckedChange={(checked) => setCollectionForm({...collectionForm, isNewPatient: checked as boolean})}
                />
                <span className="text-sm font-medium text-slate-700">New Patient</span>
              </label>
            </div>

            {collectionForm.isNewPatient ? (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700">Patient Name *</label>
                  <Input
                    placeholder="Patient name"
                    value={collectionForm.patientName}
                    onChange={(e) => setCollectionForm({...collectionForm, patientName: e.target.value})}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">Phone *</label>
                  <Input
                    placeholder="Phone number"
                    value={collectionForm.patientPhone}
                    onChange={(e) => setCollectionForm({...collectionForm, patientPhone: e.target.value})}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">Age</label>
                  <Input
                    placeholder="Age"
                    type="number"
                    value={collectionForm.patientAge}
                    onChange={(e) => setCollectionForm({...collectionForm, patientAge: e.target.value})}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">Gender</label>
                  <Select value={collectionForm.patientGender} onValueChange={(value) => setCollectionForm({...collectionForm, patientGender: value})}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ) : (
              <div>
                <label className="text-sm font-medium text-slate-700">Select Patient *</label>
                <Select value={collectionForm.patientId} onValueChange={(value) => setCollectionForm({...collectionForm, patientId: value})}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select existing patient" />
                  </SelectTrigger>
                  <SelectContent>
                    {patients.map((patient: any) => (
                      <SelectItem key={patient.id} value={String(patient.id)}>
                        {patient.name} - {patient.phone}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Tests Selection */}
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-3">Select Tests *</label>
              <div className="space-y-2 max-h-64 overflow-y-auto border rounded p-3 bg-slate-50">
                {tests.map((test: any) => (
                  <label key={test.id} className="flex items-center gap-2 cursor-pointer hover:bg-slate-100 p-2 rounded">
                    <Checkbox
                      checked={collectionForm.selectedTests.includes(test.id)}
                      onCheckedChange={() => handleToggleTest(test.id)}
                    />
                    <span className="text-sm text-slate-700">{test.name}</span>
                    <span className="text-xs text-slate-500 ml-auto">₹{test.price}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="text-sm font-medium text-slate-700">Notes</label>
              <Input
                placeholder="Additional notes (optional)"
                value={collectionForm.notes}
                onChange={(e) => setCollectionForm({...collectionForm, notes: e.target.value})}
                className="mt-1"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 justify-end pt-4">
              <Button variant="outline" onClick={() => setIsCreateCollectionModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateCollection}>
                Create Collection
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
