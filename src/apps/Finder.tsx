import React, { useState, useEffect } from 'react';
import { useFileSystem } from '../store/filesystem';
// @ts-ignore
import { useWindowManager } from '../store/window-manager';
import { Folder, FileText, Download, Monitor, ChevronRight, ChevronLeft, Search, LayoutGrid, List as ListIcon } from 'lucide-react';
import clsx from 'clsx';
import { format } from 'date-fns';
import { FileIcon } from '../components/system/FileIcon';
import { ContextMenu } from '../components/system/ContextMenu';
import type { FileNode } from '../types/filesystem';

const ApplicationIcon = () => <div className="w-4 h-4 bg-transparent border border-gray-400 rounded-sm flex items-center justify-center text-[8px] font-bold">A</div>;

const SidebarItem = ({ icon: Icon, label, active, onClick }: { icon: any, label: string, active: boolean, onClick: () => void }) => (
    <div className={clsx(
        "flex items-center gap-2 px-2 py-1 rounded-md cursor-default text-sm transition-colors",
        active ? "bg-gray-300/50 dark:bg-white/10 ml-1 text-black dark:text-white" : "hover:bg-black/5 dark:hover:bg-white/5 text-gray-600 dark:text-gray-400"
    )} onClick={onClick}>
        <Icon size={16} className={active ? "text-blue-500" : "text-gray-500 dark:text-gray-400"} />
        <span className="font-medium">{label}</span>
    </div>
);

const SidebarSection = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <div className="mb-4">
        <h3 className="px-2 text-xs font-semibold text-gray-400 mb-1">{title}</h3>
        <div className="flex flex-col gap-0.5">{children}</div>
    </div>
);

export const Finder: React.FC = () => {
    const { files, getChildren, createFolder, deleteFile, renameFile } = useFileSystem();
    const { openWindow } = useWindowManager();
    const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    // Navigation History
    const [history, setHistory] = useState<string[]>([]);
    const [historyIndex, setHistoryIndex] = useState(-1);

    // Initialize to user Home on mount
    useEffect(() => {
        // Find /Users/user
        const allFiles = Object.values(files) as FileNode[];
        console.log("Finder: All Files", allFiles.length);
        const root = allFiles.find(f => f.parentId === null);
        if (root) {
            const home = allFiles.find(f => f.parentId === root.id && f.name === 'Users');
            if (home) {
                const user = allFiles.find(f => f.parentId === home.id && f.name === 'user');
                console.log("Finder: User folder found", user);
                if (user) {
                    if (history.length === 0) {
                        console.log("Finder: Setting current folder to user", user.id);
                        setCurrentFolderId(user.id);
                        setHistory([user.id]);
                        setHistoryIndex(0);
                    }
                }
            } else { console.log("Finder: Users folder missing"); }
        } else { console.log("Finder: Root missing"); }
    }, [files]);

    const navigateTo = (folderId: string) => {
        if (folderId === currentFolderId) return;

        // Remove forward history if we navigate to a new place
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push(folderId);

        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
        setCurrentFolderId(folderId);
    };

    const handleBack = () => {
        if (historyIndex > 0) {
            const newIndex = historyIndex - 1;
            setHistoryIndex(newIndex);
            setCurrentFolderId(history[newIndex]);
        }
    };

    const handleForward = () => {
        if (historyIndex < history.length - 1) {
            const newIndex = historyIndex + 1;
            setHistoryIndex(newIndex);
            setCurrentFolderId(history[newIndex]);
        }
    };

    // Context Menu State
    const [contextMenu, setContextMenu] = useState<{ x: number, y: number, fileId?: string } | null>(null);

    const handleContextMenu = (e: React.MouseEvent, fileId?: string) => {
        e.preventDefault();
        setContextMenu({ x: e.pageX, y: e.pageY, fileId });
    };

    const getContextMenuItems = () => {
        if (contextMenu?.fileId) {
            const file = files[contextMenu.fileId];
            return [
                {
                    label: 'Open', action: () => {
                        if (file.type === 'folder') navigateTo(file.id);
                        else {
                            if (file.name.endsWith('.png') || file.name.endsWith('.jpg') || file.name.endsWith('.jpeg')) {
                                openWindow('preview', file.name, { props: { fileId: file.id } });
                            } else if (file.name.endsWith('.txt') || file.name.endsWith('.md') || file.name.endsWith('.json')) {
                                openWindow('textedit', file.name, { props: { fileId: file.id } });
                            } else if (file.name.endsWith('.mp3')) {
                                openWindow('music', 'Music');
                            }
                        }
                    }
                },
                {
                    label: 'Get Info',
                    action: () => alert(`Name: ${file.name}\nType: ${file.type}\nCreated: ${new Date(file.createdAt).toLocaleString()}`)
                },
                { separator: true },
                {
                    label: 'Rename',
                    action: () => {
                        const newName = prompt("Rename file:", file.name);
                        if (newName && newName !== file.name) {
                            renameFile(file.id, newName);
                        }
                    }
                },
                { separator: true },
                {
                    label: 'Move to Trash',
                    danger: true,
                    action: () => {
                        if (confirm(`Are you sure you want to delete "${file.name}"?`)) {
                            deleteFile(file.id);
                        }
                    }
                },
            ];
        } else {
            // Background options
            return [
                {
                    label: 'New Folder',
                    action: () => {
                        if (currentFolderId) {
                            createFolder(currentFolderId, 'New Folder');
                        }
                    }
                },
                {
                    label: 'Get Info',
                    action: () => {
                        const folder = currentFolderId ? files[currentFolderId] : null;
                        alert(`Folder: ${folder?.name || 'Root'}\nItems: ${currentFiles.length}`);
                    }
                },
                { separator: true },
                { label: 'View as List', action: () => setViewMode('list') },
                { label: 'View as Grid', action: () => setViewMode('grid') },
            ];
        }
    };

    const currentFiles: FileNode[] = currentFolderId ? getChildren(currentFolderId) : [];

    if (!currentFolderId) {
        return (
            <div className="flex h-full w-full bg-white text-black font-sans items-center justify-center flex-col gap-4">
                <div className="text-red-500 font-bold">Finder Error: No Folder Selected</div>
                <div className="text-xs text-gray-500 text-left bg-gray-100 p-4 rounded">
                    <div>Files Loaded: {Object.keys(files).length}</div>
                    <div>Root Found: {Object.values(files).find(f => f.parentId === null) ? 'Yes' : 'No'}</div>
                    <button
                        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        onClick={() => {
                            // Manual Rescue
                            const root = Object.values(files).find(f => f.parentId === null);
                            if (root) {
                                const users = Object.values(files).find(f => f.parentId === root.id && f.name === 'Users');
                                if (users) {
                                    const user = Object.values(files).find(f => f.parentId === users.id && f.name === 'user');
                                    if (user) setCurrentFolderId(user.id);
                                    else setCurrentFolderId(users.id);
                                } else {
                                    setCurrentFolderId(root.id);
                                }
                            }
                        }}
                    >
                        Try Force Navigate Home
                    </button>
                    <button
                        className="mt-2 ml-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                        onClick={() => console.log(files)}
                    >
                        Log Files to Console
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-full w-full bg-white dark:bg-[#1c1c1c] text-black dark:text-gray-100 font-sans transition-colors duration-300">
            {/* Sidebar */}
            <div className="w-48 bg-[#F5F5F7]/95 dark:bg-[#2c2c2e]/95 backdrop-blur-xl border-r border-gray-200 dark:border-white/10 flex flex-col pt-3 pb-4 px-2 select-none text-sm">
                <div className="flex gap-2 px-2 mb-4">
                    <div className="w-3 h-3 rounded-full bg-transparent" />
                </div>

                <SidebarSection title="Favorites">
                    {['Desktop', 'Documents', 'Downloads', 'Applications'].map(name => {
                        const icon = name === 'Desktop' ? Monitor
                            : name === 'Documents' ? FileText
                                : name === 'Downloads' ? Download
                                    : ApplicationIcon;

                        return (
                            <SidebarItem
                                key={name}
                                icon={icon}
                                label={name}
                                active={currentFolderId ? files[currentFolderId]?.name === name : false}
                                onClick={() => {
                                    // Hacky find: Search in current user folder or root
                                    const allFiles = Object.values(files);
                                    let target = allFiles.find(f => f.name === name); // Global search warning, better to search properly
                                    if (target) navigateTo(target.id);
                                }}
                            />
                        );
                    })}
                </SidebarSection>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 bg-white dark:bg-[#1e1e1e]">
                {/* Toolbar */}
                <div className="h-12 border-b border-gray-200 dark:border-white/10 flex items-center px-4 justify-between bg-[#F5F5F7]/50 dark:bg-[#2c2c2e]/50 backdrop-blur-md text-gray-700 dark:text-gray-200">
                    <div className="flex gap-4">
                        <div className="flex gap-1 text-gray-500 dark:text-gray-400">
                            <ChevronLeft
                                className={clsx("cursor-pointer", historyIndex <= 0 ? "text-gray-300 dark:text-gray-600 pointer-events-none" : "hover:text-black dark:hover:text-white")}
                                onClick={handleBack}
                            />
                            <ChevronRight
                                className={clsx("cursor-pointer", historyIndex >= history.length - 1 ? "text-gray-300 dark:text-gray-600 pointer-events-none" : "hover:text-black dark:hover:text-white")}
                                onClick={handleForward}
                            />
                        </div>
                        <span className="font-semibold text-sm">
                            {currentFolderId && files[currentFolderId]?.name}
                        </span>
                    </div>

                    {/* Trash Special Action */}
                    {currentFolderId && files[currentFolderId]?.name === 'Trash' && (
                        <button
                            className="mr-4 px-3 py-1 bg-gray-200 dark:bg-white/10 hover:bg-gray-300 dark:hover:bg-white/20 rounded text-xs font-medium transition-colors"
                            onClick={() => {
                                // Empty Trash Logic
                                // In a real app, delete all children of Trash.
                                // For now, we simulate.
                                console.log("Emptying trash...");
                                // We might need to expose deleteFile recursively or clearFolder from FS
                                // alert("Trash Emptying..."); 
                                // Since we don't have playSound imported here, maybe add it later?
                                // Just a simple UI change for now as requested.
                            }}
                        >
                            Empty
                        </button>
                    )}

                    <div className="flex gap-2 text-gray-500 dark:text-gray-400">
                        <LayoutGrid size={18} className={clsx("cursor-pointer", viewMode === 'grid' && "text-black dark:text-white")} onClick={() => setViewMode('grid')} />
                        <ListIcon size={18} className={clsx("cursor-pointer", viewMode === 'list' && "text-black dark:text-white")} onClick={() => setViewMode('list')} />
                        <Search size={18} className="cursor-pointer hover:text-black dark:hover:text-white ml-4" />
                    </div>
                </div>

                {/* File View */}
                <div
                    className="flex-1 overflow-y-auto p-4"
                    onContextMenu={(e) => handleContextMenu(e)}
                >
                    {viewMode === 'grid' ? (
                        <div className="grid grid-cols-[repeat(auto-fill,minmax(100px,1fr))] gap-4">
                            {currentFiles.map((file) => (
                                <div key={file.id} onDoubleClick={() => {
                                    if (file.type === 'folder') {
                                        navigateTo(file.id);
                                    } else {
                                        if (file.name.endsWith('.png') || file.name.endsWith('.jpg') || file.name.endsWith('.jpeg')) {
                                            openWindow('preview', file.name, { props: { fileId: file.id } });
                                        } else if (file.name.endsWith('.txt') || file.name.endsWith('.md') || file.name.endsWith('.json')) {
                                            openWindow('textedit', file.name, { props: { fileId: file.id } });
                                        } else if (file.name.endsWith('.mp3')) {
                                            openWindow('music', 'Music');
                                        }
                                    }
                                }}>
                                    <FileIcon
                                        file={file}
                                        selected={false}
                                        onClick={() => { }}
                                        showLabel={true}
                                        darkLabel
                                        onContextMenu={(e) => {
                                            e.stopPropagation();
                                            handleContextMenu(e, file.id);
                                        }}
                                    />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <table className="w-full text-sm text-left">
                            <thead className="text-gray-400 dark:text-gray-500 font-medium border-b border-gray-100 dark:border-white/5">
                                <tr>
                                    <th className="pb-2 pl-2">Name</th>
                                    <th className="pb-2">Date Modified</th>
                                    <th className="pb-2">Kind</th>
                                </tr>
                            </thead>
                            <tbody className="text-gray-700 dark:text-gray-300">
                                {currentFiles.map((file) => (
                                    <tr key={file.id} className="hover:bg-blue-50 dark:hover:bg-white/5 cursor-default transition-colors" onDoubleClick={() => file.type === 'folder' && navigateTo(file.id)}>
                                        <td className="py-1.5 pl-2 flex items-center gap-2 font-medium">
                                            <div className="w-4 h-4 text-gray-500">
                                                <Folder size={16} fill={file.type === 'folder' ? '#60A5FA' : 'none'} className={file.type === 'folder' ? 'text-blue-400' : 'text-gray-400'} />
                                            </div>
                                            {file.name}
                                        </td>
                                        <td className="py-1.5 text-gray-500 dark:text-gray-500">{format(new Date(), 'MMM d, h:mm a')}</td>
                                        <td className="py-1.5 text-gray-500 dark:text-gray-500">{file.type === 'folder' ? 'Folder' : 'File'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Footer / Status Bar */}
                <div className="h-6 border-t border-gray-200 dark:border-white/10 flex items-center px-4 text-xs text-gray-500 dark:text-gray-400">
                    {currentFiles.length} items
                </div>
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
        </div>
    );
};
