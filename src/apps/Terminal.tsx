import React, { useState, useRef, useEffect } from 'react';
import { useFileSystem } from '../store/filesystem';

export const Terminal: React.FC = () => {
    const { files, createFile, deleteFile } = useFileSystem();
    const [history, setHistory] = useState<string[]>(['Welcome to Terminal', 'Type "help" for commands.']);
    const [input, setInput] = useState('');
    const bottomRef = useRef<HTMLDivElement>(null);

    // Command History for Up/Down
    const [cmdHistory, setCmdHistory] = useState<string[]>([]);
    const [historyPointer, setHistoryPointer] = useState(-1);

    // Current Working Directory (simulated)
    const [cwdId, setCwdId] = useState<string | null>(null);

    // Init CWD to user home
    useEffect(() => {
        if (!cwdId && Object.keys(files).length > 0) {
            const allFiles = Object.values(files);
            const user = allFiles.find(f => f.name === 'user');
            if (user) setCwdId(user.id);
        }
    }, [files, cwdId]);

    const getCurrentPath = () => {
        if (!cwdId) return '/';
        let path = '';
        let curr = files[cwdId];
        while (curr && curr.parentId) {
            path = '/' + curr.name + path;
            const parent = files[curr.parentId];
            curr = parent;
        }
        // Add root /Users prefix if missing in logic but simple concat for now
        // Assuming structure: null -> System -> Users -> user
        return path || '/';
    };

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [history]);

    const handleCommand = (cmd: string) => {
        const trimmed = cmd.trim();
        if (!trimmed) {
            setHistory(prev => [...prev, `${getCurrentPath()} $ `]);
            return;
        }

        const parts = trimmed.split(' ');
        const command = parts[0].toLowerCase();
        const args = parts.slice(1);

        let output = '';

        // Update command history
        setCmdHistory(prev => [...prev, trimmed]);
        setHistoryPointer(-1); // Reset pointer

        switch (command) {
            case 'help':
                output = 'Available commands: help, clear, echo, ls, cd, pwd, mkdir, touch, rm, cat, whoami, date';
                break;
            case 'clear':
                setHistory([]);
                return;
            case 'echo':
                output = args.join(' ');
                break;
            case 'pwd':
                output = getCurrentPath();
                break;
            case 'ls':
                if (cwdId) {
                    const children = Object.values(files).filter(f => f.parentId === cwdId);
                    output = children.map(c => c.type === 'folder' ? c.name + '/' : c.name).join('  ');
                } else {
                    output = 'Error: No CWD';
                }
                break;
            case 'cd':
                if (!cwdId) {
                    output = 'Error: No CWD';
                    break;
                }
                const target = args[0];
                if (!target || target === '~') {
                    // Go home
                    const user = Object.values(files).find(f => f.name === 'user');
                    if (user) setCwdId(user.id);
                } else if (target === '..') {
                    const curr = files[cwdId];
                    if (curr.parentId) setCwdId(curr.parentId);
                } else {
                    // Simple child search
                    const child = Object.values(files).find(f => f.parentId === cwdId && f.name === target && f.type === 'folder');
                    if (child) setCwdId(child.id);
                    else output = `cd: no such file or directory: ${target}`;
                }
                break;
            case 'mkdir':
                if (!cwdId) {
                    output = 'Error: No CWD';
                    break;
                }
                const dirName = args[0];
                if (dirName) {
                    createFile(cwdId, dirName, 'folder');
                    output = '';
                } else {
                    output = 'mkdir: missing operand';
                }
                break;
            case 'touch':
                if (!cwdId) {
                    output = 'Error: No CWD';
                    break;
                }
                const fileName = args[0];
                if (fileName) {
                    createFile(cwdId, fileName, 'file');
                    output = '';
                } else {
                    output = 'touch: missing operand';
                }
                break;
            case 'rm':
                if (!cwdId) {
                    output = 'Error: No CWD';
                    break;
                }
                const rmTarget = args[0];
                if (rmTarget) {
                    const child = Object.values(files).find(f => f.parentId === cwdId && f.name === rmTarget);
                    if (child) {
                        deleteFile(child.id);
                        output = '';
                    } else {
                        output = `rm: cannot remove '${rmTarget}': No such file or directory`;
                    }
                } else {
                    output = 'rm: missing operand';
                }
                break;
            case 'cat':
                if (!cwdId) {
                    output = 'Error: No CWD';
                    break;
                }
                const catTarget = args[0];
                if (catTarget) {
                    const child = Object.values(files).find(f => f.parentId === cwdId && f.name === catTarget);
                    if (child) {
                        if (child.type === 'folder') output = `cat: ${catTarget}: Is a directory`;
                        else output = child.content || '';
                    } else {
                        output = `cat: ${catTarget}: No such file or directory`;
                    }
                } else {
                    output = 'cat: missing operand';
                }
                break;
            case 'whoami':
                output = 'user';
                break;
            case 'date':
                output = new Date().toString();
                break;
            default:
                output = `command not found: ${command}`;
        }

        const prompt = `${getCurrentPath()} $ ${cmd}`;
        setHistory(prev => [...prev, prompt, output].filter(Boolean));
    };

    const onKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleCommand(input);
            setInput('');
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (cmdHistory.length > 0) {
                const newPtr = historyPointer === -1 ? cmdHistory.length - 1 : Math.max(0, historyPointer - 1);
                setHistoryPointer(newPtr);
                setInput(cmdHistory[newPtr]);
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (historyPointer !== -1) {
                const newPtr = Math.min(cmdHistory.length - 1, historyPointer + 1);
                if (newPtr === historyPointer) { // At end
                    setHistoryPointer(-1);
                    setInput('');
                } else {
                    setHistoryPointer(newPtr);
                    setInput(cmdHistory[newPtr]);
                }
            }
        }
    };

    return (
        <div className="h-full bg-black/90 text-white font-mono text-xs p-2 overflow-y-auto backdrop-blur-md" onClick={() => document.getElementById('term-input')?.focus()}>
            {history.map((line, i) => (
                <div key={i} className="whitespace-pre-wrap mb-1 break-all">{line}</div>
            ))}
            <div className="flex gap-2">
                <span className="text-green-400">➜</span>
                <span className="text-blue-400">{cwdId ? files[cwdId]?.name : '~'}</span>
                <span className="text-gray-400 mr-2">$</span>
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
