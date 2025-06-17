import React, { useEffect, useRef, useState } from "react";

const SoundToggle = () => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);

  const toggleSound = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((err) => {
          console.error("Playback error:", err);
        });
    }
  };

  // Wait for user interaction, then autoplay
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleFirstInteraction = () => {
      if (!userInteracted) {
        audio.volume = 0.6;
        audio
          .play()
          .then(() => {
            setIsPlaying(true);
            setUserInteracted(true);
          })
          .catch((err) => {
            console.warn("Autoplay blocked:", err);
          });
      }
    };

    // window.addEventListener("click", handleFirstInteraction, { once: true });
    // return () => {
    //   window.removeEventListener("click", handleFirstInteraction);
    // };
  }, [userInteracted]);

  return (
    <>
      <audio ref={audioRef} src="/assets/sound/space.mp3" loop preload="auto" />
      <div className="z-50">
        <button
          onClick={toggleSound}
          className="w-12 h-12 bg-black/60 border border-white rounded-full flex items-center justify-center hover:bg-black/80 transition"
        >
          {isPlaying ? (
            <div className="flex gap-[3px] items-end h-[20px]">
              <div className="w-[3px] h-[8px] bg-gray-400 animate-wave1" />
              <div className="w-[3px] h-[12px] bg-gray-400 animate-wave2" />
              <div className="w-[3px] h-[16px] bg-gray-400 animate-wave3" />
              <div className="w-[3px] h-[10px] bg-gray-400 animate-wave2" />
            </div>
          ) : (
            <div className="w-6 h-[2px] bg-gray-300" />
          )}
        </button>
      </div>
    </>
  );
};

export default SoundToggle;
