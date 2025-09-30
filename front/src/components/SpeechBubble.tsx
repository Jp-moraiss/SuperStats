"use client";

import React, { ReactNode } from "react";
import styles from "./SpeechBubble.module.css";

type BubbleType = "speech" | "whisper" | "electric";

interface SpeechBubbleProps {
  type: BubbleType;
  children: ReactNode;
}

export default function SpeechBubble({ type, children }: SpeechBubbleProps) {
  return (
    <blockquote className={`${styles.bubble} ${styles[type]}`}>
      {children}
    </blockquote>
  );
}
