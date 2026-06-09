import React from 'react';
import { Wifi, Bluetooth, Sun, Moon, Volume2, Cast, Play, Rewind, FastForward, AppWindow, Copy, Contrast, Calculator, Timer, Camera } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import { useSettings } from '../../store/settings';

interface ControlCenterProps {
    isOpen: boolean;
    onClose: () => void;
}

// Reusable Widget Styles
const widgetBase = "bg-white/30 dark:bg-[#1a1a1a]/50 backdrop-blur-[40px] border border-white/30 dark:border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.12)] cursor-pointer";
const widgetHover = "hover:bg-white/40 dark:hover:bg-black/60 transition-colors duration-200";

const activeCircle = "bg-[#007AFF] text-white shadow-sm";
const inactiveCircle = "bg-black/10 dark:bg-white/20 text-black dark:text-white opacity-60";

const Slider = ({ value, onChange, iconLeft: IconLeft, iconRight: IconRight }: { value: number, onChange: (val: number) => void, iconLeft: any, iconRight: any }) => {
    const trackRef = React.useRef<HTMLDivElement>(null);

    const updateValue = (e: React.PointerEvent | PointerEvent) => {
        if (!trackRef.current) return;
        const rect = trackRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
        onChange(percentage);
    };

    const handlePointerDown = (e: React.PointerEvent) => {
        // Prevent container from triggering drag if we are dragging the slider
        e.stopPropagation();
        trackRef.current?.setPointerCapture(e.pointerId);
        updateValue(e);

        const handlePointerMove = (e: PointerEvent) => updateValue(e);
        const handlePointerUp = (e: PointerEvent) => {
            trackRef.current?.releasePointerCapture(e.pointerId);
            window.removeEventListener('pointermove', handlePointerMove);
            window.removeEventListener('pointerup', handlePointerUp);
        };

        window.addEventListener('pointermove', handlePointerMove);
        window.addEventListener('pointerup', handlePointerUp);
    };

    return (
        <div 
            ref={trackRef}
            onPointerDown={handlePointerDown}
            className="w-full h-[24px] bg-black/10 dark:bg-white/10 rounded-full relative group shadow-inner cursor-pointer"
        >
            <IconLeft size={12} strokeWidth={2.5} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 dark:text-gray-400 z-0" />
            <IconRight size={14} strokeWidth={2.5} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 dark:text-gray-400 z-0" />
            <div 
                className="absolute inset-y-0 left-0 bg-white dark:bg-[#E5E5E5] z-10 overflow-hidden rounded-full shadow-[1px_0_2px_rgba(0,0,0,0.15)]"
                style={{ width: `${value}%` }}
            >
                <IconLeft size={12} strokeWidth={2.5} className="absolute left-3 top-1/2 -translate-y-1/2 text-black z-20" />
            </div>
        </div>
    );
};

export const ControlCenter: React.FC<ControlCenterProps> = ({ isOpen, onClose }) => {
    const { 
        theme, setTheme, 
        wifi, toggleWifi, 
        bluetooth, toggleBluetooth, 
        brightness, setBrightness, 
        volume, setVolume, 
        focusMode, toggleFocusMode 
    } = useSettings();

    // Prevent closing when clicking inside the container
    const handleContainerClick = (e: React.MouseEvent) => e.stopPropagation();

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-[5000] bg-transparent" 
                        onClick={onClose} 
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: -20, filter: 'blur(10px)' }}
                        animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, scale: 0.8, y: -20, filter: 'blur(10px)' }}
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        style={{ transformOrigin: "top right" }}
                        className="fixed top-9 right-2 w-[290px] z-[5001] text-black dark:text-white flex flex-col gap-2 origin-top-right select-none"
                        onClick={handleContainerClick}
                    >
                        {/* Top Row: 2x2 Grid */}
                        <div className="grid grid-cols-2 gap-2 h-[120px]">
                            {/* Left: Network Block */}
                            <div className="flex flex-col gap-2">
                                <motion.div onClick={toggleWifi} whileTap={{ scale: 0.92 }} className={clsx("flex-1 rounded-[24px] flex items-center px-4 gap-3", widgetBase, widgetHover, wifi && "bg-white/40 dark:bg-white/20")}>
                                    <div className={clsx("w-[34px] h-[34px] rounded-full flex items-center justify-center shrink-0 transition-colors", wifi ? activeCircle : inactiveCircle)}>
                                        <Wifi size={16} />
                                    </div>
                                    <div className="flex flex-col overflow-hidden">
                                        <span className="text-[13px] font-semibold leading-tight">Wi-Fi</span>
                                        <span className="text-[10px] opacity-70 leading-tight">{wifi ? "Home" : "Off"}</span>
                                    </div>
                                </motion.div>
                                <div className="flex gap-2 h-[56px]">
                                    <motion.div onClick={toggleBluetooth} whileTap={{ scale: 0.92 }} className={clsx("flex-1 rounded-full flex items-center justify-center", widgetBase, widgetHover)}>
                                        <div className={clsx("w-[42px] h-[42px] rounded-full flex items-center justify-center transition-colors", bluetooth ? activeCircle : inactiveCircle)}>
                                            <Bluetooth size={20} />
                                        </div>
                                    </motion.div>
                                    <motion.div whileTap={{ scale: 0.92 }} className={clsx("flex-1 rounded-full flex items-center justify-center", widgetBase, widgetHover)}>
                                        <div className={clsx("w-[42px] h-[42px] rounded-full flex items-center justify-center transition-colors", activeCircle)}>
                                            <Cast size={20} />
                                        </div>
                                    </motion.div>
                                </div>
                            </div>

                            {/* Right: Now Playing Block */}
                            <motion.div whileTap={{ scale: 0.96 }} className={clsx("rounded-[24px] p-3 flex flex-col justify-between", widgetBase)}>
                                <div className="flex gap-2 items-center">
                                    <div className="w-[40px] h-[40px] rounded-lg bg-gradient-to-br from-red-500 to-orange-400 shadow-md flex-shrink-0 flex items-center justify-center overflow-hidden">
                                         <span className="text-[20px]">🌞</span>
                                    </div>
                                    <div className="flex flex-col overflow-hidden">
                                        <span className="text-[13px] font-semibold leading-tight truncate">Besties</span>
                                        <span className="text-[10px] opacity-70 leading-tight truncate w-[70px]">Black Country, N...</span>
                                    </div>
                                </div>
                                <div className="flex justify-evenly items-center mt-2 opacity-90">
                                    <Rewind size={18} fill="currentColor" className="hover:opacity-100 transition-opacity cursor-pointer" />
                                    <Play size={22} fill="currentColor" className="hover:opacity-100 transition-opacity cursor-pointer" />
                                    <FastForward size={18} fill="currentColor" className="hover:opacity-100 transition-opacity cursor-pointer" />
                                </div>
                            </motion.div>
                        </div>

                        {/* Middle Row: Focus & Toggles */}
                        <div className="grid grid-cols-[2fr_1fr_1fr] gap-2 h-[56px]">
                            <motion.div onClick={toggleFocusMode} whileTap={{ scale: 0.94 }} className={clsx("rounded-[28px] flex items-center px-4 gap-3", widgetBase, widgetHover, focusMode && "bg-indigo-500/20")}>
                                <div className={clsx("w-[32px] h-[32px] rounded-full flex items-center justify-center shrink-0 transition-colors", focusMode ? "bg-indigo-500 text-white" : inactiveCircle)}>
                                    <Moon size={16} fill="currentColor" />
                                </div>
                                <span className="text-[13px] font-semibold">Focus</span>
                            </motion.div>
                            
                            <motion.div whileTap={{ scale: 0.92 }} className={clsx("rounded-full flex items-center justify-center", widgetBase, widgetHover)}>
                                <AppWindow size={18} className="opacity-80" />
                            </motion.div>

                            <motion.div whileTap={{ scale: 0.92 }} className={clsx("rounded-full flex items-center justify-center", widgetBase, widgetHover)}>
                                <Copy size={18} className="opacity-80" />
                            </motion.div>
                        </div>

                        {/* Sliders Row 1: Display */}
                        <motion.div className={clsx("rounded-[28px] px-3 py-2 flex flex-col justify-center gap-1.5 h-[64px]", widgetBase)}>
                            <span className="text-[12px] font-semibold ml-1">Display</span>
                            <Slider value={brightness} onChange={setBrightness} iconLeft={Sun} iconRight={Sun} />
                        </motion.div>

                        {/* Sliders Row 2: Sound */}
                        <motion.div className={clsx("rounded-[28px] px-3 py-2 flex flex-col justify-center gap-1.5 h-[64px]", widgetBase)}>
                            <span className="text-[12px] font-semibold ml-1">Sound</span>
                            <div className="flex gap-2">
                                <div className="flex-1">
                                    <Slider value={volume} onChange={setVolume} iconLeft={Volume2} iconRight={Volume2} />
                                </div>
                                <motion.div whileTap={{ scale: 0.9 }} className="w-[24px] h-[24px] rounded-full bg-black/10 dark:bg-white/10 flex items-center justify-center shadow-inner shrink-0 hover:bg-black/20 dark:hover:bg-white/20 transition-colors cursor-pointer">
                                    <Cast size={12} className="opacity-80" />
                                </motion.div>
                            </div>
                        </motion.div>

                        {/* Bottom Row: Quick Actions */}
                        <div className="grid grid-cols-4 gap-2 h-[56px]">
                            <motion.div 
                                whileTap={{ scale: 0.92 }}
                                className={clsx("rounded-full flex items-center justify-center", widgetBase, widgetHover, theme === 'dark' && "bg-white/40 dark:bg-white/20")}
                                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                            >
                                <Contrast size={20} className={clsx(theme === 'dark' ? "text-black dark:text-white" : "opacity-80")} />
                            </motion.div>
                            <motion.div whileTap={{ scale: 0.92 }} className={clsx("rounded-full flex items-center justify-center", widgetBase, widgetHover)}>
                                <Calculator size={20} className="opacity-80" />
                            </motion.div>
                            <motion.div whileTap={{ scale: 0.92 }} className={clsx("rounded-full flex items-center justify-center", widgetBase, widgetHover)}>
                                <Timer size={20} className="opacity-80" />
                            </motion.div>
                            <motion.div whileTap={{ scale: 0.92 }} className={clsx("rounded-full flex items-center justify-center", widgetBase, widgetHover)}>
                                <Camera size={20} className="opacity-80" />
                            </motion.div>
                        </div>

                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
