import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, isToday } from 'date-fns';
import clsx from 'clsx';

export const Calendar: React.FC = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());

    const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
    const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const dateFormat = "d";
    const days = eachDayOfInterval({ start: startDate, end: endDate });

    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
        <div className="flex h-full w-full bg-white dark:bg-[#1c1c1c] text-black dark:text-gray-100 font-sans transition-colors duration-300">
            {/* Sim sidebar */}
            <div className="w-1/4 bg-[#F5F5F7] dark:bg-[#2c2c2e] border-r border-gray-200 dark:border-white/10 hidden md:flex flex-col p-4">
                <div className="text-xl font-bold mb-4">{format(new Date(), 'MMMM yyyy')}</div>
                <div className="grid grid-cols-7 gap-y-2 text-xs text-center text-gray-500 mb-2">
                    {weekDays.map(d => <span key={d}>{d[0]}</span>)}
                </div>
                {/* Mini Calendar placeholder */}
                <div className="flex-1"></div>
            </div>

            {/* Main View */}
            <div className="flex-1 flex flex-col">
                <div className="h-12 border-b border-gray-200 dark:border-white/10 flex items-center justify-between px-4 bg-white dark:bg-[#1c1c1c]">
                    <div className="text-lg font-bold">{format(currentDate, 'MMMM yyyy')}</div>
                    <div className="flex gap-2">
                        <button onClick={prevMonth} className="p-1 hover:bg-gray-100 rounded-md"><ChevronLeft size={20} /></button>
                        <button onClick={() => setCurrentDate(new Date())} className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-md text-sm font-medium">Today</button>
                        <button onClick={nextMonth} className="p-1 hover:bg-gray-100 rounded-md"><ChevronRight size={20} /></button>
                    </div>
                </div>

                <div className="flex-1 grid grid-cols-7 grid-rows-6">
                    {/* Header */}
                    {weekDays.map(day => (
                        <div key={day} className="h-8 border-b border-r border-gray-100 dark:border-white/5 flex items-center justify-end px-2 text-xs text-gray-500 dark:text-gray-400 font-medium uppercase sticky top-0 bg-white dark:bg-[#1c1c1c]">
                            {day}
                        </div>
                    ))}

                    {days.map((day) => (
                        <div
                            key={day.toString()}
                            className={clsx(
                                "border-b border-r border-gray-100 dark:border-white/5 p-1 min-h-[80px] hover:bg-gray-50 dark:hover:bg-white/10 transition-colors cursor-default relative group",
                                !isSameMonth(day, monthStart) && "bg-gray-50/50 dark:bg-black/20 text-gray-400 dark:text-gray-600"
                            )}
                            onClick={() => setSelectedDate(day)}
                        >
                            <span className={clsx(
                                "w-6 h-6 flex items-center justify-center rounded-full text-sm font-medium",
                                isToday(day) ? "bg-red-500 text-white" :
                                    isSameDay(day, selectedDate) ? "bg-black text-white" : ""
                            )}>
                                {format(day, dateFormat)}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
