"use client";

import { useState, useMemo } from "react";
import { Search, Plus, Download, X, ChevronUp, ChevronDown, Loader2, Trash2, Database } from "lucide-react";
import { ConfirmModal } from "@/components/admin/ConfirmModal";
import { useToast } from "@/components/admin/Toast";
import type { AdminPlace, PlaceGrade } from "@/types/admin";

/* ── Mock data ───────────────────────────────────────────────── */
const MOCK_PLACES: AdminPlace[] = Array.from({ length: 40 }, (_, i) => ({
  id: `p${i + 1}`,
  name_ko: ["라이너스 BBQ", "앤쓰러사이트 이태원", "더 나인", "이태원 클럽 옥타곤", "자마이카 레스토랑", "루프탑 바 서울"][i % 6],
  name_en: ["Linus BBQ", "Anthracite Itaewon", "The Nine", "Club Octagon", "Jamaica Restaurant", "Rooftop Bar Seoul"][i % 6],
  slug: `place-${i + 1}`,
  address: `서울 용산구 이태원로 ${100 + i}`,
  lat: 37.534 + (Math.random() - 0.5) * 0.02,
  lng: 126.994 + (Math.random() - 0.5) * 0.02,
  category: ["restaurant", "cafe", "bar", "shopping", "hospital"][i % 5],
  region_id: ["r1", "r2", "r3"][i % 3],
  ls_score: 60 + Math.floor(Math.random() * 40),
  ar_score: 55 + Math.floor(Math.random() * 45),
  pd_score: 50 + Math.floor(Math.random() * 50),
  lf_score: 65 + Math.floor(Math.random() * 35),
  grade: (["S", "A", "B", "C", "D"] as PlaceGrade[])[i % 5],
  grade_override: null,
  grade_override_reason: null,
  languages: ["EN", "JA"],
  phone: `02-${1000 + i}-${2000 + i}`,
  hours: "10:00 - 22:00",
  memo: null,
  updated_at: new Date(Date.now() - i * 3600000).toISOString(),
  created_at: new Date(Date.now() - i * 86400000).toISOString(),
}));

const GRADE_COLORS: Record<string, string> = {
  S: "#FF5636", A: "#12BFB6", B: "#7B4DFF", C: "#FFC93C", D: "#9A9488",
};
const CATEGORIES = ["restaurant", "cafe", "bar", "shopping", "hospital", "admin", "culture", "etc"];
const CATEGORY_KO: Record<string, string> = {
  restaurant: "음식점", cafe: "카페", bar: "주점", shopping: "쇼핑",
  hospital: "병원", admin: "행정", culture: "문화시설", etc: "기타",
};
const LANGS = ["EN", "JA", "ZH", "VI", "TH", "FR", "DE", "ES"];

function calcGrade(ls: number, ar: number, pd: number, lf: number): PlaceGrade {
  const avg = (ls + ar + pd + lf) / 4;
  if (avg >= 90) return "S";
  if (avg >= 75) return "A";
  if (avg >= 60) return "B";
  if (avg >= 45) return "C";
  return "D";
}

function GradeBadge({ grade }: { grade: PladeGrade | string }) {
  return (
    <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg text-white text-xs font-bold flex-shrink-0"
          style={{ background: GRADE_COLORS[grade] ?? "#9A9488" }}>
      {grade}
    </span>
  );
}

function ScoreSlider({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div>
      <div className="flex justify-between mb-1">
        <label className="text-xs font-semibold text-gray-600">{label}</label>
        <span className="text-xs font-bold text-gray-800">{value}</span>
      </div>
      <input
        type="range" min={0} max={100} step={1}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full accent-[#FF5636] h-1.5 cursor-pointer"
      />
    </div>
  );
}

/* ── Edit / Create drawer ───────────────────────────────────── */
function PlaceDrawer({
  place, onClose, onSave, onDelete,
}: {
  place: AdminPlace | null;
  onClose: () => void;
  onSave: (data: Partial<AdminPlace>) => void;
  onDelete?: () => void;
}) {
  const isNew = !place;
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  const [form, setForm] = useState<Partial<AdminPlace>>(place ?? {
    name_ko: "", name_en: "", address: "", category: "restaurant",
    ls_score: 50, ar_score: 50, pd_score: 50, lf_score: 50,
    grade_override: null, grade_override_reason: null,
    languages: [], phone: "", hours: "", memo: "",
  });

  const liveGrade = calcGrade(form.ls_score ?? 50, form.ar_score ?? 50, form.pd_score ?? 50, form.lf_score ?? 50);
  const displayGrade = form.grade_override || liveGrade;

  function set<K extends keyof AdminPlace>(key: K, val: AdminPlace[K]) {
    setForm(prev => ({ ...prev, [key]: val }));
  }

  async function handleSave() {
    if (!form.name_ko) { toast("장소명을 입력하세요.", "error"); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    onSave(form);
    setLoading(false);
    toast(isNew ? "장소가 추가되었습니다." : "저장되었습니다.");
    onClose();
  }

  return (
    <>
      <ConfirmModal
        open={deleteConfirm}
        title="장소 삭제"
        description={`"${place?.name_ko}"을(를) 삭제합니다. 이 작업은 되돌릴 수 없습니다.`}
        confirmLabel="삭제"
        danger
        onConfirm={() => { onDelete?.(); onClose(); setDeleteConfirm(false); toast("장소가 삭제되었습니다.", "error"); }}
        onCancel={() => setDeleteConfirm(false)}
      />

      <div className="fixed inset-0 z-50 flex justify-end">
        <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
        <aside className="relative bg-white w-full max-w-md h-full flex flex-col shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 flex-shrink-0">
            <h2 className="font-bold text-gray-900 text-base">{isNew ? "장소 추가" : "장소 수정"}</h2>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400"><X size={18} /></button>
          </div>

          {/* Scrollable form */}
          <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-5">

            {/* Grade preview */}
            <div className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 border border-gray-200">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-lg font-black"
                   style={{ background: GRADE_COLORS[displayGrade] }}>
                {displayGrade}
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">현재 등급 (실시간 계산)</p>
                <p className="text-sm font-bold text-gray-900">
                  점수 평균: {Math.round(((form.ls_score ?? 50) + (form.ar_score ?? 50) + (form.pd_score ?? 50) + (form.lf_score ?? 50)) / 4)}점
                </p>
              </div>
            </div>

            {/* Basic info */}
            <div className="flex flex-col gap-3">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">기본 정보</p>
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1 block">장소명 (한국어) *</label>
                <input value={form.name_ko ?? ""} onChange={e => set("name_ko", e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#FF5636]/60" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1 block">장소명 (영어)</label>
                <input value={form.name_en ?? ""} onChange={e => set("name_en", e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#FF5636]/60" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1 block">주소</label>
                <input value={form.address ?? ""} onChange={e => set("address", e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#FF5636]/60" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1 block">카테고리</label>
                  <select value={form.category ?? "restaurant"} onChange={e => set("category", e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#FF5636]/60">
                    {CATEGORIES.map(c => <option key={c} value={c}>{CATEGORY_KO[c]}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1 block">전화번호</label>
                  <input value={form.phone ?? ""} onChange={e => set("phone", e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#FF5636]/60" />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1 block">운영시간</label>
                <input value={form.hours ?? ""} onChange={e => set("hours", e.target.value)}
                  placeholder="10:00 - 22:00"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#FF5636]/60" />
              </div>
            </div>

            {/* Scores */}
            <div className="flex flex-col gap-4">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">친화도 점수 (0–100)</p>
              <ScoreSlider label="LS — 언어 지원" value={form.ls_score ?? 50} onChange={v => set("ls_score", v)} />
              <ScoreSlider label="AR — 출입 위험도" value={form.ar_score ?? 50} onChange={v => set("ar_score", v)} />
              <ScoreSlider label="PD — 절차 난이도" value={form.pd_score ?? 50} onChange={v => set("pd_score", v)} />
              <ScoreSlider label="LF — 로컬 적합성" value={form.lf_score ?? 50} onChange={v => set("lf_score", v)} />
            </div>

            {/* Grade override */}
            <div className="flex flex-col gap-3">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">등급 오버라이드</p>
              <div className="grid grid-cols-5 gap-2">
                {(["", "S", "A", "B", "C", "D"] as (PlaceGrade | "")[]).slice(1).map(g => (
                  <button key={g}
                    onClick={() => set("grade_override", form.grade_override === g ? null : g as PlaceGrade)}
                    className={`h-9 rounded-lg text-sm font-bold transition-all ${form.grade_override === g ? "text-white scale-105 shadow-sm" : "text-gray-400 bg-gray-100"}`}
                    style={form.grade_override === g ? { background: GRADE_COLORS[g] } : {}}>
                    {g}
                  </button>
                ))}
              </div>
              {form.grade_override && (
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1 block">오버라이드 사유</label>
                  <textarea value={form.grade_override_reason ?? ""} onChange={e => set("grade_override_reason", e.target.value)}
                    rows={2} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm resize-none focus:outline-none focus:border-[#FF5636]/60" />
                </div>
              )}
            </div>

            {/* Languages */}
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">외국어 지원</p>
              <div className="flex flex-wrap gap-2">
                {LANGS.map(lang => {
                  const active = (form.languages ?? []).includes(lang);
                  return (
                    <button key={lang}
                      onClick={() => set("languages", active
                        ? (form.languages ?? []).filter(l => l !== lang)
                        : [...(form.languages ?? []), lang])}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${active ? "bg-[#FF5636] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                      {lang}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Memo */}
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">내부 메모</label>
              <textarea value={form.memo ?? ""} onChange={e => set("memo", e.target.value)}
                rows={3} placeholder="관리자 전용 메모..."
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm resize-none focus:outline-none focus:border-[#FF5636]/60" />
            </div>
          </div>

          {/* Footer */}
          <div className="flex gap-3 px-5 py-4 border-t border-gray-100 flex-shrink-0 bg-white">
            {!isNew && (
              <button onClick={() => setDeleteConfirm(true)}
                className="p-2.5 rounded-xl border border-red-200 text-red-400 hover:bg-red-50 transition-colors">
                <Trash2 size={16} />
              </button>
            )}
            <button onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50">
              취소
            </button>
            <button onClick={handleSave} disabled={loading}
              className="flex-1 py-2.5 rounded-xl bg-[#FF5636] text-white text-sm font-semibold flex items-center justify-center gap-2 hover:bg-[#e04523] transition-colors disabled:opacity-60">
              {loading && <Loader2 size={14} className="animate-spin" />}
              {isNew ? "추가" : "저장"}
            </button>
          </div>
        </aside>
      </div>
    </>
  );
}

/* ── Data Collection Modal ───────────────────────────────────── */
function CollectModal({ onClose }: { onClose: () => void }) {
  const { toast } = useToast();
  const [step, setStep] = useState<"form" | "running" | "done">("form");
  const [progress, setProgress] = useState(0);
  const [region, setRegion] = useState("이태원");
  const [category, setCategory] = useState("전체");

  function handleStart() {
    setStep("running");
    const iv = setInterval(() => {
      setProgress(p => {
        if (p >= 100) { clearInterval(iv); setStep("done"); return 100; }
        return p + Math.random() * 15;
      });
    }, 400);
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={step !== "running" ? onClose : undefined} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 z-10">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-gray-900">데이터 수집 & 업데이트</h3>
          {step !== "running" && (
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
          )}
        </div>

        {step === "form" && (
          <div className="flex flex-col gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1.5 block">지역 선택</label>
              <select value={region} onChange={e => setRegion(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#FF5636]/60">
                {["이태원", "홍대", "강남", "명동", "신촌", "혜화", "성수", "전체"].map(r =>
                  <option key={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1.5 block">카테고리</label>
              <select value={category} onChange={e => setCategory(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#FF5636]/60">
                {["전체", ...CATEGORIES.map(c => CATEGORY_KO[c])].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-xs text-amber-700">
              수집 완료 후 등급이 자동으로 재계산됩니다. 시간이 수 분 소요될 수 있습니다.
            </div>
            <div className="flex gap-3 mt-2">
              <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50">취소</button>
              <button onClick={handleStart} className="flex-1 py-2.5 rounded-xl bg-[#FF5636] text-white text-sm font-semibold hover:bg-[#e04523] flex items-center justify-center gap-2">
                <Database size={14} /> 수집 시작
              </button>
            </div>
          </div>
        )}

        {step === "running" && (
          <div className="flex flex-col items-center gap-4 py-4">
            <Loader2 size={32} className="animate-spin text-[#FF5636]" />
            <p className="text-sm font-medium text-gray-700">{region} · {category} 데이터 수집 중...</p>
            <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
              <div className="h-full bg-[#FF5636] rounded-full transition-all duration-300"
                   style={{ width: `${Math.min(progress, 100)}%` }} />
            </div>
            <p className="text-xs text-gray-400">{Math.floor(Math.min(progress, 100))}%</p>
          </div>
        )}

        {step === "done" && (
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-3 gap-3">
              {[["총 수집", "48곳"], ["등급 변경", "12곳"], ["신규 추가", "5곳"]].map(([label, val]) => (
                <div key={label} className="bg-gray-50 rounded-xl p-3 text-center">
                  <p className="text-xl font-bold text-gray-900">{val}</p>
                  <p className="text-[10px] text-gray-500 mt-0.5">{label}</p>
                </div>
              ))}
            </div>
            <button onClick={() => { toast("데이터 수집이 완료되었습니다."); onClose(); }}
              className="w-full py-2.5 rounded-xl bg-[#FF5636] text-white text-sm font-semibold hover:bg-[#e04523]">
              완료
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Main page ───────────────────────────────────────────────── */
type SortKey = "name_ko" | "grade" | "updated_at";

export default function PlacesPage() {
  const [places, setPlaces] = useState<AdminPlace[]>(MOCK_PLACES);
  const [search, setSearch] = useState("");
  const [filterGrade, setFilterGrade] = useState<string>("전체");
  const [filterCategory, setFilterCategory] = useState<string>("전체");
  const [sortKey, setSortKey] = useState<SortKey>("updated_at");
  const [sortAsc, setSortAsc] = useState(false);
  const [page, setPage] = useState(1);
  const [drawer, setDrawer] = useState<AdminPlace | null | "new">(null);
  const [collecting, setCollecting] = useState(false);
  const PER_PAGE = 20;

  const filtered = useMemo(() => {
    let list = places;
    if (search) list = list.filter(p => p.name_ko.includes(search) || (p.address ?? "").includes(search));
    if (filterGrade !== "전체") list = list.filter(p => p.grade === filterGrade);
    if (filterCategory !== "전체") list = list.filter(p => p.category === filterCategory);
    list = [...list].sort((a, b) => {
      const av = a[sortKey] ?? ""; const bv = b[sortKey] ?? "";
      return sortAsc ? (av < bv ? -1 : 1) : (av > bv ? -1 : 1);
    });
    return list;
  }, [places, search, filterGrade, filterCategory, sortKey, sortAsc]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortAsc(v => !v);
    else { setSortKey(key); setSortAsc(true); }
    setPage(1);
  }

  function SortIcon({ k }: { k: SortKey }) {
    if (sortKey !== k) return <ChevronUp size={13} className="opacity-20" />;
    return sortAsc ? <ChevronUp size={13} className="text-[#FF5636]" /> : <ChevronDown size={13} className="text-[#FF5636]" />;
  }

  function handleSave(data: Partial<AdminPlace>) {
    if (drawer === "new") {
      setPlaces(prev => [{ ...data, id: `p${Date.now()}`, created_at: new Date().toISOString(), updated_at: new Date().toISOString() } as AdminPlace, ...prev]);
    } else {
      setPlaces(prev => prev.map(p => p.id === (drawer as AdminPlace).id ? { ...p, ...data } : p));
    }
  }

  function handleDelete(id: string) {
    setPlaces(prev => prev.filter(p => p.id !== id));
  }

  return (
    <>
      {/* Drawer */}
      {drawer && (
        <PlaceDrawer
          place={drawer === "new" ? null : drawer}
          onClose={() => setDrawer(null)}
          onSave={handleSave}
          onDelete={drawer !== "new" ? () => handleDelete((drawer as AdminPlace).id) : undefined}
        />
      )}

      {/* Collection modal */}
      {collecting && <CollectModal onClose={() => setCollecting(false)} />}

      <div className="max-w-6xl mx-auto w-full">
        {/* Top bar */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <div className="relative flex-1 min-w-52">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder="장소명, 주소로 검색"
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#FF5636]/60" />
          </div>

          <select value={filterGrade} onChange={e => { setFilterGrade(e.target.value); setPage(1); }}
            className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none">
            {["전체", "S", "A", "B", "C", "D"].map(g => <option key={g}>{g}</option>)}
          </select>

          <select value={filterCategory} onChange={e => { setFilterCategory(e.target.value); setPage(1); }}
            className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none">
            <option>전체</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{CATEGORY_KO[c]}</option>)}
          </select>

          <div className="flex gap-2 ml-auto">
            <button onClick={() => setCollecting(true)}
              className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700 hover:bg-gray-50">
              <Database size={14} /> 데이터 수집
            </button>
            <button onClick={() => setDrawer("new")}
              className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-[#FF5636] text-white text-sm font-semibold hover:bg-[#e04523]">
              <Plus size={14} /> 장소 추가
            </button>
          </div>
        </div>

        <p className="text-xs text-gray-400 mb-3">총 {filtered.length}개 장소</p>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/60">
                  <th className="text-left px-4 py-3 font-semibold text-gray-500 text-xs">
                    <button className="flex items-center gap-1" onClick={() => toggleSort("name_ko")}>
                      장소명 <SortIcon k="name_ko" />
                    </button>
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-500 text-xs">카테고리</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-500 text-xs">
                    <button className="flex items-center gap-1" onClick={() => toggleSort("grade")}>
                      등급 <SortIcon k="grade" />
                    </button>
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-500 text-xs hidden md:table-cell">점수 (LS/AR/PD/LF)</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-500 text-xs hidden lg:table-cell">
                    <button className="flex items-center gap-1" onClick={() => toggleSort("updated_at")}>
                      업데이트 <SortIcon k="updated_at" />
                    </button>
                  </th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {paginated.map(place => (
                  <tr key={place.id} className="hover:bg-gray-50/50 transition-colors cursor-pointer"
                      onClick={() => setDrawer(place)}>
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">{place.name_ko}</div>
                      <div className="text-xs text-gray-400">{place.address}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-lg">{CATEGORY_KO[place.category] ?? place.category}</span>
                    </td>
                    <td className="px-4 py-3">
                      <GradeBadge grade={place.grade ?? "D"} />
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="text-xs text-gray-500 font-mono">{place.ls_score}/{place.ar_score}/{place.pd_score}/{place.lf_score}</span>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell text-xs text-gray-400">
                      {new Date(place.updated_at).toLocaleDateString("ko-KR")}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button className="text-xs text-[#FF5636] font-medium hover:underline" onClick={e => { e.stopPropagation(); setDrawer(place); }}>수정</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
              <span className="text-xs text-gray-400">{page}/{totalPages} 페이지</span>
              <div className="flex gap-1">
                <button disabled={page === 1} onClick={() => setPage(v => v - 1)}
                  className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs disabled:opacity-30 hover:bg-gray-50">이전</button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const p = Math.max(1, Math.min(totalPages - 4, page - 2)) + i;
                  return (
                    <button key={p} onClick={() => setPage(p)}
                      className={`px-3 py-1.5 rounded-lg text-xs ${p === page ? "bg-[#FF5636] text-white" : "border border-gray-200 hover:bg-gray-50"}`}>
                      {p}
                    </button>
                  );
                })}
                <button disabled={page === totalPages} onClick={() => setPage(v => v + 1)}
                  className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs disabled:opacity-30 hover:bg-gray-50">다음</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
