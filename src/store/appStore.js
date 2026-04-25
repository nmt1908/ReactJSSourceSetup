/**
 * LEO Senior Standard Reactor - Client State Engine
 * @author Nguyễn Minh Tâm (AKA LEO)
 */
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

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
            name: 'app-session-storage',
            storage: createJSONStorage(() => sessionStorage), // Thoát app là mất
        }
    )
);

// Store dành riêng cho dữ liệu quét QR (Chỉ lưu trong biến - RAM)
export const useScanStore = create((set) => ({
    scannedQrData: null,
    setScannedQrData: (data) => set({ scannedQrData: data }),
    clearScanData: () => set({ scannedQrData: null }),
}));

