"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { login } from "@/_actions/auth";

export function LoginForm() {
  const [state, action, pending] = useActionState(login, undefined);

  return (
    <form action={action} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="username">Nama Pengguna</Label>
        <Input
          id="username"
          name="username"
          type="text"
          placeholder="Masukkan nama pengguna Anda"
          required
          disabled={pending}
        />
        {state?.errors?.username && (
          <p className="text-sm text-red-500">{state.errors.username[0]}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Kata Sandi</Label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="Masukkan kata sandi Anda"
          required
          disabled={pending}
        />
        {state?.errors?.password && (
          <p className="text-sm text-red-500">{state.errors.password[0]}</p>
        )}
      </div>

      {state?.message && (
        <p className="text-sm text-red-500 text-center">{state.message}</p>
      )}

      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "Sedang masuk..." : "Masuk"}
      </Button>

      <div className="text-sm text-muted-foreground text-center">
        <p>Kredensial demo:</p>
        <p>
          Nama Pengguna: <strong>admin</strong>
        </p>
        <p>
          Kata Sandi: <strong>admin123</strong>
        </p>
      </div>
    </form>
  );
}
