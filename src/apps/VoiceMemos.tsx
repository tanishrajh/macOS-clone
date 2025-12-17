import React, { useState, useRef } from 'react';
import { useFileSystem } from '../store/filesystem';
import { Square, Play, Pause, Trash } from 'lucide-react';
import clsx from 'clsx';

export const VoiceMemos: React.FC = () => {
    const { files, createFile } = useFileSystem();
    const [isRecording, setIsRecording] = useState(false);
    const [recordings, setRecordings] = useState<{ id: string, url: string, date: string, name: string, duration: string }[]>([]);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [duration, setDuration] = useState(0); // Recording duration in seconds
    const [docFolderId, setDocFolderId] = useState<string | null>(null);

    React.useEffect(() => {
        const root = Object.values(files).find(f => f.parentId === null);
        if (root) {
            const user = Object.values(files).find(f => f.parentId === Object.values(files).find(x => x.parentId === root.id && x.name === 'Users')?.id && f.name === 'user');
            if (user) {
                const doc = Object.values(files).find(f => f.parentId === user.id && f.name === 'Documents');
                if (doc) setDocFolderId(doc.id);
            }
        }
    }, [files]);

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const audioRef = useRef<HTMLAudioElement>(null);
    const timerRef = useRef<number | null>(null); // Use number for window.setTimeout or ReturnType<typeof setTimeout>

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            audioChunksRef.current = [];

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            mediaRecorder.onstop = () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                const url = URL.createObjectURL(audioBlob);
                const name = `Recording ${new Date().toLocaleString().replace(/[/,:\s]/g, '-')}.webm`;
                const newRec = {
                    id: Date.now().toString(),
                    url,
                    date: new Date().toLocaleDateString(),
                    name,
                    duration: formatTime(duration)
                };
                setRecordings(prev => [...prev, newRec]);
                setSelectedId(newRec.id);
                setDuration(0);

                if (docFolderId) {
                    // Convert blob to base64 for storage? Or just store object URL (ephemeral)
                    // For now, let's try to read as dataURL
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        createFile(docFolderId, name, 'file', reader.result as string);
                    };
                    reader.readAsDataURL(audioBlob);
                }
            };

            mediaRecorder.start();
            setIsRecording(true);
            setDuration(0);

            timerRef.current = window.setInterval(() => {
                setDuration(prev => prev + 1);
            }, 1000);

        } catch (err) {
            console.error("Error accessing microphone", err);
            alert("Could not access microphone. Please ensure permission is granted.");
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
            mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
        }
    };

    const togglePlayback = () => {
        if (!audioRef.current || !selectedId) return;

        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    const formatTime = (sec: number) => {
        const m = Math.floor(sec / 60);
        const s = sec % 60;
        return `${m}:${s.toString().padStart(2, '0')} `;
    };

    const activeRecording = recordings.find(r => r.id === selectedId);

    return (
        <div className="flex w-full h-full bg-white text-black font-sans">
            {/* Sidebar */}
            <div className="w-64 bg-[#F5F5F7] border-r border-gray-200 flex flex-col">
                <div className="h-12 border-b border-gray-200 flex items-center px-4 font-bold text-lg">
                    All Recordings
                </div>
                <div className="flex-1 overflow-y-auto">
                    {recordings.map(rec => (
                        <div
                            key={rec.id}
                            className={clsx(
                                "p-3 border-b border-gray-200 cursor-pointer",
                                selectedId === rec.id ? "bg-[#FFE080]" : "hover:bg-gray-100"
                            )}
                            onClick={() => { setSelectedId(rec.id); setIsPlaying(false); }}
                        >
                            <div className="font-bold text-sm truncate">{rec.name}</div>
                            <div className="flex justify-between text-xs text-gray-500 mt-1">
                                <span>{rec.date}</span>
                                <span>{rec.duration}</span>
                            </div>
                        </div>
                    ))}
                    {recordings.length === 0 && <div className="p-4 text-center text-gray-400 text-sm">No recordings</div>}
                </div>
            </div>

            {/* Main Area */}
            <div className="flex-1 flex flex-col items-center justify-center bg-white relative">
                {/* Waveform Placeholder */}
                <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
                    <div className="flex gap-1 items-end h-32">
                        {[...Array(20)].map((_, i) => (
                            <div key={i} className="w-2 bg-red-500 rounded-full animate-pulse" style={{ height: `${Math.random() * 100}% `, animationDelay: `${i * 0.1} s` }} />
                        ))}
                    </div>
                </div>

                {selectedId && activeRecording ? (
                    <div className="z-10 text-center">
                        <h2 className="text-2xl font-bold mb-2">{activeRecording.name}</h2>
                        <div className="text-4xl font-light tabular-nums mb-8 text-gray-500">
                            {isPlaying && audioRef.current ? formatTime(Math.floor(audioRef.current.currentTime)) : activeRecording.duration}
                        </div>

                        <div className="flex items-center justify-center gap-6">
                            <button className="w-16 h-16 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg" onClick={togglePlayback}>
                                {isPlaying ? <Pause size={24} fill="white" /> : <Play size={24} fill="white" className="ml-1" />}
                            </button>
                            <button className="text-red-500 hover:bg-red-50 p-3 rounded-full" onClick={() => {
                                setRecordings(prev => prev.filter(r => r.id !== selectedId));
                                setSelectedId(null);
                            }}>
                                <Trash size={20} />
                            </button>
                        </div>
                        <audio
                            ref={audioRef}
                            src={activeRecording.url}
                            onEnded={() => setIsPlaying(false)}
                        />
                    </div>
                ) : (
                    <div className="z-10 text-center">
                        <div className="text-6xl font-thin tabular-nums mb-8 text-gray-800">
                            {formatTime(duration)}
                        </div>
                        <button
                            className={clsx(
                                "w-20 h-20 rounded-full border-4 flex items-center justify-center transition-all shadow-xl",
                                isRecording ? "border-gray-300 bg-white" : "border-red-500 bg-red-500"
                            )}
                            onClick={isRecording ? stopRecording : startRecording}
                        >
                            {isRecording ? <Square size={24} fill="red" className="text-red-500" /> : <div className="text-white font-bold opacity-0">REC</div>}
                        </button>
                        <div className="mt-4 text-gray-400 font-medium">
                            {isRecording ? "Recording..." : "Click to Record"}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
