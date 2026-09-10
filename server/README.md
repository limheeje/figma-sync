# figma-sync webhook — 배치 모드

Figma 파일이 바뀌면 **바뀐 화면만** 골라 `/figma-sync` 를 돌린다.

```
Figma 저장 ──POST──▶ ngrok ──▶ webhook.mjs ──(디바운스)──▶ detect-changes.mjs
                                                              │  (figma-map.json 의 노드들을
                                                              │   REST API로 받아 스냅샷과 비교)
                                                              ▼
                                              바뀐 노드마다: claude -p "/figma-sync <url>"
```

## 구성

| 파일 | 역할 |
|---|---|
| `figma-map.json` | 노드 ID ↔ 컴포넌트 파일 매핑. `npm run webhook:map` 으로 `src/router.ts` 에서 생성 |
| `detect-changes.mjs` | 매핑된 노드를 Figma REST로 받아 해시 비교 → 바뀐 ID 출력. 스냅샷: `.snapshots.json` (gitignore) |
| `webhook.mjs` | 이벤트 수신 → 디바운스 → detect → 노드별 `/figma-sync` 순차 실행 |
| `figma-webhooks.mjs` | Figma webhook 등록/조회/삭제 |

## 셋업 (1회)

```
cp .env.example .env          # FIGMA_TOKEN, PUBLIC_URL, WEBHOOK_PASSCODE 채우기
npm run webhook:map           # figma-map.json 생성
npm run webhook:detect:init   # 현재 상태를 스냅샷으로 저장
```

## 운영 (창 2개 + 등록 1회)

```
# 1) 수신 서버
npm run webhook

# 2) 터널 (포트 = .env PORT)
ngrok http 3000 --url https://<your>.ngrok-free.dev

# 3) webhook 등록 (한 번만, PUBLIC_URL 바뀌면 재등록)
npm run webhook:create FILE_VERSION_UPDATE
```

## 테스트

- Figma에서 화면 하나 수정 → `Ctrl/Cmd + Alt/Option + S` (버전 저장)
- `DEBOUNCE_MS` (기본 5분) 후 → detect가 그 노드만 잡아서 sync
- `DRY_RUN=1` 이면 실행할 명령만 로그. `0` 이면 실제 `claude` 실행

수동 확인:
```
npm run webhook:detect        # 지금 바뀐 노드 있나 즉시 확인
```

## 새 화면 추가 시

`src/router.ts` 에 라우트 추가 (`meta: { node: '9:1234' }` 포함) → `npm run webhook:map` → `npm run webhook:detect:init`.

## 한계 / 주의

- `detect-changes` 는 Figma REST 문서 subtree 해시 비교 — 위치/색/텍스트/구조 변경은 잡지만, 렌더링에만 영향 주고 문서엔 안 남는 변화(폰트 대체 등)는 못 잡음
- 스냅샷은 매 detect 마다 갱신됨 → sync 실패해도 다음 이벤트 땐 "변경 없음". 놓치면 `npm run webhook:detect:init` 후 수동 `/figma-sync`
- main 직접 커밋함. 팀 운영은 브랜치+PR 로 바꾸고 사람 리뷰 게이트 두는 걸 권장
