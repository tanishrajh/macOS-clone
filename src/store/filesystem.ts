import { create } from 'zustand';
import { get as getDB, set as setDB } from 'idb-keyval';
import type { FileNode } from '../types/filesystem';
import { generateInitialFileSystem } from '../utils/initial-fs';
import { v4 as uuidv4 } from 'uuid';

interface FileSystemStore {
    files: Record<string, FileNode>;
    initialized: boolean;

    // Actions
    initialize: () => Promise<void>;
    createFile: (parentId: string, name: string, type: 'file' | 'folder', content?: string) => string;
    createFolder: (parentId: string, name: string) => string;
    deleteFile: (id: string) => void;
    renameFile: (id: string, newName: string) => void;
    updateFileContent: (id: string, content: string) => void;
    moveFile: (id: string, newParentId: string) => void;
    updateFilePosition: (id: string, x: number, y: number) => void;

    // Getters
    getChildren: (parentId: string) => FileNode[];
    getFile: (id: string) => FileNode | undefined;
}

const DB_KEY = 'macos-filesystem-v1';

export const useFileSystem = create<FileSystemStore>((set, get) => ({
    files: {},
    initialized: false,

    initialize: async () => {
        if (get().initialized) return;

        // Try load from DB
        const persisted = (await getDB(DB_KEY)) as Record<string, FileNode>;

        if (persisted) {
            set({ files: persisted, initialized: true });
        } else {
            // First boot
            const initial = generateInitialFileSystem();
            await setDB(DB_KEY, initial);
            set({ files: initial, initialized: true });
        }
    },

    createFile: (parentId, name, type, content = '') => {
        const id = uuidv4();
        const newFile: FileNode = {
            id,
            parentId,
            name,
            type,
            content: type === 'file' ? content : null,
            createdAt: Date.now(),
            modifiedAt: Date.now(),
            position: { x: 0, y: 0 } // Default, should be calculated by desktop
        };

        set(state => {
            const next = { ...state.files, [id]: newFile };
            // Async persist
            setDB(DB_KEY, next);
            return { files: next };
        });

        return id;
    },

    createFolder: (parentId, name) => {
        const id = uuidv4();
        const newFolder: FileNode = {
            id,
            parentId,
            name,
            type: 'folder',
            content: null,
            createdAt: Date.now(),
            modifiedAt: Date.now(),
            position: { x: 0, y: 0 }
        };

        set((state) => {
            const newFiles = { ...state.files, [id]: newFolder };
            setDB(DB_KEY, newFiles);
            return { files: newFiles };
        });
        return id;
    },

    deleteFile: (id) => {
        set(state => {
            const next = { ...state.files };

            // Recursive delete helper
            const deleteRecursive = (nodeId: string) => {
                // Find children
                Object.values(next).forEach(node => {
                    if (node.parentId === nodeId) {
                        deleteRecursive(node.id);
                    }
                });
                delete next[nodeId];
            };

            deleteRecursive(id);
            setDB(DB_KEY, next);
            return { files: next };
        });
    },

    renameFile: (id, newName) => {
        set(state => {
            const file = state.files[id];
            if (!file) return state;
            const next = {
                ...state.files,
                [id]: { ...file, name: newName, modifiedAt: Date.now() }
            };
            setDB(DB_KEY, next);
            return { files: next };
        });
    },

    updateFileContent: (id, content) => {
        set(state => {
            const file = state.files[id];
            if (!file) return state;
            const next = {
                ...state.files,
                [id]: { ...file, content, modifiedAt: Date.now() }
            };
            setDB(DB_KEY, next);
            return { files: next };
        });
    },

    moveFile: (id, newParentId) => {
        set(state => {
            const file = state.files[id];
            if (!file) return state;
            const next = {
                ...state.files,
                [id]: { ...file, parentId: newParentId, modifiedAt: Date.now() }
            };
            setDB(DB_KEY, next);
            return { files: next };
        });
    },

    updateFilePosition: (id, x, y) => {
        set(state => {
            const file = state.files[id];
            if (!file) return state;
            const next = {
                ...state.files,
                [id]: { ...file, position: { x, y } }
            };
            setDB(DB_KEY, next);
            return { files: next };
        });
    },

    getChildren: (parentId) => {
        return Object.values(get().files).filter(f => f.parentId === parentId);
    },

    getFile: (id) => get().files[id],
}));
