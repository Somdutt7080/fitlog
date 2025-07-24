"use client"; // 👈 Yeh zaruri hai

import "./globals.css";
import { SessionProvider } from "next-auth/react"; // 👈 Yeh import karna hai


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <SessionProvider> 
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
