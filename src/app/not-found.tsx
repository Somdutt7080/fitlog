// app/not-found/page.tsx
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-white via-blue-50 to-purple-50 p-6">
      <div className="bg-white rounded-xl shadow-lg p-10 text-center max-w-md">
        <div className="flex items-center justify-center text-yellow-500 mb-4">
          <AlertTriangle className="w-12 h-12" />
        </div>
        <h1 className="text-4xl font-bold text-blue-700 mb-2">404 – Not Found</h1>
        <p className="text-gray-600 mb-6">
          Oops! The page you are looking for doesn’t exist or has been moved.
        </p>
        <Link href="/dashboard">
          <Button className="bg-blue-600 text-white hover:bg-blue-700">
            ← Back to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
}
