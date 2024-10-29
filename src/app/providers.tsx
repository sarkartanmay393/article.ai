'use client';

import { SidebarProvider } from "~/components/ui/sidebar";
import { ToastProvider, ToastViewport } from "~/components/ui/toast";
import { Toaster } from "~/components/ui/toaster";
import UserProvider from "~/components/user_context";

export default function Providers({ children }: { children: React.ReactNode }) {

  return (
    <UserProvider>
      <SidebarProvider defaultOpen={false}>
        <ToastProvider>
          {children}
          <ToastViewport />
          <Toaster />
        </ToastProvider>
      </SidebarProvider>
    </UserProvider>
  )
}