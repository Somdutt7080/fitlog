// src/components/Sidebar.tsx

"use client";

import Link from "next/link";
import { Home, BarChart3, Map } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSession } from "next-auth/react";

export default function Sidebar() {
  const { data: session } = useSession();

  return (
    <aside className="w-64 bg-gradient-to-b from-blue-700 to-purple-700 text-white p-6 flex flex-col justify-between">
      <div>
        <h1 className="text-2xl font-bold mb-8">FitLog</h1>
        <nav className="space-y-8">
          <Link href="/fitlog/dashboard">
            <Button variant="ghost" className="w-full justify-start text-white gap-4">
              <Home className="w-4 h-4" /> Dashboard
            </Button>
          </Link>
          <Link href="/fitlog/analytics">
            <Button variant="ghost" className="w-full justify-start text-white gap-4">
              <BarChart3 className="w-4 h-4" /> Analytics
            </Button>
          </Link>
          <Link href="/fitlog/mapView">
            <Button variant="ghost" className="w-full justify-start text-white gap-4">
              <Map className="w-4 h-4" /> Map View
            </Button>
          </Link>
        </nav>
      </div>
      <div className="flex items-center gap-2">
        <Avatar>
          <AvatarImage src="/user.jpg" />
          <AvatarFallback>FL</AvatarFallback>
        </Avatar>
        <span className="text-sm">{session?.user?.name}</span>
      </div>
    </aside>
  );
}
