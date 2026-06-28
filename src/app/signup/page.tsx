"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useActionState } from "react";
import { signupAction } from "./actions";
import { SocialButtons } from "@/components/auth/SocialButtons";

const T = {
  ko: {
    checkTitle: "이메일을 확인하세요",
    checkDesc: "입력하신 이메일로 인증 링크를 보냈어요. 링크를 클릭하면 계정이 활성화돼요.",
    checkBack: "로그인으로 돌아가기",
    title: "계정 만들기",
    sub: "로컬루프 코리아에 오신 걸 환영해요",
    nameLabel: "닉네임",
    namePh: "이름 또는 닉네임",
    emailLabel: "이메일",
    emailPh: "you@example.com",
    pwLabel: "비밀번호",
    pwPh: "8자 이상",
    btnPending: "가입 중…",
    btn: "계정 만들기",
    divider: "또는 이메일로 가입하기",
    hasAccount: "이미 계정이 있으신가요?",
    login: "로그인",
    back: "← 홈으로 돌아가기",
  },
  en: {
    checkTitle: "Check your email",
    checkDesc: "We sent a confirmation link to your email. Click it to activate your account and continue.",
    checkBack: "Back to log in",
    title: "Create your account",
    sub: "Join the Localoop community",
    nameLabel: "Display name",
    namePh: "Your name or nickname",
    emailLabel: "Email",
    emailPh: "you@example.com",
    pwLabel: "Password",
    pwPh: "At least 8 characters",
    btnPending: "Creating account…",
    btn: "Create account",
    divider: "or sign up with email",
    hasAccount: "Already have an account?",
    login: "Log in",
    back: "← Back to home",
  },
};

export default function SignupPage() {
  const [state, action, pending] = useActionState(signupAction, { error: "", success: false });
  const [isKo, setIsKo] = useState(false);

  useEffect(() => {
    setIsKo(navigator.language.startsWith("ko"));
  }, []);

  const t = isKo ? T.ko : T.en;

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
            {t.checkTitle}
          </h2>
          <p style={{ fontSize: 14, color: "#4A6467", lineHeight: 1.65, maxWidth: 280, margin: "0 auto 24px" }}>
            {t.checkDesc}
          </p>
          <Link href="/login" style={{ fontSize: 14, color: "#1EC8C8", fontWeight: 600, textDecoration: "none" }}>
            {t.checkBack}
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
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 28 }}>
          <span style={{ fontSize: 18, fontWeight: 900, color: "#1A2B2C", letterSpacing: "-0.02em" }}>
            Localoop<span style={{ color: "#1EC8C8" }}>Korea</span>
          </span>
        </div>

        <div style={{ marginBottom: 22 }}>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "#1A2B2C", marginBottom: 6 }}>
            {t.title}
          </h1>
          <p style={{ fontSize: 14, color: "#4A6467" }}>{t.sub}</p>
        </div>

        {/* Social buttons */}
        <SocialButtons />

        {/* Divider */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "20px 0" }}>
          <div style={{ flex: 1, height: 1, background: "#E0E8EA" }} />
          <span style={{ fontSize: 12, color: "#4A6467", whiteSpace: "nowrap" }}>{t.divider}</span>
          <div style={{ flex: 1, height: 1, background: "#E0E8EA" }} />
        </div>

        {/* Email form */}
        <form action={action} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label htmlFor="displayName" style={{ fontSize: 13, fontWeight: 600, color: "#1A2B2C" }}>
              {t.nameLabel}
            </label>
            <input
              id="displayName"
              name="displayName"
              type="text"
              autoComplete="name"
              required
              minLength={2}
              placeholder={t.namePh}
              style={{
                height: 48, padding: "0 16px", borderRadius: 14,
                border: "1.5px solid #E0E8EA", background: "#F0FAFA",
                color: "#1A2B2C", fontSize: 15, outline: "none",
              }}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label htmlFor="email" style={{ fontSize: 13, fontWeight: 600, color: "#1A2B2C" }}>
              {t.emailLabel}
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder={t.emailPh}
              style={{
                height: 48, padding: "0 16px", borderRadius: 14,
                border: "1.5px solid #E0E8EA", background: "#F0FAFA",
                color: "#1A2B2C", fontSize: 15, outline: "none",
              }}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label htmlFor="password" style={{ fontSize: 13, fontWeight: 600, color: "#1A2B2C" }}>
              {t.pwLabel}
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              placeholder={t.pwPh}
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
            {pending ? t.btnPending : t.btn}
          </button>
        </form>

        <p style={{ textAlign: "center", fontSize: 13, color: "#4A6467", marginTop: 24 }}>
          {t.hasAccount}{" "}
          <Link href="/login" style={{ color: "#1EC8C8", fontWeight: 600, textDecoration: "none" }}>
            {t.login}
          </Link>
        </p>

        <div style={{ textAlign: "center", marginTop: 16 }}>
          <Link href="/" style={{ fontSize: 12, color: "#94a3b8", textDecoration: "none" }}>
            {t.back}
          </Link>
        </div>
      </div>
    </main>
  );
}
