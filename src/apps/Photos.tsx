import React from 'react';
import { useFileSystem } from '../store/filesystem';

export const Photos: React.FC = () => {
    const { files } = useFileSystem();
    const [activeTab, setActiveTab] = React.useState('Library');
    const [selectedPhoto, setSelectedPhoto] = React.useState<string | null>(null);
    const [picturesFolderId, setPicturesFolderId] = React.useState<string | null>(null);

    // Initial Photos if empty
    React.useEffect(() => {
        const root = Object.values(files).find(f => f.parentId === null);
        if (root) {
            const user = Object.values(files).find(f => f.parentId === Object.values(files).find(x => x.parentId === root.id && x.name === 'Users')?.id && f.name === 'user');
            if (user) {
                const picFolder = Object.values(files).find(f => f.parentId === user.id && f.name === 'Pictures');
                if (picFolder) {
                    setPicturesFolderId(picFolder.id);

                    // Allow "Import" via drag drop later, for now just read files
                }
            }
        }
    }, [files]);

    const photosFromFS = React.useMemo(() => {
        if (!picturesFolderId) return [];
        return Object.values(files)
            .filter(f => f.parentId === picturesFolderId && (f.name.endsWith('.png') || f.name.endsWith('.jpg') || f.name.endsWith('.jpeg')))
            .map(f => f.content || ''); // Content is URL
    }, [files, picturesFolderId]);

    const DEFAULT_PHOTOS = [
        'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=800&auto=format&fit=crop&q=60',
        'https://images.unsplash.com/photo-1518098268026-4e1877433641?w=800&auto=format&fit=crop&q=60',
        'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&auto=format&fit=crop&q=60',
        'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800&auto=format&fit=crop&q=60',
        'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=800&auto=format&fit=crop&q=60',
        'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=800&auto=format&fit=crop&q=60',
        'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&auto=format&fit=crop&q=60',
        'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&auto=format&fit=crop&q=60',
    ];

    const allPhotos = [...DEFAULT_PHOTOS, ...photosFromFS];

    const displayPhotos = activeTab === 'Library' ? allPhotos :
        activeTab === 'Favorites' ? allPhotos.slice(0, 3) :
            allPhotos.slice(4, 7);

    return (
        <div className="flex h-full w-full bg-white dark:bg-[#1c1c1c] text-black dark:text-gray-100 font-sans relative transition-colors duration-300">
            {/* Sidebar */}
            <div className="w-48 bg-[#F5F5F7] dark:bg-[#2c2c2e] border-r border-gray-200 dark:border-white/10 hidden md:flex flex-col p-4 pt-6">
                <div className="text-gray-500 text-xs font-bold uppercase mb-2">Library</div>
                {['Library', 'Favorites', 'Recents'].map(tab => (
                    <div
                        key={tab}
                        className={`px-2 py-1 rounded-md text-sm font-medium mb-1 cursor-pointer hover:bg-black/5 dark:hover:bg-white/10 ${activeTab === tab ? 'bg-[#E0E0E0] dark:bg-white/20 text-black dark:text-white' : 'text-gray-700 dark:text-gray-400'}`}
                        onClick={() => setActiveTab(tab)}
                    >
                        {tab}
                    </div>
                ))}
            </div>

            {/* Grid */}
            <div className="flex-1 overflow-y-auto p-4">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                    {displayPhotos.map((src, i) => (
                        <div
                            key={i}
                            className="aspect-square relative group overflow-hidden bg-gray-100 dark:bg-black/40 cursor-pointer"
                            onClick={() => setSelectedPhoto(src)}
                        >
                            <img src={src} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                        </div>
                    ))}
                </div>
            </div>

            {/* Preview Modal */}
            {selectedPhoto && (
                <div className="absolute inset-0 z-50 bg-black/90 flex items-center justify-center p-8 backdrop-blur-sm" onClick={() => setSelectedPhoto(null)}>
                    <img
                        src={selectedPhoto}
                        className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    />
                    <button className="absolute top-4 right-4 text-white/50 hover:text-white" onClick={() => setSelectedPhoto(null)}>
                        ✕
                    </button>
                </div>
            )}
        </div>
    );
};
