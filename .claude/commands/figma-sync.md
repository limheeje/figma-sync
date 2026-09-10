---
description: Sync a Figma node into the Vue codebase (design → code), cross-checked and screenshot-verified
argument-hint: <figma-url> [target file or component]
allowed-tools: Bash, Read, Edit, Write, Glob, Grep, mcp__plugin_figma_figma__get_metadata, mcp__plugin_figma_figma__get_screenshot, mcp__plugin_figma_figma__get_design_context, mcp__plugin_figma_figma__get_variable_defs
---

Sync the Figma node at **$1** into this codebase. Optional target: **$2**.

This project is a fixed **1920px desktop** Vue 3 + `<script setup lang="ts">` app.
Design tokens live in `src/style.css` `:root` (`--parata-*`, Pretendard scale). Reuse them — never hardcode a hex/size that already has a token.

## Workflow

### 1. Parse the URL
From `https://figma.com/design/:fileKey/:name?node-id=X-Y` → `fileKey = :fileKey`, `nodeId = X:Y` (hyphen → colon). If there is no `node-id`, stop and ask for a node-specific link.

### 2. Read the design — always these three, in this order
1. `get_metadata` — **fresh**; the authority on structure, position, size. Catches layout changes (auto-layout on/off, moved/resized nodes).
2. `get_screenshot` — **fresh**; download it (`curl -sL -o` into `scripts/.shots/figma.png`) and actually look at it.
3. `get_design_context` — reference code + tokens. **This one is cached** and can lag reality by minutes, especially for position/layout edits. When its code disagrees with `get_metadata` (e.g. still shows a grid after auto-layout was removed), **trust `get_metadata` + the screenshot**.

Also run `get_variable_defs` on the node for the token list.

**Even when the page looks "already implemented", do not stop at a high-level check.** A sync is triggered *because something changed*. Go section by section: fresh `get_screenshot` of each visible child frame, compare against how that component renders now (`npm run shot`), and re-fetch `get_design_context` for any section whose screenshot differs. "Working tree clean, looks fine" is not a valid conclusion until you have actually diffed each section's current Figma render against the code.

If the automated context says a change was reported by a webhook but you find nothing: the Figma MCP read cache may still hold the pre-save design. Say so explicitly and stop — do not commit a "no drift" result. A longer debounce (see `server/.env` `DEBOUNCE_MS`) is the fix.

### 3. Handle size / structure
- **Large node → `get_design_context` returns "exceeds maximum tokens".** Split: call it per visible child section (from the metadata tree), assemble the results. Skip `hidden="true"` nodes.
- **Parent frame properties are separate.** A frame's own `border`, `background`, `padding`, `gap` don't always show when you only fetch its children. Fetch the container node itself (use `forceCode: true` if needed) to get them — this is how the `2px navy` table top border was missed the first time.
- **Repeated instances** (`Table_td1` ×N, cards, rows) → read **one**, then generalize to a `v-for` over a typed data array. Don't transcribe every cell.

### 4. Write the code
- React+Tailwind from `get_design_context` is a **reference only**. Convert to Vue SFC + scoped CSS, matching existing components in `src/components/`.
- Map Figma variables → existing `--parata-*` / Pretendard tokens in `src/style.css`. Add a new token only if the design introduces one; comment it with the Figma node id.
- Reuse existing components where the design intent matches; only create a new SFC for a genuinely new piece. Keep `data-node-id="X:Y"` attributes for traceability.
- Icons/images come back as remote `https://.../api/mcp/asset/...` URLs that expire in ~7 days — download and commit the bytes under `src/assets/`, never inline hand-drawn SVG.

### 5. Verify
```
npx vue-tsc --noEmit
npx vite build
```
Then, with the dev server running (`npm run dev`):
```
node scripts/figma-shot.mjs                 # -> scripts/.shots/render.png
```
Read `scripts/.shots/render.png` and compare side-by-side with `scripts/.shots/figma.png`. Iterate on real mismatches (color, spacing, border, font weight).

### 6. Commit
One commit, message referencing the node: `Sync <component> to Figma <nodeId> (<what changed>)`.
Report an accuracy table: color / typography / layout / borders / data — ✅ or the specific gap.
