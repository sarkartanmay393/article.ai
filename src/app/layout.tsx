import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "article.ai",
  description: "AI-powered article generation",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {

  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body className="">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
