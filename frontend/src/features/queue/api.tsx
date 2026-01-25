import { api } from "@/lib/api";
import { API_RESPONSE } from "@/lib/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { MyQueue } from "./types";
import { DEFAULT_GC_TIME, DEFAULT_STALE_TIME } from "@/contants";

export async function createQueue(albumName: string): Promise<string> {
  const req = await api.post<API_RESPONSE<null>>("/queue", { albumName });
  return req.data.message;
}

export async function myQueue(): Promise<MyQueue[]> {
  const req = await api.get<API_RESPONSE<MyQueue[]>>("/queue");
  return req.data.data;
}

export function useCreateQueue(albumName: string) {
  return useMutation({
    mutationKey: ["queue", albumName],
    mutationFn: () => createQueue(albumName),
    onSuccess: (ctx) => {
      return toast.success(ctx);
    },
  });
}

export function useMyQueue() {
  return useQuery({
    queryKey: ["myqueue"],
    queryFn: () => myQueue(),
    gcTime: DEFAULT_GC_TIME,
    staleTime: DEFAULT_STALE_TIME,
  });
}
