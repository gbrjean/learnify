import { getServerSession } from "next-auth";
import { authOptions } from "@app/api/auth/[...nextauth]/route";
import { CustomSession } from "@types";

export async function getCurrentUser(): Promise<CustomSession | null> {
  const session = await getServerSession(authOptions)

  return session as CustomSession
}