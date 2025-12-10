import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import federation from '@originjs/vite-plugin-federation';
import path from 'path';

export default defineConfig({
  plugins: [
    vue(),
    federation({
      name: 'host_app',
      remotes: {
        // UI Components from packages
        uiLib: 'http://localhost:5001/assets/remoteEntry.js',
        // Remote App (Full Page)
        remoteApp: 'http://localhost:5002/assets/remoteEntry.js'
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
        },
        pinia: {
          singleton: true,
          requiredVersion: '^2.1.6',
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
    port: 5000,
    cors: true
  },
  build: {
    target: 'esnext',
    minify: false,
    cssCodeSplit: false
  }
});
