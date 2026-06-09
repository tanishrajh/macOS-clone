import React from 'react';
import { Sun, Cloud, CloudRain, Wind } from 'lucide-react';
import type { WidgetSize } from '../../../types/settings';

export const WeatherWidget: React.FC<{ size: WidgetSize }> = ({ size }) => {
    const isMedium = size === 'medium' || size === 'large';
    const isLarge = size === 'large';

    return (
        <div className="w-full h-full bg-gradient-to-b from-blue-400 to-blue-500 text-white p-4 flex flex-col relative overflow-hidden">
            {/* Top Section (Always visible) */}
            <div className={`flex ${isMedium ? 'justify-between w-full h-[128px]' : 'flex-col justify-between h-full'} z-10`}>
                {/* Current Weather */}
                <div className="flex flex-col justify-between h-full w-[128px]">
                    <div className="flex justify-between items-start">
                        <div className="font-semibold text-[15px] leading-tight">Cupertino</div>
                        {!isMedium && <Sun size={24} className="text-yellow-300 drop-shadow-sm" fill="currentColor" />}
                    </div>
                    
                    <div>
                        <div className="text-[42px] font-extrabold leading-none tracking-tighter mb-1">68°</div>
                        <div className="text-[13px] font-medium opacity-90">Mostly Sunny</div>
                        <div className="text-[11px] opacity-75 mt-0.5">H:72° L:54°</div>
                    </div>
                </div>

                {/* Hourly Forecast (Medium/Large) */}
                {isMedium && (
                    <div className="flex-1 flex justify-between items-center pl-6 border-l border-white/20 ml-2">
                        {[
                            { time: 'Now', icon: Sun, temp: '68°' },
                            { time: '1PM', icon: Sun, temp: '70°' },
                            { time: '2PM', icon: Cloud, temp: '72°' },
                            { time: '3PM', icon: CloudRain, temp: '65°' },
                            { time: '4PM', icon: Wind, temp: '63°' },
                        ].map((hour, i) => (
                            <div key={i} className="flex flex-col items-center gap-2">
                                <span className="text-[11px] font-medium">{hour.time}</span>
                                <hour.icon size={18} className={hour.icon === Sun ? "text-yellow-300" : "text-white"} fill="currentColor" />
                                <span className="text-[13px] font-semibold">{hour.temp}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* 5-Day Forecast (Large only) */}
            {isLarge && (
                <div className="mt-4 pt-4 border-t border-white/20 flex flex-col gap-3 flex-1 z-10">
                    <span className="text-xs font-semibold opacity-80 uppercase tracking-wider">5-Day Forecast</span>
                    <div className="flex flex-col gap-2">
                        {[
                            { day: 'Today', icon: Sun, min: '54', max: '72', bar: 'w-3/4 ml-auto' },
                            { day: 'Tue', icon: Cloud, min: '55', max: '70', bar: 'w-2/3 ml-auto' },
                            { day: 'Wed', icon: CloudRain, min: '50', max: '62', bar: 'w-1/2 mx-auto' },
                            { day: 'Thu', icon: Sun, min: '52', max: '75', bar: 'w-full' },
                            { day: 'Fri', icon: Sun, min: '58', max: '78', bar: 'w-full ml-auto' },
                        ].map((day, i) => (
                            <div key={i} className="flex items-center justify-between text-sm">
                                <span className="w-10 font-medium">{day.day}</span>
                                <day.icon size={16} className={day.icon === Sun ? "text-yellow-300" : "text-white"} fill="currentColor" />
                                <div className="flex items-center gap-2 w-32">
                                    <span className="text-xs opacity-75 w-4 text-right">{day.min}</span>
                                    <div className="flex-1 h-1.5 bg-black/20 rounded-full overflow-hidden">
                                        <div className={`h-full bg-gradient-to-r from-green-300 to-yellow-300 rounded-full ${day.bar}`} />
                                    </div>
                                    <span className="text-xs font-medium w-4">{day.max}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Decorative background element */}
            <div className={`absolute ${isMedium ? '-bottom-10 -right-4 opacity-10' : '-bottom-4 -right-4 opacity-20'}`}>
                <Sun size={isMedium ? 200 : 120} fill="currentColor" />
            </div>
        </div>
    );
};
