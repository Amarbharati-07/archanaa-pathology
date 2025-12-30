import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { type Booking } from "@shared/schema";

export function useCreateBooking() {
  return useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/bookings", data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user/bookings"] });
      queryClient.invalidateQueries({ queryKey: ["/api/user/payments"] });
    },
  });
}
