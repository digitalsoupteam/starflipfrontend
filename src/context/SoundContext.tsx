"use client";

/**
 * Sound system — mobile / Telegram Mini App compatible.
 *
 * iOS WKWebView (used by TMA on iPhone) requires audio to be started
 * synchronously inside a user-gesture handler.  We:
 *   1. Pre-create <Audio> nodes for SFX so they can be "unlocked" during a
 *      gesture and then played freely (even from setTimeout) afterwards.
 *   2. Listen with { capture: true } so we catch the event before any child
 *      element can stopPropagation().
 *   3. Include touchstart (fires before click/pointerdown on iOS).
 *   4. No async probe — just always wait for a gesture; simpler and reliable.
 */

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";

const MUSIC_TRACKS = [
  "/assets/sounds/music/hitslab-chiptune-video-game-games-music-457939.mp3",
  "/assets/sounds/music/hitslab-game-gaming-video-game-music-459876.mp3",
  "/assets/sounds/music/hitslab-retro-arcade-game-music-396890.mp3",
];
const SFX_CELL = "/assets/sounds/effects/universfield-video-game-bonus-323603.mp3";
const SFX_WIN  = "/assets/sounds/effects/floraphonic-cute-level-up-1-189852.mp3";

const MUSIC_VOLUME = 0.1;
const CELL_VOLUME  = 1.0;
const WIN_VOLUME   = 1.0;

// All event types that count as the first user gesture for iOS audio unlock
const UNLOCK_EVENTS = ["touchstart", "pointerdown", "click", "keydown"] as const;

interface SoundContextValue {
  isMuted: boolean;
  toggleMute: () => void;
  playCellSound: () => void;
  playWinSound: () => void;
}

const SoundContext = createContext<SoundContextValue>({
  isMuted: false,
  toggleMute: () => {},
  playCellSound: () => {},
  playWinSound: () => {},
});

export function useSound() {
  return useContext(SoundContext);
}

export function SoundProvider({ children }: { children: React.ReactNode }) {
  const [isMuted, setIsMuted] = useState(false);
  const isMutedRef = useRef(false);

  useEffect(() => {
    const saved = localStorage.getItem("sf:muted");
    if (saved === "true") {
      setIsMuted(true);
      isMutedRef.current = true;
    }
  }, []);

  const musicRef    = useRef<HTMLAudioElement | null>(null);
  const trackIdxRef = useRef(0);

  const playNextTrack = useCallback(() => {
    const src = MUSIC_TRACKS[trackIdxRef.current % MUSIC_TRACKS.length];
    trackIdxRef.current += 1;
    const audio = new Audio(src);
    audio.volume = isMutedRef.current ? 0 : MUSIC_VOLUME;
    musicRef.current = audio;
    audio.addEventListener("ended", playNextTrack, { once: true });
    audio.play().catch(() => {});
  }, []);

  // Keep ref in sync so SFX callbacks (which close over ref) see the latest value
  useEffect(() => {
    isMutedRef.current = isMuted;
    const audio = musicRef.current;
    if (!audio) return;
    if (isMuted) {
      audio.volume = 0;
    } else {
      audio.volume = MUSIC_VOLUME;
      // track may have ended silently while muted — restart playback
      if (audio.ended) playNextTrack();
      else if (audio.paused) audio.play().catch(() => {});
    }
  }, [isMuted, playNextTrack]);

  // Pre-created so the iOS unlock gesture sticks to these specific elements
  const cellAudioRef = useRef<HTMLAudioElement | null>(null);
  const winAudioRef  = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    cellAudioRef.current = new Audio(SFX_CELL);
    cellAudioRef.current.volume = CELL_VOLUME;
    winAudioRef.current  = new Audio(SFX_WIN);
    winAudioRef.current.volume  = WIN_VOLUME;
  }, []);

  useEffect(() => {
    // Same function reference required for addEventListener + removeEventListener to match
    const startAudio = () => {
      UNLOCK_EVENTS.forEach((type) =>
        window.removeEventListener(type, startAudio, true),
      );

      // iOS requires a silent play+pause to unlock the element before real playback
      [cellAudioRef.current, winAudioRef.current].forEach((el) => {
        if (!el) return;
        const vol = el.volume;
        el.volume = 0;
        el.play()
          .then(() => {
            el.pause();
            el.currentTime = 0;
            el.volume = vol;
          })
          .catch(() => {});
      });

      // Start background music
      playNextTrack();
    };

    UNLOCK_EVENTS.forEach((type) =>
      window.addEventListener(type, startAudio, { capture: true }),
    );

    return () => {
      UNLOCK_EVENTS.forEach((type) =>
        window.removeEventListener(type, startAudio, true),
      );
    };
  }, [playNextTrack]);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const next = !prev;
      localStorage.setItem("sf:muted", String(next));
      return next;
    });
  }, []);

  const playCellSound = useCallback(() => {
    const el = cellAudioRef.current;
    if (!el || isMutedRef.current) return;
    el.currentTime = 0;
    el.play().catch(() => {});
  }, []);

  const playWinSound = useCallback(() => {
    const el = winAudioRef.current;
    if (!el || isMutedRef.current) return;
    el.currentTime = 0;
    el.play().catch(() => {});
  }, []);

  return (
    <SoundContext.Provider value={{ isMuted, toggleMute, playCellSound, playWinSound }}>
      {children}
    </SoundContext.Provider>
  );
}
