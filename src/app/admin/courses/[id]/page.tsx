"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Plus, Trash2, GripVertical, Loader2, ToggleLeft, ToggleRight } from "lucide-react";
import { useToast } from "@/components/admin/Toast";
import { ConfirmModal } from "@/components/admin/ConfirmModal";

const THEMES = ["음식 탐방", "카페 투어", "역사 문화", "쇼핑", "야경", "자연", "로컬 마켓"];

const MOCK_COURSE = {
  id: "c1",
  name_ko: "이태원 로컬 먹방",
  name_en: "Itaewon Local Food Tour",
  description_ko: "외국인이 진짜 로컬처럼 즐길 수 있는 이태원의 숨겨진 맛집 코스입니다.",
  description_en: "A hidden gem food tour in Itaewon for foreigners who want to eat like a local.",
  region: "이태원",
  theme: "음식 탐방",
  language_level: "beginner",
  budget_min: 30000,
  budget_max: 60000,
  duration_minutes: 180,
  status: "active" as const,
  places: [
    { id: "cp1", place_id: "p1", name_ko: "라이너스 BBQ", grade: "S" },
    { id: "cp2", place_id: "p7", name_ko: "더 나인 카페",  grade: "A" },
    { id: "cp3", place_id: "p8", name_ko: "이태원 클럽",   grade: "B" },
  ],
};

const GRADE_COLORS: Record<string, string> = { S: "#FF5636", A: "#12BFB6", B: "#7B4DFF", C: "#FFC93C", D: "#9A9488" };

export default function CourseEditorPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { toast } = useToast();
  const isNew = id === "new";

  const [form, setForm] = useState(isNew ? {
    name_ko: "", name_en: "", description_ko: "", description_en: "",
    region: "", theme: "", language_level: "beginner", budget_min: 0, budget_max: 0,
    duration_minutes: 60, status: "active" as const, places: [] as typeof MOCK_COURSE.places,
  } : MOCK_COURSE);

  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  function setF<K extends keyof typeof form>(k: K, v: (typeof form)[K]) {
    setForm(prev => ({ ...prev, [k]: v }));
  }

  function movePlace(i: number, dir: -1 | 1) {
    const arr = [...form.places];
    const j = i + dir;
    if (j < 0 || j >= arr.length) return;
    [arr[i], arr[j]] = [arr[j], arr[i]];
    setF("places", arr);
  }

  function removePlace(id: string) {
    setF("places", form.places.filter(p => p.id !== id));
  }

  async function handleSave() {
    if (!form.name_ko) { toast("코스명을 입력하세요.", "error"); return; }
    setSaving(true);
    await new Promise(r => setTimeout(r, 700));
    setSaving(false);
    toast(isNew ? "코스가 추가되었습니다." : "저장되었습니다.");
    if (isNew) router.push("/admin/courses");
  }

  return (
    <>
      <ConfirmModal
        open={deleteConfirm}
        title="코스 삭제"
        description={`"${form.name_ko}" 코스를 삭제합니다. 이 작업은 되돌릴 수 없습니다.`}
        confirmLabel="삭제" danger
        onConfirm={() => { toast("코스가 삭제되었습니다.", "error"); router.push("/admin/courses"); }}
        onCancel={() => setDeleteConfirm(false)}
      />

      <div className="max-w-3xl mx-auto w-full">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => router.back()} className="p-2 rounded-xl hover:bg-gray-100 text-gray-500">
            <ArrowLeft size={18} />
          </button>
          <h2 className="font-bold text-gray-900 text-lg flex-1">{isNew ? "새 코스 추가" : form.name_ko}</h2>
          <button onClick={() => setF("status", form.status === "active" ? "inactive" : "active")}
            className="flex items-center gap-1.5 text-sm font-medium">
            {form.status === "active"
              ? <><ToggleRight size={22} className="text-green-500" /><span className="text-green-600">활성</span></>
              : <><ToggleLeft size={22} className="text-gray-300" /><span className="text-gray-400">비활성</span></>
            }
          </button>
        </div>

        <div className="flex flex-col gap-5">
          {/* Basic info */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-4">
            <h3 className="font-semibold text-gray-800 text-sm">기본 정보</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1.5 block">코스명 (한국어) *</label>
                <input value={form.name_ko} onChange={e => setF("name_ko", e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#FF5636]/60" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1.5 block">코스명 (영어)</label>
                <input value={form.name_en ?? ""} onChange={e => setF("name_en", e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#FF5636]/60" />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 mb-1.5 block">설명 (한국어)</label>
              <textarea value={form.description_ko ?? ""} onChange={e => setF("description_ko", e.target.value)}
                rows={3} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm resize-none focus:outline-none focus:border-[#FF5636]/60" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 mb-1.5 block">설명 (영어)</label>
              <textarea value={form.description_en ?? ""} onChange={e => setF("description_en", e.target.value)}
                rows={3} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm resize-none focus:outline-none focus:border-[#FF5636]/60" />
            </div>
          </div>

          {/* Meta */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-4">
            <h3 className="font-semibold text-gray-800 text-sm">코스 설정</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1.5 block">지역</label>
                <input value={form.region ?? ""} onChange={e => setF("region", e.target.value)}
                  placeholder="예: 이태원"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#FF5636]/60" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1.5 block">테마</label>
                <select value={form.theme ?? ""} onChange={e => setF("theme", e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#FF5636]/60">
                  <option value="">선택</option>
                  {THEMES.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1.5 block">언어 수준</label>
                <select value={form.language_level ?? "beginner"} onChange={e => setF("language_level", e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#FF5636]/60">
                  <option value="beginner">초급</option>
                  <option value="intermediate">중급</option>
                  <option value="advanced">고급</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1.5 block">예산 최소 (₩)</label>
                <input type="number" value={form.budget_min ?? ""} onChange={e => setF("budget_min", Number(e.target.value))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#FF5636]/60" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1.5 block">예산 최대 (₩)</label>
                <input type="number" value={form.budget_max ?? ""} onChange={e => setF("budget_max", Number(e.target.value))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#FF5636]/60" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1.5 block">소요 시간 (분)</label>
                <input type="number" value={form.duration_minutes ?? ""} onChange={e => setF("duration_minutes", Number(e.target.value))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#FF5636]/60" />
              </div>
            </div>
          </div>

          {/* Places */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800 text-sm">포함 장소 ({form.places.length}개)</h3>
              <button className="flex items-center gap-1.5 text-xs text-[#FF5636] font-semibold hover:underline">
                <Plus size={13} /> 장소 추가
              </button>
            </div>
            <div className="flex flex-col gap-2">
              {form.places.map((place, i) => (
                <div key={place.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <GripVertical size={16} className="text-gray-300 cursor-grab flex-shrink-0" />
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                       style={{ background: GRADE_COLORS[place.grade] }}>
                    {place.grade}
                  </div>
                  <span className="flex-1 text-sm font-medium text-gray-800">{place.name_ko}</span>
                  <div className="flex gap-1">
                    <button onClick={() => movePlace(i, -1)} disabled={i === 0}
                      className="p-1 rounded hover:bg-gray-200 text-gray-400 disabled:opacity-30 text-xs">↑</button>
                    <button onClick={() => movePlace(i, 1)} disabled={i === form.places.length - 1}
                      className="p-1 rounded hover:bg-gray-200 text-gray-400 disabled:opacity-30 text-xs">↓</button>
                  </div>
                  <button onClick={() => removePlace(place.id)} className="p-1 rounded hover:bg-red-100 text-gray-300 hover:text-red-400">
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
              {form.places.length === 0 && (
                <p className="text-xs text-gray-400 text-center py-6">장소를 추가하세요</p>
              )}
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex gap-3 mt-6">
          {!isNew && (
            <button onClick={() => setDeleteConfirm(true)}
              className="px-4 py-2.5 rounded-xl border border-red-200 text-red-400 text-sm font-medium hover:bg-red-50 flex items-center gap-2">
              <Trash2 size={14} /> 삭제
            </button>
          )}
          <button onClick={() => router.back()}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50">
            취소
          </button>
          <button onClick={handleSave} disabled={saving}
            className="flex-1 py-2.5 rounded-xl bg-[#FF5636] text-white text-sm font-semibold flex items-center justify-center gap-2 hover:bg-[#e04523] disabled:opacity-60">
            {saving && <Loader2 size={14} className="animate-spin" />}
            {isNew ? "추가" : "저장"}
          </button>
        </div>
      </div>
    </>
  );
}
