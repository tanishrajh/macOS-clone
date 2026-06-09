import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSystem } from '../../store/system';
import { useWindowManager } from '../../store/window-manager';
import { useSettings } from '../../store/settings';
import { Sparkles, Mic, X } from 'lucide-react';

interface SiriProps {
    isOpen: boolean;
    onClose: () => void;
}

export const Siri: React.FC<SiriProps> = ({ isOpen, onClose }) => {
    const [query, setQuery] = useState('');
    const [response, setResponse] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    
    const { openWindow } = useWindowManager();
    const { setTheme, setVolume, setBrightness, toggleWifi } = useSettings();

    // Auto-focus input when opened
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 100);
        } else {
            setQuery('');
            setResponse('');
            setIsProcessing(false);
        }
    }, [isOpen]);

    const handleCommand = (cmd: string) => {
        const text = cmd.toLowerCase().trim();
        setIsProcessing(true);
        setResponse('');
        
        setTimeout(() => {
            let reply = "I'm sorry, I didn't quite catch that.";
            
            if (text.includes('open safari') || text.includes('browser')) {
                openWindow('safari', 'Safari');
                reply = 'Opening Safari...';
            } else if (text.includes('open settings') || text.includes('system preferences')) {
                openWindow('settings', 'System Settings');
                reply = 'Opening System Settings...';
            } else if (text.includes('dark mode')) {
                setTheme('dark');
                reply = 'Switched to Dark Mode.';
            } else if (text.includes('light mode')) {
                setTheme('light');
                reply = 'Switched to Light Mode.';
            } else if (text.includes('wifi') || text.includes('wi-fi')) {
                toggleWifi();
                reply = 'Toggled Wi-Fi state.';
            } else if (text.includes('volume')) {
                setVolume(50);
                reply = 'Adjusted the volume to 50%.';
            } else if (text.includes('hello') || text.includes('hi')) {
                reply = 'Hello! How can I help you today?';
            } else if (text.includes('time')) {
                reply = `It's currently ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
            } else if (text.includes('weather')) {
                reply = "It's 72°F and sunny right now. A beautiful day!";
            } else if (text !== '') {
                reply = `Here's what I found on the web for "${cmd}": I can't actually browse right now, but I would if I could!`;
            }

            setResponse(reply);
            setIsProcessing(false);
            
            if (reply.startsWith('Opening') || reply.startsWith('Switched') || reply.startsWith('Toggled')) {
                setTimeout(onClose, 1500);
            }
        }, 800);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop to close on click */}
                    <div className="fixed inset-0 z-[5999]" onClick={onClose} />
                    
                    {/* Siri Panel */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 10 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="fixed top-24 right-8 w-80 z-[6000] flex flex-col items-center select-none"
                    >
                        {/* The glowing orb / animation background */}
                        <div className="relative w-full max-w-sm rounded-[32px] overflow-hidden bg-black/40 dark:bg-black/60 backdrop-blur-3xl border border-white/20 shadow-2xl p-4">
                            
                            {/* Animated colorful gradient blob behind content */}
                            <motion.div 
                                animate={{ 
                                    rotate: [0, 360],
                                    scale: [1, 1.1, 1]
                                }}
                                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                                className="absolute -inset-10 opacity-30 blur-2xl z-0 pointer-events-none"
                                style={{
                                    background: 'conic-gradient(from 180deg at 50% 50%, #FF0000 0deg, #FF8A00 60deg, #FFE600 120deg, #14FF00 180deg, #00A3FF 240deg, #0500FF 300deg, #FF0000 360deg)'
                                }}
                            />

                            <div className="relative z-10 flex flex-col w-full h-full">
                                {/* Header */}
                                <div className="flex justify-between items-center mb-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center">
                                            <Sparkles size={12} className="text-white" />
                                        </div>
                                        <span className="text-white font-medium text-sm">Siri</span>
                                    </div>
                                    <button 
                                        className="w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                                        onClick={onClose}
                                    >
                                        <X size={14} />
                                    </button>
                                </div>

                                {/* Response Area */}
                                <div className="flex-1 min-h-[60px] flex flex-col justify-end pb-4 px-1">
                                    <AnimatePresence mode="wait">
                                        {isProcessing ? (
                                            <motion.div 
                                                key="processing"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                className="flex gap-1 items-center"
                                            >
                                                <div className="w-1.5 h-1.5 rounded-full bg-white animate-bounce" style={{ animationDelay: '0ms' }} />
                                                <div className="w-1.5 h-1.5 rounded-full bg-white animate-bounce" style={{ animationDelay: '150ms' }} />
                                                <div className="w-1.5 h-1.5 rounded-full bg-white animate-bounce" style={{ animationDelay: '300ms' }} />
                                            </motion.div>
                                        ) : response ? (
                                            <motion.div 
                                                key="response"
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="text-white font-medium text-[15px] leading-snug drop-shadow-md"
                                            >
                                                {response}
                                            </motion.div>
                                        ) : null}
                                    </AnimatePresence>
                                </div>

                                {/* Input Area */}
                                <div className="relative">
                                    <input 
                                        ref={inputRef}
                                        type="text"
                                        value={query}
                                        onChange={(e) => setQuery(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && query.trim()) {
                                                handleCommand(query);
                                            }
                                        }}
                                        placeholder="Type to Siri..."
                                        className="w-full bg-white/10 hover:bg-white/15 focus:bg-white/20 text-white placeholder-white/50 text-[15px] rounded-2xl px-4 py-3 outline-none transition-colors border border-white/10 focus:border-white/30 backdrop-blur-md"
                                    />
                                    <button 
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors"
                                        onClick={() => {
                                            if (query.trim()) handleCommand(query);
                                        }}
                                    >
                                        <Mic size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
