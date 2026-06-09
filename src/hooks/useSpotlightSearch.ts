import { useMemo } from 'react';
import { useFileSystem } from '../store/filesystem';
import { useWindowManager } from '../store/window-manager';

export type SpotlightResultType = 'math' | 'app' | 'file' | 'web';

export interface SpotlightResult {
    id: string;
    type: SpotlightResultType;
    title: string;
    subtitle: string;
    icon: string;
    preview?: string; // HTML or string content for preview
    action: () => void;
}

const APPS = [
    { id: 'safari', title: 'Safari', subtitle: 'Application', icon: 'safari' },
    { id: 'settings', title: 'System Settings', subtitle: 'Application', icon: 'settings' },
    { id: 'terminal', title: 'Terminal', subtitle: 'Application', icon: 'terminal' },
    { id: 'calculator', title: 'Calculator', subtitle: 'Application', icon: 'calculator' },
    { id: 'calendar', title: 'Calendar', subtitle: 'Application', icon: 'calendar' },
    { id: 'notes', title: 'Notes', subtitle: 'Application', icon: 'notes' },
    { id: 'finder', title: 'Finder', subtitle: 'Application', icon: 'finder' },
    { id: 'music', title: 'Music', subtitle: 'Application', icon: 'music' }
];

export const useSpotlightSearch = (query: string) => {
    const { files } = useFileSystem();
    const { openWindow } = useWindowManager();

    const results = useMemo(() => {
        if (!query.trim()) return [];

        const lowerQuery = query.toLowerCase().trim();
        const found: SpotlightResult[] = [];

        // 1. Math Evaluator
        // Very basic safe regex to check if it's math
        if (/^[\d\s\+\-\*\/\(\)\.]+$/.test(lowerQuery) && lowerQuery.match(/\d/)) {
            try {
                // eslint-disable-next-line no-eval
                const result = eval(lowerQuery);
                if (result !== undefined && !isNaN(result)) {
                    found.push({
                        id: 'math-result',
                        type: 'math',
                        title: String(result),
                        subtitle: 'Calculator',
                        icon: 'calculator',
                        preview: `<div class="flex items-center justify-center h-full w-full"><span class="text-6xl font-light text-black dark:text-white">${result}</span></div>`,
                        action: () => {} // Nothing to open
                    });
                }
            } catch (e) {
                // Not valid math
            }
        }

        // 2. Apps
        const matchingApps = APPS.filter(app => app.title.toLowerCase().includes(lowerQuery));
        matchingApps.forEach(app => {
            found.push({
                id: `app-${app.id}`,
                type: 'app',
                title: app.title,
                subtitle: app.subtitle,
                icon: app.icon, // Maps to FileIcon
                action: () => openWindow(app.id, app.title)
            });
        });

        // 3. Files
        const allFiles = Object.values(files);
        const matchingFiles = allFiles.filter(f => f.name.toLowerCase().includes(lowerQuery));
        matchingFiles.slice(0, 5).forEach(f => {
            found.push({
                id: `file-${f.id}`,
                type: 'file',
                title: f.name,
                subtitle: f.type === 'folder' ? 'Folder' : `${f.extension?.toUpperCase() || 'File'} Document`,
                icon: f.type === 'folder' ? 'folder' : 'file',
                action: () => {
                    if (f.type === 'folder') openWindow('finder', 'Finder', { initialPath: f.id });
                    else openWindow('preview', f.name, { fileId: f.id });
                }
            });
        });

        // 4. Web Search Fallback (If nothing matches, or always at the bottom)
        if (found.length === 0 || lowerQuery.length > 3) {
            found.push({
                id: 'web-search',
                type: 'web',
                title: `Search Web for "${query}"`,
                subtitle: 'Siri Knowledge',
                icon: 'safari',
                preview: `
                    <div class="flex flex-col h-full w-full items-center justify-center p-8 text-center">
                        <div class="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center mb-4">
                            <span class="text-white text-2xl">🌐</span>
                        </div>
                        <h3 class="text-xl font-semibold text-black dark:text-white mb-2">Siri Suggested Website</h3>
                        <p class="text-sm text-gray-500 dark:text-gray-400">Press enter to search Safari for "${query}"</p>
                    </div>
                `,
                action: () => openWindow('safari', 'Safari')
            });
        }

        return found;
    }, [query, files, openWindow]);

    return results;
};
