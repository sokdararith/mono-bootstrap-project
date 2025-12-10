<template>
  <div class="components-page">
    <h1>UI Components</h1>
    <p class="subtitle">
      These components are imported from the @mono-bootstrap/ui package via Module Federation
    </p>

    <section class="demo-section">
      <h2>Button Component</h2>
      <div class="demo-grid">
        <div class="demo-item">
          <label>Primary Buttons:</label>
          <div class="demo-box">
            <RemoteButton label="Small" variant="primary" size="small" @click="handleClick" />
            <RemoteButton label="Medium" variant="primary" size="medium" @click="handleClick" />
            <RemoteButton label="Large" variant="primary" size="large" @click="handleClick" />
          </div>
        </div>

        <div class="demo-item">
          <label>Secondary Buttons:</label>
          <div class="demo-box">
            <RemoteButton label="Secondary" variant="secondary" @click="handleClick" />
            <RemoteButton label="Outline" variant="outline" @click="handleClick" />
            <RemoteButton label="Disabled" disabled @click="handleClick" />
          </div>
        </div>
      </div>
    </section>

    <section class="demo-section">
      <h2>Card Component</h2>
      <div class="demo-grid">
        <div class="demo-item">
          <RemoteCard title="Card Example 1" :elevated="true">
            <p>This is content inside a card component from the UI package.</p>
            <p>It can contain any Vue content and supports slots.</p>
          </RemoteCard>
        </div>

        <div class="demo-item">
          <RemoteCard title="Card Example 2" :elevated="false">
            <p>This card has the elevated prop set to false.</p>
            <template #footer>
              <RemoteButton label="Learn More" variant="primary" size="small" />
            </template>
          </RemoteCard>
        </div>
      </div>
    </section>

    <section class="code-section">
      <h2>Code Examples</h2>

      <div class="code-block">
        <h3>Import from UI Package:</h3>
        <pre><code>// In Host App (apps/host/src/pages/ComponentsPage.vue)
import { defineAsyncComponent } from 'vue';

const RemoteButton = defineAsyncComponent({
  loader: () => import('uiLib/Button'),
  errorComponent: () => &lt;&gt;Error loading Button&lt;/&gt;
});

const RemoteCard = defineAsyncComponent({
  loader: () => import('uiLib/Card'),
  errorComponent: () => &lt;&gt;Error loading Card&lt;/&gt;
});</code></pre>
      </div>

      <div class="code-block">
        <h3>vite.config.ts (Host) - Remote Configuration:</h3>
        <pre><code>federation({
  name: 'host_app',
  remotes: {
    uiLib: 'http://localhost:5001/assets/remoteEntry.js',
    remoteApp: 'http://localhost:5002/assets/remoteEntry.js'
  },
  shared: {
    vue: {
      singleton: true,
      requiredVersion: '^3.3.4'
    }
  }
})</code></pre>
      </div>

      <div class="code-block">
        <h3>vite.config.ts (UI Package) - Expose Configuration:</h3>
        <pre><code>federation({
  name: 'ui_lib',
  exposes: {
    './Button': './src/components/Button.vue',
    './Card': './src/components/Card.vue'
  },
  shared: {
    vue: {
      singleton: true,
      requiredVersion: '^3.3.4'
    }
  }
})</code></pre>
      </div>
    </section>

    <section class="logs">
      <h2>Click Logs</h2>
      <div class="log-box">
        <div v-if="clickLogs.length === 0" class="empty-state">
          <p>Click any button to see logs here</p>
        </div>
        <div v-for="(log, index) in clickLogs" :key="index" class="log-entry">
          {{ log }}
        </div>
      </div>
      <button v-if="clickLogs.length > 0" class="clear-btn" @click="clearLogs">
        Clear Logs
      </button>
    </section>
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent, ref } from 'vue';

const clickLogs = ref<string[]>([]);

// Dynamically import components from UI package with error handling
const RemoteButton = defineAsyncComponent({
  loader: () =>
    import('uiLib/Button').catch(err => {
      console.error('Failed to load Button component:', err);
      throw err;
    }),
  delay: 0,
  timeout: 10000
});

const RemoteCard = defineAsyncComponent({
  loader: () =>
    import('uiLib/Card').catch(err => {
      console.error('Failed to load Card component:', err);
      throw err;
    }),
  delay: 0,
  timeout: 10000
});

const handleClick = () => {
  const timestamp = new Date().toLocaleTimeString();
  clickLogs.value.unshift(`Button clicked at ${timestamp}`);
  if (clickLogs.value.length > 10) {
    clickLogs.value.pop();
  }
};

const clearLogs = () => {
  clickLogs.value = [];
};
</script>

<style scoped>
.components-page {
  max-width: 1200px;
  margin: 0 auto;
}

h1 {
  margin-bottom: 0.5rem;
  color: #1f2937;
}

.subtitle {
  color: #6b7280;
  font-size: 1.1rem;
  margin-bottom: 2rem;
}

.demo-section {
  margin-bottom: 3rem;
}

.demo-section h2 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #1f2937;
}

.demo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 2rem;
}

.demo-item {
  background: white;
  padding: 1.5rem;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
}

.demo-item label {
  display: block;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #1f2937;
}

.demo-box {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.code-section {
  margin-bottom: 3rem;
}

.code-section h2 {
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  color: #1f2937;
}

.code-block {
  background: #f3f4f6;
  padding: 1.5rem;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
  margin-bottom: 1.5rem;
}

.code-block h3 {
  margin: 0 0 1rem 0;
  color: #1f2937;
  font-size: 1rem;
}

.code-block pre {
  margin: 0;
  overflow-x: auto;
}

.code-block code {
  font-family: 'Courier New', monospace;
  font-size: 0.875rem;
  color: #374151;
  line-height: 1.5;
}

.logs {
  margin-bottom: 2rem;
}

.logs h2 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #1f2937;
}

.log-box {
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 1rem;
  max-height: 300px;
  overflow-y: auto;
  font-family: monospace;
  font-size: 0.875rem;
}

.empty-state {
  color: #9ca3af;
  text-align: center;
  padding: 2rem;
}

.log-entry {
  padding: 0.5rem 0;
  color: #374151;
  border-bottom: 1px solid #e5e7eb;
}

.log-entry:last-child {
  border-bottom: none;
}

.clear-btn {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background-color: #ef4444;
  color: white;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  font-weight: 500;
}

.clear-btn:hover {
  background-color: #dc2626;
}
</style>
