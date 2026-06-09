import { motion, AnimatePresence } from 'framer-motion';
import { useWidgetManager, WidgetType } from '../../store/widget-manager';
import { ClockWidget } from './widgets/ClockWidget';
import { WeatherWidget } from './widgets/WeatherWidget';
import { CalendarWidget } from './widgets/CalendarWidget';
import { BatteryWidget } from './widgets/BatteryWidget';
import { NotesWidget } from './widgets/NotesWidget';
import { X, Plus } from 'lucide-react';

const WIDGET_OPTIONS: { type: WidgetType; name: string; component: React.ReactNode }[] = [
    { type: 'clock', name: 'Clock', component: <ClockWidget size="small" /> },
    { type: 'weather', name: 'Weather', component: <WeatherWidget size="small" /> },
    { type: 'calendar', name: 'Calendar', component: <CalendarWidget size="small" /> },
    { type: 'battery', name: 'Battery', component: <BatteryWidget size="small" /> },
    { type: 'notes', name: 'Notes', component: <NotesWidget size="small" /> }
];

export const WidgetGallery = () => {
    const { isWidgetGalleryOpen, toggleWidgetGallery, addWidget } = useWidgetManager();

    if (!isWidgetGalleryOpen) return null;

    return (
        <AnimatePresence>
            {isWidgetGalleryOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div 
                        className="absolute inset-0 z-[150] bg-black/20 backdrop-blur-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => toggleWidgetGallery(false)}
                    />
                    
                    {/* Sidebar Panel */}
                    <motion.div 
                        className="absolute top-0 right-0 bottom-0 w-80 bg-white/70 dark:bg-black/70 backdrop-blur-3xl shadow-2xl z-[160] flex flex-col border-l border-white/20 dark:border-white/10"
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    >
                        <div className="flex justify-between items-center p-6 border-b border-black/10 dark:border-white/10">
                            <h2 className="text-xl font-semibold">Widgets</h2>
                            <button 
                                className="p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
                                onClick={() => toggleWidgetGallery(false)}
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-hide">
                            {WIDGET_OPTIONS.map((option) => (
                                <div key={option.type} className="flex flex-col gap-3">
                                    <span className="font-medium opacity-80">{option.name}</span>
                                    <div className="relative group w-40 h-40 self-center">
                                        {/* Widget Preview */}
                                        <div className="w-full h-full pointer-events-none scale-100 origin-center">
                                            {option.component}
                                        </div>
                                        
                                        {/* Add Overlay */}
                                        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <motion.button 
                                                className="w-10 h-10 bg-green-500 rounded-full text-white flex items-center justify-center shadow-lg"
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={() => {
                                                    // Drop it somewhere in the center
                                                    const screenW = window.innerWidth;
                                                    const screenH = window.innerHeight;
                                                    addWidget(option.type, screenW / 2 - 80, screenH / 2 - 80);
                                                }}
                                            >
                                                <Plus size={24} />
                                            </motion.button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
