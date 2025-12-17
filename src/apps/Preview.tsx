import React, { useState, useEffect } from 'react';
import { useFileSystem } from '../store/filesystem';
import { ZoomIn, ZoomOut, RotateCw } from 'lucide-react';

interface PreviewProps {
    fileId?: string; // Passed from WindowManager
}

export const Preview: React.FC<PreviewProps> = ({ fileId }) => {
    const { files } = useFileSystem();
    const [scale, setScale] = useState(1);
    const [rotation, setRotation] = useState(0);

    const file = fileId ? files[fileId] : null;

    useEffect(() => {
        // Reset transform on new file
        setScale(1);
        setRotation(0);
    }, [fileId]);

    if (!file) {
        return (
            <div className="w-full h-full bg-[#FAFAFA] dark:bg-[#1e1e1e] text-gray-500 dark:text-gray-400 flex items-center justify-center font-sans transition-colors duration-300">
                No image selected
            </div>
        );
    }

    // Attempt to extract URL or Content
    // For local files, content might be base64. For builtin, it might be null or URL in metadata?
    // Current file system is simple: content is string.

    // Check if it's music meta (which serves as placeholder for other complex types too?)
    // Or just simple image content (local import?)
    // We assume content IS the url/base64 for images in this simple implementation

    // Wait, music files have JSON content.
    // Let's handle basic image files.
    let src = '';
    if (file.name.endsWith('.png') || file.name.endsWith('.jpg') || file.name.endsWith('.jpeg') || file.name.endsWith('.webp')) {
        src = file.content || '';
    } else if (file.content && file.content.startsWith('http')) {
        src = file.content;
    }

    // Fallback for non-images
    if (!src) {
        return (
            <div className="w-full h-full bg-[#FAFAFA] dark:bg-[#1e1e1e] text-black dark:text-white flex flex-col items-center justify-center font-sans transition-colors duration-300">
                <div className="text-6xl mb-4">📄</div>
                <div className="font-bold">{file.name}</div>
                <div className="text-gray-400 text-sm mt-2">Preview not available</div>
            </div>
        );
    }

    return (
        <div className="flex flex-col w-full h-full bg-[#FAFAFA]/95 dark:bg-[#1e1e1e]/95 backdrop-blur-xl text-black dark:text-white font-sans transition-colors duration-300">
            {/* Toolbar */}
            <div className="h-10 flex items-center justify-center gap-4 bg-[#F5F5F7] dark:bg-[#2c2c2e] border-b border-gray-300 dark:border-[#3a3a3c] shadow-sm relative z-10">
                <div className="absolute left-4 font-semibold text-sm truncate max-w-[200px]">{file.name}</div>
                <button className="p-1 hover:bg-black/5 dark:hover:bg-white/10 rounded" onClick={() => setScale(s => Math.max(0.1, s - 0.1))}><ZoomOut size={16} /></button>
                <button className="p-1 hover:bg-black/5 dark:hover:bg-white/10 rounded" onClick={() => setScale(1)}>{Math.round(scale * 100)}%</button>
                <button className="p-1 hover:bg-black/5 dark:hover:bg-white/10 rounded" onClick={() => setScale(s => s + 0.1)}><ZoomIn size={16} /></button>
                <button className="p-1 hover:bg-black/5 dark:hover:bg-white/10 rounded" onClick={() => setRotation(r => r + 90)}><RotateCw size={16} /></button>
            </div>

            {/* Canvas */}
            <div className="flex-1 overflow-auto flex items-center justify-center p-4">
                <img
                    src={src}
                    className="transition-transform duration-200 max-w-none shadow-2xl"
                    style={{ transform: `scale(${scale}) rotate(${rotation}deg)` }}
                    draggable={false}
                />
            </div>
        </div>
    );
};
