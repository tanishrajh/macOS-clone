import React from 'react';
import type { WidgetSize } from '../../../types/settings';
import { PencilLine, ListTodo, ImageIcon } from 'lucide-react';

export const NotesWidget: React.FC<{ size: WidgetSize }> = ({ size }) => {
    const isMedium = size === 'medium' || size === 'large';
    const isLarge = size === 'large';

    return (
        <div className="w-full h-full bg-[#FFECA1] dark:bg-[#6c5914] p-4 flex flex-col relative shadow-sm text-[#4a3b00] dark:text-[#ffeca1]">
            {/* Folder tab aesthetic */}
            <div className="absolute top-0 left-0 right-0 h-4 bg-[#FFDE59] dark:bg-[#52420b]" />
            
            <div className="mt-2 flex-1 flex flex-col">
                <div className="flex justify-between items-center mb-2">
                    <div className="font-bold text-[13px]">Grocery List</div>
                    {isMedium && (
                        <div className="flex gap-2 opacity-50">
                            <PencilLine size={14} />
                            <ListTodo size={14} />
                        </div>
                    )}
                </div>

                <div className={`flex-1 flex ${isMedium && !isLarge ? 'gap-6' : 'flex-col'}`}>
                    <ul className="text-[12px] space-y-1 font-medium leading-tight opacity-90 flex-1">
                        <li className="flex items-start gap-2"><div className="w-3 h-3 rounded border border-current opacity-50 mt-0.5" /> Oat milk</li>
                        <li className="flex items-start gap-2"><div className="w-3 h-3 rounded border border-current opacity-50 mt-0.5" /> Avocados (x4)</li>
                        <li className="flex items-start gap-2"><div className="w-3 h-3 bg-current rounded opacity-80 mt-0.5 relative"><svg className="absolute inset-0 text-[#FFECA1] dark:text-[#6c5914] p-[1px]" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" d="M20 6L9 17l-5-5"/></svg></div> Coffee beans</li>
                        <li className="flex items-start gap-2"><div className="w-3 h-3 rounded border border-current opacity-50 mt-0.5" /> Sourdough bread</li>
                        {(isMedium || isLarge) && (
                            <>
                                <li className="flex items-start gap-2"><div className="w-3 h-3 rounded border border-current opacity-50 mt-0.5" /> Cherry Tomatoes</li>
                                <li className="flex items-start gap-2"><div className="w-3 h-3 rounded border border-current opacity-50 mt-0.5" /> Fresh Basil</li>
                            </>
                        )}
                        {isLarge && (
                            <>
                                <li className="flex items-start gap-2"><div className="w-3 h-3 rounded border border-current opacity-50 mt-0.5" /> Olive Oil</li>
                                <li className="flex items-start gap-2"><div className="w-3 h-3 rounded border border-current opacity-50 mt-0.5" /> Balsamic Glaze</li>
                                <li className="flex items-start gap-2"><div className="w-3 h-3 rounded border border-current opacity-50 mt-0.5" /> Mozzarella</li>
                            </>
                        )}
                    </ul>

                    {isMedium && !isLarge && (
                        <div className="flex-1 border-l border-current/10 pl-6">
                            <div className="font-bold text-[13px] mb-2">Project Ideas</div>
                            <ul className="text-[12px] space-y-1 font-medium leading-tight opacity-90">
                                <li>• Resizable widgets</li>
                                <li>• Dynamic themes</li>
                                <li>• Grid snapping</li>
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
