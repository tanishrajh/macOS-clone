export type FileType = 'file' | 'folder';

export interface FileNode {
    id: string;
    parentId: string | null;
    name: string;
    type: FileType;
    content: string | null; // For text files, blob URLs, etc.
    createdAt: number;
    modifiedAt: number;
    icon?: string; // Custom icon path
    isOpen?: boolean; // For folders (finder view state)
    position?: { x: number; y: number }; // Desktop position
}

export interface FileSystemState {
    files: Record<string, FileNode>;
}
