import React from 'react';
import type { WidgetSize } from '../../../types/settings';

export const CalendarWidget: React.FC<{ size: WidgetSize }> = ({ size }) => {
    const today = new Date();
    const dayName = today.toLocaleDateString('en-US', { weekday: 'long' });
    const dayNameShort = today.toLocaleDateString('en-US', { weekday: 'short' });
    const monthName = today.toLocaleDateString('en-US', { month: 'short' });
    const date = today.getDate();

    const isMedium = size === 'medium' || size === 'large';
    const isLarge = size === 'large';

    // Mock calendar grid
    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1).getDay();
    const days = Array.from({ length: 35 }, (_, i) => {
        const d = i - firstDay + 1;
        return d > 0 && d <= daysInMonth ? d : '';
    });

    return (
        <div className="w-full h-full bg-white dark:bg-[#1e1e1e] flex flex-row relative overflow-hidden text-black dark:text-white">
            {/* Left/Small: Current Date */}
            <div className={`${isMedium ? 'w-[160px] border-r border-gray-200 dark:border-white/10' : 'w-full'} h-full flex flex-col relative`}>
                <div className="h-[40px] bg-[#FF3B30] flex items-center justify-center">
                    <span className="text-white text-[13px] font-bold tracking-wide uppercase">{dayName}</span>
                </div>
                
                <div className="flex-1 flex flex-col items-center justify-center pt-2">
                    <span className="text-[72px] font-light leading-none tracking-tighter -mt-4">{date}</span>
                </div>

                {!isLarge && (
                    <div className="absolute bottom-3 left-3 right-3">
                        <div className="w-full h-[4px] bg-[#FF3B30] rounded-full mb-1 opacity-20" />
                        <div className="text-[10px] text-gray-500 dark:text-gray-400 font-medium truncate">10:00 AM - Design Sync</div>
                    </div>
                )}
            </div>

            {/* Right/Medium: Month Grid */}
            {isMedium && (
                <div className="flex-1 p-4 flex flex-col">
                    <div className="text-red-500 font-bold text-xs uppercase mb-2">{monthName} {today.getFullYear()}</div>
                    <div className="grid grid-cols-7 gap-y-1 text-center">
                        {['S','M','T','W','T','F','S'].map((d, i) => (
                            <div key={i} className="text-[10px] font-semibold text-gray-400 mb-1">{d}</div>
                        ))}
                        {days.map((d, i) => (
                            <div key={i} className={`text-xs w-6 h-6 mx-auto flex items-center justify-center rounded-full ${d === date ? 'bg-red-500 text-white font-bold' : d ? 'hover:bg-gray-100 dark:hover:bg-white/10 cursor-pointer' : ''}`}>
                                {d}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Bottom/Large: Events List */}
            {isLarge && (
                <div className="absolute bottom-0 left-0 w-[160px] h-[180px] p-4 pt-0 flex flex-col gap-3">
                    <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider border-t border-gray-200 dark:border-white/10 pt-3">Up Next</span>
                    
                    <div className="flex flex-col gap-2">
                        <div className="relative pl-3">
                            <div className="absolute left-0 top-1 bottom-1 w-[3px] bg-blue-500 rounded-full" />
                            <div className="text-xs font-semibold truncate">Design Sync</div>
                            <div className="text-[10px] text-gray-500">10:00 AM - 11:30 AM</div>
                        </div>
                        <div className="relative pl-3">
                            <div className="absolute left-0 top-1 bottom-1 w-[3px] bg-purple-500 rounded-full" />
                            <div className="text-xs font-semibold truncate">Lunch with Sarah</div>
                            <div className="text-[10px] text-gray-500">12:30 PM - 1:30 PM</div>
                        </div>
                        <div className="relative pl-3">
                            <div className="absolute left-0 top-1 bottom-1 w-[3px] bg-green-500 rounded-full" />
                            <div className="text-xs font-semibold truncate">Product Review</div>
                            <div className="text-[10px] text-gray-500">3:00 PM - 4:00 PM</div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
