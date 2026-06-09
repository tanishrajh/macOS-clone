import { create } from 'zustand';

interface SystemStore {
    isSleeping: boolean;
    isLocked: boolean;
    isSiriOpen: boolean;
    setSleeping: (sleeping: boolean) => void;
    setLocked: (locked: boolean) => void;
    toggleSiri: (isOpen?: boolean) => void;
}

export const useSystem = create<SystemStore>((set) => ({
    isSleeping: false,
    isLocked: true, // Boot into lock screen
    isSiriOpen: false,
    setSleeping: (isSleeping) => set({ isSleeping }),
    setLocked: (isLocked) => set({ isLocked }),
    toggleSiri: (isOpen) => set((state) => ({ isSiriOpen: isOpen !== undefined ? isOpen : !state.isSiriOpen })),
}));
