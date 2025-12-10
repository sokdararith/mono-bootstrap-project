<template>
  <div class="fallback-page">
    <div class="error-box">
      <div class="error-icon">⚠️</div>
      <h1>Unable to Load Remote Page</h1>
      <p>
        The remote application failed to load. This could be due to:
      </p>
      <ul>
        <li>The remote app is not running on port 5002</li>
        <li>Network connectivity issues</li>
        <li>Module Federation configuration mismatch</li>
      </ul>

      <div class="troubleshooting">
        <h2>Troubleshooting Steps:</h2>
        <ol>
          <li>Make sure all apps are running: <code>pnpm dev</code></li>
          <li>Check the browser console for detailed error messages</li>
          <li>Verify port configuration in vite.config.ts files</li>
          <li>Clear browser cache and reload</li>
        </ol>
      </div>

      <router-link to="/" class="back-link">← Back to Home</router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

useRouter();
</script>

<style scoped>
.fallback-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
}

.error-box {
  background: white;
  padding: 2rem;
  border-radius: 0.5rem;
  border: 2px solid #ef4444;
  max-width: 600px;
  text-align: center;
}

.error-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.error-box h1 {
  color: #dc2626;
  margin-bottom: 1rem;
}

.error-box p {
  color: #6b7280;
  margin-bottom: 1rem;
  text-align: left;
}

.error-box ul {
  text-align: left;
  margin-bottom: 1.5rem;
  padding-left: 1.5rem;
  color: #4b5563;
}

.error-box li {
  margin-bottom: 0.5rem;
}

.troubleshooting {
  background: #fef2f2;
  padding: 1.5rem;
  border-radius: 0.375rem;
  margin-bottom: 1.5rem;
  text-align: left;
}

.troubleshooting h2 {
  font-size: 1rem;
  margin-bottom: 1rem;
  color: #991b1b;
}

.troubleshooting ol {
  padding-left: 1.5rem;
  color: #4b5563;
}

.troubleshooting li {
  margin-bottom: 0.5rem;
}

code {
  background-color: #f3f4f6;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-family: monospace;
  color: #374151;
}

.back-link {
  display: inline-block;
  margin-top: 1rem;
  padding: 0.75rem 1.5rem;
  background-color: #3b82f6;
  color: white;
  text-decoration: none;
  border-radius: 0.375rem;
  transition: background-color 0.2s;
}

.back-link:hover {
  background-color: #2563eb;
}
</style>
