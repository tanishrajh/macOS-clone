import React, { useState, useEffect } from 'react';
import { Apple, Wifi, BatteryMedium, Search } from 'lucide-react';
import { format } from 'date-fns';
import { useWindowManager } from '../../store/window-manager';

export const MenuBar: React.FC = () => {
    const [time, setTime] = useState(new Date());
    const { activeWindowId, windows } = useWindowManager();

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

    return (
        <div className="h-[30px] w-full bg-[#00000088] backdrop-blur-2xl flex items-center justify-between px-2 text-[13px] font-medium text-white shadow-sm absolute top-0 z-[5000] select-none">
            <div className="flex items-center gap-0.5">
                <div className="flex items-center justify-center hover:bg-white/10 px-3 py-0.5 rounded cursor-default transition-colors">
                    <Apple size={16} fill="white" className="mb-0.5" />
                </div>

                <MenuItem bold>{displayAppName}</MenuItem>

                <div className="hidden sm:flex gap-0.5 opacity-90">
                    <MenuItem>File</MenuItem>
                    <MenuItem>Edit</MenuItem>
                    <MenuItem>View</MenuItem>
                    <MenuItem>Go</MenuItem>
                    <MenuItem>Window</MenuItem>
                    <MenuItem>Help</MenuItem>
                </div>
            </div>

            <div className="flex items-center gap-4 px-2">
                <div className="flex items-center gap-3 opacity-90">
                    <BatteryMedium size={18} className="opacity-80" />
                    <Wifi size={16} className="opacity-80" />
                    <Search size={14} className="opacity-80" />
                </div>

                <div className="flex items-center gap-2">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="opacity-80">
                        <path d="M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6z" />
                        <circle cx="8" cy="10" r="1.5" />
                        <circle cx="16" cy="14" r="1.5" />
                    </svg>

                    <span className="cursor-default min-w-[130px] text-right font-medium">
                        {format(time, 'EEE d MMM h:mm aa')}
                    </span>
                </div>
            </div>
        </div>
    );
};
