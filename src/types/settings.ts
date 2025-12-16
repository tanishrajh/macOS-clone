export interface SystemSettings {
    theme: 'light' | 'dark';
    wallpaper: string; // URL or CSS gradient
    brightness: number;
    volume: number;
    wifi: boolean;
    bluetooth: boolean;
    dockSize: number;
    dockMagnification: boolean;
}
