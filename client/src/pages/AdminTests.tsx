import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Microscope, Search, Plus, FileText, LayoutGrid, List, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

export default function AdminTests() {
  const { adminToken } = useAuth();
  const { toast } = useToast();
  const [tests, setTests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    loadTests();
  }, []);

  const loadTests = async () => {
    try {
      const res = await fetch("/api/tests");
      if (res.ok) {
        setTests(await res.json());
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to load tests", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const categories = ["All", ...Array.from(new Set(tests.map(t => t.category)))];

  const filteredTests = tests.filter(t => 
    (activeCategory === "All" || t.category === activeCategory) &&
    (t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
     t.category.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Tests</h1>
          <p className="text-slate-500 mt-1">Manage test catalog and parameters</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 gap-2">
          <Plus className="w-4 h-4" />
          Add Test
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <Card className="flex-1 border-none shadow-sm bg-white">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input 
                placeholder="Search by test name or category..." 
                className="pl-10 border-slate-200 focus-visible:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>
        
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={activeCategory === cat ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveCategory(cat)}
              className={activeCategory === cat ? "bg-blue-600" : "border-slate-200 text-slate-600 bg-white"}
            >
              {cat}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <p className="col-span-full text-center py-12 text-slate-500">Loading tests...</p>
        ) : filteredTests.length > 0 ? (
          filteredTests.map((test) => (
            <Card key={test.id} className="border-none shadow-sm bg-white hover:shadow-md transition-all group overflow-hidden">
              <div className="h-32 bg-slate-100 relative overflow-hidden">
                {test.image ? (
                  <img src={test.image} alt={test.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Microscope className="w-12 h-12 text-slate-200" />
                  </div>
                )}
                <Badge className="absolute top-2 right-2 bg-white/90 text-slate-900 backdrop-blur-sm border-none shadow-sm">
                  {test.category}
                </Badge>
              </div>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{test.name}</h3>
                  <span className="text-blue-600 font-bold">₹{test.price}</span>
                </div>
                <p className="text-sm text-slate-500 line-clamp-2 mb-4 h-10">
                  {test.description}
                </p>
                <div className="flex items-center justify-between text-xs text-slate-400 border-t pt-4">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {test.reportTime}
                  </span>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <FileText className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-12 bg-white rounded-xl border border-dashed border-slate-200">
            <Microscope className="w-12 h-12 text-slate-200 mx-auto mb-4" />
            <p className="text-slate-500">No tests found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
