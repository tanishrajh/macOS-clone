import React, { useRef } from 'react';
import { Folder, FileText, Image as ImageIcon } from 'lucide-react';
import type { FileNode } from '../../types/filesystem';
import clsx from 'clsx';

interface FileIconProps {
    file: FileNode;
    selected?: boolean;
    onClick?: (e: React.MouseEvent) => void;
    onDoubleClick?: (e: React.MouseEvent) => void;
    className?: string;
    showLabel?: boolean;
    darkLabel?: boolean;
}

export const FileIcon: React.FC<FileIconProps> = ({
    file,
    selected = false,
    onClick,
    onDoubleClick,
    className,
    showLabel = true,
    darkLabel = false
}) => {
    const iconRef = useRef<HTMLDivElement>(null);

    const getIcon = () => {
        // Custom icon check would go here
        if (file.icon) return <img src={file.icon} alt="" className="w-full h-full object-contain" />;

        switch (file.type) {
            case 'folder':
                return <Folder className="w-full h-full text-blue-400 fill-blue-400/20" />;
            default:
                // Check extension or name
                if (file.name.endsWith('.txt')) return <FileText className="w-full h-full text-gray-200" />;
                if (file.name.endsWith('.png') || file.name.endsWith('.jpg')) return <ImageIcon className="w-full h-full text-purple-400" />;
                return <FileText className="w-full h-full text-gray-300" />;
        }
    };

    return (
        <div
            className={clsx(
                "flex flex-col items-center justify-start p-1 w-20 group cursor-pointer",
                selected ? "bg-white/10 rounded-md border border-white/20" : "hover:bg-white/5 rounded-md",
                className
            )}
            onClick={onClick}
            onDoubleClick={onDoubleClick}
            ref={iconRef}
        >
            <div className="w-12 h-12 mb-1 drop-shadow-lg filter">
                {getIcon()}
            </div>

            {showLabel && (
                <span
                    className={clsx(
                        "text-xs text-center font-medium px-1.5 py-0.5 rounded leading-tight break-words w-full line-clamp-2 shadow-sm",
                        selected ? "bg-blue-600 text-white" :
                            darkLabel ? "text-gray-700 dark:text-gray-200 group-hover:bg-gray-200 dark:group-hover:bg-white/10" : "text-white group-hover:text-white drop-shadow-md text-shadow"
                    )}
                    style={darkLabel ? {} : { textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}
                >
                    {file.name}
                </span>
            )}
        </div>
    );
};
