"use client";

import { Suspense, useState } from "react";
import { useLang, setLang } from "@/lib/lang";
import Link from "next/link";
import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { loginAction } from "./actions";
import { SocialButtons } from "@/components/auth/SocialButtons";
import { useRouter } from "next/navigation";

function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, { error: "" });
  const isKo = useLang();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "";
  const router = useRouter();
  const [lang, setLang] = useState<"ko" | "en">(isKo ? "ko" : "en");

  const ko = lang === "ko";

  return (
    <div style={{ minHeight: "100dvh", background: "var(--background)", display: "flex", flexDirection: "column", maxWidth: 430, margin: "0 auto", position: "relative", overflow: "hidden" }}>

      {/* ── Hero ─────────────────────────────────── */}
      <div style={{ height: 420, background: "linear-gradient(165deg, #1a1230 0%, #2d1f5e 35%, #3a2a1a 70%, #1f0f0a 100%)", position: "relative", flexShrink: 0 }}>

        <img src="/seoul_landscape.png" alt="Seoul Landscape from Namsan" style={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute", inset: 0 }} />

        {/* Gradient overlay — bottom */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 55%)" }} />

        {/* Top bar: wordmark + lang toggle */}
        <div style={{ position: "absolute", top: "calc(env(safe-area-inset-top, 0px) + 20px)", left: 20, right: 20, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 20, fontWeight: 900, color: "#fff", letterSpacing: "-0.5px" }}>Localoop</span>
            <span style={{ fontSize: 10, fontWeight: 800, padding: "2px 7px", borderRadius: 6, background: "var(--grade-s)", color: "#fff", letterSpacing: "0.05em" }}>KR</span>
          </div>
          <div style={{ display: "flex", background: "rgba(255,255,255,0.15)", borderRadius: 999, padding: 3, backdropFilter: "blur(6px)" }}>
            {(["en", "ko"] as const).map((l) => (
              <button key={l} onClick={() => setLang(l)} style={{
                fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 999,
                background: lang === l ? "#fff" : "transparent",
                color: lang === l ? "#16151A" : "rgba(255,255,255,0.7)",
                border: "none", cursor: "pointer",
              }}>
                {l === "ko" ? "한국어" : "EN"}
              </button>
            ))}
          </div>
        </div>

        {/* Eyebrow + headline */}
        <div style={{ position: "absolute", bottom: 28, left: 22, right: 22 }}>
          <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.18em", color: "var(--grade-s)", marginBottom: 10, textTransform: "uppercase" }}>
            DIG INTO LOCAL KOREA
          </div>
          <h1 style={{ fontSize: 34, fontWeight: 900, color: "#fff", lineHeight: 1.15, letterSpacing: "-0.8px" }}>
            {ko ? <>한국 생활,<br />여기서 시작.</> : <>Your Korea life<br />starts here.</>}
          </h1>
        </div>
      </div>

      {/* ── Auth sheet ───────────────────────────── */}
      <div style={{
        flex: 1,
        background: "var(--card)",
        borderRadius: "28px 28px 0 0",
        marginTop: -28,
        padding: "24px 22px",
        paddingBottom: "calc(24px + env(safe-area-inset-bottom, 0px))",
        zIndex: 2,
      }}>
        <div style={{ width: 36, height: 4, borderRadius: 99, background: "var(--border)", margin: "0 auto 20px" }} />

        <div style={{ fontSize: 18, fontWeight: 800, color: "var(--foreground)", marginBottom: 18 }}>
          {ko ? "시작하기" : "Get started"}
        </div>

        {/* Social auth buttons */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <SocialButtons />
        </div>

        {/* Email form */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "16px 0" }}>
          <div style={{ flex: 1, height: 1, background: "var(--divider)" }} />
          <span style={{ fontSize: 12, color: "var(--foreground-muted)", whiteSpace: "nowrap" }}>{ko ? "이메일로 계속하기" : "or continue with email"}</span>
          <div style={{ flex: 1, height: 1, background: "var(--divider)" }} />
        </div>

        <form action={action} style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 14 }}>
          {next && <input type="hidden" name="next" value={next} />}
          <input
            name="email" type="email" autoComplete="email" required
            placeholder={ko ? "이메일" : "Email"}
            style={{ height: 52, padding: "0 16px", borderRadius: 14, border: "1.5px solid var(--border)", background: "var(--background)", color: "var(--foreground)", fontSize: 15, outline: "none" }}
          />
          <input
            name="password" type="password" autoComplete="current-password" required
            placeholder={ko ? "비밀번호" : "Password"}
            style={{ height: 52, padding: "0 16px", borderRadius: 14, border: "1.5px solid var(--border)", background: "var(--background)", color: "var(--foreground)", fontSize: 15, outline: "none" }}
          />
          {state?.error && (
            <p style={{ fontSize: 13, color: "var(--grade-s)", background: "var(--why-bg)", borderRadius: 12, padding: "10px 14px" }}>{state.error}</p>
          )}
          <button
            type="submit" disabled={pending}
            style={{ height: 52, borderRadius: 14, background: "var(--grade-s)", color: "#fff", fontWeight: 700, fontSize: 15, border: "none", cursor: "pointer", opacity: pending ? 0.6 : 1 }}
          >
            {pending ? (ko ? "로그인 중…" : "Signing in…") : (ko ? "이메일로 로그인" : "Sign in with Email")}
          </button>
        </form>

        {/* Guest button */}
        <button
          onClick={() => router.push("/map")}
          style={{
            width: "100%", height: 52, borderRadius: 14,
            background: "var(--primary-light)", border: "1.5px solid var(--why-border)",
            color: "var(--grade-s)", fontWeight: 700, fontSize: 14,
            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          {ko ? "먼저 둘러보기 · 이태원부터" : "Explore first · Itaewon default"}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </button>

        {/* Legal */}
        <p style={{ fontSize: 11, color: "var(--foreground-muted)", textAlign: "center", marginTop: 16, lineHeight: 1.6 }}>
          {ko ? "계속하면 " : "By continuing you agree to our "}
          <Link href="/terms" style={{ color: "var(--foreground-sub)", textDecoration: "underline" }}>{ko ? "이용약관" : "Terms"}</Link>
          {ko ? " 및 " : " and "}
          <Link href="/privacy" style={{ color: "var(--foreground-sub)", textDecoration: "underline" }}>{ko ? "개인정보처리방침" : "Privacy Policy"}</Link>
          {ko ? "에 동의합니다." : "."}
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
