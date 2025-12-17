import React, { useState } from 'react';
import { Search, Plus, Calendar, Flag, Inbox, List } from 'lucide-react';
import clsx from 'clsx';

interface Reminder {
    id: string;
    text: string;
    completed: boolean;
    list: string;
    dueDate?: string;
}

export const Reminders: React.FC = () => {
    const [reminders, setReminders] = useState<Reminder[]>([
        { id: '1', text: 'Finish macOS Clone', completed: false, list: 'Reminders' },
        { id: '2', text: 'Buy groceries', completed: false, list: 'Reminders' },
        { id: '3', text: 'Call mom', completed: true, list: 'Personal' },
        { id: '4', text: 'Meeting with Tim', completed: false, list: 'Work', dueDate: 'Today' },
    ]);
    const [activeList, setActiveList] = useState('Reminders');
    const [newReminderText, setNewReminderText] = useState('');

    const toggleReminder = (id: string) => {
        setReminders(prev => prev.map(r => r.id === id ? { ...r, completed: !r.completed } : r));
    };

    const addReminder = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newReminderText.trim()) return;
        setReminders(prev => [...prev, {
            id: Date.now().toString(),
            text: newReminderText,
            completed: false,
            list: activeList === 'Today' || activeList === 'Scheduled' || activeList === 'All' ? 'Reminders' : activeList
        }]);
        setNewReminderText('');
    };

    const filteredReminders = reminders.filter(r => {
        if (activeList === 'All') return true;
        if (activeList === 'Today') return r.dueDate === 'Today';
        if (activeList === 'Scheduled') return !!r.dueDate;
        if (activeList === 'Flagged') return false; // Not impl
        return r.list === activeList;
    }).sort((a, b) => (a.completed === b.completed ? 0 : a.completed ? 1 : -1));

    return (
        <div className="flex w-full h-full bg-white dark:bg-[#1c1c1c] text-black dark:text-gray-100 font-sans transition-colors duration-300">
            {/* Sidebar */}
            <div className="w-64 bg-[#F5F5F7] dark:bg-[#2c2c2e] flex flex-col border-r border-gray-200 dark:border-white/10">
                <div className="p-3">
                    <div className="relative mb-4">
                        <Search className="absolute left-2 top-1.5 text-gray-400 w-4 h-4" />
                        <input className="w-full bg-[#E3E3E8] rounded-md pl-8 pr-2 py-1 text-sm outline-none placeholder-gray-500" placeholder="Search" />
                    </div>

                    <div className="grid grid-cols-2 gap-2 mb-6">
                        <div className={clsx("bg-white dark:bg-[#3a3a3c] rounded-lg p-2 shadow-sm cursor-pointer", activeList === 'Today' && "ring-2 ring-blue-500")} onClick={() => setActiveList('Today')}>
                            <div className="flex justify-between items-start mb-1">
                                <div className="p-1.5 bg-blue-500 rounded-full text-white"><Calendar size={14} /></div>
                                <span className="text-xl font-bold">{reminders.filter(r => r.dueDate === 'Today' && !r.completed).length}</span>
                            </div>
                            <div className="text-gray-500 text-xs font-semibold">Today</div>
                        </div>
                        <div className={clsx("bg-white dark:bg-[#3a3a3c] rounded-lg p-2 shadow-sm cursor-pointer", activeList === 'Scheduled' && "ring-2 ring-blue-500")} onClick={() => setActiveList('Scheduled')}>
                            <div className="flex justify-between items-start mb-1">
                                <div className="p-1.5 bg-red-500 rounded-full text-white"><Calendar size={14} /></div>
                                <span className="text-xl font-bold">{reminders.filter(r => !!r.dueDate && !r.completed).length}</span>
                            </div>
                            <div className="text-gray-500 text-xs font-semibold">Scheduled</div>
                        </div>
                        <div className={clsx("bg-white dark:bg-[#3a3a3c] rounded-lg p-2 shadow-sm cursor-pointer", activeList === 'All' && "ring-2 ring-blue-500")} onClick={() => setActiveList('All')}>
                            <div className="flex justify-between items-start mb-1">
                                <div className="p-1.5 bg-gray-500 rounded-full text-white"><Inbox size={14} /></div>
                                <span className="text-xl font-bold">{reminders.filter(r => !r.completed).length}</span>
                            </div>
                            <div className="text-gray-500 text-xs font-semibold">All</div>
                        </div>
                        <div className={clsx("bg-white dark:bg-[#3a3a3c] rounded-lg p-2 shadow-sm cursor-pointer", activeList === 'Flagged' && "ring-2 ring-blue-500")} onClick={() => setActiveList('Flagged')}>
                            <div className="flex justify-between items-start mb-1">
                                <div className="p-1.5 bg-orange-500 rounded-full text-white"><Flag size={14} /></div>
                                <span className="text-xl font-bold">0</span>
                            </div>
                            <div className="text-gray-500 text-xs font-semibold">Flagged</div>
                        </div>
                    </div>

                    <div className="text-xs font-bold text-gray-400 mb-2 px-2">My Lists</div>
                    <div
                        className={clsx("flex items-center gap-3 px-2 py-1.5 rounded-md cursor-pointer", activeList === 'Reminders' ? "bg-[#d1d1d6] dark:bg-white/20" : "hover:bg-black/5 dark:hover:bg-white/10")}
                        onClick={() => setActiveList('Reminders')}
                    >
                        <div className="p-1.5 bg-blue-500 rounded-full text-white"><List size={12} /></div>
                        <span className="text-sm font-medium">Reminders</span>
                        <span className="ml-auto text-gray-500 text-sm">{reminders.filter(r => r.list === 'Reminders' && !r.completed).length}</span>
                    </div>
                    <div
                        className={clsx("flex items-center gap-3 px-2 py-1.5 rounded-md cursor-pointer", activeList === 'Work' ? "bg-[#d1d1d6] dark:bg-white/20" : "hover:bg-black/5 dark:hover:bg-white/10")}
                        onClick={() => setActiveList('Work')}
                    >
                        <div className="p-1.5 bg-yellow-500 rounded-full text-white"><List size={12} /></div>
                        <span className="text-sm font-medium">Work</span>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 bg-white dark:bg-[#1c1c1c] flex flex-col">
                <div className="h-16 flex items-end px-8 pb-2 justify-between">
                    <h1 className="text-3xl font-bold text-blue-500">{activeList}</h1>
                    <button className="text-blue-500 font-medium text-sm hover:bg-blue-50 px-2 py-1 rounded">Edit</button>
                </div>

                <div className="flex-1 overflow-y-auto px-8 py-4">
                    {filteredReminders.map(r => (
                        <div key={r.id} className="flex items-start gap-3 py-2 border-b border-gray-100 dark:border-white/10 group">
                            <div
                                className={clsx(
                                    "w-5 h-5 rounded-full border-2 cursor-pointer mt-0.5 flex items-center justify-center transition-colors",
                                    r.completed ? "bg-blue-500 border-blue-500" : "border-gray-300 hover:border-blue-500"
                                )}
                                onClick={() => toggleReminder(r.id)}
                            >
                                {r.completed && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
                            </div>
                            <div className={clsx("flex-1 text-base", r.completed && "text-gray-400")}>
                                {r.text}
                                {r.dueDate && <div className="text-xs text-gray-400 mt-0.5">{r.dueDate}</div>}
                            </div>
                        </div>
                    ))}

                    <form onSubmit={addReminder} className="flex items-center gap-3 py-2 text-gray-400 hover:text-gray-600 cursor-text group" onClick={(e) => e.currentTarget.querySelector('input')?.focus()}>
                        <Plus className="w-5 h-5" />
                        <input
                            className="flex-1 outline-none text-base placeholder-gray-400 text-black dark:text-white bg-transparent"
                            placeholder="New Reminder"
                            value={newReminderText}
                            onChange={(e) => setNewReminderText(e.target.value)}
                        />
                    </form>
                </div>
            </div>
        </div>
    );
};
