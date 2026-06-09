import React, { useRef, useState, useEffect } from 'react';
import { X, Minus, Maximize2 } from 'lucide-react';
import { useWindowManager } from '../../store/window-manager';
import { useSettings } from '../../store/settings';
import type { WindowState } from '../../types/window';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import { DOCK_APPS } from '../dock/Dock';

interface WindowFrameProps {
    window: WindowState;
    children: React.ReactNode;
}

export const WindowFrame = ({ window, children }: WindowFrameProps) => {
    const { windows, activeWindowId, closeWindow, minimizeWindow, maximizeWindow, focusWindow, moveWindow, dockItems } = useWindowManager();
    const { stageManager } = useSettings();
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

    // Stage Manager Logic
    const activeWindow = activeWindowId ? windows[activeWindowId] : null;
    const stageActiveAppId = activeWindow?.appId || null;

    const isInStage = !stageManager || stageActiveAppId === window.appId;
    const isInStrip = stageManager && stageActiveAppId !== window.appId && !window.minimized;

    // Calculate strip position if in strip
    const stripAppIds = Object.values(windows)
        .filter(w => w.appId !== stageActiveAppId && !w.minimized)
        .sort((a, b) => b.zIndex - a.zIndex) // highest zIndex first (most recent)
        .map(w => w.appId)
        .filter((v, i, a) => a.indexOf(v) === i);

    const isActuallyInStrip = isInStrip && stripAppIds.includes(window.appId);

    const appIndexInStrip = Math.max(0, stripAppIds.indexOf(window.appId));
    const slotIndex = Math.min(4, appIndexInStrip);
    const overflowIndex = Math.max(0, appIndexInStrip - 4); // 0 for first 5 apps, 1, 2, etc. for the rest

    // Calculate stack offset for multiple windows of same app
    const windowsOfThisApp = Object.values(windows)
        .filter(w => w.appId === window.appId && !w.minimized)
        .sort((a, b) => b.zIndex - a.zIndex);
    const appWindowIndex = Math.max(0, windowsOfThisApp.findIndex(w => w.id === window.id));

    // Default Animation State (Normal Window)
    const normalState = {
        opacity: 1,
        scale: 1,
        x: window.maximized ? 0 : window.x,
        y: window.maximized ? 30 : window.y,
        width: window.maximized ? '100%' : window.width,
        height: window.maximized ? 'calc(100% - 30px)' : window.height,
        rotateY: 0,
        rotateX: 0,
        originX: 0.5,
        originY: 0.5,
    };

    // Strip State (Stage Manager)
    const availableHeight = typeof globalThis.window !== 'undefined' ? globalThis.window.innerHeight - 150 : 800;
    const totalSlots = Math.min(5, Math.max(1, stripAppIds.length));
    const slotSpacing = Math.min(180, availableHeight / totalSlots);

    const scale = 0.22;
    // Stack goes UP and RIGHT (positive X, negative Y)
    const targetLeft = 10 + (appWindowIndex * 15) + (overflowIndex * 15);
    const targetTop = 80 + (slotIndex * slotSpacing) - (appWindowIndex * 15) - (overflowIndex * 15);

    const stripY = targetTop - (window.height / 2 * (1 - scale));

    const stripState = {
        opacity: 1,
        scale,
        x: targetLeft, // Scale happens from left edge, so x is just targetLeft
        y: stripY,
        width: window.width,
        height: window.height,
        rotateY: 15,
        rotateX: 0,
        originX: 0,
        originY: 0.5,
    };

    // Calculate Origin State
    const getOriginState = () => {
        if (window.minimized && dockPos) {
            return {
                opacity: 0,
                scale: 0.05,
                x: dockPos.x - (window.width / 2),
                y: dockPos.y - (window.height / 2),
                width: window.width,
                height: window.height,
                rotateY: 0,
                rotateX: 0,
                originX: 0.5,
                originY: 0.5,
            };
        }

        if (window.origin) {
            const originX = window.origin.x || 0;
            const originY = window.origin.y || 0;
            return {
                opacity: 0,
                scale: 0.05,
                x: originX - (window.width / 2),
                y: originY - (window.height / 2),
                width: window.width,
                height: window.height,
                rotateY: 0,
                rotateX: 0,
                originX: 0.5,
                originY: 0.5,
            };
        }

        return {
            opacity: 0,
            scale: 0.95,
            x: window.x,
            y: window.y + 20,
            width: window.width,
            height: window.height,
            rotateY: 0,
            rotateX: 0,
            originX: 0.5,
            originY: 0.5,
        };
    };

    const appConfig = DOCK_APPS.find(a => a.id === window.appId);

    const isFrontOfSlot = overflowIndex === 0 && appWindowIndex === 0;
    const showIcon = stageManager && appConfig && isActuallyInStrip && isFrontOfSlot;

    // Calculate flat icon state for Stage Manager Strip
    const iconScale = showIcon ? 1 : 0.5;
    const iconOpacity = showIcon ? 1 : 0;
    // targetLeft and targetTop from the strip state calculations above:
    const iconX = targetLeft - 5;
    const iconY = targetTop + (window.height * scale) - 30;

    return (
        <>
            <motion.div
            className={clsx(
                "absolute flex flex-col mac-window origin-center top-0 left-0",
                window.isForeground ? "z-50" : "z-10",
                isActuallyInStrip && "cursor-pointer"
            )}
            initial={getOriginState()}
            animate={window.minimized ? getOriginState() : isActuallyInStrip ? stripState : normalState}
            transition={isDragging
                ? { duration: 0 }
                : { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
            }
            style={{
                zIndex: window.zIndex,
                pointerEvents: window.minimized ? 'none' : 'auto',
                boxShadow: window.isForeground ? 'var(--window-shadow-active)' : 'var(--window-shadow-inactive)',
                transformPerspective: 4000,
                transformStyle: "preserve-3d",
            }}
            onPointerDown={handlePointerDown}
            drag={false}
        >
            {/* Stage Manager Strip Overlay interceptor */}
            {isActuallyInStrip && (
                <div 
                    className="absolute inset-0 z-[99999]"
                    onPointerDown={(e) => {
                        e.stopPropagation();
                        focusWindow(window.id);
                    }}
                />
            )}

            {/* Title Bar */}
            <div
                className="mac-titlebar"
                onPointerDown={handleDragStart}
            >
                <div className="flex gap-2 group ml-1">
                    {/* Traffic Lights */}
                    <div
                        className="w-3 h-3 rounded-full bg-[#FF5F56] border-[0.5px] border-[#E0443E] flex items-center justify-center cursor-pointer active:brightness-75 transition-all"
                        onClick={(e) => { e.stopPropagation(); closeWindow(window.id); }}
                    >
                        <svg width="7" height="7" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <path d="M1 1L7 7M7 1L1 7" stroke="rgba(77, 0, 0, 0.7)" strokeWidth="1.2" strokeLinecap="round"/>
                        </svg>
                    </div>

                    <div
                        className="w-3 h-3 rounded-full bg-[#FFBD2E] border-[0.5px] border-[#DFA123] flex items-center justify-center cursor-pointer active:brightness-75 transition-all"
                        onClick={(e) => { e.stopPropagation(); minimizeWindow(window.id); }}
                    >
                        <svg width="7" height="7" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <path d="M1 4H7" stroke="rgba(153, 93, 0, 0.7)" strokeWidth="1.2" strokeLinecap="round"/>
                        </svg>
                    </div>

                    <div
                        className="w-3 h-3 rounded-full bg-[#27C93F] border-[0.5px] border-[#1AAB29] flex items-center justify-center cursor-pointer active:brightness-75 transition-all"
                        onClick={(e) => { e.stopPropagation(); maximizeWindow(window.id); }}
                    >
                        <svg width="7" height="7" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <path d="M1.5 6.5V1.5H6.5" stroke="rgba(0, 101, 0, 0.7)" strokeWidth="1.2" strokeLinecap="round"/>
                            <path d="M6.5 1.5L1.5 6.5" stroke="rgba(0, 101, 0, 0.7)" strokeWidth="1.2" strokeLinecap="round"/>
                        </svg>
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

        {/* Stage Manager App Icon Overlay */}
        {showIcon && (
            <motion.div
                className={clsx(
                    "absolute z-[999999] rounded-[14px] flex items-center justify-center shadow-xl border border-white/20 pointer-events-none origin-center",
                    appConfig.color
                )}
                style={{
                    width: 52,
                    height: 52,
                    zIndex: window.zIndex + 1,
                }}
                animate={{
                    opacity: iconOpacity,
                    x: iconX,
                    y: iconY,
                    scale: iconScale
                }}
                initial={{ opacity: 0, scale: 0.5 }}
                transition={isDragging
                    ? { duration: 0 }
                    : { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
                }
            >
                <appConfig.icon size={26} className={appConfig.color.includes('text-') ? "" : "text-white"} />
            </motion.div>
        )}
        </>
    );
};
