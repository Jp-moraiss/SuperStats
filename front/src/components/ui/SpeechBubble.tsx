"use client";

import React, { ReactNode } from "react";
import styles from "./SpeechBubble.module.css";

type BubbleType = "speech" | "whisper" | "electric";

interface SpeechBubbleProps {
  type: BubbleType;
  children: ReactNode;
  style?: React.CSSProperties;
}

export default function SpeechBubble({ type, children, style }: SpeechBubbleProps) {
  return (
    <blockquote className={`${styles.bubble} ${styles[type]}`} style={style}>
      {children}
    </blockquote>
  );
} 
               
                {/* 
                <SpeechBubble type="speech">
                  Someone say <em>chimichangas?</em>
                </SpeechBubble> 

                <SpeechBubble type="whisper">That’s the sound of my brain</SpeechBubble>
           
                <SpeechBubble type="electric">
                  Autobots,<span>Attack!</span>
                </SpeechBubble>
                */} 
