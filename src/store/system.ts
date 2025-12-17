import { create } from 'zustand';

interface SystemStore {
    isSleeping: boolean;
    isLocked: boolean;
    setSleeping: (sleeping: boolean) => void;
    setLocked: (locked: boolean) => void;
}

export const useSystem = create<SystemStore>((set) => ({
    isSleeping: false,
    isLocked: true, // Boot into lock screen
    setSleeping: (isSleeping) => set({ isSleeping }),
    setLocked: (isLocked) => set({ isLocked }),
}));
