import { useTests } from "@/hooks/use-tests";
import { TestCard } from "@/components/TestCard";
import { Input } from "@/components/ui/input";
import { Search, Filter, Beaker } from "lucide-react";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Tests() {
  const { data: tests, isLoading } = useTests();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  const categories = useMemo(() => {
    if (!tests) return [];
    const cats = new Set(tests.map(t => t.category));
    return Array.from(cats);
  }, [tests]);

  const filteredTests = useMemo(() => {
    if (!tests) return [];
    return tests.filter(t => {
      const matchesSearch = t.name.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category === "all" || t.category === category;
      return matchesSearch && matchesCategory;
    });
  }, [tests, search, category]);

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <div className="bg-white border-b py-12">
        <div className="container mx-auto px-4">
          <h1 className="font-display font-bold text-4xl mb-4">Diagnostic Tests</h1>
          <p className="text-muted-foreground text-lg max-w-2xl">Explore our comprehensive range of diagnostic tests. Search by name or filter by category.</p>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-8">
        {/* Filter Bar */}
        <div className="bg-white rounded-xl shadow-lg p-4 flex flex-col md:flex-row gap-4 items-center mb-8 border border-slate-100">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input 
              placeholder="Search tests..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 h-12 text-lg border-slate-200"
            />
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-[180px] h-12">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(c => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button size="lg" className="h-12 px-6">
              Search
            </Button>
          </div>
        </div>

        {/* Results */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border h-[300px] flex flex-col gap-4">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
                <div className="mt-auto flex justify-between items-center">
                   <Skeleton className="h-8 w-20" />
                   <Skeleton className="h-10 w-28" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredTests.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl shadow-sm border">
            <Beaker className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-muted-foreground">No tests found</h3>
            <p className="text-muted-foreground/70">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTests.map((test) => (
              <TestCard key={test.id} test={test} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
