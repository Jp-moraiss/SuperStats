"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import styles from './PesquisaPage.module.css';
import { debounce } from 'lodash';
import { FaSearch, FaCheckCircle, FaSpinner, FaUser, FaTimes } from 'react-icons/fa';
import { ApiService, API_ENDPOINTS } from "../../shared";
import { Pergunta, RespostaDTO, PersonagemAutocomplete } from "../../types/pesquisa";

const PESQUISA_ID = 1; // ID da pesquisa padrão

export default function PesquisaPage() {
    const [perguntas, setPerguntas] = useState<Pergunta[]>([]);
    const [respostas, setRespostas] = useState<Record<number, PersonagemAutocomplete>>({});
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<{ type: 'success' | 'error' | 'warning' | null; message: string }>({ type: null, message: '' });
    
    // Estados para autocomplete
    const [activeAutocomplete, setActiveAutocomplete] = useState<number | null>(null);
    const [autocompleteResults, setAutocompleteResults] = useState<Record<number, PersonagemAutocomplete[]>>({});
    const [searching, setSearching] = useState<Record<number, boolean>>({});
    const [searchQueries, setSearchQueries] = useState<Record<number, string>>({});
    
    const autocompleteRefs = useRef<Record<number, HTMLDivElement | null>>({});
    const inputRefs = useRef<Record<number, HTMLInputElement | null>>({});

    useEffect(() => {
        loadPerguntas();
        
        // Fechar autocomplete ao clicar fora
        const handleClickOutside = (event: MouseEvent) => {
            if (activeAutocomplete !== null) {
                const ref = autocompleteRefs.current[activeAutocomplete];
                const inputRef = inputRefs.current[activeAutocomplete];
                if (ref && !ref.contains(event.target as Node) && inputRef && !inputRef.contains(event.target as Node)) {
                    setActiveAutocomplete(null);
                }
            }
        };
        
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [activeAutocomplete]);

    const loadPerguntas = async () => {
        try {
            setLoading(true);
            const res = await ApiService.get(API_ENDPOINTS.PESQUISAS_PERGUNTAS(PESQUISA_ID));
            const data: Pergunta[] = await res.json();
            setPerguntas(data);
        } catch (error) {
            console.error("Erro ao carregar perguntas:", error);
            setSubmitStatus({ type: 'error', message: 'Erro ao carregar perguntas. Tente novamente.' });
        } finally {
            setLoading(false);
        }
    };

    const searchCharacters = useCallback(
        debounce(async (perguntaId: number, query: string) => {
            if (query.length < 2) {
                setAutocompleteResults(prev => ({ ...prev, [perguntaId]: [] }));
                setSearching(prev => ({ ...prev, [perguntaId]: false }));
                return;
            }

            setSearching(prev => ({ ...prev, [perguntaId]: true }));
            try {
                const res = await ApiService.get(API_ENDPOINTS.PERSONAGENS_AUTOCOMPLETE(query));
                const characters: PersonagemAutocomplete[] = await res.json();
                setAutocompleteResults(prev => ({ ...prev, [perguntaId]: characters }));
            } catch (error) {
                console.error("Erro ao buscar personagens:", error);
                setAutocompleteResults(prev => ({ ...prev, [perguntaId]: [] }));
            } finally {
                setSearching(prev => ({ ...prev, [perguntaId]: false }));
            }
        }, 500),
        []
    );

    const handleInputChange = (perguntaId: number, value: string) => {
        setSearchQueries(prev => ({ ...prev, [perguntaId]: value }));
        
        // Limpar resposta se o usuário mudar o texto
        if (respostas[perguntaId] && value !== respostas[perguntaId].name) {
            setRespostas(prev => {
                const newRespostas = { ...prev };
                delete newRespostas[perguntaId];
                return newRespostas;
            });
        }
        
        setActiveAutocomplete(perguntaId);
        searchCharacters(perguntaId, value);
    };

    const selectCharacter = (perguntaId: number, character: PersonagemAutocomplete) => {
        setRespostas(prev => ({ ...prev, [perguntaId]: character }));
        setSearchQueries(prev => ({ ...prev, [perguntaId]: character.name }));
        setActiveAutocomplete(null);
        setAutocompleteResults(prev => ({ ...prev, [perguntaId]: [] }));
    };

    const clearAnswer = (perguntaId: number) => {
        setRespostas(prev => {
            const newRespostas = { ...prev };
            delete newRespostas[perguntaId];
            return newRespostas;
        });
        setSearchQueries(prev => ({ ...prev, [perguntaId]: '' }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const respostasArray: RespostaDTO[] = Object.entries(respostas).map(([perguntaId, character]) => ({
            perguntaId: parseInt(perguntaId, 10),
            personagemId: character.id,
        }));

        if (respostasArray.length === 0) {
            setSubmitStatus({ type: 'warning', message: 'Responda ao menos uma pergunta para enviar.' });
            return;
        }

        setSubmitting(true);
        setSubmitStatus({ type: null, message: '' });

        try {
            await ApiService.post(API_ENDPOINTS.PESQUISAS_RESPOSTAS(PESQUISA_ID), respostasArray);
            setSubmitStatus({ type: 'success', message: 'Obrigado por responder! Suas respostas foram salvas com sucesso.' });
            
            // Limpar formulário após sucesso
            setTimeout(() => {
                setRespostas({});
                setSearchQueries({});
                setSubmitStatus({ type: null, message: '' });
            }, 3000);
        } catch (error) {
            console.error("Erro ao enviar respostas:", error);
            setSubmitStatus({ type: 'error', message: 'Erro ao enviar respostas. Tente novamente.' });
        } finally {
            setSubmitting(false);
        }
    };

    const answeredCount = Object.keys(respostas).length;
    const progress = perguntas.length > 0 ? (answeredCount / perguntas.length) * 100 : 0;

    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.loadingSpinner}></div>
                <p>Carregando pesquisa...</p>
            </div>
        );
    }

    return (
        <div className={styles.pesquisaContainer}>
            <div className={styles.headerSection}>
                <h1 className={styles.pageTitle}>
                    <FaUser /> Pesquisa de Favoritos
                </h1>
                <p className={styles.pageDescription}>
                    Responda às perguntas abaixo buscando no nosso catálogo de personagens.
                </p>
                
                {/* Progress Bar */}
                {perguntas.length > 0 && (
                    <div className={styles.progressSection}>
                        <div className={styles.progressInfo}>
                            <span className={styles.progressText}>
                                {answeredCount} de {perguntas.length} perguntas respondidas
                            </span>
                            <span className={styles.progressPercentage}>{Math.round(progress)}%</span>
                        </div>
                        <div className={styles.progressBar}>
                            <div 
                                className={styles.progressFill} 
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>
                    </div>
                )}
            </div>

            <form onSubmit={handleSubmit} className={styles.surveyForm}>
                <div className={styles.questionsContainer}>
                    {perguntas.map((pergunta, index) => {
                        const hasAnswer = !!respostas[pergunta.id];
                        const isSearching = searching[pergunta.id] || false;
                        const results = autocompleteResults[pergunta.id] || [];
                        const isActive = activeAutocomplete === pergunta.id;
                        const query = searchQueries[pergunta.id] || '';

                        return (
                            <div key={pergunta.id} className={styles.questionCard}>
                                <div className={styles.questionHeader}>
                                    <span className={styles.questionNumber}>Pergunta {index + 1}</span>
                                    {hasAnswer && (
                                        <span className={styles.answeredBadge}>
                                            <FaCheckCircle /> Respondida
                                        </span>
                                    )}
                                </div>
                                
                                <label htmlFor={`pergunta-${pergunta.id}`} className={styles.questionLabel}>
                                    {pergunta.textoPergunta}
                                </label>

                                <div className={styles.autocompleteContainer}>
                                    <div className={styles.inputWrapper}>
                                        <FaSearch className={styles.searchIcon} />
                                        <input
                                            ref={(el) => { inputRefs.current[pergunta.id] = el; }}
                                            type="text"
                                            id={`pergunta-${pergunta.id}`}
                                            value={hasAnswer ? respostas[pergunta.id].name : query}
                                            onChange={(e) => handleInputChange(pergunta.id, e.target.value)}
                                            onFocus={() => setActiveAutocomplete(pergunta.id)}
                                            className={`${styles.autocompleteInput} ${hasAnswer ? styles.hasAnswer : ''}`}
                                            placeholder="Comece a digitar o nome do personagem..."
                                            autoComplete="off"
                                            disabled={submitting}
                                        />
                                        {isSearching && (
                                            <FaSpinner className={styles.spinnerIcon} />
                                        )}
                                        {hasAnswer && (
                                            <button
                                                type="button"
                                                onClick={() => clearAnswer(pergunta.id)}
                                                className={styles.clearButton}
                                                disabled={submitting}
                                            >
                                                <FaTimes />
                                            </button>
                                        )}
                                    </div>

                                    {isActive && (results.length > 0 || isSearching || (query.length >= 2 && !isSearching)) && (
                                        <div 
                                            ref={(el) => { autocompleteRefs.current[pergunta.id] = el; }}
                                            className={styles.autocompleteResults}
                                        >
                                            {isSearching ? (
                                                <div className={styles.autocompleteLoading}>
                                                    <FaSpinner className={styles.spinnerIcon} />
                                                    <span>Buscando personagens...</span>
                                                </div>
                                            ) : results.length > 0 ? (
                                                results.map((character) => (
                                                    <div
                                                        key={character.id}
                                                        className={styles.autocompleteItem}
                                                        onClick={() => selectCharacter(pergunta.id, character)}
                                                    >
                                                        <div className={styles.characterInfo}>
                                                            <strong className={styles.characterName}>{character.name}</strong>
                                                            {character.fullName && character.fullName !== 'No alter egos found.' && (
                                                                <small className={styles.characterFullName}>
                                                                    {character.fullName}
                                                                </small>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))
                                            ) : query.length >= 2 ? (
                                                <div className={styles.autocompleteEmpty}>
                                                    Nenhum personagem encontrado.
                                                </div>
                                            ) : null}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {submitStatus.type && (
                    <div className={`${styles.statusMessage} ${styles[submitStatus.type]}`}>
                        {submitStatus.message}
                    </div>
                )}

                <button
                    type="submit"
                    className={styles.submitButton}
                    disabled={submitting || answeredCount === 0}
                >
                    {submitting ? (
                        <>
                            <FaSpinner className={styles.spinnerIcon} />
                            Enviando...
                        </>
                    ) : (
                        <>
                            <FaCheckCircle />
                            Enviar Respostas
                        </>
                    )}
                </button>
            </form>
        </div>
    );
}

