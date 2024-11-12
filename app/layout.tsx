import type { Metadata } from "next";

import "./globals.css";
import Nav from "@/components/navigation/nav";
import { cn } from "@/lib/utils";
import { Inter, Roboto, Roboto_Serif } from "next/font/google";
import { SessionProvider } from "next-auth/react"
import { ThemeProvider } from "@/components/providers/theme.providers";
import Toaster from "@/components/ui/toast";


const roboto = Roboto({ weight: ["400", '500', '700', '900'], subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sprout & Scribble",
  description: "Created By Muhammad Bin Abdul Latif",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <SessionProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          className={cn('px-6 md:px-12 max-w-[1440px] mx-auto', `${roboto.className}`)}
        >
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <Nav />
            <Toaster />
            {children}
          </ThemeProvider>
        </body>
      </html>
    </SessionProvider>
  );
}