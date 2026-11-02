"use client";

import { useState, type FormEvent } from "react";
import { Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";

import VaraLogo from "./vara-logo";
import {
  loginUser,
  registerUser,
  type User,
} from "@/lib/auth";

interface AuthScreenProps {
  onAuthenticated: (user: User) => void;
}

export default function AuthScreen({
  onAuthenticated,
}: AuthScreenProps) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (mode === "register" && password !== confirmPassword) {
      setError("Your passwords do not match.");
      return;
    }

    if (password.length < 8 || password.length > 128) {
      setError("Your password must contain between 8 and 128 characters.");
      return;
    }

    setLoading(true);

    try {
      const credentials = {
        email: email.trim(),
        password,
      };

      const user =
        mode === "register"
          ? await registerUser(credentials)
          : await loginUser(credentials);

      onAuthenticated(user);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  function changeMode(nextMode: "login" | "register") {
    setMode(nextMode);
    setError("");
    setPassword("");
    setConfirmPassword("");
  }

  return (
    <main className="flex min-h-dvh items-center justify-center bg-[#101719] px-5 py-10">
      <section className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <VaraLogo showTagline iconSize={28} />
        </div>

        <div className="rounded-2xl border border-[#293A3B] bg-[#151F22] p-6 shadow-2xl sm:p-8">
          <div className="mb-7 text-center">
            <h1 className="text-2xl font-semibold text-[#E8F5F2]">
              {mode === "login" ? "Welcome back" : "Create your account"}
            </h1>

            <p className="mt-2 text-sm text-[#8DA5A0]">
              {mode === "login"
                ? "Sign in to continue your conversations with Vara."
                : "Create an account to start using Vara."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-[#E8F5F2]"
              >
                Email address
              </label>

              <div className="flex items-center gap-3 rounded-xl border border-[#293A3B] bg-[#101719] px-4 focus-within:border-[#35D6BD]">
                <Mail size={18} className="shrink-0 text-[#78918B]" />

                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  className="w-full bg-transparent py-3 text-sm text-[#E8F5F2] outline-none placeholder:text-[#647C76]"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-[#E8F5F2]"
              >
                Password
              </label>

              <div className="flex items-center gap-3 rounded-xl border border-[#293A3B] bg-[#101719] px-4 focus-within:border-[#35D6BD]">
                <LockKeyhole
                  size={18}
                  className="shrink-0 text-[#78918B]"
                />

                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete={
                    mode === "login" ? "current-password" : "new-password"
                  }
                  required
                  minLength={8}
                  maxLength={128}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="At least 8 characters"
                  className="w-full bg-transparent py-3 text-sm text-[#E8F5F2] outline-none placeholder:text-[#647C76]"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="text-[#78918B] hover:text-[#E8F5F2]"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {mode === "register" && (
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-2 block text-sm font-medium text-[#E8F5F2]"
                >
                  Confirm password
                </label>

                <div className="flex items-center gap-3 rounded-xl border border-[#293A3B] bg-[#101719] px-4 focus-within:border-[#35D6BD]">
                  <LockKeyhole
                    size={18}
                    className="shrink-0 text-[#78918B]"
                  />

                  <input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    minLength={8}
                    maxLength={128}
                    value={confirmPassword}
                    onChange={(event) =>
                      setConfirmPassword(event.target.value)
                    }
                    placeholder="Enter your password again"
                    className="w-full bg-transparent py-3 text-sm text-[#E8F5F2] outline-none placeholder:text-[#647C76]"
                  />
                </div>
              </div>
            )}

            {error && (
              <div
                role="alert"
                className="rounded-lg border border-red-900/60 bg-red-950/30 px-4 py-3 text-sm text-red-300"
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-[#159E8C] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#35D6BD] hover:text-[#101719] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "Please wait..."
                : mode === "login"
                  ? "Sign in"
                  : "Create account"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-[#8DA5A0]">
            {mode === "login"
              ? "Don't have an account?"
              : "Already have an account?"}

            <button
              type="button"
              onClick={() =>
                changeMode(mode === "login" ? "register" : "login")
              }
              className="ml-2 font-semibold text-[#35D6BD] hover:underline"
            >
              {mode === "login" ? "Create one" : "Sign in"}
            </button>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-[#647C76]">
          Your conversations are connected to your Vara account.
        </p>
      </section>
    </main>
  );
}