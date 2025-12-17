import React from 'react';
import { Wifi, Bluetooth, Sun, Moon, Volume2, Cast } from 'lucide-react';
import clsx from 'clsx';
import { useSettings } from '../../store/settings';

interface ControlCenterProps {
    isOpen: boolean;
    onClose: () => void;
}

export const ControlCenter: React.FC<ControlCenterProps> = ({ isOpen, onClose }) => {
    const { theme, setTheme } = useSettings();

    return (
        <>
            {isOpen && (
                <>
                    <div className="fixed inset-0 z-[5000] bg-transparent" onClick={onClose} />
                    <div
                        className="absolute top-9 right-2 w-80 bg-[#E5E5E5]/90 dark:bg-[#1e1e1e]/90 backdrop-blur-2xl border border-white/20 dark:border-white/10 rounded-2xl shadow-2xl p-3 z-[5001] text-black dark:text-white transition-colors duration-300"
                    >
                        <div className="grid grid-cols-2 gap-3 mb-3">
                            {/* Network/Connectivity Block */}
                            <div className="bg-white/50 dark:bg-black/20 rounded-xl p-3 flex flex-col gap-3 shadow-sm">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                                        <Wifi size={16} />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-xs font-semibold">Wi-Fi</span>
                                        <span className="text-[10px] text-gray-500 dark:text-gray-400">Home Network</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                                        <Bluetooth size={16} />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-xs font-semibold">Bluetooth</span>
                                        <span className="text-[10px] text-gray-500 dark:text-gray-400">On</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                                        <Cast size={16} />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-xs font-semibold">AirDrop</span>
                                        <span className="text-[10px] text-gray-500 dark:text-gray-400">Contacts Only</span>
                                    </div>
                                </div>
                            </div>

                            {/* Do Not Disturb & Screen Mirroring */}
                            <div className="flex flex-col gap-3">
                                <div className="flex-1 bg-white/50 dark:bg-black/20 rounded-xl p-3 flex items-center gap-3 shadow-sm hover:bg-white/60 dark:hover:bg-black/30 transition-colors cursor-pointer">
                                    <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white">
                                        <Moon size={16} fill="currentColor" />
                                    </div>
                                    <span className="text-xs font-semibold">Do Not Disturb</span>
                                </div>
                                <div className="flex-1 bg-white/50 dark:bg-black/20 rounded-xl p-3 flex items-center gap-3 shadow-sm hover:bg-white/60 dark:hover:bg-black/30 transition-colors cursor-pointer"
                                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                                >
                                    <div className={clsx("w-8 h-8 rounded-full flex items-center justify-center text-white transition-colors", theme === 'dark' ? "bg-white text-black" : "bg-gray-800")}>
                                        {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
                                    </div>
                                    <span className="text-xs font-semibold">{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
                                </div>
                            </div>
                        </div>

                        {/* Display Slider */}
                        <div className="bg-white/50 dark:bg-black/20 rounded-xl p-3 mb-3 shadow-sm">
                            <div className="flex flex-col gap-2">
                                <span className="text-xs font-semibold px-1">Display</span>
                                <div className="h-6 bg-white/80 dark:bg-black/50 rounded-full relative overflow-hidden group cursor-pointer border border-gray-200 dark:border-white/10">
                                    <div className="absolute inset-y-0 left-0 bg-white dark:bg-gray-200 w-[70%]" />
                                    <Sun size={14} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500" />
                                </div>
                            </div>
                        </div>

                        {/* Sound Slider */}
                        <div className="bg-white/50 dark:bg-black/20 rounded-xl p-3 mb-3 shadow-sm">
                            <div className="flex flex-col gap-2">
                                <span className="text-xs font-semibold px-1">Sound</span>
                                <div className="h-6 bg-white/80 dark:bg-black/50 rounded-full relative overflow-hidden group cursor-pointer border border-gray-200 dark:border-white/10">
                                    <div className="absolute inset-y-0 left-0 bg-white dark:bg-gray-200 w-[50%]" />
                                    <Volume2 size={14} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500" />
                                </div>
                            </div>
                        </div>

                    </div>
                </>
            )}
        </>
    );
};
