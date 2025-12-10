# Mono-Bootstrap: Complete Micro-Frontend System

## 📋 Quick Navigation

### Getting Started
1. **[README.md](./README.md)** - Quick start (2 min read)
2. **[GUIDE.md](./GUIDE.md)** - Complete documentation (15 min read)
3. **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Visual diagrams & flow (10 min read)

### Reference
4. **[PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)** - File organization & descriptions
5. **[ADVANCED_CONFIG.md](./ADVANCED_CONFIG.md)** - Advanced patterns & customization
6. **[TROUBLESHOOTING.md](./TROUBLESHOOTING.md)** - Common issues & solutions

---

## 🚀 30-Second Start

```bash
# 1. Install
pnpm install

# 2. Run
pnpm dev

# 3. Open browser
# http://localhost:5000
```

**That's it!** Three apps running:
- **Host (5000):** Shell with navigation
- **Remote UI (5001):** Button & Card components
- **Remote App (5002):** Dashboard page

---

## 📦 What You Get

### ✅ Complete Vue 3 Monorepo
- 4 independent packages (host, remote-ui, remote-app, shared)
- All configured with TypeScript & Module Federation
- Production-ready code structure

### ✅ Working Examples
- Remote component library (Button, Card)
- Remote full-page application (Dashboard)
- Async loading with error boundaries
- Shared state management (Pinia)

### ✅ Comprehensive Documentation
- Architecture diagrams
- Configuration explanations
- Troubleshooting guide
- Advanced patterns

### ✅ Development Ready
- Hot Module Reload (HMR) enabled
- Type checking configured
- Build optimization setup

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────┐
│     HOST APP (Port 5000)                │
│  ┌───────────────────────────────────┐  │
│  │ Consumes:                         │  │
│  │ • Button, Card from Remote UI     │  │
│  │ • Dashboard Page from Remote App  │  │
│  │                                   │  │
│  │ Shares:                           │  │
│  │ • Vue (singleton)                 │  │
│  │ • Vue Router (singleton)          │  │
│  │ • Pinia (singleton)               │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
            │                  │
            ▼                  ▼
    ┌──────────────┐    ┌──────────────┐
    │ REMOTE-UI    │    │ REMOTE-APP   │
    │ (Port 5001)  │    │ (Port 5002)  │
    │              │    │              │
    │ Exposes:     │    │ Exposes:     │
    │ • Button     │    │ • Dashboard  │
    │ • Card       │    │   Page       │
    └──────────────┘    └──────────────┘
```

---

## 📁 File Structure

```
mono-bootstrap-project/
├── 📄 README.md                    ← Start here!
├── 📄 GUIDE.md                     ← Full docs
├── 📄 ARCHITECTURE.md              ← Flow diagrams
├── 📄 ADVANCED_CONFIG.md           ← Advanced patterns
├── 📄 TROUBLESHOOTING.md           ← FAQ & issues
├── 📄 PROJECT_STRUCTURE.md         ← File descriptions
│
├── 📦 packages/
│   ├── shared/                     ← Types & utilities
│   │   └── src/
│   │       ├── types.ts            (Interfaces)
│   │       └── utils.ts            (Helpers)
│   │
│   ├── remote-ui/                  ← Component library (Port 5001)
│   │   ├── src/
│   │   │   └── components/
│   │   │       ├── Button.vue      (Component with variants)
│   │   │       └── Card.vue        (Container component)
│   │   └── vite.config.ts          (Federation: EXPOSES)
│   │
│   ├── remote-app/                 ← Full page app (Port 5002)
│   │   ├── src/
│   │   │   └── pages/
│   │   │       └── DashboardPage.vue (Dashboard)
│   │   └── vite.config.ts          (Federation: EXPOSES)
│   │
│   └── host/                       ← Main app (Port 5000)
│       ├── src/
│       │   ├── App.vue             (Root with nav)
│       │   ├── router.ts           (Routes with async remotes)
│       │   ├── store.ts            (Pinia: theme)
│       │   ├── pages/
│       │   │   ├── HomePage.vue
│       │   │   ├── ComponentsPage.vue  (Uses remote components)
│       │   │   └── FallbackPage.vue
│       │   └── main.ts             (Entry point)
│       ├── index.html              (HTML root)
│       └── vite.config.ts          (Federation: CONSUMES)
│
└── pnpm-workspace.yaml             ← Workspace config
```

---

## 🎯 Key Concepts

### Module Federation
Allows runtime sharing of code across separate applications:
- **Host** (port 5000) consumes from remotes
- **Remote-UI** (port 5001) exposes components
- **Remote-App** (port 5002) exposes pages

### Shared Dependencies
Prevents duplicate Vue instances:
```typescript
shared: {
  vue: {
    singleton: true,      // Only ONE instance
    requiredVersion: '^3.3.4'
  }
}
```

### Async Loading
Components/pages load on demand:
```typescript
const RemoteButton = defineAsyncComponent(() => 
  import('remoteUI/Button')
);
```

---

## 🚦 Common Tasks

### Start Development
```bash
pnpm dev
```
Starts all 3 apps in parallel on ports 5000, 5001, 5002.

### Build for Production
```bash
pnpm build
```
Builds all packages to their respective `dist/` folders.

### Type Check
```bash
pnpm type-check
```
Validates TypeScript in all packages.

### Add Package
```bash
pnpm --filter @mono-bootstrap/host add vue@latest
```
Adds dependency to a specific package.

---

## ⚡ Port Configuration

| Port | Package | URL |
|------|---------|-----|
| 5000 | host | http://localhost:5000 |
| 5001 | remote-ui | http://localhost:5001 |
| 5002 | remote-app | http://localhost:5002 |

**To change ports:** Edit each package's `vite.config.ts` and update the host's `remotes` URLs.

---

## 🔧 Configuration Files

### Root Configuration
- **package.json** - Workspace dependencies & scripts
- **pnpm-workspace.yaml** - Workspace definition

### Each Package
- **vite.config.ts** - Build & federation config
- **tsconfig.json** - TypeScript compiler options
- **package.json** - Package metadata & dependencies

### Federation
Each `vite.config.ts` configures:
- **Host:** `remotes` (what to consume) + `shared` (dependencies to share)
- **Remotes:** `exposes` (what to share) + `shared` (dependencies to share)

---

## 📚 Learning Path

1. **Week 1: Basics**
   - Run `pnpm dev` and explore the 3 apps
   - Read README.md for overview
   - Click through all pages in host

2. **Week 2: Understanding**
   - Read GUIDE.md for detailed explanations
   - Study ARCHITECTURE.md flow diagrams
   - Review vite.config.ts files

3. **Week 3: Development**
   - Modify Button.vue and see changes in host
   - Add a new component to remote-ui
   - Create a new page in remote-app

4. **Week 4: Advanced**
   - Read ADVANCED_CONFIG.md
   - Implement custom shared libraries
   - Deploy to production

---

## ✨ Features Included

### 🎨 UI Components
- **Button Component** (multiple variants & sizes)
- **Card Component** (container with slots)
- Responsive design with Tailwind-style classes
- Light & dark theme support

### 🛣️ Routing
- Vue Router integration
- Async remote page loading
- Error boundaries for failed remotes

### 🔄 State Management
- Pinia store for theme management
- Shared across all packages via singleton config

### 📦 TypeScript
- Strict mode enabled
- Shared type definitions
- Full IntelliSense support

### 🏗️ Module Federation
- 3-app micro-frontend setup
- Proper shared dependency configuration
- Production-ready optimization

---

## 🎓 What You'll Learn

By using this project, you'll understand:

✅ **Monorepo Management** with PNPM workspaces  
✅ **Module Federation** for micro-frontends  
✅ **Vue 3 Composition API** with TypeScript  
✅ **Vite** as a modern build tool  
✅ **Shared Dependency Management** avoiding duplicate instances  
✅ **Async Component Loading** with error handling  
✅ **State Sharing** across application boundaries  
✅ **Production Deployment** strategies  

---

## 🚨 Troubleshooting Quick Links

| Issue | Solution |
|-------|----------|
| Port already in use | See TROUBLESHOOTING.md #2 |
| Cannot find remote module | See TROUBLESHOOTING.md #1 |
| Multiple Vue instances | See TROUBLESHOOTING.md #4 |
| CORS errors | See TROUBLESHOOTING.md #3 |
| Remote loads slowly | See TROUBLESHOOTING.md #8 |

See **TROUBLESHOOTING.md** for comprehensive solutions.

---

## 📞 Support Resources

- **Vite Docs:** https://vitejs.dev/
- **Vue 3 Docs:** https://vuejs.org/guide/
- **Module Federation:** https://webpack.js.org/concepts/module-federation/
- **PNPM Workspaces:** https://pnpm.io/workspaces
- **@originjs/vite-plugin-federation:** https://github.com/originjs/vite-plugin-federation

---

## 📝 Next Steps

1. **Install dependencies**
   ```bash
   pnpm install
   ```

2. **Start development**
   ```bash
   pnpm dev
   ```

3. **Open in browser**
   ```
   http://localhost:5000
   ```

4. **Read the docs**
   - Start with README.md
   - Then GUIDE.md for details

5. **Experiment!**
   - Modify Button.vue component
   - Add a new component to remote-ui
   - Create a new route in host

---

## 📄 File Manifest

| Document | Purpose | Read Time |
|----------|---------|-----------|
| README.md | Quick start & overview | 2 min |
| GUIDE.md | Complete architecture guide | 15 min |
| ARCHITECTURE.md | Visual flow diagrams | 10 min |
| PROJECT_STRUCTURE.md | File organization | 5 min |
| ADVANCED_CONFIG.md | Advanced patterns | 20 min |
| TROUBLESHOOTING.md | Common issues & fixes | 10 min |
| INDEX.md | This file | 5 min |

---

**Happy coding! 🚀**

Built with Vue 3 • Vite 5 • Module Federation • TypeScript

Last updated: December 2024
