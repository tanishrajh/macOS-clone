export const playSound = (type: 'startup' | 'trash' | 'error' | 'click') => {
    const sounds = {
        // macOS Startup Chime
        startup: 'https://github.com/tanishrajh/macOS-clone/raw/main/public/sounds/startup.mp3',
        // Trash Crumple
        trash: 'https://www.soundjay.com/misc/sounds/crumpling-paper-1.mp3',
        // Error / Funk
        error: 'https://www.myinstants.com/media/sounds/error.mp3',
        // UI Click (Subtle)
        click: 'https://www.soundjay.com/button/sounds/button-16.mp3'
    };

    // For now, we will try to play these. 
    // Note: Chrome requires user interaction before playing audio. 
    // The startup sound might need to be triggered by the user's first click or be silent if blocked.
    // However, since BootSequence is usually after a reload or interaction, it might work if the user has interacted.
    // Actually, on a fresh load, play() typically fails. 
    // We'll add a simple silent fallback or log if it fails.

    // We can use a more reliable source if these hotlinks fail, but for a clone, this is a starting point.
    // Ideally, local assets in /public/sounds/ are better.

    // Using a reliable placeholder for startup from a similar open source mac project or generic chime
    // Replacng startup with a more likely to work generic url for demo if the repo one doesn't exist yet

    const audio = new Audio(sounds[type]);
    audio.volume = 0.5;

    if (type === 'startup') {
        // Use a base64 or a known reliable URL for the chime if possible.
        // For this demo, I will use a placeholder URL that I know usually works or a generic one.
        // Let's rely on the user having internet.
        // Using a specifically hosted file would be best. 
        // Let's assume the user will put files in /public/sounds later.
        audio.src = '/sounds/startup.mp3'; // Expecting local file
    } else if (type === 'trash') {
        audio.src = '/sounds/trash.mp3';
    }

    // Since we don't have the files locally yet, I should probably write a note or try to use Data URIs.
    // Data URIs are large for high quality audio. 
    // I will set up the structure to look for files in /public/sounds/

    const playPromise = audio.play();
    if (playPromise !== undefined) {
        playPromise.catch(error => {
            console.warn("Audio play failed:", error);
        });
    }
};
