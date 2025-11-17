"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa";
import styles from './PersonagemDetalhe.module.css';

// Tipos
import { Personagem } from "../../../types/personagens";

// Serviços centralizados
import { ApiService, API_ENDPOINTS } from "../../../shared";

export default function PersonagemDetalhePage() {
    const params = useParams();
    const router = useRouter();
    const [personagem, setPersonagem] = useState<Personagem | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (params.id) {
            loadPersonagemDetails(Number(params.id));
        }
    }, [params.id]);

    const loadPersonagemDetails = async (id: number) => {
        setIsLoading(true);
        setError(null);
        try {
            const res = await ApiService.get(API_ENDPOINTS.PERSONAGEM_BY_ID(id));
            const data: Personagem = await res.json();
            setPersonagem(data);
        } catch (err) {
            console.error("Erro ao carregar detalhes do personagem:", err);
            setError("Erro ao carregar detalhes do personagem.");
        } finally {
            setIsLoading(false);
        }
    };

    const createStatBar = (statName: string, value: number | undefined) => {
        const val = value || 0;
        const percentage = Math.min(val, 100);
        
        return (
            <div className={styles.statBarContainer}>
                <div className={styles.statHeader}>
                    <span className={styles.statName}>{statName}</span>
                    <span className={styles.statValue}>{val}</span>
                </div>
                <div className={styles.statBar}>
                    <div 
                        className={styles.statBarFill}
                        style={{ width: `${percentage}%` }}
                    >
                        <span className={styles.statBarText}>{val}</span>
                    </div>
                </div>
            </div>
        );
    };

    if (isLoading) {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.loadingSpinner}></div>
                <p>Carregando detalhes do personagem...</p>
            </div>
        );
    }

    if (error || !personagem) {
        return (
            <div className={styles.errorContainer}>
                <h2>Erro</h2>
                <p>{error || "Personagem não encontrado."}</p>
                <button 
                    className={styles.backButton}
                    onClick={() => router.push('/personagens')}
                >
                    <FaArrowLeft /> Voltar para Personagens
                </button>
            </div>
        );
    }

    return (
        <div className={styles.detalheContainer}>
            <button 
                className={styles.backButton}
                onClick={() => router.push('/personagens')}
            >
                <FaArrowLeft /> Voltar
            </button>

            <div className={styles.headerSection}>
                <h1 className={styles.characterName}>{personagem.nome}</h1>
            </div>

            <div className={styles.contentGrid}>
                {/* Imagem do Personagem */}
                <div className={styles.imageSection}>
                    <div className={styles.imageWrapper}>
                        <img
                            src={personagem.imagemUrl || '/placeholder-character.png'}
                            alt={personagem.nome}
                            className={styles.characterImage}
                        />
                    </div>
                </div>

                {/* Informações Básicas */}
                <div className={styles.infoSection}>
                    <div className={styles.infoCard}>
                        <h2 className={styles.infoCardTitle}>{personagem.nomeCompleto || personagem.nome}</h2>
                        <p className={styles.infoSubtitle}>
                            {personagem.raca || 'Raça não informada'} - {personagem.genero || 'Gênero não informado'}
                        </p>
                        <hr className={styles.divider} />
                        <div className={styles.infoGrid}>
                            <div className={styles.infoItem}>
                                <strong>Primeira Aparição:</strong>
                                <span>{personagem.primeiraAparicao || 'N/A'}</span>
                            </div>
                            <div className={styles.infoItem}>
                                <strong>Editora:</strong>
                                <span>{personagem.editora || 'N/A'}</span>
                            </div>
                            <div className={styles.infoItem}>
                                <strong>Alinhamento:</strong>
                                <span>{personagem.alinhamento || 'N/A'}</span>
                            </div>
                            <div className={styles.infoItem}>
                                <strong>Ocupação:</strong>
                                <span>{personagem.ocupacao || 'N/A'}</span>
                            </div>
                            <div className={styles.infoItem}>
                                <strong>Naturalidade:</strong>
                                <span>{personagem.naturalidade || 'N/A'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Powerstats */}
                    <div className={styles.infoCard}>
                        <h3 className={styles.infoCardTitle}>Powerstats</h3>
                        {createStatBar('Inteligência', personagem.inteligencia)}
                        {createStatBar('Força', personagem.forca)}
                        {createStatBar('Velocidade', personagem.velocidade)}
                        {createStatBar('Durabilidade', personagem.durabilidade)}
                        {createStatBar('Poder', personagem.poder)}
                        {createStatBar('Combate', personagem.combate)}
                    </div>
                </div>
            </div>

            {/* Bases e Alter Egos */}
            <div className={styles.listsGrid}>
                <div className={styles.listCard}>
                    <h3 className={styles.listCardTitle}>Bases de Operação</h3>
                    {personagem.bases && personagem.bases.length > 0 ? (
                        <ul className={styles.listGroup}>
                            {personagem.bases.map((base, index) => (
                                <li key={index} className={styles.listItem}>{base}</li>
                            ))}
                        </ul>
                    ) : (
                        <p className={styles.emptyList}>Nenhuma informada</p>
                    )}
                </div>

                <div className={styles.listCard}>
                    <h3 className={styles.listCardTitle}>Alter Egos & Apelidos</h3>
                    {personagem.alterEgos && personagem.alterEgos.length > 0 ? (
                        <ul className={styles.listGroup}>
                            {personagem.alterEgos.map((alterEgo, index) => (
                                <li key={index} className={styles.listItem}>{alterEgo}</li>
                            ))}
                        </ul>
                    ) : (
                        <p className={styles.emptyList}>Nenhum informado</p>
                    )}
                </div>
            </div>
        </div>
    );
}

