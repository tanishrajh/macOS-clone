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
}

export const useSettings = create<SettingsStore>()(
    persist(
        (set) => ({
            theme: 'light',
            wallpaper: 'url(https://4kwallpapers.com/images/wallpapers/macos-big-sur-apple-layers-fluidic-colorful-wwdc-stock-2560x1440-1455.jpg)', // Big Sur Graphic
            brightness: 100,
            volume: 75,
            wifi: true,
            bluetooth: true,
            dockSize: 64,
            dockMagnification: true,

            setTheme: (theme) => set({ theme }),
            setWallpaper: (wallpaper) => set({ wallpaper }),
            setVolume: (volume) => set({ volume }),
            setBrightness: (brightness) => set({ brightness }),
            toggleWifi: () => set((state) => ({ wifi: !state.wifi })),
            toggleBluetooth: () => set((state) => ({ bluetooth: !state.bluetooth })),
            setDockSize: (dockSize) => set({ dockSize }),
        }),
        {
            name: 'macos-settings',
        }
    )
);
