import { create } from 'zustand';
import type { WindowState } from '../types/window';

interface WindowStore {
    windows: Record<string, WindowState>;
    activeWindowId: string | null;
    windowOrder: string[]; // List of IDs in z-order (last is top)
    dockItems: Record<string, { x: number; y: number }>;

    openWindow: (appId: string, title: string, config?: Partial<WindowState>) => void;
    closeWindow: (id: string) => void;
    minimizeWindow: (id: string) => void;
    maximizeWindow: (id: string) => void;
    focusWindow: (id: string, minimizeToggle?: boolean) => void;
    moveWindow: (id: string, x: number, y: number) => void;
    resizeWindow: (id: string, width: number, height: number) => void;
    setDockItemPos: (appId: string, rect: { x: number; y: number }) => void;

    isLaunchpadOpen: boolean;
    toggleLaunchpad: (isOpen?: boolean) => void;

    isSpotlightOpen: boolean;
    toggleSpotlight: (isOpen?: boolean) => void;
}

export const useWindowManager = create<WindowStore>((set, get) => ({
    windows: {},
    activeWindowId: null,
    windowOrder: [],

    openWindow: (appId, title, config = {}) => {
        const { windows, windowOrder } = get();

        // Check if a window for this app already exists
        const existingWindowId = Object.keys(windows).find(id => windows[id].appId === appId);

        if (existingWindowId) {
            // If it exists, focus/toggle it and update props if provided
            set((state) => ({
                windows: {
                    ...state.windows,
                    [existingWindowId]: {
                        ...state.windows[existingWindowId],
                        minimized: false,
                        props: config.props || state.windows[existingWindowId].props
                    }
                },
                activeWindowId: existingWindowId,
                windowOrder: [...state.windowOrder.filter(id => id !== existingWindowId), existingWindowId]
            }));
            return;
        }

        const id = config.id || `${appId}-${Date.now()}`;

        // Default centerish position
        const startX = 100 + (windowOrder.length * 20);
        const startY = 100 + (windowOrder.length * 20);

        // Auto-detect origin from Dock if not provided
        let origin = config.origin;
        if (!origin) {
            const dockItem = get().dockItems[appId];
            if (dockItem) {
                origin = { x: dockItem.x, y: dockItem.y, width: 0, height: 0 };
            }
        }

        const newWindow: WindowState = {
            id,
            appId,
            title,
            x: startX,
            y: startY,
            width: 600,
            height: 400,
            zIndex: 10 + windowOrder.length, // Base Z-index 10
            minimized: false,
            maximized: false,
            isForeground: true,
            props: config.props,
            origin: origin,
            ...config
        };

        set({
            windows: { ...windows, [id]: newWindow },
            windowOrder: [...windowOrder, id],
            activeWindowId: id
        });
    },

    closeWindow: (id) => {
        set(state => {
            const { [id]: _, ...rest } = state.windows;
            const newOrder = state.windowOrder.filter(wId => wId !== id);
            const newActive = newOrder.length > 0 ? newOrder[newOrder.length - 1] : null;

            return {
                windows: rest,
                windowOrder: newOrder,
                activeWindowId: newActive
            };
        });
    },

    focusWindow: (id, minimizeToggle = false) => {
        set(state => {
            const window = state.windows[id];
            if (!window) return state;

            // Logic for Dock clicking: if active, minimize. If minimized, restore.
            if (minimizeToggle && state.activeWindowId === id && !window.minimized) {
                // Minimize
                return {
                    windows: { ...state.windows, [id]: { ...window, minimized: true } },
                    activeWindowId: null // Focus nothing or next top?
                };
            }

            // Restore if minimized
            // const wasMinimized = window.minimized;

            // Reorder z-index
            const newOrder = state.windowOrder.filter(wId => wId !== id);
            newOrder.push(id);

            // Re-assign Z-indexes strictly? Or just use order?
            // Using order array is better for rendering mapping.

            return {
                windows: {
                    ...state.windows,
                    [id]: { ...window, minimized: false }
                },
                windowOrder: newOrder,
                activeWindowId: id
            };
        });
    },

    minimizeWindow: (id) => {
        set(state => {
            return {
                windows: {
                    ...state.windows,
                    [id]: { ...state.windows[id], minimized: true }
                },
                activeWindowId: null // Clear focus logic?
            };
        });
    },

    maximizeWindow: (id) => {
        set(state => {
            const w = state.windows[id];
            return {
                windows: {
                    ...state.windows,
                    [id]: { ...w, maximized: !w.maximized }
                }
            };
        });
    },

    moveWindow: (id, x, y) => {
        set(state => ({
            windows: {
                ...state.windows,
                [id]: { ...state.windows[id], x, y }
            }
        }));
    },

    resizeWindow: (id, width, height) => {
        set(state => ({
            windows: {
                ...state.windows,
                [id]: { ...state.windows[id], width, height }
            }
        }));
    },

    dockItems: {},
    setDockItemPos: (appId, rect) => {
        set(state => ({
            dockItems: {
                ...state.dockItems,
                [appId]: rect
            }
        }));
    },

    isLaunchpadOpen: false,
    toggleLaunchpad: (isOpen) => {
        set(state => ({
            isLaunchpadOpen: isOpen !== undefined ? isOpen : !state.isLaunchpadOpen
        }));
    },

    isSpotlightOpen: false,
    toggleSpotlight: (isOpen) => {
        set(state => ({
            isSpotlightOpen: isOpen !== undefined ? isOpen : !state.isSpotlightOpen
        }));
    }
}));
