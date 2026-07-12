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

## 데이터 수집 API 키 (특허2 모듈 100)

관리자 `장소` 페이지의 **데이터 수집** 기능은 지역명(예: 압구정)으로 카카오 로컬 API에서 장소를 자동 발견하고, 선택적으로 네이버 검색 API로 블로그 리뷰 텍스트를 모아 등급·로컬 지수를 산출합니다. 서버 라우트 `POST /api/admin/collect`가 이 작업을 수행합니다.

두 키 모두 **서버 전용**입니다. `NEXT_PUBLIC_` 접두사를 붙이지 마세요 (붙이면 브라우저에 노출됩니다).

### 1. 카카오 REST API 키 (필수)

- `NEXT_PUBLIC_KAKAO_MAP_KEY`(지도용 JavaScript 키)는 REST API에 사용할 수 없습니다. 별도의 REST API 키가 필요합니다.
- 발급: [developers.kakao.com](https://developers.kakao.com) > 내 애플리케이션 > (앱 선택) > 앱 키 > **REST API 키** 복사.
- 환경변수 이름: `KAKAO_REST_API_KEY`

키가 없으면 `/api/admin/collect`는 501과 한국어 안내 메시지를 반환하고, 관리자 UI에 설정 방법이 표시됩니다.

### 2. 네이버 검색 API 키 (선택 — 리뷰 수집용)

- 없으면 장소만 추가되고 리뷰 수집·등급 산출은 건너뜁니다 (응답의 `naverEnabled: false`).
- 발급: [developers.naver.com](https://developers.naver.com) > Application > 애플리케이션 등록 > **검색** API 사용 설정 후 Client ID / Client Secret 확인.
- 환경변수 이름: `NAVER_CLIENT_ID`, `NAVER_CLIENT_SECRET`

### 설정 위치

- 로컬: 프로젝트 루트 `.env.local`
  ```
  KAKAO_REST_API_KEY=발급받은_REST_키
  NAVER_CLIENT_ID=네이버_클라이언트_ID
  NAVER_CLIENT_SECRET=네이버_클라이언트_시크릿
  ```
- 배포: Vercel > 프로젝트 > Settings > Environment Variables 에 동일한 이름으로 추가한 뒤 재배포.

## Reddit API 키 (Reddit 보강용)

Reddit은 서버에서의 익명 접근을 차단하므로 무료 OAuth 앱이 필요합니다.

1. https://www.reddit.com/prefs/apps 접속 (Reddit 계정 필요, 무료)
2. 하단 "create another app..." 클릭
3. 이름: Localoop / 타입: **script** 선택 / redirect uri: http://localhost (사용 안 하지만 필수 입력)
4. 생성 후:
   - 앱 이름 바로 아래 문자열 = **client id**
   - "secret" 항목 = **client secret**
5. `.env.local`과 Vercel 환경변수에 추가:

```
REDDIT_CLIENT_ID=클라이언트ID
REDDIT_CLIENT_SECRET=시크릿
```

무료 한도: 분당 100회. 관리자 > 등급 엔진 > "Reddit 보강" 버튼으로 실행합니다.
