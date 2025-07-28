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
        className="border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500"
      />

      <input
        type="date"
        value={to}
        onChange={(e) => setTo(e.target.value)}
        className="border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500"
      />

      <button
        onClick={() => onFilter(type, from, to)}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition"
      >
        Apply Filter
      </button>
    </div>
  );
}
