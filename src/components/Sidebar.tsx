"use client";

import Link from "next/link";
import {
  Home,
  BarChart3,
  Map,
  UserCog,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { Menu } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

export default function Sidebar() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleLinkClick = (href: string) => {
    setOpen(false); // close mobile sidebar
    router.push(href);
  };

  return (
    <>
      {/* 🟣 Mobile Navbar */}
      <div className="md:hidden fixed top-0 left-0 flex items-center justify-between px-4 py-3 bg-[#0e031d]/80 border-b border-pink-500/20 sticky top-0 z-50">
        {/* ❌ Hide FitLog on mobile */}
        <div className="text-xl font-bold text-transparent select-none">.</div>
        <button
          onClick={() => setOpen(!open)}
          className="text-white focus:outline-none"
        >
          <Menu />
        </button>
      </div>

      {/* 🟣 Sidebar */}
      <aside
        className={`
          ${open ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}
          transition-all duration-300 ease-in-out overflow-hidden
          md:flex md:max-h-full md:opacity-100
          w-full md:w-64 bg-[#0e031d]/60 backdrop-blur-xl border-r border-pink-500/20 shadow-xl shadow-purple-900/20 p-4 flex-col justify-between z-50 md:static absolute top-[3.5rem] left-0
        `}
      >
        <div>
          {/* 🖥️ Logo (only on desktop) */}
          <div className="hidden md:flex items-center gap-3 mb-8">
            <div className="bg-gradient-to-r from-cyan-500 to-pink-500 p-2.5 rounded-2xl shadow-lg animate-logo-spin">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                className="text-white">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-wide drop-shadow-glow">
              FitLog
            </h1>
          </div>

          {/* Nav Links */}
          <nav className="space-y-2">
            <SidebarLink href="/fitlog/dashboard" icon={<Home className="w-4 h-4" />} label="Dashboard" onClick={handleLinkClick} />
            <SidebarLink href="/fitlog/analytics" icon={<BarChart3 className="w-4 h-4" />} label="Analytics" onClick={handleLinkClick} />
            <SidebarLink href="/fitlog/mapView" icon={<Map className="w-4 h-4" />} label="Map View" onClick={handleLinkClick} />
            <SidebarLink href="/fitlog/profile" icon={<UserCog className="w-4 h-4" />} label="Update Profile" onClick={handleLinkClick} />
          </nav>
        </div>

        {/* Profile Section */}
        <div className="flex items-center gap-3 mt-8 border-t border-white/10 pt-4">
          <Avatar className="border border-purple-400/40 shadow-md shadow-purple-500/10">
            <AvatarImage src="/user.jpg" />
            <AvatarFallback>FL</AvatarFallback>
          </Avatar>
          <div className="text-sm text-white">
            <p className="font-semibold">{session?.user?.name || "Guest"}</p>
            <Link
              href="/fitlog/profile"
              className="text-xs text-purple-400 hover:text-purple-300 underline transition"
            >
              Edit Profile
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}

function SidebarLink({
  href,
  icon,
  label,
  onClick,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  onClick: (href: string) => void;
}) {
  return (
    <Button
      variant="ghost"
      onClick={() => onClick(href)}
      className="w-full justify-start gap-3 px-3 py-2 text-white/90 hover:text-white rounded-lg hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white/30 transition-all duration-200"
    >
      {icon}
      <span className="text-sm font-medium">{label}</span>
    </Button>
  );
}
