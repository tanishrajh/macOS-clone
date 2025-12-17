import React, { useState, useEffect } from 'react';
import { Search, Edit } from 'lucide-react';
import clsx from 'clsx';

export const Messages: React.FC = () => {
    const [selectedContact, setSelectedContact] = useState<string>('Craig Federighi');
    const [messageInput, setMessageInput] = useState('');
    const [chats, setChats] = useState<Record<string, string[]>>({});
    const [loaded, setLoaded] = useState(false);

    // Initial state
    const DEFAULT_CHATS = {
        'Craig Federighi': ['Hey! Did you check out the new macOS build?', 'It looks amazing!'],
        'Tim Cook': ['Good morning!', 'Meeting at 10 AM.'],
        'Jony Ive': ['Aluminium. It is unapologetically simple.'],
    };


    // Load from localStorage on mount (simpler for this "fake" app than full FS overhead for now, but efficient)
    useEffect(() => {
        const saved = localStorage.getItem('macos-messages-v1');
        if (saved) {
            try {
                setChats(JSON.parse(saved));
            } catch (e) {
                setChats(DEFAULT_CHATS);
            }
        } else {
            setChats(DEFAULT_CHATS);
        }
        setLoaded(true);
    }, []);

    // Save on change
    useEffect(() => {
        if (loaded) {
            localStorage.setItem('macos-messages-v1', JSON.stringify(chats));
        }
    }, [chats, loaded]);

    const contacts = [
        { name: 'Craig Federighi', time: '9:41 AM', preview: 'It looks amazing!', avatar: 'CF' },
        { name: 'Tim Cook', time: 'Yesterday', preview: 'Meeting at 10 AM.', avatar: 'TC' },
        { name: 'Jony Ive', time: 'Friday', preview: 'Aluminium.', avatar: 'JI' },
    ];

    const sendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!messageInput.trim()) return;
        setChats(prev => {
            const next = {
                ...prev,
                [selectedContact]: [...(prev[selectedContact] || []), messageInput]
            };
            return next;
        });
        setMessageInput('');

        // Sim response
        setTimeout(() => {
            setChats(prev => ({
                ...prev,
                [selectedContact]: [...(prev[selectedContact] || []), 'Sent from my iPhone']
            }));
        }, 2000);
    };

    return (
        <div className="flex h-full w-full bg-white text-black font-sans">
            {/* Sidebar */}
            <div className="w-64 border-r border-gray-200 flex flex-col bg-white/80 backdrop-blur-md">
                <div className="h-12 flex items-center justify-between px-4 border-b border-gray-100">
                    <Search className="text-gray-400 w-4 h-4" />
                    <Edit className="text-blue-500 w-5 h-5 cursor-pointer" />
                </div>
                <div className="flex-1 overflow-y-auto">
                    {contacts.map(c => (
                        <div
                            key={c.name}
                            className={clsx(
                                "flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-100 transition-colors",
                                selectedContact === c.name && "bg-[#007AFF] text-white hover:bg-[#007AFF]"
                            )}
                            onClick={() => setSelectedContact(c.name)}
                        >
                            <div className={clsx("w-10 h-10 rounded-full flex items-center justify-center font-medium", selectedContact === c.name ? "bg-white text-blue-500" : "bg-gray-200 text-gray-600")}>
                                {c.avatar}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-baseline">
                                    <span className="font-semibold truncate text-sm">{c.name}</span>
                                    <span className={clsx("text-xs", selectedContact === c.name ? "text-blue-100" : "text-gray-400")}>{c.time}</span>
                                </div>
                                <div className={clsx("truncate text-sm", selectedContact === c.name ? "text-blue-100" : "text-gray-500")}>{c.preview}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col bg-white">
                <div className="h-12 border-b border-gray-100 flex items-center px-4 font-semibold text-gray-700 bg-white/50 backdrop-blur">
                    To: <span className="ml-2 text-black">{selectedContact}</span>
                </div>
                <div className="flex-1 p-4 overflow-y-auto space-y-2 flex flex-col">
                    {chats[selectedContact]?.map((msg, i) => (
                        <div
                            key={i}
                            className={clsx(
                                "max-w-[70%] px-4 py-2 rounded-2xl text-sm w-fit",
                                i % 2 === 0 ? "bg-[#E9E9EB] text-black self-start rounded-bl-sm" : "bg-[#007AFF] text-white self-end rounded-br-sm"
                            )}
                        >
                            {msg}
                        </div>
                    ))}
                </div>
                <form onSubmit={sendMessage} className="p-4 border-t border-gray-100">
                    <input
                        className="w-full px-4 py-2 rounded-full border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all text-sm"
                        placeholder="iMessage"
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                    />
                </form>
            </div>
        </div>
    );
};
