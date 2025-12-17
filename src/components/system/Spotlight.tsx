import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search } from 'lucide-react';

interface SpotlightProps {
    isOpen: boolean;
    onClose: () => void;
}

export const Spotlight: React.FC<SpotlightProps> = ({ isOpen, onClose }) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [query, setQuery] = useState('');

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 100);
            setQuery('');
        }
    }, [isOpen]);

    // Close on click outside
    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="fixed inset-0 z-[6000] bg-black/20 backdrop-blur-sm flex justify-center items-start pt-[20vh]"
                    onClick={handleBackdropClick}
                >
                    <motion.div
                        initial={{ scale: 0.95, y: -20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.95, y: -20 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="w-[600px] bg-white/80 dark:bg-[#1e1e1e]/80 backdrop-blur-xl rounded-xl shadow-2xl border border-white/40 dark:border-white/10 overflow-hidden flex flex-col"
                    >
                        <div className="flex items-center px-4 h-16 border-b border-gray-400/10 dark:border-white/10 gap-3">
                            <Search size={24} className="text-gray-500 dark:text-gray-400" />
                            <input
                                ref={inputRef}
                                type="text"
                                className="flex-1 bg-transparent border-none outline-none text-2xl font-light text-gray-800 dark:text-white placeholder-gray-400"
                                placeholder="Spotlight Search"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onKeyDown={(e) => e.key === 'Escape' && onClose()}
                            />
                        </div>

                        {query && (
                            <div className="p-4 h-64 overflow-y-auto">
                                <p className="text-gray-500 dark:text-gray-400 text-sm text-center mt-10">No results found (Simulation)</p>
                            </div>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
