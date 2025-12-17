import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Loader2 } from 'lucide-react';
import { useSystem } from '../../store/system';
import { useSettings } from '../../store/settings';
import clsx from 'clsx';

export const LoginScreen: React.FC = () => {
    const { isLocked, setLocked, setSleeping } = useSystem();
    const { wallpaper } = useSettings();

    // Local state for UI
    const [password, setPassword] = useState('');
    const [isShake, setIsShake] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Handle Unlock
    const handleUnlock = async () => {
        if (isLoading) return;

        setIsLoading(true);

        // Fake network/decryption delay
        setTimeout(() => {
            // Simple validation: accept anything non-empty for now, or specific "password"
            if (password.trim().length > 0) {
                setLocked(false);
                setPassword('');
            } else {
                setIsShake(true);
                setTimeout(() => setIsShake(false), 500);
            }
            setIsLoading(false);
        }, 600);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleUnlock();
        }
    };

    const handleSleep = () => {
        setSleeping(true);
    };

    const handleRestart = () => {
        window.location.reload();
    };

    return (
        <AnimatePresence>
            {isLocked && (
                <motion.div
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.5, filter: 'blur(40px)' }}
                    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                    className="fixed inset-0 z-[10000] bg-cover bg-center flex flex-col items-center justify-center text-white overflow-hidden"
                    style={{ backgroundImage: `url(${wallpaper})` }}
                >
                    {/* Backdrop Blur Layer */}
                    <div className="absolute inset-0 backdrop-blur-xl bg-black/20" />

                    {/* Content */}
                    <div className="relative z-10 flex flex-col items-center gap-8 mt-[-100px]">

                        {/* Avatar */}
                        <div className="relative group">
                            <div className="w-[120px] h-[120px] rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center shadow-2xl overflow-hidden border-2 border-white/20">
                                {/* Placeholder Avatar or Real Image */}
                                <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-4xl font-semibold">
                                    T
                                </div>
                            </div>
                        </div>

                        {/* User Name */}
                        <h1 className="text-2xl font-semibold text-white tracking-wide text-shadow-lg drop-shadow-md">
                            Tanishraj H
                        </h1>

                        {/* Password Input */}
                        <motion.div
                            className="relative"
                            animate={isShake ? { x: [-10, 10, -10, 10, 0] } : {}}
                            transition={{ duration: 0.4 }}
                        >
                            <input
                                type="password"
                                placeholder="Enter Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                onKeyDown={handleKeyDown}
                                autoFocus
                                className="w-48 bg-white/20 backdrop-blur-md rounded-full px-4 py-1.5 text-sm text-white placeholder-white/50 outline-none border border-white/20 focus:bg-white/30 transition-all text-center tracking-widest shadow-lg"
                                disabled={isLoading}
                            />

                            {/* Unlock Button / Loader */}
                            <div
                                className={clsx(
                                    "absolute right-1 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center transition-all cursor-pointer hover:bg-white/20",
                                    password.length > 0 ? "opacity-100" : "opacity-0 pointer-events-none"
                                )}
                                onClick={handleUnlock}
                            >
                                {isLoading ? (
                                    <Loader2 size={14} className="animate-spin" />
                                ) : (
                                    <ArrowRight size={14} />
                                )}
                            </div>
                        </motion.div>

                        {/* Hint */}
                        <div className="text-xs text-white/60 font-medium mt-2">
                            Type anything to unlock
                        </div>
                    </div>

                    {/* Bottom Actions */}
                    <div className="absolute bottom-10 flex flex-col items-center gap-4 text-white/80">
                        <div className="flex gap-8 text-xs font-medium tracking-wide">
                            <div className="cursor-pointer hover:text-white transition-colors" onClick={handleSleep}>Sleep</div>
                            <div className="cursor-pointer hover:text-white transition-colors" onClick={handleRestart}>Restart</div>
                            <div className="cursor-pointer hover:text-white transition-colors" onClick={handleRestart}>Shut Down</div>
                        </div>
                    </div>

                </motion.div>
            )}
        </AnimatePresence>
    );
};
