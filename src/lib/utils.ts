import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// ✅ Tailwind class name merger
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ✅ Calculates pace = time / distance
export function calculatePace(distance: number, duration: number): string {
  if (distance === 0 || duration === 0) return "0:00";

  const pace = duration / distance;
  const minutes = Math.floor(pace);
  const seconds = Math.round((pace - minutes) * 60);

  return `${minutes}:${seconds.toString().padStart(2, "0")} min/km`;
}
