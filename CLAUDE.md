# figma-test — CJ WMS 핸디 앱

Figma → code 워크플로우 샌드박스. 현재 구현물: **CJ 대한통운 창고관리(WMS) 핸디 앱** (Figma `d8VcZ6Ny`, Page 1).

## 스택

- Vue 3 (`<script setup lang="ts">`) + Vite + vue-router
- **720×1440 고정** 디바이스 프레임 ([App.vue](src/App.vue)), 반응형 없음
- 디자인 토큰: [src/style.css](src/style.css) `:root` — `--cj-*` 팔레트 + 레이아웃 상수. **토큰 재사용, 하드코딩 금지.**
- CJ ONLYONE 사내 폰트 → 미설치 시 Pretendard/Noto Sans KR 폴백

## 화면 (Figma node → 라우트)

| 라우트 | 컴포넌트 | Figma | 상태 케이스 |
|---|---|---|---|
| `/login` | LoginScreen | `8:7448` | |
| `/scan` | ScanScreen | `8:7475` | `8:7498` 완료 모달 |
| `/picking` | PickingScreen | `8:7519` | |
| `/product-input` | ProductInputScreen | `8:7612` | `8:7684` (`?face=blue`) |
| `/complete` | CompleteScreen | `8:7560` | 확인 다이얼로그 |

node ID는 [src/router.ts](src/router.ts)의 각 라우트 `meta.node`에 있음 (figma-map 자동 생성용).

## 공통 컴포넌트 ([src/components/](src/components/))

`AppHeader` · `ActionButton` · `FieldList`(+Field type) · `Stepper` · `AlertModal`(1버튼) · `ConfirmDialog`(2버튼)

## Figma 동기화

`/figma-sync <figma-url> [target]` — 절차는 [.claude/commands/figma-sync.md](.claude/commands/figma-sync.md).
- `get_metadata`/`get_screenshot` 신선, `get_design_context` 캐시(~5분) → 충돌 시 metadata 신뢰
- 큰 노드 → 자식 섹션별 조회; 컨테이너 프레임 자체 속성은 따로 (`forceCode: true`)

## 검증

```
npx vue-tsc --noEmit && npx vite build
npm run dev
node scripts/figma-shot.mjs <url> <out>   # 720px viewport 스크린샷
```

## webhook (server/) — 배치 모드

`FILE_VERSION_UPDATE` 감지 → 디바운스(5분) → `detect-changes.mjs`(figma-map 노드 해시 비교) → 바뀐 화면마다 `/figma-sync`. `server/README.md` 참고.

- `npm run webhook:map` — `router.ts` → `figma-map.json`
- `npm run webhook:detect` — 지금 바뀐 노드 즉시 확인
- Code Connect 불가 (Figma Org/Enterprise 필요, 이 계정은 Pro)
