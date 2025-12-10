# Mono-Bootstrap: Complete Micro-Frontend Guide

A production-ready monorepo setup for Vue 3 micro-frontends using Vite and Module Federation.

## Architecture Overview

```
mono-bootstrap-monorepo/
├── apps/
│   ├── host/              # Shell app (port 5000) - loads remotes
│   └── remote-app/        # Full page app (port 5002) - exposes Dashboard page
├── packages/
│   ├── ui/                # Component library (port 5001) - exposes Button, Card
│   └── auth/              # Auth service (no port - TypeScript lib)
├── pnpm-workspace.yaml    # Workspace configuration
└── package.json           # Root package.json
```

## Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Vue | 3.3.4+ | Progressive JavaScript framework |
| Vite | 5.0.0+ | Lightning-fast build tool |
| Module Federation | @originjs/vite-plugin-federation 1.3.0+ | Code sharing at runtime |
| TypeScript | 5.3.2+ | Type safety |
| Pinia | 2.1.6+ | State management (host only) |
| PNPM | 8.0+ | Fast, efficient package manager |

## Port Configuration

Each app runs on a dedicated port to avoid conflicts:

| Application | Port | URL | Purpose |
|-------------|------|-----|---------|
| host | 5000 | http://localhost:5000 | Main shell application |
| remote-ui | 5001 | http://localhost:5001 | Component library |
| remote-app | 5002 | http://localhost:5002 | Full-page micro-frontend |

⚠️ **Important**: These ports are hardcoded in the Module Federation configurations. If you change ports, update the corresponding `vite.config.ts` files.

## Installation & Setup

### Prerequisites

- Node.js 16.0+
- PNPM 8.0+

### Step 1: Install PNPM (if not already installed)

```bash
npm install -g pnpm
```

### Step 2: Install Dependencies

```bash
pnpm install
```

This will:
- Install root dependencies
- Install all package dependencies
- Create symlinks for workspace packages

### Step 3: Verify Installation

```bash
pnpm -r list
```

## Running the Application

### Option 1: Run All Apps in Parallel (Recommended)

```bash
pnpm dev
```

This executes `pnpm -r --parallel run dev`, which:
- Starts host on http://localhost:5000
- Starts remote-ui on http://localhost:5001
- Starts remote-app on http://localhost:5002

The `--parallel` flag runs all dev servers simultaneously.

### Option 2: Run Individual Apps

```bash
# Terminal 1: Host (port 5000)
cd apps/host && pnpm dev

# Terminal 2: UI (port 5001)
cd packages/ui && pnpm dev

# Terminal 3: Remote App (port 5002)
cd apps/remote-app && pnpm dev
```

### Option 3: Run Specific Package with npm scripts

```bash
pnpm dev:host
pnpm dev:ui
pnpm dev:remote-app
```

## Key Features & Architecture

### 1. Module Federation Configuration

#### Host App (`apps/host/vite.config.ts`)

```typescript
federation({
  name: 'host_app',
  remotes: {
    uiLib: 'http://localhost:5001/assets/remoteEntry.js',
    remoteApp: 'http://localhost:5002/assets/remoteEntry.js'
  },
  shared: {
    vue: { singleton: true, requiredVersion: '^3.3.4' },
    'vue-router': { singleton: true, requiredVersion: '^4.2.5' },
    pinia: { singleton: true, requiredVersion: '^2.1.6' }
  }
})
```

**Key Points:**
- Declares **remotes** from which modules are consumed
- Uses **absolute URLs** with ports for runtime loading
- Configures **shared dependencies** to ensure only one Vue instance runs

#### UI Library (`packages/ui/vite.config.ts`)

```typescript
federation({
  name: 'ui_lib',
  filename: 'remoteEntry.js',
  exposes: {
    './Button': './src/components/Button.vue',
    './Card': './src/components/Card.vue'
  },
  shared: {
    vue: { singleton: true, requiredVersion: '^3.3.4' }
  }
})
```

**Key Points:**
- Declares **exposes** - which components/modules are available for import
- Generates `remoteEntry.js` for federation
- Shares Vue as a singleton to prevent duplication

#### Remote App (`apps/remote-app/vite.config.ts`)

```typescript
federation({
  name: 'remote_app',
  filename: 'remoteEntry.js',
  exposes: {
    './DashboardPage': './src/pages/DashboardPage.vue',
    './index': './src/bootstrap.ts'
  },
  shared: {
    vue: { singleton: true, requiredVersion: '^3.3.4' },
    'vue-router': { singleton: true, requiredVersion: '^4.2.5' }
  }
})
```

### 2. Importing Remote Components

#### Dynamic Import with Error Handling

```typescript
// apps/host/src/pages/ComponentsPage.vue
import { defineAsyncComponent } from 'vue';

const RemoteButton = defineAsyncComponent({
  loader: () => import('uiLib/Button'),
  errorComponent: () => import('@/pages/FallbackPage.vue'),
  delay: 0,
  timeout: 10000
});
```

**Benefits:**
- Lazy loads components on demand
- Provides error boundaries
- Prevents build-time coupling

#### In Router Config

```typescript
// apps/host/src/router.ts
{
  path: '/remote-dashboard',
  component: defineAsyncComponent({
    loader: () => import('remoteApp/DashboardPage'),
    errorComponent: () => import('@/pages/FallbackPage.vue'),
    timeout: 10000
  })
}
```

### 3. Shared Dependencies

**Problem:** Multiple Vue instances cause state conflicts and errors.

**Solution:** Configure shared dependencies with `singleton: true`

```typescript
shared: {
  vue: {
    singleton: true,           // Only one instance allowed
    requiredVersion: '^3.3.4', // Minimum version
    strictVersion: false       // Allow patch updates
  }
}
```

**In `package.json` (Root):**

```json
"pnpm": {
  "overrides": {
    "vue": "^3.3.4",
    "pinia": "^2.1.6"
  }
}
```

This ensures all workspaces use the same dependencies.

### 4. Build Configuration

```typescript
build: {
  target: 'esnext',      // Modern JavaScript support
  minify: false,         // Easier debugging in federation
  cssCodeSplit: false    // Single CSS file for consistency
}
```

## Project Structure Details

### Host Package (`packages/host/`)

```
host/
├── src/
│   ├── pages/
│   │   ├── HomePage.vue           # Landing page
│   │   ├── ComponentsPage.vue      # Demo of remote-ui components
│   │   └── FallbackPage.vue        # Error fallback
│   ├── App.vue                     # Root component with navigation
│   ├── main.ts                     # Entry point
│   ├── router.ts                   # Vue Router config with async routes
│   └── store.ts                    # Pinia store (theme management)
├── index.html
├── vite.config.ts                  # Federation config with remotes
├── tsconfig.json
└── package.json
```

**Key Features:**
- Navigation bar with links to all pages
- Light/Dark theme toggle via Pinia
- Router with async remote loading
- Error boundaries for failed remote loads

### Remote UI Package (`packages/remote-ui/`)

```
remote-ui/
├── src/
│   ├── components/
│   │   ├── Button.vue              # Reusable button component
│   │   └── Card.vue                # Reusable card component
│   └── index.ts                    # Export all components
├── vite.config.ts                  # Federation config with exposes
├── tsconfig.json
└── package.json
```

**Component Usage:**

```vue
<!-- Button Component -->
<RemoteButton
  label="Click Me"
  variant="primary"
  size="medium"
  @click="handleClick"
/>

<!-- Variants: primary, secondary, outline -->
<!-- Sizes: small, medium, large -->
```

### Remote App Package (`packages/remote-app/`)

```
remote-app/
├── src/
│   ├── pages/
│   │   └── DashboardPage.vue       # Full-page component
│   └── bootstrap.ts                # Entry point
├── vite.config.ts                  # Federation config with exposes
├── tsconfig.json
└── package.json
```

**Features:**
- Completely independent from host
- Can have its own routes (if needed)
- Exposes a page component that host routes to

### Shared Package (`packages/shared/`)

```
shared/
├── src/
│   ├── types.ts                    # Shared TypeScript interfaces
│   ├── utils.ts                    # Shared utility functions
│   └── index.ts                    # Re-exports
├── tsconfig.json
└── package.json
```

**Example Types:**

```typescript
export interface ButtonProps {
  label: string;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
}
```

## Common Tasks

### Build All Packages

```bash
pnpm build
```

Outputs to each package's `dist/` directory.

### Type Check

```bash
pnpm type-check
```

Validates TypeScript in all packages.

### Add Dependencies

```bash
# Add to a specific package
pnpm --filter @mono-bootstrap/host add vue@latest

# Add as dev dependency
pnpm --filter @mono-bootstrap/host add -D vite@latest

# Add to root (affects all packages)
pnpm add -w -D typescript@latest
```

### View Dependency Tree

```bash
pnpm ls
```

### Clean Build Artifacts

```bash
pnpm -r exec rm -rf dist node_modules
pnpm install
```

## Troubleshooting

### Issue: "Multiple Vue Instances" Error

**Symptom:** Reactive data doesn't work between components from different packages.

**Solution:** Verify `singleton: true` in all vite.config.ts shared configs.

```typescript
shared: {
  vue: {
    singleton: true,  // ← This is critical
    requiredVersion: '^3.3.4',
    strictVersion: false
  }
}
```

### Issue: Remote Module Not Found

**Symptom:** Error loading remoteUI/Button or remoteApp/DashboardPage

**Checklist:**
1. Ensure all 3 dev servers are running on correct ports
2. Check browser DevTools > Network tab for 404 on remoteEntry.js
3. Verify URLs in host's vite.config.ts match actual ports
4. Clear browser cache (Cmd+Shift+R on macOS)

### Issue: Port Already in Use

```bash
# Kill process on port 5000
lsof -i :5000 | grep LISTEN | awk '{print $2}' | xargs kill -9

# Or change port in vite.config.ts
server: { port: 5000 }
```

### Issue: CORS Error

Ensure all vite configs include:

```typescript
server: {
  port: 5000,
  cors: true  // ← Critical for Module Federation
}
```

### Issue: Hot Module Reload (HMR) Not Working

Add HMR configuration:

```typescript
server: {
  middlewareMode: false,
  hmr: {
    host: 'localhost',
    port: 5000,
    protocol: 'http'
  }
}
```

## Performance Optimization

### 1. Lazy Load Remote Modules

```typescript
// ✅ Good: Lazy loads only when needed
const RemoteComp = defineAsyncComponent({
  loader: () => import('remoteUI/Button')
});

// ❌ Bad: Eagerly loaded
import RemoteComp from 'remoteUI/Button';
```

### 2. Code Splitting

Each app builds independently, reducing bundle size:
- Host: ~40KB (shell + routing)
- Remote UI: ~15KB (components only)
- Remote App: ~20KB (page + logic)

### 3. Network Optimization

Set reasonable timeouts:

```typescript
defineAsyncComponent({
  loader: () => import('remoteUI/Button'),
  timeout: 10000  // 10 seconds
});
```

## Deployment

### Build for Production

```bash
pnpm build
```

### Deploy Each App Independently

Each package can be deployed to different servers:

```
host.example.com:5000      (Main shell)
components.example.com:5001 (Remote UI)
dashboard.example.com:5002  (Remote App)
```

Update vite.config.ts remotes URLs:

```typescript
remotes: {
  remoteUI: 'https://components.example.com/assets/remoteEntry.js',
  remoteApp: 'https://dashboard.example.com/assets/remoteEntry.js'
}
```

### Docker Example

```dockerfile
# Build stage
FROM node:18-alpine as builder
WORKDIR /app
RUN npm install -g pnpm
COPY . .
RUN pnpm install
RUN pnpm build

# Serve stage
FROM node:18-alpine
RUN npm install -g serve
COPY --from=builder /app/packages/host/dist /app/dist
EXPOSE 5000
CMD ["serve", "-s", "/app/dist", "-l", "5000"]
```

## Advanced Topics

### Sharing Global State

Use Pinia across all packages:

```typescript
// packages/shared/src/store.ts
import { defineStore } from 'pinia';

export const useGlobalStore = defineStore('global', {
  state: () => ({ theme: 'light' }),
  actions: { setTheme(t) { this.theme = t } }
});
```

Import in remote components:

```typescript
import { useGlobalStore } from '@mono-bootstrap/shared';

const store = useGlobalStore();
```

### Custom Shared Libraries

Share internal packages:

```typescript
federation({
  shared: {
    '@mono-bootstrap/shared': {
      singleton: true,
      requiredVersion: '*',
      strictVersion: false
    }
  }
})
```

### Version Management

Keep all packages aligned in `package.json`:

```json
{
  "workspaces": ["packages/*"],
  "pnpm": {
    "overrides": {
      "vue": "^3.3.4",
      "vue-router": "^4.2.5",
      "pinia": "^2.1.6"
    }
  }
}
```

## Resources

- **Module Federation Docs:** https://webpack.js.org/concepts/module-federation/
- **Vue 3 Guide:** https://vuejs.org/guide/
- **Vite Docs:** https://vitejs.dev/
- **PNPM Workspaces:** https://pnpm.io/workspaces

## FAQ

**Q: Can I use different versions of Vue in remotes?**  
A: Not recommended. Configure as singleton and use `strictVersion: false` for patch updates only.

**Q: What if a remote app fails to load?**  
A: Use `errorComponent` in `defineAsyncComponent` to show a fallback.

**Q: Can I hot-reload remote components?**  
A: Yes, if all dev servers are running. Changes in remote-ui will reflect in host without rebuild.

**Q: Is this production-ready?**  
A: Yes! Major companies (Adobe, Shopify) use Module Federation in production.

**Q: How do I handle authentication across remotes?**  
A: Share an auth store via Pinia that all remotes use.

---

**Happy Coding!** 🚀
