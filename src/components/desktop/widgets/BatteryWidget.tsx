import React from 'react';
import { BatteryMedium, Zap } from 'lucide-react';
import type { WidgetSize } from '../../../types/settings';

export const BatteryWidget: React.FC<{ size: WidgetSize }> = ({ size }) => {
    // macOS battery green
    const color = "#34C759";
    const level = 84;
    
    const isMedium = size === 'medium' || size === 'large';
    const isLarge = size === 'large';

    const ringSize = isLarge ? 200 : 110;
    const ringRadius = isLarge ? 85 : 45;
    const ringCenter = ringSize / 2;
    const strokeDasharray = `${(level / 100) * (2 * Math.PI * ringRadius)} ${2 * Math.PI * ringRadius}`;

    return (
        <div className="w-full h-full bg-white/10 dark:bg-white/5 flex flex-col relative p-4 overflow-hidden">
            <div className={`flex flex-1 ${isMedium && !isLarge ? 'flex-row items-center gap-6' : 'flex-col items-center justify-center'}`}>
                {/* Battery Ring */}
                <div className="relative flex items-center justify-center shrink-0" style={{ width: ringSize, height: ringSize }}>
                    {/* Background Ring */}
                    <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                        <circle cx={ringCenter} cy={ringCenter} r={ringRadius} stroke="currentColor" strokeWidth={isLarge ? 14 : 10} fill="transparent" className="text-black/10 dark:text-white/10" />
                        {/* Progress Ring */}
                        <circle cx={ringCenter} cy={ringCenter} r={ringRadius} stroke={color} strokeWidth={isLarge ? 14 : 10} fill="transparent" strokeDasharray={strokeDasharray} strokeLinecap="round" className="transition-all duration-1000 ease-out" />
                    </svg>

                    {/* Inner Icon */}
                    <div className="flex flex-col items-center z-10 text-black dark:text-white mt-1">
                        <BatteryMedium size={isLarge ? 48 : 28} className="text-[#34C759]" />
                        <span className={`${isLarge ? 'text-[36px]' : 'text-[20px]'} font-bold mt-1 tracking-tight`}>{level}%</span>
                    </div>
                </div>

                {/* Device Info */}
                {isMedium && !isLarge && (
                    <div className="flex-1 border-l border-white/10 pl-6 h-full flex flex-col justify-center gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center"><Zap size={16} /></div>
                            <div>
                                <div className="text-sm font-bold">Magic Mouse</div>
                                <div className="text-xs text-gray-400">72%</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center"><Zap size={16} /></div>
                            <div>
                                <div className="text-sm font-bold">Magic Keyboard</div>
                                <div className="text-xs text-gray-400">45%</div>
                            </div>
                        </div>
                    </div>
                )}
                
                {/* Large Mode Grid */}
                {isLarge && (
                    <div className="absolute bottom-4 left-4 right-4 grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-white/10">
                        <div className="bg-black/10 dark:bg-white/5 rounded-lg p-3 flex flex-col gap-1">
                            <Zap size={14} className="text-blue-400" />
                            <span className="text-xs font-semibold mt-1">Magic Mouse</span>
                            <span className="text-[10px] text-gray-500">72%</span>
                        </div>
                        <div className="bg-black/10 dark:bg-white/5 rounded-lg p-3 flex flex-col gap-1">
                            <Zap size={14} className="text-purple-400" />
                            <span className="text-xs font-semibold mt-1">Keyboard</span>
                            <span className="text-[10px] text-gray-500">45%</span>
                        </div>
                    </div>
                )}
            </div>
            
            {/* Label (Small only) */}
            {!isMedium && (
                <div className="absolute bottom-3 left-0 right-0 text-center">
                    <span className="text-[11px] font-semibold text-black dark:text-white opacity-60">MacBook Pro</span>
                </div>
            )}
        </div>
    );
};
