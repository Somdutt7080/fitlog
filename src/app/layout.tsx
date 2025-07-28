"use client";

import "./globals.css";
import { SessionProvider } from "next-auth/react";
import ReactQueryProvider from "@/lib/ReactQueryProvider";
import { Toaster } from "@/components/ui/sonner"; // ✅ Sonner import (from shadcn)

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          <ReactQueryProvider>
            {children}
            <Toaster position="top-right" richColors /> {/* ✅ Important */}
          </ReactQueryProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
