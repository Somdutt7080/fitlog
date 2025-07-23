// src/types/next-auth.d.ts

import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      id?: string; // ✅ important hai
    };
  }

  interface User {
    id: string; // ✅ Optional: agar user.id directly use karni ho to 
  }
}
