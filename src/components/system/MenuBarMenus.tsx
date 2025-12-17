import React, { useState } from 'react';
import clsx from 'clsx';
import { useWindowManager } from '../../store/window-manager';

const MENU_STRUCTURE = {
    File: [
        { label: 'New Window', action: 'new-window' },
        { label: 'New Folder', action: 'new-folder' },
        { divider: true },
        { label: 'Close Window', action: 'close-window' },
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
    const { activeWindowId, closeWindow, minimizeWindow, maximizeWindow, openWindow } = useWindowManager();

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
            case 'new-window':
                // Open a generic new Finder window for now
                openWindow('finder', 'Finder', { width: 600, height: 400 });
                break;
            case 'help':
                openWindow('safari', 'Safari', { props: { url: 'https://support.apple.com/macos' } });
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

                    {activeMenu === menuName && (
                        <>
                            <div className="fixed inset-0 z-40 bg-transparent" onClick={() => setActiveMenu(null)} />
                            <div className="absolute top-full left-0 mt-1 min-w-[200px] bg-[#E5E5E5]/90 dark:bg-[#1e1e1e]/90 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-lg shadow-xl py-1 text-black dark:text-white z-50">
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
                            </div>
                        </>
                    )}
                </div>
            ))}
        </div>
    );
};
