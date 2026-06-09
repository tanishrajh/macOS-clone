import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useWindowManager } from '../../store/window-manager';
import { Folder, LayoutGrid, Globe, MessageSquare, Image, Music, Calendar, Terminal, Settings, FileText, CheckSquare, ShoppingBag, Mic, Trash2, Cpu } from 'lucide-react';
import clsx from 'clsx';

export const DOCK_APPS = [
    { id: 'finder', name: 'Finder', icon: Folder, color: 'bg-gradient-to-b from-blue-400 to-blue-600', running: true },
    { id: 'launchpad', name: 'Launchpad', icon: LayoutGrid, color: 'bg-gradient-to-b from-gray-400 to-gray-600', running: false },
    { id: 'safari', name: 'Safari', icon: Globe, color: 'bg-white text-blue-500', running: false },
    { id: 'messages', name: 'Messages', icon: MessageSquare, color: 'bg-gradient-to-b from-green-400 to-green-600', running: false },
    { id: 'photos', name: 'Photos', icon: Image, color: 'bg-gradient-to-tr from-orange-400 via-red-500 to-purple-600', running: false },
    { id: 'reminders', name: 'Reminders', icon: CheckSquare, color: 'bg-white text-blue-500', running: false },
    { id: 'notes', name: 'Notes', icon: FileText, color: 'bg-gradient-to-b from-yellow-300 to-yellow-500', running: false },
    { id: 'voicememos', name: 'Voice Memos', icon: Mic, color: 'bg-white text-red-500', running: false },
    { id: 'textedit', name: 'TextEdit', icon: FileText, color: 'bg-gradient-to-b from-gray-500 to-gray-700', running: false },
    { id: 'calendar', name: 'Calendar', icon: Calendar, color: 'bg-white text-red-500', running: true },
    { id: 'music', name: 'Music', icon: Music, color: 'bg-gradient-to-b from-red-400 to-red-600', running: false },
    { id: 'appstore', name: 'App Store', icon: ShoppingBag, color: 'bg-gradient-to-b from-blue-500 to-blue-700', running: false },
    { id: 'terminal', name: 'Terminal', icon: Terminal, color: 'bg-gradient-to-b from-gray-700 to-gray-900', running: false },
    { id: 'activity', name: 'Activity Monitor', icon: Cpu, color: 'bg-gradient-to-b from-gray-600 to-gray-800', running: false },
    { id: 'settings', name: 'System Settings', icon: Settings, color: 'bg-gradient-to-b from-gray-300 to-gray-500', running: true },
];

import { useSettings } from '../../store/settings';
import { playSound } from '../../utils/sound';

export const Dock: React.FC = () => {
    const mouseX = useMotionValue<number | null>(null);
    const { openWindow, windows } = useWindowManager();
    const { dockSize, dockMagnification } = useSettings();
    const [isHovering, setIsHovering] = React.useState(false);

    const isAnyMaximized = Object.values(windows).some(w => w.maximized && !w.minimized);

    const isRunning = (appId: string) => {
        if (appId === 'finder') return true;
        return Object.values(windows).some(w => w.appId === appId);
    };

    return (
        <>
            {/* Hover Trigger Area for Auto-Hide */}
            {isAnyMaximized && (
                <div
                    className="fixed bottom-0 left-0 w-full h-4 z-[9998]"
                    onMouseEnter={() => setIsHovering(true)}
                />
            )}

            <div
                className={clsx(
                    "fixed left-1/2 -translate-x-1/2 z-[9999] mb-1 transition-all duration-500 ease-in-out",
                    isAnyMaximized && !isHovering ? "bottom-[-100px]" : "bottom-2"
                )}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
            >
                <div
                    className="glass-dock flex items-end gap-2 px-3 rounded-[24px]"
                    style={{ height: dockSize + 16 }}
                    onMouseMove={(e) => mouseX.set(e.pageX)}
                    onMouseLeave={() => mouseX.set(null)}
                >
                    {DOCK_APPS.map((app) => (
                        <DockIcon
                            key={app.id}
                            mouseX={mouseX}
                            app={app}
                            running={isRunning(app.id)}
                            dockSize={dockSize}
                            magnification={dockMagnification}
                            onClick={() => {
                                playSound('click');
                                if (app.id === 'launchpad') {
                                    useWindowManager.getState().toggleLaunchpad();
                                } else {
                                    // Check if running
                                    const runningWindow = Object.values(windows).find(w => w.appId === app.id);
                                    if (runningWindow) {
                                        useWindowManager.getState().focusWindow(runningWindow.id, true);
                                    } else {
                                        openWindow(app.id, app.name);
                                    }
                                }
                            }}
                        />
                    ))}
                    <div className="w-[1px] bg-white/20 mx-1" style={{ height: dockSize, marginBottom: 8 }}></div>
                    <DockIcon
                        mouseX={mouseX}
                        app={{ id: 'trash', name: 'Trash', icon: Trash2, color: 'bg-gradient-to-b from-gray-500 to-gray-700' }}
                        running={false}
                        dockSize={dockSize}
                        magnification={dockMagnification}
                        onClick={() => {
                            playSound('trash');
                            // Open Trash (Finder with trash path - simplified as generic Finder for now)
                            openWindow('finder', 'Trash');
                        }}
                    />
                </div>
            </div>
        </>
    );
};

const DockIcon = ({ mouseX, app, running, dockSize, magnification, onClick }: { mouseX: any, app: any, running: boolean, dockSize: number, magnification: boolean, onClick: () => void }) => {
    const ref = useRef<HTMLDivElement>(null);
    const { setDockItemPos } = useWindowManager();

    // Report Position
    React.useEffect(() => {
        const updatePos = () => {
            if (ref.current) {
                const rect = ref.current.getBoundingClientRect();
                setDockItemPos(app.id, { x: rect.left + rect.width / 2, y: rect.top });
            }
        };

        updatePos();
        window.addEventListener('resize', updatePos);
        const t = setTimeout(updatePos, 300);
        return () => {
            window.removeEventListener('resize', updatePos);
            clearTimeout(t);
        };
    }, [app.id, setDockItemPos, dockSize]);

    const distance = useTransform(mouseX, (val: number | null) => {
        const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
        return val ? val - bounds.x - bounds.width / 2 : Infinity;
    });

    const widthSync = useSpring(useTransform(distance, [-150, 0, 150], [dockSize, dockSize * 1.5, dockSize]), {
        mass: 0.1,
        stiffness: 150,
        damping: 12,
    });

    // Use magnified width ONLY if magnification is enabled
    const width = useTransform(widthSync, (val) => {
        if (!magnification) return dockSize;
        return val < dockSize ? dockSize : val;
    });

    return (
        <div className="flex flex-col items-center justify-end relative group h-full">
            {/* Tooltip */}
            <div className="absolute -top-12 px-3 py-1 bg-[#1e1e1e]/90 backdrop-blur-xl text-[#f0f0f0] text-[13px] tracking-wide rounded-[8px] 
                opacity-0 group-hover:opacity-100 transition-opacity duration-200 delay-500 pointer-events-none border border-white/10 shadow-lg whitespace-nowrap z-[10000]">
                {app.name}
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-[5px] border-transparent border-t-[#1e1e1e]/90"></div>
            </div>

            <motion.div
                ref={ref}
                style={{ width, height: width }}
                className="aspect-square rounded-2xl flex items-center justify-center cursor-pointer relative mb-[8px]"
                onClick={onClick}
                whileTap={{ scale: 0.85 }}
            >
                {/* App Icon Image/Component */}
                <div className={clsx("w-full h-full rounded-2xl flex items-center justify-center shadow-lg transition-all duration-200 border border-white/10", app.color)}>
                    <app.icon className={clsx("w-1/2 h-1/2", app.color.includes('text-') ? "" : "text-white")} />
                </div>
            </motion.div>

            <div className={clsx("absolute bottom-[3px] w-1 h-1 rounded-full bg-white/80 transition-opacity", running ? "opacity-100" : "opacity-0")} />
        </div>
    );
};
