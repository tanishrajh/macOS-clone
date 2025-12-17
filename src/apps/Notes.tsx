import React, { useState, useEffect } from 'react';
import { useFileSystem } from '../store/filesystem';
import { Plus, Trash } from 'lucide-react';
import clsx from 'clsx';

export const Notes: React.FC = () => {
    const { files, createFile, updateFileContent, deleteFile } = useFileSystem();
    const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
    const [notesFolderId, setNotesFolderId] = useState<string | null>(null);

    // Init Notes folder
    useEffect(() => {
        const root = Object.values(files).find(f => f.parentId === null);
        if (root) {
            const users = Object.values(files).find(f => f.parentId === root.id && f.name === 'Users');
            if (users) {
                const user = Object.values(files).find(f => f.parentId === users.id && f.name === 'user');
                if (user) {
                    const doc = Object.values(files).find(f => f.parentId === user.id && f.name === 'Documents');
                    if (doc) {
                        setNotesFolderId(doc.id);
                        // Select first note if success
                        const existingNotes = Object.values(files).filter(f => f.parentId === doc.id && f.name.endsWith('.txt')); // Simple filter
                        if (existingNotes.length > 0 && !activeNoteId) {
                            setActiveNoteId(existingNotes[0].id);
                        }
                    }
                }
            }
        }
    }, [files]);

    const createNote = () => {
        if (!notesFolderId) return;
        const name = `Note ${new Date().toLocaleTimeString()}.txt`;
        createFile(notesFolderId, name, 'file', 'New Note');
    };

    const deleteActiveNote = () => {
        if (activeNoteId) {
            deleteFile(activeNoteId);
            setActiveNoteId(null);
        }
    };

    const notes = notesFolderId
        ? Object.values(files).filter(f => f.parentId === notesFolderId && f.type === 'file')
        : [];

    return (
        <div className="flex w-full h-full bg-white text-black font-sans">
            {/* Sidebar */}
            <div className="w-64 bg-[#F5F5F7] border-r border-gray-200 flex flex-col">
                <div className="h-12 border-b border-gray-200 flex items-center justify-between px-4">
                    <span className="font-bold text-lg">Notes</span>
                    <button onClick={createNote} className="p-1 hover:bg-gray-200 rounded"><Plus size={18} /></button>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {notes.length === 0 && (
                        <div className="p-4 text-center text-gray-400 text-sm">No notes yet</div>
                    )}
                    {notes.map(note => (
                        <div
                            key={note.id}
                            className={clsx(
                                "p-3 border-b border-gray-200 cursor-pointer",
                                activeNoteId === note.id ? "bg-[#FFE080]" : "hover:bg-gray-100"
                            )}
                            onClick={() => setActiveNoteId(note.id)}
                        >
                            <div className="font-bold text-sm truncate">{(note.content || '').split('\n')[0] || 'New Note'}</div>
                            <div className="text-xs text-gray-500 truncate">{new Date().toLocaleDateString()}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Editor */}
            <div className="flex-1 flex flex-col">
                {activeNoteId ? (
                    <>
                        <div className="text-gray-400 text-xs p-2 text-center border-b border-gray-100 flex justify-between items-center px-4">
                            <span>{new Date().toLocaleString()}</span>
                            <button onClick={deleteActiveNote} className="hover:text-red-500"><Trash size={14} /></button>
                        </div>
                        <textarea
                            className="flex-1 p-8 text-lg outline-none resize-none bg-transparent"
                            value={files[activeNoteId]?.content || ''}
                            onChange={(e) => updateFileContent(activeNoteId, e.target.value)}
                            placeholder="Type your note here..."
                        />
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-gray-400">
                        Select or create a note
                    </div>
                )}
            </div>
        </div>
    );
};
