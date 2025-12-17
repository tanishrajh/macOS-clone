import React, { useState, useRef, useEffect } from 'react';
import { useFileSystem } from '../store/filesystem';

export const Terminal: React.FC = () => {
    const { files, createFile, deleteFile } = useFileSystem();
    const [history, setHistory] = useState<string[]>(['Welcome to Terminal', 'Type "help" for commands.']);
    const [input, setInput] = useState('');
    const bottomRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Command History for Up/Down
    const [cmdHistory, setCmdHistory] = useState<string[]>([]);
    const [historyPointer, setHistoryPointer] = useState(-1);

    // Current Working Directory (simulated)
    const [cwdId, setCwdId] = useState<string | null>(null);

    // Matrix Effect State
    const [isMatrixActive, setIsMatrixActive] = useState(false);
    const canvasRef = useRef<HTMLCanvasElement>(null);

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
        return path || '/';
    };

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [history]);

    // Matrix Animation Loop
    useEffect(() => {
        if (!isMatrixActive || !canvasRef.current || !containerRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set dimensions
        const { clientWidth, clientHeight } = containerRef.current;
        canvas.width = clientWidth;
        canvas.height = clientHeight;

        const katakana = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン';
        const latin = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        const nums = '0123456789';
        const alphabet = katakana + latin + nums;

        const fontSize = 16;
        const columns = canvas.width / fontSize;
        const rainDrops: number[] = [];

        for (let x = 0; x < columns; x++) {
            rainDrops[x] = 1;
        }

        const draw = () => {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = '#0F0';
            ctx.font = fontSize + 'px monospace';

            for (let i = 0; i < rainDrops.length; i++) {
                const text = alphabet.charAt(Math.floor(Math.random() * alphabet.length));
                ctx.fillText(text, i * fontSize, rainDrops[i] * fontSize);

                if (rainDrops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    rainDrops[i] = 0;
                }
                rainDrops[i]++;
            }
        };

        const interval = setInterval(draw, 30);

        const handleResize = () => {
            if (containerRef.current) {
                canvas.width = containerRef.current.clientWidth;
                canvas.height = containerRef.current.clientHeight;
            }
        };
        window.addEventListener('resize', handleResize);

        const stopMatrix = () => {
            setIsMatrixActive(false);
            setHistory(prev => [...prev, '', 'Matrix deactivated.']);
        };

        // Delay attaching listeners to avoid immediate exit from Enter key
        const timer = setTimeout(() => {
            window.addEventListener('keydown', stopMatrix);
            window.addEventListener('click', stopMatrix);
        }, 500);

        return () => {
            clearInterval(interval);
            clearTimeout(timer);
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('keydown', stopMatrix);
            window.removeEventListener('click', stopMatrix);
        };
    }, [isMatrixActive]);


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
        setHistoryPointer(-1);

        switch (command) {
            case 'help':
                output = `
Available commands:
  help      - Show this help message
  matrix    - Enter the matrix (Press key to exit)
  clear     - Clear terminal history
  echo      - Display a line of text
  ls        - List directory contents
  cd        - Change directory
  pwd       - Print working directory
  mkdir     - Create a directory
  touch     - Create a file
  rm        - Remove a file
  cat       - View file content
  whoami    - Print current user
  date      - Print current date/time
                `.trim();
                break;
            case 'matrix':
                setIsMatrixActive(true);
                return; // Logic handled in effect
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
        <div ref={containerRef} className="h-full bg-black/90 text-white font-mono text-xs p-2 overflow-y-auto backdrop-blur-md relative" onClick={() => document.getElementById('term-input')?.focus()}>
            {/* Matrix Canvas Overlay */}
            {isMatrixActive && (
                <canvas
                    ref={canvasRef}
                    className="absolute inset-0 z-50 pointer-events-auto cursor-pointer"
                    title="Click or Press Key to Exit"
                />
            )}

            {!isMatrixActive && (
                <>
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
                </>
            )}
        </div>
    );
};
