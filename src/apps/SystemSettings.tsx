import React from 'react';
import { useSettings } from '../store/settings';
import { Monitor, Dock, Type, Palette } from 'lucide-react';
import clsx from 'clsx';

export const SystemSettings: React.FC = () => {
    const { theme, setTheme, wallpaper, setWallpaper } = useSettings();

    const WALLPAPERS = [
        'https://images.unsplash.com/photo-1620641788421-7f1c918ec0c0?q=80&w=2574&auto=format&fit=crop', // Big Sur
        'https://images.unsplash.com/photo-1697216694672-88746c107106?q=80&w=2574&auto=format&fit=crop', // Abstract
        'https://images.unsplash.com/photo-1477346611705-65d1883cee1e?q=80&w=2670&auto=format&fit=crop', // Mountains
        'linear-gradient(to bottom right, #ffafbd, #ffc3a0)', // Gradient 1
        'linear-gradient(to top right, #2193b0, #6dd5ed)', // Gradient 2
    ];

    return (
        <div className="flex h-full bg-[#F5F5F7] text-black font-sans text-sm">
            {/* Sidebar */}
            <div className="w-1/3 max-w-[220px] pt-12 pb-4 px-3 overflow-y-auto border-r border-[#E5E5E5]">
                <div className="flex items-center gap-3 px-2 mb-6">
                    <div className="w-12 h-12 rounded-full bg-gray-300 overflow-hidden relative">
                        <div className="absolute inset-0 flex items-center justify-center text-xl text-white font-bold bg-gray-400">?</div>
                    </div>
                    <div>
                        <div className="font-bold text-base line-clamp-1">User</div>
                        <div className="text-xs text-gray-500">Apple Account</div>
                    </div>
                </div>

                <SettingsItem icon={Monitor} label="Wallpaper" active />
                <SettingsItem icon={Palette} label="Appearance" />
                <SettingsItem icon={Dock} label="Desktop & Dock" />
                <SettingsItem icon={Type} label="Displays" />
            </div>

            {/* Content */}
            <div className="flex-1 p-8 pt-12 overflow-y-auto">
                <h2 className="text-xl font-bold mb-6">Wallpaper</h2>

                {/* Theme Toggle */}
                <div className="mb-8">
                    <div className="text-xs font-medium text-gray-400 mb-2 uppercase tracking-warn">Appearance</div>
                    <div className="flex gap-4">
                        <div
                            className={clsx("flex flex-col items-center gap-2 cursor-pointer", theme === 'light' && "opacity-100")}
                            onClick={() => setTheme('light')}
                        >
                            <div className="w-16 h-12 bg-white border border-gray-200 rounded-md shadow-sm" />
                            <span>Light</span>
                        </div>
                        <div
                            className={clsx("flex flex-col items-center gap-2 cursor-pointer", theme === 'dark' && "opacity-100")}
                            onClick={() => setTheme('dark')}
                        >
                            <div className="w-16 h-12 bg-gray-800 border border-gray-700 rounded-md shadow-sm" />
                            <span>Dark</span>
                        </div>
                    </div>
                </div>

                <div className="text-xs font-medium text-gray-400 mb-2 uppercase tracking-warn">Wallpapers</div>
                <div className="grid grid-cols-3 gap-4">
                    {WALLPAPERS.map((wp, i) => (
                        <div
                            key={i}
                            className={clsx(
                                "aspect-video rounded-lg cursor-pointer border-2 transition-all hover:scale-105 active:scale-95",
                                wallpaper === wp ? "border-blue-500" : "border-transparent"
                            )}
                            style={{ background: wp, backgroundSize: 'cover' }}
                            onClick={() => setWallpaper(wp)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

const SettingsItem = ({ icon: Icon, label, active = false }: any) => (
    <div className={clsx(
        "flex items-center gap-2 px-2 py-1.5 rounded-md cursor-default mb-0.5",
        active ? "bg-[#007AFF] text-white" : "hover:bg-black/5 text-gray-700"
    )}>
        <Icon size={16} />
        <span className="font-medium">{label}</span>
    </div>
);
