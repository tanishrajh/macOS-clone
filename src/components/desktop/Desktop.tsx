import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useFileSystem } from '../../store/filesystem';
import { useSettings } from '../../store/settings';
import { useWindowManager } from '../../store/window-manager';
import { FileIcon } from '../system/FileIcon';
import { WindowFrame } from '../system/WindowFrame';
import { ContextMenu } from '../system/ContextMenu';

// Apps
// Apps - Lazy Load for Performance
const Finder = React.lazy(() => import('../../apps/Finder').then(module => ({ default: module.Finder })));
const SystemSettings = React.lazy(() => import('../../apps/SystemSettings').then(module => ({ default: module.SystemSettings })));
const Terminal = React.lazy(() => import('../../apps/Terminal').then(module => ({ default: module.Terminal })));
const Safari = React.lazy(() => import('../../apps/Safari').then(module => ({ default: module.Safari })));
const Calculator = React.lazy(() => import('../../apps/Calculator').then(module => ({ default: module.Calculator })));
const Calendar = React.lazy(() => import('../../apps/Calendar').then(module => ({ default: module.Calendar })));
const Notes = React.lazy(() => import('../../apps/Notes').then(module => ({ default: module.Notes })));
const TextEdit = React.lazy(() => import('../../apps/TextEdit').then(module => ({ default: module.TextEdit })));
const Photos = React.lazy(() => import('../../apps/Photos').then(module => ({ default: module.Photos })));
const Messages = React.lazy(() => import('../../apps/Messages').then(module => ({ default: module.Messages })));
const Music = React.lazy(() => import('../../apps/Music').then(module => ({ default: module.Music })));
const Reminders = React.lazy(() => import('../../apps/Reminders').then(module => ({ default: module.Reminders })));
const AppStore = React.lazy(() => import('../../apps/AppStore').then(module => ({ default: module.AppStore })));
const ActivityMonitor = React.lazy(() => import('../../apps/ActivityMonitor').then(module => ({ default: module.ActivityMonitor })));
const VoiceMemos = React.lazy(() => import('../../apps/VoiceMemos').then(module => ({ default: module.VoiceMemos })));
const Preview = React.lazy(() => import('../../apps/Preview').then(module => ({ default: module.Preview })));

// Map apps to components
const APP_COMPONENTS: Record<string, React.FC> = {
    'finder': Finder,
    'safari': Safari,
    'terminal': Terminal,
    'settings': SystemSettings,
    'calculator': Calculator,
    'calendar': Calendar,
    'notes': Notes,
    'textedit': TextEdit,
    'photos': Photos,
    'messages': Messages,
    'music': Music,
    'reminders': Reminders,
    'appstore': AppStore,
    'activity': ActivityMonitor,
    'voicememos': VoiceMemos,
    'preview': Preview,
};

import { motion } from 'framer-motion';
import { useSystem } from '../../store/system';

export const Desktop: React.FC = () => {
    const { wallpaper } = useSettings();
    const { files, getChildren } = useFileSystem();
    const { windows, openWindow } = useWindowManager();
    const { isLocked } = useSystem();
    console.log('Desktop: Windows state:', windows);

    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [desktopFolderId, setDesktopFolderId] = useState<string | null>(null);

    // Find desktop folder ID
    useEffect(() => {
        const root = Object.values(files).find(f => f.parentId === null);
        if (!root) return;
        const users = Object.values(files).find(f => f.parentId === root.id && f.name === 'Users');
        if (!users) return;
        const user = Object.values(files).find(f => f.parentId === users.id && f.name === 'user');
        if (!user) return;
        const desktop = Object.values(files).find(f => f.parentId === user.id && f.name === 'Desktop');
        if (desktop) setDesktopFolderId(desktop.id);
    }, [files]);

    const desktopFiles = useMemo(() => {
        if (!desktopFolderId) return [];
        return getChildren(desktopFolderId);
    }, [desktopFolderId, files]);

    const handleIconClick = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (e.metaKey || e.ctrlKey) {
            const next = new Set(selectedIds);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            setSelectedIds(next);
        } else {
            setSelectedIds(new Set([id]));
        }
    };

    const handleBackgroundClick = () => {
        setSelectedIds(new Set());
    };

    // Context Menu State
    const [contextMenu, setContextMenu] = useState<{ x: number, y: number, fileId?: string } | null>(null);

    const handleContextMenu = (e: React.MouseEvent, fileId?: string) => {
        e.preventDefault();
        setContextMenu({ x: e.pageX, y: e.pageY, fileId });
    };

    const getContextMenuItems = () => {
        if (contextMenu?.fileId) {
            // File Context Menu
            const file = files[contextMenu.fileId];
            return [
                { label: 'Open', action: () => console.log("Open", file.name) }, // TODO: Actual Open
                { label: 'Get Info', action: () => console.log("Get Info", file.name) },
                { separator: true },
                { label: 'Rename', action: () => console.log("Rename", file.name) },
                { label: 'Compress', action: () => console.log("Compress", file.name) },
                { separator: true },
                { label: 'Move to Trash', danger: true, action: () => console.log("Trash", file.name) }, // useFileSystem delete
            ];
        } else {
            // Background Context Menu
            return [
                { label: 'New Folder', action: () => console.log("New Folder") },
                { label: 'Get Info', action: () => console.log("Get Info Desktop") },
                { separator: true },
                { label: 'Change Wallpaper...', action: () => openWindow('settings', 'System Settings') },
                { separator: true },
                { label: 'Sort By', submenu: [] },
                { label: 'Clean Up', action: () => console.log("Clean Up") },
            ];
        }
    };

    // Import ContextMenu (assuming it is available from previous step)
    // Note: We need to import it at the top, I'll add the import in a separate tool call if needed or just assume. 
    // Wait, adding imports with replace_file_content at the top is safer.

    return (
        <motion.div
            className="absolute inset-0 z-0 bg-cover bg-center overflow-hidden"
            style={{ backgroundImage: wallpaper.includes('gradient') ? wallpaper : `url(${wallpaper})` }}
            onClick={handleBackgroundClick}
            onContextMenu={(e) => handleContextMenu(e)}
            initial={{ scale: 1.2, filter: 'blur(10px)' }}
            animate={{
                scale: isLocked ? 1.1 : 1,
                filter: isLocked ? 'blur(0px)' : 'none'
            }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
            <div className="absolute inset-0 bg-black/10 pointer-events-none" />

            {/* Desktop Icons */}
            <div className="grid grid-flow-col grid-rows-[repeat(auto-fill,6rem)] gap-4 p-4 pt-10 content-start items-start justify-items-center w-full h-full pointer-events-none">
                {desktopFiles.map((file) => (
                    <div key={file.id} className="pointer-events-auto">
                        <FileIcon
                            file={file}
                            selected={selectedIds.has(file.id)}
                            onClick={(e) => handleIconClick(e, file.id)}
                            onDoubleClick={() => console.log('Open', file.name)}
                            onContextMenu={(e) => {
                                e.stopPropagation();
                                handleContextMenu(e, file.id);
                            }}
                        />
                    </div>
                ))}
            </div>

            {/* Context Menu Render */}
            {contextMenu && (
                <ContextMenu
                    x={contextMenu.x}
                    y={contextMenu.y}
                    items={getContextMenuItems()}
                    onClose={() => setContextMenu(null)}
                />
            )}

            {/* Windows Layer */}
            {Object.values(windows).map((window) => {
                const Component = APP_COMPONENTS[window.appId] || (() => <div className="p-4 text-gray-500">App not implemented</div>);
                if (!Component) return null;

                return (
                    <WindowFrame key={window.id} window={window}>
                        <Suspense fallback={<div className="flex w-full h-full items-center justify-center bg-white/50 dark:bg-[#1c1c1c]/50"><span className="animate-spin h-5 w-5 border-2 border-gray-500 border-t-transparent rounded-full" /></div>}>
                            <Component {...window.props} />
                        </Suspense>
                    </WindowFrame>
                );
            })}
        </motion.div>
    );
};
