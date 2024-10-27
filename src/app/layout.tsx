import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { ToastProvider, ToastViewport } from "~/components/ui/toast";
import { Toaster } from "~/components/ui/toaster";

export const metadata: Metadata = {
  title: "article.ai",
  description: "AI-powered article generation",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body className="">
        <ToastProvider>
          {children}
          <ToastViewport />
          <Toaster />
        </ToastProvider>
      </body>
    </html>
  );
}
