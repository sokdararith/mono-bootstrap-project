# Project Structure Summary

## Complete Directory Layout

```
mono-bootstrap-project/
│
├── 📄 package.json                    (Root - workspace config)
├── 📄 pnpm-workspace.yaml             (Workspace definition)
├── 📄 README.md                       (Quick start guide)
├── 📄 GUIDE.md                        (Comprehensive documentation)
├── 📄 ADVANCED_CONFIG.md              (Advanced patterns)
├── 📄 TROUBLESHOOTING.md              (Issues & solutions)
│
├── 📁 apps/                           (Applications - Runnable apps)
│   │
│   ├── host/                          (Main shell app - Port 5000)
│   │   ├── src/
│   │   │   ├── pages/
│   │   │   │   ├── HomePage.vue           (Landing page with features)
│   │   │   │   ├── ComponentsPage.vue     (Demo of ui components)
│   │   │   │   └── FallbackPage.vue       (Error boundary page)
│   │   │   ├── App.vue                    (Root app with navbar & routing)
│   │   │   ├── main.ts                    (Entry point - creates Vue app)
│   │   │   ├── router.ts                  (Vue Router with async remotes)
│   │   │   └── store.ts                   (Pinia store for theme)
│   │   ├── dist/                          (Build output)
│   │   ├── index.html                     (HTML entry point)
│   │   ├── package.json                   (Package config)
│   │   ├── vite.config.ts                 (Federation: CONSUMES uiLib, remoteApp)
│   │   ├── tsconfig.json                  (TypeScript config)
│   │   ├── tsconfig.node.json
│   │   └── env.d.ts                       (Type definitions)
│   │
│   └── remote-app/                    (Full-page app - Port 5002)
│       ├── src/
│       │   ├── pages/
│       │   │   └── DashboardPage.vue  (Main page with stats & charts)
│       │   └── bootstrap.ts           (Module Federation entry)
│       ├── dist/                      (Build output)
│       ├── package.json               (Package config)
│       ├── vite.config.ts             (Federation: EXPOSES DashboardPage)
│       ├── tsconfig.json              (TypeScript config)
│       ├── tsconfig.node.json
│       └── env.d.ts                   (Type definitions)
│
└── 📁 packages/                       (Libraries - Shared code)
    │
    ├── ui/                            (Component library - Port 5001)
    │   ├── src/
    │   │   ├── components/
    │   │   │   ├── Button.vue         (Button component with variants)
    │   │   │   └── Card.vue           (Card container component)
    │   │   └── index.ts               (Export components)
    │   ├── dist/                      (Build output)
    │   ├── package.json               (Package config)
    │   ├── vite.config.ts             (Federation: EXPOSES Button, Card)
    │   ├── tsconfig.json              (TypeScript config)
    │   ├── tsconfig.node.json
    │   └── env.d.ts                   (Type definitions)
    │
    └── auth/                          (Authentication service)
        ├── src/
        │   ├── authService.ts         (AuthService class)
        │   ├── useAuth.ts             (Vue composable)
        │   └── index.ts               (Re-exports)
        ├── package.json               (Package config)
        ├── tsconfig.json              (TypeScript config)
        └── tsconfig.node.json
```

---

## File Descriptions

### Root Configuration

| File | Purpose |
|------|---------|
| `package.json` | Root workspace config, shared deps overrides |
| `pnpm-workspace.yaml` | Defines apps/* and packages/* as workspace packages |
| `README.md` | Quick start and overview |
| `GUIDE.md` | Comprehensive architecture & usage guide |
| `ADVANCED_CONFIG.md` | Advanced patterns & configurations |
| `TROUBLESHOOTING.md` | Common issues and solutions |

### Apps - Host (`apps/host/`)

| File | Purpose |
|------|---------|
| `index.html` | HTML entry point with #app div |
| `src/main.ts` | Creates Vue app, mounts to #app |
| `src/App.vue` | Root component: navbar, routes, theme toggle |
| `src/router.ts` | **Vue Router with async federation routes** |
| `src/store.ts` | **Pinia store: theme management** |
| `src/pages/HomePage.vue` | Landing page with feature grid |
| `src/pages/ComponentsPage.vue` | **Imports & demos ui components** |
| `src/pages/FallbackPage.vue` | Error fallback for failed remotes |
| `vite.config.ts` | **Federation config: CONSUMES uiLib, remoteApp** |
| `tsconfig.json` | TypeScript config with path aliases |
| `package.json` | Dependencies: vue, vue-router, pinia, vite, federation |

### Apps - Remote-App (`apps/remote-app/`)

| File | Purpose |
|------|---------|
| `src/pages/DashboardPage.vue` | Full dashboard page with stats |
| `src/bootstrap.ts` | Federation entry point |
| `vite.config.ts` | **Federation config: EXPOSES DashboardPage** |
| `tsconfig.json` | TypeScript config |
| `package.json` | Dependencies: vue, vue-router, vite, federation |

### Packages - UI (`packages/ui/`)

| File | Purpose |
|------|---------|
| `src/components/Button.vue` | Reusable button with variants/sizes |
| `src/components/Card.vue` | Reusable card container |
| `src/index.ts` | Exports all components |
| `vite.config.ts` | **Federation config: EXPOSES Button, Card** |
| `tsconfig.json` | TypeScript config |
| `package.json` | Dependencies: vue, vite, federation plugin |

### Packages - Auth (`packages/auth/`)

| File | Purpose |
|------|---------|
| `src/authService.ts` | AuthService class with login/logout methods |
| `src/useAuth.ts` | **Vue composable for auth** |
| `src/index.ts` | Re-exports authService and useAuth |
| `tsconfig.json` | TypeScript config |
| `package.json` | Dependencies: vue (peer) |

---

## Key Concepts in Each File

### Federation Configuration Files

#### `packages/host/vite.config.ts`
- **Declares remotes** from which to consume modules
- **Configures shared deps** (vue, vue-router, pinia)
- **Uses absolute URLs** with ports (5001, 5002)

#### `packages/remote-ui/vite.config.ts`
- **Declares exposes** (./Button, ./Card)
- **Generates remoteEntry.js**
- **Shares vue singleton**

#### `packages/remote-app/vite.config.ts`
- **Declares exposes** (./DashboardPage, ./index)
- **Shares vue and vue-router singletons**

### Component Files

#### `packages/remote-ui/src/components/Button.vue`
- Accepts: `label`, `variant`, `size`, `disabled`
- Emits: `@click`
- Styles: Scoped CSS with 3 variants, 3 sizes

#### `packages/host/src/pages/ComponentsPage.vue`
- **Uses `defineAsyncComponent` to load remoteUI/Button & remoteUI/Card**
- Includes error handling and loading fallbacks
- Shows code examples of federation

### Router Configuration

#### `packages/host/src/router.ts`
- **Home route**: Local HomePage.vue
- **Components route**: Local ComponentsPage.vue (which loads remote components)
- **Remote Dashboard route**: **Async loads remoteApp/DashboardPage**

This demonstrates both:
- Using remote **components** in local pages
- Using remote **pages** in local routes

---

## Port Assignment

| Port | App | Type | URL |
|------|-----|------|-----|
| **5000** | host | Shell/Consumer | http://localhost:5000 |
| **5001** | remote-ui | Provider | http://localhost:5001/assets/remoteEntry.js |
| **5002** | remote-app | Provider | http://localhost:5002/assets/remoteEntry.js |

**Update paths:**
- Host's `vite.config.ts`: Line ~10-13 (remotes URLs)
- Remote UI's `vite.config.ts`: Line ~8 (port)
- Remote App's `vite.config.ts`: Line ~8 (port)

---

## Dependency Flow

```
Host (port 5000)
├── Consumes: remoteUI/Button
├── Consumes: remoteUI/Card
├── Consumes: remoteApp/DashboardPage
└── Shares: vue, vue-router, pinia (singleton)

Remote UI (port 5001)
├── Exposes: Button.vue
├── Exposes: Card.vue
└── Shares: vue (singleton)

Remote App (port 5002)
├── Exposes: DashboardPage.vue
├── Exposes: bootstrap.ts
└── Shares: vue, vue-router (singleton)

Shared (npm link)
├── Types: ButtonProps, User, ThemeConfig
└── Utils: formatDate, capitalizeString
```

---

## Running Each Component

### Development

```bash
# All together
pnpm dev

# Or separately
pnpm --filter @mono-bootstrap/host dev           # Terminal 1
pnpm --filter @mono-bootstrap/remote-ui dev      # Terminal 2
pnpm --filter @mono-bootstrap/remote-app dev     # Terminal 3
```

### Production Build

```bash
pnpm build              # Builds all packages
pnpm preview            # Preview production build (port 4173)
```

### Type Checking

```bash
pnpm type-check        # Validate TypeScript in all packages
```

---

## File Statistics

| Category | Count | Files |
|----------|-------|-------|
| Configuration Files | 4 | package.json (root), pnpm-workspace.yaml, vite.config.ts (3x), tsconfig.json (8x) |
| Documentation | 4 | README.md, GUIDE.md, ADVANCED_CONFIG.md, TROUBLESHOOTING.md |
| Vue Components | 6 | Button.vue, Card.vue, App.vue, HomePage.vue, ComponentsPage.vue, DashboardPage.vue, FallbackPage.vue |
| TypeScript/JS Files | 7 | main.ts, router.ts, store.ts, index.ts (shared), bootstrap.ts, utils.ts, types.ts |
| Type Definition Files | 5 | env.d.ts (4x), types.ts (shared) |
| HTML Files | 1 | index.html (host) |
| **Total** | **~40** | **Across 4 packages + root** |

---

## Next Steps

1. **Install dependencies:** `pnpm install`
2. **Start development:** `pnpm dev`
3. **Open in browser:** http://localhost:5000
4. **Explore pages:** Home → Components → Remote Dashboard
5. **Read docs:** Start with README.md, then GUIDE.md
6. **Experiment:** Try modifying Button.vue and see changes in host

---

Created: December 2024  
Framework: Vue 3 (Composition API)  
Build Tool: Vite 5+  
Module Federation: @originjs/vite-plugin-federation
