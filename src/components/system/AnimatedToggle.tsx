import React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

interface AnimatedToggleProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
    className?: string;
}

export const AnimatedToggle: React.FC<AnimatedToggleProps> = ({ checked, onChange, className }) => {
    return (
        <div 
            className={clsx(
                "relative flex items-center w-10 h-6 rounded-full p-0.5 cursor-pointer transition-colors duration-300 shadow-inner",
                checked ? "bg-blue-500" : "bg-gray-300 dark:bg-gray-600",
                className
            )}
            onClick={() => onChange(!checked)}
        >
            <motion.div 
                className="w-5 h-5 bg-white rounded-full shadow-sm"
                layout
                transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 30
                }}
                style={{
                    marginLeft: checked ? "auto" : "0"
                }}
            />
        </div>
    );
};
