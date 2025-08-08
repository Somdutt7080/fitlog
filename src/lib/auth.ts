import Credentials from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { UserModel , } from "@/app/models/user";
import { dbConnect } from "@/lib/dbConnect";
import type { AuthOptions } from "next-auth";

export const authOptions: AuthOptions = {
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
     async authorize(credentials) {
  await dbConnect();

  const email = credentials?.email?.toLowerCase().trim();
  const password = credentials?.password ?? "";

  if (!email || !password) throw new Error("Email and password are required");

  
  const user = (await UserModel.findOne({ email }));

  if (!user) throw new Error("Invalid email");

  const ok = await compare(password, user.password);
  if (!ok) throw new Error("Invalid password");

  return {
    id: user._id.toString(),
    email: user.email,
    name: user.fullName,
    role: user.role ?? "user",
    gender: user.gender,
  dateOfBirth: user.dateOfBirth,
  height: user.height,
  weight: user.weight
  };
}

    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
   async jwt({ token, user, trigger, session }) {
  if (user) {
     console.log("🔵 Initial JWT from login:", user);
    token.id = user.id;
    token.role = (user as any).role;
    token.gender = (user as any).gender;
    token.dateOfBirth = (user as any).dateOfBirth;
    token.height = (user as any).height;
    token.weight = (user as any).weight;
    token.name = user.name; // Add this if name should be synced too
  }

  // 🔁 When update() is called, pull from session and overwrite token
  if (trigger === "update" && session) {
     console.log("🔁 JWT Update Trigger:", session);
    token.name = session.fullName;
    token.gender = session.gender;
    token.dateOfBirth = session.dateOfBirth;
    token.height = session.height;
    token.weight = session.weight;
  }

  return token;
},
    async session({ session, token }) {
      console.log("🟢 SESSION CALLBACK:", { session, token });
      if (session.user && token) {
        session.user.id = token.id as string;
         session.user.name = token.name as string;
        session.user.role = token.role as "admin" | "user"; // ✅ add role to session
        session.user.gender = token.gender as string;
    session.user.dateOfBirth = token.dateOfBirth as string;
    session.user.height = token.height as number;
    session.user.weight = token.weight as number;
      }
      return session;
    },
  },
  secret: process.env.AUTH_SECRET,
};