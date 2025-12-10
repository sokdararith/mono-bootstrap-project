<template>
  <div class="dashboard-page">
    <div class="dashboard-header">
      <h1>Remote Dashboard</h1>
      <p>This page is loaded from the remote-app micro-frontend</p>
    </div>

    <div class="dashboard-content">
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-value">24</div>
          <div class="stat-label">Total Users</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">1,234</div>
          <div class="stat-label">Total Revenue</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">89%</div>
          <div class="stat-label">Conversion Rate</div>
        </div>
      </div>

      <div class="chart-placeholder">
        <p>📊 Analytics Chart Placeholder</p>
      </div>

      <div class="info-box">
        <h2>About this Remote App</h2>
        <p>
          This is a complete remote application loaded through Module Federation.
          It has its own routes, state management, and components.
        </p>
        <ul>
          <li>Isolated runtime</li>
          <li>Independent build</li>
          <li>Shared dependencies (Vue, Vue Router)</li>
          <li>Asynchronous loading</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const currentTime = ref(new Date().toLocaleTimeString());

setInterval(() => {
  currentTime.value = new Date().toLocaleTimeString();
}, 1000);
</script>

<style scoped>
.dashboard-page {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.dashboard-header {
  margin-bottom: 2rem;
}

.dashboard-header h1 {
  margin: 0 0 0.5rem 0;
  color: #1f2937;
  font-size: 2rem;
}

.dashboard-header p {
  margin: 0;
  color: #6b7280;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  padding: 1.5rem;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  color: #3b82f6;
  margin-bottom: 0.5rem;
}

.stat-label {
  font-size: 0.875rem;
  color: #6b7280;
}

.chart-placeholder {
  background: white;
  padding: 3rem;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
  text-align: center;
  color: #9ca3af;
  margin-bottom: 2rem;
}

.info-box {
  background: white;
  padding: 1.5rem;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
}

.info-box h2 {
  margin: 0 0 1rem 0;
  color: #1f2937;
}

.info-box p {
  margin: 0 0 1rem 0;
  color: #4b5563;
  line-height: 1.6;
}

.info-box ul {
  margin: 0;
  padding-left: 1.5rem;
  color: #4b5563;
}

.info-box li {
  margin-bottom: 0.5rem;
}
</style>
