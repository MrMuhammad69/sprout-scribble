import type { Metadata } from "next";

import "./globals.css";
import Nav from "@/components/navigation/nav";
import { cn } from "@/lib/utils";
import { Inter } from "next/font/google";
import { SessionProvider } from "next-auth/react"
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionProvider>
      <html lang="en">
        <body
          className={cn('px-6 md:px-12 max-w-7xl mx-auto', `${inter.className}`)}
        >
          <Nav />
          {children}
        </body>
      </html>
    </SessionProvider>
  );
}