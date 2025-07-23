'use client';

import { useEffect } from 'react';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    console.error("App Error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-blue-50 to-purple-50 px-6">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl w-full text-center space-y-6 border border-blue-100">
        
    

        <h1 className="text-3xl font-bold text-blue-700 flex justify-center items-center gap-2">
          <AlertTriangle className="text-red-500" size={32} />
          Oops! Something went wrong
        </h1>

        <p className="text-gray-600">
          An unexpected error occurred. Please try again or return to your dashboard.
        </p>

        <code className="block text-gray-400 text-sm italic truncate max-w-md mx-auto">
          {error.message}
        </code>

        <div className="flex justify-center gap-4 pt-4">
          <Button onClick={reset} className="bg-blue-600 text-white hover:bg-blue-700">
            Retry
          </Button>
          <Link href="/dashboard">
            <Button variant="outline">Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
