"use client";

import Link from "next/link";
import { useActionState } from "react";
import { signupAction } from "./actions";

export default function SignupPage() {
  const [state, action, pending] = useActionState(signupAction, { error: "", success: false });

  if (state?.success) {
    return (
      <main style={{
        minHeight: "100dvh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#F0FAFA",
        padding: "24px 20px",
      }}>
        <div className="auth-card" style={{ textAlign: "center" }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: "#1A2B2C", marginBottom: 8 }}>
            Check your email
          </h2>
          <p style={{ fontSize: 14, color: "#4A6467", lineHeight: 1.65, maxWidth: 280, margin: "0 auto 24px" }}>
            We sent a confirmation link to your email. Click it to activate your account and continue.
          </p>
          <Link href="/login" style={{ fontSize: 14, color: "#1EC8C8", fontWeight: 600, textDecoration: "none" }}>
            Back to log in
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main style={{
      minHeight: "100dvh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#F0FAFA",
      padding: "24px 20px",
    }}>
      <div className="auth-card">
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 32 }}>
          <span style={{ fontSize: 18, fontWeight: 900, color: "#1A2B2C", letterSpacing: "-0.02em" }}>
            Localoop<span style={{ color: "#1EC8C8" }}>Korea</span>
          </span>
        </div>

        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "#1A2B2C", marginBottom: 6 }}>
            Create your account
          </h1>
          <p style={{ fontSize: 14, color: "#4A6467" }}>Join the Localoop community</p>
        </div>

        <form action={action} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label htmlFor="displayName" style={{ fontSize: 13, fontWeight: 600, color: "#1A2B2C" }}>
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
              style={{
                height: 48, padding: "0 16px", borderRadius: 14,
                border: "1.5px solid #E0E8EA", background: "#F0FAFA",
                color: "#1A2B2C", fontSize: 15, outline: "none",
              }}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label htmlFor="email" style={{ fontSize: 13, fontWeight: 600, color: "#1A2B2C" }}>
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="you@example.com"
              style={{
                height: 48, padding: "0 16px", borderRadius: 14,
                border: "1.5px solid #E0E8EA", background: "#F0FAFA",
                color: "#1A2B2C", fontSize: 15, outline: "none",
              }}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label htmlFor="password" style={{ fontSize: 13, fontWeight: 600, color: "#1A2B2C" }}>
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
              style={{
                height: 48, padding: "0 16px", borderRadius: 14,
                border: "1.5px solid #E0E8EA", background: "#F0FAFA",
                color: "#1A2B2C", fontSize: 15, outline: "none",
              }}
            />
          </div>

          {state?.error && (
            <p style={{ fontSize: 13, color: "#ef4444", background: "#fff1f2", borderRadius: 12, padding: "12px 16px" }}>
              {state.error}
            </p>
          )}

          <button
            type="submit"
            disabled={pending}
            style={{
              marginTop: 4, height: 50, borderRadius: 16,
              background: "linear-gradient(135deg,#1EC8C8,#17A0A0)",
              color: "white", fontWeight: 700, fontSize: 15,
              border: "none", cursor: "pointer",
              opacity: pending ? 0.6 : 1,
              transition: "opacity 0.15s",
            }}
          >
            {pending ? "Creating account…" : "Create account"}
          </button>
        </form>

        <p style={{ textAlign: "center", fontSize: 13, color: "#4A6467", marginTop: 24 }}>
          Already have an account?{" "}
          <Link href="/login" style={{ color: "#1EC8C8", fontWeight: 600, textDecoration: "none" }}>
            Log in
          </Link>
        </p>

        <div style={{ textAlign: "center", marginTop: 16 }}>
          <Link href="/" style={{ fontSize: 12, color: "#94a3b8", textDecoration: "none" }}>
            ← Back to home
          </Link>
        </div>
      </div>
    </main>
  );
}
