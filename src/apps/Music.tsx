import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, List, Plus, Music as MusicIcon, Folder } from 'lucide-react';
import clsx from 'clsx';
import { useFileSystem } from '../store/filesystem';

interface Song {
    id: string;
    title: string;
    artist: string;
    duration: string;
    durationSec: number;
    cover: string;
    url?: string; // For built-in or blob url
    type: 'builtin' | 'local';
}

export const Music: React.FC = () => {
    const { files, createFile, createFolder } = useFileSystem();
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentSongIndex, setCurrentSongIndex] = useState(0);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0); // Real duration from audio
    const [activeView, setActiveView] = useState('Listen Now');
    const [musicFolderId, setMusicFolderId] = useState<string | null>(null);
    const [localSongs, setLocalSongs] = useState<Song[]>([]);

    const audioRef = useRef<HTMLAudioElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const BUILTIN_SONGS: Song[] = [
        { id: '1', title: 'Blinding Lights', artist: 'The Weeknd', duration: '3:20', durationSec: 200, cover: 'https://images.unsplash.com/photo-1619983081563-430f63602796?w=200&q=80', type: 'builtin', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' }, // Placeholder MP3
        { id: '2', title: 'Anti-Hero', artist: 'Taylor Swift', duration: '3:21', durationSec: 201, cover: 'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=200&q=80', type: 'builtin', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
        { id: '3', title: 'As It Was', artist: 'Harry Styles', duration: '2:47', durationSec: 167, cover: 'https://images.unsplash.com/photo-1504509546545-e000b4a62925?w=200&q=80', type: 'builtin', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
    ];

    // --- File System Init ---
    useEffect(() => {
        // Ensure standard directory structure exists
        // This is auto-healing logic in case of state corruption or missing valid paths
        const ensureStructure = () => {
            let root = Object.values(files).find(f => f.parentId === null);
            if (!root) return; // Wait for FS init

            // Users
            let users = Object.values(files).find(f => f.parentId === root.id && f.name === 'Users');
            if (!users) {
                createFolder(root.id, 'Users');
                // We can't proceed in this render cycle as state won't update immediately.
                // Next render will find 'Users' and proceed.
                return;
            }

            // user
            let user = Object.values(files).find(f => f.parentId === users.id && f.name === 'user');
            if (!user) {
                createFolder(users.id, 'user');
                return;
            }

            // Music
            let music = Object.values(files).find(f => f.parentId === user.id && f.name === 'Music');
            if (!music) {
                createFolder(user.id, 'Music');
                // Don't need to return, we can wait for next cycle or optimistically assume created.
                // But safer to wait for next cycle to setID.
            } else {
                setMusicFolderId(music.id);
            }
        };

        ensureStructure();
    }, [files, createFolder]);

    // --- Load Local Songs ---
    useEffect(() => {
        if (!musicFolderId) return;

        const fsSongs = Object.values(files)
            .filter(f => f.parentId === musicFolderId && (f.name.endsWith('.mp3') || f.name.endsWith('.json'))) // Handle both
            .map((f) => {
                // Check if content is JSON meta
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

    const allSongs = [...BUILTIN_SONGS, ...localSongs];
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
    }, [isPlaying, currentSongIndex, currentSong]); // Retrigger if song changes

    useEffect(() => {
        // Update audio source when index changes
        if (audioRef.current) {
            audioRef.current.src = currentSong.url || '';
            if (isPlaying) audioRef.current.play();
        }
    }, [currentSongIndex]);

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            setProgress(audioRef.current.currentTime);
            setDuration(audioRef.current.duration || 0);
        }
    };

    const handleEnded = () => {
        nextSong();
    };

    const togglePlay = () => setIsPlaying(!isPlaying);
    const nextSong = () => {
        setCurrentSongIndex((prev) => (prev + 1) % allSongs.length);
    };
    const prevSong = () => {
        setCurrentSongIndex((prev) => (prev - 1 + allSongs.length) % allSongs.length);
    };

    const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !musicFolderId) {
            console.error("No file or music folder", { file, musicFolderId });
            return;
        }

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

    const formatTime = (sec: number) => {
        if (!sec || isNaN(sec)) return "0:00";
        const m = Math.floor(sec / 60);
        const s = Math.floor(sec % 60);
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    return (
        <div className="flex h-full w-full bg-white text-black font-sans select-none">
            <audio
                ref={audioRef}
                onTimeUpdate={handleTimeUpdate}
                onEnded={handleEnded}
            />

            {/* Sidebar */}
            <div className="w-56 bg-[#F5F5F7] border-r border-[#E5E5E5] flex flex-col p-4 pt-8 shrink-0">
                <div className="flex items-center gap-2 mb-6 px-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center text-white shadow-md">
                        <MusicIcon size={16} fill="white" />
                    </div>
                    <span className="font-semibold text-lg tracking-tight">Music</span>
                </div>

                <div className="space-y-6">
                    <div>
                        <div className="text-[#8E8E93] text-xs font-bold px-2 mb-2">Apple Music</div>
                        {['Listen Now', 'Browse', 'Radio'].map(item => (
                            <div
                                key={item}
                                className={clsx("px-2 py-1.5 rounded-[4px] text-sm font-medium mb-0.5 cursor-pointer flex items-center gap-2", activeView === item ? "bg-[#E0E0E0] text-black" : "text-[#333] hover:bg-black/5")}
                                onClick={() => setActiveView(item)}
                            >
                                <Play size={14} className={activeView === item ? "fill-black" : "opacity-0"} />
                                {item}
                            </div>
                        ))}
                    </div>

                    <div>
                        <div className="text-[#8E8E93] text-xs font-bold px-2 mb-2">Library</div>
                        {['Recently Added', 'Artists', 'Albums', 'Songs'].map(item => (
                            <div
                                key={item}
                                className={clsx("px-2 py-1.5 rounded-[4px] text-sm font-medium mb-0.5 cursor-pointer flex items-center gap-2", activeView === item ? "bg-[#E0E0E0] text-black" : "text-[#333] hover:bg-black/5")}
                                onClick={() => setActiveView(item)}
                            >
                                {item === 'Recently Added' && <Folder size={14} className="text-gray-500" />}
                                {item !== 'Recently Added' && <MusicIcon size={14} className="text-gray-500" />}
                                {item}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 bg-white">
                <div className="flex-1 overflow-y-auto">
                    {activeView === 'Songs' || activeView === 'Recently Added' ? (
                        <div className="p-8">
                            <div className="flex justify-between items-end mb-6">
                                <div>
                                    <h1 className="text-3xl font-bold mb-1">{activeView}</h1>
                                    <h2 className="text-gray-500">{allSongs.length} Songs</h2>
                                </div>
                                <div className="relative">
                                    <button
                                        className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-sm font-medium flex items-center gap-2 transition-colors"
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        <Plus size={16} /> Import Music
                                    </button>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        className="hidden"
                                        accept="audio/*"
                                        onChange={handleImport}
                                    />
                                </div>
                            </div>

                            <table className="w-full text-sm text-left border-collapse">
                                <thead className="text-[11px] text-[#8E8E93] uppercase font-semibold border-b border-[#E5E5E5]">
                                    <tr>
                                        <th className="px-4 py-2 w-12 text-center">#</th>
                                        <th className="px-4 py-2">Title</th>
                                        <th className="px-4 py-2">Artist</th>
                                        <th className="px-4 py-2 text-right">Time</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {allSongs.map((song, i) => (
                                        <tr
                                            key={song.id}
                                            className={clsx(
                                                "group cursor-default hover:bg-[#F2F2F2]",
                                                currentSongIndex === i && "bg-[#F0F0F0] text-[#ff3b30]"
                                            )}
                                            onDoubleClick={() => { setCurrentSongIndex(i); setIsPlaying(true); }}
                                        >
                                            <td className="px-4 py-3 text-center relative group">
                                                <div className={clsx("group-hover:hidden", currentSongIndex === i && "hidden")}>{i + 1}</div>
                                                <div className={clsx("hidden", currentSongIndex === i && "block mx-auto animate-pulse")}><Volume2 size={14} /></div>
                                                <div
                                                    className="absolute inset-0 flex items-center justify-center hidden group-hover:flex bg-[#F2F2F2]"
                                                    onClick={(e) => { e.stopPropagation(); setCurrentSongIndex(i); setIsPlaying(true); }}
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
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        // Listen Now View
                        <div className="p-8 pb-6 flex gap-6 items-end relative overflow-hidden">
                            <div className="absolute top-[-50%] left-[-10%] w-[120%] h-[150%] bg-gradient-to-b from-[#ff3b30]/10 to-transparent blur-3xl pointer-events-none" />
                            <img src={currentSong.cover} className="w-44 h-44 shadow-2xl rounded-[6px] object-cover relative z-10" alt="Cover" />
                            <div className="relative z-10 mb-2">
                                <h2 className="text-3xl font-bold mb-1 tracking-tight">{currentSong.title}</h2>
                                <h3 className="text-xl text-[#ff3b30] font-medium">{currentSong.artist}</h3>
                                <div className="mt-4 flex gap-3">
                                    <button className="px-6 py-1.5 bg-[#ff3b30] text-white rounded-[4px] text-sm font-medium hover:bg-[#ff3b30]/90 transition-colors flex items-center gap-2" onClick={togglePlay}>
                                        {isPlaying ? <Pause size={14} fill="white" /> : <Play size={14} fill="white" />}
                                        {isPlaying ? 'Pause' : 'Play'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Persistent Player Bar */}
                <div className="h-[60px] bg-[#F9F9F9] border-t border-[#D1D1D1] flex items-center px-4 justify-between shrink-0 relative z-20">
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
                            <SkipBack size={20} className="fill-[#333] text-[#333] cursor-pointer hover:opacity-60 transition-opacity" onClick={prevSong} />
                            {isPlaying ? (
                                <Pause size={28} className="fill-[#333] text-[#333] cursor-pointer hover:scale-105 transition-transform" onClick={togglePlay} />
                            ) : (
                                <Play size={28} className="fill-[#333] text-[#333] cursor-pointer hover:scale-105 transition-transform" onClick={togglePlay} />
                            )}
                            <SkipForward size={20} className="fill-[#333] text-[#333] cursor-pointer hover:opacity-60 transition-opacity" onClick={nextSong} />
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
                        <List size={18} className="cursor-pointer hover:text-[#333]" />
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
