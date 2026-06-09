import React from 'react';
import { motion, useMotionValue, animate } from 'framer-motion';
import { useSettings } from '../../../store/settings';
import { Maximize2 } from 'lucide-react';
import type { WidgetSize } from '../../../types/settings';

interface WidgetContainerProps {
    id: string;
    initialX: number;
    initialY: number;
    size: WidgetSize;
    onContextMenu?: (e: React.MouseEvent) => void;
    children: React.ReactNode;
}

export const WidgetContainer: React.FC<WidgetContainerProps> = ({ id, initialX, initialY, size, onContextMenu, children }) => {
    const { updateWidgetPosition, updateWidgetSize, removeWidget } = useSettings();
    const x = useMotionValue(initialX);
    const y = useMotionValue(initialY);

    return (
        <motion.div
            drag
            dragMomentum={false}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onDragEnd={() => {
                const currentX = x.get();
                const currentY = y.get();
                
                // Snap to a 180px grid (160px widget size + 20px gap) with screen padding
                const GRID_SIZE = 180;
                const PADDING_X = 20;
                const PADDING_Y = 44; // 36px menu bar + 8px padding
                
                const snappedX = Math.round((currentX - PADDING_X) / GRID_SIZE) * GRID_SIZE + PADDING_X;
                const snappedY = Math.round((currentY - PADDING_Y) / GRID_SIZE) * GRID_SIZE + PADDING_Y;

                // Smooth bouncy animation to snapped position
                animate(x, snappedX, { type: "spring", stiffness: 400, damping: 25 });
                animate(y, snappedY, { type: "spring", stiffness: 400, damping: 25 });

                // Save persistent position on drop
                updateWidgetPosition(id, snappedX, snappedY);
            }}
            style={{ 
                x, y, 
                position: 'absolute', 
                top: 0, left: 0, zIndex: 5,
                width: size === 'medium' || size === 'large' ? 340 : 160,
                height: size === 'large' ? 340 : 160
            }}
            className="group cursor-grab active:cursor-grabbing rounded-[24px] bg-white/30 dark:bg-black/30 backdrop-blur-[40px] border border-white/40 dark:border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.12)] overflow-hidden"
            onPointerDown={(e) => {
                // Prevent desktop icons from unselecting, using bubble phase instead of capture so drag still works
                e.stopPropagation();
            }}
            onContextMenu={onContextMenu}
        >
            {/* Hover Controls */}
            <motion.div
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                className="absolute top-3 left-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-50"
            >
                {/* Delete Button */}
                <div
                    className="w-6 h-6 rounded-full bg-white/50 dark:bg-black/50 text-black dark:text-white flex items-center justify-center text-xs hover:bg-red-500 hover:text-white cursor-pointer shadow-sm"
                    onClick={(e) => {
                        e.stopPropagation();
                        removeWidget(id);
                    }}
                >
                    ✕
                </div>
                {/* Resize Button */}
                <div
                    className="w-6 h-6 rounded-full bg-white/50 dark:bg-black/50 text-black dark:text-white flex items-center justify-center text-xs hover:bg-blue-500 hover:text-white cursor-pointer shadow-sm"
                    onClick={(e) => {
                        e.stopPropagation();
                        const nextSize = size === 'small' ? 'medium' : size === 'medium' ? 'large' : 'small';
                        updateWidgetSize(id, nextSize);
                    }}
                >
                    <Maximize2 size={12} />
                </div>
            </motion.div>
            <div className="pointer-events-none w-full h-full">
                {children}
            </div>
        </motion.div>
    );
};
