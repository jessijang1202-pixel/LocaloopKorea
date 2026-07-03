"use client";

import { useLang } from "@/lib/lang";
import Link from "next/link";
import { useActionState } from "react";
import { signupAction } from "./actions";
import { SocialButtons } from "@/components/auth/SocialButtons";

const T = {
  ko: {
    checkTitle: "이메일을 확인하세요", checkDesc: "입력하신 이메일로 인증 링크를 보냈어요. 링크를 클릭하면 계정이 활성화돼요.", checkBack: "로그인으로 돌아가기",
    title: "계정 만들기", sub: "로컬루프 코리아에 오신 걸 환영해요",
    nameLabel: "닉네임", namePh: "이름 또는 닉네임",
    emailLabel: "이메일", emailPh: "you@example.com",
    pwLabel: "비밀번호", pwPh: "8자 이상",
    btnPending: "가입 중…", btn: "계정 만들기", divider: "또는 이메일로 가입하기",
    hasAccount: "이미 계정이 있으신가요?", login: "로그인", back: "← 홈으로",
  },
  en: {
    checkTitle: "Check your email", checkDesc: "We sent a confirmation link to your email. Click it to activate your account.", checkBack: "Back to log in",
    title: "Create your account", sub: "Join the Localoop community",
    nameLabel: "Display name", namePh: "Your name or nickname",
    emailLabel: "Email", emailPh: "you@example.com",
    pwLabel: "Password", pwPh: "At least 8 characters",
    btnPending: "Creating account…", btn: "Create account", divider: "or sign up with email",
    hasAccount: "Already have an account?", login: "Log in", back: "← Home",
  },
};

const FIELD_STYLE: React.CSSProperties = {
  height: 48, padding: "0 16px", borderRadius: 14, width: "100%",
  border: "1.5px solid var(--border)", background: "var(--content-bg)",
  color: "var(--foreground)", fontSize: 15, outline: "none", boxSizing: "border-box",
};
const LABEL_STYLE: React.CSSProperties = { fontSize: 13, fontWeight: 600, color: "var(--foreground-muted)", marginBottom: 6, display: "block" };

export default function SignupPage() {
  const [state, action, pending] = useActionState(signupAction, { error: "", success: false });
  const isKo = useLang();
  const t = isKo ? T.ko : T.en;

  if (state?.success) {
    return (
      <main style={{ minHeight: "100dvh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--content-bg)", padding: "24px 20px" }}>
        <div style={{ background: "var(--card)", borderRadius: 28, padding: "32px 24px", maxWidth: 360, width: "100%", border: "1px solid var(--border)", textAlign: "center" }}>
          <div style={{ width: 56, height: 56, borderRadius: "50%", background: "rgba(255,86,54,0.1)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: 24 }}>✉️</div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: "var(--foreground)", marginBottom: 8 }}>{t.checkTitle}</h2>
          <p style={{ fontSize: 14, color: "var(--foreground-muted)", lineHeight: 1.65, maxWidth: 280, margin: "0 auto 24px" }}>{t.checkDesc}</p>
          <Link href="/login" style={{ fontSize: 14, color: "var(--grade-s)", fontWeight: 600, textDecoration: "none" }}>{t.checkBack}</Link>
        </div>
      </main>
    );
  }

  return (
    <main style={{ minHeight: "100dvh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--grade-dark)", padding: "24px 20px" }}>
      <div style={{ background: "var(--card)", borderRadius: 28, padding: "28px 24px 24px", maxWidth: 380, width: "100%", border: "1px solid var(--border)", boxShadow: "0 8px 40px rgba(0,0,0,0.24)" }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
          <div style={{ width: 32, height: 32, borderRadius: 9, background: "var(--grade-s)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <span style={{ fontSize: 15, fontWeight: 900, color: "#fff" }}>L</span>
          </div>
          <span style={{ fontSize: 17, fontWeight: 900, color: "var(--foreground)", letterSpacing: "-0.02em" }}>
            Localoop<span style={{ color: "var(--grade-s)" }}>Korea</span>
          </span>
        </div>

        <div style={{ marginBottom: 20 }}>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "var(--foreground)", marginBottom: 4, letterSpacing: "-0.02em" }}>{t.title}</h1>
          <p style={{ fontSize: 14, color: "var(--foreground-muted)" }}>{t.sub}</p>
        </div>

        {/* Social buttons */}
        <SocialButtons />

        {/* Divider */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "18px 0" }}>
          <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
          <span style={{ fontSize: 12, color: "var(--foreground-muted)", whiteSpace: "nowrap" }}>{t.divider}</span>
          <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
        </div>

        {/* Email form */}
        <form action={action} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label htmlFor="displayName" style={LABEL_STYLE}>{t.nameLabel}</label>
            <input id="displayName" name="displayName" type="text" autoComplete="name" required minLength={2} placeholder={t.namePh} style={FIELD_STYLE} />
          </div>
          <div>
            <label htmlFor="email" style={LABEL_STYLE}>{t.emailLabel}</label>
            <input id="email" name="email" type="email" autoComplete="email" required placeholder={t.emailPh} style={FIELD_STYLE} />
          </div>
          <div>
            <label htmlFor="password" style={LABEL_STYLE}>{t.pwLabel}</label>
            <input id="password" name="password" type="password" autoComplete="new-password" required minLength={8} placeholder={t.pwPh} style={FIELD_STYLE} />
          </div>

          {state?.error && (
            <p style={{ fontSize: 13, color: "#ef4444", background: "var(--card)", borderRadius: 12, padding: "12px 16px", border: "1px solid rgba(239,68,68,0.2)" }}>{state.error}</p>
          )}

          <button
            type="submit"
            disabled={pending}
            style={{ marginTop: 4, height: 50, borderRadius: 16, background: "var(--grade-s)", color: "#fff", fontWeight: 700, fontSize: 15, border: "none", cursor: "pointer", opacity: pending ? 0.6 : 1, transition: "opacity 0.15s", boxShadow: "0 4px 16px rgba(255,86,54,0.3)" }}
          >
            {pending ? t.btnPending : t.btn}
          </button>
        </form>

        <p style={{ textAlign: "center", fontSize: 13, color: "var(--foreground-muted)", marginTop: 20 }}>
          {t.hasAccount}{" "}
          <Link href="/login" style={{ color: "var(--grade-s)", fontWeight: 600, textDecoration: "none" }}>{t.login}</Link>
        </p>
        <div style={{ textAlign: "center", marginTop: 12 }}>
          <Link href="/" style={{ fontSize: 12, color: "var(--foreground-sub)", textDecoration: "none" }}>{t.back}</Link>
        </div>
      </div>
    </main>
  );
}
