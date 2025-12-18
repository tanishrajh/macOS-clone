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
import { Dialog } from './Dialog';

export const MenuBar: React.FC = () => {
    const [time, setTime] = useState(new Date());
    const { activeWindowId, windows, toggleSpotlight, openWindow } = useWindowManager();
    const { setSleeping, setLocked } = useSystem();
    const { wifi } = useSettings();
    const [controlCenterOpen, setControlCenterOpen] = useState(false);
    const [appleMenuOpen, setAppleMenuOpen] = useState(false);

    // Dialog States
    const [showAbout, setShowAbout] = useState(false);
    const [showRestart, setShowRestart] = useState(false);
    const [showShutdown, setShowShutdown] = useState(false);
    const [showLogout, setShowLogout] = useState(false);

    // Battery Logic
    const [batteryMenuOpen, setBatteryMenuOpen] = useState(false);
    const [batteryLevel, setBatteryLevel] = useState<number | null>(null);
    const [isCharging, setIsCharging] = useState(false);

    useEffect(() => {
        // @ts-ignore
        if (navigator.getBattery) {
            // @ts-ignore
            navigator.getBattery().then(battery => {
                setBatteryLevel(battery.level * 100);
                setIsCharging(battery.charging);

                battery.addEventListener('levelchange', () => setBatteryLevel(battery.level * 100));
                battery.addEventListener('chargingchange', () => setIsCharging(battery.charging));
            });
        } else {
            // Mock for browsers without API
            setBatteryLevel(100);
            setIsCharging(true);
        }
    }, []);

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

    const handleSleep = () => { setAppleMenuOpen(false); setSleeping(true); };
<<<<<<< HEAD
    const handleClickLock = () => { setAppleMenuOpen(false); setLocked(true); }; // Renamed to avoid collision with generic lock handler if any
    const handleOpenSettings = (e: React.MouseEvent) => {
        setAppleMenuOpen(false);
        const rect = e.currentTarget.getBoundingClientRect();
        openWindow('settings', 'System Settings', {
            width: 800,
            height: 600,
            origin: { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2, width: rect.width, height: rect.height }
        });
    };
=======
    const handleClickLock = () => { setAppleMenuOpen(false); setLocked(true); };
    const handleOpenSettings = () => { setAppleMenuOpen(false); openWindow('settings', 'System Settings', { width: 800, height: 600 }); };
>>>>>>> b3d7012 (feat: enhance control center animation and add battery menu)

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
                                    <div className="px-4 py-1 hover:bg-blue-500 hover:text-white cursor-default" onClick={() => { setAppleMenuOpen(false); setShowAbout(true); }}>About This Mac</div>
                                    <div className="h-px bg-gray-300/50 my-1 mx-3" />
                                    <div className="px-4 py-1 hover:bg-blue-500 hover:text-white cursor-default" onClick={(e) => handleOpenSettings(e)}>System Settings...</div>
                                    <div className="px-4 py-1 hover:bg-blue-500 hover:text-white cursor-default" onClick={(e) => {
                                        setAppleMenuOpen(false);
                                        const rect = e.currentTarget.getBoundingClientRect();
                                        openWindow('appstore', 'App Store', { origin: { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2, width: rect.width, height: rect.height } });
                                    }}>App Store...</div>
                                    <div className="h-px bg-gray-300/50 my-1 mx-3" />
                                    <div className="px-4 py-1 hover:bg-blue-500 hover:text-white cursor-default opacity-50">Recent Items</div>
                                    <div className="h-px bg-gray-300/50 my-1 mx-3" />
                                    <div className="px-4 py-1 hover:bg-blue-500 hover:text-white cursor-default" onClick={(e) => {
                                        setAppleMenuOpen(false);
                                        const rect = e.currentTarget.getBoundingClientRect();
                                        openWindow('activity', 'Activity Monitor', { origin: { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2, width: rect.width, height: rect.height } });
                                    }}>Force Quit...</div>
                                    <div className="h-px bg-gray-300/50 my-1 mx-3" />
                                    <div className="px-4 py-1 hover:bg-blue-500 hover:text-white cursor-default" onClick={handleSleep}>Sleep</div>
                                    <div className="px-4 py-1 hover:bg-blue-500 hover:text-white cursor-default" onClick={() => { setAppleMenuOpen(false); setShowRestart(true); }}>Restart...</div>
                                    <div className="px-4 py-1 hover:bg-blue-500 hover:text-white cursor-default" onClick={() => { setAppleMenuOpen(false); setShowShutdown(true); }}>Shut Down...</div>
                                    <div className="h-px bg-gray-300/50 my-1 mx-3" />
                                    <div className="px-4 py-1 hover:bg-blue-500 hover:text-white cursor-default" onClick={() => { setAppleMenuOpen(false); handleClickLock(); }}>Lock Screen</div>
                                    <div className="px-4 py-1 hover:bg-blue-500 hover:text-white cursor-default" onClick={() => { setAppleMenuOpen(false); setShowLogout(true); }}>Log Out User...</div>
                                </motion.div>
                            </>
                        )}
                    </AnimatePresence>
                </div>

                {/* System Dialogs */}
                <Dialog
                    open={showAbout}
                    onClose={() => setShowAbout(false)}
                    title=""
                    description=""
                    primaryAction={{ label: 'OK', onClick: () => setShowAbout(false) }}
                >
                    <div className="flex flex-col items-center justify-center pt-2 pb-4 gap-4">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-gray-100 to-gray-300 flex items-center justify-center shadow-inner">
                            <svg viewBox="0 0 384 512" width="50" height="50" fill="#333" className="">
                                <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
                            </svg>
                        </div>
                        <div className="flex flex-col items-center gap-1">
                            <h2 className="text-xl font-bold">macOS Sequoia</h2>
                            <p className="text-sm text-gray-500">Version 15.0</p>
                            <div className="flex gap-2 mt-2 text-xs text-gray-400">
                                <span className="px-2 py-0.5 bg-gray-100 dark:bg-white/10 rounded">MacBook Pro</span>
                                <span className="px-2 py-0.5 bg-gray-100 dark:bg-white/10 rounded">M3 Max</span>
                            </div>
                        </div>
                    </div>
                </Dialog>

                <Dialog
                    open={showRestart}
                    onClose={() => setShowRestart(false)}
                    title="Restart"
                    description="Are you sure you want to restart your computer?"
                    type="danger"
                    primaryAction={{ label: 'Restart', danger: true, onClick: () => window.location.reload() }}
                    secondaryAction={{ label: 'Cancel', onClick: () => setShowRestart(false) }}
                />

                <Dialog
                    open={showShutdown}
                    onClose={() => setShowShutdown(false)}
                    title="Shut Down"
                    description="Are you sure you want to shut down your computer?"
                    type="danger"
                    primaryAction={{ label: 'Shut Down', danger: true, onClick: () => window.location.reload() }}
                    secondaryAction={{ label: 'Cancel', onClick: () => setShowShutdown(false) }}
                />

                <Dialog
                    open={showLogout}
                    onClose={() => setShowLogout(false)}
                    title="Log Out"
                    description="Are you sure you want to log out?"
                    primaryAction={{ label: 'Log Out', danger: true, onClick: () => { setLocked(true); setShowLogout(false); } }}
                    secondaryAction={{ label: 'Cancel', onClick: () => setShowLogout(false) }}
                />

                <MenuItem bold>{displayAppName}</MenuItem>

                <div className="hidden sm:flex opacity-90">
                    <MenuBarMenus />
                </div>
            </div>

            <div className="flex items-center gap-4 px-2">
                <div className="flex items-center gap-3 opacity-90">
                    {/* Battery */}
                    <div
                        className="relative flex items-center"
                        onClick={() => setBatteryMenuOpen(!batteryMenuOpen)}
                    >
                        <div className={clsx("flex items-center justify-center opacity-80 cursor-pointer rounded hover:bg-white/10 px-1 py-0.5 transition-colors", batteryMenuOpen && "bg-white/10")}>
                            <BatteryMedium size={18} className={clsx(batteryLevel !== null && batteryLevel <= 20 && "text-red-500", isCharging && "text-green-400")} />
                        </div>

                        <AnimatePresence>
                            {batteryMenuOpen && (
                                <>
                                    <div className="fixed inset-0 z-40 bg-transparent" onClick={(e) => { e.stopPropagation(); setBatteryMenuOpen(false); }} />
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95, y: 5, filter: "blur(10px)" }}
                                        animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
                                        exit={{ opacity: 0, scale: 0.95, y: 5, filter: "blur(10px)" }}
                                        transition={{ duration: 0.1, ease: "easeOut" }}
                                        className="absolute top-full right-0 mt-2 w-64 mac-glass rounded-lg py-1 text-black dark:text-gray-200 z-50 shadow-2xl border border-white/20 select-none"
                                    >
                                        <div className="px-4 py-2 border-b border-gray-400/20">
                                            <div className="text-xs font-bold text-gray-500 uppercase mb-1">Battery</div>
                                            <div className="flex justify-between items-center text-sm">
                                                <span>{batteryLevel !== null ? `${Math.round(batteryLevel)}%` : 'Checking...'}</span>
                                                <span className="text-gray-500 text-xs">{isCharging ? 'Charging' : 'Battery Power'}</span>
                                            </div>
                                            <div className="text-xs text-gray-400 mt-1">
                                                Power Source: {isCharging ? 'Power Adapter' : 'Battery'}
                                            </div>
                                        </div>
                                        <div className="py-1">
                                            <div
                                                className="px-4 py-1 hover:bg-blue-500 hover:text-white cursor-default text-sm flex items-center gap-2"
                                                onClick={() => { setBatteryMenuOpen(false); openWindow('settings', 'System Settings'); }}
                                            >
                                                Battery Settings...
                                            </div>
                                        </div>
                                    </motion.div>
                                </>
                            )}
                        </AnimatePresence>
                    </div>

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
                        className={clsx("relative flex items-center gap-2 cursor-default hover:bg-white/10 px-2 py-0.5 rounded transition-colors", controlCenterOpen && "bg-white/10")}
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
                                    initial={{ opacity: 0, scale: 0.1, x: 0, y: -20, filter: "blur(12px)" }}
                                    animate={{ opacity: 1, scale: 1, x: 0, y: 0, filter: "blur(0px)" }}
                                    exit={{ opacity: 0, scale: 0.1, x: 0, y: -10, filter: "blur(12px)" }}
                                    transition={{ type: "spring", stiffness: 350, damping: 25, mass: 0.8 }}
                                    style={{ transformOrigin: "calc(100% - 14px) -12px" }} // Adjusted for relative anchor: ~center of 28px icon button
                                    className="absolute top-8 right-0 z-[5001]"
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
