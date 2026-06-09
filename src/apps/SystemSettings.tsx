import React, { useState } from 'react';
import { useSettings } from '../store/settings';
import {
    Monitor, Dock, Palette, Wifi, Volume2, Sun,
    User, Bell, Battery, Search, Shield, Bluetooth,
    Globe, Lock, Moon, Image as ImageIcon, Type, LayoutGrid
} from 'lucide-react';
import clsx from 'clsx';

export const SystemSettings: React.FC = () => {
    const settings = useSettings();
    const [activeTab, setActiveTab] = useState('appearance');
    const [searchTerm, setSearchTerm] = useState('');

    const ACCENT_COLORS = [
        { name: 'Blue', value: 'blue', hex: '#007AFF' },
        { name: 'Purple', value: 'purple', hex: '#AF52DE' },
        { name: 'Pink', value: 'pink', hex: '#FF2D55' },
        { name: 'Red', value: 'red', hex: '#FF3B30' },
        { name: 'Orange', value: 'orange', hex: '#FF9500' },
        { name: 'Yellow', value: 'yellow', hex: '#FFCC00' },
        { name: 'Green', value: 'green', hex: '#28CD41' },
        { name: 'Gray', value: 'gray', hex: '#8E8E93' },
    ];

    const WALLPAPERS = [
        { name: 'Sequoia', url: 'https://bit.ly/3YF5qKx' },
        { name: 'Sonoma Horizon', url: 'https://images.unsplash.com/photo-1688232543149-5602b136ba11?q=80&w=2574&auto=format&fit=crop' },
        { name: 'Ventura Graphic', url: 'https://images.unsplash.com/photo-1620641788421-7f1c918ec0c0?q=80&w=2574&auto=format&fit=crop' },
        { name: 'Monterey', url: 'https://images.unsplash.com/photo-1621532822934-0988029cc9b4?q=80&w=2670&auto=format&fit=crop' }, // Real Monterey
        { name: 'Big Sur Abstract', url: 'https://4kwallpapers.com/images/wallpapers/macos-big-sur-apple-layers-fluidic-colorful-wwdc-stock-2560x1440-1455.jpg' },
        { name: 'Yosemite', url: 'https://images.unsplash.com/photo-1498429089284-41f8cf3ffd39?q=80&w=2670&auto=format&fit=crop' },
        { name: 'Mojave Desert', url: 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?q=80&w=2574&auto=format&fit=crop' },
        { name: 'Sierra', url: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?q=80&w=2670&auto=format&fit=crop' },
        { name: 'Aurora', url: 'https://images.unsplash.com/photo-1531306728370-e2ebd9d7bb99?q=80&w=2574&auto=format&fit=crop' },
        { name: 'Ventura Dark', url: 'linear-gradient(to bottom, #0f2027, #203a43, #2c5364)' },
        { name: 'Midnight', url: 'linear-gradient(to bottom, #232526, #414345)' },
        { name: 'Retro', url: 'linear-gradient(45deg, #12c2e9, #c471ed, #f64f59)' },
    ];

    const MENU_ITEMS = [
        { id: 'wifi', icon: Wifi, label: 'Wi-Fi', color: 'bg-blue-500' },
        { id: 'bluetooth', icon: Bluetooth, label: 'Bluetooth', color: 'bg-blue-500' },
        { id: 'network', icon: Globe, label: 'Network', color: 'bg-blue-500' },
        { type: 'spacer' },
        { id: 'notifications', icon: Bell, label: 'Notifications', color: 'bg-red-500' },
        { id: 'sound', icon: Volume2, label: 'Sound', color: 'bg-pink-500' },
        { id: 'focus', icon: Moon, label: 'Focus', color: 'bg-indigo-500' },
        { id: 'screentime', icon: Shield, label: 'Screen Time', color: 'bg-indigo-500' },
        { type: 'spacer' },
        { id: 'general', icon: Type, label: 'General', color: 'bg-gray-400' },
        { id: 'appearance', icon: Palette, label: 'Appearance', color: 'bg-gray-400' },
        { id: 'accessibility', icon: User, label: 'Accessibility', color: 'bg-blue-500' },
        { type: 'spacer' },
        { id: 'display', icon: Monitor, label: 'Displays', color: 'bg-blue-500' },
        { id: 'battery', icon: Battery, label: 'Battery', color: 'bg-green-500' },
        { id: 'wallpaper', icon: ImageIcon, label: 'Wallpaper', color: 'bg-cyan-500' },
        { id: 'widgets', icon: LayoutGrid, label: 'Widgets', color: 'bg-orange-500' },
        { id: 'dock', icon: Dock, label: 'Desktop & Dock', color: 'bg-gray-400' },
        { id: 'lockscreen', icon: Lock, label: 'Lock Screen', color: 'bg-gray-500' },
        { id: 'users', icon: User, label: 'Users & Groups', color: 'bg-gray-400' },
    ];

    const filteredItems = MENU_ITEMS.filter(item =>
        item.type === 'spacer' || item.label?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex h-full bg-[#F5F5F7] dark:bg-[#1E1E1E] text-black dark:text-white font-sans text-sm transition-colors duration-300">
            {/* Sidebar */}
            <div className="w-[240px] flex-shrink-0 flex flex-col pt-8 pb-4 bg-gray-100/50 dark:bg-[#2A2A2A]/50 border-r border-[#E5E5E5] dark:border-white/10 backdrop-blur-xl">
                {/* Search */}
                <div className="px-4 mb-4">
                    <div className="relative">
                        <Search size={14} className="absolute left-2.5 top-1.5 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-8 pr-3 py-1 bg-white dark:bg-white/10 border border-gray-200 dark:border-transparent rounded-[6px] text-sm focus:ring-2 ring-blue-500/50 outline-none transition-all placeholder:text-gray-400"
                        />
                    </div>
                </div>

                {/* User Profile Widget */}
                <div
                    className={clsx(
                        "mx-4 mb-4 p-2 flex items-center gap-3 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 cursor-pointer transition-colors",
                        activeTab === 'users' && "bg-black/10 dark:bg-white/10"
                    )}
                    onClick={() => setActiveTab('users')}
                >
                    <div className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden relative border border-black/10">
                        {settings.userAvatar ? (
                            <img src={settings.userAvatar} alt="User" className="w-full h-full object-cover" />
                        ) : (
                            <div className="absolute inset-0 flex items-center justify-center text-lg text-white font-bold bg-gray-400">
                                {settings.userName.charAt(0).toUpperCase()}
                            </div>
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="font-bold text-[13px] truncate">{settings.userName}</div>
                        <div className="text-[11px] text-gray-500 dark:text-gray-400">Apple Account</div>
                    </div>
                </div>

                {/* Menu Items */}
                <div className="flex-1 overflow-y-auto px-2 space-y-[1px]">
                    {filteredItems.map((item, i) => {
                        if (item.type === 'spacer') return <div key={i} className="h-4" />;
                        const Icon = item.icon;
                        return (
                            <div
                                key={item.id}
                                className={clsx(
                                    "flex items-center gap-3 px-3 py-1.5 rounded-md cursor-default transition-colors",
                                    activeTab === item.id
                                        ? "bg-blue-500 text-white shadow-sm"
                                        : "hover:bg-black/5 dark:hover:bg-white/10 text-gray-700 dark:text-gray-200"
                                )}
                                onClick={() => setActiveTab(item.id!)}
                            >
                                <div className={clsx("w-5 h-5 rounded-[5px] flex items-center justify-center text-white", item.color)}>
                                    {Icon && <Icon size={12} strokeWidth={2.5} />}
                                </div>
                                <span className="font-medium text-[13px]">{item.label}</span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto px-10 py-10">
                <div className="max-w-2xl mx-auto">
                    {/* Header */}
                    <h1 className="text-2xl font-bold mb-6 capitalize">{activeTab.replace('-', ' ')}</h1>

                    {/* CONTENT: Network */}
                    {activeTab === 'network' && (
                        <div className="space-y-6">
                            <Section label="Network">
                                <div className="p-4 space-y-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white">
                                            <Globe size={20} />
                                        </div>
                                        <div className="flex-1">
                                            <div className="font-semibold text-sm">Ethernet</div>
                                            <div className="text-xs text-green-600">Connected</div>
                                        </div>
                                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                    </div>
                                    <div className="h-[1px] bg-gray-200 dark:bg-white/10" />
                                    <div className="flex items-center gap-4 opacity-50">
                                        <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white">
                                            <Shield size={20} />
                                        </div>
                                        <div className="flex-1">
                                            <div className="font-semibold text-sm">VPN</div>
                                            <div className="text-xs text-gray-500">Not Configured</div>
                                        </div>
                                    </div>
                                </div>
                            </Section>
                        </div>
                    )}

                    {/* CONTENT: Notifications */}
                    {activeTab === 'notifications' && (
                        <div className="space-y-6">
                            <Section>
                                <div className="p-4 flex items-center justify-between">
                                    <span className="font-medium">Show previews</span>
                                    <select className="bg-gray-100 dark:bg-white/10 border-transparent rounded px-2 py-1 text-xs outline-none">
                                        <option>Always</option>
                                        <option>When Unlocked</option>
                                        <option>Never</option>
                                    </select>
                                </div>
                            </Section>

                            <Section label="Application Notifications">
                                <div className="divide-y divide-gray-200 dark:divide-white/5">
                                    {['Calendar', 'Messages', 'Tips', 'Photos'].map(app => (
                                        <div key={app} className="p-3 flex items-center justify-between hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer transition-colors">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-gray-300 dark:bg-white/10" />
                                                <span className="font-medium">{app}</span>
                                            </div>
                                            <div className="text-gray-400 text-xs">Banners, Sounds, Badges</div>
                                        </div>
                                    ))}
                                </div>
                            </Section>
                        </div>
                    )}

                    {/* CONTENT: Focus */}
                    {activeTab === 'focus' && (
                        <div className="space-y-6">
                            <Section>
                                <div className="p-4 flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white">
                                        <Moon size={20} fill="currentColor" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="font-semibold">Do Not Disturb</div>
                                        <div className="text-xs text-gray-500">{settings.focusMode ? 'On' : 'Off'}</div>
                                    </div>
                                    <input
                                        type="checkbox"
                                        className="toggle-checkbox"
                                        checked={settings.focusMode}
                                        onChange={settings.toggleFocusMode}
                                    />
                                </div>
                            </Section>
                            <Section label="Focus Profiles">
                                <div className="p-2 space-y-1">
                                    {['Personal', 'Work', 'Sleep', 'Gaming'].map(mode => (
                                        <div key={mode} className="flex items-center gap-3 p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer">
                                            <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-white/10 flex items-center justify-center">
                                                <Moon size={14} className="text-gray-500" />
                                            </div>
                                            <span className="font-medium">{mode}</span>
                                        </div>
                                    ))}
                                </div>
                            </Section>
                        </div>
                    )}

                    {/* CONTENT: Screen Time */}
                    {activeTab === 'screentime' && (
                        <div className="space-y-6">
                            <Section>
                                <div className="p-6 flex flex-col items-center">
                                    <div className="text-sm font-medium text-gray-500 mb-1">Daily Average</div>
                                    <div className="text-4xl font-bold mb-4">3h 24m</div>
                                    <div className="w-full h-32 flex items-end justify-between gap-1 px-4">
                                        {[40, 65, 30, 85, 45, 60, 50].map((h, i) => (
                                            <div key={i} className="flex flex-col items-center gap-2 w-full">
                                                <div
                                                    className="w-full bg-blue-500 rounded-t-sm opacity-80"
                                                    style={{ height: `${h}%` }}
                                                />
                                                <span className="text-[10px] text-gray-400">
                                                    {['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </Section>
                        </div>
                    )}

                    {/* CONTENT: Accessibility */}
                    {activeTab === 'accessibility' && (
                        <div className="space-y-6">
                            <Section label="Vision">
                                <div className="divide-y divide-gray-200 dark:divide-white/5">
                                    {[
                                        { name: 'VoiceOver', status: 'Off' },
                                        { name: 'Zoom', status: 'Off' },
                                        { name: 'Display', status: 'Default' },
                                        { name: 'Spoken Content', status: 'Custom' },
                                    ].map(item => (
                                        <div key={item.name} className="p-3 flex items-center justify-between hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer">
                                            <span className="font-medium">{item.name}</span>
                                            <span className="text-xs text-gray-500">{item.status}</span>
                                        </div>
                                    ))}
                                </div>
                            </Section>
                            <Section label="Hearing">
                                <div className="divide-y divide-gray-200 dark:divide-white/5">
                                    {[
                                        { name: 'Voice Control', status: 'Off' },
                                        { name: 'Keyboard', status: 'Default' },
                                    ].map(item => (
                                        <div key={item.name} className="p-3 flex items-center justify-between hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer">
                                            <span className="font-medium">{item.name}</span>
                                            <span className="text-xs text-gray-500">{item.status}</span>
                                        </div>
                                    ))}
                                </div>
                            </Section>
                        </div>
                    )}

                    {/* CONTENT: Battery */}
                    {activeTab === 'battery' && (
                        <div className="space-y-6">
                            <Section>
                                <div className="p-4 flex items-center gap-4">
                                    <div className="w-16 h-16 relative flex items-center justify-center">
                                        <Battery size={48} className="text-green-500 transform rotate-90" />
                                        <span className="absolute text-xs font-bold text-black dark:text-white">84%</span>
                                    </div>
                                    <div>
                                        <div className="font-bold text-lg">Normal</div>
                                        <div className="text-xs text-gray-500">Battery Level</div>
                                    </div>
                                </div>
                                <div className="h-[1px] bg-gray-200 dark:bg-white/10" />
                                <div className="p-4 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="font-medium">Low Power Mode</span>
                                        <select
                                            className="bg-gray-100 dark:bg-white/10 border-transparent rounded px-2 py-1 text-xs outline-none"
                                            value={settings.lowPowerMode}
                                            onChange={(e) => settings.setLowPowerMode(e.target.value)}
                                        >
                                            <option>Never</option>
                                            <option>Always</option>
                                            <option>Only on Battery</option>
                                        </select>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="font-medium">Battery Health</span>
                                        <div className="flex items-center gap-2 text-green-500 text-xs">
                                            <div className="w-2 h-2 rounded-full bg-green-500" />
                                            Normal (96%)
                                        </div>
                                    </div>
                                </div>
                            </Section>
                        </div>
                    )}

                    {/* CONTENT: General / About */}
                    {activeTab === 'general' && (
                        <div className="space-y-6">
                            <Section label="About This Mac">
                                <div className="p-6 flex flex-col items-center gap-4 text-center">
                                    <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-white/10 flex items-center justify-center mb-2">
                                        <Monitor size={48} className="text-gray-400" />
                                    </div>
                                    <h2 className="text-xl font-bold">macOS Sequoia</h2>
                                    <div className="text-gray-500 text-xs">Version 15.0</div>

                                    <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-left mt-4 text-xs">
                                        <span className="font-semibold text-right text-gray-500">Chip</span>
                                        <span>Apple M3 Pro</span>

                                        <span className="font-semibold text-right text-gray-500">Memory</span>
                                        <span>18 GB</span>

                                        <span className="font-semibold text-right text-gray-500">Startup Disk</span>
                                        <span>Macintosh HD</span>

                                        <span className="font-semibold text-right text-gray-500">Serial Number</span>
                                        <span>C02XL1234567</span>
                                    </div>

                                    <div className="mt-4 flex gap-2">
                                        <button className="px-3 py-1 bg-white dark:bg-white/10 border border-gray-300 dark:border-transparent rounded shadow-sm text-xs font-medium">System Report...</button>
                                        <button className="px-3 py-1 bg-white dark:bg-white/10 border border-gray-300 dark:border-transparent rounded shadow-sm text-xs font-medium">Software Update...</button>
                                    </div>
                                </div>
                            </Section>
                        </div>
                    )}

                    {/* CONTENT: Lock Screen */}
                    {activeTab === 'lockscreen' && (
                        <div className="space-y-6">
                            <Section>
                                <div className="p-4 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="font-medium">Require password after screen turns off</span>
                                        <select
                                            className="bg-gray-100 dark:bg-white/10 border-transparent rounded px-2 py-1 text-xs outline-none"
                                            value={settings.screenTimeout}
                                            onChange={(e) => settings.setScreenTimeout(e.target.value)}
                                        >
                                            <option>Immediately</option>
                                            <option>After 5 seconds</option>
                                            <option>After 1 minute</option>
                                        </select>
                                    </div>
                                    <div className="h-[1px] bg-gray-200 dark:bg-white/10" />
                                    <div className="flex items-center justify-between">
                                        <span className="font-medium">Show "Sleep" button</span>
                                        <input
                                            type="checkbox"
                                            className="toggle-checkbox"
                                            checked={settings.showSleepButton}
                                            onChange={(e) => settings.setShowSleepButton(e.target.checked)}
                                        />
                                    </div>
                                </div>
                            </Section>
                        </div>
                    )}

                    {/* CONTENT: Appearance */}
                    {activeTab === 'appearance' && (
                        <div className="space-y-6">
                            <Section label="Appearance">
                                <div className="flex gap-4 p-4">
                                    <div
                                        className="flex flex-col items-center gap-2 cursor-pointer group"
                                        onClick={() => settings.setTheme('light')}
                                    >
                                        <div className={clsx("w-20 h-14 bg-[#f2f2f2] border-2 rounded-lg relative overflow-hidden shadow-sm", settings.theme === 'light' ? "border-blue-500" : "border-gray-200 dark:border-gray-700")}>
                                            <div className="absolute top-2 left-2 w-12 h-2 bg-white rounded-sm shadow-sm"></div>
                                        </div>
                                        <span className="text-xs font-medium">Light</span>
                                    </div>
                                    <div
                                        className="flex flex-col items-center gap-2 cursor-pointer group"
                                        onClick={() => settings.setTheme('dark')}
                                    >
                                        <div className={clsx("w-20 h-14 bg-[#1e1e1e] border-2 rounded-lg relative overflow-hidden shadow-sm", settings.theme === 'dark' ? "border-blue-500" : "border-gray-200 dark:border-gray-700")}>
                                            <div className="absolute top-2 left-2 w-12 h-2 bg-[#2d2d2d] rounded-sm shadow-sm"></div>
                                        </div>
                                        <span className="text-xs font-medium">Dark</span>
                                    </div>
                                    <div className="flex flex-col items-center gap-2 cursor-pointer opacity-50">
                                        <div className="w-20 h-14 bg-gradient-to-tr from-[#f2f2f2] to-[#1e1e1e] border-2 border-gray-200 dark:border-gray-700 rounded-lg"></div>
                                        <span className="text-xs font-medium">Auto</span>
                                    </div>
                                </div>
                            </Section>

                            <Section label="Accent Color">
                                <div className="flex flex-wrap gap-3 p-4">
                                    {ACCENT_COLORS.map(color => (
                                        <div
                                            key={color.value}
                                            className={clsx(
                                                "w-6 h-6 rounded-full cursor-pointer shadow-sm relative flex items-center justify-center transition-transform hover:scale-110",
                                                settings.accentColor === color.value && "ring-2 ring-offset-2 ring-offset-[#F5F5F7] dark:ring-offset-[#1E1E1E] ring-gray-400"
                                            )}
                                            style={{ backgroundColor: color.hex }}
                                            onClick={() => settings.setAccentColor(color.value)}
                                            title={color.name}
                                        >
                                            {settings.accentColor === color.value && (
                                                <div className="w-2 h-2 bg-white rounded-full shadow-sm" />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </Section>
                        </div>
                    )}

                    {/* CONTENT: Desktop & Dock */}
                    {activeTab === 'dock' && (
                        <div className="space-y-6">
                            <Section>
                                <div className="p-4 space-y-6">
                                    <div className="flex items-center justify-between">
                                        <span className="font-medium">Size</span>
                                        <div className="flex items-center gap-4 w-64">
                                            <span className="text-xs text-gray-500 font-medium uppercase">Small</span>
                                            <input
                                                type="range" min="40" max="128"
                                                value={settings.dockSize}
                                                onChange={(e) => settings.setDockSize(Number(e.target.value))}
                                                className="flex-1 accent-gray-500 h-1 bg-gray-300 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer"
                                            />
                                            <span className="text-xs text-gray-500 font-medium uppercase">Large</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <span className="font-medium">Magnification</span>
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center gap-4 w-64">
                                                <div
                                                    className={clsx(
                                                        "w-10 h-6 rounded-full p-1 cursor-pointer transition-colors duration-200 ease-in-out",
                                                        settings.dockMagnification ? "bg-blue-500" : "bg-gray-300 dark:bg-gray-600"
                                                    )}
                                                    onClick={() => settings.setDockMagnification(!settings.dockMagnification)}
                                                >
                                                    <div className={clsx(
                                                        "w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform duration-200",
                                                        settings.dockMagnification ? "translate-x-4" : "translate-x-0"
                                                    )} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <span className="font-medium">Stage Manager</span>
                                        <div className="flex items-center gap-4">
                                            <div
                                                className={clsx(
                                                    "w-10 h-6 rounded-full p-1 cursor-pointer transition-colors duration-200 ease-in-out",
                                                    settings.stageManager ? "bg-blue-500" : "bg-gray-300 dark:bg-gray-600"
                                                )}
                                                onClick={() => settings.toggleStageManager()}
                                            >
                                                <div className={clsx(
                                                    "w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform duration-200",
                                                    settings.stageManager ? "translate-x-4" : "translate-x-0"
                                                )} />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="h-[1px] bg-gray-200 dark:bg-white/10" />

                                    <div className="flex items-center justify-center pt-2">
                                        <span className="text-xs text-gray-400">Position on screen is fixed to Bottom in this version</span>
                                    </div>
                                </div>
                            </Section>
                        </div>
                    )}

                    {/* CONTENT: Wallpaper */}
                    {activeTab === 'wallpaper' && (
                        <Section>
                            <div className="grid grid-cols-3 gap-4 p-4">
                                {WALLPAPERS.map((wp, i) => (
                                    <div key={i} className="flex flex-col gap-2 group cursor-pointer" onClick={() => settings.setWallpaper(wp.url)}>
                                        <div
                                            className={clsx(
                                                "aspect-video rounded-lg border-[3px] transition-all hover:scale-[1.02] shadow-sm",
                                                settings.wallpaper === wp.url ? "border-blue-500" : "border-transparent"
                                            )}
                                            style={{ background: wp.url.startsWith('http') ? `url(${wp.url}) center/cover` : wp.url }}
                                        />
                                        <span className="text-xs text-center font-medium text-gray-500 group-hover:text-black dark:group-hover:text-white truncate">
                                            {wp.name}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </Section>
                    )}

                    {/* CONTENT: Widgets */}
                    {activeTab === 'widgets' && (
                        <div className="space-y-6">
                            <Section label="Desktop Widgets">
                                <div className="p-4 grid grid-cols-2 gap-4">
                                    {[
                                        { id: 'clock', name: 'Clock', desc: 'Check the current time' },
                                        { id: 'weather', name: 'Weather', desc: 'Current weather conditions' },
                                        { id: 'calendar', name: 'Calendar', desc: 'Upcoming events' },
                                        { id: 'battery', name: 'Battery', desc: 'Device battery status' },
                                        { id: 'notes', name: 'Notes', desc: 'Quick sticky notes' }
                                    ].map(widget => {
                                        const isAdded = (settings.widgets || []).some(w => w.type === widget.id);
                                        return (
                                            <div key={widget.id} className="p-4 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-black/20 flex flex-col gap-3">
                                                <div className="font-semibold">{widget.name}</div>
                                                <div className="text-xs text-gray-500 flex-1">{widget.desc}</div>
                                                <button 
                                                    className={clsx("py-1.5 px-3 rounded-full text-xs font-medium w-full transition-colors", 
                                                        isAdded 
                                                            ? "bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-500/20 dark:text-red-400 dark:hover:bg-red-500/30" 
                                                            : "bg-blue-500 text-white hover:bg-blue-600"
                                                    )}
                                                    onClick={() => {
                                                        if (isAdded) {
                                                            const existing = settings.widgets.find(w => w.type === widget.id);
                                                            if (existing) settings.removeWidget(existing.id);
                                                        } else {
                                                            settings.addWidget(widget.id as any);
                                                        }
                                                    }}
                                                >
                                                    {isAdded ? 'Remove from Desktop' : 'Add to Desktop'}
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            </Section>
                        </div>
                    )}

                    {/* CONTENT: Displays */}
                    {activeTab === 'display' && (
                        <Section label="Built-in Display">
                            <div className="p-4 space-y-6">
                                <div className="flex flex-col gap-2">
                                    <div className="flex justify-between items-center">
                                        <span className="font-medium">Brightness</span>
                                        <span className="text-xs text-gray-500">{settings.brightness}%</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Sun size={16} className="text-gray-400" />
                                        <input
                                            type="range" min="0" max="100"
                                            value={settings.brightness}
                                            onChange={(e) => settings.setBrightness(Number(e.target.value))}
                                            className="flex-1 accent-gray-500 h-1 bg-gray-300 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer"
                                        />
                                        <Sun size={20} className="text-gray-900 dark:text-gray-100" />
                                    </div>
                                </div>
                            </div>
                        </Section>
                    )}

                    {/* CONTENT: Sound */}
                    {activeTab === 'sound' && (
                        <Section label="Output & Input">
                            <div className="p-4 space-y-6">
                                <div className="flex flex-col gap-2">
                                    <div className="flex justify-between items-center">
                                        <span className="font-medium">Output Volume</span>
                                        <span className="text-xs text-gray-500">{settings.volume}%</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Volume2 size={16} className="text-gray-400" />
                                        <input
                                            type="range" min="0" max="100"
                                            value={settings.volume}
                                            onChange={(e) => settings.setVolume(Number(e.target.value))}
                                            className="flex-1 accent-gray-500 h-1 bg-gray-300 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer"
                                        />
                                        <Volume2 size={20} className="text-gray-900 dark:text-gray-100" />
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                    <input type="checkbox" className="rounded text-blue-500" defaultChecked />
                                    <span>Play feedback when volume changes</span>
                                </div>
                            </div>
                        </Section>
                    )}

                    {/* CONTENT: Wi-Fi */}
                    {activeTab === 'wifi' && (
                        <Section>
                            <div className="p-4 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white">
                                        <Wifi size={20} />
                                    </div>
                                    <div>
                                        <div className="font-semibold">Wi-Fi</div>
                                        <div className="text-xs text-gray-500">{settings.wifi ? 'On' : 'Off'}</div>
                                    </div>
                                </div>

                                <div
                                    className={clsx(
                                        "w-10 h-6 rounded-full p-1 cursor-pointer transition-colors duration-200 ease-in-out",
                                        settings.wifi ? "bg-blue-500" : "bg-gray-300 dark:bg-gray-600"
                                    )}
                                    onClick={settings.toggleWifi}
                                >
                                    <div className={clsx(
                                        "w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform duration-200",
                                        settings.wifi ? "translate-x-4" : "translate-x-0"
                                    )} />
                                </div>
                            </div>
                        </Section>
                    )}

                    {/* CONTENT: Bluetooth */}
                    {activeTab === 'bluetooth' && (
                        <Section>
                            <div className="p-4 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white">
                                        <Bluetooth size={20} />
                                    </div>
                                    <div>
                                        <div className="font-semibold">Bluetooth</div>
                                        <div className="text-xs text-gray-500">{settings.bluetooth ? 'On' : 'Off'}</div>
                                    </div>
                                </div>

                                <div
                                    className={clsx(
                                        "w-10 h-6 rounded-full p-1 cursor-pointer transition-colors duration-200 ease-in-out",
                                        settings.bluetooth ? "bg-blue-500" : "bg-gray-300 dark:bg-gray-600"
                                    )}
                                    onClick={settings.toggleBluetooth}
                                >
                                    <div className={clsx(
                                        "w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform duration-200",
                                        settings.bluetooth ? "translate-x-4" : "translate-x-0"
                                    )} />
                                </div>
                            </div>
                        </Section>
                    )}

                </div>
            </div>
        </div>
    );
};

// Helper Component for Settings Sections
const Section = ({ label, children }: { label?: string, children: React.ReactNode }) => (
    <div className="space-y-2">
        {label && <div className="text-xs font-medium text-gray-400 uppercase tracking-tight ml-2">{label}</div>}
        <div className="bg-white dark:bg-[#2c2c2e] rounded-xl border border-gray-200 dark:border-white/5 shadow-sm overflow-hidden">
            {children}
        </div>
    </div>
);
