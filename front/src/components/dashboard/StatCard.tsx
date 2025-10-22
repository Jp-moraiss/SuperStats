
import styles from './StatCard.module.css';

interface StatCardProps {
  title: string;
  value?: number;
  variant?: 'total' | 'marvel' | 'dc' | 'good' | 'bad' | 'neutral';
  effect?: 'explosion' | 'pow' | 'bam' | 'none';
}

const StatCard = ({ title, value, variant = 'total', effect = 'none' }: StatCardProps) => {
  const getVariantClass = () => {
    switch (variant) {
      case 'marvel': return styles['card--marvel'];
      case 'dc': return styles['card--dc'];
      case 'good': return styles['card--good'];
      case 'bad': return styles['card--bad'];
      case 'neutral': return styles['card--neutral'];
      default: return styles['card--total'];
    }
  };

  const getEffectClass = () => {
    switch (effect) {
      case 'explosion': return styles['card--explosion'];
      case 'pow': return styles['card--pow'];
      case 'bam': return styles['card--bam'];
      default: return '';
    }
  };

  const getMetricClass = () => {
    switch (variant) {
      case 'marvel': return styles['metric--marvel'];
      case 'dc': return styles['metric--dc'];
      case 'good': return styles['metric--good'];
      case 'bad': return styles['metric--bad'];
      case 'neutral': return styles['metric--neutral'];
      default: return styles['metric--total'];
    }
  };

  return (
    <div className={`${styles.card} ${getVariantClass()} ${getEffectClass()}`}>
      <div className={styles.content}>
        <p className={styles.title}>{title}</p>
        <p className={`${styles.metric} ${getMetricClass()}`}>
          {value?.toLocaleString('pt-BR') || 0}
        </p>
      </div>
    </div>
  );
};

export default StatCard;