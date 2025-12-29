import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Search, Plus, Trash2, Edit2, BadgeCheck } from "lucide-react";
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
import { Checkbox } from "@/components/ui/checkbox";

export default function AdminPackages() {
  const { adminToken } = useAuth();
  const { toast } = useToast();
  const [packages, setPackages] = useState<any[]>([]);
  const [tests, setTests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<any>(null);
  const [packageForm, setPackageForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "General",
    image: "",
    includes: [] as string[]
  });

  useEffect(() => {
    loadPackages();
    fetch("/api/tests").then(res => res.json()).then(setTests);
  }, []);

  const loadPackages = async () => {
    try {
      const res = await fetch("/api/packages");
      if (res.ok) {
        setPackages(await res.json());
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to load packages", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddModal = () => {
    setEditingPackage(null);
    setPackageForm({
      name: "",
      description: "",
      price: "",
      category: "General",
      image: "",
      includes: []
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (pkg: any) => {
    setEditingPackage(pkg);
    setPackageForm({
      name: pkg.name,
      description: pkg.description || "",
      price: String(pkg.price),
      category: pkg.category || "General",
      image: pkg.image || "",
      includes: pkg.includes || []
    });
    setIsModalOpen(true);
  };

  const handleSubmitPackage = async () => {
    try {
      const url = editingPackage ? `/api/admin/packages/${editingPackage.id}` : "/api/admin/packages";
      const method = editingPackage ? "PATCH" : "POST";
      
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify({
          ...packageForm,
          price: Number(packageForm.price)
        })
      });

      if (res.ok) {
        toast({ title: "Success", description: `Package ${editingPackage ? "updated" : "created"} successfully` });
        setIsModalOpen(false);
        loadPackages();
      } else {
        const err = await res.json();
        toast({ title: "Error", description: err.message || "Operation failed", variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Error", description: "Something went wrong", variant: "destructive" });
    }
  };

  const handleDeletePackage = async (id: number) => {
    if (!confirm("Are you sure you want to delete this package?")) return;
    try {
      const res = await fetch(`/api/admin/packages/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      if (res.ok) {
        toast({ title: "Success", description: "Package deleted successfully" });
        loadPackages();
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete package", variant: "destructive" });
    }
  };

  const toggleTest = (testName: string) => {
    setPackageForm(prev => ({
      ...prev,
      includes: prev.includes.includes(testName)
        ? prev.includes.filter(t => t !== testName)
        : [...prev.includes, testName]
    }));
  };

  const filteredPackages = packages.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Health Packages</h1>
          <p className="text-slate-500 mt-1">Manage health checkup packages and pricing</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 gap-2" onClick={handleOpenAddModal}>
          <Plus className="w-4 h-4" />
          Add Package
        </Button>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingPackage ? "Edit Package" : "Create New Package"}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label>Package Name</Label>
              <Input 
                placeholder="e.g., Full Body Checkup" 
                value={packageForm.name}
                onChange={(e) => setPackageForm({ ...packageForm, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Input 
                placeholder="e.g., General" 
                value={packageForm.category}
                onChange={(e) => setPackageForm({ ...packageForm, category: e.target.value })}
              />
            </div>
            <div className="col-span-2 space-y-2">
              <Label>Description</Label>
              <Textarea 
                placeholder="Package description..." 
                value={packageForm.description}
                onChange={(e) => setPackageForm({ ...packageForm, description: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Price (₹)</Label>
              <Input 
                type="number" 
                placeholder="e.g., 2000" 
                value={packageForm.price}
                onChange={(e) => setPackageForm({ ...packageForm, price: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Image URL (optional)</Label>
              <Input 
                placeholder="https://example.com/image.jpg" 
                value={packageForm.image}
                onChange={(e) => setPackageForm({ ...packageForm, image: e.target.value })}
              />
            </div>
            <div className="col-span-2 space-y-3">
              <Label>Select Tests ({packageForm.includes.length} selected)</Label>
              <div className="grid grid-cols-2 gap-2 border rounded-md p-3 max-h-40 overflow-y-auto">
                {tests.map(test => (
                  <div key={test.id} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`test-${test.id}`} 
                      checked={packageForm.includes.includes(test.name)}
                      onCheckedChange={() => toggleTest(test.name)}
                    />
                    <label htmlFor={`test-${test.id}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      {test.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleSubmitPackage}>
              {editingPackage ? "Update Package" : "Create Package"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Card className="border-none shadow-sm bg-white">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input 
              placeholder="Search packages..." 
              className="pl-10 border-slate-200 focus-visible:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {loading ? (
          <p className="text-center py-12 text-slate-500">Loading packages...</p>
        ) : filteredPackages.length > 0 ? (
          filteredPackages.map((pkg) => (
            <Card key={pkg.id} className="border-none shadow-sm bg-white hover:shadow-md transition-all group">
              <CardContent className="p-4 flex flex-col md:flex-row items-start md:items-center gap-6">
                <div className="w-full md:w-32 h-24 rounded-lg bg-slate-100 flex items-center justify-center overflow-hidden shrink-0">
                  {pkg.image ? (
                    <img src={pkg.image} alt={pkg.name} className="w-full h-full object-cover" />
                  ) : (
                    <Package className="w-10 h-10 text-slate-200" />
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="text-lg font-bold text-slate-900">{pkg.name}</h3>
                    <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-100">Active</Badge>
                    <Badge variant="outline" className="text-slate-500 border-slate-200">{pkg.category}</Badge>
                  </div>
                  <p className="text-sm text-slate-500 line-clamp-2 mb-3">
                    {pkg.description}
                  </p>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <BadgeCheck className="w-3 h-3 text-emerald-500" />
                      {pkg.includes?.length || 0} tests included
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="font-bold text-blue-600 text-sm">₹{pkg.price}</span>
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end md:self-center">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-9 w-9 text-slate-400 hover:text-blue-600 hover:bg-blue-50"
                    onClick={() => handleOpenEditModal(pkg)}
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-9 w-9 text-slate-400 hover:text-red-600 hover:bg-red-50"
                    onClick={() => handleDeletePackage(pkg.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-200">
            <Package className="w-12 h-12 text-slate-200 mx-auto mb-4" />
            <p className="text-slate-500">No health packages found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
