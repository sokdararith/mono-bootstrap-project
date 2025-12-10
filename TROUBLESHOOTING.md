# Troubleshooting & FAQ

## Common Issues and Solutions

### 1. "Cannot find module" Errors

#### Problem
```
Cannot find module 'uiLib/Button' or its corresponding type declarations
```

#### Causes & Solutions

| Cause | Solution |
|-------|----------|
| Remote dev server not running | Ensure all 3 apps are running: `pnpm dev` |
| Dependencies not installed | Run `pnpm install` |
| Port mismatch | Check URLs in host's `apps/host/vite.config.ts` match actual ports |
| Remote not exposed | Verify `exposes` in remote's `vite.config.ts` includes the module |
| Old browser cache | Clear cache: Cmd+Shift+R (macOS) or Ctrl+Shift+R (Linux/Windows) |

**Quick Fix:**
```bash
# Clean install
rm -rf node_modules pnpm-lock.yaml
pnpm install
pnpm dev
```

---

### 2. Port Already in Use

#### Problem
```
Error: listen EADDRINUSE: address already in use :::5000
```

#### Solution 1: Kill the Process
```bash
# macOS/Linux
lsof -i :5000 | grep LISTEN | awk '{print $2}' | xargs kill -9

# Windows (PowerShell)
Get-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess | Stop-Process -Force
```

#### Solution 2: Change Port
**apps/host/vite.config.ts:**
```typescript
server: {
  port: 5000,  // ← Change to 3000, 8000, etc.
  cors: true
}
```

**⚠️ Important:** Also update the corresponding URLs in other vite.config.ts files!

---

### 3. CORS (Cross-Origin Resource Sharing) Error

#### Problem
```
Access to XMLHttpRequest at 'http://localhost:5001/assets/remoteEntry.js' 
from origin 'http://localhost:5000' has been blocked by CORS policy
```

#### Solution

Ensure all vite.config.ts files have:
```typescript
server: {
  cors: true  // ← Critical for federation to work
}
```

**For production deployment:**
```typescript
server: {
  cors: {
    origin: ['https://your-host-domain.com'],
    credentials: true
  }
}
```

---

### 4. Multiple Vue Instances Error

#### Problem
Reactive data doesn't update between remote components and host. Global state is duplicated.

#### Diagnosis
In browser console:
```javascript
console.log(Vue.version) // Run in multiple apps
```

If versions differ or Vue is loaded twice, you have the multiple instance problem.

#### Solution

**In all vite.config.ts files**, ensure:
```typescript
federation({
  shared: {
    vue: {
      singleton: true,      // ← CRITICAL
      requiredVersion: '^3.3.4',
      strictVersion: false
    }
  }
})
```

**Also in root package.json:**
```json
{
  "pnpm": {
    "overrides": {
      "vue": "3.3.4"  // ← Force same version
    }
  }
}
```

**Reset and reinstall:**
```bash
pnpm install
rm -rf node_modules/.pnpm-lock.yaml
pnpm install
```

---

### 5. Module Federation Remotes Not Loading

#### Problem
Remote modules load sometimes but not reliably. Network tab shows 404.

#### Checklist
1. **Are all servers running?**
   ```bash
   ps aux | grep vite  # Check processes
   ```

2. **Are URLs correct?**
   ```bash
   # Test if remoteEntry.js exists
   curl http://localhost:5001/assets/remoteEntry.js
   ```

3. **Is port correct in vite.config.ts?**
   ```typescript
   remotes: {
     remoteUI: 'http://localhost:5001/assets/remoteEntry.js'  // ← Check port
   }
   ```

4. **Is remote exposing the module?**
   ```typescript
   // In remote's vite.config.ts
   federation({
     exposes: {
       './Button': './src/components/Button.vue'  // ← Check path matches
     }
   })
   ```

#### Solution
```bash
# Restart all apps
pnpm dev

# Or restart just the problematic one
cd packages/remote-ui && pnpm dev
```

---

### 6. Hot Module Reload (HMR) Not Working

#### Problem
Changes in remote-ui components don't reflect in host without full page reload.

#### Solution 1: Simple Fix
Add explicit HMR config:
```typescript
// packages/remote-ui/vite.config.ts
server: {
  port: 5001,
  hmr: {
    host: 'localhost',
    port: 5001,
    protocol: 'http'
  }
}
```

#### Solution 2: For Network Development
If developing on a network (not localhost):
```typescript
server: {
  hmr: {
    host: '192.168.1.100',  // Your machine IP
    port: 5001
  }
}
```

#### Solution 3: Disable HMR in Development
```typescript
server: {
  middlewareMode: true  // Disables HMR but ensures stability
}
```

---

### 7. TypeScript Errors on Remote Imports

#### Problem
```
Cannot find module 'remoteUI/Button' or its corresponding type declarations.
```

#### Solution 1: Create Type Declarations
**packages/host/src/types/federation.d.ts:**
```typescript
declare module 'remoteUI/Button' {
  import type { DefineComponent } from 'vue';
  const Component: DefineComponent;
  export default Component;
}

declare module 'remoteUI/Card' {
  import type { DefineComponent } from 'vue';
  const Component: DefineComponent;
  export default Component;
}

declare module 'remoteApp/DashboardPage' {
  import type { DefineComponent } from 'vue';
  const Component: DefineComponent;
  export default Component;
}
```

#### Solution 2: Disable Type Checking Temporarily
```bash
# In tsconfig.json
"skipLibCheck": true  // ← Already enabled in this project
```

---

### 8. Remote App Takes Too Long to Load

#### Problem
Remote Dashboard takes 5+ seconds to load on first access.

#### Explanation
This is **normal and expected**:
1. First load: Browser downloads remoteEntry.js (~5-20KB)
2. Browser fetches shared dependencies from host
3. Remote components are parsed and instantiated
4. Subsequent loads: Uses browser cache (~1 second)

#### Optimization
Add a loading indicator:
```vue
<!-- packages/host/src/pages/ComponentsPage.vue -->
<Suspense>
  <template #default>
    <RemoteButton label="Click" />
  </template>
  <template #fallback>
    <div>Loading remote component...</div>
  </template>
</Suspense>
```

---

### 9. Shared Dependencies Not Working

#### Problem
Each remote has its own instance of a shared library (e.g., Pinia store).

#### Solution
Configure sharing in ALL vite.config.ts files:

**packages/host/vite.config.ts:**
```typescript
federation({
  shared: {
    vue: { singleton: true, requiredVersion: '^3.3.4' },
    pinia: { singleton: true, requiredVersion: '^2.1.6' }
  }
})
```

**packages/remote-ui/vite.config.ts:**
```typescript
federation({
  shared: {
    vue: { singleton: true, requiredVersion: '^3.3.4' },
    pinia: { singleton: true, requiredVersion: '^2.1.6' }  // ← Add this
  }
})
```

**Verify in DevTools:**
```javascript
// In browser console
window.__SHARED_SCOPE__.pinia  // Should show shared instance
```

---

### 10. Build Fails with Module Federation Errors

#### Problem
```
Failed to resolve entry for package: @originjs/vite-plugin-federation
```

#### Solution
```bash
# Reinstall with correct Node/npm versions
node --version  # Should be 16+
npm --version   # Should be 8+

# Clear cache
rm -rf node_modules pnpm-lock.yaml .next dist

# Reinstall
pnpm install

# Build
pnpm build
```

---

### 11. Styles Not Loading from Remote

#### Problem
Remote Button component loads but has no styles.

#### Solution

Ensure `cssCodeSplit: false` in vite.config.ts:
```typescript
// packages/remote-ui/vite.config.ts
build: {
  cssCodeSplit: false  // ← Critical for federation
}
```

Also add `<style scoped>` in components (already done in this project).

---

### 12. Environment Variables Not Available in Remote

#### Problem
```
undefined is not defined: process.env.API_URL
```

#### Solution
Define in each package's `.env`:

**packages/remote-ui/.env:**
```
VITE_API_URL=http://localhost:3000/api
```

**In component:**
```typescript
const API_URL = import.meta.env.VITE_API_URL;
```

---

### 13. Production Build Issues

#### Problem
Works in development but fails in production.

#### Common Causes

1. **Wrong remotes URLs in production build**
   ```typescript
   const isProduction = process.env.NODE_ENV === 'production';
   const remotes = isProduction 
     ? {
         remoteUI: 'https://cdn.example.com/remote-ui/remoteEntry.js',
         remoteApp: 'https://cdn.example.com/remote-app/remoteEntry.js'
       }
     : {
         remoteUI: 'http://localhost:5001/assets/remoteEntry.js',
         remoteApp: 'http://localhost:5002/assets/remoteEntry.js'
       };
   ```

2. **Missing GZIP compression**
   Configure server to gzip .js and .css files

3. **Cache busting**
   Ensure assets have hash in filename:
   ```typescript
   build: {
     rollupOptions: {
       output: {
         entryFileNames: '[name]-[hash].js',
         chunkFileNames: '[name]-[hash].js',
         assetFileNames: '[name]-[hash][extname]'
       }
     }
   }
   ```

---

## Performance Tips

### 1. Measure Load Times
```typescript
performance.mark('remote-load-start');
const RemoteComponent = defineAsyncComponent(() => import('remoteUI/Button'));
performance.mark('remote-load-end');
performance.measure('remote-load', 'remote-load-start', 'remote-load-end');
console.log(performance.getEntriesByName('remote-load'));
```

### 2. Preload Critical Remotes
```html
<!-- packages/host/index.html -->
<link rel="prefetch" href="http://localhost:5001/assets/remoteEntry.js">
<link rel="prefetch" href="http://localhost:5002/assets/remoteEntry.js">
```

### 3. Lazy Load Non-Critical Remotes
Only load dashboard on demand, not on app startup.

---

## Debugging Tips

### Enable Detailed Logging
```typescript
// In vite.config.ts
export default defineConfig({
  define: {
    __FEDERATION_DEBUG__: true
  }
});
```

### Browser DevTools
1. **Network Tab**: Monitor .js and remoteEntry.js downloads
2. **Console Tab**: Check for Module Federation errors
3. **Performance Tab**: Measure load times
4. **Sources Tab**: Debug remote component code

### VSCode Debugging
**Launch configuration for remote-ui:**
```json
{
  "type": "chrome",
  "request": "launch",
  "name": "Remote UI",
  "url": "http://localhost:5001",
  "webRoot": "${workspaceFolder}/packages/remote-ui"
}
```

---

## When All Else Fails

### Nuclear Option: Clean Slate
```bash
# Delete all artifacts
find . -name "dist" -type d -exec rm -rf {} +
find . -name "node_modules" -type d -exec rm -rf {} +
find . -name "pnpm-lock.yaml" -delete

# Reinstall everything
pnpm install

# Start fresh
pnpm dev
```

### Check System Resources
```bash
# Ensure you have enough memory
free -h  # Linux
vm_stat # macOS

# Check Node.js version
node --version  # Should be 16.0+
pnpm --version  # Should be 8.0+
```

---

## Getting Help

1. **Check browser console** for detailed errors
2. **Review GUIDE.md** for architecture overview
3. **Check ADVANCED_CONFIG.md** for advanced patterns
4. **Test with simpler cases** (e.g., just Button component)
5. **Create minimal reproduction** if reporting issues

---

## FAQ

**Q: Can I use different package managers (npm/yarn) instead of pnpm?**  
A: Yes, but pnpm is recommended for monorepos due to efficient disk usage.

**Q: Can I deploy remotes to different domains?**  
A: Yes! Update `remotes` URLs in host's `vite.config.ts` to point to your CDN/servers.

**Q: Do I need all 3 apps running during development?**  
A: No. Host will show fallback pages for unavailable remotes.

**Q: Can I share state between remotes?**  
A: Yes, through Pinia stores configured as shared dependencies.

**Q: Is Module Federation only for Vue?**  
A: No! It works with React, Angular, Vue, and vanilla JS.

---

Last updated: December 2024
