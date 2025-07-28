// ✅ app/activity/new/NewActivityClient.tsx
"use client";

import NewActivityPage from "@/components/NewActivity"; // yahi form hai jo tu use kar rha

export default function NewActivityClient() {
  const handleSuccess = () => {
    console.log("✅ Activity saved successfully");
    // Toast ya redirect bhi yahi se kar sakta hai
  };

  return <NewActivityPage isModal={false} onSuccess={handleSuccess} />;
}
