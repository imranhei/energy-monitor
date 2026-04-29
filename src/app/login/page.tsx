"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { setCredentials } from "@/features/auth/authSlice";
import { apiKit, getApiErrorMessage } from "@/lib/api-kit";
import { useAppDispatch } from "@/store/hooks";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

type LoginResults = {
  refresh: string;
  access: string;
  user: {
    id: number;
    email: string;
    full_name: string;
    role: string;
    tenant: {
      id: number;
      name: string;
      short_code: string;
    };
  };
};

type LoginResponse = {
  status: "success";
  message: string;
  code: number;
  results: LoginResults;
};

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [email, setEmail] = useState("example@gmail.com");
  const [password, setPassword] = useState("12345678");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    console.log("Submitting login form with:");
    e.preventDefault();

    try {
      setLoading(true);

      const { data } = await apiKit.post<LoginResponse>("/auth/login/", {
        email,
        password,
      });

      dispatch(
        setCredentials({
          user: data.results.user,
          access: data.results.access,
          refresh: data.results.refresh,
        }),
      );

      toast.success(data.message || "Login successful");
      router.push("/dashboard");
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Login</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label>Password</Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <Button className="w-full" disabled={loading} type="submit">
              {loading ? "Logging in..." : "Login"}
            </Button>

            <p className="text-center text-sm">
              No account?{" "}
              <Link href="/register" className="font-medium underline">
                Register
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
