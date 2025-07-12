import { z } from "zod";

export const LoginFormSchema = z.object({
  username: z.string().min(1, { message: "Username is required." }).trim(),
  password: z.string().min(1, { message: "Password is required." }).trim(),
});

export type FormState =
  | {
      errors?: {
        username?: string[];
        password?: string[];
      };
      message?: string;
    }
  | undefined;

export type SessionData = {
  userId: string;
  username: string;
  role: string;
};

export type User = {
  id: string;
  username: string;
  name: string;
  email: string;
  role: string;
};
