import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, List, Plus, Music as MusicIcon, Search, Maximize2, Minimize2, MoreHorizontal, Folder } from 'lucide-react';
import clsx from 'clsx';
import { useFileSystem } from '../store/filesystem';
import { useWindowManager } from '../store/window-manager';

interface Song {
    id: string;
    title: string;
    artist: string;
    duration: string;
    durationSec: number;
    cover: string;
    url?: string;
    type: 'builtin' | 'local';
}

interface Playlist {
    id: string;
    name: string;
    songIds: string[];
}

export const Music: React.FC = () => {
    const { files, createFile, createFolder, updateFileContent } = useFileSystem();
    const { activeWindowId, resizeWindow } = useWindowManager();

    // Playback State
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentSongIndex, setCurrentSongIndex] = useState(0);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);

    // UI State
    const [activeView, setActiveView] = useState('Listen Now'); // 'Listen Now', 'Songs', or playlist ID
    const [searchQuery, setSearchQuery] = useState('');
    const [isMiniPlayer, setIsMiniPlayer] = useState(false);
    const [showPlaylistModal, setShowPlaylistModal] = useState<string | null>(null); // Song ID to add

    // Data State
    const [musicFolderId, setMusicFolderId] = useState<string | null>(null);
    const [playlistsFolderId, setPlaylistsFolderId] = useState<string | null>(null);
    const [localSongs, setLocalSongs] = useState<Song[]>([]);
    const [playlists, setPlaylists] = useState<Playlist[]>([]);

    const audioRef = useRef<HTMLAudioElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const BUILTIN_SONGS: Song[] = [
        { id: '1', title: 'Blinding Lights', artist: 'The Weeknd', duration: '3:20', durationSec: 200, cover: 'https://images.unsplash.com/photo-1619983081563-430f63602796?w=200&q=80', type: 'builtin', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
        { id: '2', title: 'Anti-Hero', artist: 'Taylor Swift', duration: '3:21', durationSec: 201, cover: 'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=200&q=80', type: 'builtin', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
        { id: '3', title: 'As It Was', artist: 'Harry Styles', duration: '2:47', durationSec: 167, cover: 'https://images.unsplash.com/photo-1504509546545-e000b4a62925?w=200&q=80', type: 'builtin', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
    ];

    // --- File System Init ---
    useEffect(() => {
        const prepareFS = () => {
            let root = Object.values(files).find(f => f.parentId === null);
            if (!root) return;

            let users = Object.values(files).find(f => f.parentId === root.id && f.name === 'Users') || { id: createFolder(root.id, 'Users') };
            // @ts-ignore
            let user = Object.values(files).find(f => f.parentId === users.id && f.name === 'user') || { id: createFolder(users.id || users, 'user') };

            // Music Folder
            // @ts-ignore
            let music = Object.values(files).find(f => f.parentId === user.id && f.name === 'Music');
            if (!music) {
                // @ts-ignore
                music = { id: createFolder(user.id, 'Music') };
            }
            // @ts-ignore
            setMusicFolderId(music.id);

            // Playlists Folder
            // @ts-ignore
            let plFolder = Object.values(files).find(f => f.parentId === music.id && f.name === 'Playlists');
            if (!plFolder) {
                // @ts-ignore
                plFolder = { id: createFolder(music.id, 'Playlists') };
            }
            // @ts-ignore
            setPlaylistsFolderId(plFolder.id);
        };
        prepareFS();
    }, [files, createFolder]);

    // --- Load Data ---
    useEffect(() => {
        if (!musicFolderId) return;

        // Load Songs
        const fsSongs = Object.values(files)
            .filter(f => f.parentId === musicFolderId && (f.name.endsWith('.mp3') || f.name.endsWith('.json')))
            .map((f) => {
                let meta: any = { title: f.name.replace('.mp3', ''), artist: 'Unknown Artist', cover: null };
                let url = f.content || '';

                if (f.content && f.content.startsWith('{') && f.content.includes('"type":"music-meta"')) {
                    try {
                        const parsed = JSON.parse(f.content);
                        if (parsed.type === 'music-meta') {
                            meta = parsed.meta;
                            url = parsed.url;
                        }
                    } catch (e) { }
                }

                return {
                    id: f.id,
                    title: meta.title || f.name.replace('.mp3', ''),
                    artist: meta.artist || 'Unknown Artist',
                    duration: meta.duration || '--:--',
                    durationSec: 0,
                    cover: meta.cover || 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=200&q=80',
                    type: 'local' as const,
                    url
                };
            });
        setLocalSongs(fsSongs);
    }, [files, musicFolderId]);

    useEffect(() => {
        if (!playlistsFolderId) return;

        // Load Playlists
        const fsPlaylists = Object.values(files)
            .filter(f => f.parentId === playlistsFolderId && f.name.endsWith('.json'))
            .map(f => {
                try {
                    const data = JSON.parse(f.content || '{}');
                    return { id: f.id, name: data.name || f.name.replace('.json', ''), songIds: data.songIds || [] };
                } catch {
                    return null;
                }
            })
            .filter(Boolean) as Playlist[];

        setPlaylists(fsPlaylists);
    }, [files, playlistsFolderId]);

    const allSongs = [...BUILTIN_SONGS, ...localSongs];

    // Filtered Songs Logic
    const getVisibleSongs = () => {
        let songs = allSongs;

        // 1. Filter by View (Playlist or All)
        if (activeView !== 'Listen Now' && activeView !== 'Songs' && activeView !== 'Recently Added') {
            const playlist = playlists.find(p => p.id === activeView);
            if (playlist) {
                songs = allSongs.filter(s => playlist.songIds.includes(s.id));
            }
        }

        // 2. Filter by Search
        if (searchQuery) {
            const lowerQuery = searchQuery.toLowerCase();
            songs = songs.filter(s =>
                s.title.toLowerCase().includes(lowerQuery) ||
                s.artist.toLowerCase().includes(lowerQuery)
            );
        }

        return songs;
    };

    const visibleSongs = getVisibleSongs();

    // Find absolute index in allSongs for playback
    const playSongFromVisible = (visibleIndex: number) => {
        const songObj = visibleSongs[visibleIndex];
        const realIndex = allSongs.findIndex(s => s.id === songObj.id);
        if (realIndex !== -1) {
            setCurrentSongIndex(realIndex);
            setIsPlaying(true);
        }
    };

    const currentSong = allSongs[currentSongIndex] || allSongs[0];

    // --- Audio Logic ---
    useEffect(() => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.play().catch(e => console.error("Play failed", e));
            } else {
                audioRef.current.pause();
            }
        }
    }, [isPlaying, currentSong]);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.src = currentSong.url || '';
            if (isPlaying) audioRef.current.play();
        }
    }, [currentSongIndex]); // Only change source when index changes

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            setProgress(audioRef.current.currentTime);
            setDuration(audioRef.current.duration || 0);
        }
    };

    const togglePlay = () => setIsPlaying(!isPlaying);
    const nextSong = () => setCurrentSongIndex((prev) => (prev + 1) % allSongs.length);
    const prevSong = () => setCurrentSongIndex((prev) => (prev - 1 + allSongs.length) % allSongs.length);

    // --- Actions ---
    const handleCreatePlaylist = () => {
        if (!playlistsFolderId) return;
        const name = `Playlist ${playlists.length + 1}`;
        const content = JSON.stringify({ name, songIds: [] });
        createFile(playlistsFolderId, `${name}.json`, 'file', content);
    };

    const handleAddToPlaylist = (playlistId: string, songId: string) => {
        const file = files[playlistId];
        if (!file) return;

        try {
            const data = JSON.parse(file.content || '{}');
            if (!data.songIds) data.songIds = [];
            if (!data.songIds.includes(songId)) {
                data.songIds.push(songId);
                updateFileContent(playlistId, JSON.stringify(data));
            }
            setShowPlaylistModal(null);
        } catch (e) {
            console.error(e);
        }
    };

    const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
        // ... (Keep existing import logic, simplified for brevity but functional)
        const file = e.target.files?.[0];
        if (!file || !musicFolderId) return;

        console.log("Importing file:", file.name);

        let jsmediatags: any = null;
        try {
            // @ts-ignore
            const mod = await import('jsmediatags/dist/jsmediatags.min.js');
            jsmediatags = mod.default || mod || (window as any).jsmediatags;
            console.log("JSMediaTags loaded:", !!jsmediatags);
        } catch (err) {
            console.error("Failed to load jsmediatags", err);
        }

        const reader = new FileReader();
        reader.onload = (evt) => {
            const dataUrl = evt.target?.result as string;
            console.log("File read complete. processing tags...");

            if (jsmediatags) {
                try {
                    new jsmediatags.Reader(file)
                        .setTagsToRead(["title", "artist", "picture", "album"])
                        .read({
                            onSuccess: (tag: any) => {
                                console.log("Tags read success:", tag);
                                const tags = tag.tags;
                                let cover = null;
                                if (tags.picture) {
                                    const { data, format } = tags.picture;
                                    let base64String = "";
                                    for (let i = 0; i < data.length; i++) {
                                        base64String += String.fromCharCode(data[i]);
                                    }
                                    cover = `data:${format};base64,${window.btoa(base64String)}`;
                                }

                                const metaContent = JSON.stringify({
                                    type: 'music-meta',
                                    url: dataUrl,
                                    meta: {
                                        title: tags.title || file.name.replace('.mp3', ''),
                                        artist: tags.artist || 'Unknown Artist',
                                        album: tags.album,
                                        cover
                                    }
                                });

                                console.log("Creating file with meta...");
                                createFile(musicFolderId, file.name, 'file', metaContent);
                            },
                            onError: (error: any) => {
                                console.error("Tags error", error);
                                createFile(musicFolderId, file.name, 'file', dataUrl);
                            }
                        });
                } catch (e) {
                    console.error("Crash during tag reading", e);
                    createFile(musicFolderId, file.name, 'file', dataUrl);
                }
            } else {
                console.warn("JSMediaTags not available, using fallback");
                createFile(musicFolderId, file.name, 'file', dataUrl);
            }
        };
        reader.readAsDataURL(file);
    };

    const toggleMiniPlayer = () => {
        setIsMiniPlayer(!isMiniPlayer);
        // Resize window logic could go here if we had access to precise window resizing constraints
        if (!isMiniPlayer && activeWindowId) {
            resizeWindow(activeWindowId, 300, 350);
        } else if (isMiniPlayer && activeWindowId) {
            resizeWindow(activeWindowId, 800, 500);
        }
    };

    const formatTime = (sec: number) => {
        if (!sec || isNaN(sec)) return "0:00";
        const m = Math.floor(sec / 60);
        const s = Math.floor(sec % 60);
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    // --- Renders ---

    if (isMiniPlayer) {
        return (
            <div className="h-full w-full bg-[#1c1c1c] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden group">
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                    <button onClick={toggleMiniPlayer} className="p-2 hover:bg-white/10 rounded-full">
                        <Maximize2 size={16} />
                    </button>
                </div>

                {/* Background Blur */}
                <img src={currentSong.cover} className="absolute inset-0 w-full h-full object-cover opacity-30 blur-xl" />

                <div className="relative z-10 w-full aspect-square mb-6 shadow-2xl rounded-xl overflow-hidden">
                    <img src={currentSong.cover} className="w-full h-full object-cover" />
                </div>

                <div className="relative z-10 text-center mb-6">
                    <h1 className="text-lg font-bold truncate">{currentSong.title}</h1>
                    <p className="text-sm text-gray-400 truncate">{currentSong.artist}</p>
                </div>

                <div className="relative z-10 flex items-center gap-8">
                    <SkipBack size={24} className="fill-white hover:opacity-70 cursor-pointer" onClick={prevSong} />
                    <button onClick={togglePlay} className="hover:scale-105 transition-transform">
                        {isPlaying ? <Pause size={48} fill="white" /> : <Play size={48} fill="white" />}
                    </button>
                    <SkipForward size={24} className="fill-white hover:opacity-70 cursor-pointer" onClick={nextSong} />
                </div>

                <audio ref={audioRef} onTimeUpdate={handleTimeUpdate} onEnded={() => nextSong()} />
            </div>
        );
    }

    return (
        <div className="flex h-full w-full bg-white dark:bg-[#1c1c1c] text-black dark:text-gray-100 font-sans select-none transition-colors duration-300">
            <audio ref={audioRef} onTimeUpdate={handleTimeUpdate} onEnded={() => nextSong()} />

            {/* Sidebar */}
            <div className="w-56 bg-[#F5F5F7] dark:bg-[#2c2c2e] border-r border-[#E5E5E5] dark:border-white/10 flex flex-col p-4 pt-8 shrink-0">
                <div className="flex items-center gap-2 mb-6 px-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center text-white shadow-md">
                        <MusicIcon size={16} fill="white" />
                    </div>
                    <span className="font-semibold text-lg tracking-tight">Music</span>
                </div>

                <div className="space-y-6 overflow-y-auto flex-1">
                    <div>
                        <div className="text-[#8E8E93] text-xs font-bold px-2 mb-2">Apple Music</div>
                        {['Listen Now', 'Browse', 'Radio'].map(item => (
                            <div
                                key={item}
                                className={clsx("px-2 py-1.5 rounded-[4px] text-sm font-medium mb-0.5 cursor-pointer flex items-center gap-2", activeView === item ? "bg-[#E0E0E0] dark:bg-white/10 text-black dark:text-white" : "text-[#333] dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/5")}
                                onClick={() => setActiveView(item)}
                            >
                                <Play size={14} className={activeView === item ? "fill-current" : "opacity-0"} />
                                {item}
                            </div>
                        ))}
                    </div>

                    <div>
                        <div className="text-[#8E8E93] text-xs font-bold px-2 mb-2">Library</div>
                        {['Songs', 'Recently Added'].map(item => (
                            <div
                                key={item}
                                className={clsx("px-2 py-1.5 rounded-[4px] text-sm font-medium mb-0.5 cursor-pointer flex items-center gap-2", activeView === item ? "bg-[#E0E0E0] dark:bg-white/10 text-black dark:text-white" : "text-[#333] dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/5")}
                                onClick={() => setActiveView(item)}
                            >
                                <MusicIcon size={14} className="opacity-50" />
                                {item}
                            </div>
                        ))}
                    </div>

                    <div>
                        <div className="flex items-center justify-between px-2 mb-2 group">
                            <div className="text-[#8E8E93] text-xs font-bold">Playlists</div>
                            <Plus size={14} className="text-[#8E8E93] cursor-pointer hover:text-black dark:hover:text-white opacity-0 group-hover:opacity-100 transition-opacity" onClick={handleCreatePlaylist} />
                        </div>
                        {playlists.map(pl => (
                            <div
                                key={pl.id}
                                className={clsx("px-2 py-1.5 rounded-[4px] text-sm font-medium mb-0.5 cursor-pointer flex items-center gap-2", activeView === pl.id ? "bg-[#E0E0E0] dark:bg-white/10 text-black dark:text-white" : "text-[#333] dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/5")}
                                onClick={() => setActiveView(pl.id)}
                            >
                                <List size={14} className="opacity-50" />
                                <span className="truncate">{pl.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 bg-white dark:bg-[#1c1c1c]">
                <div className="flex-1 overflow-y-auto">
                    {(activeView === 'Songs' || activeView === 'Recently Added' || playlists.find(p => p.id === activeView)) ? (
                        <div className="p-8">
                            <div className="flex justify-between items-end mb-6">
                                <div>
                                    <h1 className="text-3xl font-bold mb-1">
                                        {playlists.find(p => p.id === activeView)?.name || activeView}
                                    </h1>
                                    <h2 className="text-gray-500">{visibleSongs.length} Songs</h2>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        className="px-4 py-2 bg-gray-200 dark:bg-white/10 hover:bg-gray-300 dark:hover:bg-white/20 rounded-md text-sm font-medium flex items-center gap-2 transition-colors"
                                        onClick={() => setIsMiniPlayer(true)}
                                    >
                                        <Minimize2 size={16} /> Mini Player
                                    </button>
                                    <div className="relative group">
                                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                                        <input
                                            type="text"
                                            placeholder="Search in Songs"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="pl-9 pr-3 py-2 bg-gray-100 dark:bg-white/5 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#ff3b30]/50 w-64"
                                        />
                                    </div>
                                    <button
                                        className="px-4 py-2 bg-[#ff3b30] hover:bg-[#ff3b30]/90 text-white rounded-md text-sm font-medium flex items-center gap-2 transition-colors"
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        <Plus size={16} /> Import
                                    </button>
                                    <input type="file" ref={fileInputRef} className="hidden" accept="audio/*" onChange={handleImport} />
                                </div>
                            </div>

                            <table className="w-full text-sm text-left border-collapse">
                                <thead className="text-[11px] text-[#8E8E93] uppercase font-semibold border-b border-[#E5E5E5] dark:border-white/10">
                                    <tr>
                                        <th className="px-4 py-2 w-12 text-center">#</th>
                                        <th className="px-4 py-2">Title</th>
                                        <th className="px-4 py-2">Artist</th>
                                        <th className="px-4 py-2 text-right">Time</th>
                                        <th className="px-4 py-2 w-10"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {visibleSongs.map((song, i) => (
                                        <tr
                                            key={song.id}
                                            className={clsx(
                                                "group cursor-default hover:bg-[#F2F2F2] dark:hover:bg-white/5",
                                                currentSong.id === song.id && "bg-[#F0F0F0] dark:bg-white/10 text-[#ff3b30]"
                                            )}
                                            onDoubleClick={() => playSongFromVisible(i)}
                                        >
                                            <td className="px-4 py-3 text-center relative group">
                                                <div className={clsx("group-hover:hidden", currentSong.id === song.id && "hidden")}>{i + 1}</div>
                                                <div className={clsx("hidden", currentSong.id === song.id && "block mx-auto animate-pulse")}><Volume2 size={14} /></div>
                                                <div
                                                    className="absolute inset-0 flex items-center justify-center hidden group-hover:flex bg-[#F2F2F2] dark:bg-[#2c2c2e]"
                                                    onClick={(e) => { e.stopPropagation(); playSongFromVisible(i); }}
                                                >
                                                    <Play size={12} fill="currentColor" />
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 font-medium flex items-center gap-2">
                                                {song.type === 'local' && <span className="text-[10px] bg-gray-200 px-1 rounded text-gray-600">LOCAL</span>}
                                                {song.title}
                                            </td>
                                            <td className="px-4 py-3">{song.artist}</td>
                                            <td className="px-4 py-3 text-right text-[#8E8E93] tabular-nums">{song.duration === '--:--' && song.url ? 'MP3' : song.duration}</td>
                                            <td className="px-4 py-3 relative">
                                                <button
                                                    className="opacity-0 group-hover:opacity-100 hover:bg-gray-200 dark:hover:bg-white/20 p-1 rounded"
                                                    onClick={(e) => { e.stopPropagation(); setShowPlaylistModal(song.id); }}
                                                >
                                                    <MoreHorizontal size={14} />
                                                </button>
                                                {showPlaylistModal === song.id && (
                                                    <>
                                                        <div className="fixed inset-0 z-40" onClick={(e) => { e.stopPropagation(); setShowPlaylistModal(null); }} />
                                                        <div className="absolute right-8 top-0 bg-white dark:bg-[#2c2c2e] shadow-xl rounded-lg border border-gray-200 dark:border-black/50 p-1 min-w-[150px] z-50">
                                                            <div className="px-2 py-1 text-xs text-gray-500 font-bold border-b border-gray-100 dark:border-white/10 mb-1">Add to Playlist</div>
                                                            {playlists.length === 0 && <div className="px-2 py-1 text-xs text-gray-400">No playlists</div>}
                                                            {playlists.map(pl => (
                                                                <div
                                                                    key={pl.id}
                                                                    className="px-2 py-1.5 hover:bg-blue-500 hover:text-white rounded text-xs cursor-pointer"
                                                                    onClick={(e) => { e.stopPropagation(); handleAddToPlaylist(pl.id, song.id); }}
                                                                >
                                                                    {pl.name}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        // Listen Now View
                        <div className="p-8 pb-6 flex gap-6 items-end relative overflow-hidden h-full">
                            <div className="absolute top-[-50%] left-[-10%] w-[120%] h-[150%] bg-gradient-to-b from-[#ff3b30]/10 to-transparent blur-3xl pointer-events-none" />
                            <div className="relative z-10 flex gap-6 items-end w-full max-w-4xl mx-auto mb-20">
                                <img src={currentSong.cover} className="w-64 h-64 shadow-2xl rounded-[12px] object-cover" alt="Cover" />
                                <div className="mb-4">
                                    <h2 className="text-4xl font-bold mb-2 tracking-tight">{currentSong.title}</h2>
                                    <h3 className="text-2xl text-[#ff3b30] font-medium mb-6">{currentSong.artist}</h3>
                                    <div className="flex gap-3">
                                        <button className="px-8 py-2.5 bg-[#ff3b30] text-white rounded-[6px] text-lg font-medium hover:bg-[#ff3b30]/90 transition-colors flex items-center gap-2 shadow-lg hover:shadow-xl hover:scale-105 transform transition-all" onClick={togglePlay}>
                                            {isPlaying ? <Pause size={20} fill="white" /> : <Play size={20} fill="white" />}
                                            {isPlaying ? 'Pause' : 'Play'}
                                        </button>
                                        <button className="px-4 py-2.5 bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 rounded-[6px] transition-colors" onClick={() => setIsMiniPlayer(true)}>
                                            <Minimize2 size={20} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Persistent Player Bar */}
                <div className="h-[60px] bg-[#F9F9F9] dark:bg-[#2c2c2e] border-t border-[#D1D1D1] dark:border-black/20 flex items-center px-4 justify-between shrink-0 relative z-20">
                    <div className="flex items-center gap-3 w-[30%] min-w-0">
                        <div className="w-10 h-10 bg-[#E5E5E5] rounded-[3px] overflow-hidden shadow-sm shrink-0 border border-black/5">
                            <img src={currentSong.cover} className="w-full h-full object-cover" />
                        </div>
                        <div className="min-w-0 overflow-hidden">
                            <div className="font-medium text-sm truncate">{currentSong.title}</div>
                            <div className="text-xs text-[#8E8E93] truncate">{currentSong.artist}</div>
                        </div>
                    </div>

                    <div className="flex flex-col items-center justify-center w-[40%]">
                        <div className="flex items-center gap-5 mb-1">
                            <SkipBack size={20} className="fill-[#333] dark:fill-white text-[#333] dark:text-white cursor-pointer hover:opacity-60 transition-opacity" onClick={prevSong} />
                            {isPlaying ? (
                                <Pause size={28} className="fill-[#333] dark:fill-white text-[#333] dark:text-white cursor-pointer hover:scale-105 transition-transform" onClick={togglePlay} />
                            ) : (
                                <Play size={28} className="fill-[#333] dark:fill-white text-[#333] dark:text-white cursor-pointer hover:scale-105 transition-transform" onClick={togglePlay} />
                            )}
                            <SkipForward size={20} className="fill-[#333] dark:fill-white text-[#333] dark:text-white cursor-pointer hover:opacity-60 transition-opacity" onClick={nextSong} />
                        </div>
                        <div className="w-full flex items-center gap-2 group">
                            <span className="text-[10px] text-[#8E8E93] tabular-nums w-8 text-right">{formatTime(progress)}</span>
                            <div className="flex-1 h-[3px] bg-[#D1D1D1] rounded-full relative group/bar cursor-pointer overflow-visible">
                                <div
                                    className="absolute top-0 left-0 h-full bg-[#8E8E93] group-hover/bar:bg-[#ff3b30] rounded-full transition-colors"
                                    style={{ width: `${(progress / (duration || 1)) * 100}%` }}
                                />
                            </div>
                            <span className="text-[10px] text-[#8E8E93] tabular-nums w-8">-{formatTime((duration || 0) - progress)}</span>
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 w-[30%] text-[#8E8E93]">
                        <List size={18} className="cursor-pointer hover:text-[#333] dark:hover:text-white" />
                        <div className="flex items-center gap-2 w-24 group">
                            <Volume2 size={16} />
                            <div className="flex-1 h-[3px] bg-[#D1D1D1] rounded-full overflow-hidden">
                                <div className="h-full w-[70%] bg-[#8E8E93] group-hover:bg-[#555]" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
