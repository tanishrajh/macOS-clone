import React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import { FileIcon } from '../system/FileIcon';
import type { FileSystemNode } from '../../types/filesystem';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface DesktopStackProps {
    stackType: string;
    files: FileSystemNode[];
    x: number;
    y: number;
    isExpanded: boolean;
    onToggle: () => void;
    onOpenFile: (file: FileSystemNode) => void;
    onFileContextMenu: (e: React.MouseEvent, file: FileSystemNode) => void;
}

export const DesktopStack: React.FC<DesktopStackProps> = ({ 
    stackType, files, x, y, isExpanded, onToggle, onOpenFile, onFileContextMenu 
}) => {
    // Determine stack icon visually
    const iconType = files[0]?.type || 'file';

    return (
        <div style={{ position: 'absolute', left: x, top: y }}>
            {/* The Stack Trigger (Collapsed state) or the Stack Header (Expanded state) */}
            <motion.div 
                className="relative flex flex-col items-center justify-center w-24 gap-1 cursor-pointer group z-10"
                onClick={(e) => {
                    e.stopPropagation();
                    onToggle();
                }}
            >
                {/* Visual Stack Layers */}
                <div className="relative w-16 h-16 flex items-center justify-center">
                    {!isExpanded && files.slice(0, 3).reverse().map((f, i, arr) => (
                        <motion.div
                            key={`stack-layer-${f.id}`}
                            className="absolute"
                            style={{ 
                                zIndex: arr.length - i,
                                // Give it a slight rotation and scale to look like a stack
                                rotate: i === arr.length - 1 ? 0 : (i === 1 ? -4 : 4),
                                scale: 1 - ((arr.length - 1 - i) * 0.05),
                                y: -((arr.length - 1 - i) * 3)
                            }}
                        >
                            <FileIcon file={f} showLabel={false} />
                        </motion.div>
                    ))}

                    {/* Expanded Icon (Arrow indicator back to stack) */}
                    {isExpanded && (
                        <div className="w-16 h-16 flex flex-col items-center justify-center bg-white/20 dark:bg-black/40 backdrop-blur-md rounded-xl border border-white/30 shadow-inner">
                            <ChevronRight size={24} className="text-white" />
                        </div>
                    )}
                </div>

                {/* Stack Label */}
                <div className={clsx(
                    "px-2 py-0.5 rounded text-[12px] font-medium text-white max-w-full truncate shadow-sm",
                    "bg-black/30 backdrop-blur-md"
                )}>
                    {stackType}
                </div>
            </motion.div>

            {/* Fanned out files when expanded */}
            {isExpanded && (
                <div className="absolute top-0 left-24 flex items-start gap-4 p-2 z-0">
                    {files.map((file, i) => (
                        <motion.div
                            key={file.id}
                            initial={{ opacity: 0, x: -20, scale: 0.8 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: -20, scale: 0.8 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300, delay: i * 0.03 }}
                            className="flex flex-col items-center w-24 gap-1 cursor-pointer hover:bg-white/10 p-2 rounded-lg transition-colors"
                            onClick={(e) => {
                                e.stopPropagation();
                                onOpenFile(file);
                            }}
                            onContextMenu={(e) => onFileContextMenu(e, file)}
                        >
                            <div className="w-16 h-16 flex items-center justify-center">
                                <FileIcon file={file} showLabel={false} />
                            </div>
                            <div className="px-1.5 py-0.5 rounded text-[12px] font-medium text-white bg-black/30 backdrop-blur-md max-w-full line-clamp-2 text-center leading-tight">
                                {file.name}
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};
