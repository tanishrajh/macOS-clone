import React, { useState, useEffect } from 'react';
import { Wifi, BatteryMedium, Search } from 'lucide-react';
import { format } from 'date-fns';
import { useWindowManager } from '../../store/window-manager';
import { ControlCenter } from './ControlCenter';
import clsx from 'clsx';
import { useSettings } from '../../store/settings';
import { useSystem } from '../../store/system';
import { MenuBarMenus } from './MenuBarMenus';
import { motion, AnimatePresence } from 'framer-motion';

export const MenuBar: React.FC = () => {
    const [time, setTime] = useState(new Date());
    const { activeWindowId, windows, toggleSpotlight, openWindow } = useWindowManager();
    const { setSleeping } = useSystem();
    const { wifi } = useSettings();
    const [controlCenterOpen, setControlCenterOpen] = useState(false);
    const [appleMenuOpen, setAppleMenuOpen] = useState(false);

    const activeApp = activeWindowId ? windows[activeWindowId].appId : 'Finder';
    const displayAppName = activeApp.charAt(0).toUpperCase() + activeApp.slice(1);

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const MenuItem = ({ children, bold = false }: { children: React.ReactNode, bold?: boolean }) => (
        <span className={`px-3 py-0.5 rounded cursor-default hover:bg-white/10 transition-colors ${bold ? 'font-bold' : 'font-medium'}`}>
            {children}
        </span>
    );

    const handleRestart = () => window.location.reload();
    const handleSleep = () => { setAppleMenuOpen(false); setSleeping(true); };
    const handleLock = () => window.location.reload();
    const handleOpenSettings = () => { setAppleMenuOpen(false); openWindow('settings', 'System Settings', { width: 800, height: 600 }); };

    return (
        <div className="h-[30px] w-full bg-black/20 backdrop-blur-xl flex items-center justify-between px-2 text-[13px] font-medium text-white shadow-sm absolute top-0 z-[5000] select-none border-b border-white/5">
            <div className="flex items-center gap-0.5 relative">
                <div
                    className={clsx("flex items-center justify-center hover:bg-white/10 px-3 py-0.5 rounded cursor-default transition-colors relative", appleMenuOpen && "bg-white/10")}
                    onClick={() => setAppleMenuOpen(!appleMenuOpen)}
                >
                    {/* Authentic Apple Logo SVG */}
                    <svg viewBox="0 0 384 512" width="16" height="16" fill="white" className="mb-[2px]">
                        <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
                    </svg>
                    <AnimatePresence>
                        {appleMenuOpen && (
                            <>
                                <div className="fixed inset-0 z-40 bg-transparent" onClick={(e) => { e.stopPropagation(); setAppleMenuOpen(false); }} />
                                <motion.div
                                    initial={{ opacity: 0, scale: 0, x: -10, y: -15, filter: "blur(10px)" }}
                                    animate={{ opacity: 1, scale: 1, x: 0, y: 0, filter: "blur(0px)" }}
                                    exit={{ opacity: 0, scale: 0, x: -10, y: -15, filter: "blur(10px)" }}
                                    transition={{ duration: 0.15, type: "spring", stiffness: 300, damping: 25 }}
                                    style={{ transformOrigin: "top left" }}
                                    className="absolute top-full left-0 mt-1 w-56 mac-glass rounded-lg py-1 text-black dark:text-white z-50 shadow-2xl border border-white/20"
                                >
                                    <div className="px-4 py-1 hover:bg-blue-500 hover:text-white cursor-default">About This Mac</div>
                                    <div className="h-px bg-gray-300/50 my-1 mx-3" />
                                    <div className="px-4 py-1 hover:bg-blue-500 hover:text-white cursor-default" onClick={handleOpenSettings}>System Settings...</div>
                                    <div className="px-4 py-1 hover:bg-blue-500 hover:text-white cursor-default">App Store...</div>
                                    <div className="h-px bg-gray-300/50 my-1 mx-3" />
                                    <div className="px-4 py-1 hover:bg-blue-500 hover:text-white cursor-default">Recent Items</div>
                                    <div className="h-px bg-gray-300/50 my-1 mx-3" />
                                    <div className="px-4 py-1 hover:bg-blue-500 hover:text-white cursor-default">Force Quit...</div>
                                    <div className="h-px bg-gray-300/50 my-1 mx-3" />
                                    <div className="px-4 py-1 hover:bg-blue-500 hover:text-white cursor-default" onClick={handleSleep}>Sleep</div>
                                    <div className="px-4 py-1 hover:bg-blue-500 hover:text-white cursor-default" onClick={handleRestart}>Restart...</div>
                                    <div className="px-4 py-1 hover:bg-blue-500 hover:text-white cursor-default" onClick={handleLock}>Shut Down...</div>
                                    <div className="h-px bg-gray-300/50 my-1 mx-3" />
                                    <div className="px-4 py-1 hover:bg-blue-500 hover:text-white cursor-default" onClick={handleLock}>Lock Screen</div>
                                    <div className="px-4 py-1 hover:bg-blue-500 hover:text-white cursor-default" onClick={handleLock}>Log Out User...</div>
                                </motion.div>
                            </>
                        )}
                    </AnimatePresence>
                </div>

                <MenuItem bold>{displayAppName}</MenuItem>

                <div className="hidden sm:flex opacity-90">
                    <MenuBarMenus />
                </div>
            </div>

            <div className="flex items-center gap-4 px-2">
                <div className="flex items-center gap-3 opacity-90">
                    <BatteryMedium size={18} className="opacity-80" />
                    {/* Interactive Wifi Icon */}
                    <div onClick={() => setControlCenterOpen(true)}>
                        <Wifi size={16} className={clsx("opacity-80 cursor-pointer", !wifi && "opacity-50 line-through")} />
                    </div>
                    {/* Interactive Search Icon */}
                    <div onClick={() => toggleSpotlight()}>
                        <Search size={14} className="opacity-80 cursor-pointer" />
                    </div>
                </div>

                <div className="flex items-center gap-2 relative">
                    <div
                        className={clsx("flex items-center gap-2 cursor-default hover:bg-white/10 px-2 py-0.5 rounded transition-colors", controlCenterOpen && "bg-white/10")}
                        onClick={() => setControlCenterOpen(!controlCenterOpen)}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="opacity-100">
                            <path d="M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6z" />
                            <circle cx="8" cy="10" r="1.5" />
                            <circle cx="16" cy="14" r="1.5" />
                        </svg>
                        <AnimatePresence>
                            {controlCenterOpen && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0, x: 10, y: -15, filter: "blur(10px)" }}
                                    animate={{ opacity: 1, scale: 1, x: 0, y: 0, filter: "blur(0px)" }}
                                    exit={{ opacity: 0, scale: 0, x: 10, y: -15, filter: "blur(10px)" }}
                                    transition={{ duration: 0.25, type: "spring", bounce: 0, damping: 18 }}
                                    style={{ transformOrigin: "top right" }}
                                    className="absolute top-0 right-0 z-[5001]" // Position wrapper
                                >
                                    <ControlCenter isOpen={true} onClose={() => setControlCenterOpen(false)} />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <span className="cursor-default min-w-[130px] text-right font-medium">
                        {format(time, 'EEE d MMM h:mm aa')}
                    </span>
                </div>
            </div>
        </div>
    );
};
