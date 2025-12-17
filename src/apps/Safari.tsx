import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, RotateCw, Shield } from 'lucide-react';
import clsx from 'clsx';

export const Safari: React.FC = () => {
    const [input, setInput] = useState('https://www.bing.com');
    const [iframeUrl, setIframeUrl] = useState('https://www.bing.com');
    const [isLoading, setIsLoading] = useState(false);

    const handleNavigate = (e?: React.FormEvent) => {
        e?.preventDefault();
        let target = input;
        if (!target.startsWith('http')) {
            target = `https://www.bing.com/search?q=${encodeURIComponent(target)}`;
        }
        setIframeUrl(target);
        setIsLoading(true);
    };

    return (
        <div className="flex flex-col w-full h-full bg-white text-black font-sans">
            {/* Toolbar */}
            <div className="flex items-center gap-4 px-4 py-3 bg-[#F5F5F7] border-b border-gray-300">
                <div className="flex gap-2 text-gray-500">
                    <ArrowLeft className="w-5 h-5 cursor-pointer hover:text-black" />
                    <ArrowRight className="w-5 h-5 cursor-pointer hover:text-black" />
                    <RotateCw className={clsx("w-4 h-4 cursor-pointer hover:text-black", isLoading && "animate-spin")} onClick={() => handleNavigate()} />
                </div>

                <div className="flex items-center gap-2 px-3 py-1 bg-white border border-gray-300 rounded-md shadow-sm h-8 w-64 hover:border-gray-400 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all flex-[0.6]">
                    <Shield className="w-3 h-3 text-gray-400" />
                    <input
                        className="flex-1 text-sm bg-transparent outline-none min-w-0"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleNavigate()}
                        onFocus={(e) => e.currentTarget.select()}
                    />
                </div>

                <div className="flex-1" />
            </div>

            {/* Browser Content */}
            <div className="flex-1 relative">
                <iframe
                    src={iframeUrl}
                    className="w-full h-full border-0 bg-white"
                    title="Browser"
                    onLoad={() => setIsLoading(false)}
                    onError={() => setIsLoading(false)}
                />
            </div>
        </div>
    );
};
