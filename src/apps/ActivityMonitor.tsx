import React, { useState, useEffect } from 'react';
import { Cpu, HardDrive, Zap, Globe } from 'lucide-react';
import clsx from 'clsx';

export const ActivityMonitor: React.FC = () => {
    const [activeTab, setActiveTab] = useState('CPU');
    const [processes, setProcesses] = useState<any[]>([]);

    const TABS = [
        { id: 'CPU', icon: Cpu },
        { id: 'Memory', icon: HardDrive },
        { id: 'Energy', icon: Zap },
        { id: 'Disk', icon: HardDrive },
        { id: 'Network', icon: Globe },
    ];

    // Sim Data
    useEffect(() => {
        const fakeProcesses = [
            { name: 'kernel_task', user: 'root', cpu: 12.4, mem: 450, threads: 145 },
            { name: 'Google Chrome', user: 'tanishraj', cpu: 8.2, mem: 2100, threads: 45 },
            { name: 'WindowServer', user: '_windowserver', cpu: 5.1, mem: 320, threads: 12 },
            { name: 'Activity Monitor', user: 'tanishraj', cpu: 2.5, mem: 85, threads: 8 },
            { name: 'mds_stores', user: 'root', cpu: 1.2, mem: 120, threads: 24 },
            { name: 'Finder', user: 'tanishraj', cpu: 0.5, mem: 180, threads: 10 },
            { name: 'Dock', user: 'tanishraj', cpu: 0.3, mem: 95, threads: 5 },
            { name: 'Spotify Helper', user: 'tanishraj', cpu: 0.1, mem: 450, threads: 18 },
        ];

        setProcesses(fakeProcesses);

        const interval = setInterval(() => {
            setProcesses(prev => prev.map(p => ({
                ...p,
                cpu: Math.max(0, p.cpu + (Math.random() - 0.5) * 5).toFixed(1)
            })).sort((a, b) => parseFloat(b.cpu) - parseFloat(a.cpu)));
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    // Canvas Graph logic would go here, skipping for brevity

    return (
        <div className="flex flex-col w-full h-full bg-white dark:bg-[#1c1c1c] text-black dark:text-gray-200 font-sans text-xs transition-colors duration-300">
            {/* Toolbar */}
            <div className="h-10 bg-[#F5F5F7] dark:bg-[#2c2c2e] border-b border-gray-300 dark:border-black/50 flex items-center px-2 shadow-sm z-10">
                <div className="flex gap-1 bg-gray-200 p-0.5 rounded-md">
                    {TABS.map(tab => (
                        <div
                            key={tab.id}
                            className={clsx(
                                "px-3 py-1 rounded-[4px] cursor-pointer font-medium flex items-center gap-1.5",
                                activeTab === tab.id ? "bg-white dark:bg-[#3a3a3c] shadow-sm text-black dark:text-white" : "text-gray-600 dark:text-gray-400 hover:bg-gray-300/50 dark:hover:bg-white/10"
                            )}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            <tab.icon size={12} />
                            {tab.id}
                        </div>
                    ))}
                </div>
            </div>

            {/* Table Header */}
            <div className="flex bg-[#FAFAFA] dark:bg-[#2c2c2e] border-b border-gray-200 dark:border-white/5 py-1 px-1 font-semibold text-gray-500 dark:text-gray-400">
                <div className="flex-[3] px-2 border-r border-gray-200">Process Name</div>
                <div className="flex-[1] px-2 text-right border-r border-gray-200">% CPU</div>
                <div className="flex-[1] px-2 text-right border-r border-gray-200">Threads</div>
                <div className="flex-[1] px-2 text-right border-r border-gray-200">Memory (MB)</div>
                <div className="flex-[1] px-2">User</div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto bg-white dark:bg-[#1c1c1c]">
                {processes.map((p, i) => (
                    <div key={i} className={clsx("flex py-1 px-1 border-b border-gray-100 dark:border-white/5 hover:bg-blue-500 hover:text-white group", i % 2 === 0 ? "bg-white dark:bg-[#1c1c1c]" : "bg-[#F5F8FA] dark:bg-[#252525]")}>
                        <div className="flex-[3] px-2 flex items-center gap-2">
                            <div className="w-3 h-3 bg-gray-400 rounded-sm group-hover:bg-white/50" />
                            {p.name}
                        </div>
                        <div className="flex-[1] px-2 text-right font-mono tabular-nums">{p.cpu}</div>
                        <div className="flex-[1] px-2 text-right font-mono tabular-nums">{p.threads}</div>
                        <div className="flex-[1] px-2 text-right font-mono tabular-nums">{p.mem}</div>
                        <div className="flex-[1] px-2 truncate opacity-70">{p.user}</div>
                    </div>
                ))}
            </div>

            {/* Bottom Graph Section */}
            <div className="h-32 bg-[#F5F5F7] dark:bg-[#2c2c2e] border-t border-gray-300 dark:border-black/50 p-4 flex gap-8">
                <div className="flex flex-col justify-between w-32">
                    <span className="font-bold text-lg">System Load</span>
                    <div className="text-2xl font-light">
                        {Math.floor(processes.reduce((acc, p) => acc + parseFloat(p.cpu), 0))}%
                    </div>
                    <div className="text-gray-500">User: 12%</div>
                    <div className="text-gray-500">System: 8%</div>
                </div>
                <div className="flex-1 bg-black rounded border border-gray-400 relative overflow-hidden">
                    {/* Simulated Graph Lines */}
                    <div className="absolute bottom-0 left-0 w-full h-[80%] bg-blue-500/20" />
                    <div className="absolute bottom-0 left-0 w-full h-[30%] bg-red-500/20" />
                    <div className="text-white/50 absolute top-1 right-2 text-[10px]">History</div>
                </div>
            </div>
        </div>
    );
};
