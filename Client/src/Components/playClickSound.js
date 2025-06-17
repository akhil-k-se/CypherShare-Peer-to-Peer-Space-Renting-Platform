// src/utils/sound.js

export const playClickSound = () => {
  const clickAudio = new Audio("/assets/sound/click.mp3");
  clickAudio.volume = 0.7; // Optional: adjust volume
  clickAudio.play().catch((err) => {
    console.warn("Click sound blocked:", err);
  });
};
