import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Notification {
    id: string;
    appId: string;
    appName: string;
    title: string;
    body: string;
    icon?: string;
    timestamp: number;
}

interface NotificationStore {
    isNotificationCenterOpen: boolean;
    notifications: Notification[];
    
    toggleNotificationCenter: (isOpen?: boolean) => void;
    addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
    removeNotification: (id: string) => void;
    clearAppNotifications: (appId: string) => void;
    clearAll: () => void;
}

export const useNotificationManager = create<NotificationStore>()(
    persist(
        (set) => ({
            isNotificationCenterOpen: false,
            notifications: [
                // Mock default notifications for showcase
                {
                    id: 'mock-1',
                    appId: 'messages',
                    appName: 'Messages',
                    title: 'Craig Federighi',
                    body: 'Hair force one is cleared for takeoff. See you at WWDC!',
                    timestamp: Date.now() - 1000 * 60 * 5 // 5 mins ago
                },
                {
                    id: 'mock-2',
                    appId: 'mail',
                    appName: 'Mail',
                    title: 'Your Apple Invoice',
                    body: 'Thank you for purchasing Mac Studio. Your receipt is attached.',
                    timestamp: Date.now() - 1000 * 60 * 60 * 2 // 2 hours ago
                },
                {
                    id: 'mock-3',
                    appId: 'system',
                    appName: 'System Settings',
                    title: 'Software Update Available',
                    body: 'macOS Sequoia 15.1 is ready to be installed.',
                    timestamp: Date.now() - 1000 * 60 * 60 * 24 // 1 day ago
                }
            ],
            
            toggleNotificationCenter: (isOpen) => set((state) => ({
                isNotificationCenterOpen: isOpen !== undefined ? isOpen : !state.isNotificationCenterOpen
            })),
            
            addNotification: (notif) => set((state) => ({
                notifications: [
                    {
                        ...notif,
                        id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                        timestamp: Date.now()
                    },
                    ...state.notifications
                ]
            })),
            
            removeNotification: (id) => set((state) => ({
                notifications: state.notifications.filter(n => n.id !== id)
            })),
            
            clearAppNotifications: (appId) => set((state) => ({
                notifications: state.notifications.filter(n => n.appId !== appId)
            })),
            
            clearAll: () => set({ notifications: [] })
        }),
        {
            name: 'macos-notifications-storage',
            partialize: (state) => ({ notifications: state.notifications }) // Persist only notifications
        }
    )
);
