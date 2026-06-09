import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Folder, FileText } from 'lucide-react';
import { useSpotlightSearch } from '../../hooks/useSpotlightSearch';
import clsx from 'clsx';

interface SpotlightProps {
    isOpen: boolean;
    onClose: () => void;
}

export const Spotlight: React.FC<SpotlightProps> = ({ isOpen, onClose }) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [query, setQuery] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);

    const results = useSpotlightSearch(query);
    const selectedResult = results[selectedIndex] || results[0];

    // Reset selection when query changes
    useEffect(() => {
        setSelectedIndex(0);
    }, [query]);

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 100);
            setQuery('');
            setSelectedIndex(0);
        }
    }, [isOpen]);

    // Close on click outside
    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) onClose();
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Escape') {
            onClose();
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex(prev => (prev < results.length - 1 ? prev + 1 : prev));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex(prev => (prev > 0 ? prev - 1 : prev));
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (selectedResult) {
                selectedResult.action();
                onClose();
            }
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="fixed inset-0 z-[6000] bg-black/20 backdrop-blur-sm flex justify-center items-start pt-[15vh]"
                    onClick={handleBackdropClick}
                >
                    <motion.div
                        initial={{ scale: 0.95, y: -20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.95, y: -20 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className={clsx(
                            "bg-white/80 dark:bg-[#1e1e1e]/80 backdrop-blur-xl rounded-xl shadow-2xl border border-white/40 dark:border-white/10 overflow-hidden flex flex-col transition-all duration-300",
                            query.trim() ? "w-[750px]" : "w-[650px]"
                        )}
                    >
                        {/* Search Bar */}
                        <div className="flex items-center px-4 h-16 border-b border-gray-400/10 dark:border-white/10 gap-3 shrink-0">
                            <Search size={24} className="text-gray-500 dark:text-gray-400" />
                            <input
                                ref={inputRef}
                                type="text"
                                className="flex-1 bg-transparent border-none outline-none text-2xl font-light text-gray-800 dark:text-white placeholder-gray-400"
                                placeholder="Spotlight Search"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onKeyDown={handleKeyDown}
                            />
                        </div>

                        {/* Two-Column Results View */}
                        {query.trim() && (
                            <div className="flex h-[400px]">
                                {/* Left Side: Result List */}
                                <div className="w-[40%] border-r border-gray-400/10 dark:border-white/10 overflow-y-auto py-2 flex flex-col">
                                    {results.length === 0 ? (
                                        <p className="text-gray-500 dark:text-gray-400 text-sm text-center mt-10">No results found</p>
                                    ) : (
                                        results.map((result, index) => (
                                            <div
                                                key={result.id}
                                                className={clsx(
                                                    "flex items-center gap-3 px-4 py-2 mx-2 rounded-lg cursor-pointer",
                                                    index === selectedIndex 
                                                        ? "bg-[#007AFF] text-white" 
                                                        : "hover:bg-black/5 dark:hover:bg-white/5 text-gray-800 dark:text-white"
                                                )}
                                                onClick={() => {
                                                    setSelectedIndex(index);
                                                    // Double click behavior mock
                                                    if (index === selectedIndex) {
                                                        result.action();
                                                        onClose();
                                                    }
                                                }}
                                            >
                                                {/* App icon mapping or generic file icon */}
                                                <div className="w-8 h-8 shrink-0 flex items-center justify-center">
                                                    {['safari', 'settings', 'terminal', 'calculator', 'calendar', 'notes', 'music', 'finder'].includes(result.icon) ? (
                                                        <img src={`/icons/${result.icon}.png`} alt={result.icon} className="w-8 h-8 drop-shadow-sm" onError={(e) => (e.currentTarget.style.display = 'none')} />
                                                    ) : result.icon === 'folder' ? (
                                                        <Folder className="w-6 h-6 text-blue-400 fill-blue-400/20" />
                                                    ) : (
                                                        <FileText className="w-6 h-6 text-gray-400" />
                                                    )}
                                                </div>
                                                <div className="flex flex-col overflow-hidden">
                                                    <span className="text-[13px] font-medium truncate leading-snug">{result.title}</span>
                                                    <span className={clsx("text-[11px] truncate leading-snug", index === selectedIndex ? "text-white/80" : "text-gray-500 dark:text-gray-400")}>
                                                        {result.subtitle}
                                                    </span>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>

                                {/* Right Side: Rich Preview Pane */}
                                <div className="w-[60%] bg-black/5 dark:bg-black/20 flex flex-col overflow-hidden relative">
                                    {selectedResult && (
                                        <div className="flex flex-col h-full w-full animate-fade-in p-6">
                                            {/* Top Preview Header */}
                                            <div className="flex flex-col items-center justify-center gap-3 mt-4 mb-8">
                                                <div className="w-24 h-24 drop-shadow-xl flex items-center justify-center mb-2">
                                                    {['safari', 'settings', 'terminal', 'calculator', 'calendar', 'notes', 'music', 'finder'].includes(selectedResult.icon) ? (
                                                        <img src={`/icons/${selectedResult.icon}.png`} alt={selectedResult.icon} className="w-24 h-24" onError={(e) => (e.currentTarget.style.display = 'none')} />
                                                    ) : selectedResult.icon === 'folder' ? (
                                                        <Folder className="w-20 h-20 text-blue-400 fill-blue-400/20" />
                                                    ) : (
                                                        <FileText className="w-20 h-20 text-gray-400" />
                                                    )}
                                                </div>
                                                <div className="text-center">
                                                    <h2 className="text-xl font-medium text-black dark:text-white">{selectedResult.title}</h2>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">{selectedResult.subtitle}</p>
                                                </div>
                                            </div>
                                            
                                            {/* Preview HTML Box */}
                                            {selectedResult.preview && (
                                                <div 
                                                    className="flex-1 bg-white/50 dark:bg-white/5 backdrop-blur-md rounded-xl border border-white/20 shadow-inner overflow-hidden"
                                                    dangerouslySetInnerHTML={{ __html: selectedResult.preview }}
                                                />
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
