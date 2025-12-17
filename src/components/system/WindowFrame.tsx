import React, { useRef, useState, useEffect } from 'react';
import { X, Minus, Maximize2 } from 'lucide-react';
import { useWindowManager } from '../../store/window-manager';
import type { WindowState } from '../../types/window';
import clsx from 'clsx';

interface WindowFrameProps {
    window: WindowState;
    children: React.ReactNode;
}

export const WindowFrame = ({ window, children }: WindowFrameProps) => {
    const { closeWindow, minimizeWindow, maximizeWindow, focusWindow, moveWindow, dockItems } = useWindowManager();
    const [isDragging, setIsDragging] = useState(false);
    const dragOffset = useRef({ x: 0, y: 0 });

    const dockPos = dockItems[window.appId];

    // Calculate transform for minimize animation
    const getTransform = () => {
        if (!window.minimized) return 'none';

        if (dockPos) {
            // Calculate transform relative to current position (x, y)
            const deltaX = dockPos.x - (window.x + window.width / 2);
            const deltaY = dockPos.y - (window.y + window.height / 2);

            return `translate(${deltaX}px, ${deltaY}px) scale(0)`;
        }

        return `translate(0px, ${window.y + 200}px) scale(0.5)`;
    };

    const handlePointerDown = () => {
        if (!window.isForeground) {
            focusWindow(window.id);
        }
    };

    const handleDragStart = (e: React.PointerEvent) => {
        if (window.maximized) return;
        e.preventDefault();
        e.stopPropagation(); // Prevent bubbling to window logic if any
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

    return (
        <div
            className={clsx(
                "absolute flex flex-col mac-window origin-center",
                window.isForeground ? "z-50" : "z-0 grayscale-[0.05] opacity-95",
            )}
            style={{
                left: window.maximized ? 0 : window.x,
                top: window.maximized ? 30 : window.y,
                width: window.maximized ? '100%' : window.width,
                height: window.maximized ? 'calc(100% - 30px)' : window.height,
                zIndex: window.zIndex,
                transition: isDragging ? 'none' : 'all 0.4s cubic-bezier(0.25, 1, 0.5, 1)',

                // Minimize Logic
                opacity: window.minimized ? 0 : 1,
                transform: getTransform(),
                pointerEvents: window.minimized ? 'none' : 'auto',
            }}
            onPointerDown={handlePointerDown}
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

        </div>
    );
};
