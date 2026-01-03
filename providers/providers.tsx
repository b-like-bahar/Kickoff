import ReactQueryClientProvider from "./react-query-client-provider";
import { Toaster } from "@/components/ui/sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ReactQueryClientProvider>
      <Toaster />
      {children}
    </ReactQueryClientProvider>
  );
}
