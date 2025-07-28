// lib/fetchActivities.ts
export async function fetchActivities() {
  const res = await fetch("/api/activity"); // ✅ Client-side fetch
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json(); // Make sure this is not double .json()
}
