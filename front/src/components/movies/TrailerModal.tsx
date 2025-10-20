// src/components/movies/TrailerModal.tsx
"use client"; // Mantenha esta diretiva, se não estiver já no arquivo

import { FaTimes } from 'react-icons/fa';
import styles from './TrailerModal.module.css';

type TrailerModalProps = {
  trailerUrl: string;
  onClose: () => void;
};

export default function TrailerModal({ trailerUrl, onClose }: TrailerModalProps) {
  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>
          <FaTimes />
        </button>
        <div className={styles.videoWrapper}>
          <iframe
            src={trailerUrl}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </div>
  );
}