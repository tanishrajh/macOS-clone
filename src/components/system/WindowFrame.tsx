import React from 'react';
import { motion, useDragControls } from 'framer-motion';
import { X, Minus, Maximize2 } from 'lucide-react';
import { useWindowManager } from '../../store/window-manager';
import type { WindowState } from '../../types/window';
import clsx from 'clsx';

interface WindowFrameProps {
    window: WindowState;
    children: React.ReactNode;
}

export const WindowFrame: React.FC<WindowFrameProps> = ({ window, children }) => {
    const { closeWindow, minimizeWindow, maximizeWindow, focusWindow, moveWindow } = useWindowManager();
    const dragging = useDragControls();

    const handlePointerDown = () => {
        if (!window.isForeground) {
            focusWindow(window.id);
        }
    };

    return (
        <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{
                scale: window.minimized ? 0.5 : window.maximized ? 1 : 1,
                opacity: window.minimized ? 0 : 1,
                x: window.x,
                y: window.y,
                width: window.maximized ? '100%' : window.width,
                height: window.maximized ? '100%' : window.height,
                zIndex: window.zIndex
            }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30, mass: 0.8 }}
            className={clsx(
                "absolute flex flex-col overflow-hidden rounded-xl shadow-2xl",
                window.isForeground ? "shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)]" : "shadow-xl border border-black/5 opacity-90 grayscale-[0.2]",
            )}
            style={{
                backgroundColor: 'var(--material-window-bg)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: 'var(--window-border)'
            }}
            onPointerDown={handlePointerDown}
            drag={!window.maximized}
            dragMomentum={false}
            dragElastic={0.1}
            onDragEnd={(_, info) => {
                moveWindow(window.id, window.x + info.offset.x, window.y + info.offset.y);
            }}
        >
            {/* Title Bar */}
            <div
                className="h-10 w-full flex items-center justify-between px-4 select-none shrink-0"
                onPointerDown={(e) => dragging.start(e)}
            >
                <div className="flex items-center gap-2 group">
                    {/* Traffic Lights */}
                    <div
                        className="w-3 h-3 rounded-full bg-[#FF5F56] flex items-center justify-center cursor-pointer hover:brightness-90 active:brightness-75 text-black/0 hover:text-black/50 transition-colors"
                        onClick={(e) => { e.stopPropagation(); closeWindow(window.id); }}
                    >
                        <X size={6} strokeWidth={4} />
                    </div>

                    <div
                        className="w-3 h-3 rounded-full bg-[#FFBD2E] flex items-center justify-center cursor-pointer hover:brightness-90 active:brightness-75 text-black/0 hover:text-black/50 transition-colors"
                        onClick={(e) => { e.stopPropagation(); minimizeWindow(window.id); }}
                    >
                        <Minus size={6} strokeWidth={4} />
                    </div>

                    <div
                        className="w-3 h-3 rounded-full bg-[#27C93F] flex items-center justify-center cursor-pointer hover:brightness-90 active:brightness-75 text-black/0 hover:text-black/50 transition-colors"
                        onClick={(e) => { e.stopPropagation(); maximizeWindow(window.id); }}
                    >
                        <Maximize2 size={6} strokeWidth={4} className="rotate-45" /> {/* Use arrows usually, but this is okay for now */}
                    </div>
                </div>

                <div className="text-sm font-semibold text-gray-700/80 pointer-events-none">
                    {window.title}
                </div>

                {/* Spacer for centering logic if needed */}
                <div className="w-16"></div>
            </div>

            {/* Content Area */}
            <div className="flex-1 w-full h-full overflow-hidden relative bg-white/50">
                {children}
            </div>

        </motion.div>
    );
};
