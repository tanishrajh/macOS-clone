export interface WindowState {
    id: string;
    appId: string; // Refers to the app (e.g., 'finder', 'notes')
    title: string;
    x: number;
    y: number;
    width: number;
    height: number;
    zIndex: number;
    minimized: boolean;
    maximized: boolean;
    isForeground: boolean;

    // App specific state that might need to be preserved in window
    // e.g. current path in finder
    meta?: any;

    // Props to pass to the component
    props?: any;
}

export interface AppConfig {
    id: string;
    name: string;
    icon: string;
    defaultWidth: number;
    defaultHeight: number;
    resizable: boolean;
    component: React.ComponentType<any>;
}
