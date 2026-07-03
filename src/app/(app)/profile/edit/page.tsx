"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useLang } from "@/lib/lang";

const T = {
  ko: {
    title: "프로필 편집", back: "마이페이지", name: "이름 / 닉네임", namePh: "앱에서 표시될 이름",
    bio: "한 줄 소개", bioPh: "자신을 간단히 소개해보세요 (최대 100자)",
    nationality: "국적", nationalityPh: "예: 미국, 일본, 영국",
    save: "저장하기", saving: "저장 중…", saved: "저장됐어요!", nameRequired: "이름을 입력해주세요",
  },
  en: {
    title: "Edit Profile", back: "My Page", name: "Name / Nickname", namePh: "How you appear in the app",
    bio: "Bio", bioPh: "A short intro about yourself (max 100 chars)",
    nationality: "Nationality", nationalityPh: "e.g. American, Japanese, British",
    save: "Save changes", saving: "Saving…", saved: "Saved!", nameRequired: "Please enter your name",
  },
};

export default function EditProfilePage() {
  const router = useRouter();
  const isKo = useLang();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ display_name: "", bio: "", nationality: "" });

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;
      supabase.from("profiles").select("display_name, bio, nationality").eq("id", user.id).single()
        .then(({ data }) => { if (data) setForm({ display_name: data.display_name ?? "", bio: data.bio ?? "", nationality: data.nationality ?? "" }); });
    });
  }, []);

  const t = isKo ? T.ko : T.en;

  async function handleSave() {
    if (!form.display_name.trim()) { setError(t.nameRequired); return; }
    setSaving(true); setError("");
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { error: err } = await supabase.from("profiles")
      .update({ display_name: form.display_name.trim(), bio: form.bio || null, nationality: form.nationality || null, updated_at: new Date().toISOString() })
      .eq("id", user.id);
    setSaving(false);
    if (err) { setError(err.message); return; }
    setSaved(true);
    setTimeout(() => { setSaved(false); router.push("/profile"); }, 900);
  }

  const sLabel: React.CSSProperties = { fontSize: 12, fontWeight: 700, color: "var(--foreground-muted)", marginBottom: 6 };
  const sInput: React.CSSProperties = { width: "100%", padding: "13px 16px", borderRadius: 14, border: "1.5px solid var(--border)", background: "var(--card)", fontSize: 15, color: "var(--foreground)", outline: "none", boxSizing: "border-box" };

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100%" }}>
      {/* Header */}
      <div style={{ background: "linear-gradient(160deg, #2A1208 0%, #1E0D06 100%)", paddingTop: 44, paddingBottom: 16, flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "0 16px" }}>
          <button onClick={() => router.push("/profile")} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.55)", fontSize: 13, cursor: "pointer", padding: 0 }}>
            ← {t.back}
          </button>
        </div>
        <div style={{ padding: "12px 16px 0" }}>
          <h1 style={{ fontSize: 20, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em" }}>{t.title}</h1>
        </div>
      </div>

      {/* Form */}
      <div style={{ flex: 1, overflowY: "auto", background: "var(--content-bg)", padding: "20px 16px 100px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div>
            <p style={sLabel}>{t.name}</p>
            <input type="text" value={form.display_name} onChange={(e) => setForm({ ...form, display_name: e.target.value })} placeholder={t.namePh} style={sInput} />
          </div>
          <div>
            <p style={sLabel}>{t.bio}</p>
            <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} placeholder={t.bioPh} maxLength={100} rows={3} style={{ ...sInput, height: "auto", resize: "none", lineHeight: 1.6, padding: "13px 16px" }} />
            <p style={{ fontSize: 11, color: "var(--foreground-muted)", textAlign: "right", marginTop: 4 }}>{form.bio.length}/100</p>
          </div>
          <div>
            <p style={sLabel}>{t.nationality}</p>
            <input type="text" value={form.nationality} onChange={(e) => setForm({ ...form, nationality: e.target.value })} placeholder={t.nationalityPh} style={sInput} />
          </div>
          {error && <p style={{ fontSize: 13, color: "#ef4444", background: "var(--card)", borderRadius: 12, padding: "12px 16px", border: "1px solid rgba(239,68,68,0.2)" }}>{error}</p>}
        </div>
      </div>

      {/* Save button */}
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "var(--card)", borderTop: "1px solid var(--border)", padding: "14px 16px", paddingBottom: "calc(14px + env(safe-area-inset-bottom))", zIndex: 50 }}>
        <button
          onClick={handleSave}
          disabled={saving || saved}
          style={{ width: "100%", height: 50, borderRadius: 14, background: saved ? "#1D9E75" : "var(--grade-s)", color: "#fff", fontWeight: 700, fontSize: 15, border: "none", cursor: saving || saved ? "default" : "pointer", opacity: saving ? 0.7 : 1, transition: "background 0.2s", boxShadow: "0 4px 16px rgba(255,86,54,0.3)" }}
        >
          {saved ? "✓ " + t.saved : saving ? t.saving : t.save}
        </button>
      </div>
    </div>
  );
}
