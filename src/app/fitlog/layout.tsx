// src/app/fitlog/layout.tsx

import { ReactNode } from "react";
import Sidebar from "@/components/Sidebar";

export default function FitlogLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <main className="flex-1 bg-gradient-to-br from-white via-blue-50 to-purple-50 p-6">
        {children}
      </main>
    </div>
  );
}
