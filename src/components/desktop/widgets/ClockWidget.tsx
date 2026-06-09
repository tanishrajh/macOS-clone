import React, { useState, useEffect } from 'react';
import type { WidgetSize } from '../../../types/settings';

export const ClockWidget: React.FC<{ size: WidgetSize }> = ({ size }) => {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const hours = time.getHours();
    const minutes = time.getMinutes();
    const seconds = time.getSeconds();

    const hoursDegrees = (hours % 12) * 30 + minutes * 0.5;
    const minutesDegrees = minutes * 6;
    const secondsDegrees = seconds * 6;

    const isLarge = size === 'large';
    const isMedium = size === 'medium' || size === 'large';
    const clockSize = isLarge ? 280 : 130;

    return (
        <div className="w-full h-full relative flex items-center justify-center bg-white/10 dark:bg-white/5 text-black dark:text-white">
            
            {/* Clock Face */}
            <div 
                className={`rounded-full border-4 border-black/10 dark:border-white/10 relative bg-white dark:bg-[#1e1e1e] shadow-inner flex items-center justify-center ${isMedium && !isLarge ? 'ml-[-160px]' : ''}`}
                style={{ width: clockSize, height: clockSize }}
            >
                {/* Tick Marks */}
                {[...Array(12)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-[2px] h-[6px] bg-black/30 dark:bg-white/30"
                        style={{
                            transform: `rotate(${i * 30}deg) translateY(-${(clockSize / 2) - 9}px)`,
                        }}
                    />
                ))}

                {/* Hour Hand */}
                <div
                    className="absolute bg-black dark:bg-white rounded-full"
                    style={{
                        width: isLarge ? '6px' : '4px',
                        height: isLarge ? '70px' : '35px',
                        bottom: '50%',
                        left: `calc(50% - ${isLarge ? 3 : 2}px)`,
                        transformOrigin: 'bottom center',
                        transform: `rotate(${hoursDegrees}deg)`
                    }}
                />
                
                {/* Minute Hand */}
                <div
                    className="absolute bg-black dark:bg-white rounded-full"
                    style={{
                        width: isLarge ? '4px' : '3px',
                        height: isLarge ? '110px' : '50px',
                        bottom: '50%',
                        left: `calc(50% - ${isLarge ? 2 : 1.5}px)`,
                        transformOrigin: 'bottom center',
                        transform: `rotate(${minutesDegrees}deg)`
                    }}
                />

                {/* Second Hand */}
                <div
                    className="absolute bg-orange-500 rounded-full"
                    style={{
                        width: '2px',
                        height: isLarge ? '130px' : '60px',
                        bottom: '50%',
                        left: 'calc(50% - 1px)',
                        transformOrigin: 'bottom center',
                        transform: `rotate(${secondsDegrees}deg)`
                    }}
                />

                {/* Center Dot */}
                <div className="absolute w-2 h-2 rounded-full bg-orange-500 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 shadow-sm" />
            </div>

            {/* Medium size additional clocks */}
            {isMedium && !isLarge && (
                <div className="absolute right-0 top-0 bottom-0 w-[180px] p-4 flex flex-col justify-center gap-4">
                    <div className="flex justify-between items-end border-b border-white/10 pb-2">
                        <div>
                            <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Tokyo</div>
                            <div className="text-xl font-light">12:30 AM</div>
                        </div>
                        <div className="text-xs text-gray-500">+13H</div>
                    </div>
                    <div className="flex justify-between items-end">
                        <div>
                            <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">London</div>
                            <div className="text-xl font-light">4:30 PM</div>
                        </div>
                        <div className="text-xs text-gray-500">+5H</div>
                    </div>
                </div>
            )}
        </div>
    );
};
