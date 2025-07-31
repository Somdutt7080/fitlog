"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

import { loginSchema } from "@/lib/schema/login";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import FullScreenLoader from "@/components/ui/FullScreenLoading";

const initialFormData = {
  email: "",
  password: "",
};

type FieldErrors = {
  email?: string;
  password?: string;
};

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState(initialFormData);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const validateField = (name: string, value: string) => {
    const updatedData = { ...formData, [name]: value };
    const result = loginSchema.safeParse(updatedData);

    if (!result.success) {
      const issue = result.error.issues.find((i) => i.path[0] === name);
      if (issue) {
        setFieldErrors((prev) => ({ ...prev, [name]: issue.message }));
      } else {
        setFieldErrors((prev) => {
          const newErrors: FieldErrors = { ...prev };
          delete newErrors[name as keyof FieldErrors];
          return newErrors;
        });
      }
    } else {
      setFieldErrors((prev) => {
        const newErrors: FieldErrors = { ...prev };
        delete newErrors[name as keyof FieldErrors];
        return newErrors;
      });
    }
  };

  const handleLogin = async () => {
    setIsLoading(true);
    setError("");

    const res = await signIn("credentials", {
      redirect: false,
      email: formData.email,
      password: formData.password,
    });

    if (res?.ok) {
      try {
        setTimeout(async () => {
          const sessionRes = await fetch("/api/auth/session");
          const session = await sessionRes.json();
          const role = session?.user?.role;

          router.push(role === "admin" ? "/Admin" : "/fitlog/dashboard");
        }, 300);
      } catch (error) {
        router.push("/fitlog/dashboard");
      }
    } else {
      setIsLoading(false);
      setError("Invalid credentials");
    }
  };

  return (
    <>
      {isLoading && <FullScreenLoader />}
      <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-black via-gray-900 to-zinc-800 text-white">
        {/* Ambient Lights */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute top-[-12%] left-[-10%] w-[420px] h-[420px] bg-cyan-400/25 blur-[140px] rounded-full" />
          <div className="absolute bottom-[6%] right-[8%] w-[380px] h-[380px] bg-pink-500/25 blur-[150px] rounded-full" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[620px] h-[620px] bg-white/5 blur-[200px] rounded-full" />
        </div>

        <div className="mx-auto max-w-6xl px-6 py-14 md:py-20">
          {/* Brand + Link */}
          <div className="mb-10 flex items-center justify-between">
            <Link href="/" className="inline-flex items-center gap-3">
              <span className="p-2.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-pink-500 shadow-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="22"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="text-white"
                  viewBox="0 0 24 24"
                >
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
              </span>
              <span className="text-xl font-extrabold tracking-wide">
                FitLog
              </span>
            </Link>
            <div className="text-sm text-gray-300">
              Don't have an account?{" "}
              <Link
                href="/signup"
                className="underline decoration-pink-400 decoration-2 underline-offset-4 hover:text-white"
              >
                Sign up
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            {/* Illustration */}
            <div className="hidden lg:flex relative items-center justify-center">
              <div className="absolute -inset-10 -z-10 bg-gradient-to-br from-cyan-400/20 via-pink-500/20 to-transparent blur-[180px] rounded-full" />
              <img
                src="https://illustrations.popsy.co/violet/stretching-girl.svg"
                alt="Fitness Illustration"
                className="w-full max-w-[540px] select-none pointer-events-none drop-shadow-[0_40px_120px_rgba(0,0,0,0.45)] mix-blend-screen opacity-95"
              />
            </div>

            {/* Glassmorphic Login Form */}
            <div className="bg-white/10 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.35)] p-6 sm:p-8">
              <div className="mb-6">
                <h1 className="text-3xl font-extrabold tracking-tight">
                  Welcome back to <span className="text-cyan-400">Fit</span>
                  <span className="text-pink-400">Log</span>
                </h1>
                <p className="mt-2 text-sm text-gray-300">
                  Log in to continue your fitness journey
                </p>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleLogin();
                }}
                className="space-y-5"
              >
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => {
                      const value = e.target.value;
                      setFormData((prev) => ({ ...prev, email: value }));
                      validateField("email", value);
                    }}
                    className="h-11 mt-1 w-full rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-gray-400 focus:ring-2 focus:ring-cyan-400/40 focus:border-transparent"
                    placeholder="alex@example.com"
                  />
                  {fieldErrors.email && (
                    <p className="text-sm text-red-400 mt-1">
                      {fieldErrors.email}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => {
                      const value = e.target.value;
                      setFormData((prev) => ({ ...prev, password: value }));
                      validateField("password", value);
                    }}
                    className="h-11 mt-1 w-full rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-gray-400 focus:ring-2 focus:ring-cyan-400/40 focus:border-transparent"
                    placeholder="••••••••"
                  />
                  {fieldErrors.password && (
                    <p className="text-sm text-red-400 mt-1">
                      {fieldErrors.password}
                    </p>
                  )}
                </div>

                {error && (
                  <p className="text-sm text-red-400 font-medium">{error}</p>
                )}

                <Button
                  type="submit"
                  className="w-full h-11 relative overflow-hidden rounded-xl bg-gradient-to-r from-cyan-500 to-pink-500 text-white font-semibold shadow-md transition-all duration-300 group"
                >
                  <span className="relative z-10">Sign In</span>
                  <span className="absolute inset-0 bg-white/20 scale-0 group-hover:scale-100 rounded-xl blur-lg transition-transform duration-300" />
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
