import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { SystemSettings } from '../types/settings';

interface SettingsStore extends SystemSettings {
    setTheme: (theme: 'light' | 'dark') => void;
    setWallpaper: (url: string) => void;
    setVolume: (val: number) => void;
    setBrightness: (val: number) => void;
    toggleWifi: () => void;
    toggleBluetooth: () => void;
    setDockSize: (size: number) => void;
    setDockMagnification: (enabled: boolean) => void;
    toggleDockMagnification: () => void;
    setAccentColor: (color: string) => void;
    setUserName: (name: string) => void;
    setUserAvatar: (url: string) => void;
    setLoginMessage: (msg: string) => void;
    setScreenTimeout: (timeout: string) => void;
    setShowSleepButton: (show: boolean) => void;
    setLowPowerMode: (mode: string) => void;
    toggleFocusMode: () => void;
    toggleStageManager: () => void;
    addWidget: (type: import('../types/settings').WidgetType) => void;
    removeWidget: (id: string) => void;
    updateWidgetPosition: (id: string, x: number, y: number) => void;
    updateWidgetSize: (id: string, size: import('../types/settings').WidgetSize) => void;
}

export const useSettings = create<SettingsStore>()(
    persist(
        (set) => ({
            theme: 'light',
            wallpaper: 'https://4kwallpapers.com/images/wallpapers/macos-big-sur-apple-layers-fluidic-colorful-wwdc-stock-2560x1440-1455.jpg', // Big Sur Graphic
            brightness: 100,
            volume: 75,
            wifi: true,
            bluetooth: true,
            dockSize: 64,
            dockMagnification: true,
            accentColor: 'blue',
            userName: 'User',
            userAvatar: '',
            loginMessage: '',
            screenTimeout: 'Immediately',
            showSleepButton: true,
            lowPowerMode: 'Never',
            focusMode: false,
            stageManager: true,
            widgets: [],

            setTheme: (theme) => set({ theme }),
            setWallpaper: (wallpaper) => set({ wallpaper }),
            setVolume: (volume) => set({ volume }),
            setBrightness: (brightness) => set({ brightness }),
            toggleWifi: () => set((state) => ({ wifi: !state.wifi })),
            toggleBluetooth: () => set((state) => ({ bluetooth: !state.bluetooth })),
            setDockSize: (dockSize) => set({ dockSize }),
            setDockMagnification: (dockMagnification) => set({ dockMagnification }),
            toggleDockMagnification: () => set((state) => ({ dockMagnification: !state.dockMagnification })),
            setAccentColor: (accentColor) => set({ accentColor }),
            setUserName: (userName) => set({ userName }),
            setUserAvatar: (userAvatar) => set({ userAvatar }),
            setLoginMessage: (loginMessage) => set({ loginMessage }),
            setScreenTimeout: (screenTimeout) => set({ screenTimeout }),
            setShowSleepButton: (showSleepButton) => set({ showSleepButton }),
            setLowPowerMode: (lowPowerMode) => set({ lowPowerMode }),
            toggleFocusMode: () => set((state) => ({ focusMode: !state.focusMode })),
            toggleStageManager: () => set((state) => ({ stageManager: !state.stageManager })),
            
            addWidget: (type) => set((state) => {
                const currentWidgets = state.widgets || [];
                return {
                    widgets: [...currentWidgets, { 
                        id: Math.random().toString(36).substring(2, 9), 
                        type, 
                        // Default drop position (top right area)
                        x: window.innerWidth - 320 - (Math.random() * 50), 
                        y: 80 + (Math.random() * 50),
                        size: 'small'
                    }]
                };
            }),
            removeWidget: (id) => set((state) => ({
                widgets: (state.widgets || []).filter(w => w.id !== id)
            })),
            updateWidgetPosition: (id, x, y) => set((state) => ({
                widgets: (state.widgets || []).map(w => w.id === id ? { ...w, x, y } : w)
            })),
            updateWidgetSize: (id, size) => set((state) => ({
                widgets: (state.widgets || []).map(w => w.id === id ? { ...w, size } : w)
            })),
        }),
        {
            name: 'macos-settings',
        }
    )
);
