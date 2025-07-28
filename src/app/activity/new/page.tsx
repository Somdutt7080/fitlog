// ✅ app/activity/new/page.tsx
"use client"
import dynamic from "next/dynamic";

// Dynamically load client component
const NewActivityClient = dynamic(() => import("./NewActivityClient"), {
  ssr: false,
});

export default function Page() {
  return <NewActivityClient />;
}
