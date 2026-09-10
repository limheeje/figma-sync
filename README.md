# 디자인 핸드오프 → 코드 → Webhook 운영 런북

디자이너에게 Figma 파일을 공유받은 순간부터, 전체 화면을 코드로 구현하고,
"디자인이 바뀌면 코드가 자동으로 따라오는" webhook 운영에 올리기까지의 전 과정.

- **나** = 개발자(퍼블리셔). 이 문서를 따라 하는 사람.
- **AI** = Claude Code. 코드를 읽고/쓰고, Figma MCP로 디자인을 읽고, 커밋함.
- **디자이너** = Figma 파일 소유자.
- **시스템** = webhook 수신 서버(`server/`) + ngrok + Figma webhook.

---

## 0. 큰 그림

```
[Phase 0] 핸드오프 받기        디자이너 → 나:  파일 공유 + 브리핑
[Phase 1] 최초 구현            나 ↔ AI:  화면별로 구현
[Phase 2] 검토                 나:  화면 확인, 수정 지시
[Phase 3] webhook 세팅 (1회)   나:  ngrok/토큰/등록
[Phase 4] 일상 운영            디자이너가 저장 → 시스템 → AI 가 자동 sync
```

---

## Phase 0 — 핸드오프 받기

### 디자이너가 나에게 줘야 하는 것

| 항목 | 형태 | 왜 필요한가 |
|---|---|---|
| **Figma 파일 접근권** | 파일 Share에서 나를 뷰어/에디터 추가, 또는 팀 프로젝트에 배치 | AI는 **내 Figma 계정**으로 파일을 읽음. 권한 없으면 아무것도 못 함 |
| **파일 링크** | `https://www.figma.com/design/<KEY>/<name>` | 어떤 파일인지 |
| **최종 프레임 목록** | "이 N개가 납품물" (말 또는 문서) | 디자이너 파일엔 구시안·탐색용·컴포넌트가 섞여 있음. AI는 뭐가 최종인지 파일만 봐선 모름 |
| **화면 플로우** | 로그인 → 스캔 → 피킹 → … | 화면 전환(라우팅) 구성용 |
| **상태/케이스 설명** | "스캔 완료되면 이 모달", "피킹면 빨강=오류" | 정적 프레임에 안 보이는 정보 |
| (있으면) **폰트 파일** | .otf / .woff2 | 사내 폰트는 CDN에 없음. 없으면 유사 폰트로 폴백 |
| (있으면) **데이터 스펙** | API 문서, 더미인지 실데이터인지 | 순수 퍼블리싱이면 더미로 진행 |

> 최소한 **접근권 + 파일 링크 + "이 화면들이 최종"** 만 있으면 시작 가능.

### 내가 하는 것

1. 디자이너가 공유한 걸 Figma에서 열어본다.
2. **파일 링크 복사**: Figma 우상단 **Share → Copy link**, 또는 브라우저 주소창 URL 복사.
3. AI에게 던진다:
   ```
   이 피그마 구현해줘 https://www.figma.com/design/<KEY>/<name>

   - 최종 화면: 로그인 / 스캔 / 피킹 / 상품투입 / 투입완료 (5개)
   - 플로우: 로그인 → 스캔 → 피킹 → 상품투입 → 투입완료
   - 스캔은 완료 모달 케이스, 상품투입은 피킹면 red/blue 케이스 있음
   - 기존 코드 다 지우고 이걸로. 데이터는 더미로.
   ```

### AI가 하는 것

- `get_metadata` 로 파일의 페이지·프레임 트리를 훑어 **인벤토리**를 만든다.
- "이 5개가 최종 맞죠? 이렇게 이해했는데" 하고 **확인을 요청**한다.
- (내가 OK 하면) Phase 1로.

### 개별 프레임 node ID 가 필요할 때

Figma에서 프레임 **하나만** 클릭 → 우클릭 **Copy link to selection** → `?node-id=8-7519` 가 붙은 링크.
또는 프레임 클릭 시 브라우저 주소창 URL 끝의 `node-id=8-7519` 숫자.
(여러 개 선택하면 "Copy link to selection" 이 사라짐 — 하나만.)

---

## Phase 1 — 최초 구현

webhook 은 **아직 안 씀**. 코드가 없으니 감지할 것도 없다. 화면부터 만든다.

### 순서 (AI 가 이 순서로 진행)

| 단계 | 내용 |
|---|---|
| 1. 파운데이션 | `get_variable_defs` 로 토큰 추출 → `src/style.css`, 라우터/프로젝트 구조 세팅 |
| 2. 공통 컴포넌트 | 헤더/버튼/리스트/모달 등 반복되는 것 먼저 |
| 3. 화면 | 플로우 순서대로 `get_design_context` → Vue 변환 → 스크린샷 대조 → 커밋 (화면당 커밋 1개) |
| 4. 플로우 연결 | 화면 간 네비게이션 |

### 내가 하는 것

- 화면 하나씩 "다음 거 해줘" 또는 "다 해줘".
- AI 가 보내주는 렌더 스크린샷을 Figma 와 비교, **수정 지시** ("여기는 select 박스로", "표 위 테두리 색 다름").

### AI 가 하는 것

- 화면마다: `get_design_context` (+ 캐시 의심되면 `get_metadata`/`get_screenshot` 교차검증) → 코드 작성 →
  `npx vue-tsc --noEmit && npx vite build` → `node scripts/figma-shot.mjs <url> <out>` 로 렌더 → 비교 → 커밋.
- 큰 페이지는 자식 섹션별로 나눠 읽고 조립.

### 확인용 명령 (내가 직접)

```powershell
npm run dev
# http://localhost:5173/  에서 화면 전환하며 확인
```

---

## Phase 2 — 검토

### 내가 하는 것

- `npm run dev` 로 각 화면을 눈으로 확인.
- Figma 와 다른 부분을 구체적으로 지시. 예:
  - "로그인 선택 영역은 실제 select 로"
  - "이 버튼 hover 상태 빠짐"
  - "폰트가 달라 보임"

### AI 가 하는 것

- 지시 받은 부분만 수정 → 재렌더 대조 → 커밋.

이 왕복이 끝나면 Phase 3.

---

## Phase 3 — Webhook 운영 세팅 (최초 1회)

### 3-1. 준비물 (내가 직접 발급/설치)

| 준비물 | 어디서 | 메모 |
|---|---|---|
| **ngrok** | https://ngrok.com 가입 → `winget install ngrok.ngrok` | 가입 시 무료 고정 도메인 1개 배정됨 (예: `sharper-senator-crazed.ngrok-free.dev`) |
| ngrok authtoken | 대시보드 → Your Authtoken | `ngrok config add-authtoken <토큰>` 한 번 실행 |
| **Figma Personal Access Token** | figma.com → Settings → Security → Generate new token | 스코프: `file_content:read`, `file_metadata:read`, `file_versions:read`, **`webhooks:write`** |

> ngrok 이 3.20 미만이면 `ngrok update` (구버전은 최신 계정에서 거부됨).

### 3-2. `.env` 채우기 (내가 직접)

`.env.example` 을 `.env` 로 복사하고 값 입력. **`.env` 는 git 에 안 올라감.**

```bash
# .env
FIGMA_TOKEN=figd_xxxxxxxxxxxxxxxx          # 3-1 에서 발급한 토큰
FIGMA_FILE_KEY=d8VcZ6Nyf7KvdWa7UClLcz      # 파일 링크의 /design/<여기>/
PUBLIC_URL=https://sharper-senator-crazed.ngrok-free.dev   # ngrok 고정 도메인, 슬래시 없이
WEBHOOK_PASSCODE=아무_긴_랜덤_문자열          # Figma ↔ 서버 공유 비밀. 내가 지어냄
PORT=3000
DEBOUNCE_MS=300000                         # 5분. Figma MCP 캐시가 풀릴 시간
DRY_RUN=1                                  # 처음엔 1(로그만). 검증되면 0
CLAUDE_ARGS=--dangerously-skip-permissions # headless 실행은 권한 프롬프트에 답 못 함
```

### 3-3. 매핑 + 스냅샷 생성 (내가 명령 실행, AI 는 관여 안 함)

```powershell
npm run webhook:map          # src/router.ts 의 meta.node → server/figma-map.json
npm run webhook:detect:init  # 지금 디자인 상태를 기준선 스냅샷으로 저장
```

`figma-map.json` 확인:
```json
{
  "fileKey": "d8VcZ6Nyf7KvdWa7UClLcz",
  "nodes": {
    "8:7448": { "component": "src/screens/LoginScreen.vue", "route": "login" },
    "8:7519": { "component": "src/screens/PickingScreen.vue", "route": "picking" }
    // ...
  }
}
```

### 3-4. 서버 + 터널 띄우기 (창 2개, 계속 켜둠)

```powershell
# 터미널 A — 수신 서버
npm run webhook
#   -> listening on http://localhost:3000  (DRY_RUN=1, debounce=300s, 5 mapped nodes)

# 터미널 B — 터널  (포트는 .env PORT 와 동일)
ngrok http 3000 --url https://sharper-senator-crazed.ngrok-free.dev
#   -> Forwarding  https://sharper-senator-crazed.ngrok-free.dev -> http://localhost:3000
```

### 3-5. Figma webhook 등록 (내가 명령 실행, 한 번만)

```powershell
npm run webhook:create FILE_VERSION_UPDATE
#   -> created: 4658656 -> https://.../figma-hook
#   -> (터미널 A 에 "PING received — webhook is live ✅" 뜨면 연결 성공)
```

확인 / 정리:
```powershell
npm run webhook:list             # 등록된 webhook 목록
npm run webhook:delete <id>      # 삭제
```

> `PUBLIC_URL` 이 바뀌면(무료 ngrok 도메인은 안 바뀜) 기존 걸 delete 후 다시 create.

### 3-6. 드라이런 검증 (내가 테스트)

1. Figma 에서 화면 하나 눈에 띄게 수정 → `Ctrl/Cmd + Alt/Option + S` (버전 저장) → 이름 입력 → Save
2. 터미널 A 관찰:
   ```
   change: FILE_VERSION_UPDATE "..." — batch in 300s
   ...5분 후...
   detecting changed nodes… → 8:7519
   sync 8:7519 -> src/screens/PickingScreen.vue
   DRY_RUN: would run -> claude -p ... "/figma-sync .../x?node-id=8-7519"
   batch done (1 node)
   ```
3. 여기까지 나오면 파이프라인 정상. `.env` 에서 `DRY_RUN=0` 으로 바꾸고 터미널 A 재시작(`Ctrl+C` → `npm run webhook`).

---

## Phase 4 — 일상 운영

### 디자이너가 하는 것

- 화면 수정 후, **개발에 넘길 준비가 되면 버전 저장** (`Ctrl/Cmd + Alt/Option + S` → 이름 → Save).
  - 그냥 편집만 하면 이벤트가 안 오거나(설정에 따라) 한참 뒤에 옴. **"버전 저장" 이 개발자에게 보내는 신호.**

### 시스템이 하는 것 (자동)

1. Figma 가 `FILE_VERSION_UPDATE` 를 ngrok → `webhook.mjs` 로 전송
2. `webhook.mjs` 가 5분 디바운스 (편집이 계속되면 마지막 저장 기준으로 리셋)
3. `detect-changes.mjs` 실행: `figma-map.json` 의 노드들을 Figma REST 로 받아 스냅샷과 해시 비교 → **바뀐 노드만** 추출
4. 바뀐 노드마다 순차로: `claude -p "/figma-sync <해당 노드 url>"`

### AI 가 하는 것 (각 `/figma-sync` 호출마다)

- `.claude/commands/figma-sync.md` 절차대로: 최신 디자인 읽고 → 매핑된 `.vue` 파일만 수정 → `vue-tsc`+`build` → 스크린샷 대조 → **커밋** (`Sync <컴포넌트> to Figma <node> (<변경내용>)`)

### 내가 하는 것

- 터미널 A / ngrok 창을 켜둔다.
- 가끔 `git log` 로 AI 가 만든 커밋을 확인하고, 필요하면 손본다.
- 즉시 확인하고 싶으면:
  ```powershell
  npm run webhook:detect     # 지금 스냅샷 대비 바뀐 노드 있나 바로 출력
  ```

### 여러 화면을 동시에 바꿨을 때

`detect-changes` 가 바뀐 노드를 전부 잡아서, `webhook.mjs` 가 하나씩 순차 sync. 커밋도 화면당 1개.

---

## 새 화면이 추가됐을 때

디자이너가 파일에 새 프레임(예: `재고조사` `9:1234`)을 추가하면:

1. **나**: `src/router.ts` 에 라우트 추가 — `meta.node` 에 새 노드 ID 넣기
   ```ts
   {
     path: '/stocktake',
     name: 'stocktake',
     component: () => import('./screens/StocktakeScreen.vue'),
     meta: { title: '재고조사', node: '9:1234' },
   }
   ```
   (노드 ID = Figma 에서 그 프레임 클릭 시 URL 의 `node-id=9-1234` → `9:1234`)
2. **나**: AI 에게 "재고조사 화면 구현해줘 (9:1234)" → AI 가 `StocktakeScreen.vue` 작성
3. **나**: 매핑·스냅샷 갱신
   ```powershell
   npm run webhook:map
   npm run webhook:detect:init
   ```
4. 끝. 이제 그 화면도 자동 감시 대상.

---

## 트러블슈팅

| 증상 | 원인 / 해결 |
|---|---|
| `npm run webhook` 후 PING 안 옴 | ngrok 안 떠 있음 / `PUBLIC_URL` 오타 / webhook 미등록. `npm run webhook:list` 확인 |
| 이벤트는 오는데 "nothing to sync" | 정말 안 바뀜, 또는 **Figma MCP 캐시**. `DEBOUNCE_MS` 를 5분 이상으로. `npm run webhook:detect` 로 수동 확인 |
| AI 가 "변경 없음" 이라는데 실제론 바뀜 | 캐시. 몇 분 뒤 `npm run webhook:detect` 재시도. 그래도면 Figma 데스크톱 재시작 |
| `claude` 실행이 프롬프트만 받고 멈춤 | `CLAUDE_ARGS=--dangerously-skip-permissions` 확인 (headless 는 권한 응답 불가) |
| ngrok "agent version too old" | `ngrok update` |
| `ngrok http ... --url` 이 unknown flag | 구버전. `ngrok update` 후 재시도 (구버전은 `--domain`) |
| Figma 토큰이 로그/스크린샷에 노출됨 | Settings → Security 에서 해당 토큰 Revoke → 재발급 → `.env` 교체 |

---

## 명령어 전체

```powershell
# --- 개발 ---
npm run dev            # 로컬 서버 (http://localhost:5173)
npm run build          # 타입체크 + 프로덕션 빌드
npm run shot <url> <out>   # Playwright 스크린샷 (렌더 대조용)

# --- webhook 세팅 (1회) ---
npm run webhook:map           # router.ts -> server/figma-map.json
npm run webhook:detect:init   # 기준선 스냅샷 저장
npm run webhook:create FILE_VERSION_UPDATE   # Figma webhook 등록
npm run webhook:list          # 등록 목록
npm run webhook:delete <id>   # 등록 삭제

# --- webhook 운영 ---
npm run webhook               # 수신 서버 (켜둠)
ngrok http 3000 --url https://<도메인>.ngrok-free.dev   # 터널 (켜둠)
npm run webhook:detect        # 지금 바뀐 노드 즉시 확인
```

## 파일 구조

```
src/
  router.ts              # 라우트 + meta.node (webhook:map 의 입력)
  style.css              # --cj-* 디자인 토큰
  screens/*.vue          # 화면 (Figma 프레임 1개 = 파일 1개)
  components/*.vue        # 공통 컴포넌트
scripts/figma-shot.mjs   # 렌더 스크린샷
server/
  webhook.mjs            # 수신 서버 (배치 모드)
  gen-figma-map.mjs      # figma-map 생성
  detect-changes.mjs     # 스냅샷 diff
  figma-webhooks.mjs     # Figma webhook 등록/조회/삭제
  figma-map.json         # 노드 ↔ 파일 매핑 (생성물, 커밋됨)
  .snapshots.json        # 노드 해시 (gitignore)
  README.md              # webhook 상세
.claude/commands/figma-sync.md   # /figma-sync 절차 (AI 가 따름)
.env                     # 시크릿 (gitignore)  ← .env.example 참고
CLAUDE.md                # AI 컨텍스트
```

## 안 되는 것 / 한계

- **Code Connect**: Figma Org/Enterprise 전용. 이 계정은 Pro → 못 씀. 그래서 `figma-map.json` 으로 대체.
- **자동이 곧 무검증**: 지금은 main 에 바로 커밋. 팀 운영은 **브랜치 + PR + 사람 리뷰** 로 바꿔야 안전.
- **감지 한계**: `detect-changes` 는 Figma 문서 subtree 해시 비교. 색·위치·텍스트·구조는 잡지만, 문서엔 안 남고 렌더에만 영향 주는 변화는 못 잡음.
- **폰트**: 사내 폰트 파일이 없으면 유사 폰트로 폴백 (픽셀은 근사).
