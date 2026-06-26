"use client";

import Link from "next/link";
import { useActionState } from "react";
import { loginAction } from "./actions";

export default function LoginPage() {
  const [state, action, pending] = useActionState(loginAction, { error: "" });

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
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:32 }}>
          <span style={{
            width:38, height:38, borderRadius:11, fontSize:18,
            background:"linear-gradient(135deg,#1EC8C8,#17A0A0)",
            display:"flex", alignItems:"center", justifyContent:"center",
          }}>🗺️</span>
          <span style={{ fontSize:18, fontWeight:900, color:"#1A2B2C", letterSpacing:"-0.02em" }}>
            Localoop<span style={{ color:"#1EC8C8" }}>Korea</span>
          </span>
        </div>

        <div style={{ marginBottom:28 }}>
          <h1 style={{ fontSize:24, fontWeight:800, color:"#1A2B2C", marginBottom:6 }}>Welcome back</h1>
          <p style={{ fontSize:14, color:"#4A6467" }}>Log in to your Localoop account</p>
        </div>

        <form action={action} style={{ display:"flex", flexDirection:"column", gap:16 }}>
          <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
            <label htmlFor="email" style={{ fontSize:13, fontWeight:600, color:"#1A2B2C" }}>
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
                height:48, padding:"0 16px", borderRadius:14,
                border:"1.5px solid #E0E8EA", background:"#F0FAFA",
                color:"#1A2B2C", fontSize:15, outline:"none",
              }}
            />
          </div>

          <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
            <label htmlFor="password" style={{ fontSize:13, fontWeight:600, color:"#1A2B2C" }}>
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              placeholder="••••••••"
              style={{
                height:48, padding:"0 16px", borderRadius:14,
                border:"1.5px solid #E0E8EA", background:"#F0FAFA",
                color:"#1A2B2C", fontSize:15, outline:"none",
              }}
            />
          </div>

          {state?.error && (
            <p style={{ fontSize:13, color:"#ef4444", background:"#fff1f2", borderRadius:12, padding:"12px 16px" }}>
              {state.error}
            </p>
          )}

          <button
            type="submit"
            disabled={pending}
            style={{
              marginTop:4, height:50, borderRadius:16,
              background:"linear-gradient(135deg,#1EC8C8,#17A0A0)",
              color:"white", fontWeight:700, fontSize:15,
              border:"none", cursor:"pointer",
              opacity: pending ? 0.6 : 1,
              transition:"opacity 0.15s",
            }}
          >
            {pending ? "Logging in…" : "Log in"}
          </button>
        </form>

        <p style={{ textAlign:"center", fontSize:13, color:"#4A6467", marginTop:24 }}>
          Don{"'"}t have an account?{" "}
          <Link href="/signup" style={{ color:"#1EC8C8", fontWeight:600, textDecoration:"none" }}>
            Sign up
          </Link>
        </p>

        <div style={{ textAlign:"center", marginTop:16 }}>
          <Link href="/" style={{ fontSize:12, color:"#94a3b8", textDecoration:"none" }}>
            ← Back to home
          </Link>
        </div>
      </div>
    </main>
  );
}
