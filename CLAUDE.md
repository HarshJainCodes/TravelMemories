# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev           # Dev server at https://localhost:5173 (HTTPS via mkcert)
npm run build         # Production build to dist/
npm run lint          # ESLint with auto-fix
npm run format        # Prettier formatting
npm run test:unit     # Vitest unit tests
npm run test:e2e      # Cypress E2E against preview build
npm run test:e2e:dev  # Cypress E2E against dev server (opens Cypress UI)
```

## Architecture

**Travel Memories** is a Vue 3 SPA for geotagged photo management. This repo is frontend-only; the backend is a separate .NET API at `https://travelmemories.azurewebsites.net` (local: `https://localhost:7221`). All API calls use `credentials: 'include'` for cookie-based auth.

### Key Libraries

- **Vuetify 3** — Material Design UI components
- **Pinia** — global state (auth, UI mode, chatbot)
- **TanStack Vue Query** — all server state (trips, subscriptions, conversations); queries and mutations are defined in [src/components/Queries.ts](src/components/Queries.ts)
- **Mapbox GL + Deck.gl** — interactive map with 3D overlays in [src/components/MapContainer.vue](src/components/MapContainer.vue)
- **vue3-google-login** — Google OAuth
- **Azure Application Insights** — telemetry via [src/appInsights.js](src/appInsights.js)

### Routing ([src/router/index.js](src/router/index.js))

| Path | Component |
|---|---|
| `/` | HomeView (landing) |
| `/login` | LoginView |
| `/Upload` | ImageUploader |
| `/MyCollection` | DiaryContainer (main collection view) |
| `/api` | ApiPage |
| `/Pricing` | PricingPage |

### State (Pinia stores in [src/stores/](src/stores/))

- **userDetails.js** — auth state (`isLoggedIn`, user info); `checkLogin()` validates session against the backend on app mount; `reDirectIfNotLoggedIn()` guards protected routes
- **UIMode.ts** — light/dark theme toggle
- **chatbot.ts** — current conversation ID and streaming message state

### Data Flow

1. Auth state initialized via `checkLogin()` on app mount → backend verifies session cookie
2. Vue Query fetches and caches server data; components read via `useQuery` hooks from [src/components/Queries.ts](src/components/Queries.ts)
3. Components emit events upward for mutations; mutations call `invalidateQueries` to refresh

### Notable Components

- **[MapContainer.vue](src/components/MapContainer.vue)** — Mapbox map with Deck.gl layers; contains location grouping logic and handles click events to show photo clusters
- **[ImageUploader.vue](src/components/ImageUploader.vue)** — multi-file upload with map-based location picker and trip selection
- **[DiaryContainer.vue](src/components/DiaryContainer.vue)** — orchestrates the main collection view
- **[ChatComponent/](src/components/ChatComponent/)** — AI chatbot backed by a second backend at `https://mcpservermemories.azurewebsites.net`

### TypeScript

Types are centralized in [src/components/types.ts](src/components/types.ts). The project uses mixed JS/TS; `.ts` files enforce strict mode. ESLint warns on `any` — avoid explicit `any` when possible.

### Code Style

- Prettier enforces tabs, single quotes, semicolons, 100-char line width, trailing commas
- Husky runs the pre-commit hook — `npm run lint` and `npm run format` should pass before committing
- ESLint forbids `console` statements (error-level)

### Environment Variables

Required in `.env` for local development:

```
VITE_MAPBOX_TOKEN
VITE_GOOGLE_CLIENT_ID
VITE_APPLICATION_INSIGHTS_CONN_STRING
```

### Deployment

CI/CD via GitHub Actions → Azure Static Web Apps (see [.github/workflows/](.github/workflows/)). Pushes to `main` auto-deploy. PRs get preview deployments.

## graphify

This project has a graphify knowledge graph at graphify-out/.

Rules:
- Before answering architecture or codebase questions, read graphify-out/GRAPH_REPORT.md for god nodes and community structure
- If graphify-out/wiki/index.md exists, navigate it instead of reading raw files
- For cross-module "how does X relate to Y" questions, prefer `graphify query "<question>"`, `graphify path "<A>" "<B>"`, or `graphify explain "<concept>"` over grep — these traverse the graph's EXTRACTED + INFERRED edges instead of scanning files
- After modifying code files in this session, run `graphify update .` to keep the graph current (AST-only, no API cost)
