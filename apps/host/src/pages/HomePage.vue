<template>
  <div class="home-page">
    <section class="hero">
      <h1>Welcome to Mono-Bootstrap</h1>
      <p>A modern micro-frontend architecture with Vue 3, Vite, and Module Federation</p>
    </section>

    <section class="features">
      <h2>Key Features</h2>
      <div class="feature-grid">
        <div class="feature-card">
          <div class="feature-icon">📦</div>
          <h3>Modular Architecture</h3>
          <p>Organize your application into independent, deployable micro-frontends</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">⚡</div>
          <h3>Lightning Fast</h3>
          <p>Vite provides instant server start and blazing-fast HMR</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">🔌</div>
          <h3>Module Federation</h3>
          <p>Share code and dependencies across multiple applications seamlessly</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">📚</div>
          <h3>Component Library</h3>
          <p>Leverage a shared component library from UI package</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">🎨</div>
          <h3>Theme Support</h3>
          <p>Built-in light and dark mode with seamless theme switching</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">🛠️</div>
          <h3>TypeScript Ready</h3>
          <p>Full TypeScript support with type safety across boundaries</p>
        </div>
      </div>
    </section>

    <section class="getting-started">
      <h2>Getting Started</h2>
      <ol class="steps">
        <li>
          <strong>Navigate to Components Page:</strong>
          <p>See how to import and use components from the UI package</p>
        </li>
        <li>
          <strong>Load Remote Dashboard:</strong>
          <p>Check out the Remote Dashboard to see async module federation in action</p>
        </li>
        <li>
          <strong>Explore the Code:</strong>
          <p>
            Review the vite.config.ts files to understand Module Federation configuration
          </p>
        </li>
      </ol>
    </section>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
.home-page {
  max-width: 1200px;
  margin: 0 auto;
}

.hero {
  text-align: center;
  padding: 3rem 1rem;
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  color: white;
  border-radius: 1rem;
  margin-bottom: 3rem;
}

.hero h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  font-weight: 700;
}

.hero p {
  font-size: 1.25rem;
  opacity: 0.9;
}

.features {
  margin-bottom: 3rem;
}

.features h2,
.getting-started h2 {
  font-size: 2rem;
  margin-bottom: 1.5rem;
  color: #1f2937;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.feature-card {
  background: white;
  padding: 1.5rem;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
}

.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.feature-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.feature-card h3 {
  margin: 1rem 0 0.5rem 0;
  color: #1f2937;
}

.feature-card p {
  margin: 0;
  color: #6b7280;
  line-height: 1.6;
}

.getting-started {
  background: #f9fafb;
  padding: 2rem;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
}

.steps {
  list-style: decimal;
  padding-left: 2rem;
}

.steps li {
  margin-bottom: 1.5rem;
  color: #1f2937;
}

.steps strong {
  font-weight: 600;
}

.steps p {
  margin: 0.5rem 0 0 0;
  color: #6b7280;
}
</style>
