import React, { useState, useEffect } from 'react';
import { useFileSystem } from '../store/filesystem';
import { Save, FileText } from 'lucide-react';

export const TextEdit: React.FC = () => {
    const { files, createFile } = useFileSystem();
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

    return (
        <div className="flex flex-col w-full h-full bg-white text-black font-sans">
            <div className="h-10 bg-gray-100 border-b border-gray-200 flex items-center justify-between px-2 gap-2">
                <div className="flex items-center gap-2">
                    <FileText size={16} className="text-gray-500" />
                    <input
                        className="bg-transparent text-sm font-medium outline-none w-32 focus:underline"
                        value={fileName}
                        onChange={(e) => setFileName(e.target.value)}
                    />
                </div>
                <button onClick={handleSave} className="flex items-center gap-1 px-2 py-1 bg-white border border-gray-300 rounded shadow-sm text-xs hover:bg-gray-50">
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
