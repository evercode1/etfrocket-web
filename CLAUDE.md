# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

ETF Rocket web frontend: a React 19 + Vite 7 SPA (plain JSX, no TypeScript) for ETF portfolio tracking, dividend/income projection, comparisons ("radar"), backtesting and AI market signals, plus an admin area. Deployed on Vercel (`vercel.json` rewrites all paths to `index.html` for client-side routing).

The backend is a separate Laravel 13 project at `../etfrocket-api` (`/Users/billk/var/www/etfrocket-api`). Most features span both repos: a new screen usually needs a route + controller there and an API function here.

## Commands

```bash
npm run dev       # Vite dev server on http://localhost:5173 (the only local origin the API's CORS allows)
npm run build     # production build to dist/
npm run lint      # ESLint (flat config: js recommended + react-hooks + react-refresh)
npm run preview   # serve the built dist/
```

There is no test framework. The one standalone check is the income projection math validator:

```bash
node src/utils/incomeProjectionMathCheck.js
```

(Its header comment spells the filename with a capital `I`; the real file is lowercase, which matters on case-sensitive filesystems.)

Prettier is installed, but its config lives in `.prettier`, which Prettier does not read. The code in practice is formatted with Prettier defaults (double quotes, 2-space indent, trailing commas). Match the surrounding code, not the `.prettier` file.

## Architecture

### Talking to the API

- `src/api/client.js` is the single axios instance. `baseURL` comes from `VITE_API_BASE_URL` (set in `.env` / `.env.production`; it includes the `/api` prefix). The client attaches `Authorization: Bearer <token>` from `localStorage["etf_rocket_auth_token"]`.
- `src/api/*.js` hold one module per domain (portfolios, dividends, holdings, securities, aiSignals, comparisons, missionControl, admin*, …). Each export is a thin async wrapper that calls `api.get/post/put/delete` and returns `response.data`, which is the API's `{ success, data, message }` envelope, so pages read `.data` off the result. Pages import these functions and never call axios directly.
- `src/api.js` (a `fetch`-based `apiGet` with a hardcoded localhost URL) is legacy and unused. Use `src/api/client.js`.
- Endpoints are RPC-style kebab-case verbs, not REST resources: `/list-portfolios`, `/view-portfolio/{id}`, `/create-portfolio`, `/update-portfolio/{id}`, `/delete-portfolio/{id}`.
- **Form-config pattern:** create/edit pages first fetch a config endpoint (`/get-create-portfolio-form-config`, `/get-update-portfolio-transaction-form-config/{id}`, …) that returns the select options and current values, then submit to the matching create/update endpoint. Admin-managed dropdown values ("selects", `/admin/selects`) feed these configs.

### Backend (etfrocket-api) correspondence

- `routes/api.php` pulls in per-domain route files via `IncludeRoutes::file(...)`: `routes/Auth/auth.php`, `routes/Admin/<Domain>/*.php`, `routes/User/<Domain>/*.php`. Controllers mirror this layout under `app/Http/Controllers/{Admin,User,Public}/<Domain>/`. To find the backend for a frontend call, grep the endpoint path in `../etfrocket-api/routes`.
- Auth is Laravel Sanctum personal access tokens. `/login` and `/register` return `{ token, user }`, and `/user` returns the current user. User routes use the `auth:sanctum` middleware. Admin routes also use `isAdmin`.
- CORS (`config/cors.php`) allows `etfrocket.com`, `www.etfrocket.com`, and `http://localhost:5173` outside production.

### Auth and routing

- `src/context/AuthContext.jsx` (`useAuth()`) owns `user`, `token`, `login/register/logout`. On load it restores the session by calling `/user` and clears the token if that fails.
- `src/router/index.jsx` is the single route table (`createBrowserRouter`), with four layouts:
  - `PublicLayout` at `/`: landing page, help center, legal pages, account verification
  - `AuthLayout` at `/auth/*`: login, register, password reset
  - `AdminLayout` at `/admin/*` and `UserLayout` at `/dashboard/*`, both wrapped in `ProtectedRoute`
- `ProtectedRoute` only checks that the user is logged in. The frontend never gates `/admin` by role; the API's `isAdmin` middleware enforces it, and `UserLayout` only hides the admin link when `user.is_admin` is false.

### Pages and state

- `src/pages/{public,auth,admin,user}/` mirror the layouts. User features live under `src/pages/user/dashboard/<feature>/`. Dashboard widgets live in `src/pages/user/dashboard/components/`.
- Most portfolio-scoped routes take `:portfolioId` in the URL (`/dashboard/dividends/:portfolioId`, `/dashboard/income-projection/:portfolioId`, …). The last selected portfolio is persisted via `src/utils/portfolioContext.js` (`localStorage["selectedPortfolioId"]`). There is no global store beyond `AuthContext`; pages fetch their own data.
- Shared UI: `src/components/tables/DataTable.jsx` + `Pagination.jsx`, form primitives in `src/components/forms/`, `ConfirmDialog`, and `SecuritySymbol` (ticker display/link).
- Charts use Recharts. Markdown (legal pages in `src/content/legal/*.md`, help articles) is rendered with `react-markdown` + `@tailwindcss/typography`.

### Styling

Tailwind 3 with a dark theme defined in `tailwind.config.js`. Use the `brand-*` color tokens (`brand-background`, `brand-surface*`, `brand-primary`, `brand-text`, `brand-muted`, `brand-danger`, …) and the `font-display` / `font-body` / `font-mono` families rather than raw Tailwind colors. Shared component classes such as `.glass-card` are in `src/index.css`.
