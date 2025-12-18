import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import { ChevronRight } from 'lucide-react';

export interface ContextMenuItem {
    label?: string;
    action?: () => void;
    disabled?: boolean;
    separator?: boolean;
    danger?: boolean;
    icon?: React.FC<any>;
    submenu?: ContextMenuItem[];
}

interface ContextMenuProps {
    x: number;
    y: number;
    items: ContextMenuItem[];
    onClose: () => void;
    className?: string;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({ x, y, items, onClose, className }) => {
    const ref = useRef<HTMLDivElement>(null);

    console.log('ContextMenu: Rendering at', x, y, items);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                onClose();
            }
        };

        const handleRightClickOutside = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                onClose();
            }
        };

        const timer = setTimeout(() => {
            window.addEventListener('click', handleClickOutside);
            window.addEventListener('contextmenu', handleRightClickOutside);
        }, 50);

        return () => {
            clearTimeout(timer);
            window.removeEventListener('click', handleClickOutside);
            window.removeEventListener('contextmenu', handleRightClickOutside);
        };
    }, [onClose]);

    // Adjust position if out of bounds (simplified)
    const style = {
        top: y,
        left: x,
    };

    return createPortal(
        <AnimatePresence>
            <motion.div
                ref={ref}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.1 }}
                style={style}
                className={clsx("fixed z-[99999] min-w-[200px] bg-white/60 dark:bg-[#2c2c2e]/60 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-lg shadow-2xl py-1.5 flex flex-col text-[13px] font-medium text-black dark:text-white select-none", className)}
                onContextMenu={(e) => e.preventDefault()}
            >
                {items.map((item, index) => {
                    if (item.separator) {
                        return <div key={index} className="h-px bg-gray-400/20 my-1 mx-3" />;
                    }

                    return (
                        <div
                            key={index}
                            className={clsx(
                                "px-3 py-1 mx-1.5 rounded flex items-center justify-between cursor-default transition-colors",
                                item.disabled
                                    ? "opacity-50 cursor-not-allowed"
                                    : "hover:bg-blue-500 hover:text-white",
                                item.danger && !item.disabled && "text-red-500 hover:text-white"
                            )}
                            onClick={() => {
                                if (!item.disabled && item.action) {
                                    item.action();
                                    onClose();
                                }
                            }}
                        >
                            <div className="flex items-center gap-2">
                                {item.icon && <item.icon size={14} />}
                                <span>{item.label}</span>
                            </div>
                            {item.submenu && <ChevronRight size={12} />}
                        </div>
                    );
                })}
            </motion.div>
        </AnimatePresence>,
        document.body
    );
};
