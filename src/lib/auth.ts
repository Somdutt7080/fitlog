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

  // 👇 सिर्फ ये line बदली है (type cast)
  const user = (await UserModel.findOne({ email }));

  if (!user) throw new Error("Invalid email");

  const ok = await compare(password, user.password);
  if (!ok) throw new Error("Invalid password");

  return {
    id: user._id.toString(),
    email: user.email,
    name: user.fullName,
    role: user.role ?? "user",
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
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role; // ✅ add role to token
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.id as string;
        session.user.role = token.role as "admin" | "user"; // ✅ add role to session
      }
      return session;
    },
  },
  secret: process.env.AUTH_SECRET,
};