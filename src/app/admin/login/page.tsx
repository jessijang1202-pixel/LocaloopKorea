"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Eye, EyeOff, Loader2, Shield } from "lucide-react";
import { adminLogin } from "./actions";

const ERROR_MSG: Record<string, string> = {
  invalid_credentials: "이메일 또는 비밀번호가 올바르지 않습니다.",
  unauthorized: "관리자 권한이 없는 계정입니다.",
};

function ErrorBanner() {
  const params = useSearchParams();
  const errorKey = params.get("error") ?? "";
  if (!errorKey) return null;
  return (
    <div className="flex items-center gap-2 bg-red-500/15 border border-red-500/30 rounded-xl px-4 py-3 mb-4">
      <Shield size={15} className="text-red-400 flex-shrink-0" />
      <p className="text-red-400 text-sm">{ERROR_MSG[errorKey] ?? "로그인 중 오류가 발생했습니다."}</p>
    </div>
  );
}

function LoginForm() {
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    await adminLogin(fd);
    setLoading(false);
  }

  return (
    <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6">
      <Suspense fallback={null}>
        <ErrorBanner />
      </Suspense>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="text-white/60 text-xs font-medium block mb-1.5">이메일</label>
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="admin@localoop.kr"
            className="w-full bg-white/8 border border-white/15 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-[#FF5636]/60 focus:bg-white/10 transition-colors"
          />
        </div>

        <div>
          <label className="text-white/60 text-xs font-medium block mb-1.5">비밀번호</label>
          <div className="relative">
            <input
              name="password"
              type={showPw ? "text" : "password"}
              required
              autoComplete="current-password"
              placeholder="••••••••"
              className="w-full bg-white/8 border border-white/15 rounded-xl px-4 py-3 pr-11 text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-[#FF5636]/60 focus:bg-white/10 transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowPw(v => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/35 hover:text-white/60"
            >
              {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-2 w-full py-3 rounded-xl bg-[#FF5636] text-white font-semibold text-sm flex items-center justify-center gap-2 hover:bg-[#e04523] transition-colors disabled:opacity-60 shadow-lg shadow-[#FF5636]/25"
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : null}
          {loading ? "로그인 중..." : "관리자 로그인"}
        </button>
      </form>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-[#16151A] flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-[#FF5636]/8 blur-3xl" />
      </div>

      <div className="relative w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-[#FF5636] flex items-center justify-center mb-4 shadow-lg shadow-[#FF5636]/30">
            <span className="text-white font-black text-2xl">L</span>
          </div>
          <h1 className="text-white font-bold text-xl mb-1">Localoop 관리자</h1>
          <p className="text-white/40 text-sm">Admin Panel</p>
        </div>

        <LoginForm />

        <p className="text-center text-white/25 text-xs mt-6">
          관리자 계정 문의: support@localoop.kr
        </p>
      </div>
    </div>
  );
}
