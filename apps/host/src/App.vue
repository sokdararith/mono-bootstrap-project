<template>
  <div id="app" :class="{ dark: appStore.theme === 'dark' }">
    <nav class="navbar">
      <div class="navbar-container">
        <div class="navbar-brand">
          <h1>🚀 {{ appStore.title }}</h1>
        </div>
        <ul class="navbar-links">
          <li>
            <router-link to="/">Home</router-link>
          </li>
          <li>
            <router-link to="/components">Components</router-link>
          </li>
          <li>
            <router-link to="/remote-dashboard">Remote Dashboard</router-link>
          </li>
          <li>
            <button class="theme-toggle" @click="toggleTheme">
              {{ appStore.theme === 'light' ? '🌙' : '☀️' }}
            </button>
          </li>
        </ul>
      </div>
    </nav>

    <main class="main-content">
      <router-view />
    </main>

    <footer class="footer">
      <p>&copy; 2025 Mono-Bootstrap. Built with Vue 3, Vite, and Module Federation.</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { useAppStore } from '@/store';

const appStore = useAppStore();

const toggleTheme = () => {
  appStore.setTheme(appStore.theme === 'light' ? 'dark' : 'light');
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html,
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue',
    Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  color: #1f2937;
  transition: background-color 0.3s, color 0.3s;
}

#app.dark {
  background-color: #1f2937;
  color: #f3f4f6;
}

.navbar {
  background-color: #3b82f6;
  color: white;
  padding: 1rem 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.navbar-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.navbar-brand h1 {
  font-size: 1.5rem;
  margin: 0;
}

.navbar-links {
  list-style: none;
  display: flex;
  gap: 2rem;
  align-items: center;
}

.navbar-links a {
  color: white;
  text-decoration: none;
  font-weight: 500;
  transition: opacity 0.2s;
}

.navbar-links a:hover {
  opacity: 0.8;
}

.navbar-links a.router-link-active {
  border-bottom: 2px solid white;
  padding-bottom: 0.25rem;
}

.theme-toggle {
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.2s;
}

.theme-toggle:hover {
  background: rgba(255, 255, 255, 0.3);
}

.main-content {
  flex: 1;
  padding: 2rem 1rem;
}

.footer {
  background-color: #f3f4f6;
  color: #6b7280;
  padding: 2rem;
  text-align: center;
  border-top: 1px solid #e5e7eb;
}

#app.dark .footer {
  background-color: #111827;
  color: #9ca3af;
  border-top-color: #374151;
}
</style>
