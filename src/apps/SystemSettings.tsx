import React from 'react';
import { useSettings } from '../store/settings';
import { Monitor, Dock, Palette } from 'lucide-react';
import clsx from 'clsx';

export const SystemSettings: React.FC = () => {
    const { theme, setTheme, wallpaper, setWallpaper, dockSize, setDockSize } = useSettings();
    const [activeTab, setActiveTab] = React.useState('wallpaper');

    const WALLPAPERS = [
        { name: 'Sequoia', url: 'https://bit.ly/3YF5qKx' }, // Mock/Proxy for new macOS
        { name: 'Ventura Graphic', url: 'https://images.unsplash.com/photo-1620641788421-7f1c918ec0c0?q=80&w=2574&auto=format&fit=crop' }, // Abstract Flow
        { name: 'Monterey', url: 'https://www.apple.com/v/macos/monterey/d/images/overview/hero/hero_startframe__c6599g3003ya_large.jpg' }, // Official Apple Monterey
        { name: 'Big Sur Abstract', url: 'https://4kwallpapers.com/images/wallpapers/macos-big-sur-apple-layers-fluidic-colorful-wwdc-stock-2560x1440-1455.jpg' },
        { name: 'Yosemite', url: 'https://images.unsplash.com/photo-1498429089284-41f8cf3ffd39?q=80&w=2670&auto=format&fit=crop' }, // Mountains/Nature
        { name: 'Mojave Desert', url: 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?q=80&w=2574&auto=format&fit=crop' },
        { name: 'Ventura Dark', url: 'linear-gradient(to bottom, #0f2027, #203a43, #2c5364)' },
        { name: 'Retro', url: 'linear-gradient(45deg, #12c2e9, #c471ed, #f64f59)' },
    ];

    return (
        <div className="flex h-full bg-[#F5F5F7] dark:bg-[#1E1E1E] text-black dark:text-white font-sans text-sm transition-colors duration-300">
            {/* Sidebar */}
            <div className="w-1/3 max-w-[220px] pt-12 pb-4 px-3 overflow-y-auto border-r border-[#E5E5E5] dark:border-white/10 bg-black/5 dark:bg-white/5">
                <div className="flex items-center gap-3 px-2 mb-6">
                    <div className="w-12 h-12 rounded-full bg-gray-300 overflow-hidden relative">
                        <div className="absolute inset-0 flex items-center justify-center text-xl text-white font-bold bg-gray-400">?</div>
                    </div>
                    <div>
                        <div className="font-bold text-base line-clamp-1">User</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Apple Account</div>
                    </div>
                </div>

                <SettingsItem icon={Monitor} label="Wallpaper" active={activeTab === 'wallpaper'} onClick={() => setActiveTab('wallpaper')} />
                <SettingsItem icon={Palette} label="Appearance" active={activeTab === 'appearance'} onClick={() => setActiveTab('appearance')} />
                <SettingsItem icon={Dock} label="Desktop & Dock" active={activeTab === 'dock'} onClick={() => setActiveTab('dock')} />
            </div>

            {/* Content */}
            <div className="flex-1 p-8 pt-12 overflow-y-auto">
                {activeTab === 'wallpaper' && (
                    <>
                        <h2 className="text-xl font-bold mb-6">Wallpaper</h2>
                        <div className="grid grid-cols-3 gap-4">
                            {WALLPAPERS.map((wp, i) => (
                                <div key={i} className="flex flex-col gap-1.5 group">
                                    <div
                                        className={clsx(
                                            "aspect-video rounded-lg cursor-pointer border-2 transition-all hover:scale-105 active:scale-95 shadow-sm",
                                            wallpaper === wp.url ? "border-blue-500" : "border-black/5"
                                        )}
                                        style={{ background: wp.url.startsWith('http') ? `url(${wp.url}) center/cover` : wp.url }}
                                        onClick={() => setWallpaper(wp.url)}
                                    />
                                    <span className="text-xs text-center font-medium text-gray-500 group-hover:text-gray-900 truncate">
                                        {wp.name}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {activeTab === 'appearance' && (
                    <>
                        <h2 className="text-xl font-bold mb-6">Appearance</h2>
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
                    </>
                )}

                {activeTab === 'dock' && (
                    <>
                        <h2 className="text-xl font-bold mb-6">Desktop & Dock</h2>
                        <div className="bg-white dark:bg-[#2c2c2e] rounded-lg border border-gray-200 dark:border-white/10 p-4 shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <span className="font-medium">Size</span>
                                <div className="flex items-center gap-3 w-1/2">
                                    <span className="text-xs text-gray-400">Small</span>
                                    <input
                                        type="range"
                                        min="40"
                                        max="100"
                                        value={dockSize}
                                        onChange={(e) => setDockSize(Number(e.target.value))}
                                        className="flex-1 accent-blue-500 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                    />
                                    <span className="text-xs text-gray-400">Large</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="font-medium">Magnification</span>
                                <input type="checkbox" defaultChecked className="toggle-checkbox" />
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

const SettingsItem = ({ icon: Icon, label, active = false, onClick }: any) => (
    <div
        className={clsx(
            "flex items-center gap-2 px-2 py-1.5 rounded-md cursor-default mb-0.5 transition-colors",
            active ? "bg-[#007AFF] text-white shadow-sm" : "hover:bg-black/5 dark:hover:bg-white/10 text-gray-700 dark:text-gray-200"
        )}
        onClick={onClick}
    >
        <Icon size={16} />
        <span className="font-medium">{label}</span>
    </div>
);
