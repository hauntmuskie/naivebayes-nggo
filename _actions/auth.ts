"use server";

import { redirect } from "next/navigation";
import { createSession, deleteSession } from "@/lib/session";
import { LoginFormSchema, type FormState } from "@/lib/definitions";

const VALID_CREDENTIALS = {
  username: "admin",
  password: "admin123",
};

export async function login(
  state: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = LoginFormSchema.safeParse({
    username: formData.get("username"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { username, password } = validatedFields.data;

  if (
    username !== VALID_CREDENTIALS.username ||
    password !== VALID_CREDENTIALS.password
  ) {
    return {
      message: "Invalid username or password",
    };
  }

  await createSession("admin-user", username);

  redirect("/");
}

export async function logout() {
  await deleteSession();
  redirect("/login");
}
