# Execution Flow & Architecture Diagram

## Application Startup Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                         User Browser                             │
└─────────────────────────────────────────────────────────────────┘
                               │
                               ▼
                  http://localhost:5000
                               │
┌─────────────────────────────────────────────────────────────────┐
│                        HOST APP (Port 5000)                      │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ index.html                                                │  │
│  │ └─ <div id="app"></div>                                  │  │
│  └───────────────────────────────────────────────────────────┘  │
│                               │                                   │
│                               ▼                                   │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ main.ts (Entry Point)                                     │  │
│  │ ├─ import { createApp } from 'vue'                       │  │
│  │ ├─ import App from './App.vue'                           │  │
│  │ ├─ createApp(App)                                        │  │
│  │ ├─ .use(createPinia())          ← State Management       │  │
│  │ ├─ .use(router)                  ← Routing               │  │
│  │ └─ .mount('#app')                ← Mounts to DOM         │  │
│  └───────────────────────────────────────────────────────────┘  │
│                               │                                   │
│                               ▼                                   │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ App.vue (Root Component)                                  │  │
│  │ ├─ <navbar> (Navigation Bar)                             │  │
│  │ │  └─ Links: Home | Components | Remote Dashboard       │  │
│  │ ├─ <router-view /> (Route Content)                       │  │
│  │ └─ <footer>                                              │  │
│  └───────────────────────────────────────────────────────────┘  │
│                               │                                   │
│                               ▼                                   │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ router.ts (Vue Router)                                    │  │
│  │ ┌─────────────────────────────────────────────────────┐  │  │
│  │ │ Route 1: / (Home)                                   │  │  │
│  │ │ └─ HomePage.vue (Local Component)                  │  │  │
│  │ └─────────────────────────────────────────────────────┘  │  │
│  │                                                           │  │
│  │ └─────────────────────────────────────────────────────┐  │  │
│  │ │ Route 2: /components (Components Demo)              │  │  │
│  │ │ └─ ComponentsPage.vue                              │  │  │
│  │ │    ├─ defineAsyncComponent(() =>                   │  │  │
│  │ │    │   import('uiLib/Button'))                     │  │  │
│  │ │    │   ▼                                             │  │  │
│  │ │    │   Loads from Port 5001 ════════════════════┐  │  │  │
│  │ │    │                                             │  │  │  │
│  │ │    └─ defineAsyncComponent(() =>                   │  │  │
│  │ │        import('uiLib/Card'))                      │  │  │
│  │ │        ▼                                            │  │  │
│  │ │        Loads from Port 5001 ════════════════════┐  │  │  │
│  │ └─────────────────────────────────────────────────────┘  │  │
│  │                                                           │  │
│  │ ┌─────────────────────────────────────────────────────┐  │  │
│  │ │ Route 3: /remote-dashboard (Remote App Page)        │  │  │
│  │ │ └─ defineAsyncComponent(() =>                       │  │  │
│  │ │    import('remoteApp/DashboardPage'))              │  │  │
│  │ │    ▼                                                 │  │  │
│  │ │    Loads from Port 5002 ════════════════════════┐   │  │  │
│  │ └─────────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────────┘  │
│                               │                                   │
└───────────────────────────────┼───────────────────────────────────┘
                                │
                ┌───────────────┴───────────────┐
                │                               │
                ▼                               ▼
     ┌─────────────────────┐         ┌─────────────────────┐
     │  UI LIB (5001)      │         │ REMOTE-APP (5002)   │
     ├─────────────────────┤         ├─────────────────────┤
     │ remoteEntry.js      │         │ remoteEntry.js      │
     │ (Module Federation) │         │ (Module Federation) │
     │                     │         │                     │
     │ Button.vue ─────────┼─────┐   │ DashboardPage.vue ──┼─┐
     │ Card.vue ──────────┐│     │   │                     │ │
     │                     │     │   │                     │ │
     │ shared: vue         │     │   │ shared: vue,        │ │
     │ singleton: true     │     │   │ vue-router          │ │
     └─────────────────────┘     │   └─────────────────────┘ │
                                 │                            │
                    ┌────────────┴──────────────┐            │
                    │                           │            │
                    ▼                           ▼            │
             ┌─────────────────┐        ┌─────────────────┐ │
             │   HOST RECEIVES │        │  HOST RECEIVES  │ │
             │   Button.vue    │        │ DashboardPage   │ │
             │                 │        │   .vue          │ │
             │   Button.vue    │        │                 │ │
             │   Card.vue      │        └─────────────────┘ │
             └─────────────────┘                             │
                                                             │
                    ┌────────────────────────────────────────┘
                    │
                    ▼
        ┌─────────────────────────────┐
        │ Shared Dependencies Manager │
        ├─────────────────────────────┤
        │ vue (singleton: true)       │
        │ vue-router (singleton)      │
        │ pinia (singleton)           │
        └─────────────────────────────┘
```

## Request Flow for Remote Component

```
User clicks: "Navigate to Components"
                    │
                    ▼
    router.push('/components')
                    │
                    ▼
    ComponentsPage.vue loaded
                    │
                    ▼
    Encounters: import('remoteUI/Button')
                    │
                    ├─ Host checks: "Do I have remoteUI remote defined?"
                    │   └─ Yes! In vite.config.ts:
                    │      remotes: { remoteUI: 'http://localhost:5001/assets/remoteEntry.js' }
                    │
                    ├─ Host downloads: http://localhost:5001/assets/remoteEntry.js
                    │   └─ Contains module registry
                    │
                    ├─ Host finds: 'Button' export in registry
                    │   └─ Points to: ./src/components/Button.vue
                    │
                    ├─ Host downloads: http://localhost:5001/assets/Button-{hash}.js
                    │   └─ Minified Button component code
                    │
                    ├─ Host checks shared deps: "Do I have 'vue'?"
                    │   └─ Yes! In shared config: vue { singleton: true }
                    │   └─ Reuses host's Vue instance (no duplication)
                    │
                    ▼
        RemoteButton component renders
        in ComponentsPage with host's shared Vue instance
```

## Module Federation Runtime Sharing

```
┌──────────────────────────────────────────┐
│         Shared Dependencies Scope         │
│          (Singleton = True)               │
├──────────────────────────────────────────┤
│                                          │
│  ┌──────────────┐                       │
│  │   Vue 3.3.4  │                       │
│  │              │                       │
│  │  ┌────────┐  │  ┌────────┐          │
│  │  │Reactivity  │  │Store API   │          │
│  │  └────────┘  │  └────────┘          │
│  └──────────────┘                       │
│       ▲           ▲            ▲         │
│       │           │            │         │
│  ┌────┴───┐  ┌────┴───┐  ┌────┴───┐     │
│  │  Host  │  │Remote  │  │Remote  │     │
│  │  App   │  │  UI    │  │  App   │     │
│  │(5000)  │  │(5001)  │  │(5002)  │     │
│  └────────┘  └────────┘  └────────┘     │
│                                          │
└──────────────────────────────────────────┘

Same Vue instance = Reactive state syncs!
```

## State Management Flow

```
┌─────────────────────────────────────┐
│     useAppStore() (Pinia)           │
│                                     │
│  ┌──────────────────────────────┐   │
│  │ state: {                     │   │
│  │   title: 'Mono-Bootstrap',   │   │
│  │   theme: 'light'             │   │
│  │ }                            │   │
│  └──────────────────────────────┘   │
└─────────────────────────────────────┘
            ▲
            │ (Shared via singleton pinia)
            │
    ┌───────┴────────┬────────────┐
    │                │            │
    ▼                ▼            ▼
┌─────────┐     ┌──────────┐  ┌────────────┐
│   Host  │     │RemoteUI  │  │ RemoteApp  │
│  App    │     │Components│  │   Page     │
│(5000)   │     │(5001)    │  │(5002)      │
│         │     │          │  │            │
│ Can read│     │Can read  │  │Can read    │
│ & modify│     │& modify  │  │& modify    │
│ store   │     │store     │  │store       │
└─────────┘     └──────────┘  └────────────┘
    │                │            │
    │                │            │
    └────────────────┼────────────┘
                     │
                     ▼ (All updates reflected!)
        Theme toggle affects all packages
        User state syncs across remotes
```

## Build Output Structure

```
After: pnpm build

host/dist/
├── index.html
├── assets/
│   ├── main-{hash}.js       (Host app code)
│   └── style-{hash}.css     (Host styles)

remote-ui/dist/
├── remoteEntry.js           (Module Federation entry)
├── Button-{hash}.js         (Button component)
├── Card-{hash}.js           (Card component)
└── style-{hash}.css         (Shared styles)

remote-app/dist/
├── remoteEntry.js           (Module Federation entry)
├── DashboardPage-{hash}.js  (Dashboard page)
├── bootstrap-{hash}.js      (Initialization)
└── style-{hash}.css

shared/dist/
├── index.js                 (Exported types & utils)
├── types.d.ts               (Type declarations)
└── utils.js
```

## Port Communication Diagram

```
         ┌─────────────────────────────────────┐
         │       PNPM Dev Servers              │
         └─────────────────────────────────────┘
                       │
        ┌──────────────┼──────────────┐
        │              │              │
        ▼              ▼              ▼
    ┌────────┐    ┌────────┐    ┌────────┐
    │ Host   │    │Remote  │    │Remote  │
    │ 5000   │    │ UI     │    │  App   │
    │        │    │ 5001   │    │ 5002   │
    └────────┘    └────────┘    └────────┘
        │              │              │
        └──────────────┼──────────────┘
                       │
                       ▼
           http://localhost:5000/
           ├─ Loads remoteEntry.js from :5001
           ├─ Loads remoteEntry.js from :5002
           └─ Requests components as needed

    When you change Button.vue in remote-ui:
    1. Vite detects change
    2. Recompiles Button-{hash}.js
    3. Browser detects remoteEntry.js change
    4. Reloads Button in host (if HMR enabled)
```

## Error Handling Flow

```
User navigates to /remote-dashboard
                    │
                    ▼
    Try: import('remoteApp/DashboardPage')
                    │
        ┌───────────┴───────────┐
        │                       │
        ▼                       ▼
    Success          Error (Remote down?)
        │                       │
        ▼                       ▼
    Render                 Catch error
    Dashboard          errorComponent:
    Page                FallbackPage.vue
                            │
                            ▼
                        Show: "Failed to load"
                        Reason: Port 5002 not running
                        Solution: Start remote-app
```

## Development Workflow

```
1. Edit Button.vue (packages/remote-ui/src/components/Button.vue)
   │
   ▼
2. Vite detects change
   │
   ▼
3. Recompiles and serves from http://localhost:5001
   │
   ▼
4. remoteEntry.js hash changes
   │
   ▼
5. Host detects change (HMR)
   │
   ▼
6. Browser downloads new Button-{hash}.js
   │
   ▼
7. Host rerenders with new Button component
   │
   ▼
8. Your changes visible in ComponentsPage.vue
   (All in ~1-2 seconds!)
```

## Dependency Resolution Example

When host tries to `import Button from 'remoteUI/Button'`:

```
1. Module Federation intercepts 'remoteUI/Button'
   │
   ├─ Checks: Is 'remoteUI' in remotes?
   │  └─ Yes: remoteUI: 'http://localhost:5001/assets/remoteEntry.js'
   │
   ├─ Downloads remoteEntry.js
   │  └─ Contains: { './Button': './src/components/Button.vue' }
   │
   ├─ Resolves './Button' module path
   │  └─ Points to: http://localhost:5001/assets/Button-{hash}.js
   │
   ├─ Downloads Button-{hash}.js
   │  └─ Contains minified Button component + shared dep info
   │
   ├─ Checks: Are there shared deps?
   │  └─ Yes: vue { singleton: true }
   │
   ├─ Does host have vue?
   │  └─ Yes! (loaded in host's shared scope)
   │
   ├─ Skip downloading vue from Button package
   │  └─ Reuse host's Vue instance
   │
   └─ Return Button component ready for rendering
```

---

This architecture ensures:
✅ No duplicate Vue instances  
✅ Shared state between remotes  
✅ Independent builds & deployments  
✅ Runtime module loading  
✅ Type safety with TypeScript
