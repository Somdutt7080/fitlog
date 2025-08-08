import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      [x: string]: string;
      gender: string;
      id: string;
      email: string;
      name: string;
      role: "user" | "admin";
      height?: number;
      weight?: number;
    };
  }

  interface User {
    id: string;
    name: string;
    email: string;
    role: "user" | "admin";
    gender?: string;
    dateOfBirth?: string;
    height?: number;
    weight?: number;
  }

  interface JWT {
    id: string;
    name: string;
    email: string;
    role: "user" | "admin";
    gender?: string;
    dateOfBirth?: string;
    height?: number;
    weight?: number;
  }
}
