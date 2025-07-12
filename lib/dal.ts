import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { decrypt } from "./session";

export const verifySession = cache(async () => {
  const cookie = (await cookies()).get("session")?.value;
  const session = await decrypt(cookie);

  if (!session?.userId) {
    redirect("/login");
  }

  return {
    isAuth: true,
    userId: session.userId,
    username: session.username,
  };
});

export const getUser = cache(async () => {
  const session = await verifySession();
  if (!session) return null;

  try {
    const userData = {
      id: session.userId,
      username: session.username,
      role: "admin",
      name: session.username,
      email: `${session.username}@admin.local`,
    };

    return userData;
  } catch (error) {
    console.log("Failed to fetch user");
    return null;
  }
});

export const isAuthenticated = cache(async () => {
  try {
    const cookie = (await cookies()).get("session")?.value;
    const session = await decrypt(cookie);
    return !!session?.userId;
  } catch {
    return false;
  }
});

export async function getProfileDTO() {
  const currentUser = await getUser();

  if (!currentUser) return null;

  return {
    username: currentUser.username,
    name: currentUser.name,
    role: currentUser.role,
  };
}
