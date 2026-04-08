<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Cursor Cloud specific instructions

This is a self-contained Next.js 16.2.2 PWA — no database, no external APIs, no Docker, no `.env` files needed.

**Services:**
| Service | Command | Port |
|---------|---------|------|
| Next.js dev server | `npm run dev` | 3000 |

**Key commands** (all defined in `package.json`):
- **Dev:** `npm run dev`
- **Build:** `npm run build`
- **Lint:** `npm run lint` (ESLint; note: 2 pre-existing `react-hooks/set-state-in-effect` errors in `SessionCard.tsx` and `hooks.ts`)

**Notes:**
- No automated test suite exists; testing is manual via the browser.
- All session data is hardcoded in `app/lib/data.ts`; no migrations or seed steps needed.
- The lockfile is `package-lock.json` — use `npm` (not pnpm/yarn).
