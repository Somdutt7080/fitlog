'use client'

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useState } from "react"

export default function HomePage() {
  //  session later
  const [isLoggedIn] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-purple-50">
      
      {/* ─── Header ───────────────────────────────────── */}
     <header className="flex items-center justify-between px-8 py-4 bg-white shadow-md">
  {/* Left: Logo + Brand */}
  <div className="flex items-center gap-3">
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-xl shadow">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-white"
      >
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    </div>
    <h1 className="text-xl font-bold text-blue-700 tracking-wide">FitLog</h1>
  </div>

  {/* Center: Fitness Emoji or Tagline */}
  <div className="hidden md:block text-2xl">🏃‍♂️</div>

  {/* Right: Auth or User Avatar */}
  <nav className="flex items-center gap-4">
    {isLoggedIn ? (
      <>
        <Link href="/dashboard">
          <Button variant="ghost">Dashboard</Button>
        </Link>
        <Avatar>
          <AvatarImage src="/user.jpg" />
          <AvatarFallback>FL</AvatarFallback>
        </Avatar>
      </>
    ) : (
      <>
        <Link href="/login">
          <Button variant="outline">Login</Button>
        </Link>
        <Link href="/signup">
          <Button>Sign Up</Button>
        </Link>
      </>
    )}
  </nav>
</header>


      {/* ─── Hero Section ─────────────────────────────── */}
      <section className="text-center py-20 px-6">
        <h2 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-4 leading-tight">
          Track your Fitness. Achieve your Goals.
        </h2>
        <p className="text-lg text-gray-500 max-w-xl mx-auto mb-8">
          FitLog is your personal fitness tracker for logging runs, analyzing progress, and visualizing performance.
        </p>
        <Link href="/dashboard">
          <Button className="text-lg px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow">
            Start Tracking Now
          </Button>
        </Link>
      </section>

      {/* ─── Features Section ─────────────────────────── */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-6 py-10">
        <div className="bg-white rounded-xl p-6 shadow hover:shadow-lg transition">
          <h3 className="text-xl font-semibold text-blue-700 mb-2">🛡️ Authentication</h3>
          <p className="text-gray-600 text-sm">Login with Google or email. Securely access your personal fitness dashboard.</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow hover:shadow-lg transition">
          <h3 className="text-xl font-semibold text-purple-700 mb-2">📍 Activity Tracker</h3>
          <p className="text-gray-600 text-sm">Add walks, runs or rides with routes, pace, distance, and duration.</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow hover:shadow-lg transition">
          <h3 className="text-xl font-semibold text-green-700 mb-2">📊 Analytics</h3>
          <p className="text-gray-600 text-sm">Beautiful charts, weekly progress, calories burned & more.</p>
        </div>
      </section>

      {/* ─── CTA Section ──────────────────────────────── */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center py-14 px-6 mt-12 rounded-t-3xl">
        <h2 className="text-3xl font-bold mb-4">Set your goals. Track your progress.</h2>
        <p className="mb-6">Join thousands of users on their journey to better health.</p>
        <Link href="/signup">
          <Button variant="secondary" className="text-blue-600 bg-white hover:bg-gray-100 px-6 py-3 text-lg font-semibold rounded-lg">
            Create Your Account
          </Button>
        </Link>
      </section>

      {/* ─── Footer ───────────────────────────────────── */}
      <footer className="text-center text-gray-500 py-6 text-sm">
        © {new Date().getFullYear()} FitLog. Built with 💙 for fitness lovers.
      </footer>
    </div>
  )
}
