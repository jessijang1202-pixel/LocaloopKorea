"use client";

import { useLang } from "@/lib/lang";
import { createClient } from "@/lib/supabase/client";

type Provider = "google" | "kakao" | "apple";

const LOGOS: Record<Provider, React.ReactNode> = {
  google: (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  ),
  kakao: (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path fill="#191919" d="M12 3C6.48 3 2 6.48 2 10.8c0 2.7 1.56 5.08 3.94 6.55L4.8 21l4.32-2.16C10.01 19.25 10.99 19.4 12 19.4c5.52 0 10-3.48 10-7.8S17.52 3 12 3z"/>
    </svg>
  ),
  apple: (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path fill="currentColor" d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
    </svg>
  ),
};

const STYLES: Record<Provider, { bg: string; color: string; border: string }> = {
  google: { bg: "#fff", color: "#1A2B2C", border: "#E0E8EA" },
  kakao:  { bg: "#FEE500", color: "#191919", border: "#FEE500" },
  apple:  { bg: "#000", color: "#fff", border: "#000" },
};

export function SocialButtons() {
  const isKo = useLang();
  const supabase = createClient();

  const labels: Record<Provider, string> = isKo
    ? { google: "Google로 계속하기", kakao: "카카오로 계속하기", apple: "Apple로 계속하기" }
    : { google: "Continue with Google", kakao: "Continue with Kakao", apple: "Continue with Apple" };

  async function signInWith(provider: Provider) {
    await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/auth/callback?next=/map` },
    });
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {(["google", "kakao", "apple"] as Provider[]).map((provider) => {
        const { bg, color, border } = STYLES[provider];
        return (
          <button
            key={provider}
            onClick={() => signInWith(provider)}
            style={{
              height: 50,
              borderRadius: 14,
              border: `1.5px solid ${border}`,
              background: bg,
              color,
              fontSize: 14,
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              cursor: "pointer",
              transition: "opacity 0.15s",
            }}
            onMouseOver={(e) => (e.currentTarget.style.opacity = "0.85")}
            onMouseOut={(e) => (e.currentTarget.style.opacity = "1")}
          >
            {LOGOS[provider]}
            {labels[provider]}
          </button>
        );
      })}
    </div>
  );
}
