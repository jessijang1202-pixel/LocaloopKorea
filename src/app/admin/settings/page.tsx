"use client";

import { useState } from "react";
import { Save, Eye, EyeOff, Loader2, RotateCcw, Copy } from "lucide-react";
import { useToast } from "@/components/admin/Toast";

type CronInterval = "hourly" | "daily" | "weekly";

interface GradeWeights {
  ls: number;
  ar: number;
  pd: number;
  lf: number;
}

const DEFAULT_WEIGHTS: GradeWeights = { ls: 25, ar: 25, pd: 25, lf: 25 };

function sum(w: GradeWeights) {
  return w.ls + w.ar + w.pd + w.lf;
}

export default function SettingsPage() {
  const { toast } = useToast();
  const [saving, setSaving] = useState<string | null>(null);

  // Admin profile
  const [profile, setProfile] = useState({ name: "Admin", email: "admin@localoop.kr" });

  // Grade weights
  const [weights, setWeights] = useState<GradeWeights>(DEFAULT_WEIGHTS);

  // Cron
  const [cronInterval, setCronInterval] = useState<CronInterval>("daily");
  const [cronHour, setCronHour] = useState(3);

  // Notifications
  const [notifyNewUser, setNotifyNewUser] = useState(true);
  const [notifyDataJob, setNotifyDataJob] = useState(true);
  const [notifyReport, setNotifyReport] = useState(false);

  // API keys
  const [googleKey, setGoogleKey] = useState("AIzaSy•••••••••••••••••••••");
  const [naverKey, setNaverKey] = useState("naver_api_•••••••••••••••");
  const [showGoogle, setShowGoogle] = useState(false);
  const [showNaver, setShowNaver] = useState(false);

  const weightTotal = sum(weights);

  function setW(key: keyof GradeWeights, val: number) {
    setWeights(prev => ({ ...prev, [key]: val }));
  }

  async function save(section: string) {
    setSaving(section);
    await new Promise(r => setTimeout(r, 600));
    setSaving(null);
    toast("저장되었습니다.");
  }

  function copyKey(key: string) {
    navigator.clipboard.writeText(key).then(() => toast("복사되었습니다."));
  }

  return (
    <div className="p-5 max-w-2xl mx-auto flex flex-col gap-5">

      {/* Admin profile */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h3 className="font-semibold text-gray-800 text-sm mb-4">관리자 프로필</h3>
        <div className="flex flex-col gap-3">
          <div>
            <label className="text-xs font-semibold text-gray-500 mb-1.5 block">이름</label>
            <input value={profile.name} onChange={e => setProfile(p => ({ ...p, name: e.target.value }))}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#FF5636]/60" />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 mb-1.5 block">이메일</label>
            <input value={profile.email} onChange={e => setProfile(p => ({ ...p, email: e.target.value }))}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#FF5636]/60" />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 mb-1.5 block">새 비밀번호 (변경 시)</label>
            <input type="password" placeholder="••••••••"
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#FF5636]/60" />
          </div>
        </div>
        <button onClick={() => save("profile")} disabled={saving === "profile"}
          className="mt-4 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#FF5636] text-white text-sm font-semibold hover:bg-[#e04523] disabled:opacity-60">
          {saving === "profile" ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
          저장
        </button>
      </div>

      {/* Grade weights */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-800 text-sm">등급 가중치</h3>
          <div className="flex items-center gap-3">
            <span className={`text-xs font-bold ${weightTotal === 100 ? "text-green-600" : "text-red-500"}`}>
              합계: {weightTotal}%
            </span>
            <button onClick={() => setWeights(DEFAULT_WEIGHTS)} className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600">
              <RotateCcw size={12} /> 초기화
            </button>
          </div>
        </div>
        <p className="text-xs text-gray-400 mb-4">4개 항목의 합이 100%가 되어야 저장할 수 있습니다.</p>
        <div className="flex flex-col gap-4">
          {(["ls","ar","pd","lf"] as const).map(key => {
            const labels: Record<string, string> = { ls: "생활 편의 (LS)", ar: "외국인 친화 (AR)", pd: "물리적 접근 (PD)", lf: "영어 지원 (LF)" };
            return (
              <div key={key}>
                <div className="flex justify-between mb-1.5">
                  <label className="text-xs font-semibold text-gray-600">{labels[key]}</label>
                  <span className="text-xs font-bold text-gray-800">{weights[key]}%</span>
                </div>
                <input type="range" min={0} max={100} value={weights[key]} onChange={e => setW(key, Number(e.target.value))}
                  className="w-full accent-[#FF5636] h-2 rounded-full" />
              </div>
            );
          })}
        </div>
        <button onClick={() => save("weights")} disabled={saving === "weights" || weightTotal !== 100}
          className="mt-5 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#FF5636] text-white text-sm font-semibold hover:bg-[#e04523] disabled:opacity-60">
          {saving === "weights" ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
          저장
        </button>
      </div>

      {/* Cron schedule */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h3 className="font-semibold text-gray-800 text-sm mb-4">데이터 수집 스케줄</h3>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-xs font-semibold text-gray-500 mb-1.5 block">수집 주기</label>
            <select value={cronInterval} onChange={e => setCronInterval(e.target.value as CronInterval)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#FF5636]/60">
              <option value="hourly">매시간</option>
              <option value="daily">매일</option>
              <option value="weekly">매주</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 mb-1.5 block">실행 시각 (시)</label>
            <select value={cronHour} onChange={e => setCronHour(Number(e.target.value))}
              disabled={cronInterval === "hourly"}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#FF5636]/60 disabled:opacity-40">
              {Array.from({ length: 24 }, (_, i) => (
                <option key={i} value={i}>{String(i).padStart(2, "0")}:00</option>
              ))}
            </select>
          </div>
        </div>
        <div className="bg-gray-50 rounded-xl px-4 py-3 mb-4">
          <p className="text-xs text-gray-500">
            현재 스케줄:&nbsp;
            <span className="font-semibold text-gray-700">
              {cronInterval === "hourly" ? "매시 00분" : cronInterval === "daily" ? `매일 ${String(cronHour).padStart(2, "0")}:00` : `매주 월요일 ${String(cronHour).padStart(2, "0")}:00`}
            </span>
          </p>
        </div>
        <button onClick={() => save("cron")} disabled={saving === "cron"}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#FF5636] text-white text-sm font-semibold hover:bg-[#e04523] disabled:opacity-60">
          {saving === "cron" ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
          저장
        </button>
      </div>

      {/* Notification settings */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h3 className="font-semibold text-gray-800 text-sm mb-4">알림 설정</h3>
        <div className="flex flex-col gap-3">
          {[
            { label: "신규 사용자 가입 알림", val: notifyNewUser, set: setNotifyNewUser },
            { label: "데이터 수집 완료 알림", val: notifyDataJob, set: setNotifyDataJob },
            { label: "신고 접수 알림",         val: notifyReport, set: setNotifyReport },
          ].map(({ label, val, set }) => (
            <div key={label} className="flex items-center justify-between py-1">
              <span className="text-sm text-gray-700">{label}</span>
              <button onClick={() => set(!val)}
                className={`w-11 h-6 rounded-full transition-colors relative ${val ? "bg-[#FF5636]" : "bg-gray-200"}`}>
                <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${val ? "translate-x-6" : "translate-x-1"}`} />
              </button>
            </div>
          ))}
        </div>
        <button onClick={() => save("notifications")} disabled={saving === "notifications"}
          className="mt-4 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#FF5636] text-white text-sm font-semibold hover:bg-[#e04523] disabled:opacity-60">
          {saving === "notifications" ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
          저장
        </button>
      </div>

      {/* API keys */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h3 className="font-semibold text-gray-800 text-sm mb-1">API 키 관리</h3>
        <p className="text-xs text-gray-400 mb-4">키는 환경 변수에 저장됩니다. 여기서 변경 시 서버 재시작이 필요할 수 있습니다.</p>
        <div className="flex flex-col gap-4">
          {/* Google */}
          <div>
            <label className="text-xs font-semibold text-gray-500 mb-1.5 block">Google Maps API Key</label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type={showGoogle ? "text" : "password"}
                  value={googleKey} onChange={e => setGoogleKey(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl pl-3 pr-10 py-2.5 text-sm font-mono focus:outline-none focus:border-[#FF5636]/60" />
                <button onClick={() => setShowGoogle(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showGoogle ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
              <button onClick={() => copyKey(googleKey)} className="p-2.5 border border-gray-200 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-50">
                <Copy size={14} />
              </button>
            </div>
          </div>
          {/* Naver */}
          <div>
            <label className="text-xs font-semibold text-gray-500 mb-1.5 block">Naver Places API Key</label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type={showNaver ? "text" : "password"}
                  value={naverKey} onChange={e => setNaverKey(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl pl-3 pr-10 py-2.5 text-sm font-mono focus:outline-none focus:border-[#FF5636]/60" />
                <button onClick={() => setShowNaver(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showNaver ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
              <button onClick={() => copyKey(naverKey)} className="p-2.5 border border-gray-200 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-50">
                <Copy size={14} />
              </button>
            </div>
          </div>
        </div>
        <button onClick={() => save("apikeys")} disabled={saving === "apikeys"}
          className="mt-5 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#FF5636] text-white text-sm font-semibold hover:bg-[#e04523] disabled:opacity-60">
          {saving === "apikeys" ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
          저장
        </button>
      </div>

    </div>
  );
}
