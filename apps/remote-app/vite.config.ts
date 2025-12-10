import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import federation from '@originjs/vite-plugin-federation';
import path from 'path';

export default defineConfig({
  plugins: [
    vue(),
    federation({
      name: 'remote_app',
      filename: 'remoteEntry.js',
      exposes: {
        './DashboardPage': './src/pages/DashboardPage.vue',
        './index': './src/bootstrap.ts'
      },
      shared: {
        vue: {
          singleton: true,
          requiredVersion: '^3.3.4',
          strictVersion: false
        },
        'vue-router': {
          singleton: true,
          requiredVersion: '^4.2.5',
          strictVersion: false
        }
      }
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    port: 5002,
    cors: true
  },
  build: {
    target: 'esnext',
    minify: false,
    cssCodeSplit: false
  }
});
