import { SidebarProvider } from "~/components/ui/sidebar";
import { ToastProvider, ToastViewport } from "~/components/ui/toast";
import { Toaster } from "~/components/ui/toaster";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider defaultOpen={false}>
      <ToastProvider>
        {children}
        <ToastViewport />
        <Toaster />
      </ToastProvider>
    </SidebarProvider>
  )
}