"use client";
import { FaBookReader, FaBook } from 'react-icons/fa';
import { Hq } from '../../types/hqs';
import styles from './HqCard.module.css';
import Image from 'next/image';

type HqCardProps = {
  hq: Hq;
  onToggleRead: (id: number, isRead: boolean) => void;
};

export default function HqCard({ hq, onToggleRead }: HqCardProps) {
  return (
    <div className={styles.hqCard}>
      <div className={styles.coverContainer}>
        <Image src={hq.coverUrl || '/placeholder.png'} alt={`Capa de ${hq.titulo}`} className={styles.coverImage} width={150} height={225} />
        <button 
          className={styles.readButton} 
          onClick={() => onToggleRead(hq.id, hq.lido)}
          aria-label={hq.lido ? "Marcar como não lida" : "Marcar como lida"}
        >
          {hq.lido ? <FaBookReader /> : <FaBook />}
        </button>
      </div>
      <div className={styles.cardInfo}>
        <h3 className={styles.volumeTitle}>{hq.volumeName}</h3>
        <p className={styles.issueTitle}>{hq.titulo}</p>
        <p className={styles.publisher}>{hq.editora}</p>
      </div>
    </div>
  );
}
