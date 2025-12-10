import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useAppStore = defineStore('app', () => {
  const title = ref('Mono-Bootstrap Micro-Frontend');
  const theme = ref<'light' | 'dark'>('light');

  const setTheme = (newTheme: 'light' | 'dark') => {
    theme.value = newTheme;
  };

  return {
    title,
    theme,
    setTheme
  };
});
