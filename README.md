# Quick Start

## TL;DR

```bash
# 1. Install dependencies
pnpm install

# 2. Run all apps in parallel
pnpm dev

# 3. Open in browser
# Host: http://localhost:5000
# Remote UI: http://localhost:5001
# Remote App: http://localhost:5002
```

## What Happens?

- **Host (5000):** Shell app with navigation, loads remote components and pages
- **Remote UI (5001):** Button & Card components accessible via Module Federation
- **Remote App (5002):** Full Dashboard page loaded asynchronously in host router

## Navigation

1. **Home Page:** Introduction and feature overview
2. **Components Page:** Demo of Button and Card components from ui package
3. **Remote Dashboard:** Full page loaded from remote-app (takes ~1-2 seconds on first load)

## Build

```bash
pnpm build  # Builds all packages
```

## Scripts Available

```bash
# Development
pnpm dev                      # Start all apps in parallel
pnpm dev:host                 # Start only host
pnpm dev:ui                   # Start only ui
pnpm dev:remote-app           # Start only remote-app

# Production
pnpm build                    # Build all packages
pnpm preview                  # Preview production build

# Type checking
pnpm type-check              # TypeScript validation
```

## Port Configuration

| App | Port | Edit File |
|-----|------|-----------|
| host | 5000 | `apps/host/vite.config.ts` |
| ui | 5001 | `packages/ui/vite.config.ts` |
| remote-app | 5002 | `apps/remote-app/vite.config.ts` |

**⚠️ If you change ports, update the `remotes` URLs in host's vite.config.ts!**

## Key Files to Review

- **Module Federation Config:** Each `apps/*/vite.config.ts` and `packages/*/vite.config.ts`
- **Host Router:** `apps/host/src/router.ts`
- **Remote Components:** `packages/ui/src/components/`
- **Remote Page:** `apps/remote-app/src/pages/DashboardPage.vue`
- **Auth Service:** `packages/auth/src/authService.ts`

## Common Issues

| Issue | Solution |
|-------|----------|
| "Cannot find module" | Run `pnpm install` and ensure all dev servers are running |
| Port already in use | Change port in corresponding `vite.config.ts` |
| Remote not loading | Check browser console and ensure correct URLs in host config |
| Slow first load | Remotes load on-demand; first load takes ~1-2 seconds |

See `GUIDE.md` for detailed documentation.
