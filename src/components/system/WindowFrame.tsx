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
                "absolute flex flex-col overflow-hidden rounded-xl shadow-2xl origin-center",
                window.isForeground ? "shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)]" : "shadow-xl border border-black/5 opacity-90 grayscale-[0.2]",
            )}
            style={{
                left: window.maximized ? 0 : window.x,
                top: window.maximized ? 30 : window.y,
                width: window.maximized ? '100%' : window.width,
                height: window.maximized ? 'calc(100% - 30px)' : window.height,
                zIndex: window.zIndex,
                // Transition logic: no transition during drag, smooth otherwise
                transition: isDragging ? 'none' : 'all 0.5s cubic-bezier(0.25, 1, 0.5, 1)',

                // Visibility & Minimize Animation
                opacity: window.minimized ? 0 : 1,
                transform: getTransform(),
                pointerEvents: window.minimized ? 'none' : 'auto',

                backgroundColor: 'var(--material-window-bg, rgba(255, 255, 255, 0.95))',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: 'var(--window-border, 1px solid rgba(0,0,0,0.1))'
            }}
            onPointerDown={handlePointerDown}
        >
            {/* Title Bar */}
            <div
                className="h-10 w-full flex items-center justify-between px-4 select-none shrink-0 bg-gray-100/10"
                onPointerDown={handleDragStart}
            >
                <div className="flex gap-2">
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
                        <Maximize2 size={6} strokeWidth={4} className="rotate-45" />
                    </div>
                </div>

                <div className="text-sm font-semibold text-gray-700/80 pointer-events-none">{window.title}</div>
                <div className="w-16"></div>
            </div>

            {/* Content Area */}
            <div className="flex-1 w-full h-full overflow-hidden relative bg-white">
                {children}
            </div>

        </div>
    );
};
