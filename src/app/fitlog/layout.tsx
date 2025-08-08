import { ReactNode } from "react";
import Sidebar from "@/components/Sidebar";

export default function FitlogLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex bg-gradient-to-br from-[#1f1c2c] via-[#928dab] to-[#1f1c2c] text-white">
      <Sidebar />
      <main className="flex-1 m-3 rounded-2xl overflow-y-auto z-10 bg-[#0e031d]/60 backdrop-blur-xl text-white bg-opacity-80 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_0_rgba(100,0,255,0.35)]">
        {children}
      </main>
    </div>
  );
}
