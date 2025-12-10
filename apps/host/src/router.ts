import { createRouter, createWebHistory } from 'vue-router';
import { defineAsyncComponent } from 'vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/pages/HomePage.vue')
  },
  {
    path: '/components',
    name: 'Components',
    component: () => import('@/pages/ComponentsPage.vue')
  },
  {
    path: '/remote-dashboard',
    name: 'RemoteDashboard',
    // Dynamically load the remote page with proper error handling
    component: defineAsyncComponent({
      loader: () =>
        import('remoteApp/DashboardPage').catch(err => {
          console.error('Failed to load remote dashboard:', err);
          return import('@/pages/FallbackPage.vue');
        }),
      errorComponent: () => import('@/pages/FallbackPage.vue'),
      delay: 0,
      timeout: 10000
    })
  }
];

export const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
