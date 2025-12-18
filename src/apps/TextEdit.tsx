import React, { useState, useEffect } from 'react';
import { useFileSystem } from '../store/filesystem';
import { useWindowManager } from '../store/window-manager';
import { Save, FileText } from 'lucide-react';

export const TextEdit: React.FC<{ windowId?: string }> = ({ windowId }) => {
    const { files, createFile } = useFileSystem();
    const { activeWindowId } = useWindowManager();
    const [content, setContent] = useState('');
    const [fileName, setFileName] = useState('Untitled.txt');
    const [docFolderId, setDocFolderId] = useState<string | null>(null);

    useEffect(() => {
        // Locate Documents folder for default saving
        const allFiles = Object.values(files);
        const root = allFiles.find(f => f.parentId === null);
        if (root) {
            const user = allFiles.find(f => f.parentId === allFiles.find(x => x.parentId === root.id && x.name === 'Users')?.id && f.name === 'user');
            if (user) {
                const doc = allFiles.find(f => f.parentId === user.id && f.name === 'Documents');
                if (doc) setDocFolderId(doc.id);
            }
        }
    }, [files]);

    const handleSave = () => {
        if (!docFolderId) return;
        // Simple save: Just create a new file with current content for now
        // De-dupe name
        createFile(docFolderId, fileName, 'file', content);
        alert('File saved to Documents!');
    };

    // Menu Bar Save Listener
    useEffect(() => {
        const onSave = () => {
            if (activeWindowId && activeWindowId === windowId) {
                handleSave();
            }
        };
        window.addEventListener('menu-save', onSave);
        return () => window.removeEventListener('menu-save', onSave);
    }, [activeWindowId, windowId, docFolderId, fileName, content]);

    return (
        <div className="flex flex-col w-full h-full bg-white dark:bg-[#1e1e1e] text-black dark:text-gray-200 font-sans transition-colors duration-300">
            <div className="h-10 bg-gray-100 dark:bg-[#2d2d2d] border-b border-gray-200 dark:border-black/20 flex items-center justify-between px-2 gap-2">
                <div className="flex items-center gap-2">
                    <FileText size={16} className="text-gray-500" />
                    <input
                        className="bg-transparent text-sm font-medium outline-none w-32 focus:underline"
                        value={fileName}
                        onChange={(e) => setFileName(e.target.value)}
                    />
                </div>
                <button onClick={handleSave} className="flex items-center gap-1 px-2 py-1 bg-white dark:bg-[#3a3a3c] border border-gray-300 dark:border-black/50 rounded shadow-sm text-xs hover:bg-gray-50 dark:hover:bg-white/10">
                    <Save size={12} /> Save
                </button>
            </div>
            <textarea
                className="flex-1 p-4 outline-none resize-none font-mono text-sm"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                spellCheck={false}
            />
        </div>
    );
};
