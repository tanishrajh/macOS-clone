import { v4 as uuidv4 } from 'uuid';
import type { FileNode } from '../types/filesystem';

const createFolder = (name: string, parentId: string | null): FileNode => ({
    id: uuidv4(),
    parentId,
    name,
    type: 'folder',
    content: null,
    createdAt: Date.now(),
    modifiedAt: Date.now(),
});

export const generateInitialFileSystem = (): Record<string, FileNode> => {
    const rootId = 'root';
    const root: FileNode = {
        id: rootId,
        parentId: null,
        name: 'Macintosh HD',
        type: 'folder',
        content: null,
        createdAt: Date.now(),
        modifiedAt: Date.now(),
    };

    const appsId = uuidv4();
    const usersId = uuidv4();
    const systemId = uuidv4();

    const userId = uuidv4();

    // Standard User Folders
    const desktopId = uuidv4();
    const documentsId = uuidv4();
    const downloadsId = uuidv4();
    const picturesId = uuidv4();
    const musicId = uuidv4();
    const moviesId = uuidv4();

    const files: Record<string, FileNode> = {
        [rootId]: root,

        // Top Level
        [appsId]: { ...createFolder('Applications', rootId), id: appsId },
        [usersId]: { ...createFolder('Users', rootId), id: usersId },
        [systemId]: { ...createFolder('System', rootId), id: systemId },

        // User Level
        [userId]: { ...createFolder('user', usersId), id: userId },

        // User Home
        [desktopId]: { ...createFolder('Desktop', userId), id: desktopId },
        [documentsId]: { ...createFolder('Documents', userId), id: documentsId },
        [downloadsId]: { ...createFolder('Downloads', userId), id: downloadsId },
        [picturesId]: { ...createFolder('Pictures', userId), id: picturesId },
        [musicId]: { ...createFolder('Music', userId), id: musicId },
        [moviesId]: { ...createFolder('Movies', userId), id: moviesId },
    };

    // Add some default apps (metadata only for now)
    // We will populate this more as we build apps

    // Add a welcome file to Desktop
    const welcomeId = uuidv4();
    files[welcomeId] = {
        id: welcomeId,
        parentId: desktopId,
        name: 'Welcome.txt',
        type: 'file',
        content: 'Welcome to macOS Web!',
        createdAt: Date.now(),
        modifiedAt: Date.now(),
        position: { x: 20, y: 20 }
    };

    // Default Photos
    const photo1 = uuidv4();
    files[photo1] = {
        id: photo1,
        parentId: picturesId,
        name: 'Mountain.jpg',
        type: 'file',
        content: 'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=800&auto=format&fit=crop&q=60',
        createdAt: Date.now(),
        modifiedAt: Date.now()
    };

    const photo2 = uuidv4();
    files[photo2] = {
        id: photo2,
        parentId: picturesId,
        name: 'Ocean.jpg',
        type: 'file',
        content: 'https://images.unsplash.com/photo-1518098268026-4e1877433641?w=800&auto=format&fit=crop&q=60',
        createdAt: Date.now(),
        modifiedAt: Date.now()
    };

    // Default Music
    const song1 = uuidv4();
    files[song1] = {
        id: song1,
        parentId: musicId,
        name: 'Song 1.mp3',
        type: 'file',
        content: JSON.stringify({
            title: 'Blinding Lights',
            artist: 'The Weeknd',
            url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
        }),
        createdAt: Date.now(),
        modifiedAt: Date.now()
    };

    return files;
};
