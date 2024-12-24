'use client';

import { SidebarProvider } from "~/components/ui/sidebar";
import { ToastProvider, ToastViewport } from "~/components/ui/toast";
import { Toaster } from "~/components/ui/toaster";
import UserProvider from "~/components/user_context";

/**
* Wrapper component that integrates user, sidebar, and toast providers
* @example
* Providers({ children: <App /> })
* Returns the app wrapped in User, Sidebar, and Toast providers
* @param {{ children: React.ReactNode }} { children } - React node(s) to be wrapped with providers.
* @returns {JSX.Element} Returns a JSX element with the providers wrapping the children.
* @description
*   - Utilizes UserProvider for user-related data management.
*   - Uses SidebarProvider with the sidebar set to closed by default.
*   - Integrates ToastProvider to manage toast notifications.
*/
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