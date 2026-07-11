# scripts

## seed-itaewon.mjs — 이태원 중심 시드 데이터

이태원·한남·경리단·해방촌·용산 지역의 실제 장소 30곳을 DB에 채워 넣는 멱등(idempotent) 시드 스크립트입니다.

### 사전 조건 (필수)

먼저 아래 마이그레이션이 **모두 적용**되어 있어야 합니다 (Supabase 대시보드 > SQL Editor):

1. `001_add_onboarding_meta.sql`
2. `20240102_admin_tables.sql` — `places` 점수 컬럼, `data_jobs`
3. `20260710_grading_engine.sql` — `grading_sources`, 가중 등급 함수
4. `20260711_course_engine.sql` — `place_local_metrics`
5. `20260712_admin_manage.sql` — **places INSERT/DELETE 정책 + 테이블 grant** (이게 없으면 anon 키로 쓰기가 전부 거부됨)

`.env.local`의 `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY`를 읽어 접속합니다 (dotenv 의존성 없음).

### 실행

```bash
node scripts/seed-itaewon.mjs
```

멱등이라 여러 번 돌려도 안전합니다:

- `regions` — slug 기준 upsert (기존 id 보존)
- `places` — slug 기준 upsert (`onConflict: "slug"`)
- `grading_sources` — 각 장소의 기존 행 삭제 후 새로 삽입
- `place_local_metrics` — place_id 기준 upsert

### 무엇을 시드하나

- **regions 5개**: itaewon, hannam, gyeongnidan, haebangchon, yongsan (모두 city="서울")
- **places 30개**: 이태원권 실제 장소 24곳 + `src/data/seed.ts`에 있던 이태원권 코드 시드 6곳(leeum-museum, namsan-seoul-tower, itaewon-food-street, gyeongnidan-gil, haebangchon, hannamdong)을 동일 slug로 포함해 지도와 DB가 일치하도록 함
- **grading_sources 65개**: 특허2 키워드 사전 단어를 의도적으로 담아 등급이 다양하게 나오도록 구성한 리뷰/블로그/수기 텍스트
- **place_local_metrics 30개**: 한국인/외국인 비율, 가격, 체류시간, 영어 자막, 시간대 등 (`local_keyword_score`, `li`는 0 — 재계산 API가 도출)

### 실행 후

시드된 `places.ls/ar/pd/lf_score` + `grade`, `place_local_metrics.local_keyword_score` + `li`는 아직 0/기본값입니다.

**관리자에서 등급 엔진 / 로컬 지수 전체 재계산을 실행하거나 해당 API를 호출**하면 `grading_sources` 텍스트로부터 서브 점수·등급·로컬 지수가 도출됩니다.
