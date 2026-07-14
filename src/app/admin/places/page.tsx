"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  fetchAdminPlaces,
  fetchRegions,
  createPlace,
  updatePlace,
  deletePlace,
  type AdminPlaceRow,
  type RegionOption,
  type PlaceInput,
} from "@/lib/admin/places-db";
import { ADMIN_GRADE_COLORS, ADMIN_GRADE_TEXT } from "@/lib/grades";
import { CARD_SOFT } from "@/components/admin/adminStyles";

const MUTED = "#8A8478";
const ACCENT = "#FF5636";
const DANGER = "#C4453B";

const CATEGORY_OPTIONS: { value: string; label: string }[] = [
  { value: "restaurant", label: "음식점" },
  { value: "cafe", label: "카페" },
  { value: "bar", label: "바" },
  { value: "market", label: "시장/마트" },
  { value: "accommodation", label: "숙박" },
  { value: "activity", label: "액티비티" },
  { value: "experience", label: "체험(원데이클래스)" },
  { value: "health", label: "병원/약국" },
  { value: "beauty", label: "뷰티" },
  { value: "shopping", label: "쇼핑" },
];

const CATEGORY_LABELS: Record<string, string> = Object.fromEntries(
  CATEGORY_OPTIONS.map((o) => [o.value, o.label])
);

function formatDate(value: string | null | undefined): string {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}.${m}.${day}`;
}

function errMessage(e: unknown): string {
  return e instanceof Error ? e.message : String(e);
}

function GradeBadge({ grade }: { grade: string | null }) {
  const empty = !grade;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: 30,
        height: 30,
        borderRadius: 9,
        background: empty ? "#F0EBDE" : ADMIN_GRADE_COLORS[grade] ?? "#9A9488",
        color: empty ? "#B3AC9F" : ADMIN_GRADE_TEXT[grade] ?? "#fff",
        fontSize: 14,
        fontWeight: 700,
        fontFamily: "'Space Grotesk', sans-serif",
      }}
    >
      {empty ? "—" : grade}
    </span>
  );
}

function FlagChip({ label }: { label: string }) {
  return (
    <span
      style={{
        fontSize: 11,
        fontWeight: 600,
        padding: "2px 7px",
        borderRadius: 6,
        background: "#F2EDE4",
        color: "#6C665B",
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </span>
  );
}

const TH: React.CSSProperties = {
  padding: "13px 16px",
  textAlign: "left",
  fontSize: 12.5,
  fontWeight: 600,
  color: MUTED,
  whiteSpace: "nowrap",
};

const TH_CENTER: React.CSSProperties = { ...TH, textAlign: "center" };

const TD: React.CSSProperties = {
  padding: "13px 16px",
  fontSize: 14,
  color: "#16151A",
  verticalAlign: "middle",
};

const INPUT_BASE: React.CSSProperties = {
  boxSizing: "border-box",
  padding: "9px 12px",
  borderRadius: 10,
  border: "1px solid #E5DED4",
  fontSize: 13.5,
  outline: "none",
  background: "#fff",
  color: "#16151A",
  width: "100%",
};

export default function PlacesPage() {
  const [places, setPlaces] = useState<AdminPlaceRow[] | null>(null);
  const [regions, setRegions] = useState<RegionOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [showCollect, setShowCollect] = useState(false);

  const regionMap = useMemo(() => {
    const m = new Map<string, RegionOption>();
    for (const r of regions) m.set(r.id, r);
    return m;
  }, [regions]);

  const selected = useMemo(
    () => places?.find((p) => p.id === selectedId) ?? null,
    [places, selectedId]
  );

  const reload = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const [rows, regionRows] = await Promise.all([
        fetchAdminPlaces(),
        fetchRegions(),
      ]);
      setPlaces(rows);
      setRegions(regionRows);
    } catch (e) {
      setLoadError(errMessage(e));
      setPlaces(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  const openCreate = () => {
    setSelectedId(null);
    setCreating(true);
  };

  const handleCreated = async (id: string) => {
    setCreating(false);
    await reload();
    setSelectedId(id);
  };

  return (
    <div
      style={{
        maxWidth: 1200,
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        gap: 20,
      }}
    >
      {/* Header row */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 16,
          flexWrap: "wrap",
        }}
      >
        <div style={{ fontSize: 13, color: MUTED, maxWidth: 620, lineHeight: 1.6 }}>
          장소를 추가·수정·삭제하면 등급 엔진과 로컬 지수, 사용자 앱에 바로
          반영됩니다.
        </div>
        <div style={{ display: "flex", gap: 10, flexShrink: 0 }}>
          <button
            onClick={() => setShowCollect((v) => !v)}
            style={{
              padding: "10px 18px",
              borderRadius: 12,
              background: "#fff",
              color: ACCENT,
              border: `1px solid ${ACCENT}`,
              cursor: "pointer",
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            데이터 수집
          </button>
          <button
            onClick={openCreate}
            style={{
              padding: "10px 18px",
              borderRadius: 12,
              background: ACCENT,
              color: "#fff",
              border: "none",
              cursor: "pointer",
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            새 장소 추가
          </button>
        </div>
      </div>

      {showCollect && <CollectPanel onCollected={reload} />}

      {/* Places table */}
      <div style={{ ...CARD_SOFT, overflow: "hidden" }}>
        {loading ? (
          <div style={{ padding: "48px 20px", textAlign: "center", color: MUTED, fontSize: 14 }}>
            불러오는 중...
          </div>
        ) : loadError ? (
          <div style={{ padding: "36px 24px", color: ACCENT, fontSize: 13.5 }}>
            <div style={{ fontWeight: 600, marginBottom: 8 }}>{loadError}</div>
            <div style={{ color: MUTED, fontSize: 12.5 }}>
              마이그레이션 20260712_admin_manage.sql 적용 여부를 확인하세요.
            </div>
          </div>
        ) : !places || places.length === 0 ? (
          <div style={{ padding: "48px 20px", textAlign: "center", color: MUTED, fontSize: 14 }}>
            장소 데이터가 없습니다. &quot;새 장소 추가&quot;로 첫 장소를
            등록하세요.
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 860 }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #F0EBDE", background: "#FAFAF8" }}>
                  <th style={TH}>장소</th>
                  <th style={TH}>카테고리</th>
                  <th style={TH}>지역</th>
                  <th style={TH_CENTER}>등급</th>
                  <th style={TH}>속성</th>
                  <th style={TH}>등록일</th>
                </tr>
              </thead>
              <tbody>
                {places.map((p, i) => {
                  const active = p.id === selectedId;
                  const region = p.region_id ? regionMap.get(p.region_id) : null;
                  return (
                    <tr
                      key={p.id}
                      className="admin-row"
                      onClick={() => {
                        setCreating(false);
                        setSelectedId(active ? null : p.id);
                      }}
                      style={{
                        borderTop: i === 0 ? "none" : "1px solid #F5F0EA",
                        cursor: "pointer",
                        background: active ? "#FBF4F1" : undefined,
                      }}
                    >
                      <td style={TD}>
                        <div style={{ fontWeight: 500 }}>{p.name_ko}</div>
                        {p.name_en && (
                          <div style={{ fontSize: 12, color: MUTED, marginTop: 2 }}>
                            {p.name_en}
                          </div>
                        )}
                      </td>
                      <td style={{ ...TD, fontSize: 13.5, color: "#6C665B" }}>
                        {CATEGORY_LABELS[p.category] ?? p.category}
                      </td>
                      <td style={{ ...TD, fontSize: 13.5, color: "#6C665B" }}>
                        {region ? region.name_ko : "—"}
                      </td>
                      <td style={{ ...TD, textAlign: "center" }}>
                        <GradeBadge grade={p.grade} />
                      </td>
                      <td style={TD}>
                        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                          {p.english_support && <FlagChip label="EN" />}
                          {p.card_payment && <FlagChip label="카드" />}
                          {p.solo_friendly && <FlagChip label="혼자" />}
                        </div>
                      </td>
                      <td style={{ ...TD, fontSize: 13, color: "#B3AC9F" }}>
                        {formatDate(p.created_at)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Editor panel */}
      {creating ? (
        <PlaceEditor
          key="create"
          mode="create"
          place={null}
          regions={regions}
          onClose={() => setCreating(false)}
          onCreated={handleCreated}
          onUpdated={reload}
          onDeleted={reload}
        />
      ) : selected ? (
        <PlaceEditor
          key={selected.id}
          mode="edit"
          place={selected}
          regions={regions}
          onClose={() => setSelectedId(null)}
          onCreated={handleCreated}
          onUpdated={reload}
          onDeleted={async () => {
            setSelectedId(null);
            await reload();
          }}
        />
      ) : null}
    </div>
  );
}

// ── Data collection panel (patent no.2 module 100) ──────────────────────────

const COLLECT_CATEGORIES: { value: string; label: string }[] = [
  { value: "restaurant", label: "음식점" },
  { value: "cafe", label: "카페" },
  { value: "bar", label: "바" },
  { value: "activity", label: "문화·명소" },
  { value: "experience", label: "체험(원데이클래스)" },
  { value: "accommodation", label: "숙박" },
];

interface CollectResponse {
  found: number;
  added: number;
  updated: number;
  sourcesCollected: number;
  graded: number;
  errors: string[];
  naverEnabled: boolean;
}

function CollectPanel({ onCollected }: { onCollected: () => Promise<void> }) {
  const [region, setRegion] = useState("");
  const [selected, setSelected] = useState<Record<string, boolean>>({
    restaurant: true,
    cafe: true,
    bar: true,
    activity: true,
    accommodation: false,
  });
  const [limit, setLimit] = useState(5);
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<CollectResponse | null>(null);
  const [keyError, setKeyError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const toggle = (value: string) =>
    setSelected((s) => ({ ...s, [value]: !s[value] }));

  const run = async () => {
    const categories = COLLECT_CATEGORIES.map((c) => c.value).filter(
      (v) => selected[v]
    );
    if (!region.trim()) {
      setError("지역을 입력하세요.");
      return;
    }
    if (categories.length === 0) {
      setError("카테고리를 하나 이상 선택하세요.");
      return;
    }
    setRunning(true);
    setError(null);
    setKeyError(null);
    setResult(null);
    try {
      const res = await fetch("/api/admin/collect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          region: region.trim(),
          categories,
          limitPerCategory: limit,
        }),
      });
      const json = (await res.json()) as CollectResponse & { error?: string };
      if (res.status === 501) {
        setKeyError(json.error ?? "KAKAO_REST_API_KEY가 설정되지 않았습니다.");
        return;
      }
      if (!res.ok) {
        setError(json.error ?? `수집 실패 (${res.status})`);
        return;
      }
      setResult(json);
      await onCollected();
    } catch (e) {
      setError(errMessage(e));
    } finally {
      setRunning(false);
    }
  };

  return (
    <div
      style={{
        ...CARD_SOFT,
        borderTop: `3px solid ${ACCENT}`,
        padding: "20px 24px 24px",
        display: "flex",
        flexDirection: "column",
        gap: 18,
      }}
    >
      <div>
        <div
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 700,
            fontSize: 15,
            color: "#16151A",
          }}
        >
          데이터 수집
        </div>
        <div style={{ fontSize: 12.5, color: MUTED, marginTop: 4, lineHeight: 1.6 }}>
          지역을 입력하면 카카오 로컬 API로 장소를 자동 발견하고, 네이버 리뷰를
          모아 등급·로컬 지수를 산출합니다.
        </div>
      </div>

      <Field label="지역">
        <input
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          placeholder="예: 압구정, 성수동, 연남동"
          style={{ ...INPUT_BASE, maxWidth: 360 }}
        />
      </Field>

      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <span style={{ fontSize: 12.5, color: "#6C665B", fontWeight: 500 }}>
          카테고리
        </span>
        <div style={{ display: "flex", gap: 18, flexWrap: "wrap" }}>
          {COLLECT_CATEGORIES.map((c) => (
            <label
              key={c.value}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 7,
                fontSize: 13.5,
                color: "#16151A",
                cursor: "pointer",
              }}
            >
              <input
                type="checkbox"
                checked={selected[c.value] ?? false}
                onChange={() => toggle(c.value)}
                style={{ width: 16, height: 16, accentColor: ACCENT }}
              />
              {c.label}
            </label>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "flex-end", gap: 16, flexWrap: "wrap" }}>
        <Field label="개수 (카테고리별)">
          <select
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
            style={{ ...INPUT_BASE, width: 120 }}
          >
            <option value={3}>3</option>
            <option value={5}>5</option>
            <option value={10}>10</option>
          </select>
        </Field>
        <button
          onClick={run}
          disabled={running}
          style={{
            padding: "10px 20px",
            borderRadius: 10,
            background: ACCENT,
            color: "#fff",
            border: "none",
            fontSize: 14,
            fontWeight: 600,
            cursor: running ? "default" : "pointer",
            opacity: running ? 0.7 : 1,
          }}
        >
          {running ? "수집 중..." : "실행"}
        </button>
      </div>

      {error && (
        <div style={{ color: ACCENT, fontSize: 12.5 }}>{error}</div>
      )}

      {keyError && (
        <div
          style={{
            background: "#FBF4F1",
            borderRadius: 10,
            padding: "12px 14px",
            fontSize: 12.5,
            color: "#6C665B",
            lineHeight: 1.7,
          }}
        >
          <div style={{ color: ACCENT, fontWeight: 600, marginBottom: 4 }}>
            {keyError}
          </div>
          카카오 개발자 콘솔(developers.kakao.com) &gt; 내 애플리케이션 &gt; 앱 키
          &gt; REST API 키를 복사해 .env.local과 Vercel 환경변수에
          KAKAO_REST_API_KEY로 추가하세요.
        </div>
      )}

      {result && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ fontSize: 13.5, color: "#16151A", fontWeight: 500 }}>
            {result.found}곳 발견, {result.added}곳 추가, {result.sourcesCollected}건
            리뷰 수집, {result.graded}곳 등급 산출
          </div>
          {!result.naverEnabled && (
            <div style={{ fontSize: 12, color: MUTED, lineHeight: 1.6 }}>
              네이버 API 키(NAVER_CLIENT_ID/SECRET)가 없어 리뷰 수집은 건너뜀 —
              장소만 추가되고 등급은 소스 추가 후 산출됩니다.
            </div>
          )}
          {result.errors.length > 0 && (
            <div style={{ fontSize: 12, color: ACCENT, lineHeight: 1.6 }}>
              {result.errors.slice(0, 5).map((e, i) => (
                <div key={i}>{e}</div>
              ))}
              {result.errors.length > 5 && (
                <div>외 {result.errors.length - 5}건</div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontFamily: "'Space Grotesk', sans-serif",
        fontWeight: 700,
        fontSize: 14.5,
        color: "#16151A",
        marginBottom: 12,
      }}
    >
      {children}
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <span style={{ fontSize: 12.5, color: "#6C665B", fontWeight: 500 }}>
        {label}
      </span>
      {children}
    </label>
  );
}

interface FormState {
  name_ko: string;
  name_en: string;
  slug: string;
  category: string;
  region_id: string;
  address: string;
  lat: string;
  lng: string;
  image_url: string;
  phone: string;
  hours: string;
  memo: string;
  description_ko: string;
  description_en: string;
  english_support: boolean;
  card_payment: boolean;
  solo_friendly: boolean;
}

function initialForm(place: AdminPlaceRow | null): FormState {
  return {
    name_ko: place?.name_ko ?? "",
    name_en: place?.name_en ?? "",
    slug: place?.slug ?? "",
    category: place?.category ?? "restaurant",
    region_id: place?.region_id ?? "",
    address: place?.address ?? "",
    lat: place?.lat != null ? String(place.lat) : "",
    lng: place?.lng != null ? String(place.lng) : "",
    image_url: place?.image_url ?? "",
    phone: place?.phone ?? "",
    hours: place?.hours ?? "",
    memo: place?.memo ?? "",
    description_ko: place?.description_ko ?? "",
    description_en: place?.description_en ?? "",
    english_support: place?.english_support ?? false,
    card_payment: place?.card_payment ?? true,
    solo_friendly: place?.solo_friendly ?? true,
  };
}

function trimOrNull(v: string): string | null {
  const t = v.trim();
  return t ? t : null;
}

function numOrNull(v: string): number | null {
  const t = v.trim();
  if (!t) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

function PlaceEditor({
  mode,
  place,
  regions,
  onClose,
  onCreated,
  onUpdated,
  onDeleted,
}: {
  mode: "create" | "edit";
  place: AdminPlaceRow | null;
  regions: RegionOption[];
  onClose: () => void;
  onCreated: (id: string) => Promise<void>;
  onUpdated: () => Promise<void>;
  onDeleted: () => Promise<void>;
}) {
  const [form, setForm] = useState<FormState>(() => initialForm(place));
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  // Reset the two-step delete confirmation after 3s.
  useEffect(() => {
    if (!confirmDelete) return;
    const t = setTimeout(() => setConfirmDelete(false), 3000);
    return () => clearTimeout(t);
  }, [confirmDelete]);

  const buildInput = (): PlaceInput => ({
    name_ko: form.name_ko.trim(),
    name_en: form.name_en.trim(),
    slug: form.slug.trim() || undefined,
    category: form.category,
    region_id: form.region_id || null,
    address: trimOrNull(form.address),
    lat: numOrNull(form.lat),
    lng: numOrNull(form.lng),
    image_url: trimOrNull(form.image_url),
    phone: trimOrNull(form.phone),
    hours: trimOrNull(form.hours),
    memo: trimOrNull(form.memo),
    description_ko: trimOrNull(form.description_ko),
    description_en: trimOrNull(form.description_en),
    english_support: form.english_support,
    card_payment: form.card_payment,
    solo_friendly: form.solo_friendly,
  });

  const handleSave = async () => {
    if (!form.name_ko.trim() || !form.name_en.trim()) {
      setActionError("이름(한국어)과 이름(영어)은 필수입니다.");
      return;
    }
    setSaving(true);
    setActionError(null);
    try {
      if (mode === "create") {
        const id = await createPlace(buildInput());
        await onCreated(id);
      } else if (place) {
        await updatePlace(place.id, buildInput());
        await onUpdated();
      }
    } catch (e) {
      setActionError(errMessage(e));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!place) return;
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    setDeleting(true);
    setActionError(null);
    try {
      await deletePlace(place.id);
      await onDeleted();
    } catch (e) {
      setActionError(errMessage(e));
      setDeleting(false);
      setConfirmDelete(false);
    }
  };

  const busy = saving || deleting;

  return (
    <div
      style={{
        ...CARD_SOFT,
        borderTop: `3px solid ${ACCENT}`,
        padding: "22px 24px 26px",
        display: "flex",
        flexDirection: "column",
        gap: 24,
      }}
    >
      {/* Title row */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <GradeBadge grade={mode === "edit" ? place?.grade ?? null : null} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: "#16151A" }}>
            {mode === "create"
              ? "새 장소 추가"
              : form.name_ko || place?.name_ko || "장소 편집"}
          </div>
          <div style={{ fontSize: 12.5, color: MUTED, marginTop: 2 }}>
            {mode === "create"
              ? "필수 항목을 입력하고 추가하세요."
              : place?.name_en}
          </div>
        </div>
        <button
          onClick={onClose}
          aria-label="닫기"
          style={{
            width: 32,
            height: 32,
            borderRadius: 9,
            background: "#F2EDE4",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#6C665B" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      {actionError && (
        <div style={{ color: ACCENT, fontSize: 12.5, marginTop: -12 }}>
          {actionError}
        </div>
      )}

      {/* Basic info */}
      <div>
        <SectionTitle>기본 정보</SectionTitle>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 14,
          }}
        >
          <Field label="이름 (한국어)">
            <input
              value={form.name_ko}
              onChange={(e) => set("name_ko", e.target.value)}
              style={INPUT_BASE}
            />
          </Field>
          <Field label="이름 (영어)">
            <input
              value={form.name_en}
              onChange={(e) => set("name_en", e.target.value)}
              style={INPUT_BASE}
            />
          </Field>
          <Field label="슬러그 (비우면 영어 이름에서 자동 생성)">
            <input
              value={form.slug}
              onChange={(e) => set("slug", e.target.value)}
              placeholder="auto"
              style={INPUT_BASE}
            />
          </Field>
          <Field label="카테고리">
            <select
              value={form.category}
              onChange={(e) => set("category", e.target.value)}
              style={INPUT_BASE}
            >
              {CATEGORY_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="지역">
            <select
              value={form.region_id}
              onChange={(e) => set("region_id", e.target.value)}
              style={INPUT_BASE}
            >
              <option value="">없음</option>
              {regions.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name_ko}
                </option>
              ))}
            </select>
          </Field>
          <Field label="주소">
            <input
              value={form.address}
              onChange={(e) => set("address", e.target.value)}
              style={INPUT_BASE}
            />
          </Field>
          <Field label="위도 (lat)">
            <input
              value={form.lat}
              onChange={(e) => set("lat", e.target.value)}
              inputMode="decimal"
              style={INPUT_BASE}
            />
          </Field>
          <Field label="경도 (lng)">
            <input
              value={form.lng}
              onChange={(e) => set("lng", e.target.value)}
              inputMode="decimal"
              style={INPUT_BASE}
            />
          </Field>
          <Field label="이미지 URL">
            <input
              value={form.image_url}
              onChange={(e) => set("image_url", e.target.value)}
              style={INPUT_BASE}
            />
          </Field>
          <Field label="전화">
            <input
              value={form.phone}
              onChange={(e) => set("phone", e.target.value)}
              style={INPUT_BASE}
            />
          </Field>
          <Field label="영업시간">
            <input
              value={form.hours}
              onChange={(e) => set("hours", e.target.value)}
              style={INPUT_BASE}
            />
          </Field>
          <Field label="메모">
            <input
              value={form.memo}
              onChange={(e) => set("memo", e.target.value)}
              style={INPUT_BASE}
            />
          </Field>
        </div>
      </div>

      {/* Descriptions */}
      <div>
        <SectionTitle>설명</SectionTitle>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: 14,
          }}
        >
          <Field label="설명 (한국어)">
            <textarea
              value={form.description_ko}
              onChange={(e) => set("description_ko", e.target.value)}
              rows={3}
              style={{ ...INPUT_BASE, resize: "vertical", fontFamily: "inherit", lineHeight: 1.5 }}
            />
          </Field>
          <Field label="설명 (영어)">
            <textarea
              value={form.description_en}
              onChange={(e) => set("description_en", e.target.value)}
              rows={3}
              style={{ ...INPUT_BASE, resize: "vertical", fontFamily: "inherit", lineHeight: 1.5 }}
            />
          </Field>
        </div>
      </div>

      {/* Flags */}
      <div>
        <SectionTitle>외국인 친화 속성</SectionTitle>
        <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
          {(
            [
              ["english_support", "영어 응대"],
              ["card_payment", "카드 결제"],
              ["solo_friendly", "혼자 OK"],
            ] as const
          ).map(([key, label]) => (
            <label
              key={key}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                fontSize: 13.5,
                color: "#16151A",
                cursor: "pointer",
              }}
            >
              <input
                type="checkbox"
                checked={form[key]}
                onChange={(e) => set(key, e.target.checked)}
                style={{ width: 16, height: 16, accentColor: ACCENT }}
              />
              {label}
            </label>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
          flexWrap: "wrap",
          borderTop: "1px solid #F5F0EA",
          paddingTop: 20,
        }}
      >
        <button
          onClick={handleSave}
          disabled={busy}
          style={{
            padding: "10px 20px",
            borderRadius: 10,
            background: ACCENT,
            color: "#fff",
            border: "none",
            fontSize: 14,
            fontWeight: 600,
            cursor: busy ? "default" : "pointer",
            opacity: busy ? 0.7 : 1,
          }}
        >
          {saving
            ? mode === "create"
              ? "추가 중..."
              : "저장 중..."
            : mode === "create"
            ? "추가"
            : "저장"}
        </button>

        {mode === "edit" && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
            <button
              onClick={handleDelete}
              disabled={busy}
              style={{
                padding: "9px 16px",
                borderRadius: 10,
                background: confirmDelete ? DANGER : "#fff",
                color: confirmDelete ? "#fff" : DANGER,
                border: `1px solid ${DANGER}`,
                fontSize: 13,
                fontWeight: 600,
                cursor: busy ? "default" : "pointer",
                opacity: busy ? 0.6 : 1,
              }}
            >
              {deleting
                ? "삭제 중..."
                : confirmDelete
                ? "정말 삭제할까요? 다시 클릭"
                : "삭제"}
            </button>
            <span style={{ fontSize: 11.5, color: MUTED, maxWidth: 320, textAlign: "right", lineHeight: 1.5 }}>
              삭제 시 등급·로컬 지수·수집 소스 데이터도 함께 삭제됩니다.
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
