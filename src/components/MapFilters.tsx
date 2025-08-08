"use client";

import { useState } from "react";

export default function Filters({
  onFilter,
}: {
  onFilter: (type: string, from: string, to: string) => void;
}) {
  const [type, setType] = useState("All");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  return (
    <div className="flex flex-wrap gap-3">
      <select
        value={type}
        onChange={(e) => setType(e.target.value)}
        className="border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500"
      >
        <option value="All">All</option>
        <option value="Run">Run</option>
        <option value="Walk">Walk</option>
        <option value="Cycle">Cycle</option>
      </select>

      <input
        type="date"
        value={from}
        onChange={(e) => setFrom(e.target.value)}
        className="bg-black/50 border border-white/20 text-white rounded-xl px-4 py-2 backdrop-blur-md shadow-inner focus:outline-none focus:ring-2 focus:ring-cyan-400 w-full md:w-auto 
             [&::-webkit-calendar-picker-indicator]:invert"
      />

      <input
        type="date"
        value={to}
        onChange={(e) => setTo(e.target.value)}
        className="bg-black/50 border border-white/20 text-white rounded-xl px-4 py-2 backdrop-blur-md shadow-inner focus:outline-none focus:ring-2 focus:ring-cyan-400 w-full md:w-auto 
             [&::-webkit-calendar-picker-indicator]:invert"
      />

      <button
        onClick={() => onFilter(type, from, to)}
        className="bg-gradient-to-r from-cyan-400 to-pink-500 text-white font-semibold px-6 py-2 rounded-xl shadow-lg hover:opacity-90 transition-all w-full md:w-auto flex items-center justify-center gap-2"
      >
        Apply Filter
      </button>
    </div>
  );
}
