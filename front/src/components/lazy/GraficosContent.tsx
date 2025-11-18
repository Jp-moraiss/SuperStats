"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import dynamic from 'next/dynamic';
import { FaTimes } from 'react-icons/fa';
import "../../app/graficos/graficos.css";

// Lazy loading do componente de gráficos de popularidade
const PopularidadeEmpresasChart = dynamic(() => import('../charts/PopularidadeEmpresasChart'), {
  loading: () => (
    <div className="loading-container">
      <div className="comic-spinner">📊</div>
      <p>Carregando gráficos de popularidade...</p>
    </div>
  ),
  ssr: false,
});

// Lazy loading do componente de resultados da pesquisa
const PesquisaResultsCharts = dynamic(() => import('../charts/PesquisaResultsCharts'), {
  loading: () => (
    <div className="loading-container">
      <div className="comic-spinner">📊</div>
      <p>Carregando resultados da pesquisa...</p>
    </div>
  ),
  ssr: false,
});

// Dados dos gráficos movidos para um arquivo separado para otimização
const graficos = [
  {
    img: "/images/pizza1.png",
    titulo: "Preferência de Herói",
    descricao: "Análise da preferência dos fãs entre os seus heróis preferidos.",
  },
  {
    img: "/images/pizza2.png",
    titulo: "Personagens preferidos",
    descricao:
      "Análise de acordo com a preferência dos fãs entre Herói, Vilão e Anti-Herói.",
  },
  {
    img: "/images/pizza3.png",
    titulo: "Gênero das pessoas que responderam a pesquisa",
    descricao: "Análise de acordo com os fãs que responderam a pesquisa.",
  },
  {
    img: "/images/pizza4.png",
    titulo: "Preferência de Universo (Marvel vs. DC)",
    descricao:
      "Análise da preferência dos fãs entre os dois maiores universos dos quadrinhos.",
  },
  {
    img: "/images/scatter1.png",
    titulo: "Idade por tempo de acompanhamento",
    descricao:
      "Análise entre a idade dos fãs e o tempo que acompanham os super-heróis.",
  },
  {
    img: "/images/scatter2.png",
    titulo: "Idade por consumo em data de lançamento",
    descricao:
      "Análise entre idade e quantos fãs consomem os lançamentos no mesmo dia.",
  },
  {
    img: "/images/scatter3.png",
    titulo: "Vilão preferido e nota",
    descricao: "Vilão preferido escolhido e a nota dada pelos fãs.",
  },
  {
    img: "/images/scatter4.png",
    titulo: "Idade e filme preferido",
    descricao:
      "Distribuição de idade dos fãs de acordo com o filme favorito de super-heróis.",
  },
  {
    img: "/images/scatter5.png",
    titulo: "Idade e gosto sobre discussões",
    descricao:
      "Distribuição da idade dos fãs quanto ao interesse em debates de teorias.",
  },
  {
    img: "/images/histograma1.png",
    titulo: "Frequência de compra de produtos",
    descricao:
      "Análise quanto à frequência que os fãs compram produtos relacionados a heróis.",
  },
  {
    img: "/images/histograma2.png",
    titulo: "Ocupação",
    descricao: "Distribuição da ocupação atual dos fãs que responderam.",
  },
  {
    img: "/images/histograma3.png",
    titulo: "Participação em eventos",
    descricao:
      "Análise da frequência dos fãs que participaram de eventos geek.",
  },
  {
    img: "/images/histograma4.png",
    titulo: "Pertencimento à comunidade",
    descricao:
      "Análise de pertencimento de fãs dentro de uma comunidade de heróis.",
  },
  {
    img: "/images/histograma5.png",
    titulo: "Envolvimento",
    descricao:
      "Análise quanto ao envolvimento de fãs dentro de uma comunidade de heróis.",
  },
  {
    img: "/images/bolha1.png",
    titulo: "Envolvimento por idade e gênero",
    descricao:
      "Distribuição do envolvimento por idade e gênero nas comunidades geek.",
  },
  {
    img: "/images/bolha2.png",
    titulo: "Ocupação x Compra de conteúdo",
    descricao:
      "Relação entre ocupação, se pagaria por conteúdo e compra de produtos de heróis.",
  },
];

export default function GraficosContent() {
  const [selectedImage, setSelectedImage] = useState<{img: string, titulo: string, descricao: string} | null>(null);

  const handleCardClick = (grafico: {img: string, titulo: string, descricao: string}) => {
    setSelectedImage(grafico);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  // Fechar modal com ESC
  useEffect(() => {
    if (!selectedImage) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedImage(null);
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [selectedImage]);

  return (
    <div className="graficos-container">
      {/* Gráficos de Popularidade */}
      <PopularidadeEmpresasChart />
      
      {/* Resultados da Pesquisa */}
      <PesquisaResultsCharts />
      
      {/* Grid dos gráficos */}
      <div className="graficos-grid">
        {graficos.map((grafico, idx) => (
          <div 
            className="grafico-card" 
            key={idx}
            onClick={() => handleCardClick(grafico)}
          >
            <div className="grafico-img">
              <Image
                src={grafico.img}
                alt={grafico.titulo}
                width={600}
                height={500}
                priority={idx < 2} // Prioriza os primeiros 2 gráficos
                loading={idx < 2 ? "eager" : "lazy"}
              />
            </div>
            <div className="grafico-body">
              <h3>{grafico.titulo}</h3>
              <p>{grafico.descricao}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de Zoom */}
      {selectedImage && (
        <div className="zoom-modal-overlay" onClick={closeModal}>
          <div className="zoom-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="zoom-modal-close" onClick={closeModal}>
              <FaTimes />
            </button>
            <div className="zoom-modal-header">
              <h2 className="zoom-modal-title">{selectedImage.titulo}</h2>
              <p className="zoom-modal-description">{selectedImage.descricao}</p>
            </div>
            <div className="zoom-modal-image">
              <Image
                src={selectedImage.img}
                alt={selectedImage.titulo}
                width={1200}
                height={900}
                style={{ width: '100%', height: 'auto', objectFit: 'contain' }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
