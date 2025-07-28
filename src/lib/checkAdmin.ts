// lib/checkAdmin.ts
import { getServerSession } from "next-auth";
import { authOptions } from "./auth";

export async function checkAdmin() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return { status: 401, error: "Unauthorized", session: null };
  }

  if (session.user.email !== "admin@gmail.com") {
    return { status: 403, error: "Forbidden", session: null };
  }

  return { status: 200, session };
}
