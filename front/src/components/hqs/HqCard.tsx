// src/components/hqs/HqCard.tsx

"use client";
import { FaBookReader, FaBook } from 'react-icons/fa';
import { Hq } from '../../types/hqs';
import styles from './HqCard.module.css';
import Image from 'next/image';

type HqCardProps = {
  hq: Hq;
  onToggleRead: (id: number, isRead: boolean) => void;
};

// Pequena função utilitária para formatar a data
const formatDate = (dateString?: string) => {
  if (!dateString) return 'N/A';
  try {
    const parts = dateString.split('-'); // YYYY-MM-DD
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`; // DD/MM/YYYY
    }
    return dateString;
  } catch (e) {
    return dateString;
  }
};

export default function HqCard({ hq, onToggleRead }: HqCardProps) {
  const dataFormatada = formatDate(hq.dataLancamento);

  return (
    <div className={styles.hqCard}>
      <div className={styles.coverContainer}>
        <Image 
          src={hq.coverUrl || '/placeholder.png'} 
          alt={`Capa de ${hq.titulo}`} 
          className={styles.coverImage} 
          width={500} // Aumentado para melhor qualidade/proporção
          height={750}
          style={{ objectFit: 'cover' }}
        />
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
        <p className={styles.publisher}>{hq.editora || 'Editora N/A'}</p>
        <p className={styles.details}>
          <strong>Edição:</strong> {hq.edicao || 'N/A'}
        </p>
         <p className={styles.details}>
          <strong>Lançamento:</strong> {dataFormatada}
        </p>
      </div>
    </div>
  );
}