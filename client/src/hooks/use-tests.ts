import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";

export function useTests() {
  return useQuery({
    queryKey: [api.tests.list.path],
    queryFn: async () => {
      const res = await fetch(api.tests.list.path);
      if (!res.ok) throw new Error("Failed to fetch tests");
      return api.tests.list.responses[200].parse(await res.json());
    },
  });
}

export function useTest(id: number) {
  return useQuery({
    queryKey: [api.tests.get.path, id],
    queryFn: async () => {
      // In a real scenario, use buildUrl here. Since id is path param, simple substitution works
      const path = api.tests.get.path.replace(":id", String(id));
      const res = await fetch(path);
      if (!res.ok) throw new Error("Failed to fetch test");
      return api.tests.get.responses[200].parse(await res.json());
    },
    enabled: !!id,
  });
}
