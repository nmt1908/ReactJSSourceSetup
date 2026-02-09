/**
 * LEO Senior Standard Reactor - Client State Engine
 * @author Nguyễn Minh Tâm (AKA LEO)
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAppStore = create(
    persist(
        (set) => ({
            user: null,
            theme: 'light',
            setUser: (user) => set({ user }),
            setTheme: (theme) => set({ theme }),
            logout: () => set({ user: null }),
        }),
        {
            name: 'app-storage',
        }
    )
);
