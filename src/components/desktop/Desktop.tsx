import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useFileSystem } from '../../store/filesystem';
import { useSettings } from '../../store/settings';
import { useWindowManager } from '../../store/window-manager';
import { FileIcon } from '../system/FileIcon';
import { WindowFrame } from '../system/WindowFrame';
import { ContextMenu } from '../system/ContextMenu';
import { Dialog } from '../system/Dialog';

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
    const { files, getChildren, createFolder, deleteFile, renameFile } = useFileSystem();
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
        console.log('Desktop: handleContextMenu', { x: e.pageX, y: e.pageY, fileId });
        e.preventDefault();
        e.stopPropagation(); // Prevent bubbling to wrapper or other handlers
        setContextMenu({ x: e.pageX, y: e.pageY, fileId });
    };

    // Dialog States
    const [infoFile, setInfoFile] = useState<any>(null);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [renameId, setRenameId] = useState<string | null>(null);
    const [renameName, setRenameName] = useState("");

    const getContextMenuItems = () => {
        if (contextMenu?.fileId) {
            // File Context Menu
            const file = files[contextMenu.fileId];
            return [
                {
                    label: 'Open',
                    action: () => {
                        // Logic similar to double click
                        if (file.type === 'folder') {
                            // Desktop folders open in Finder
                            openWindow('finder', 'Finder');
                            // Ideally we navigate finder to this folder, but simplistic for now
                        } else {
                            if (file.name.endsWith('.png') || file.name.endsWith('.jpg') || file.name.endsWith('.jpeg')) {
                                openWindow('preview', file.name, { props: { fileId: file.id } });
                            } else if (file.name.endsWith('.txt') || file.name.endsWith('.md') || file.name.endsWith('.json')) {
                                openWindow('textedit', file.name, { props: { fileId: file.id } });
                            } else if (file.name.endsWith('.mp3')) {
                                openWindow('music', 'Music');
                            } else {
                                // Default fallback
                                openWindow('textedit', file.name, { props: { fileId: file.id } });
                            }
                        }
                    }
                },
                {
                    label: 'Get Info',
                    action: () => setInfoFile(file)
                },
                { separator: true },
                {
                    label: 'Rename',
                    action: () => {
                        setRenameId(file.id);
                        setRenameName(file.name);
                    }
                },
                { separator: true },
                {
                    label: 'Move to Trash',
                    danger: true,
                    action: () => setDeleteId(file.id)
                },
            ];
        } else {
            // Background Context Menu
            return [
                {
                    label: 'New Folder',
                    action: () => {
                        if (desktopFolderId) {
                            createFolder(desktopFolderId, 'New Folder');
                        }
                    }
                },
                {
                    label: 'Get Info',
                    action: () => alert("Desktop\nLocation: /Users/user/Desktop") // Keep simple for desktop bg for now or make a dialog
                },
                { separator: true },
                { label: 'Change Wallpaper...', action: () => openWindow('settings', 'System Settings') },
                { separator: true },
                { label: 'Clean Up', action: () => setSelectedIds(new Set()) },
            ];
        }
    };

    // Import ContextMenu (assuming it is available from previous step)
    // Wait, adding imports with replace_file_content at the top is safer.

    return (
        <motion.div
            className="absolute inset-0 z-0 bg-cover bg-center overflow-hidden"
            style={{ backgroundImage: wallpaper.includes('gradient') ? wallpaper : `url(${wallpaper})` }}
            initial={{ scale: 1.2, filter: 'blur(10px)' }}
            onContextMenu={(e) => handleContextMenu(e)}
            animate={{
                scale: isLocked ? 1.1 : 1,
                filter: isLocked ? 'blur(0px)' : 'none'
            }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
            {/* Background Interaction Layer - Explicitly catches clicks */}
            <div
                className="absolute inset-0 z-0"
                onClick={handleBackgroundClick}
                onContextMenu={(e) => handleContextMenu(e)}
            />

            <div className="absolute inset-0 bg-black/10 pointer-events-none z-[1]" />

            {/* Desktop Icons */}
            <div className="grid grid-flow-col grid-rows-[repeat(auto-fill,6rem)] gap-4 p-4 pt-10 content-start items-start justify-items-center w-full h-full pointer-events-none z-[2] relative">
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

            {/* Dialogs */}
            <Dialog
                open={!!infoFile}
                onClose={() => setInfoFile(null)}
                title="File Info"
                description={infoFile ? `Name: ${infoFile.name}\nKind: ${infoFile.type === 'folder' ? 'Folder' : 'File'}\nCreated: ${new Date(infoFile.createdAt).toLocaleString()}` : ''}
                primaryAction={{ label: 'OK', onClick: () => setInfoFile(null) }}
            />

            <Dialog
                open={!!deleteId}
                onClose={() => setDeleteId(null)}
                title="Delete File"
                description="Are you sure you want to move this item to the Trash?"
                type="danger"
                primaryAction={{
                    label: 'Delete',
                    danger: true,
                    onClick: () => {
                        if (deleteId) deleteFile(deleteId);
                        setDeleteId(null);
                    }
                }}
                secondaryAction={{ label: 'Cancel', onClick: () => setDeleteId(null) }}
            />

            <Dialog
                open={!!renameId}
                onClose={() => setRenameId(null)}
                title="Rename File"
                primaryAction={{
                    label: 'Rename',
                    onClick: () => {
                        if (renameId && renameName.trim()) {
                            renameFile(renameId, renameName);
                        }
                        setRenameId(null);
                    }
                }}
                secondaryAction={{ label: 'Cancel', onClick: () => setRenameId(null) }}
            >
                <input
                    type="text"
                    value={renameName}
                    onChange={(e) => setRenameName(e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-black/20 border border-gray-300 dark:border-white/10 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    autoFocus
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            if (renameId && renameName.trim()) renameFile(renameId, renameName);
                            setRenameId(null);
                        }
                    }}
                />
            </Dialog>

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
