import React, { useState, useRef, useEffect } from 'react';

export const Terminal: React.FC = () => {
    const [history, setHistory] = useState<string[]>(['Welcome to Terminal', 'Type "help" for commands.']);
    const [input, setInput] = useState('');
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [history]);

    const handleCommand = (cmd: string) => {
        const parts = cmd.trim().split(' ');
        const command = parts[0].toLowerCase();

        let output = '';

        switch (command) {
            case 'help':
                output = 'Available commands: help, clear, echo, ls, uname, date, whoami';
                break;
            case 'clear':
                setHistory([]);
                return;
            case 'echo':
                output = parts.slice(1).join(' ');
                break;
            case 'ls':
                output = 'Desktop  Documents  Downloads  Applications';
                break;
            case 'uname':
                output = 'Darwin';
                break;
            case 'date':
                output = new Date().toString();
                break;
            case 'whoami':
                output = 'user';
                break;
            case '':
                break;
            default:
                output = `command not found: ${command}`;
        }

        if (cmd) setHistory(prev => [...prev, `$ ${cmd}`, output].filter(Boolean));
        else setHistory(prev => [...prev, '$ ']);
    };

    const onKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleCommand(input);
            setInput('');
        }
    };

    return (
        <div className="h-full bg-black/90 text-white font-mono text-xs p-2 overflow-y-auto backdrop-blur-md" onClick={() => document.getElementById('term-input')?.focus()}>
            {history.map((line, i) => (
                <div key={i} className="whitespace-pre-wrap mb-1 break-all">{line}</div>
            ))}
            <div className="flex gap-2">
                <span className="text-green-400">➜</span>
                <span className="text-blue-400">~</span>
                <input
                    id="term-input"
                    className="bg-transparent border-none outline-none flex-1 font-mono text-white caret-gray-400"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={onKeyDown}
                    autoFocus
                />
            </div>
            <div ref={bottomRef} />
        </div>
    );
};
