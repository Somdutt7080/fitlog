// ✅ app/activity/new/NewActivityClient.tsx
"use client";

import NewActivityPage from "@/components/NewActivity"; // yahi form hai jo tu use kar rha


export default function NewActivityClient({ isModal = false }: { isModal?: boolean }) {
  const handleSuccess = () => {
    console.log("✅ Activity saved successfully");
    // Toast ya redirect bhi yahi se kar sakta hai
  };

  return <NewActivityPage isModal={isModal} onSuccess={handleSuccess} />;
}
