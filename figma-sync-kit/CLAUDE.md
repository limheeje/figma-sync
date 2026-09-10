# Figma → 코드 → Webhook 자동 동기화 플레이북

> **새 프로젝트에 도입하는 법**
> 1. `figma-sync-kit/` 폴더 전체를 새 프로젝트 루트에 복사
> 2. 이 파일(`figma-sync-kit/CLAUDE.md`)의 내용을 프로젝트 루트의 `CLAUDE.md` 로 옮기거나 이어 붙임
> 3. `figma-sync-kit/commands/figma-sync.md` → `.claude/commands/figma-sync.md` 로 이동
> 4. `figma-sync-kit/scripts/figma-shot.mjs` → `scripts/figma-shot.mjs`
> 5. `figma-sync-kit/server/*` → `server/*` (단, `figma-map.example.json` 은 참고용)
> 6. `figma-sync-kit/.env.example` → 루트 `.env.example`
> 7. AI 에게: **"CLAUDE.md 읽고 이 프로젝트에 Figma sync 셋업해줘"** + Figma 링크와 브리핑
> 8. 셋업 끝나면 `figma-sync-kit/` 폴더는 지워도 됨

이 문서는 **스택 무관**입니다. React / Vue / Svelte / Astro / SolidJS / 순수 HTML 어디든 동작합니다.
AI 가 먼저 프로젝트 스택을 파악한 뒤 그 스택의 관례에 맞춰 코드를 씁니다.

---

## 등장인물

| 주체 | 역할 |
|---|---|
| **나** (개발자/퍼블리셔) | 이 문서를 따라 셋업하고, 검토하고, 서버를 켜둔다 |
| **AI** (Claude Code) | Figma를 읽고 코드로 변환, 빌드·검증, 커밋 |
| **디자이너** | Figma 파일 소유자. 파일을 공유하고, "개발 넘길 준비됨" 신호를 보낸다 |
| **시스템** | `server/` 웹훅 수신기 + ngrok + Figma webhook |

---

## 사전 요건 (프로젝트 스택 무관하게 공통)

| 항목 | 확인 |
|---|---|
| Node.js **20.6+** | webhook 스크립트가 `node --env-file` 을 씀 |
| git | 커밋 단위로 sync |
| 프로젝트를 로컬에서 띄우는 법 | `npm run dev` 등. AI 가 package.json 에서 찾음 |
| Figma MCP 연결 | 터미널 세션에서 `/mcp` → `figma` 인증. (VS Code 확장 세션이면 인증 후 창 리로드) |
| `playwright` (devDep) | 렌더 스크린샷 대조용. `npm i -D playwright && npx playwright install chromium` |

---

## STEP 0 — 디자이너에게 요청 / 받을 것

### 디자이너가 나에게 줘야 하는 것

| 항목 | 형태 | 왜 필요한가 |
|---|---|---|
| **파일 접근권** | 파일 Share 에서 나를 뷰어/에디터 추가, 또는 팀 프로젝트에 배치 | AI 는 **내 Figma 계정**으로 읽음. 권한 없으면 아무것도 못 함 |
| **파일 링크** | `https://www.figma.com/design/<KEY>/<name>` | 어느 파일인지 |
| **최종 프레임 목록** | "이 N개가 납품물" (말/문서/네이밍 규칙) | 디자이너 파일엔 구시안·탐색·컴포넌트가 섞임. AI 는 파일만 봐선 뭐가 최종인지 모름 |
| **화면 플로우** | A → B → C | 라우팅/네비게이션 구성 |
| **상태·케이스 설명** | "스캔 완료 시 이 모달", "에러면 빨강" | 정적 프레임에 안 보이는 것 |
| (있으면) **폰트 파일** | .otf / .woff2 | 사내 폰트는 CDN 에 없음. 없으면 유사 폰트로 폴백 |
| (있으면) **데이터 스펙** | API 문서 / 더미냐 실데이터냐 | 순수 퍼블리싱이면 더미로 |

> 최소: **접근권 + 파일 링크 + "이 화면들이 최종"**.

### 디자이너가 실제로 하는 액션 (Figma 안에서)

1. 파일 우상단 **Share** → 내 이메일 추가 (Viewer 이상), 또는 공유 팀 프로젝트로 파일 이동
2. **Share → Copy link** 로 링크 복사해서 나에게 전달
3. (권장) Dev Mode 에서 최종 프레임에 **"Ready for dev"** 마킹 — 뭐가 완성인지 명확해짐

### 운영 단계에서 디자이너가 반복하는 것

- 화면 수정 후, **개발에 넘길 준비가 되면** `Ctrl/Cmd + Alt/Option + S` 로 **버전 저장** (이름 입력 → Save)
  - 그냥 편집만 하면 이벤트가 안 오거나 한참 뒤에 옴. "버전 저장" = 개발자에게 보내는 신호

---

## STEP 1 — AI 가 프로젝트 + 파일 파악

### 내가 하는 것

AI 에게 첫 지시 (템플릿):
```
CLAUDE.md 읽고 이 프로젝트에 Figma sync 를 셋업해줘.

Figma: https://www.figma.com/design/<KEY>/<name>
최종 화면: 로그인 / 대시보드 / 설정   (3개)
플로우: 로그인 → 대시보드 → 설정
케이스: 대시보드는 빈 상태 / 데이터 있는 상태 두 가지
기존 코드는 유지  (또는: 다 지우고 이걸로)
데이터는 더미로.
```

### AI 가 하는 것

1. **스택 감지** — `package.json`, 파일 확장자(.tsx/.vue/.svelte/.astro/.html), 프레임워크 설정 파일, 기존 스타일 방식(CSS Modules / Tailwind / styled-components / 전역 CSS 변수)을 확인
2. **Figma 인벤토리** — `get_metadata` (nodeId 없이 → 페이지 목록, 그다음 페이지별로) 로 프레임 트리를 훑음. `hidden` 프레임·탐색용·detached 인스턴스 걸러냄
3. **확인 요청** — "이 스택이고, 이 화면들이 최종으로 보이는데 맞나요? 플로우는 이렇게 이해했습니다"
4. 내가 OK/정정 → STEP 2

---

## STEP 2 — 파운데이션

### AI 가 하는 것

1. **토큰 추출** — 대표 프레임에 `get_variable_defs` → 색/타이포/간격을 **이 프로젝트의 토큰 시스템에 매핑**
   - 전역 CSS → `:root { --token: ... }`
   - Tailwind → `tailwind.config` theme.extend
   - 디자인토큰 파일(JS/JSON) → 거기에
   - 프로젝트에 토큰 개념이 없으면 → 전역 CSS 변수로 새로 만듦
2. **라우팅/구조** — 스택별 관례대로:
   - React → React Router / Next.js app|pages
   - Vue → vue-router
   - Svelte → SvelteKit routes
   - Astro → `src/pages/*.astro`
   - 순수 HTML → 화면당 `.html` 파일 + 공통 부분은 include/partial
3. 화면 1개 = 파일 1개 원칙 (webhook 매핑이 깔끔해짐)

---

## STEP 3 — 화면별 구현

### AI 가 하는 것 (화면마다 반복)

1. 공통으로 반복되는 것(헤더/버튼/리스트/모달) **먼저** 컴포넌트화
2. 화면: `/figma-sync <프레임 URL>` 절차 (`.claude/commands/figma-sync.md`)
   - `get_design_context` → 이 스택의 언어로 변환 (React+Tailwind 레퍼런스를 그대로 붙이지 않음)
   - 큰 페이지는 자식 섹션별로 나눠 읽고 조립
   - 반복 요소(표 셀 등)는 하나만 읽고 배열로 일반화
   - 아이콘/이미지 asset 다운로드해서 커밋
   - 타입체크 + 빌드 → 렌더 스크린샷 대조 → **커밋 1개**
3. **`server/figma-map.json` 에 매핑 추가** — `{ "<노드ID>": { "component": "<파일경로>", "route": "<경로>" } }`

### 내가 하는 것

- "다음 거", 또는 "다 해줘"
- AI 가 보내는 렌더 스크린샷을 Figma 와 비교 → 구체적 수정 지시
  - "이 영역은 실제 select 로", "표 상단 테두리 색 다름", "hover 상태 빠짐"

### 확인용 (내가 직접)

```bash
npm run dev
# 브라우저에서 화면 전환하며 확인
```

---

## STEP 4 — 검토 왕복

내가 diff 를 보고 수정 지시 → AI 가 해당 부분만 고치고 재렌더 대조 → 커밋. 반복.
이게 끝나면 STEP 5.

---

## STEP 5 — Webhook 운영 세팅 (최초 1회)

### 5-1. 킷 파일 배치 (다른 프로젝트에서 도입 시)

```
figma-sync-kit/server/webhook.mjs        -> server/webhook.mjs
figma-sync-kit/server/detect-changes.mjs -> server/detect-changes.mjs
figma-sync-kit/server/figma-webhooks.mjs -> server/figma-webhooks.mjs
figma-sync-kit/scripts/figma-shot.mjs    -> scripts/figma-shot.mjs
figma-sync-kit/commands/figma-sync.md    -> .claude/commands/figma-sync.md
figma-sync-kit/.env.example              -> .env.example
```

`package.json` "scripts" 에 추가:
```json
{
  "shot": "node scripts/figma-shot.mjs",
  "webhook": "node --env-file=.env server/webhook.mjs",
  "webhook:detect": "node --env-file=.env server/detect-changes.mjs",
  "webhook:detect:init": "node --env-file=.env server/detect-changes.mjs init",
  "webhook:create": "node --env-file=.env server/figma-webhooks.mjs create",
  "webhook:list": "node --env-file=.env server/figma-webhooks.mjs list",
  "webhook:delete": "node --env-file=.env server/figma-webhooks.mjs delete"
}
```

`.gitignore` 에 추가:
```
.env
server/.sync-log
server/.snapshots.json
scripts/.shots
```

`server/figma-map.json` 은 STEP 3 에서 AI 가 채운 것을 그대로 씀 (커밋됨). `fileKey` 필드 필수.

### 5-2. 준비물 (내가 직접 발급/설치)

| 준비물 | 어디서 | 메모 |
|---|---|---|
| **ngrok** | https://ngrok.com 가입 → `winget install ngrok.ngrok` (mac: `brew install ngrok`) | 가입 시 무료 고정 도메인 1개 배정 |
| ngrok authtoken | 대시보드 → Your Authtoken | `ngrok config add-authtoken <토큰>` 한 번 |
| **Figma Personal Access Token** | figma.com → Settings → Security → Generate new token | 스코프: `file_content:read`, `file_metadata:read`, `file_versions:read`, **`webhooks:write`** |

> ngrok 3.20 미만이면 `ngrok update`.

### 5-3. `.env` 채우기 (내가 직접, git 에 안 올라감)

`.env.example` → `.env` 복사 후:
```bash
FIGMA_TOKEN=figd_xxxxxxxx
FIGMA_FILE_KEY=<파일 링크의 /design/<여기>/>
PUBLIC_URL=https://<내-ngrok-도메인>.ngrok-free.dev   # 슬래시 없이
WEBHOOK_PASSCODE=<아무_긴_랜덤_문자열>
PORT=3000
DEBOUNCE_MS=300000
DRY_RUN=1
CLAUDE_ARGS=--dangerously-skip-permissions
```

### 5-4. 스냅샷 기준선 (내가 명령 실행)

```bash
npm run webhook:detect:init   # 지금 디자인 상태를 기준선으로 저장 (server/.snapshots.json)
```

### 5-5. 서버 + 터널 (창 2개, 계속 켜둠)

```bash
# 터미널 A — 수신 서버
npm run webhook
#   -> listening on http://localhost:3000  (DRY_RUN=1, debounce=300s, N mapped nodes)

# 터미널 B — 터널 (포트 = .env PORT)
ngrok http 3000 --url https://<내-도메인>.ngrok-free.dev
#   -> Forwarding  https://<내-도메인>.ngrok-free.dev -> http://localhost:3000
```

### 5-6. Figma webhook 등록 (내가 명령 실행, 한 번만)

```bash
npm run webhook:create FILE_VERSION_UPDATE
#   -> created: <id> -> https://.../figma-hook
#   -> 터미널 A 에 "PING received — webhook is live ✅" 뜨면 연결 성공
```

확인/정리:
```bash
npm run webhook:list
npm run webhook:delete <id>
```

> `PUBLIC_URL` 이 바뀌면 (무료 ngrok 고정 도메인은 안 바뀜) 기존 걸 delete 후 다시 create.

### 5-7. 드라이런 검증 (내가 테스트)

1. Figma 에서 화면 하나 눈에 띄게 수정 → `Ctrl/Cmd + Alt/Option + S` (버전 저장)
2. 터미널 A:
   ```
   change: FILE_VERSION_UPDATE "..." — batch in 300s
   ...5분 후...
   detecting changed nodes… → 1:23
   sync 1:23 -> src/pages/Login.tsx
   DRY_RUN: would run -> claude -p ... "/figma-sync .../x?node-id=1-23"
   batch done (1 node)
   ```
3. 여기까지 나오면 정상. `.env` `DRY_RUN=0` 으로 바꾸고 터미널 A 재시작.

---

## STEP 6 — 일상 운영

```
디자이너: 화면 수정 → 버전 저장 (Ctrl/Cmd+Alt/Option+S)
   │
   ▼
Figma → ngrok → server/webhook.mjs  (FILE_VERSION_UPDATE 수신)
   │  5분 디바운스 (편집 계속되면 리셋)
   ▼
server/detect-changes.mjs  →  figma-map.json 노드들을 Figma REST 로 받아
   │                           스냅샷과 해시 비교 → 바뀐 노드만 추출
   ▼
바뀐 노드마다:  claude -p "/figma-sync <노드 url>"
   │
   ▼
AI:  최신 디자인 읽고 → 매핑된 파일만 수정 → 빌드·검증 → 커밋
```

### 각 주체가 하는 것

| 주체 | 운영 중 하는 일 |
|---|---|
| **디자이너** | 화면 수정 후 버전 저장 |
| **시스템** | 이벤트 수신, 디바운스, 변경 감지 (AI 사용 안 함, Figma API 만) |
| **AI** | 감지된 노드마다 `/figma-sync` 실행 → 매핑된 파일 수정 + 커밋 |
| **나** | 터미널 A / ngrok 창 켜두기. `git log` 로 AI 커밋 확인. 필요시 손봄 |

### 즉시 확인 (내가 직접)

```bash
npm run webhook:detect   # 지금 스냅샷 대비 바뀐 노드 있나 바로 출력
```

### 여러 화면을 동시에 바꿨을 때

`detect-changes` 가 바뀐 노드 전부 추출 → `webhook.mjs` 가 하나씩 순차 sync → 화면당 커밋 1개.

---

## 새 화면이 추가됐을 때

1. **나**: 새 화면 파일 생성 요청 → AI 가 구현 (`/figma-sync <새 노드 URL>`)
2. **AI**: `server/figma-map.json` 에 `{ "<새 노드ID>": { "component": "<파일>" } }` 추가
3. **나**: `npm run webhook:detect:init` (기준선 갱신)
4. 끝. 이제 그 화면도 자동 감시 대상

> 노드 ID = Figma 에서 그 프레임 클릭 시 URL 의 `node-id=9-1234` → `9:1234`.
> 여러 프레임 선택하면 "Copy link to selection" 이 사라짐 — 하나만 선택.

---

## 비용 / 안전

| 단계 | AI(Claude) 사용 | 비용 |
|---|---|---|
| 변경 감지 (webhook + detect) | ❌ | Figma API — 무료 |
| 코드 수정 + 커밋 (`claude -p`) | ✅ headless Claude 1회 / 바뀐 노드 | **내 Claude Code 사용량 차감** (지금 대화와 별개 세션) |

- auto-sync 를 자주 돌리면 Claude 사용 한도에 영향 → `DEBOUNCE_MS` 길게, 트리거는 `FILE_VERSION_UPDATE` 만 (아무 편집 아님)
- **자동 = 무검증이 아님**: 기본은 main 직접 커밋. **팀 운영은 브랜치 + PR + 사람 리뷰 게이트**로 바꿀 것
- `claude -p` 는 `--dangerously-skip-permissions` 로 돎 (headless 는 권한 프롬프트에 응답 불가). 샌드박스/신뢰 리포에서만. 좁히려면 `--allowedTools` 사용

---

## 트러블슈팅

| 증상 | 원인 / 해결 |
|---|---|
| PING 안 옴 | ngrok 안 떠 있음 / `PUBLIC_URL` 오타 / webhook 미등록. `npm run webhook:list` |
| 이벤트는 오는데 "nothing to sync" | 정말 안 바뀜, 또는 Figma MCP 캐시. `DEBOUNCE_MS` 5분+, `npm run webhook:detect` 수동 확인 |
| AI 가 "변경 없음" 이라는데 실제론 바뀜 | 캐시. 몇 분 뒤 재시도. 그래도면 Figma 데스크톱 재시작 |
| `claude` 가 프롬프트만 받고 멈춤 | `CLAUDE_ARGS=--dangerously-skip-permissions` 확인 |
| ngrok "agent version too old" | `ngrok update` |
| `ngrok http ... --url` unknown flag | 구버전. `ngrok update` 후 재시도 (구버전은 `--domain`) |
| `get_design_context` "exceeds maximum tokens" | 노드가 큼. AI 가 자식 섹션별로 나눠 읽어야 함 (figma-sync.md 절차) |
| Figma 토큰이 로그/스크린샷 노출 | Settings → Security → 해당 토큰 Revoke → 재발급 → `.env` 교체 |
| MCP `figma` 연결 안 됨 | 터미널에서 `/mcp` 인증. VS Code 확장이면 인증 후 "Developer: Reload Window" |

---

## 파일 구조 (도입 후)

```
.claude/commands/figma-sync.md   # /figma-sync 절차 (AI 가 따름)
scripts/figma-shot.mjs           # 렌더 스크린샷 (SHOT_W/SHOT_H 로 뷰포트 조정)
server/
  webhook.mjs                    # 수신 서버 (배치)
  detect-changes.mjs             # 스냅샷 해시 diff
  figma-webhooks.mjs             # Figma webhook 등록/조회/삭제
  figma-map.json                 # 노드 ↔ 파일 매핑 (AI 가 채움, 커밋됨)
  .snapshots.json                # 노드 해시 (gitignore)
  .sync-log                      # 실행 로그 (gitignore)
.env                             # 시크릿 (gitignore) — .env.example 참고
CLAUDE.md                        # 이 문서 (+ 프로젝트별 메모)
```

## 한계

- **Code Connect**: Figma Org/Enterprise 전용. Pro 이하는 못 씀 → `figma-map.json` 으로 대체
- **감지**: `detect-changes` 는 Figma 문서 subtree 해시 비교. 색·위치·텍스트·구조는 잡지만, 문서엔 안 남고 렌더에만 영향 주는 변화(폰트 대체 등)는 못 잡음
- **폰트**: 사내 폰트 파일 없으면 유사 폰트 폴백 (픽셀은 근사)
- **정확도**: 픽셀 완벽이 목표면 화면마다 사람 검토 필요. 자동 sync 는 "빠르게 90% 맞추고, 사람이 마무리" 용
