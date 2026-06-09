import React from 'react';
import { motion, useMotionValue, animate } from 'framer-motion';
import { useSettings } from '../../../store/settings';
import { useSettings } from '../../../store/settings';
import { useWidgetManager } from '../../../store/widget-manager';
import { useWindowManager } from '../../../store/window-manager';
import { Maximize2 } from 'lucide-react';
import type { WidgetSize } from '../../../store/widget-manager';

interface WidgetContainerProps {
    id: string;
    initialX: number;
    initialY: number;
    size: WidgetSize;
    onContextMenu?: (e: React.MouseEvent) => void;
    children: React.ReactNode;
}

export const WidgetContainer: React.FC<WidgetContainerProps> = ({ id, initialX, initialY, size, onContextMenu, children }) => {
    const { updateWidgetPosition, updateWidgetSize, removeWidget } = useWidgetManager();
    const { activeWindowId, isMissionControlOpen } = useWindowManager();
    const x = useMotionValue(initialX);
    const y = useMotionValue(initialY);
    const [isHovered, setIsHovered] = React.useState(false);

    const isDimmed = activeWindowId !== null && !isMissionControlOpen;

    return (
        <motion.div
            drag
            dragMomentum={false}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ 
                opacity: isMissionControlOpen ? 0 : 1, 
                scale: isMissionControlOpen ? 0.8 : 1,
                filter: isDimmed && !isHovered ? 'grayscale(100%) opacity(60%) blur(1px)' : 'grayscale(0%) opacity(100%) blur(0px)'
            }}
            exit={{ opacity: 0, scale: 0.8 }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            transition={{ filter: { duration: 0.3 } }}
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
