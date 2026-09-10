# figma-sync-kit

다른 프로젝트에 **Figma → 코드 → webhook 자동 동기화**를 도입하는 이식용 킷.
스택 무관 (React / Vue / Svelte / Astro / 순수 HTML).

## 도입 순서

```bash
# 1. 이 폴더를 새 프로젝트 루트에 복사한 뒤, 파일들을 제자리로:
cp figma-sync-kit/CLAUDE.md            ./CLAUDE.md          # (기존 있으면 이어 붙이기)
mkdir -p .claude/commands scripts server
cp figma-sync-kit/commands/figma-sync.md  .claude/commands/figma-sync.md
cp figma-sync-kit/scripts/figma-shot.mjs  scripts/figma-shot.mjs
cp figma-sync-kit/server/*.mjs            server/
cp figma-sync-kit/.env.example            ./.env.example

# 2. package.json "scripts" 에 CLAUDE.md STEP 5-1 의 항목 추가
# 3. .gitignore 에 .env / server/.sync-log / server/.snapshots.json / scripts/.shots 추가
# 4. devDep:
npm i -D playwright && npx playwright install chromium

# 5. AI 에게:
#    "CLAUDE.md 읽고 이 프로젝트에 Figma sync 셋업해줘"  + Figma 링크 + 브리핑
```

그다음은 전부 `CLAUDE.md` 에 있습니다 — STEP 0(디자이너에게 받을 것) ~ STEP 6(운영).

## 들어있는 것

| 파일 | 목적지 | 설명 |
|---|---|---|
| `CLAUDE.md` | 루트 `CLAUDE.md` | 전체 플레이북 (역할 분담·명령어·트러블슈팅) |
| `commands/figma-sync.md` | `.claude/commands/` | `/figma-sync <url>` 슬래시 명령 절차 |
| `scripts/figma-shot.mjs` | `scripts/` | dev 서버 렌더 → PNG (Figma 대조용) |
| `server/webhook.mjs` | `server/` | webhook 수신 → 디바운스 → 배치 sync |
| `server/detect-changes.mjs` | `server/` | figma-map 노드 해시 diff → 바뀐 것만 |
| `server/figma-webhooks.mjs` | `server/` | Figma webhook 등록/조회/삭제 |
| `server/figma-map.example.json` | 참고용 | `server/figma-map.json` 은 AI 가 채움 |
| `.env.example` | 루트 | 시크릿 템플릿 |

셋업이 끝나면 `figma-sync-kit/` 폴더는 삭제해도 됩니다.
