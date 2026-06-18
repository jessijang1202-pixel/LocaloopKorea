"use client";

import Link from "next/link";
import { useActionState } from "react";
import { signupAction } from "./actions";

export default function SignupPage() {
  const [state, action, pending] = useActionState(signupAction, { error: "", success: false });

  if (state?.success) {
    return (
      <main className="min-h-dvh flex flex-col items-center justify-center px-6 text-center max-w-[430px] mx-auto">
        <div className="text-4xl mb-4">📬</div>
        <h2 className="text-xl font-bold text-[var(--foreground)] mb-2">Check your email</h2>
        <p className="text-sm text-[var(--muted-foreground)] max-w-[260px] leading-relaxed">
          We sent a confirmation link to your email. Click it to activate your account and continue.
        </p>
        <Link href="/login" className="mt-6 text-sm text-[var(--primary)] font-medium">
          Back to log in
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-dvh flex flex-col px-6 pt-12 pb-8 max-w-[430px] mx-auto">
      <Link href="/" className="text-[var(--muted-foreground)] text-sm mb-8 inline-block">
        ← Back
      </Link>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[var(--foreground)] mb-1">Create your account</h1>
        <p className="text-[var(--muted-foreground)] text-sm">Join the Localoop community</p>
      </div>

      <form action={action} className="flex flex-col gap-4 flex-1">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="displayName" className="text-sm font-medium text-[var(--foreground)]">
            Display name
          </label>
          <input
            id="displayName"
            name="displayName"
            type="text"
            autoComplete="name"
            required
            minLength={2}
            placeholder="Your name or nickname"
            className="h-12 px-4 rounded-xl border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] text-base outline-none focus:border-[var(--primary)] transition-colors placeholder:text-[var(--muted-foreground)]"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-sm font-medium text-[var(--foreground)]">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="you@example.com"
            className="h-12 px-4 rounded-xl border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] text-base outline-none focus:border-[var(--primary)] transition-colors placeholder:text-[var(--muted-foreground)]"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="password" className="text-sm font-medium text-[var(--foreground)]">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            placeholder="At least 8 characters"
            className="h-12 px-4 rounded-xl border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] text-base outline-none focus:border-[var(--primary)] transition-colors placeholder:text-[var(--muted-foreground)]"
          />
        </div>

        {state?.error && (
          <p className="text-sm text-red-500 bg-red-50 rounded-xl px-4 py-3">{state.error}</p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="mt-2 h-12 rounded-2xl bg-[var(--primary)] text-white font-semibold text-base disabled:opacity-60 transition-opacity hover:opacity-90 active:opacity-80"
        >
          {pending ? "Creating account…" : "Create account"}
        </button>
      </form>

      <p className="text-center text-sm text-[var(--muted-foreground)] mt-6">
        Already have an account?{" "}
        <Link href="/login" className="text-[var(--primary)] font-medium">
          Log in
        </Link>
      </p>
    </main>
  );
}
