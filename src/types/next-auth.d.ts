// src/types/next-auth.d.ts

import NextAuth from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      [x: string]: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      id?: string;
      role?: "admin" | "user"; // ✅ Add this line
    };
  }

  interface User {
    id: string;
    role?: "admin" | "user"; // ✅ Add this line
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: "admin" | "user"; // ✅ Add this line
  }
}
