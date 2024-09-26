"use client";
import React from "react";
import { ReactNode } from "react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 100, // 10 minutos
      refetchOnWindowFocus: false, // Evitar refetch ao focar a janela
    },
  },
});
export default function Provider({ children }: { children: ReactNode }) {
  // const [queryCleint] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
