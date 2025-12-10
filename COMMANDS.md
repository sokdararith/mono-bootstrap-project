# Common Commands & Workflows

## Development Workflows

### First Time Setup (Complete)

```bash
# 1. Clone/navigate to project
cd mono-bootstrap-project

# 2. Install all dependencies
pnpm install

# 3. Start all apps
pnpm dev

# 4. Open browser
# http://localhost:5000
```

### Daily Development (Quick)

```bash
# Terminal 1: Start all apps
pnpm dev

# Browser: http://localhost:5000

# Continue working...
```

### Modify UI Component

```bash
# Make changes to Button.vue
# packages/ui/src/components/Button.vue

# Automatically rebuilds when you save
# Changes visible in host's Components page within 1-2 seconds
```

### Add New Component to UI Library

```bash
# 1. Create component
# packages/ui/src/components/MyComponent.vue

# 2. Add to exposes in vite.config.ts
# exposes: {
#   './MyComponent': './src/components/MyComponent.vue'
# }

# 3. Import in host
# defineAsyncComponent(() => import('uiLib/MyComponent'))

# 4. Use in host component
# <MyComponent />
```

### Add New Page to Host

```bash
# 1. Create page
# packages/host/src/pages/MyPage.vue

# 2. Add route to router.ts
# {
#   path: '/my-page',
#   component: () => import('@/pages/MyPage.vue')
# }

# 3. Add navigation link to App.vue
# <router-link to="/my-page">My Page</router-link>
```

---

## Dependency Management

### Add Package to Host

```bash
pnpm --filter @mono-bootstrap/host add lodash
```

### Add Package to UI Library

```bash
pnpm --filter @mono-bootstrap/ui add axios
```

### Add Package to Remote-App

```bash
pnpm --filter @mono-bootstrap/remote-app add axios
```

### Add Dev Dependency

```bash
pnpm --filter @mono-bootstrap/host add -D @types/node
```

### Add to Root (All Packages)

```bash
pnpm add -w -D prettier
```

### Update All Dependencies

```bash
pnpm -r update
```

### Remove Dependency

```bash
pnpm --filter @mono-bootstrap/host remove lodash
```

---

## Building & Deployment

### Build All Packages

```bash
pnpm build
```

Output:
- `apps/host/dist/`
- `packages/ui/dist/`
- `apps/remote-app/dist/`

### Preview Production Build (Locally)

```bash
# After building, preview host build
cd apps/host
pnpm preview
# Opens http://localhost:4173
```

### Build Specific Package

```bash
pnpm --filter @mono-bootstrap/host build
```

### Type Check Before Build

```bash
pnpm type-check
```

---

## Testing & Validation

### Type Check All Packages

```bash
pnpm type-check
```

### List All Dependencies

```bash
pnpm ls
```

### List Workspace Structure

```bash
pnpm list -r --depth=1
```

### View Package Versions

```bash
pnpm ls --depth=0
```

---

## Development Server Management

### Start All Apps

```bash
pnpm dev
```

### Start Only Host

```bash
pnpm --filter @mono-bootstrap/host dev
```

### Start Only Remote UI

```bash
pnpm --filter @mono-bootstrap/remote-ui dev
```

### Start Only Remote App

```bash
pnpm --filter @mono-bootstrap/remote-app dev
```

### Kill Hanging Server (macOS/Linux)

```bash
# Find process
lsof -i :5000

# Kill by PID
kill -9 <PID>

# Or kill all node processes
killall node
```

---

## Debugging

### Enable Debug Logging

```bash
DEBUG=true pnpm dev
```

### View Browser Console

In any app:
1. Press F12 to open DevTools
2. Go to Console tab
3. Look for Module Federation logs

### Check Network Traffic

1. Open DevTools → Network tab
2. Look for `remoteEntry.js` downloads
3. Check response status codes

### Inspect Shared Scope

In browser console:
```javascript
// Check if Vue is shared
console.log(window.__SHARED_SCOPE__);

// Check version
console.log(Vue.version);
```

### Clear Cache & Restart

```bash
# Delete build artifacts
rm -rf node_modules dist packages/*/dist

# Reinstall
pnpm install

# Start fresh
pnpm dev
```

---

## Common Patterns

### Import Remote Component

```typescript
// packages/host/src/pages/SomePage.vue
import { defineAsyncComponent } from 'vue';

const RemoteButton = defineAsyncComponent({
  loader: () => import('remoteUI/Button'),
  errorComponent: () => import('@/pages/FallbackPage.vue'),
  delay: 0,
  timeout: 10000
});

export default {
  components: { RemoteButton }
};
```

### Use Shared Store

```typescript
// Any component in any package
import { useAppStore } from '@/store';

const store = useAppStore();
// Access: store.theme, store.setTheme()
```

### Create New Component with Props

```vue
<!-- packages/remote-ui/src/components/NewComponent.vue -->
<template>
  <div class="component">
    <h3>{{ title }}</h3>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string;
}

withDefaults(defineProps<Props>(), {
  title: 'Default Title'
});
</script>

<style scoped>
.component {
  padding: 1rem;
}
</style>
```

### Export from Remote

```typescript
// packages/remote-ui/vite.config.ts
federation({
  exposes: {
    './NewComponent': './src/components/NewComponent.vue'
  }
})
```

### Use in Host

```vue
<!-- packages/host/src/pages/SomePage.vue -->
<script setup lang="ts">
import { defineAsyncComponent } from 'vue';

const RemoteNewComponent = defineAsyncComponent(() =>
  import('remoteUI/NewComponent')
);
</script>

<template>
  <RemoteNewComponent title="Hello from Remote!" />
</template>
```

---

## Deployment Scenarios

### Deploy All to Same Server

```bash
# Build
pnpm build

# Copy all dist folders to server
# /app/host
# /app/remote-ui
# /app/remote-app

# Configure host vite.config.ts:
remotes: {
  remoteUI: 'http://your-domain.com/remote-ui/remoteEntry.js',
  remoteApp: 'http://your-domain.com/remote-app/remoteEntry.js'
}
```

### Deploy to Different Servers

```bash
# Host → https://host.example.com
# Remote UI → https://components.example.com
# Remote App → https://dashboard.example.com

# Configure host:
remotes: {
  remoteUI: 'https://components.example.com/assets/remoteEntry.js',
  remoteApp: 'https://dashboard.example.com/assets/remoteEntry.js'
}
```

### Deploy to CDN

```bash
# Build
pnpm build

# Upload to CDN
# dist/remoteEntry.js → cdn.example.com/remote-ui/remoteEntry.js
# dist/Button-*.js → cdn.example.com/remote-ui/Button-*.js

# Configure host:
remotes: {
  remoteUI: 'https://cdn.example.com/remote-ui/remoteEntry.js'
}
```

---

## Docker Deployment

### Dockerfile for Host

```dockerfile
FROM node:18-alpine as builder
WORKDIR /app
RUN npm install -g pnpm
COPY . .
RUN pnpm install
RUN pnpm --filter @mono-bootstrap/host build

FROM nginx:alpine
COPY --from=builder /app/packages/host/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Build Docker Image

```bash
docker build -t mono-bootstrap-host .
docker run -p 5000:80 mono-bootstrap-host
```

---

## Git Workflow

### Commit Code

```bash
git add .
git commit -m "Add Button component"
git push origin main
```

### Cherry Pick Commits from Branch

```bash
# List commits
git log branch-name --oneline

# Cherry pick specific commit
git cherry-pick <commit-hash>
```

### Merge Feature Branch

```bash
git checkout main
git pull origin main
git merge feature-branch
git push origin main
```

---

## Performance Optimization

### Analyze Bundle Size

```bash
# After build
cd packages/host
du -sh dist/

# Check what's in dist
ls -lh dist/assets/
```

### Enable Minification

```typescript
// vite.config.ts
build: {
  minify: 'terser'  // Smaller bundles
}
```

### Enable Code Splitting

```typescript
// vite.config.ts
build: {
  rollupOptions: {
    output: {
      manualChunks: {
        'vue': ['vue']
      }
    }
  }
}
```

---

## Monitoring & Analytics

### Performance Metrics

```javascript
// In browser console
performance.getEntries()
  .filter(e => e.name.includes('remote'))
  .forEach(e => console.log(`${e.name}: ${e.duration}ms`));
```

### Monitor Remote Loading

```typescript
// packages/host/src/main.ts
const start = performance.now();
import('remoteUI/Button').then(() => {
  console.log(`Loaded in ${performance.now() - start}ms`);
});
```

---

## Useful Commands Summary

```bash
# Development
pnpm dev                              # Start all apps
pnpm --filter @mono-bootstrap/host dev # Start host only

# Building
pnpm build                            # Build all packages
pnpm --filter @mono-bootstrap/host build # Build host only

# Dependencies
pnpm add lodash                       # Add to host (default)
pnpm --filter @mono-bootstrap/host add lodash # Explicit
pnpm -w add -D typescript             # Add to root

# Management
pnpm ls                               # List dependencies
pnpm install                          # Fresh install
pnpm update                           # Update all

# Quality
pnpm type-check                       # Type validation
pnpm -r exec rm -rf dist              # Clean builds

# Utilities
pnpm --filter @mono-bootstrap/host run dev # Custom script
```

---

## Troubleshooting Common Commands

### Port Already in Use

```bash
# macOS/Linux
lsof -i :5000 | grep LISTEN | awk '{print $2}' | xargs kill -9

# Windows (PowerShell)
Get-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess | Stop-Process
```

### Clear Everything & Start Fresh

```bash
rm -rf node_modules dist
pnpm install
pnpm dev
```

### Dependency Conflicts

```bash
# Reinstall with clean state
rm -rf pnpm-lock.yaml
pnpm install
```

### Verify Installation

```bash
pnpm --version      # Should be 8.0+
node --version      # Should be 16.0+
pnpm ls --depth=0   # Shows all packages
```

---

## IDE Setup (VS Code)

### Recommended Extensions

1. **Volar** (Vue 3 support)
2. **TypeScript Vue Plugin**
3. **ESLint**
4. **Prettier**
5. **Thunder Client** (REST testing)

### VS Code Settings

```json
{
  "[vue]": {
    "editor.formatOnSave": true,
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescript]": {
    "editor.formatOnSave": true
  },
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true
}
```

---

Last updated: December 2024
