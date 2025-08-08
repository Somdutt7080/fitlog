// middleware.ts

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
   console.log("🛡 Middleware triggered on:", request.nextUrl.pathname);
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const protectedPaths = ["/fitlog/dashboard", "/fitlog/analytics", "/fitlog/mapview"];

  const pathIsProtected = protectedPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );

  if (pathIsProtected && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/fitlog/:path*"], // Jo bhi protect karna ho yahan pattern do
};
