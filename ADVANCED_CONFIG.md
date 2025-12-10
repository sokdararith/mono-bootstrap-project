# Module Federation Advanced Configuration Guide

This document covers advanced configuration patterns and best practices for the Mono-Bootstrap monorepo.

## 1. Shared Dependencies Deep Dive

### Understanding Singleton Mode

```typescript
shared: {
  vue: {
    singleton: true,       // ← Only ONE instance across all remotes
    requiredVersion: '^3.3.4',
    strictVersion: false   // Allows patch version differences
  }
}
```

#### What This Means:

- **singleton: true**: If host and remotes both need Vue, they share the same instance
- **requiredVersion**: Minimum version required; host must have this version
- **strictVersion: false**: Allows 3.3.4, 3.3.5, 3.3.6, etc., but not 3.4.0

### Without Singleton (❌ Causes Issues):

```typescript
// This creates 2 Vue instances!
shared: {
  vue: {
    singleton: false
  }
}
```

Result:
- Reactive stores don't sync between packages
- Event buses don't work
- Strange memory leaks

### Shared Dependencies in This Project

```typescript
// Host can consume from multiple sources, so it shares more
shared: {
  vue: { singleton: true, requiredVersion: '^3.3.4' },
  'vue-router': { singleton: true, requiredVersion: '^4.2.5' },
  pinia: { singleton: true, requiredVersion: '^2.1.6' }
}

// Remote UI only uses Vue
shared: {
  vue: { singleton: true, requiredVersion: '^3.3.4' }
}

// Remote App uses Vue and Vue Router
shared: {
  vue: { singleton: true, requiredVersion: '^3.3.4' },
  'vue-router': { singleton: true, requiredVersion: '^4.2.5' }
}
```

## 2. Version Conflict Resolution

### Scenario: Remote requires a newer Vue version

```typescript
// Host: vue@3.3.4
// Remote: vue@3.4.0 (in its package.json)
```

**Configure in host's vite.config.ts:**

```typescript
shared: {
  vue: {
    singleton: true,
    requiredVersion: false,  // Host accepts any version
    strictVersion: false
  }
}
```

### Scenario: You want to enforce a maximum version

```typescript
shared: {
  vue: {
    singleton: true,
    requiredVersion: '^3.3.4 <4.0.0',  // >= 3.3.4 but < 4.0.0
    strictVersion: true      // Strictly enforce
  }
}
```

### Best Practice:

Use pnpm overrides in root package.json to force versions:

```json
{
  "pnpm": {
    "overrides": {
      "vue": "3.3.4",
      "vue-router": "4.2.5",
      "pinia": "2.1.6"
    }
  }
}
```

This ensures all packages use the exact same dependency versions.

## 3. Custom Library Sharing

### Share Your Own Utilities Library

**packages/shared/package.json:**

```json
{
  "name": "@mono-bootstrap/shared",
  "version": "1.0.0",
  "exports": {
    ".": "./dist/index.js"
  }
}
```

**packages/shared/src/store.ts:**

```typescript
import { defineStore } from 'pinia';

export const useGlobalAppState = defineStore('globalApp', {
  state: () => ({
    user: null,
    theme: 'light'
  }),
  actions: {
    setUser(user) { this.user = user },
    setTheme(theme) { this.theme = theme }
  }
});
```

**Configure in all vite.config.ts files:**

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

**Use in any remote:**

```typescript
// packages/remote-ui/src/components/Button.vue
import { useGlobalAppState } from '@mono-bootstrap/shared';

const appState = useGlobalAppState();
```

## 4. Dynamic Remote URLs (Production-Ready)

Instead of hardcoding URLs, load them dynamically:

**packages/host/vite.config.ts:**

```typescript
const REMOTES = {
  development: {
    remoteUI: 'http://localhost:5001/assets/remoteEntry.js',
    remoteApp: 'http://localhost:5002/assets/remoteEntry.js'
  },
  production: {
    remoteUI: 'https://components.example.com/assets/remoteEntry.js',
    remoteApp: 'https://dashboard.example.com/assets/remoteEntry.js'
  }
};

const isDev = process.env.NODE_ENV === 'development';
const remotes = isDev ? REMOTES.development : REMOTES.production;

export default defineConfig({
  plugins: [
    federation({
      remotes
    })
  ]
});
```

## 5. Custom Fallback Error Handling

**packages/host/src/utils/federationLoader.ts:**

```typescript
import { defineAsyncComponent } from 'vue';

export function loadRemoteComponent(
  scope: string,
  module: string,
  fallback?: any
) {
  return defineAsyncComponent({
    loader: async () => {
      try {
        const remoteModule = await import(`${scope}/${module}`);
        return remoteModule.default || remoteModule;
      } catch (error) {
        console.error(`Failed to load ${scope}/${module}:`, error);
        
        // Try fallback
        if (fallback) {
          return fallback;
        }
        
        // Default error component
        return {
          template: `<div style="padding: 20px; color: red;">
            Failed to load remote module: ${scope}/${module}
          </div>`
        };
      }
    },
    delay: 0,
    timeout: 10000,
    errorComponent: {
      template: `<div style="padding: 20px; color: red;">
        Error loading remote. Please refresh the page.
      </div>`
    }
  });
}
```

**Usage:**

```typescript
import { loadRemoteComponent } from '@/utils/federationLoader';
import FallbackButton from '@/components/FallbackButton.vue';

const RemoteButton = loadRemoteComponent('remoteUI', 'Button', FallbackButton);
```

## 6. Exposing Multiple Versions

Expose different versions of the same component:

**packages/remote-ui/vite.config.ts:**

```typescript
federation({
  exposes: {
    // Current version
    './Button': './src/components/Button.vue',
    
    // Legacy version
    './ButtonLegacy': './src/components/ButtonLegacy.vue',
    
    // Beta version
    './ButtonBeta': './src/components/ButtonBeta.vue'
  }
})
```

**In host:**

```typescript
const Button = defineAsyncComponent(() => import('remoteUI/Button'));
const ButtonBeta = defineAsyncComponent(() => import('remoteUI/ButtonBeta'));
```

## 7. Sub-path Exports

Expose entire component directories:

**packages/remote-ui/vite.config.ts:**

```typescript
federation({
  exposes: {
    './': './src/',
    './Button': './src/components/Button.vue',
    './Card': './src/components/Card.vue'
  }
})
```

## 8. Shared Custom Composables

Create shared Vue composables:

**packages/shared/src/composables/useTheme.ts:**

```typescript
import { ref, provide, inject } from 'vue';

const ThemeSymbol = Symbol('theme');

export function createTheme() {
  const theme = ref<'light' | 'dark'>('light');
  
  provide(ThemeSymbol, { theme });
  
  return { theme };
}

export function useTheme() {
  const injected = inject<any>(ThemeSymbol);
  if (!injected) {
    throw new Error('useTheme must be used within createTheme provider');
  }
  return injected;
}
```

**In packages/host/src/App.vue:**

```typescript
import { createTheme } from '@mono-bootstrap/shared';

export default {
  setup() {
    createTheme();
  }
};
```

**In any remote component:**

```typescript
import { useTheme } from '@mono-bootstrap/shared';

const { theme } = useTheme();
```

## 9. Type Safety Across Federation Boundaries

**packages/shared/src/types/federation.ts:**

```typescript
// Type definitions for remote components
export interface RemoteUIModule {
  Button: any;
  Card: any;
}

export interface RemoteAppModule {
  DashboardPage: any;
}

declare module 'remoteUI' {
  export const Button: RemoteUIModule['Button'];
  export const Card: RemoteUIModule['Card'];
}

declare module 'remoteApp' {
  export const DashboardPage: RemoteAppModule['DashboardPage'];
}
```

## 10. Debug Mode Configuration

**Add to all vite.config.ts:**

```typescript
export default defineConfig({
  define: {
    __FEDERATION_DEBUG__: process.env.DEBUG === 'true'
  },
  plugins: [
    federation({
      // Add this for detailed federation logs
      shared: {
        vue: {
          singleton: true,
          shareKey: 'vue',
          shareScope: 'default'
        }
      }
    })
  ]
});
```

**Run in debug mode:**

```bash
DEBUG=true pnpm dev
```

**Check logs in browser console for module federation details.**

## 11. Production Optimization

### Minify and Split Code for Production

**packages/host/vite.config.ts:**

```typescript
build: {
  target: 'esnext',
  minify: 'terser',  // ← Minify for production
  cssCodeSplit: true, // ← Split CSS files
  rollupOptions: {
    output: {
      manualChunks: {
        'vue-vendor': ['vue', 'vue-router']
      }
    }
  }
}
```

### Enable GZIP Compression

**Nginx/Server configuration:**

```nginx
gzip on;
gzip_types text/plain text/css application/javascript application/json;
gzip_min_length 1000;
```

## 12. Monitoring & Analytics

**Track remote module loading:**

```typescript
// packages/host/src/utils/federationMonitor.ts
export function trackRemoteLoad(scope: string, module: string) {
  const startTime = performance.now();
  
  return async (...args: any[]) => {
    try {
      const result = await import(`${scope}/${module}`);
      const loadTime = performance.now() - startTime;
      
      // Send to analytics
      console.log(`Loaded ${scope}/${module} in ${loadTime}ms`);
      
      return result;
    } catch (error) {
      console.error(`Failed to load ${scope}/${module}:`, error);
      throw error;
    }
  };
}
```

## 13. Health Checks for Remotes

**packages/host/src/utils/federationHealth.ts:**

```typescript
export async function checkRemoteHealth(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
}

// Usage in main.ts
async function initializeFederation() {
  const remoteUI = await checkRemoteHealth('http://localhost:5001');
  const remoteApp = await checkRemoteHealth('http://localhost:5002');
  
  if (!remoteUI || !remoteApp) {
    console.warn('Some remotes are unavailable');
  }
}
```

## 14. Webpack Federation Plugin Comparison

| Feature | @originjs/vite-plugin-federation | @module-federation/enhanced |
|---------|-----------------------------------|------------------------------|
| Vite Support | ✅ Yes | ⚠️ Partial |
| Production Ready | ✅ Yes | ✅ Yes |
| Shared Deps | ✅ Advanced | ✅ Advanced |
| Version Management | ✅ Good | ✅ Excellent |
| Bundle Size | ✅ Smaller | Larger |

This project uses **@originjs/vite-plugin-federation** for its excellent Vite integration.

---

For more details, see the main `GUIDE.md` file.
