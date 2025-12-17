import React, { useEffect, useState } from 'react';
import { useWindowManager } from '../../store/window-manager';
// import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
// Icons
// Using a helper to get icons might be better, or just hardcode for now based on app ID.
import {
    LayoutGrid,
    Terminal as TerminalIcon,
    Settings,
    Calculator as CalcIcon,
    Calendar as CalendarIcon,
    FileText,
    Image as ImageIcon,
    MessageSquare,
    Music as MusicIcon,
    ListTodo,
    ShoppingBag,
    Activity as ActivityIcon,
    Mic,
    Globe
} from 'lucide-react';

const ICONS: Record<string, any> = {
    'finder': LayoutGrid,
    'safari': Globe,
    'terminal': TerminalIcon,
    'settings': Settings,
    'calculator': CalcIcon,
    'calendar': CalendarIcon,
    'notes': FileText,
    'textedit': FileText,
    'photos': ImageIcon,
    'messages': MessageSquare,
    'music': MusicIcon,
    'reminders': ListTodo,
    'appstore': ShoppingBag,
    'activity': ActivityIcon,
    'voicememos': Mic,
    'preview': ImageIcon
};

interface AppSwitcherProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (appId: string) => void;
}

export const AppSwitcher: React.FC<AppSwitcherProps> = ({ isOpen, onClose, onSelect }) => {
    const { windows } = useWindowManager();
    // Get list of unique open apps
    const openApps = Array.from(new Set(Object.values(windows).map(w => w.appId)));
    const [selectedIndex, setSelectedIndex] = useState(0);

    useEffect(() => {
        if (isOpen) {
            setSelectedIndex(0); // Reset or maintain? Usually second item is selected initially logic
            // Mac behavior: Pressed Cmd+Tab -> Shows list, selects 2nd item (previous app).
            // If only 1 app, selects it.
            if (openApps.length > 1) setSelectedIndex(1);
            else setSelectedIndex(0);
        }
    }, [isOpen]);

    // Handle cycling
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Tab') {
                e.preventDefault();
                setSelectedIndex(prev => (prev + 1) % openApps.length);
            }
            if (e.key === 'ArrowRight') {
                setSelectedIndex(prev => (prev + 1) % openApps.length);
            }
            if (e.key === 'ArrowLeft') {
                setSelectedIndex(prev => (prev - 1 + openApps.length) % openApps.length);
            }
            if (e.key === 'Enter' || e.key === ' ') {
                onSelect(openApps[selectedIndex]);
                onClose();
            }
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            // In real OS, releasing Cmd triggers selection. 
            // Here we might be using Alt+Tab or similar.
            // If we rely on a modifier key release, we need to know WHICH modifier.
            // For web, capturing modifier release reliably can be tricky if focus is lost, but usually is fine.
            if (e.key === 'Meta' || e.key === 'Alt' || e.key === 'Control') {
                const appId = openApps[selectedIndex];
                const winId = Object.keys(windows).find(k => windows[k].appId === appId);
                if (winId) onSelect(winId);
                onClose();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [isOpen, openApps, selectedIndex, onSelect, onClose]);

    if (!isOpen || openApps.length === 0) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none">
            <div className="bg-[#E5E5E5]/50 backdrop-blur-xl border border-white/20 p-4 rounded-2xl shadow-2xl flex items-center gap-4 max-w-[80vw] overflow-x-auto pointer-events-auto">
                {openApps.map((appId, i) => {
                    const Icon = ICONS[appId] || LayoutGrid;
                    return (
                        <div
                            key={appId}
                            className={clsx(
                                "flex flex-col items-center justify-center w-24 h-24 rounded-lg transition-all",
                                i === selectedIndex ? "bg-white/40 shadow-sm border border-white/20" : "opacity-80"
                            )}
                            onClick={() => {
                                // Find window ID
                                const winId = Object.keys(windows).find(k => windows[k].appId === appId);
                                if (winId) onSelect(winId); // Changed prop to expect window ID if possible, or handle here
                                onClose();
                            }}
                            onMouseEnter={() => setSelectedIndex(i)}
                        >
                            <div className="w-12 h-12 mb-2">
                                <Icon className="w-full h-full text-gray-800" />
                            </div>
                            <span className="text-xs font-medium text-gray-800 capitalize">
                                {appId}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
