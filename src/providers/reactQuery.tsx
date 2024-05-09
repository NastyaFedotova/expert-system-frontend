'use client';
import { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
      gcTime: 5 * 60 * 1000,
      retry: false,
    },
  },
});

export const ReactQueryProvider = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider client={queryClient}>
    {children}
    <ReactQueryDevtools buttonPosition="bottom-left" />
  </QueryClientProvider>
);
