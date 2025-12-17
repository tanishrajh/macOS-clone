import React, { useState, useEffect } from 'react';
import { Apple, Wifi, BatteryMedium, Search } from 'lucide-react';
import { format } from 'date-fns';
import { useWindowManager } from '../../store/window-manager';
import { ControlCenter } from './ControlCenter';
import clsx from 'clsx';
import { useSettings } from '../../store/settings';
import { useSystem } from '../../store/system';
import { MenuBarMenus } from './MenuBarMenus';

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
        <div className="h-[30px] w-full bg-[#00000088] backdrop-blur-2xl flex items-center justify-between px-2 text-[13px] font-medium text-white shadow-sm absolute top-0 z-[5000] select-none">
            <div className="flex items-center gap-0.5 relative">
                <div
                    className={clsx("flex items-center justify-center hover:bg-white/10 px-3 py-0.5 rounded cursor-default transition-colors relative", appleMenuOpen && "bg-white/10")}
                    onClick={() => setAppleMenuOpen(!appleMenuOpen)}
                >
                    <Apple size={16} fill="white" className="mb-0.5" />
                    {appleMenuOpen && (
                        <>
                            <div className="fixed inset-0 z-40 bg-transparent" onClick={(e) => { e.stopPropagation(); setAppleMenuOpen(false); }} />
                            <div className="absolute top-full left-0 mt-1 w-56 bg-[#E5E5E5]/90 backdrop-blur-xl border border-white/20 rounded-lg shadow-xl py-1 text-black z-50">
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
                            </div>
                        </>
                    )}
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
                        <ControlCenter isOpen={controlCenterOpen} onClose={() => setControlCenterOpen(false)} />
                    </div>

                    <span className="cursor-default min-w-[130px] text-right font-medium">
                        {format(time, 'EEE d MMM h:mm aa')}
                    </span>
                </div>
            </div>
        </div>
    );
};
