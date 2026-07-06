export default function AdminLoginPage() {
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
        <form style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <input type="email" placeholder="이메일" style={{ padding: "12px 16px", borderRadius: 12, border: "1px solid #E5DED4", fontSize: 14, outline: "none" }} />
          <input type="password" placeholder="비밀번호" style={{ padding: "12px 16px", borderRadius: 12, border: "1px solid #E5DED4", fontSize: 14, outline: "none" }} />
          <button type="submit" style={{ padding: "13px", borderRadius: 12, background: "#FF5636", color: "#fff", border: "none", cursor: "pointer", fontSize: 15, fontWeight: 700, marginTop: 4 }}>
            로그인
          </button>
        </form>
      </div>
    </div>
  );
}
