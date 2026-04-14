import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AdminUser } from '../types/domain';

type AuthState = {
  token: string | null;
  user: AdminUser | null;
  setSession: (token: string, user: AdminUser) => void;
  clearSession: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      setSession: (token, user) => set({ token, user }),
      clearSession: () => set({ token: null, user: null })
    }),
    { name: 'spingpong-auth' }
  )
);

