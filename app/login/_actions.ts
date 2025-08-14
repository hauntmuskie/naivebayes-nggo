"use server";

import { cookies } from "next/headers";

export async function loginAction(formData: FormData) {
  const username = formData.get("username");
  const password = formData.get("password");

  const adminUsername = process.env.ADMIN_USERNAME;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (username === adminUsername && password === adminPassword) {
    const cookieStore = await cookies();
    cookieStore.set("auth-session", "admin", {
      path: "/",
      maxAge: 86400,
      httpOnly: true,
      sameSite: "lax",
      secure: true,
    });
    return { success: true };
  } else {
    return { success: false, error: "Username atau password tidak valid" };
  }
}
