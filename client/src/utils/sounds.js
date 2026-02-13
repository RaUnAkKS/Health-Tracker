/**
 * Play success sound effect using Web Audio API
 */
export const playSuccessSound = () => {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        // Create a pleasant "ding" sound
        oscillator.frequency.value = 800;
        oscillator.type = 'sine';

        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(
            0.01,
            audioContext.currentTime + 0.3
        );

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
    } catch (error) {
        console.log('Audio not supported');
    }
};

/**
 * Play streak milestone sound
 */
export const playStreakSound = () => {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator1 = audioContext.createOscillator();
        const oscillator2 = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator1.connect(gainNode);
        oscillator2.connect(gainNode);
        gainNode.connect(audioContext.destination);

        // Two-tone celebration sound
        oscillator1.frequency.value = 600;
        oscillator2.frequency.value = 900;
        oscillator1.type = 'sine';
        oscillator2.type = 'sine';

        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(
            0.01,
            audioContext.currentTime + 0.5
        );

        oscillator1.start(audioContext.currentTime);
        oscillator2.start(audioContext.currentTime + 0.1);
        oscillator1.stop(audioContext.currentTime + 0.5);
        oscillator2.stop(audioContext.currentTime + 0.6);
    } catch (error) {
        console.log('Audio not supported');
    }
};

/**
 * Play level up celebration sound
 */
export const playLevelUpSound = () => {
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;

        const audioContext = new AudioContext();
        const now = audioContext.currentTime;

        // Ethereal chord (C Major 7)
        const notes = [523.25, 659.25, 783.99, 987.77]; // C5, E5, G5, B5

        notes.forEach((freq, i) => {
            const osc = audioContext.createOscillator();
            const gain = audioContext.createGain();

            osc.type = 'sine';
            osc.frequency.value = freq;

            osc.connect(gain);
            gain.connect(audioContext.destination);

            // Staggered entry
            const startTime = now + (i * 0.1);

            gain.gain.setValueAtTime(0, startTime);
            gain.gain.linearRampToValueAtTime(0.2, startTime + 0.1);
            gain.gain.exponentialRampToValueAtTime(0.01, startTime + 1.5);

            osc.start(startTime);
            osc.stop(startTime + 1.5);
        });

        // Sparkle effect (high freq random notes)
        for (let i = 0; i < 10; i++) {
            const osc = audioContext.createOscillator();
            const gain = audioContext.createGain();

            osc.type = 'triangle';
            osc.frequency.value = 1500 + Math.random() * 1000;

            osc.connect(gain);
            gain.connect(audioContext.destination);

            const time = now + 0.2 + (Math.random() * 0.5);

            gain.gain.setValueAtTime(0, time);
            gain.gain.linearRampToValueAtTime(0.05, time + 0.05);
            gain.gain.exponentialRampToValueAtTime(0.01, time + 0.2);

            osc.start(time);
            osc.stop(time + 0.2);
        }

    } catch (error) {
        console.log('Audio not supported', error);
    }
};

/**
 * Trigger haptic feedback (mobile)
 */
export const triggerHaptic = () => {
    if (navigator.vibrate) {
        navigator.vibrate(50);
    }
};
