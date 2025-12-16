import React, { useState, useEffect, useMemo } from 'react';
import { useFileSystem } from '../../store/filesystem';
import { useSettings } from '../../store/settings';
import { useWindowManager } from '../../store/window-manager';
import { FileIcon } from '../system/FileIcon';
import { WindowFrame } from '../system/WindowFrame';

// Apps
import { Finder } from '../../apps/Finder';
import { SystemSettings } from '../../apps/SystemSettings';
import { Terminal } from '../../apps/Terminal';

// Placeholder Apps
const SafariApp = () => <div className="w-full h-full bg-white"><iframe src="https://www.bing.com" className="w-full h-full border-0" title="Safari" /></div>;

// Map apps to components
const APP_COMPONENTS: Record<string, React.FC> = {
    'finder': Finder,
    'safari': SafariApp,
    'terminal': Terminal,
    'settings': SystemSettings,
};

export const Desktop: React.FC = () => {
    const { wallpaper } = useSettings();
    const { files, getChildren } = useFileSystem();
    const { windows } = useWindowManager();
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

    return (
        <div
            className="absolute inset-0 z-0 bg-cover bg-center overflow-hidden"
            style={{ backgroundImage: wallpaper.includes('gradient') ? wallpaper : `url(${wallpaper})` }}
            onClick={handleBackgroundClick}
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
                        />
                    </div>
                ))}
            </div>

            {/* Windows Layer */}
            {Object.values(windows).map((window) => {
                const AppComponent = APP_COMPONENTS[window.appId] || (() => <div className="p-4 text-gray-500">App not implemented</div>);
                return (
                    <WindowFrame key={window.id} window={window}>
                        <AppComponent />
                    </WindowFrame>
                );
            })}
        </div>
    );
};
