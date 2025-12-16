import React, { useState, useEffect } from 'react';
import { useFileSystem } from '../store/filesystem';
import { Folder, FileText, Download, Monitor, ChevronRight, ChevronLeft, Search, LayoutGrid, List as ListIcon } from 'lucide-react';
import clsx from 'clsx';
import { format } from 'date-fns';
import { FileIcon } from '../components/system/FileIcon';
import type { FileNode } from '../types/filesystem';

const ApplicationIcon = () => <div className="w-4 h-4 bg-transparent border border-gray-400 rounded-sm flex items-center justify-center text-[8px] font-bold">A</div>;

const SidebarItem = ({ icon: Icon, label, active, onClick }: { icon: any, label: string, active: boolean, onClick: () => void }) => (
    <div className={clsx(
        "flex items-center gap-2 px-2 py-1 rounded-md cursor-default text-sm",
        active ? "bg-gray-200 ml-1" : "hover:bg-black/5"
    )} onClick={onClick}>
        <Icon size={16} className={active ? "text-blue-500" : "text-gray-500"} />
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
    const { files, getChildren } = useFileSystem();
    const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    // Initialize to user Home on mount
    useEffect(() => {
        // Find /Users/user
        const allFiles = Object.values(files) as FileNode[];
        const root = allFiles.find(f => f.parentId === null);
        if (root) {
            const home = allFiles.find(f => f.parentId === root.id && f.name === 'Users');
            if (home) {
                const user = allFiles.find(f => f.parentId === home.id && f.name === 'user');
                if (user) {
                    setCurrentFolderId(user.id);
                }
            }
        }
    }, [files]);

    const navigateTo = (folderId: string) => {
        setCurrentFolderId(folderId);
    };

    const currentFiles: FileNode[] = currentFolderId ? getChildren(currentFolderId) : [];

    return (
        <div className="flex h-full w-full bg-white text-black font-sans">
            {/* Sidebar */}
            <div className="w-48 bg-[#F5F5F7]/95 backdrop-blur-xl border-r border-gray-200 flex flex-col pt-3 pb-4 px-2 select-none">
                <div className="flex gap-2 px-2 mb-4">
                    <div className="w-3 h-3 rounded-full bg-transparent" />
                </div>

                <SidebarSection title="Favorites">
                    <SidebarItem icon={Monitor} label="Desktop" active={false} onClick={() => { }} />
                    <SidebarItem icon={FileText} label="Documents" active={false} onClick={() => { }} />
                    <SidebarItem icon={Download} label="Downloads" active={false} onClick={() => { }} />
                    <SidebarItem icon={ApplicationIcon} label="Applications" active={false} onClick={() => { }} />
                </SidebarSection>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 bg-white">
                {/* Toolbar */}
                <div className="h-12 border-b border-gray-200 flex items-center px-4 justify-between bg-[#F5F5F7]/50 backdrop-blur-md">
                    <div className="flex gap-4">
                        <div className="flex gap-1 text-gray-500">
                            <ChevronLeft className="cursor-pointer hover:text-black" />
                            <ChevronRight className="cursor-pointer hover:text-black" />
                        </div>
                        <span className="font-semibold text-sm">
                            {currentFolderId && files[currentFolderId]?.name}
                        </span>
                    </div>

                    <div className="flex gap-2 text-gray-500">
                        <LayoutGrid size={18} className={clsx("cursor-pointer", viewMode === 'grid' && "text-black")} onClick={() => setViewMode('grid')} />
                        <ListIcon size={18} className={clsx("cursor-pointer", viewMode === 'list' && "text-black")} onClick={() => setViewMode('list')} />
                        <Search size={18} className="cursor-pointer hover:text-black ml-4" />
                    </div>
                </div>

                {/* File View */}
                <div className="flex-1 overflow-y-auto p-4">
                    {viewMode === 'grid' ? (
                        <div className="grid grid-cols-[repeat(auto-fill,minmax(100px,1fr))] gap-4">
                            {currentFiles.map((file) => (
                                <div key={file.id} onDoubleClick={() => file.type === 'folder' && navigateTo(file.id)}>
                                    <FileIcon file={file} selected={false} onClick={() => { }} showLabel={true} darkLabel />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <table className="w-full text-sm">
                            <thead className="text-left text-gray-400 font-medium border-b border-gray-100">
                                <tr>
                                    <th className="pb-2 pl-2">Name</th>
                                    <th className="pb-2">Date Modified</th>
                                    <th className="pb-2">Kind</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentFiles.map((file) => (
                                    <tr key={file.id} className="hover:bg-blue-50 cursor-default" onDoubleClick={() => file.type === 'folder' && navigateTo(file.id)}>
                                        <td className="py-1.5 pl-2 flex items-center gap-2">
                                            <div className="w-4 h-4 text-gray-500">
                                                <Folder size={16} fill={file.type === 'folder' ? '#60A5FA' : 'none'} className={file.type === 'folder' ? 'text-blue-400' : 'text-gray-400'} />
                                            </div>
                                            {file.name}
                                        </td>
                                        <td className="py-1.5 text-gray-500">{format(new Date(), 'MMM d, h:mm a')}</td>
                                        <td className="py-1.5 text-gray-500">{file.type === 'folder' ? 'Folder' : 'File'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Footer / Status Bar */}
                <div className="h-6 border-t border-gray-200 flex items-center px-4 text-xs text-gray-500">
                    {currentFiles.length} items
                </div>
            </div>
        </div>
    );
};
