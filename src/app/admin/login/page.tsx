"use client";

import { Suspense, useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { adminLoginAction } from "./actions";

function AdminLoginForm() {
  const [state, action, pending] = useActionState(adminLoginAction, { error: "" });
  const searchParams = useSearchParams();
  const unauthorized = searchParams.get("error") === "unauthorized";

  return (
    <div style={{ minHeight: "100vh", background: "#F2EDE4", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: "#fff", borderRadius: 20, padding: "40px 36px", width: 380, boxShadow: "0 4px 32px rgba(0,0,0,0.08)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }}>
          <div style={{ width: 38, height: 38, borderRadius: 11, background: "#FF5636", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "#fff", fontWeight: 800, fontSize: 18 }}>L</span>
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 16, color: "#16151A" }}>Localoop Admin</div>
            <div style={{ fontSize: 12, color: "#9A9488" }}>관리자 로그인</div>
          </div>
        </div>
        <form action={action} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <input name="email" type="email" required placeholder="이메일" style={{ padding: "12px 16px", borderRadius: 12, border: "1px solid #E5DED4", fontSize: 14, outline: "none" }} />
          <input name="password" type="password" required placeholder="비밀번호" style={{ padding: "12px 16px", borderRadius: 12, border: "1px solid #E5DED4", fontSize: 14, outline: "none" }} />
          {(state?.error || unauthorized) && (
            <p style={{ fontSize: 13, color: "#C0350F", background: "#FFF0EC", borderRadius: 10, padding: "10px 14px", margin: 0 }}>
              {state?.error || "관리자 권한이 없는 계정입니다."}
            </p>
          )}
          <button type="submit" disabled={pending} style={{ padding: "13px", borderRadius: 12, background: "#FF5636", color: "#fff", border: "none", cursor: "pointer", fontSize: 15, fontWeight: 700, marginTop: 4, opacity: pending ? 0.6 : 1 }}>
            {pending ? "로그인 중…" : "로그인"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense>
      <AdminLoginForm />
    </Suspense>
  );
}
