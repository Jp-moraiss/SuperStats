"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import styles from './PesquisaPage.module.css';
import { debounce } from 'lodash';
import { FaSearch, FaCheckCircle, FaSpinner, FaUser, FaTimes, FaArrowLeft, FaArrowRight, FaTrophy, FaRocket } from 'react-icons/fa';
import { ApiService, API_ENDPOINTS } from "../../shared";
import { Pergunta, RespostaDTO, PersonagemAutocomplete } from "../../types/pesquisa";

const PESQUISA_ID = 1; // ID da pesquisa padrão

type QuizStep = 'intro' | 'quiz' | 'summary' | 'completed';

export default function PesquisaPage() {
    const [perguntas, setPerguntas] = useState<Pergunta[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [quizStep, setQuizStep] = useState<QuizStep>('intro');
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
    const activeAutocompleteRef = useRef<number | null>(null);

    // Definir loadPerguntas antes de usar no useEffect
    const loadPerguntas = useCallback(async () => {
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
    }, []);

    // Sincronizar ref com state
    useEffect(() => {
        activeAutocompleteRef.current = activeAutocomplete;
    }, [activeAutocomplete]);

    // Carregar perguntas apenas uma vez
    useEffect(() => {
        loadPerguntas();
    }, [loadPerguntas]);

    // Event listener para clicar fora - usando ref para evitar dependência
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const activeId = activeAutocompleteRef.current;
            if (activeId !== null) {
                const ref = autocompleteRefs.current[activeId];
                const inputRef = inputRefs.current[activeId];
                const target = event.target as Node;
                if (ref && !ref.contains(target) && inputRef && !inputRef.contains(target)) {
                    setActiveAutocomplete(null);
                }
            }
        };
        
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []); // Sem dependências - usa ref

    // Criar função de busca memoizada com debounce
    const searchCharactersDebouncedRef = useRef(
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
        }, 500)
    );

    // Cleanup do debounce ao desmontar
    useEffect(() => {
        return () => {
            searchCharactersDebouncedRef.current.cancel();
        };
    }, []);

    const searchCharactersDebounced = searchCharactersDebouncedRef.current;

    const handleInputChange = useCallback((perguntaId: number, value: string) => {
        setSearchQueries(prev => ({ ...prev, [perguntaId]: value }));
        
        // Limpar resposta se o usuário mudar o texto
        setRespostas(prev => {
            if (prev[perguntaId] && value !== prev[perguntaId].name) {
                const newRespostas = { ...prev };
                delete newRespostas[perguntaId];
                return newRespostas;
            }
            return prev;
        });
        
        setActiveAutocomplete(perguntaId);
        searchCharactersDebounced(perguntaId, value);
    }, [searchCharactersDebounced]);

    const selectCharacter = useCallback((perguntaId: number, character: PersonagemAutocomplete) => {
        setRespostas(prev => ({ ...prev, [perguntaId]: character }));
        setSearchQueries(prev => ({ ...prev, [perguntaId]: character.name }));
        setActiveAutocomplete(null);
        setAutocompleteResults(prev => ({ ...prev, [perguntaId]: [] }));
    }, []);

    const clearAnswer = useCallback((perguntaId: number) => {
        setRespostas(prev => {
            const newRespostas = { ...prev };
            delete newRespostas[perguntaId];
            return newRespostas;
        });
        setSearchQueries(prev => ({ ...prev, [perguntaId]: '' }));
        setActiveAutocomplete(null);
    }, []);

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
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
    }, [respostas]);

    // Memoizar valores calculados
    const answeredCount = useMemo(() => Object.keys(respostas).length, [respostas]);
    const currentQuestion = useMemo(() => perguntas[currentQuestionIndex], [perguntas, currentQuestionIndex]);
    
    const hasAnswer = useMemo(() => currentQuestion ? !!respostas[currentQuestion.id] : false, [currentQuestion, respostas]);
    const isSearching = useMemo(() => currentQuestion ? (searching[currentQuestion.id] || false) : false, [currentQuestion, searching]);
    const results = useMemo(() => currentQuestion ? (autocompleteResults[currentQuestion.id] || []) : [], [currentQuestion, autocompleteResults]);
    const isActive = useMemo(() => currentQuestion ? (activeAutocomplete === currentQuestion.id) : false, [currentQuestion, activeAutocomplete]);
    const query = useMemo(() => currentQuestion ? (searchQueries[currentQuestion.id] || '') : '', [currentQuestion, searchQueries]);

    const startQuiz = useCallback(() => {
        setQuizStep('quiz');
    }, []);

    const goToNextQuestion = useCallback(() => {
        setCurrentQuestionIndex(prev => {
            if (prev < perguntas.length - 1) {
                setActiveAutocomplete(null);
                return prev + 1;
            } else {
                setQuizStep('summary');
                return prev;
            }
        });
    }, [perguntas.length]);

    const goToPreviousQuestion = useCallback(() => {
        setCurrentQuestionIndex(prev => {
            if (prev > 0) {
                setActiveAutocomplete(null);
                return prev - 1;
            }
            return prev;
        });
    }, []);

    const goToSummary = useCallback(() => {
        setQuizStep('summary');
    }, []);

    const goBackToQuiz = useCallback(() => {
        setQuizStep('quiz');
    }, []);

    const handleInputFocus = useCallback((perguntaId: number) => {
        setActiveAutocomplete(perguntaId);
    }, []);

    const handleCharacterSelect = useCallback((perguntaId: number, character: PersonagemAutocomplete) => {
        selectCharacter(perguntaId, character);
    }, [selectCharacter]);

    const handleClearAnswer = useCallback((perguntaId: number) => {
        clearAnswer(perguntaId);
    }, [clearAnswer]);

    // Memoizar os handlers para a pergunta atual
    const currentInputChangeHandler = useMemo(() => {
        if (!currentQuestion) return undefined;
        return (e: React.ChangeEvent<HTMLInputElement>) => {
            handleInputChange(currentQuestion.id, e.target.value);
        };
    }, [currentQuestion, handleInputChange]);

    const currentInputFocusHandler = useMemo(() => {
        if (!currentQuestion) return undefined;
        return () => handleInputFocus(currentQuestion.id);
    }, [currentQuestion, handleInputFocus]);

    const currentClearAnswerHandler = useMemo(() => {
        if (!currentQuestion) return undefined;
        return () => handleClearAnswer(currentQuestion.id);
    }, [currentQuestion, handleClearAnswer]);

    const currentCharacterSelectHandler = useMemo(() => {
        if (!currentQuestion) return undefined;
        return (character: PersonagemAutocomplete) => handleCharacterSelect(currentQuestion.id, character);
    }, [currentQuestion, handleCharacterSelect]);

    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.loadingSpinner}></div>
                <p>Carregando quiz...</p>
            </div>
        );
    }

    // Tela de Introdução
    if (quizStep === 'intro') {
        return (
            <div className={styles.quizContainer}>
                <div className={styles.introScreen}>
                    <div className={styles.introIcon}>
                        <FaTrophy />
                    </div>
                    <h1 className={styles.quizTitle}>Quiz de Favoritos</h1>
                    <p className={styles.quizDescription}>
                        Teste seus conhecimentos sobre super-heróis! Responda {perguntas.length} perguntas sobre seus personagens favoritos.
                    </p>
                    <div className={styles.quizInfo}>
                        <div className={styles.infoItem}>
                            <FaCheckCircle />
                            <span>{perguntas.length} Perguntas</span>
                        </div>
                        <div className={styles.infoItem}>
                            <FaRocket />
                            <span>Interativo</span>
                        </div>
                        <div className={styles.infoItem}>
                            <FaUser />
                            <span>Divertido</span>
                        </div>
                    </div>
                    <button onClick={startQuiz} className={styles.startButton}>
                        Começar Quiz
                    </button>
                </div>
            </div>
        );
    }

    // Tela de Resumo
    if (quizStep === 'summary') {
        return (
            <div className={styles.quizContainer}>
                <div className={styles.summaryScreen}>
                    <h2 className={styles.summaryTitle}>Resumo das Respostas</h2>
                    <div className={styles.summaryList}>
                        {perguntas.map((pergunta, index) => {
                            const resposta = respostas[pergunta.id];
                            return (
                                <div key={pergunta.id} className={styles.summaryItem}>
                                    <div className={styles.summaryQuestion}>
                                        <span className={styles.summaryNumber}>{index + 1}</span>
                                        <span>{pergunta.textoPergunta}</span>
                                    </div>
                                    <div className={styles.summaryAnswer}>
                                        {resposta ? (
                                            <span className={styles.answerText}>
                                                <FaCheckCircle /> {resposta.name}
                                            </span>
                                        ) : (
                                            <span className={styles.noAnswer}>Não respondida</span>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <div className={styles.summaryActions}>
                        <button onClick={goBackToQuiz} className={styles.backButton}>
                            <FaArrowLeft /> Voltar
                        </button>
                        <form onSubmit={handleSubmit} style={{ display: 'inline' }}>
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
                </div>
            </div>
        );
    }

    // Verificação de segurança
    if (!currentQuestion) {
        return (
            <div className={styles.loadingContainer}>
                <p>Nenhuma pergunta disponível.</p>
            </div>
        );
    }

    // Tela de Quiz (pergunta por pergunta)
    return (
        <div className={styles.quizContainer}>
            <div className={styles.quizHeader}>
                <div className={styles.quizProgress}>
                    <span className={styles.progressText}>
                        Pergunta {currentQuestionIndex + 1} de {perguntas.length}
                    </span>
                    <div className={styles.progressBar}>
                        <div 
                            className={styles.progressFill} 
                            style={{ width: `${((currentQuestionIndex + 1) / perguntas.length) * 100}%` }}
                        ></div>
                    </div>
                </div>
            </div>

            <div className={styles.questionSlide}>
                <div className={styles.questionCard}>
                    <div className={styles.questionHeader}>
                        <span className={styles.questionNumber}>Pergunta {currentQuestionIndex + 1}</span>
                        {hasAnswer && (
                            <span className={styles.answeredBadge}>
                                <FaCheckCircle /> Respondida
                            </span>
                        )}
                    </div>
                    
                    <label htmlFor={`pergunta-${currentQuestion.id}`} className={styles.questionLabel}>
                        {currentQuestion.textoPergunta}
                    </label>

                    <div className={styles.autocompleteContainer}>
                        <div className={styles.inputWrapper}>
                            <FaSearch className={styles.searchIcon} />
                            <input
                                ref={(el) => { 
                                    if (el) {
                                        inputRefs.current[currentQuestion.id] = el;
                                    }
                                }}
                                type="text"
                                id={`pergunta-${currentQuestion.id}`}
                                value={hasAnswer ? respostas[currentQuestion.id].name : query}
                                onChange={currentInputChangeHandler}
                                onFocus={currentInputFocusHandler}
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
                                    onClick={currentClearAnswerHandler}
                                    className={styles.clearButton}
                                    disabled={submitting}
                                >
                                    <FaTimes />
                                </button>
                            )}
                        </div>

                        {isActive && (results.length > 0 || isSearching || (query.length >= 2 && !isSearching)) && (
                            <div 
                                ref={(el) => { 
                                    if (el) {
                                        autocompleteRefs.current[currentQuestion.id] = el;
                                    }
                                }}
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
                                            onClick={() => currentCharacterSelectHandler?.(character)}
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
            </div>

            <div className={styles.quizNavigation}>
                <button
                    type="button"
                    onClick={goToPreviousQuestion}
                    className={styles.navButton}
                    disabled={currentQuestionIndex === 0 || submitting}
                >
                    <FaArrowLeft /> Anterior
                </button>
                
                <div className={styles.quizStats}>
                    <span>{answeredCount} de {perguntas.length} respondidas</span>
                </div>

                {currentQuestionIndex === perguntas.length - 1 ? (
                    <button
                        type="button"
                        onClick={goToSummary}
                        className={styles.navButton}
                        disabled={submitting}
                    >
                        Ver Resumo <FaArrowRight />
                    </button>
                ) : (
                    <button
                        type="button"
                        onClick={goToNextQuestion}
                        className={styles.navButton}
                        disabled={submitting}
                    >
                        Próxima <FaArrowRight />
                    </button>
                )}
            </div>
        </div>
    );
}

