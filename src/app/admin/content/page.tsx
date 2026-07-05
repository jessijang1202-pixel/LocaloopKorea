"use client";

import { useState } from "react";
import { Plus, Edit2, Trash2, X, Loader2 } from "lucide-react";
import { ConfirmModal } from "@/components/admin/ConfirmModal";
import { useToast } from "@/components/admin/Toast";
import type { LifeTask, GuideArticle } from "@/types/admin";

const STAGE_KO: Record<string, string> = { arrival: "도착", early: "초기생활", stable: "생활안정기", long_term: "장기정착" };
const STAGE_COLORS: Record<string, string> = { arrival: "bg-[#FF5636]/10 text-[#FF5636]", early: "bg-blue-50 text-blue-600", stable: "bg-green-50 text-green-600", long_term: "bg-purple-50 text-purple-600" };
const CAT_KO: Record<string, string> = { transport: "교통", medical: "의료", admin: "행정", culture: "문화예절", life: "생활정보" };
const LANG_FLAGS: Record<string, string> = { ko: "KO", en: "EN", ja: "JP", zh: "ZH", vi: "VI" };

const MOCK_TASKS: LifeTask[] = Array.from({ length: 12 }, (_, i) => ({
  id: `t${i + 1}`,
  name_ko: ["외국인 등록증 신청", "은행 계좌 개설", "유심 구매", "건강보험 가입", "주거지 계약"][i % 5],
  name_en: ["Apply for ARC", "Open Bank Account", "Buy SIM Card", "Health Insurance", "Housing Contract"][i % 5],
  description_ko: "외국인 등록증을 신청하는 방법을 안내합니다.",
  description_en: "Guide for applying for an Alien Registration Card.",
  category: ["행정", "금융", "통신", "의료", "주거"][i % 5],
  stay_stage: (["arrival", "early", "stable", "long_term"] as const)[i % 4],
  prerequisite_ids: [],
  related_place_ids: [],
  status: i % 6 === 0 ? "inactive" : "active",
  created_at: new Date(Date.now() - i * 86400000).toISOString(),
  updated_at: new Date().toISOString(),
}));

const MOCK_ARTICLES: GuideArticle[] = Array.from({ length: 10 }, (_, i) => ({
  id: `a${i + 1}`,
  title_ko: ["한국 지하철 이용법", "편의점 완전 정복", "한국 병원 이용 가이드", "공공기관 이용법", "문화 예절 가이드"][i % 5],
  title_en: ["Korean Subway Guide", "Convenience Store Guide", "Hospital Guide", "Government Office Guide", "Cultural Etiquette"][i % 5],
  content_ko: "내용...",
  content_en: "Content...",
  category: (["transport", "life", "medical", "admin", "culture"] as const)[i % 5],
  language: (["ko", "en", "ja"] as const)[i % 3],
  status: i % 4 === 0 ? "draft" : "published",
  created_at: new Date(Date.now() - i * 86400000).toISOString(),
  updated_at: new Date().toISOString(),
}));

function TaskDrawer({ task, onClose, onSave }: {
  task: LifeTask | null; onClose: () => void;
  onSave: (data: Partial<LifeTask>) => void;
}) {
  const { toast } = useToast();
  const isNew = !task;
  const [form, setForm] = useState<Partial<LifeTask>>(task ?? {
    name_ko: "", name_en: "", description_ko: "", description_en: "",
    category: "", stay_stage: "arrival", status: "active",
  });
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    if (!form.name_ko) { toast("태스크명을 입력하세요.", "error"); return; }
    setSaving(true);
    await new Promise(r => setTimeout(r, 500));
    onSave(form);
    setSaving(false);
    toast(isNew ? "태스크가 추가되었습니다." : "저장되었습니다.");
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <aside className="relative bg-white w-full max-w-sm h-full flex flex-col shadow-2xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 flex-shrink-0">
          <h3 className="font-bold text-gray-900">{isNew ? "태스크 추가" : "태스크 수정"}</h3>
          <button onClick={onClose}><X size={18} className="text-gray-400" /></button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-4">
          <div>
            <label className="text-xs font-semibold text-gray-500 mb-1.5 block">태스크명 (한국어) *</label>
            <input value={form.name_ko ?? ""} onChange={e => setForm(p => ({ ...p, name_ko: e.target.value }))}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#FF5636]/60" />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 mb-1.5 block">태스크명 (영어)</label>
            <input value={form.name_en ?? ""} onChange={e => setForm(p => ({ ...p, name_en: e.target.value }))}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#FF5636]/60" />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 mb-1.5 block">설명 (한국어)</label>
            <textarea value={form.description_ko ?? ""} onChange={e => setForm(p => ({ ...p, description_ko: e.target.value }))}
              rows={3} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm resize-none focus:outline-none focus:border-[#FF5636]/60" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-500 mb-1.5 block">카테고리</label>
              <input value={form.category ?? ""} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#FF5636]/60" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 mb-1.5 block">체류 단계</label>
              <select value={form.stay_stage ?? "arrival"} onChange={e => setForm(p => ({ ...p, stay_stage: e.target.value as LifeTask["stay_stage"] }))}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#FF5636]/60">
                {Object.entries(STAGE_KO).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 mb-1.5 block">상태</label>
            <select value={form.status ?? "active"} onChange={e => setForm(p => ({ ...p, status: e.target.value as "active" | "inactive" }))}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#FF5636]/60">
              <option value="active">활성</option>
              <option value="inactive">비활성</option>
            </select>
          </div>
        </div>
        <div className="flex gap-3 px-5 py-4 border-t border-gray-100">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50">취소</button>
          <button onClick={handleSave} disabled={saving}
            className="flex-1 py-2.5 rounded-xl bg-[#FF5636] text-white text-sm font-semibold flex items-center justify-center gap-2 hover:bg-[#e04523] disabled:opacity-60">
            {saving && <Loader2 size={13} className="animate-spin" />}
            {isNew ? "추가" : "저장"}
          </button>
        </div>
      </aside>
    </div>
  );
}

export default function ContentPage() {
  const [tab, setTab] = useState<"tasks" | "articles">("tasks");
  const [tasks, setTasks] = useState<LifeTask[]>(MOCK_TASKS);
  const [articles] = useState<GuideArticle[]>(MOCK_ARTICLES);
  const [taskDrawer, setTaskDrawer] = useState<LifeTask | null | "new">(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const { toast } = useToast();

  function handleTaskSave(data: Partial<LifeTask>) {
    if (taskDrawer === "new") {
      setTasks(prev => [{ ...data, id: `t${Date.now()}`, prerequisite_ids: [], related_place_ids: [], created_at: new Date().toISOString(), updated_at: new Date().toISOString() } as LifeTask, ...prev]);
    } else {
      setTasks(prev => prev.map(t => t.id === (taskDrawer as LifeTask).id ? { ...t, ...data } : t));
    }
  }

  return (
    <>
      {taskDrawer && <TaskDrawer task={taskDrawer === "new" ? null : taskDrawer} onClose={() => setTaskDrawer(null)} onSave={handleTaskSave} />}
      <ConfirmModal open={!!deleteTarget} title="태스크 삭제" description="이 태스크를 삭제합니다." confirmLabel="삭제" danger
        onConfirm={() => { setTasks(prev => prev.filter(t => t.id !== deleteTarget)); setDeleteTarget(null); toast("삭제되었습니다.", "error"); }}
        onCancel={() => setDeleteTarget(null)} />

      <div className="p-5 max-w-5xl mx-auto">
        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1 w-fit mb-5">
          {(["tasks", "articles"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === t ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
              {t === "tasks" ? "생활 태스크" : "가이드 & 에티켓"}
            </button>
          ))}
        </div>

        {/* Tasks tab */}
        {tab === "tasks" && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs text-gray-400">{tasks.length}개 태스크</p>
              <button onClick={() => setTaskDrawer("new")}
                className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-[#FF5636] text-white text-sm font-semibold hover:bg-[#e04523]">
                <Plus size={14} /> 태스크 추가
              </button>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/60">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">태스크명</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 hidden sm:table-cell">카테고리</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 hidden md:table-cell">체류 단계</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">상태</th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {tasks.map(task => (
                    <tr key={task.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-900">{task.name_ko}</p>
                        <p className="text-xs text-gray-400">{task.name_en}</p>
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-lg">{task.category}</span>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        {task.stay_stage && (
                          <span className={`text-xs px-2 py-1 rounded-lg font-medium ${STAGE_COLORS[task.stay_stage]}`}>
                            {STAGE_KO[task.stay_stage]}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-[10px] font-semibold px-2 py-1 rounded-full ${task.status === "active" ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-400"}`}>
                          {task.status === "active" ? "활성" : "비활성"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => setTaskDrawer(task)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700"><Edit2 size={13} /></button>
                          <button onClick={() => setDeleteTarget(task.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-300 hover:text-red-400"><Trash2 size={13} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Articles tab */}
        {tab === "articles" && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs text-gray-400">{articles.length}개 아티클</p>
              <button className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-[#FF5636] text-white text-sm font-semibold hover:bg-[#e04523]">
                <Plus size={14} /> 아티클 추가
              </button>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/60">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">제목</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 hidden sm:table-cell">카테고리</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 hidden md:table-cell">언어</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">상태</th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {articles.map(article => (
                    <tr key={article.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-900">{article.title_ko}</p>
                        <p className="text-xs text-gray-400">{article.title_en}</p>
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-lg">{article.category ? CAT_KO[article.category] : "-"}</span>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-lg font-mono">{LANG_FLAGS[article.language]}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-[10px] font-semibold px-2 py-1 rounded-full ${article.status === "published" ? "bg-green-50 text-green-600" : "bg-amber-50 text-amber-600"}`}>
                          {article.status === "published" ? "게시됨" : "초안"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700"><Edit2 size={13} /></button>
                          <button className="p-1.5 rounded-lg hover:bg-red-50 text-gray-300 hover:text-red-400"><Trash2 size={13} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
