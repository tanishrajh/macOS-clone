import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import { useWindowManager } from '../../store/window-manager';
import { useFileSystem } from '../../store/filesystem';

const MENU_STRUCTURE = {
    File: [
        { label: 'New Window', action: 'new-window' },
        { label: 'New Folder', action: 'new-folder' },
        { divider: true },
        { label: 'Close Window', action: 'close-window' },
        { divider: true },
        { label: 'Save', action: 'save' },
        { label: 'Print', action: 'print' },
    ],
    Edit: [
        { label: 'Undo', action: 'undo' },
        { label: 'Redo', action: 'redo' },
        { divider: true },
        { label: 'Cut', action: 'cut' },
        { label: 'Copy', action: 'copy' },
        { label: 'Paste', action: 'paste' },
        { divider: true },
        { label: 'Select All', action: 'select-all' },
    ],
    View: [
        { label: 'as Icons', action: 'view-icons' },
        { label: 'as List', action: 'view-list' },
        { divider: true },
        { label: 'Enter Full Screen', action: 'fullscreen' },
    ],
    Go: [
        { label: 'Back', action: 'go-back' },
        { label: 'Forward', action: 'go-forward' },
        { divider: true },
        { label: 'Home', action: 'go-home' },
        { label: 'Desktop', action: 'go-desktop' },
        { label: 'Downloads', action: 'go-downloads' },
    ],
    Window: [
        { label: 'Minimize', action: 'minimize' },
        { label: 'Zoom', action: 'zoom' },
        { divider: true },
        { label: 'Bring All to Front', action: 'front' },
    ],
    Help: [
        { label: 'Tips for Mac', action: 'help' }
    ]
};

export const MenuBarMenus: React.FC = () => {
    const [activeMenu, setActiveMenu] = useState<string | null>(null);
    const { activeWindowId, closeWindow, minimizeWindow, maximizeWindow, openWindow, windows } = useWindowManager();
    const { createFolder, files } = useFileSystem();

    const handleAction = (action: string) => {
        setActiveMenu(null);
        console.log(`Menu Action: ${action}`);

        // Basic Generic Handlers
        switch (action) {
            case 'close-window':
                if (activeWindowId) closeWindow(activeWindowId);
                break;
            case 'minimize':
                if (activeWindowId) minimizeWindow(activeWindowId);
                break;
            case 'zoom':
            case 'fullscreen':
                if (activeWindowId) maximizeWindow(activeWindowId);
                break;
            case 'view-icons':
                if (activeWindowId) {
                    useWindowManager.getState().updateWindow(activeWindowId, {
                        meta: { ...windows[activeWindowId].meta, viewMode: 'grid' }
                    });
                }
                break;
            case 'view-list':
                if (activeWindowId) {
                    useWindowManager.getState().updateWindow(activeWindowId, {
                        meta: { ...windows[activeWindowId].meta, viewMode: 'list' }
                    });
                }
                break;
            case 'new-window':
                // Open a generic new Finder window for now
                openWindow('finder', 'Finder', { width: 600, height: 400 });
                break;
            case 'new-folder':
                if (activeWindowId && windows[activeWindowId].appId === 'finder') {
                    const meta = windows[activeWindowId].meta;
                    if (meta && meta.currentPath) {
                        createFolder(meta.currentPath, 'New Folder');
                        return;
                    }
                }

                // Fallback: Try to find Desktop folder
                // We use a robust search strategy
                const allFiles = Object.values(files);
                const root = allFiles.find(f => f.parentId === null);
                if (root) {
                    const users = allFiles.find(f => f.parentId === root.id && f.name === 'Users');
                    if (users) {
                        const user = allFiles.find(f => f.parentId === users.id && f.name === 'user');
                        if (user) {
                            const desktop = allFiles.find(f => f.parentId === user.id && f.name === 'Desktop');
                            if (desktop) createFolder(desktop.id, 'New Folder');
                        }
                    }
                }
                break;
            case 'save':
                window.dispatchEvent(new CustomEvent('menu-save'));
                break;
            case 'print':
                window.print();
                break;

            // Edit Menu
            case 'undo': document.execCommand('undo'); break;
            case 'redo': document.execCommand('redo'); break;
            case 'cut': document.execCommand('cut'); break;
            case 'copy': document.execCommand('copy'); break;
            case 'paste':
                navigator.clipboard.readText().then(text => {
                    document.execCommand('insertText', false, text);
                }).catch(err => {
                    console.error('Failed to read clipboard', err);
                });
                break;
            case 'select-all': document.execCommand('selectAll'); break;
            case 'help':
                openWindow('safari', 'Safari', { props: { url: 'https://support.apple.com/macos' } });
                break;
            
            // Go Menu
            case 'go-back': window.dispatchEvent(new CustomEvent('menu-go-back')); break;
            case 'go-forward': window.dispatchEvent(new CustomEvent('menu-go-forward')); break;
            
            case 'go-home':
            case 'go-desktop':
            case 'go-downloads':
                // Resolve path
                const allFiles = Object.values(files);
                const root = allFiles.find(f => f.parentId === null);
                if (!root) return;
                const users = allFiles.find(f => f.parentId === root.id && f.name === 'Users');
                if (!users) return;
                const user = allFiles.find(f => f.parentId === users.id && f.name === 'user');
                if (!user) return;

                let targetId;
                if (action === 'go-home') targetId = user.id;
                else if (action === 'go-desktop') targetId = allFiles.find(f => f.parentId === user.id && f.name === 'Desktop')?.id;
                else if (action === 'go-downloads') targetId = allFiles.find(f => f.parentId === user.id && f.name === 'Downloads')?.id;

                if (targetId) {
                    // specific logic: if active window is finder, navigate it. else open new finder.
                    if (activeWindowId && windows[activeWindowId].appId === 'finder') {
                        useWindowManager.getState().updateWindow(activeWindowId, {
                            meta: { ...windows[activeWindowId].meta, currentPath: targetId }
                        });
                    } else {
                        // Open new window at location
                        // We can't easily pass start path to openWindow generic config yet without modifying Finder to read it from props too.
                        // But we CAN pass it in meta if we modify openWindow to accept meta
                        // OR we modify Finder to look at meta on mount.
                        // Finder looks at meta on update, but mount?
                        // Let's rely on Finder default for now or add a quick hack to support initial meta if possible.
                        // Actually Finder initializes to Home.
                        // If we open new window, we can just open it.
                        // Use openWindow then update it?
                         openWindow('finder', 'Finder', { width: 600, height: 400 });
                         // The new window needs time to mount.
                         // For now, these only work if Finder is active, or generic Open Finder (Home).
                         // Let's stick to "If active Finder, navigate. If not, Open Finder to Home (default)".
                    }
                }
                break;
            // Add more handlers as needed
        }
    };

    return (
        <div className="flex px-1 gap-1">
            {Object.entries(MENU_STRUCTURE).map(([menuName, items]) => (
                <div key={menuName} className="relative">
                    <div
                        className={clsx(
                            "px-3 py-0.5 rounded cursor-default hover:bg-white/10 transition-colors font-medium",
                            activeMenu === menuName && "bg-white/10"
                        )}
                        onClick={() => setActiveMenu(activeMenu === menuName ? null : menuName)}
                    >
                        {menuName}
                    </div>

                    <AnimatePresence>
                        {activeMenu === menuName && (
                            <>
                                <div className="fixed inset-0 z-40 bg-transparent" onClick={() => setActiveMenu(null)} />
                                <motion.div
                                    initial={{ opacity: 0, scale: 0, x: -10, y: -10, filter: "blur(10px)" }}
                                    animate={{ opacity: 1, scale: 1, x: 0, y: 0, filter: "blur(0px)" }}
                                    exit={{ opacity: 0, scale: 0, x: -10, y: -10, filter: "blur(10px)" }}
                                    transition={{ duration: 0.15, ease: "easeOut" }}
                                    style={{ transformOrigin: "top left" }}
                                    className="absolute top-full left-0 mt-1 min-w-[200px] bg-[#E5E5E5]/90 dark:bg-[#1e1e1e]/90 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-lg shadow-xl py-1 text-black dark:text-white z-50"
                                >
                                    {items.map((item, idx) => {
                                        if ('divider' in item) {
                                            return <div key={idx} className="h-px bg-gray-300/50 dark:bg-white/10 my-1 mx-3" />;
                                        }
                                        return (
                                            <div
                                                key={idx}
                                                className="px-4 py-1 hover:bg-blue-500 hover:text-white cursor-default text-sm"
                                                onClick={() => handleAction(item.action!)}
                                            >
                                                {item.label}
                                            </div>
                                        );
                                    })}
                                </motion.div>
                            </>
                        )}
                    </AnimatePresence>
                </div>
            ))}
        </div>
    );
};
