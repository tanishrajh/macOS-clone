import { useEffect } from 'react';


interface ShortcutsProps {
    onSpotlightToggle: () => void;
}

export const useGlobalShortcuts = ({ onSpotlightToggle }: ShortcutsProps) => {
    // const { closeWindow, minimizeWindow } = useWindowManager();

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Cmd+Space -> Spotlight
            if ((e.metaKey || e.ctrlKey) && e.code === 'Space') {
                e.preventDefault();
                onSpotlightToggle();
            }

            // Cmd+W -> Close Active Window
            if ((e.metaKey || e.ctrlKey) && e.key === 'w') {
                e.preventDefault();
                // We'd need to know the active window here. 
                // This hook might need access to activeWindowId state or valid via the store directly if we subscribe.
                // For simplicity, we can let the WindowManager handle logic if we pass the intent.
                // But `closeWindow` needs an ID.
                // Ideally, this logic lives in a component that knows the active window, or we pull activeWindowId from store hook.
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onSpotlightToggle]);
};
