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

  // Mapear vídeos dos heróis e vilões
  const videoSrcMap: Record<string, string> = {
    // Heróis
    batman: "https://cnhmrnnhplpomdszzpxn.supabase.co/storage/v1/object/public/videos/batman.mp4",
    spiderman: "https://cnhmrnnhplpomdszzpxn.supabase.co/storage/v1/object/public/videos/spiderman.mp4",
    superman: "https://cnhmrnnhplpomdszzpxn.supabase.co/storage/v1/object/public/videos/superman.mp4",
    avengers: "https://cnhmrnnhplpomdszzpxn.supabase.co/storage/v1/object/public/videos/avengers.mp4",
    ironman: "https://cnhmrnnhplpomdszzpxn.supabase.co/storage/v1/object/public/videos/ironman.mp4",
    captainamerica: "https://cnhmrnnhplpomdszzpxn.supabase.co/storage/v1/object/public/videos/captainamerica.mp4",
    blackpanther: "https://cnhmrnnhplpomdszzpxn.supabase.co/storage/v1/object/public/videos/blackpanther.mp4",
    deadpool: "https://cnhmrnnhplpomdszzpxn.supabase.co/storage/v1/object/public/videos/deadpool.mp4",
    flash: "https://cnhmrnnhplpomdszzpxn.supabase.co/storage/v1/object/public/videos/flash.mp4",
    wonderwoman: "https://cnhmrnnhplpomdszzpxn.supabase.co/storage/v1/object/public/videos/wonderwoman.mp4",
    greenlantern: "https://cnhmrnnhplpomdszzpxn.supabase.co/storage/v1/object/public/videos/greenlantern.mp4",
    justiceleague: "https://cnhmrnnhplpomdszzpxn.supabase.co/storage/v1/object/public/videos/justiceleague.mp4",
    // Vilões DC
    joker: "https://cnhmrnnhplpomdszzpxn.supabase.co/storage/v1/object/public/videos/joker.mp4",
    harleyquinn: "https://cnhmrnnhplpomdszzpxn.supabase.co/storage/v1/object/public/videos/harleyquinn.mp4",
    lexluthor: "https://cnhmrnnhplpomdszzpxn.supabase.co/storage/v1/object/public/videos/lexluthor.mp4",
    bane: "https://cnhmrnnhplpomdszzpxn.supabase.co/storage/v1/object/public/videos/bane.mp4",
    darkseid: "https://cnhmrnnhplpomdszzpxn.supabase.co/storage/v1/object/public/videos/darkseid.mp4",
    suicidesquad: "https://cnhmrnnhplpomdszzpxn.supabase.co/storage/v1/object/public/videos/suicidesquad.mp4",
    // Vilões Marvel
    thanos: "https://cnhmrnnhplpomdszzpxn.supabase.co/storage/v1/object/public/videos/thanos.mp4",
    doom: "https://cnhmrnnhplpomdszzpxn.supabase.co/storage/v1/object/public/videos/doom.mp4",
    greengoblin: "https://cnhmrnnhplpomdszzpxn.supabase.co/storage/v1/object/public/videos/greengoblin.mp4",
    loki: "https://cnhmrnnhplpomdszzpxn.supabase.co/storage/v1/object/public/videos/loki.mp4",
    redskull: "https://cnhmrnnhplpomdszzpxn.supabase.co/storage/v1/object/public/videos/redskull.mp4",
    ultron: "https://cnhmrnnhplpomdszzpxn.supabase.co/storage/v1/object/public/videos/ultron.mp4",
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
