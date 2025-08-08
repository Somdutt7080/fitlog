'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-black via-gray-900 to-zinc-800 text-white">
      {/* Ambient Lights */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-[-12%] left-[-10%] w-[420px] h-[420px] bg-cyan-400/25 blur-[140px] rounded-full" />
        <div className="absolute bottom-[6%] right-[8%] w-[380px] h-[380px] bg-pink-500/25 blur-[150px] rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[620px] h-[620px] bg-white/5 blur-[200px] rounded-full" />
      </div>

      {/* Center Content */}
      <div className="flex flex-col items-center justify-center h-screen px-6 text-center">
        <div className="bg-white/10 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.35)] p-10 sm:p-14 max-w-md">
          <div className="flex justify-center mb-4 text-yellow-400">
            <AlertTriangle className="w-12 h-12" />
          </div>
          <h1 className="text-4xl font-extrabold text-white mb-2">404 – Not Found</h1>
          <p className="text-gray-300 mb-6">
            Oops! The page you are looking for doesn’t exist or has been moved.
          </p>
          <Link href="/fitlog/dashboard">
            <Button
              className="w-full bg-gradient-to-r from-cyan-500 to-pink-500 text-white hover:brightness-110 transition duration-300"
            >
              ← Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
