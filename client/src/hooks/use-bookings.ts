import { useMutation } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { type InsertBooking } from "@shared/schema";

export function useCreateBooking() {
  return useMutation({
    mutationFn: async (data: InsertBooking) => {
      const res = await fetch(api.bookings.create.path, {
        method: api.bookings.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        if (res.status === 400) {
           const error = await res.json();
           throw new Error(error.message || "Validation failed");
        }
        throw new Error("Failed to create booking");
      }
      
      return api.bookings.create.responses[201].parse(await res.json());
    },
  });
}
