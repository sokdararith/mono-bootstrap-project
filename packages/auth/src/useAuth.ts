/**
 * Auth Composable for Vue components
 */
import { ref, computed } from 'vue';
import { authService, type User } from './authService';

const currentUser = ref<User | null>(null);
const isLoading = ref(false);

export function useAuth() {
  const user = computed(() => currentUser.value);
  const isAuthenticated = computed(() => authService.isLoggedIn());

  const login = async (email: string, password: string) => {
    isLoading.value = true;
    try {
      const user = await authService.login(email, password);
      currentUser.value = user;
      return user;
    } finally {
      isLoading.value = false;
    }
  };

  const logout = () => {
    authService.logout();
    currentUser.value = null;
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout
  };
}
