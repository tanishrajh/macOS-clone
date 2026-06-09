import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotificationManager } from '../../store/notification-manager';
import type { Notification } from '../../store/notification-manager';
import { useWidgetManager } from '../../store/widget-manager';
import { X, MessageSquare, Mail, Settings } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const APP_ICONS: Record<string, React.ReactNode> = {
    'messages': <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white"><MessageSquare size={16} /></div>,
    'mail': <div className="w-8 h-8 rounded-md bg-blue-400 flex items-center justify-center text-white"><Mail size={16} /></div>,
    'system': <div className="w-8 h-8 rounded-md bg-gray-500 flex items-center justify-center text-white"><Settings size={16} /></div>
};

export const NotificationCenter: React.FC = () => {
    const { isNotificationCenterOpen, toggleNotificationCenter, notifications, removeNotification, clearAll, clearAppNotifications } = useNotificationManager();
    const { toggleWidgetGallery } = useWidgetManager();

    // Group notifications by app
    const groupedNotifications = useMemo(() => {
        const groups: Record<string, Notification[]> = {};
        (notifications || []).forEach(notif => {
            if (!groups[notif.appId]) groups[notif.appId] = [];
            groups[notif.appId].push(notif);
        });
        return groups;
    }, [notifications]);

    if (!isNotificationCenterOpen) return null;

    return (
        <AnimatePresence>
            {isNotificationCenterOpen && (
                <>
                    {/* Invisible Backdrop to close */}
                    <div 
                        className="fixed inset-0 z-[4998]"
                        onClick={() => toggleNotificationCenter(false)}
                    />
                    
                    {/* Sidebar Container */}
                    <motion.div 
                        className="fixed top-9 right-2 bottom-2 w-[340px] z-[4999] flex flex-col gap-3 origin-top-right overflow-y-auto scrollbar-hide select-none pt-2 pb-6 px-2"
                        initial={{ x: 400, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: 400, opacity: 0 }}
                        transition={{ type: 'spring', damping: 28, stiffness: 250, mass: 0.8 }}
                    >
                        {/* Notifications Area */}
                        {!(notifications?.length > 0) ? (
                            <div className="flex-1 flex items-center justify-center text-black/50 dark:text-white/50 font-medium">
                                No New Notifications
                            </div>
                        ) : (
                            <div className="flex flex-col gap-3">
                                {Object.entries(groupedNotifications).map(([appId, appNotifs]) => (
                                    <div key={appId} className="flex flex-col relative group/group">
                                        {/* Group Header */}
                                        <div className="flex justify-between items-center mb-1 px-2 opacity-80">
                                            <span className="text-xs font-bold uppercase tracking-wider text-black dark:text-white">{appNotifs[0].appName}</span>
                                            <button 
                                                className="text-[10px] bg-black/10 dark:bg-white/10 hover:bg-black/20 dark:hover:bg-white/20 px-2 py-0.5 rounded opacity-0 group-hover/group:opacity-100 transition-opacity"
                                                onClick={() => clearAppNotifications(appId)}
                                            >
                                                Clear
                                            </button>
                                        </div>
                                        
                                        {/* Notification Cards Stack */}
                                        <div className="flex flex-col gap-1 relative">
                                            {appNotifs.map((notif, index) => (
                                                <motion.div 
                                                    key={notif.id}
                                                    layout
                                                    initial={{ opacity: 0, scale: 0.95 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    exit={{ opacity: 0, scale: 0.95 }}
                                                    className="bg-white/60 dark:bg-black/60 backdrop-blur-2xl rounded-2xl p-3 flex gap-3 shadow-[0_4px_24px_rgba(0,0,0,0.1)] border border-white/40 dark:border-white/10 group cursor-default relative"
                                                    style={{
                                                        // Stacking effect for multiple notifications
                                                        zIndex: 10 - index,
                                                        transform: index > 0 ? `scale(${1 - index * 0.03}) translateY(-${index * 4}px)` : 'none',
                                                        opacity: index > 2 ? 0 : 1
                                                    }}
                                                >
                                                    <div className="shrink-0 pt-0.5">
                                                        {APP_ICONS[notif.appId] || <div className="w-8 h-8 rounded bg-gray-200 dark:bg-gray-800" />}
                                                    </div>
                                                    <div className="flex flex-col flex-1 min-w-0 pr-4">
                                                        <div className="flex justify-between items-start">
                                                            <span className="font-semibold text-[13px] truncate text-black dark:text-white">{notif.title}</span>
                                                            <span className="text-[10px] text-black/50 dark:text-white/50 shrink-0 ml-2">
                                                                {notif.timestamp ? formatDistanceToNow(notif.timestamp, { addSuffix: true }) : 'just now'}
                                                            </span>
                                                        </div>
                                                        <span className="text-[12px] leading-snug text-black/80 dark:text-white/80 mt-0.5 break-words line-clamp-2">
                                                            {notif.body}
                                                        </span>
                                                    </div>
                                                    
                                                    {/* Close Button */}
                                                    <button 
                                                        className="absolute top-2 right-2 w-5 h-5 bg-black/10 dark:bg-white/10 hover:bg-black/20 dark:hover:bg-white/20 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-black dark:text-white"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            removeNotification(notif.id);
                                                        }}
                                                    >
                                                        <X size={12} />
                                                    </button>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Edit Widgets Button */}
                        <div className="mt-4 flex justify-center pb-8">
                            <button 
                                className="px-4 py-1.5 bg-white/40 dark:bg-white/10 hover:bg-white/60 dark:hover:bg-white/20 backdrop-blur-lg rounded-full text-xs font-semibold text-black dark:text-white shadow-sm border border-white/20 transition-colors"
                                onClick={() => {
                                    toggleNotificationCenter(false);
                                    toggleWidgetGallery(true);
                                }}
                            >
                                Edit Widgets...
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
