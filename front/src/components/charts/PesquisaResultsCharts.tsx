"use client";

import { useState, useEffect } from "react";
import { ResponsiveContainer, BarChart, XAxis, YAxis, Tooltip, Bar, PieChart, Pie, Cell, Legend, CartesianGrid } from "recharts";
import styles from "./Chart.module.css";
import "../../app/graficos/graficos.css";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface ChartDataDTO {
  nome: string;
  votos: number;
}

interface PesquisaChartProps {
  endpoint: string;
  title: string;
  chartType: "bar" | "doughnut";
}

const COLORS = [
  "#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6",
  "#ec4899", "#06b6d4", "#84cc16", "#f97316", "#6366f1"
];

function PesquisaChart({ endpoint, title, chartType }: PesquisaChartProps) {
  const [data, setData] = useState<ChartDataDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("jwtToken");
        
        if (!token) {
          setError("Autenticação necessária");
          return;
        }

        const res = await fetch(`${API_URL}/pesquisas${endpoint}`, {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          if (res.status === 401) {
            setError("Sessão expirada. Faça login novamente.");
            return;
          }
          throw new Error("Falha ao buscar dados");
        }

        const result = await res.json();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro ao carregar dados");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [endpoint]);

  if (loading) {
    return (
      <div className={styles.card}>
        <h3 className={styles.title}>{title}</h3>
        <div style={{ padding: "2rem", textAlign: "center" }}>
          <p>Carregando...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.card}>
        <h3 className={styles.title}>{title}</h3>
        <div style={{ padding: "2rem", textAlign: "center", color: "#ef4444" }}>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className={styles.card}>
        <h3 className={styles.title}>{title}</h3>
        <div style={{ padding: "2rem", textAlign: "center", color: "#666" }}>
          <p>Nenhum voto registrado para esta categoria ainda.</p>
        </div>
      </div>
    );
  }

  const chartData = data.map((item) => ({
    name: item.nome,
    value: item.votos,
  }));

  return (
    <div className={styles.card}>
      <h3 className={styles.title}>{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        {chartType === "bar" ? (
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="name" 
              angle={-45}
              textAnchor="end"
              height={100}
              style={{ fontSize: "0.75rem" }}
            />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#3b82f6" />
          </BarChart>
        ) : (
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}

export default function PesquisaResultsCharts() {
  return (
    <div style={{ marginTop: "3rem", marginBottom: "3rem" }}>
      <h2 
        style={{
          fontFamily: "'Bangers', cursive",
          fontSize: "clamp(2rem, 4vw, 3rem)",
          color: "var(--color-primary, #3b82f6)",
          textAlign: "center",
          marginBottom: "2rem",
          textTransform: "uppercase",
          letterSpacing: "2px",
          textShadow: 
            "-2px -2px 0 var(--color-secondary, #000), " +
            "2px -2px 0 var(--color-secondary, #000), " +
            "-2px 2px 0 var(--color-secondary, #000), " +
            "2px 2px 0 var(--color-secondary, #000)",
        }}
      >
        Resultados da Pesquisa
      </h2>
      
      <div 
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
          gap: "2rem",
          marginTop: "2rem",
        }}
        className="pesquisa-charts-grid"
      >
        <PesquisaChart
          endpoint="/resultados/heroi-preferido"
          title="Herói Preferido da Comunidade"
          chartType="doughnut"
        />
        <PesquisaChart
          endpoint="/resultados/vilao-preferido"
          title="Vilão Preferido da Comunidade"
          chartType="doughnut"
        />
        <PesquisaChart
          endpoint="/resultados/personagem-mais-forte"
          title="Herói Mais Forte da Comunidade"
          chartType="bar"
        />
        <PesquisaChart
          endpoint="/resultados/personagem-mais-inteligente"
          title="Personagem Mais Inteligente"
          chartType="bar"
        />
        <PesquisaChart
          endpoint="/resultados/personagem-mais-rapido"
          title="Personagem Mais Rápido"
          chartType="bar"
        />
      </div>
    </div>
  );
}

