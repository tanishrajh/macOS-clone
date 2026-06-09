export type WidgetType = 'clock' | 'weather' | 'calendar' | 'battery' | 'notes';
export type WidgetSize = 'small' | 'medium' | 'large';

export interface DesktopWidget {
    id: string;
    type: WidgetType;
    x: number;
    y: number;
    size: WidgetSize;
}

export interface SystemSettings {
    theme: 'light' | 'dark';
    wallpaper: string; // URL or CSS gradient
    brightness: number;
    volume: number;
    wifi: boolean;
    bluetooth: boolean;
    dockSize: number;
    dockMagnification: boolean;
    accentColor: string;
    userName: string;
    userAvatar: string;
    loginMessage: string;
    screenTimeout: string;
    showSleepButton: boolean;
    lowPowerMode: string;
    focusMode: boolean;
    stageManager: boolean;
    widgets: DesktopWidget[];
}
