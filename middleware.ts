import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.AUTH_SECRET });
  const isAuth = !!token;
  const { pathname } = req.nextUrl;

  // Protect all /fitlog/* routes
  const isProtectedRoute = pathname.startsWith("/fitlog");

  // Block access to dashboard, analytics, mapview if not logged in
  if (isProtectedRoute && !isAuth) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  
  // If already logged in, redirect away from login page
  if (pathname === "/login" && isAuth) {
    return NextResponse.redirect(new URL("/fitlog/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/fitlog/:path*", "/login"],
};
