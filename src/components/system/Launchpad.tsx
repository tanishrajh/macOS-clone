import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search } from 'lucide-react';
import { useWindowManager } from '../../store/window-manager';
import { Folder, Globe, MessageSquare, Image, Music, Calendar, Terminal, Settings, FileText, CheckSquare, ShoppingBag, Mic, Video, Calculator } from 'lucide-react';
import clsx from 'clsx';

interface AppItem {
    id: string;
    name: string;
    icon: import('lucide-react').LucideIcon;
    color: string;
}

const APPS: AppItem[] = [
    { id: 'finder', name: 'Finder', icon: Folder, color: 'bg-gradient-to-b from-blue-400 to-blue-600' },
    { id: 'safari', name: 'Safari', icon: Globe, color: 'bg-white text-blue-500' },
    { id: 'messages', name: 'Messages', icon: MessageSquare, color: 'bg-gradient-to-b from-green-400 to-green-600' },
    { id: 'photos', name: 'Photos', icon: Image, color: 'bg-gradient-to-tr from-orange-400 via-red-500 to-purple-600' },
    { id: 'calendar', name: 'Calendar', icon: Calendar, color: 'bg-white text-red-500' },
    { id: 'music', name: 'Music', icon: Music, color: 'bg-gradient-to-b from-red-400 to-red-600' },
    { id: 'terminal', name: 'Terminal', icon: Terminal, color: 'bg-gradient-to-b from-gray-700 to-gray-900' },
    { id: 'settings', name: 'System Settings', icon: Settings, color: 'bg-gradient-to-b from-gray-300 to-gray-500' },
    { id: 'calculator', name: 'Calculator', icon: Calculator, color: 'bg-gradient-to-b from-orange-400 to-orange-600' },
    { id: 'notes', name: 'Notes', icon: FileText, color: 'bg-gradient-to-b from-yellow-300 to-yellow-500' },
    { id: 'textedit', name: 'TextEdit', icon: FileText, color: 'bg-gradient-to-b from-gray-500 to-gray-700' },
    { id: 'voicememos', name: 'Voice Memos', icon: Mic, color: 'bg-white text-red-500' },
    { id: 'reminders', name: 'Reminders', icon: CheckSquare, color: 'bg-white text-blue-500' },
    { id: 'appstore', name: 'App Store', icon: ShoppingBag, color: 'bg-gradient-to-b from-blue-500 to-blue-700' },
    { id: 'news', name: 'News', icon: FileText, color: 'bg-gradient-to-b from-red-500 to-pink-600' },
    { id: 'facetime', name: 'FaceTime', icon: Video, color: 'bg-gradient-to-b from-green-400 to-green-600' },
];

interface LaunchpadProps {
    isOpen: boolean;
    onClose: () => void;
}

export const Launchpad: React.FC<LaunchpadProps> = ({ isOpen, onClose }) => {
    const { openWindow } = useWindowManager();
    const [searchTerm, setSearchTerm] = useState('');

    const filteredApps = APPS.filter(app => app.name.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, scale: 1.1, filter: 'blur(20px)' }}
                    animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, scale: 1.1, filter: 'blur(20px)' }}
                    transition={{ duration: 0.3 }}
                    className="fixed inset-0 z-[9000] bg-black/40 backdrop-blur-2xl flex flex-col items-center pt-20"
                    onClick={() => {
                        // Close if clicking empty space?
                        onClose();
                    }}
                >
                    {/* Search Bar */}
                    <div
                        className="w-64 h-10 bg-white/10 rounded-lg flex items-center px-3 gap-2 border border-white/20 mb-16"
                        onClick={e => e.stopPropagation()}
                    >
                        <Search className="text-white/50" size={18} />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            placeholder="Search"
                            className="bg-transparent border-none outline-none text-white placeholder-white/50 w-full text-base"
                            autoFocus
                        />
                    </div>

                    {/* App Grid */}
                    <div
                        className="grid grid-cols-7 gap-x-8 gap-y-12 max-w-5xl px-10"
                        onClick={e => e.stopPropagation()}
                    >
                        {filteredApps.map(app => (
                            <motion.div
                                key={app.id}
                                className="flex flex-col items-center gap-3 group cursor-pointer"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={(e) => {
                                    const rect = e.currentTarget.getBoundingClientRect();
                                    openWindow(app.id, app.name, {
                                        origin: {
                                            x: rect.left + rect.width / 2,
                                            y: rect.top + rect.height / 2,
                                            width: rect.width,
                                            height: rect.height
                                        }
                                    });
                                    onClose();
                                }}
                            >
                                <div className={clsx("w-20 h-20 rounded-[22px] flex items-center justify-center shadow-lg transition-transform border border-white/10", app.color)}>
                                    <app.icon className={clsx("w-12 h-12", app.color.includes('text-') ? "" : "text-white")} />
                                </div>
                                <span className="text-white font-medium text-sm tracking-wide text-shadow">
                                    {app.name}
                                </span>
                            </motion.div>
                        ))}
                    </div>

                    {/* Pagination Dots (Fake for now) */}
                    <div className="absolute bottom-10 flex gap-2">
                        <div className="w-2 h-2 rounded-full bg-white" />
                        <div className="w-2 h-2 rounded-full bg-white/30" />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
