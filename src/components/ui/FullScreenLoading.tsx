"use client";
import { motion } from "framer-motion";

export default function FitLogLoader() {
  return (
    <div className="flex items-center justify-center h-screen bg-[#f9fbff]">
      <h1 className="text-5xl font-extrabold tracking-wide flex items-center gap-1 text-gray-800">
        <span className="text-gray-800">F</span>
        <span className="text-gray-800">I</span>
        <span className="text-gray-800">T</span>
        <span className="text-gray-800">L</span>

        {/* Animated O with gradient */}
        <motion.span
          className="w-7 h-7 rounded-full shadow-md"
          style={{
            background: "linear-gradient(to right, #5b2be0, #00b5ff)",
          }}
          animate={{
            scale: [1, 1.4, 1],
            opacity: [1, 0.5, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 1.6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <span className="text-gray-800">G...</span>
      </h1>
    </div>
  );
}
