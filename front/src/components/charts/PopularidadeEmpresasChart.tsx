"use client";

import { useEffect, useState } from 'react';
import { ResponsiveContainer, BarChart, XAxis, YAxis, Tooltip, Legend, Bar, CartesianGrid } from 'recharts';
import { ApiService, API_ENDPOINTS } from '../../shared';
import styles from './PopularidadeEmpresasChart.module.css';

interface PopularidadeData {
  empresaNome: string;
  totalConsumido: number;
  tipoMidia: 'Filme' | 'HQ';
}

export default function PopularidadeEmpresasChart() {
  const [filmesData, setFilmesData] = useState<PopularidadeData[]>([]);
  const [hqsData, setHqsData] = useState<PopularidadeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await ApiService.get(API_ENDPOINTS.ANALISES_POPULARIDADE_EMPRESAS);
      const data: PopularidadeData[] = await res.json();

      const filmes = data.filter(item => item.tipoMidia === 'Filme');
      const hqs = data.filter(item => item.tipoMidia === 'HQ');

      setFilmesData(filmes);
      setHqsData(hqs);
    } catch (err) {
      console.error('Erro ao carregar dados de popularidade:', err);
      setError('Falha ao carregar dados de popularidade.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Carregando análises...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className={styles.chartsContainer}>
      {/* Gráfico de Produtoras de Filmes */}
      <div className={styles.chartCard}>
        <div className={styles.chartHeader}>
          <h3 className={styles.chartTitle}>Ranking de Popularidade - Produtoras de Filmes</h3>
        </div>
        <div className={styles.chartBody}>
          {filmesData.length === 0 ? (
            <p className={styles.emptyMessage}>Nenhum dado de consumo encontrado para filmes.</p>
          ) : (
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                data={filmesData}
                layout="vertical"
                margin={{ left: 10, right: 30, top: 10, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis type="number" />
                <YAxis 
                  type="category" 
                  dataKey="empresaNome" 
                  width={120}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '2px solid var(--color-secondary)',
                    borderRadius: '8px',
                    fontFamily: 'Comic Neue, cursive',
                  }}
                />
                <Legend />
                <Bar 
                  dataKey="totalConsumido" 
                  fill="rgba(54, 162, 235, 0.8)"
                  name="Nº de Filmes Assistidos"
                  radius={[0, 8, 8, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Gráfico de Editoras de HQs */}
      <div className={styles.chartCard}>
        <div className={styles.chartHeader}>
          <h3 className={styles.chartTitle}>Ranking de Popularidade - Editoras de HQs</h3>
        </div>
        <div className={styles.chartBody}>
          {hqsData.length === 0 ? (
            <p className={styles.emptyMessage}>Nenhum dado de consumo encontrado para HQs.</p>
          ) : (
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                data={hqsData}
                layout="vertical"
                margin={{ left: 10, right: 30, top: 10, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis type="number" />
                <YAxis 
                  type="category" 
                  dataKey="empresaNome" 
                  width={120}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '2px solid var(--color-secondary)',
                    borderRadius: '8px',
                    fontFamily: 'Comic Neue, cursive',
                  }}
                />
                <Legend />
                <Bar 
                  dataKey="totalConsumido" 
                  fill="rgba(255, 99, 132, 0.8)"
                  name="Nº de HQs Lidas"
                  radius={[0, 8, 8, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}

