"use client";
import { motion } from "framer-motion";

export default function FitLogLoader() {
  return (
    <div className="relative flex items-center justify-center h-screen overflow-hidden bg-gradient-to-br from-black via-gray-900 to-zinc-800 text-white">
      {/* Ambient blurred lights */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-[-15%] left-[-10%] w-[400px] h-[400px] bg-cyan-400/25 blur-[140px] rounded-full" />
        <div className="absolute bottom-[10%] right-[8%] w-[360px] h-[360px] bg-pink-500/25 blur-[140px] rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/5 blur-[180px] rounded-full" />
      </div>

      <h1 className="text-5xl font-extrabold tracking-wide flex items-center gap-1 text-white drop-shadow-xl">
        <span>F</span>
        <span>I</span>
        <span>T</span>
        <span>L</span>

        {/* Animated Glassy Gradient O */}
        <motion.span
          className="w-7 h-7 rounded-full backdrop-blur-md shadow-lg border border-white/20"
          style={{
            background: "linear-gradient(to right, #00b5ff, #ff2bb5)",
          }}
          animate={{
            scale: [1, 1.4, 1],
            opacity: [1, 0.6, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 1.6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <span>G...</span>
      </h1>
    </div>
  );
}
