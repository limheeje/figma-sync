---
description: Sync a Figma node into this codebase (design → code), cross-checked and screenshot-verified
argument-hint: <figma-url> [target file or component]
allowed-tools: Bash, Read, Edit, Write, Glob, Grep, mcp__plugin_figma_figma__get_metadata, mcp__plugin_figma_figma__get_screenshot, mcp__plugin_figma_figma__get_design_context, mcp__plugin_figma_figma__get_variable_defs
---

Sync the Figma node at **$1** into this codebase. Optional target: **$2**.

First orient: read `CLAUDE.md` and the project's config (package.json / framework files) to know the **stack, styling system, routing, and where components live**. Match the project's existing conventions — do not impose a different framework or CSS approach.

## Workflow

### 1. Parse the URL
`figma.com/design/:fileKey/:name?node-id=X-Y` → `fileKey = :fileKey`, `nodeId = X:Y` (hyphen → colon). No `node-id` → stop and ask for a node-specific link.

### 2. Read the design — always these three, in order
1. `get_metadata` — **fresh**; authority on structure, position, size. Catches layout changes (auto-layout on/off, moved/resized nodes).
2. `get_screenshot` — **fresh**; download it (`curl -sL -o`) and actually look.
3. `get_design_context` — reference code (React+Tailwind) + tokens. **Cached**, lags reality by minutes on position/layout edits. When it disagrees with `get_metadata`, **trust `get_metadata` + the screenshot**.

Also `get_variable_defs` on the node for the token list.

**Even when the target looks "already implemented", do not stop at a high-level check.** A sync fires *because something changed*. Go section by section: fresh `get_screenshot` of each visible child frame, compare against how the code renders now, re-fetch `get_design_context` for any section whose screenshot differs. "Working tree clean" is not a conclusion until each section's current Figma render is diffed against the code. If the webhook says a change occurred but you find nothing, the Figma read cache may still be stale — say so and stop, do not commit a "no drift" result.

### 3. Handle size / structure
- **Large node → `get_design_context` "exceeds maximum tokens".** Split: call per visible child section (from the metadata tree), assemble. Skip `hidden="true"`.
- **A container frame's own border / background / padding / gap** isn't always in a child-only read — fetch the container node itself (`forceCode: true` if needed).
- **Repeated instances** (table cells, list rows, cards) → read one, generalize to a loop over a typed data array. Don't transcribe every cell.

### 4. Write the code
- The `get_design_context` output is a **reference only**. Convert to the project's framework + styling system, matching existing files.
- Map Figma variables → the project's token system (CSS custom properties / Tailwind theme / design-token file — whatever this project uses). Add a token only if the design introduces one; comment it with the Figma node id.
- Reuse existing components where intent matches; create new only for genuinely new pieces. Keep a `data-node-id="X:Y"` (or equivalent comment) for traceability.
- Icons/images return as remote `https://.../api/mcp/asset/...` URLs that expire in ~7 days → download and commit the bytes; never hand-write `<svg>`.

### 5. Verify
- Run the project's typecheck + build (from package.json scripts).
- Run the dev server, screenshot the relevant route (`scripts/figma-shot.mjs <url> <out>`), compare with the Figma screenshot. Iterate on real mismatches (color, spacing, border, font weight).

### 6. Commit
One commit, message referencing the node: `Sync <component> to Figma <nodeId> (<what changed>)`.
Report an accuracy table: color / typography / layout / borders / data.
