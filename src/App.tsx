import { useEffect, useState } from 'react';
import { useFileSystem } from './store/filesystem';
import { useSettings } from './store/settings';
import { BootSequence } from './components/system/BootSequence';
import { LoginScreen } from './components/system/LoginScreen';

// Components
import { Desktop } from './components/desktop/Desktop';
import { MenuBar } from './components/system/MenuBar';
import { Dock } from './components/dock/Dock';
import { Spotlight } from './components/system/Spotlight';
import { Launchpad } from './components/system/Launchpad';
import { useWindowManager } from './store/window-manager';
import { useGlobalShortcuts } from './hooks/useGlobalShortcuts';

import { AppSwitcher } from './components/system/AppSwitcher';

function App() {
  const [booted, setBooted] = useState(false);
  const [switcherOpen, setSwitcherOpen] = useState(false);
  const { initialize: initFS } = useFileSystem();

  // Window Manager State
  const {
    isLaunchpadOpen,
    toggleLaunchpad,
    focusWindow,
    isSpotlightOpen,
    toggleSpotlight
  } = useWindowManager();

  // Global Shortcuts
  useGlobalShortcuts({
    onSpotlightToggle: () => toggleSpotlight(),
    onAppSwitcherToggle: () => setSwitcherOpen(true)
  });

  // Theme handling
  const { theme } = useSettings();

  useEffect(() => {
    // Initialize FS on mount
    initFS();

    // Prevent default browser context menu globally
    const handleGlobalContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };
    window.addEventListener('contextmenu', handleGlobalContextMenu);
    return () => window.removeEventListener('contextmenu', handleGlobalContextMenu);
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
      <LoginScreen />
      <Desktop />
      <MenuBar />
      <Dock />
      <Spotlight isOpen={isSpotlightOpen} onClose={() => toggleSpotlight(false)} />
      <Launchpad isOpen={isLaunchpadOpen} onClose={() => toggleLaunchpad(false)} />
      <AppSwitcher
        isOpen={switcherOpen}
        onClose={() => setSwitcherOpen(false)}
        onSelect={(windowId) => focusWindow(windowId)}
      />
    </div>
  );
}

export default App;
