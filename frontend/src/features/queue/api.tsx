import { api } from "@/lib/api";
import { ApiResponse } from "@/lib/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { MyQueue } from "./types";
import { DEFAULT_GC_TIME, DEFAULT_STALE_TIME } from "@/contants";

type CreateQueue = {
  songs: {
    id: string
  }[]
}

export async function createQueue({ data }: { data: CreateQueue }): Promise<string> {
  const req = await api.post<ApiResponse<null>>("/queues", data);
  return req.data.message;
}

export async function myQueue(): Promise<MyQueue[]> {
  const req = await api.get<ApiResponse<MyQueue[]>>("/queues");
  return req.data.data;
}

export function useCreateQueue(data: CreateQueue) {
  return useMutation({
    mutationKey: ["queue", data],
    mutationFn: () => createQueue({ data }),
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
