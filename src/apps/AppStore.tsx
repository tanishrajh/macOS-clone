import React, { useState } from 'react';
import { Search, Star } from 'lucide-react';

interface AppItem {
    id: string;
    title: string;
    category: string;
    icon: string;
    description: string;
}

const FEATURED_APPS: AppItem[] = [
    { id: '1', title: 'vscode', category: 'Developer Tools', icon: 'https://upload.wikimedia.org/wikipedia/commons/9/9a/Visual_Studio_Code_1.35_icon.svg', description: 'Code editing. Redefined.' },
    { id: '2', title: 'Slack', category: 'Business', icon: 'https://cdn-icons-png.flaticon.com/512/2111/2111615.png', description: 'Team communication and collaboration.' },
    { id: '3', title: 'Spotify', category: 'Music', icon: 'https://cdn-icons-png.flaticon.com/512/174/174872.png', description: 'Music for everyone.' },
    { id: '4', title: 'Figma', category: 'Graphics & Design', icon: 'https://upload.wikimedia.org/wikipedia/commons/3/33/Figma-logo.svg', description: 'The collaborative interface design tool.' },
    { id: '5', title: 'Arc', category: 'Productivity', icon: 'https://arc.net/favicon.ico', description: 'The internet computer.' },
    { id: '6', title: 'Discord', category: 'Social Networking', icon: 'https://cdn-icons-png.flaticon.com/512/2111/2111370.png', description: 'Talk, chat, hang out.' },
];

export const AppStore: React.FC = () => {
    const [activeTab, setActiveTab] = useState('Discover');
    const [installing, setInstalling] = useState<Record<string, boolean>>({});

    const handleGet = (id: string) => {
        setInstalling(prev => ({ ...prev, [id]: true }));
        setTimeout(() => {
            setInstalling(prev => ({ ...prev, [id]: false }));
            alert('App "Installed" (Simulation)');
        }, 1500);
    };

    return (
        <div className="flex w-full h-full bg-white dark:bg-[#1c1c1c] text-black dark:text-white font-sans transition-colors duration-300">
            {/* Sidebar */}
            <div className="w-56 bg-[#F5F5F7] dark:bg-[#2c2c2e] flex flex-col pt-8 border-r border-gray-200 dark:border-white/10">
                <div className="px-4 mb-6">
                    <div className="relative">
                        <Search className="absolute left-2 top-1.5 text-gray-400 w-4 h-4" />
                        <input className="w-full bg-[#E3E3E8] rounded-md pl-8 pr-2 py-1 text-sm outline-none placeholder-gray-500" placeholder="Search" />
                    </div>
                </div>

                <div className="space-y-1 px-2">
                    {['Discover', 'Arcade', 'Create', 'Work', 'Play', 'Develop', 'Categories', 'Updates'].map(tab => (
                        <div
                            key={tab}
                            className={`px-3 py-2 rounded-md text-sm font-medium cursor-pointer flex items-center gap-3 ${activeTab === tab ? 'bg-[#E0E0E0] dark:bg-white/20 text-blue-500' : 'hover:bg-black/5 dark:hover:bg-white/10 text-gray-700 dark:text-gray-400'}`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab === 'Discover' && <Star size={18} />}
                            {tab !== 'Discover' && <span className="w-[18px]" />}
                            {tab}
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto">
                {/* Hero Banner */}
                <div className="px-8 pt-6 pb-4">
                    <div className="h-64 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white p-8 mb-8 shadow-lg relative overflow-hidden group">
                        <div className="relative z-10">
                            <div className="text-xs font-bold uppercase tracking-wider mb-2 opacity-80">Featured</div>
                            <h1 className="text-4xl font-bold mb-2">Essential Mac Apps</h1>
                            <p className="opacity-90 max-w-sm mb-6">Upgrade your workflow with these must-have tools for productivity and creativity.</p>
                            <div className="overflow-hidden rounded-lg shadow-xl w-32 h-32 bg-white flex items-center justify-center">
                                <img src="https://upload.wikimedia.org/wikipedia/commons/9/9a/Visual_Studio_Code_1.35_icon.svg" className="w-20 h-20" />
                            </div>
                        </div>
                        <div className="absolute right-0 top-0 w-[400px] h-[400px] bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-white/20 transition-colors" />
                    </div>

                    <h2 className="text-xl font-bold mb-4">Discover Apps</h2>
                    <div className="space-y-6">
                        {FEATURED_APPS.map(app => (
                            <div key={app.id} className="flex items-center gap-4 group">
                                <img src={app.icon} className="w-16 h-16 rounded-[14px] shadow-sm bg-white object-contain p-1 border border-gray-100 dark:border-black/50" />
                                <div className="flex-1 border-b border-gray-100 dark:border-white/5 py-4 flex items-center justify-between group-last:border-0">
                                    <div>
                                        <div className="font-semibold text-base">{app.title}</div>
                                        <div className="text-xs text-gray-500">{app.category}</div>
                                        <div className="text-sm text-gray-600 line-clamp-1 mt-0.5">{app.description}</div>
                                    </div>
                                    <button
                                        className="bg-[#EFF1F2] dark:bg-[#3a3a3c] text-[#007AFF] font-bold text-sm px-5 py-1.5 rounded-full hover:bg-[#E5E5E5] dark:hover:bg-[#4a4a4c] transition-colors min-w-[70px]"
                                        onClick={() => handleGet(app.id)}
                                    >
                                        {installing[app.id] ? <div className="w-4 h-4 border-2 border-[#007AFF] border-t-transparent rounded-full animate-spin mx-auto" /> : 'GET'}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
