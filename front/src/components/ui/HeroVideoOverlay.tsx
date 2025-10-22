"use client";

import { useEffect, useRef } from "react";
import styles from "./HeroVideoOverlay.module.css";

interface HeroVideoOverlayProps {
  hero: string | null;
  onClose: () => void;
}

export default function HeroVideoOverlay({ hero, onClose }: HeroVideoOverlayProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  }, [hero]);

  if (!hero) return null;

  // Mapear vídeos dos heróis
  const videoSrcMap: Record<string, string> = {
    batman: "https://cnhmrnnhplpomdszzpxn.supabase.co/storage/v1/object/public/videos/batman.mp4",
    spiderman: "https://cnhmrnnhplpomdszzpxn.supabase.co/storage/v1/object/public/videos/spiderman.mp4",
    superman: "https://cnhmrnnhplpomdszzpxn.supabase.co/storage/v1/object/public/videos/superman.mp4",
    avengers: "https://cnhmrnnhplpomdszzpxn.supabase.co/storage/v1/object/public/videos/avengers.mp4",
  };

  const videoSrc = videoSrcMap[hero];

  return (
    <div className={styles.heroVideoOverlay} onClick={onClose}>
      <video
        ref={videoRef}
        src={videoSrc}
        className={styles.heroVideo}
        autoPlay
        muted
        onEnded={onClose}
      />
      <div className={styles.closeHint}>Clique para fechar</div>
    </div>
  );
}
