'use client'

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useState } from "react"

// ⭐ Swiper (slider)
import { Swiper, SwiperSlide } from "swiper/react"
import { Pagination, Autoplay } from "swiper/modules"
import "swiper/css"
import "swiper/css/pagination"

export default function HomePage() {
  const [isLoggedIn] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-zinc-800 text-white relative overflow-hidden">

      {/* ─── Header ───────────────────────────────────── */}
 <header className="fixed top-4 left-1/2 transform -translate-x-1/2 w-[94%] 
  bg-black/30 backdrop-blur-2xl border border-white/10 
  shadow-[0_4px_30px_rgba(0,0,0,0.4)] rounded-2xl px-8 py-4 
  flex items-center justify-between z-50 transition-all duration-500">

  {/* Neon bottom border (subtle) */}
  <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-cyan-400 via-pink-400 to-purple-500 opacity-100 rounded-b-2xl"></div>

  {/* Logo */}
  <div className="flex items-center gap-3">
    <div className="bg-gradient-to-r from-cyan-500 to-pink-500 p-2.5 rounded-2xl shadow-lg 
  animate-logo-spin">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" 
        viewBox="0 0 24 24" fill="none" stroke="currentColor" 
        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        className="text-white">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    </div>
    <h1 className="text-3xl font-extrabold tracking-wide text-white">
      FitLog
    </h1>
  </div>

  {/* Nav Links */}
  <nav className="flex items-center gap-8">
    {isLoggedIn ? (
      <>
        <Link href="/dashboard">
          <span className="nav-link">Dashboard</span>
        </Link>
       
      </>
    ) : (
      <>
        <Link href="/login">
  <Button
    variant="ghost"
    className="relative overflow-hidden px-6 py-2 rounded-xl text-white font-semibold 
      bg-gradient-to-r from-cyan-500 to-pink-500 
      shadow-md transition-all duration-300 group"
  >
    <span className="relative z-10">Login</span>
    {/* Hover Glow */}
    <span className="absolute inset-0 bg-white/20 scale-0 group-hover:scale-100 rounded-xl blur-lg transition-transform duration-300"></span>
  </Button>
</Link>

      </>
    )}
  </nav>
</header>


      {/* ─── Hero Section ─────────────────────────────── */}
      <section className="text-center py-30 px-6 relative overflow-hidden">
        <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 items-center gap-12">
          
          {/* ⬅️ Left: Illustration */}
          <div className="relative order-2 lg:order-1 flex justify-center">
            <div className="absolute -inset-16 -z-10 bg-gradient-to-br from-cyan-400/30 via-pink-500/30 to-transparent blur-[180px] rounded-full" />
            <img
              src="https://illustrations.popsy.co/violet/stretching-girl.svg"
              alt="Fitness Illustration"
              className="w-full max-w-[620px] lg:max-w-[680px] mx-auto select-none pointer-events-none 
                        drop-shadow-[0_40px_120px_rgba(0,0,0,0.45)]
                        mix-blend-screen opacity-95 scale-105"
            />
          </div>

          {/* ➡️ Right: Heading + glossy para + slider + CTAs */}
          <div className="order-1 lg:order-2">
            <h2 className="text-5xl sm:text-6xl font-extrabold mb-6 leading-tight text-white tracking-tight drop-shadow-[0_1px_1px_rgba(255,255,255,0.1)]">
              Track <span className="text-cyan-400">Fitness</span>, Hit <span className="text-pink-400">Goals</span>
            </h2>

            <p className="text-lg sm:text-xl text-gray-200 max-w-2xl mx-auto tracking-wide leading-relaxed 
                          bg-clip-text text-transparent bg-gradient-to-r from-white/90 via-cyan-200/90 to-pink-200/90
                          drop-shadow-[0_2px_10px_rgba(255,255,255,0.15)] mb-10">
              Your ultimate platform for logging runs, tracking workouts, analyzing progress & staying consistent.
            </p>

            {/* 🔽 Feature Slider (bigger + autoplay + visible dots) */}
            <div className="mt-6">
              <Swiper
                modules={[Pagination, Autoplay]}
                slidesPerView={1}
                spaceBetween={28}
                loop
                autoplay={{ delay: 2500, disableOnInteraction: false }}
                pagination={{ clickable: true }}
                grabCursor
                autoHeight
                className="w-full max-w-xl mx-auto"
                // dots brighter via CSS variables (no global CSS needed)
                style={{
                  // @ts-ignore
                  "--swiper-pagination-color": "#ffffff",
                  "--swiper-pagination-bullet-inactive-color": "rgba(255,255,255,0.35)",
                  "--swiper-pagination-bullet-size": "10px",
                }}
              >
                {[
                  {
                    title: "🛡️ Authentication",
                    text: "Secure login with Google or Email. Access your dashboard anywhere, anytime.",
                    color: "text-blue-400"
                  },
                  {
                    title: "📍 Activity Tracker",
                    text: "Log your walks, runs & rides. Track pace, calories & distance on the go.",
                    color: "text-purple-400"
                  },
                  {
                    title: "📊 Analytics",
                    text: "Visualize your progress with charts, weekly summaries & AI-driven insights.",
                    color: "text-green-400"
                  }
                ].map((item, idx) => (
                  <SwiperSlide key={idx}>
                    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-10 shadow-lg border border-white/10 hover:shadow-xl transition text-left">
                      <h3 className={`text-2xl font-bold mb-3 ${item.color}`}>{item.title}</h3>
                      <p className="text-gray-300 text-base leading-relaxed">{item.text}</p>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>

            {/* ✅ CTA Buttons under slider */}
            <div className="flex justify-center gap-4 mt-8">
              <Link href="/signup">
               <Button
    variant="ghost"
    className="relative overflow-hidden px-6 py-2 rounded-xl text-white font-semibold 
      bg-gradient-to-r from-cyan-500 to-pink-500 
      shadow-md transition-all duration-300 group"
  >
    <span className="relative z-10">Get Staretd</span>
    {/* Hover Glow */}
    <span className="absolute inset-0 bg-white/20 scale-0 group-hover:scale-100 rounded-xl blur-lg transition-transform duration-300"></span>
  </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* 🌟 Stats strip (hero ke andar, bottom me) */}
        <div id="stats" className="max-w-7xl mx-auto mt-14 grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h4 className="text-3xl font-extrabold text-cyan-400">10K+</h4>
            <p className="text-gray-400 text-sm mt-1">Active Users</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h4 className="text-3xl font-extrabold text-pink-400">5M+</h4>
            <p className="text-gray-400 text-sm mt-1">Workouts Tracked</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h4 className="text-3xl font-extrabold text-green-400">4.9★</h4>
            <p className="text-gray-400 text-sm mt-1">User Rating</p>
          </div>
        </div>

        {/* Ambient Lights */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-[-10%] left-[-10%] w-[400px] h-[400px] bg-cyan-400 opacity-20 blur-[140px] rounded-full" />
          <div className="absolute bottom-[5%] right-[10%] w-[350px] h-[350px] bg-pink-500 opacity-20 blur-[140px] rounded-full" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/5 blur-[180px] rounded-full" />
        </div>
      </section>

      {/* ─── CTA Section (as-is, optional) ────────────── */}
  

      {/* ─── Footer ───────────────────────────────────── */}
      <footer className="relative mt-3 mx-4 rounded-t-3xl overflow-hidden
  bg-black/30 backdrop-blur-2xl border border-white/10 
  shadow-[0_8px_40px_rgba(0,0,0,0.35)]">

  {/* 🔹 Animated top gradient line */}
  <div className="absolute top-0 left-0 w-full h-[3px] animate-gradient-move
    bg-[linear-gradient(90deg,#22d3ee,#ec4899,#8b5cf6,#22d3ee)] bg-[length:200%_100%] opacity-80"></div>

  {/* Content */}
  <div className="px-6 md:px-10 py-10">
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-10">

      {/* Brand / About */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-pink-500 shadow-lg animate-logo-spin">
            {/* same icon as header */}
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              className="text-white">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </div>
          <span className="text-xl font-extrabold tracking-wide">FitLog</span>
        </div>
        <p className="text-sm text-gray-300/90 leading-relaxed">
          Track workouts, analyze progress, and stay consistent with a beautiful, fast dashboard.
        </p>

        {/* Socials */}
        <div className="flex items-center gap-3 pt-1">
          <a href="https://twitter.com" aria-label="Twitter" className="footer-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M22 5.8c-.7.3-1.5.6-2.3.7.8-.5 1.4-1.2 1.7-2.1-.7.5-1.6.8-2.5 1-1.5-1.6-4.1-1.2-5.2.7-.5.8-.6 1.8-.4 2.7-3.2-.2-6-1.7-7.9-4.1-.9 1.6-.5 3.6.9 4.6-.6 0-1.2-.2-1.7-.5 0 1.8 1.2 3.4 3 3.8-.5.2-1.1.2-1.6.1.5 1.6 2.1 2.7 3.8 2.8-1.5 1.2-3.4 1.8-5.3 1.6 1.9 1.2 4.1 1.9 6.3 1.9 7.6 0 11.9-6.4 11.6-12.1.8-.6 1.4-1.3 1.9-2.1z"/></svg>
          </a>
          <a href="https://github.com/Somdutt7080/fitlog" aria-label="GitHub" className="footer-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .5A11.5 11.5 0 0 0 .5 12a11.5 11.5 0 0 0 7.9 10.9c.6.1.8-.3.8-.6v-2c-3.2.7-3.9-1.4-3.9-1.4-.6-1.4-1.4-1.8-1.4-1.8-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1.1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.6-.3-5.3-1.3-5.3-5.9 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.6.1-3.3 0 0 1-.3 3.3 1.2a11.2 11.2 0 0 1 6 0C16.6 3.8 17.6 4 17.6 4c.6 1.7.2 3 .1 3.3.8.8 1.2 1.9 1.2 3.2 0 4.6-2.7 5.6-5.3 5.9.4.3.8 1 .8 2v3c0 .3.2.7.8.6A11.5 11.5 0 0 0 23.5 12 11.5 11.5 0 0 0 12 .5z"/></svg>
          </a>
          <a href="https://instagram.com" aria-label="Instagram" className="footer-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7zm5 3.5A5.5 5.5 0 1 1 6.5 13 5.5 5.5 0 0 1 12 7.5zm0 2A3.5 3.5 0 1 0 15.5 13 3.5 3.5 0 0 0 12 9.5zM18 6.8a1 1 0 1 1-1 1 1 1 0 0 1 1-1z"/></svg>
          </a>
        </div>
      </div>

      {/* Quick Links */}
      <div>
        <h4 className="text-white/90 font-semibold mb-3">Quick Links</h4>
        <ul className="space-y-2 text-gray-300/90">
          <li><a href="/" className="footer-link">Home</a></li>
          <li><a href="#features" className="footer-link">Features</a></li>
          <li><a href="/dashboard" className="footer-link">Dashboard</a></li>
          <li><a href="/signup" className="footer-link">Get Started</a></li>
        </ul>
      </div>

      {/* Resources */}
      <div>
        <h4 className="text-white/90 font-semibold mb-3">Resources</h4>
        <ul className="space-y-2 text-gray-300/90">
          <li><a href="#" className="footer-link">Docs (soon)</a></li>
          <li><a href="#" className="footer-link">Support</a></li>
          <li><a href="#" className="footer-link">Privacy</a></li>
          <li><a href="#" className="footer-link">Terms</a></li>
        </ul>
      </div>

      {/* Tiny CTA */}
      <div className="lg:col-span-1 md:col-span-3">
        <h4 className="text-white/90 font-semibold mb-3">Ready to level up?</h4>
        <p className="text-gray-300/90 text-sm mb-4">Create your account and start tracking in minutes.</p>
        <Link href="/signup" className="inline-block">
          <span className="relative inline-flex items-center gap-2 px-5 py-3 rounded-xl 
            bg-gradient-to-r from-cyan-500 to-pink-500 text-white font-semibold 
            shadow-lg hover:opacity-90 transition">
            Get Started
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M13 5l7 7-7 7M5 12h14"/></svg>
          </span>
        </Link>
      </div>
    </div>

    {/* Divider */}
    <div className="mt-8 border-t border-white/10"></div>

    {/* Bottom bar */}
    <div className="flex flex-col md:flex-row items-center justify-between gap-3 pt-4">
      <p className="text-gray-400 text-sm">
        © {new Date().getFullYear()} FitLog — Built with 💙 for fitness lovers.
      </p>
      <div className="flex items-center gap-4 text-xs text-gray-400">
        <a href="#" className="footer-link">Privacy Policy</a>
        <span className="opacity-40">•</span>
        <a href="#" className="footer-link">Terms of Service</a>
      </div>
    </div>
  </div>
</footer>

    </div>
  )
}
