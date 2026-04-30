"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { setCredentials } from "@/features/auth/authSlice";
import { apiKit, getApiErrorMessage } from "@/lib/api-kit";
import { useAppDispatch } from "@/store/hooks";
import type { User } from "@/types";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { toast } from "sonner";

type LoginResults = {
  refresh: string;
  access: string;
  user: User;
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

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
          <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="new-email" type="email"
                    name="tenant_admin_email" placeholder="admin@dj.com" required />
            </div>

            <div className="space-y-2">
              <Label>Password</Label>

              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-10"
                  autoComplete="new-password"
                  name="tenant_admin_password"
                  placeholder="••••••••"
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
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
