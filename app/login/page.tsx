import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoginForm } from "./_components/login-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Masuk - Pengklasifikasi Naive Bayes",
  description: "Masuk untuk mengakses dasbor Pengklasifikasi Naive Bayes",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 p-4">
      {" "}
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
            Pengklasifikasi Naive Bayes
          </CardTitle>
          <p className="text-muted-foreground">
            Masuk untuk mengakses dasbor Anda
          </p>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </div>
  );
}
