import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Apple } from 'lucide-react';

interface BootSequenceProps {
    onComplete: () => void;
}

export const BootSequence: React.FC<BootSequenceProps> = ({ onComplete }) => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        // Simulate boot progress
        const timer = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(timer);
                    return 100;
                }
                // Random usage increments like real boot
                return prev + Math.random() * 15;
            });
        }, 500);

        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        if (progress >= 100) {
            const timeout = setTimeout(onComplete, 1000); // Small delay after 100%
            return () => clearTimeout(timeout);
        }
    }, [progress, onComplete]);

    return (
        <div className="fixed inset-0 bg-black z-[9999] flex flex-col items-center justify-center text-white cursor-none">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
            >
                <Apple size={80} fill="white" />
            </motion.div>

            <div className="mt-12 w-48 h-1.5 bg-[#444] rounded-full overflow-hidden">
                <motion.div
                    className="h-full bg-white rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ ease: "easeInOut" }}
                />
            </div>
        </div>
    );
};
