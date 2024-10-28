'use client';

import { SidebarProvider } from "~/components/ui/sidebar";
import { ToastProvider, ToastViewport } from "~/components/ui/toast";
import { Toaster } from "~/components/ui/toaster";
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
const clientSecret = process.env.STRIPE_SECRET_KEY!;

export default function Providers({ children }: { children: React.ReactNode }) {

  return (
    <SidebarProvider defaultOpen={false}>
      <ToastProvider>
        {clientSecret &&
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            {children}
          </Elements>
        }
        <ToastViewport />
        <Toaster />
      </ToastProvider>
    </SidebarProvider>
  )
}