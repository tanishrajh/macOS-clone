import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useWindowManager } from '../../store/window-manager';
import { Folder, Globe, MessageSquare, Image, Music, Calendar, Terminal, Settings } from 'lucide-react';
import clsx from 'clsx';

const DOCK_APPS = [
    { id: 'finder', name: 'Finder', icon: Folder, color: 'bg-blue-500', running: true },
    { id: 'safari', name: 'Safari', icon: Globe, color: 'bg-white text-blue-500', running: false },
    { id: 'messages', name: 'Messages', icon: MessageSquare, color: 'bg-green-500', running: false },
    { id: 'photos', name: 'Photos', icon: Image, color: 'bg-gradient-to-tr from-orange-400 via-red-500 to-purple-600', running: false },
    { id: 'calendar', name: 'Calendar', icon: Calendar, color: 'bg-white text-red-500', running: true },
    { id: 'music', name: 'Music', icon: Music, color: 'bg-red-500', running: false },
    { id: 'terminal', name: 'Terminal', icon: Terminal, color: 'bg-gray-800', running: false },
    { id: 'settings', name: 'System Settings', icon: Settings, color: 'bg-gray-400', running: true },
];

export const Dock: React.FC = () => {
    const mouseX = useMotionValue<number | null>(null);
    const { openWindow, windows } = useWindowManager();

    const isRunning = (appId: string) => {
        if (appId === 'finder') return true;
        return Object.values(windows).some(w => w.appId === appId);
    };

    return (
        <div className="fixed bottom-2 left-1/2 -translate-x-1/2 z-[5000] mb-1">
            <div
                className="glass-dock flex items-end gap-3 px-3 pb-3 pt-2 rounded-2xl"
                onMouseMove={(e) => mouseX.set(e.pageX)}
                onMouseLeave={() => mouseX.set(null)}
            >
                {DOCK_APPS.map((app) => (
                    <DockIcon
                        key={app.id}
                        mouseX={mouseX}
                        app={app}
                        running={isRunning(app.id)}
                        onClick={() => openWindow(app.id, app.name)}
                    />
                ))}
                <div className="w-[1px] h-10 bg-white/20 mx-1 mb-2"></div>
                <DockIcon
                    mouseX={mouseX}
                    app={{ id: 'trash', name: 'Trash', icon: Folder, color: 'bg-gray-600' }}
                    running={false}
                    onClick={() => { }}
                />
            </div>
        </div>
    );
};

const DockIcon = ({ mouseX, app, running, onClick }: { mouseX: any, app: any, running: boolean, onClick: () => void }) => {
    const ref = useRef<HTMLDivElement>(null);

    const distance = useTransform(mouseX, (val: number) => {
        const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
        return val - bounds.x - bounds.width / 2;
    });

    const widthSync = useTransform(distance, [-75, 0, 75], [50, 90, 50]);
    const width = useSpring(widthSync, { mass: 0.1, stiffness: 2000, damping: 30 });

    return (
        <div className='flex flex-col items-center gap-1'>
            <motion.div
                ref={ref}
                style={{ width, height: width }}
                className={clsx(
                    "aspect-square rounded-2xl flex items-center justify-center shadow-lg cursor-pointer transition-all duration-200",
                    app.color,
                    "hover:brightness-110 active:brightness-90 ring-1 ring-white/10"
                )}
                onClick={onClick}
                whileTap={{ scale: 0.85 }}
            >
                <app.icon className="w-2/3 h-2/3 text-white drop-shadow-md" />
            </motion.div>

            <div className={clsx(
                "w-1 h-1 rounded-full bg-white/80 transition-opacity",
                running ? "opacity-100" : "opacity-0"
            )} />
        </div>
    );
};
