import React, { useState } from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, addMonths, subMonths, isSameMonth, isSameDay, isToday } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import clsx from 'clsx';

export const CalendarWidget: React.FC = () => {
    const [currentDate, setCurrentDate] = useState(new Date());

    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const calendarDays = eachDayOfInterval({
        start: startDate,
        end: endDate,
    });

    const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

    const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
    const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));
    const jumpToToday = () => setCurrentDate(new Date());

    return (
        <div className="p-4" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="font-semibold text-lg cursor-pointer hover:bg-white/10 px-2 rounded transition-colors" onClick={jumpToToday}>
                    {format(currentDate, 'MMMM yyyy')}
                </div>
                <div className="flex gap-1">
                    <button onClick={prevMonth} className="p-1 hover:bg-white/10 rounded-full transition-colors">
                        <ChevronLeft size={16} />
                    </button>
                    <button onClick={nextMonth} className="p-1 hover:bg-white/10 rounded-full transition-colors">
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-7 gap-1 text-center text-sm">
                {/* Weekday Headers */}
                {weekDays.map(day => (
                    <div key={day} className="text-gray-500 font-medium text-xs py-1">
                        {day}
                    </div>
                ))}

                {/* Days */}
                {calendarDays.map((day, idx) => {
                    const isCurrentMonth = isSameMonth(day, monthStart);
                    const isSelected = isSameDay(day, new Date()); // Hightlight *actual* today separate from selected logic if needed? 
                    // Actually usually systems highlight TODAY specially.

                    return (
                        <div
                            key={day.toString()}
                            className={clsx(
                                "h-8 w-8 flex items-center justify-center rounded-full text-sm font-medium transition-all relative",
                                !isCurrentMonth && "text-gray-500/50",
                                isCurrentMonth && "text-gray-200",
                                isToday(day) && "bg-red-500 text-white font-bold shadow-md", // macOS uses red for Today
                                !isToday(day) && "hover:bg-white/10 cursor-default"
                            )}
                        >
                            {format(day, 'd')}
                        </div>
                    );
                })}
            </div>

            {/* Notification Placeholder (Optional, adds "Notification Center" feel) */}
            <div className="mt-6 border-t border-white/10 pt-4">
                <div className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wider">Notifications</div>
                <div className="text-sm text-gray-400 text-center py-8 italic">
                    No new notifications
                </div>
            </div>
        </div>
    );
};
