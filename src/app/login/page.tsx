"use client";

import { Suspense } from "react";
import { useLang } from "@/lib/lang";
import Link from "next/link";
import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { loginAction } from "./actions";
import { SocialButtons } from "@/components/auth/SocialButtons";

const T = {
  ko: {
    sub: "로그인하고 한국 생활을 시작하세요",
    divider: "또는 이메일로 계속하기",
    emailPh: "이메일",
    pwPh: "비밀번호",
    btnPending: "로그인 중…",
    btn: "이메일로 로그인",
    noAccount: "계정이 없으신가요?",
    signup: "회원가입",
    back: "← 홈으로 돌아가기",
  },
  en: {
    sub: "Sign in to your account",
    divider: "or continue with email",
    emailPh: "Email",
    pwPh: "Password",
    btnPending: "Signing in…",
    btn: "Sign in with email",
    noAccount: "Don't have an account?",
    signup: "Sign up",
    back: "← Back to home",
  },
};

function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, { error: "" });
  const isKo = useLang();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "";

  const t = isKo ? T.ko : T.en;

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
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <span style={{ fontSize: 20, fontWeight: 900, color: "#1A2B2C", letterSpacing: "-0.02em" }}>
            Localoop<span style={{ color: "#1EC8C8" }}>Korea</span>
          </span>
          <p style={{ fontSize: 14, color: "#4A6467", marginTop: 6 }}>{t.sub}</p>
        </div>

        <SocialButtons />

        <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "20px 0" }}>
          <div style={{ flex: 1, height: 1, background: "#E0E8EA" }} />
          <span style={{ fontSize: 12, color: "#4A6467", whiteSpace: "nowrap" }}>{t.divider}</span>
          <div style={{ flex: 1, height: 1, background: "#E0E8EA" }} />
        </div>

        <form action={action} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {next && <input type="hidden" name="next" value={next} />}
          <input
            id="email" name="email" type="email" autoComplete="email" required
            placeholder={t.emailPh}
            style={{ height: 48, padding: "0 16px", borderRadius: 14, border: "1.5px solid #E0E8EA", background: "#fff", color: "#1A2B2C", fontSize: 15, outline: "none" }}
          />
          <input
            id="password" name="password" type="password" autoComplete="current-password" required
            placeholder={t.pwPh}
            style={{ height: 48, padding: "0 16px", borderRadius: 14, border: "1.5px solid #E0E8EA", background: "#fff", color: "#1A2B2C", fontSize: 15, outline: "none" }}
          />

          {state?.error && (
            <p style={{ fontSize: 13, color: "#ef4444", background: "#fff1f2", borderRadius: 12, padding: "12px 16px" }}>
              {state.error}
            </p>
          )}

          <button
            type="submit" disabled={pending}
            style={{ height: 50, borderRadius: 14, background: "linear-gradient(135deg,#1EC8C8,#17A0A0)", color: "white", fontWeight: 700, fontSize: 15, border: "none", cursor: "pointer", opacity: pending ? 0.6 : 1, transition: "opacity 0.15s" }}
          >
            {pending ? t.btnPending : t.btn}
          </button>
        </form>

        <p style={{ textAlign: "center", fontSize: 13, color: "#4A6467", marginTop: 20 }}>
          {t.noAccount}{" "}
          <Link href="/signup" style={{ color: "#1EC8C8", fontWeight: 600, textDecoration: "none" }}>{t.signup}</Link>
        </p>

        <div style={{ textAlign: "center", marginTop: 12 }}>
          <Link href="/" style={{ fontSize: 12, color: "#94a3b8", textDecoration: "none" }}>{t.back}</Link>
        </div>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
