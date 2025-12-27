import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";

export function usePackages() {
  return useQuery({
    queryKey: [api.packages.list.path],
    queryFn: async () => {
      const res = await fetch(api.packages.list.path);
      if (!res.ok) throw new Error("Failed to fetch packages");
      return api.packages.list.responses[200].parse(await res.json());
    },
  });
}

export function usePackage(id: number) {
  return useQuery({
    queryKey: [api.packages.get.path, id],
    queryFn: async () => {
      const path = api.packages.get.path.replace(":id", String(id));
      const res = await fetch(path);
      if (!res.ok) throw new Error("Failed to fetch package");
      return api.packages.get.responses[200].parse(await res.json());
    },
    enabled: !!id,
  });
}
