import React, { useRef, useState, useEffect } from 'react';
import { X, Minus, Maximize2 } from 'lucide-react';
import { useWindowManager } from '../../store/window-manager';
import type { WindowState } from '../../types/window';
import clsx from 'clsx';
import { motion, useMotionValue } from 'framer-motion';

interface WindowFrameProps {
    window: WindowState;
    children: React.ReactNode;
}

export const WindowFrame = ({ window, children }: WindowFrameProps) => {
    const { closeWindow, minimizeWindow, maximizeWindow, focusWindow, moveWindow, dockItems } = useWindowManager();
    const [isDragging, setIsDragging] = useState(false);
    const dragOffset = useRef({ x: 0, y: 0 });

    const dockPos = dockItems[window.appId];

    const handlePointerDown = () => {
        if (!window.isForeground) {
            focusWindow(window.id);
        }
    };

    const handleDragStart = (e: React.PointerEvent) => {
        if (window.maximized) return;
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
        dragOffset.current = {
            x: e.clientX - window.x,
            y: e.clientY - window.y
        };
        focusWindow(window.id);
    };

    useEffect(() => {
        if (isDragging) {
            const handlePointerMove = (e: PointerEvent) => {
                moveWindow(
                    window.id,
                    e.clientX - dragOffset.current.x,
                    e.clientY - dragOffset.current.y
                );
            };

            const handlePointerUp = () => {
                setIsDragging(false);
            };

            document.addEventListener('pointermove', handlePointerMove);
            document.addEventListener('pointerup', handlePointerUp);

            return () => {
                document.removeEventListener('pointermove', handlePointerMove);
                document.removeEventListener('pointerup', handlePointerUp);
            };
        }
    }, [isDragging, window.id, moveWindow]);

    // Animation Variants
    // We determine the "origin" rect based on:
    // 1. window.origin (if Just Opened or explicit source)
    // 2. dockItems[window.appId] (if minimizing/restoring)

    // Default Animation State (Normal Window)
    const normalState = {
        opacity: 1,
        scale: 1,
        x: window.maximized ? 0 : window.x,
        y: window.maximized ? 30 : window.y,
        width: window.maximized ? '100%' : window.width,
        height: window.maximized ? 'calc(100% - 30px)' : window.height,
    };

    // Calculate Origin State
    const getOriginState = () => {
        if (window.minimized && dockPos) {
            // Minimize to Dock logic
            // We want to scale DOWN to the dock icon
            // Framer Motion handles "layout" changes, but here we are manual.
            // Simplified: Translate to dock pos and scale 0.
            return {
                opacity: 0,
                scale: 0,
                x: dockPos.x - (window.width / 2),
                y: dockPos.y - (window.height / 2),
                // Keep dimensions to maintain aspect ratio during shrink
                width: window.width,
                height: window.height
            };
        }

        // If we have an origin (Opening animation)
        if (window.origin) {
            return {
                opacity: 0,
                scale: 0,
                x: window.origin.x - (window.width / 2), // Center origin relative to window size?
                // Actually, if we scale: 0, the element is a point.
                // We want that point to be at window.origin.x, window.origin.y
                // Since default transform-origin is center:
                // x should be origin.x - (currentWidth/2)

                // However, initial open likely uses current window.width/height in data.
                x: window.origin.x - (window.width / 2),
                y: window.origin.y - (window.height / 2),
                width: window.width,
                height: window.height
            };
        }

        // Fallback (Fade in center if no origin)
        return {
            opacity: 0,
            scale: 0.95,
            x: window.x,
            y: window.y + 20,
            width: window.width,
            height: window.height
        };
    };

    return (
        <motion.div
            className={clsx(
                "absolute flex flex-col mac-window origin-center",
                window.isForeground ? "z-50" : "z-0 grayscale-[0.05] opacity-95",
            )}
            initial={getOriginState()}
            animate={window.minimized ? getOriginState() : normalState}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }} // Apple-like easing
            style={{
                zIndex: window.zIndex,
                pointerEvents: window.minimized ? 'none' : 'auto',
            }}
            onPointerDown={handlePointerDown}
            drag={false} // We handle drag manually for better window control
        >
            {/* Title Bar */}
            <div
                className="mac-titlebar"
                onPointerDown={handleDragStart}
            >
                <div className="flex gap-2 group">
                    {/* Traffic Lights - Show icons on group hover */}
                    <div
                        className="w-3 h-3 rounded-full bg-[#FF5F56] border-[0.5px] border-[#E0443E] flex items-center justify-center cursor-pointer active:brightness-75 transition-all"
                        onClick={(e) => { e.stopPropagation(); closeWindow(window.id); }}
                    >
                        <X size={7} color="#4d0000" className="opacity-0 group-hover:opacity-100 transition-opacity" strokeWidth={3} />
                    </div>

                    <div
                        className="w-3 h-3 rounded-full bg-[#FFBD2E] border-[0.5px] border-[#DFA123] flex items-center justify-center cursor-pointer active:brightness-75 transition-all"
                        onClick={(e) => { e.stopPropagation(); minimizeWindow(window.id); }}
                    >
                        <Minus size={7} color="#995D00" className="opacity-0 group-hover:opacity-100 transition-opacity" strokeWidth={3} />
                    </div>

                    <div
                        className="w-3 h-3 rounded-full bg-[#27C93F] border-[0.5px] border-[#1AAB29] flex items-center justify-center cursor-pointer active:brightness-75 transition-all"
                        onClick={(e) => { e.stopPropagation(); maximizeWindow(window.id); }}
                    >
                        <Maximize2 size={6} color="#006500" className="opacity-0 group-hover:opacity-100 transition-opacity rotate-45" strokeWidth={3} />
                    </div>
                </div>

                <div className="absolute left-0 right-0 text-center text-[13px] font-semibold text-gray-700 dark:text-gray-200 pointer-events-none opacity-90">
                    {window.title}
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 w-full h-full overflow-hidden relative bg-white/50 dark:bg-[#1c1c1c]/60 backdrop-blur-md transition-colors duration-300">
                {children}
            </div>

        </motion.div>
    );
};
