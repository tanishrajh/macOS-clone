import { useEffect, useState } from 'react';
import { useFileSystem } from './store/filesystem';
import { useSettings } from './store/settings';
import { BootSequence } from './components/system/BootSequence';

// Components
import { Desktop } from './components/desktop/Desktop';
import { MenuBar } from './components/system/MenuBar';
import { Dock } from './components/dock/Dock';
import { Spotlight } from './components/system/Spotlight';
import { Launchpad } from './components/system/Launchpad';
import { useWindowManager } from './store/window-manager';
import { useGlobalShortcuts } from './hooks/useGlobalShortcuts';

function App() {
  const [booted, setBooted] = useState(false);
  const [spotlightOpen, setSpotlightOpen] = useState(false);
  const { initialize: initFS } = useFileSystem();

  // Launchpad State
  const { isLaunchpadOpen, toggleLaunchpad } = useWindowManager();

  // Global Shortcuts
  useGlobalShortcuts({
    onSpotlightToggle: () => setSpotlightOpen(prev => !prev)
  });

  // Theme handling
  const { theme } = useSettings();

  useEffect(() => {
    // Initialize FS on mount
    initFS();
  }, []);

  useEffect(() => {
    // Apply theme to body
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  if (!booted) {
    return <BootSequence onComplete={() => setBooted(true)} />;
  }

  return (
    <div className="w-screen h-screen overflow-hidden bg-center bg-cover relative font-sans text-white select-none">
      <Desktop />
      <MenuBar />
      <Dock />
      <Spotlight isOpen={spotlightOpen} onClose={() => setSpotlightOpen(false)} />
      <Launchpad isOpen={isLaunchpadOpen} onClose={() => toggleLaunchpad(false)} />
    </div>
  );
}

export default App;
