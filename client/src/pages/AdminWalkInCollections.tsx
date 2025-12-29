import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Search, Beaker, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { Textarea } from "@/components/ui/textarea";

export default function AdminWalkInCollections() {
  const { adminToken } = useAuth();
  const { toast } = useToast();
  const [doctors, setDoctors] = useState<string[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<string | null>(null);
  const [collections, setCollections] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Add Doctor Modal
  const [isAddDoctorModalOpen, setIsAddDoctorModalOpen] = useState(false);
  const [newDoctor, setNewDoctor] = useState("");

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
    loadDoctors();
    loadTests();
    loadPatients();
  }, []);

  const loadDoctors = async () => {
    try {
      setLoading(true);
      const mockDoctors = ["Dr. Raj Kumar", "Dr. Priya Singh", "Dr. Arun Sharma"];
      setDoctors(mockDoctors);
    } catch (error) {
      toast({ title: "Error", description: "Failed to load doctors", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

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
      setIsAddDoctorModalOpen(false);
      toast({ title: "Success", description: "Doctor added successfully" });
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
        if (selectedDoctor) {
          loadCollectionsForDoctor(selectedDoctor);
        }
      } else {
        const err = await res.json();
        toast({ title: "Error", description: err.message || "Failed to create collection", variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Error", description: "Something went wrong", variant: "destructive" });
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
        <div className="flex gap-2">
          <Button className="bg-blue-600 hover:bg-blue-700 gap-2" onClick={handleOpenCreateCollection} data-testid="button-create-collection">
            <Plus className="w-4 h-4" />
            New Collection
          </Button>
          <Button className="bg-slate-600 hover:bg-slate-700 gap-2" onClick={() => setIsAddDoctorModalOpen(true)}>
            <Plus className="w-4 h-4" />
            New Doctor
          </Button>
        </div>
      </div>

      {/* Add Doctor Modal */}
      <Dialog open={isAddDoctorModalOpen} onOpenChange={setIsAddDoctorModalOpen}>
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
            <Button variant="outline" onClick={() => setIsAddDoctorModalOpen(false)}>Cancel</Button>
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleAddDoctor}>Add</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Walk-in Collection Modal */}
      <Dialog open={isCreateCollectionModalOpen} onOpenChange={setIsCreateCollectionModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Walk-in Collection</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            {/* Patient Selection */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">Select Patient *</Label>
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    placeholder="Search patient by name, ID, or phone..."
                    className="pl-10 h-9"
                    value={collectionForm.isNewPatient ? "" : ""}
                    onChange={(e) => {
                      // Search functionality can be added here
                    }}
                  />
                </div>
                <Button
                  variant="outline"
                  className="gap-2"
                  onClick={() => setCollectionForm(prev => ({ ...prev, isNewPatient: !prev.isNewPatient }))}
                  data-testid="button-add-new-patient"
                >
                  <User className="w-4 h-4" />
                  {collectionForm.isNewPatient ? "Select Existing" : "Add New Patient"}
                </Button>
              </div>

              {collectionForm.isNewPatient ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3 bg-slate-50 rounded-lg border">
                  <div>
                    <Label className="text-xs text-slate-500">Patient Name *</Label>
                    <Input
                      placeholder="Patient Name"
                      value={collectionForm.patientName}
                      onChange={(e) => setCollectionForm(prev => ({ ...prev, patientName: e.target.value }))}
                      className="h-8 mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-slate-500">Phone *</Label>
                    <Input
                      placeholder="Phone Number"
                      value={collectionForm.patientPhone}
                      onChange={(e) => setCollectionForm(prev => ({ ...prev, patientPhone: e.target.value }))}
                      className="h-8 mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-slate-500">Age</Label>
                    <Input
                      placeholder="Age"
                      type="number"
                      value={collectionForm.patientAge}
                      onChange={(e) => setCollectionForm(prev => ({ ...prev, patientAge: e.target.value }))}
                      className="h-8 mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-slate-500">Gender</Label>
                    <select
                      value={collectionForm.patientGender}
                      onChange={(e) => setCollectionForm(prev => ({ ...prev, patientGender: e.target.value }))}
                      className="w-full h-8 px-2 border rounded mt-1 text-sm"
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-slate-50 rounded-lg border max-h-48 overflow-y-auto">
                  {patients.length === 0 ? (
                    <p className="text-sm text-slate-500">No patients found</p>
                  ) : (
                    <div className="space-y-2">
                      {patients.map((patient) => (
                        <button
                          key={patient.id}
                          onClick={() => setCollectionForm(prev => ({ ...prev, patientId: patient.id.toString() }))}
                          className={`w-full p-2 text-left rounded border transition-colors ${
                            collectionForm.patientId === patient.id.toString()
                              ? "bg-blue-50 border-blue-300"
                              : "hover:bg-slate-100"
                          }`}
                        >
                          <div className="font-medium text-sm">{patient.name}</div>
                          <div className="text-xs text-slate-500">{patient.phone}</div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Doctor and Clinic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  Doctor Name *
                </Label>
                <Input
                  placeholder="Dr. Name"
                  value={collectionForm.doctorName}
                  onChange={(e) => setCollectionForm(prev => ({ ...prev, doctorName: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Clinic/Hospital</Label>
                <Input
                  placeholder="Clinic name"
                  value={collectionForm.clinicName}
                  onChange={(e) => setCollectionForm(prev => ({ ...prev, clinicName: e.target.value }))}
                />
              </div>
            </div>

            {/* Test Selection */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">Select Tests *</Label>
              <div className="border rounded-lg p-4 max-h-48 overflow-y-auto space-y-3">
                {tests.length === 0 ? (
                  <p className="text-sm text-slate-500">No tests available</p>
                ) : (
                  tests.map((test) => (
                    <div key={test.id} className="flex items-start gap-3 p-2 hover:bg-slate-50 rounded cursor-pointer">
                      <Checkbox
                        id={`test-${test.id}`}
                        checked={collectionForm.selectedTests.includes(test.id)}
                        onCheckedChange={() => handleToggleTest(test.id)}
                      />
                      <label htmlFor={`test-${test.id}`} className="flex-1 cursor-pointer">
                        <div className="font-medium text-sm">{test.name}</div>
                        <div className="text-xs text-slate-500">{test.category}</div>
                      </label>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label>Notes</Label>
              <Textarea
                placeholder="Additional notes..."
                value={collectionForm.notes}
                onChange={(e) => setCollectionForm(prev => ({ ...prev, notes: e.target.value }))}
                className="h-24 resize-none"
              />
            </div>
          </div>

          <DialogFooter className="border-t pt-4">
            <Button variant="outline" onClick={() => setIsCreateCollectionModalOpen(false)}>Cancel</Button>
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleCreateCollection} data-testid="button-submit-collection">
              Create Collection
            </Button>
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
                data-testid={`button-doctor-${doctor}`}
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
