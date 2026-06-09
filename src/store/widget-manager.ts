import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type WidgetType = 'weather' | 'clock' | 'calendar' | 'battery' | 'notes';
export type WidgetSize = 'small' | 'medium' | 'large';

export interface WidgetState {
    id: string;
    type: WidgetType;
    size: WidgetSize;
    x: number;
    y: number;
}

interface WidgetStore {
    activeWidgets: WidgetState[];
    isWidgetGalleryOpen: boolean;
    
    addWidget: (type: WidgetType, x: number, y: number) => void;
    removeWidget: (id: string) => void;
    updateWidgetPosition: (id: string, x: number, y: number) => void;
    updateWidgetSize: (id: string, size: WidgetSize) => void;
    toggleWidgetGallery: (isOpen?: boolean) => void;
}

export const useWidgetManager = create<WidgetStore>()(
    persist(
        (set) => ({
            activeWidgets: [
                // Default widget if none exist
                { id: 'clock-default', type: 'clock', size: 'small', x: 200, y: 100 }
            ],
            isWidgetGalleryOpen: false,

            addWidget: (type, x, y) => set((state) => ({
                activeWidgets: [
                    ...state.activeWidgets,
                    { id: `${type}-${Date.now()}`, type, size: 'small', x, y }
                ]
            })),

            removeWidget: (id) => set((state) => ({
                activeWidgets: state.activeWidgets.filter(w => w.id !== id)
            })),

            updateWidgetPosition: (id, x, y) => set((state) => ({
                activeWidgets: state.activeWidgets.map(w => 
                    w.id === id ? { ...w, x, y } : w
                )
            })),

            updateWidgetSize: (id, size) => set((state) => ({
                activeWidgets: state.activeWidgets.map(w => 
                    w.id === id ? { ...w, size } : w
                )
            })),

            toggleWidgetGallery: (isOpen) => set((state) => ({
                isWidgetGalleryOpen: isOpen !== undefined ? isOpen : !state.isWidgetGalleryOpen
            }))
        }),
        {
            name: 'macos-widgets-storage', // Persist to local storage
            partialize: (state) => ({ activeWidgets: state.activeWidgets }) // Only persist widgets
        }
    )
);
