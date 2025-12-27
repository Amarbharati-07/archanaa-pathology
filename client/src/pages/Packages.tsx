import { usePackages } from "@/hooks/use-packages";
import { PackageCard } from "@/components/PackageCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { HeartPulse } from "lucide-react";

export default function Packages() {
  const { data: packages, isLoading } = usePackages();

  const categories = ["All", "General Wellness", "Women Health", "Senior Citizen", "Diabetes"];

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <div className="bg-primary/5 border-b py-16">
        <div className="container mx-auto px-4 text-center">
          <span className="inline-block p-3 bg-white rounded-2xl shadow-sm mb-6">
            <HeartPulse className="w-8 h-8 text-primary" />
          </span>
          <h1 className="font-display font-bold text-4xl md:text-5xl mb-6">Health Packages</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Choose from our carefully curated health checkup packages designed to keep you and your family healthy.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <Tabs defaultValue="All" className="w-full">
          <div className="flex justify-center mb-12 overflow-x-auto pb-4">
            <TabsList className="h-auto p-1 bg-white border shadow-sm rounded-full">
              {categories.map((cat) => (
                <TabsTrigger 
                  key={cat} 
                  value={cat}
                  className="rounded-full px-6 py-3 text-base data-[state=active]:bg-primary data-[state=active]:text-white"
                >
                  {cat}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {categories.map((cat) => (
            <TabsContent key={cat} value={cat}>
              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-[500px] bg-white rounded-2xl shadow-sm border p-6 flex flex-col gap-4">
                      <Skeleton className="h-8 w-3/4 mx-auto" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-32 w-full rounded-xl" />
                      <Skeleton className="h-10 w-full mt-auto" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {packages
                    ?.filter(p => cat === "All" || p.category.includes(cat) || (cat === "General Wellness" && !p.category)) // loose matching for demo
                    .map((pkg) => (
                      <PackageCard key={pkg.id} pkg={pkg} />
                    ))}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}
