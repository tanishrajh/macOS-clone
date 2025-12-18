import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import { X, AlertTriangle, Info, FileText } from 'lucide-react';

interface DialogProps {
    open: boolean;
    onClose: () => void;
    title: string;
    description?: string;
    type?: 'info' | 'danger' | 'input';
    icon?: React.FC<any>;
    children?: React.ReactNode;
    primaryAction?: {
        label: string;
        onClick: () => void;
        danger?: boolean;
    };
    secondaryAction?: {
        label: string;
        onClick: () => void;
    };
}

export const Dialog: React.FC<DialogProps> = ({
    open, onClose, title, description, type = 'info', icon: Icon, children, primaryAction, secondaryAction
}) => {
    return (
        <AnimatePresence>
            {open && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/20 backdrop-blur-sm"
                        onClick={onClose}
                    />

                    {/* Dialog Window */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 0 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        className="fixed z-[101] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 bg-[#F5F5F7] dark:bg-[#2c2c2e] rounded-xl shadow-2xl border border-white/20 overflow-hidden"
                    >
                        {/* Header/Icon Area */}
                        <div className="flex flex-col items-center pt-6 pb-4 px-6 text-center">
                            {Icon ? (
                                <Icon size={48} className="mb-4 text-blue-500" />
                            ) : type === 'danger' ? (
                                <AlertTriangle size={48} className="mb-4 text-yellow-500" />
                            ) : type === 'info' ? (
                                <Info size={48} className="mb-4 text-blue-500" />
                            ) : (
                                <div className="w-12 h-12 mb-4" />
                            )}

                            <h3 className="text-sm font-bold text-black dark:text-white mb-2">{title}</h3>
                            {description && <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{description}</p>}
                        </div>

                        {/* Content (Inputs, etc.) */}
                        {children && (
                            <div className="px-6 pb-4">
                                {children}
                            </div>
                        )}

                        {/* Buttons (macOS Style: Full width or split) */}
                        {/* Actually modern macOS usually has buttons on bottom right or full width stack. Let's do bottom bar. */}
                        <div className="flex border-t border-gray-300 dark:border-white/10 divide-x divide-gray-300 dark:divide-white/10">
                            {secondaryAction && (
                                <button
                                    className="flex-1 py-3 text-xs font-medium text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/5 active:bg-black/10 transition-colors"
                                    onClick={secondaryAction.onClick}
                                >
                                    {secondaryAction.label}
                                </button>
                            )}
                            {primaryAction && (
                                <button
                                    className={clsx(
                                        "flex-1 py-3 text-xs font-bold hover:bg-black/5 dark:hover:bg-white/5 active:bg-black/10 transition-colors",
                                        primaryAction.danger ? "text-red-500" : "text-blue-500"
                                    )}
                                    onClick={primaryAction.onClick}
                                >
                                    {primaryAction.label}
                                </button>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
