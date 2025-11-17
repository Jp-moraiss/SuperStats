"use client";
import { useState, useEffect, useMemo, useRef } from "react";
import styles from './PersonagensPage.module.css';
import { debounce } from 'lodash';
import { FaSearch, FaTrash, FaUser, FaPlus } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

// Tipos
import { Personagem, SuperheroApiSearchResult } from "../../types/personagens";

// Serviços centralizados
import { ApiService, API_ENDPOINTS } from "../../shared";

type TabType = 'catalogo' | 'adicionar';

export default function PersonagensPage() {
    const [personagens, setPersonagens] = useState<Personagem[]>([]);
    const [activeTab, setActiveTab] = useState<TabType>('catalogo');
    const [isLoading, setIsLoading] = useState(true);
    
    // Estados de busca
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<SuperheroApiSearchResult[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [addingPersonagemId, setAddingPersonagemId] = useState<string | null>(null);
    
    // Estado para o filtro do catálogo
    const [filterQuery, setFilterQuery] = useState('');
    
    const isFirstRender = useRef(true);
    const router = useRouter();
    
    useEffect(() => {
        loadInitialData();
    }, []);

    // Refresh automático quando muda de aba
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        if (activeTab === 'catalogo') {
            loadInitialData();
        }
    }, [activeTab]);

    const loadInitialData = async () => {
        setIsLoading(true);
        try {
            const res = await ApiService.get(API_ENDPOINTS.PERSONAGENS);
            const data = await res.json();
            setPersonagens(data);
        } catch (error) {
            console.error("Falha ao carregar personagens:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchExternalPersonagens = useMemo(
        () => 
          debounce(async (query: string) => {
            if (query.length < 2) {
              setSearchResults([]);
              setIsSearching(false);
              return;
            }
            setIsSearching(true);
            try {
              const res = await ApiService.get(`${API_ENDPOINTS.PERSONAGENS_SEARCH}?nome=${encodeURIComponent(query)}`);
              const results: SuperheroApiSearchResult[] = await res.json();
              setSearchResults(results);
            } catch (error) {
              console.error("Erro ao buscar personagens:", error);
              setSearchResults([]);
            } finally {
              setIsSearching(false);
            }
          }, 800),
        []
    );
    
    useEffect(() => {
        if (searchQuery) {
          setIsSearching(true);
          fetchExternalPersonagens(searchQuery);
        } else {
          setSearchResults([]);
          setIsSearching(false);
        }
    }, [searchQuery, fetchExternalPersonagens]);

    const handleAddPersonagem = async (apiId: string) => {
        setAddingPersonagemId(apiId);
        try {
            const dto = { apiId };
            await ApiService.post(API_ENDPOINTS.PERSONAGENS, dto);
            await loadInitialData();
            setSearchQuery('');
            setSearchResults([]);
            setActiveTab('catalogo');
        } catch (error) {
            console.error("Erro ao adicionar personagem:", error);
            alert(`Erro ao adicionar personagem: ${error instanceof Error ? error.message : 'Tente novamente'}`);
        } finally {
            setAddingPersonagemId(null);
        }
    };

    const handleDeletePersonagem = async (id: number) => {
        if (!confirm(`Tem certeza que deseja deletar o personagem com ID ${id} do seu catálogo?`)) {
            return;
        }

        const originalPersonagens = [...personagens];
        setPersonagens(prev => prev.filter(p => p.id !== id));

        try {
            await ApiService.delete(API_ENDPOINTS.PERSONAGEM_BY_ID(id));
        } catch (error) {
            console.error("Erro ao deletar personagem:", error);
            alert("Não foi possível deletar o personagem. Tente novamente.");
            setPersonagens(originalPersonagens);
        }
    };

    const handleViewDetails = (id: number) => {
        router.push(`/personagens/${id}`);
    };

    // Lógica para filtrar os personagens do catálogo
    const filteredPersonagens = useMemo(() => {
        if (!filterQuery) {
            return personagens;
        }
        const lowercasedFilter = filterQuery.toLowerCase();
        return personagens.filter(p => 
            p.nome.toLowerCase().includes(lowercasedFilter) ||
            (p.nomeCompleto && p.nomeCompleto.toLowerCase().includes(lowercasedFilter)) ||
            (p.editora && p.editora.toLowerCase().includes(lowercasedFilter)) ||
            (p.alinhamento && p.alinhamento.toLowerCase().includes(lowercasedFilter))
        );
    }, [personagens, filterQuery]);

    if (isLoading) {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.loadingSpinner}></div>
                <p>Carregando catálogo...</p>
            </div>
        );
    }

    return (
        <div className={styles.personagensContainer}>
            {/* Navigation Tabs */}
            <div className={styles.tabsContainer}>
                <button 
                    onClick={() => setActiveTab('catalogo')} 
                    className={activeTab === 'catalogo' ? styles.active : ''}
                >
                    <FaUser /> Meu Catálogo
                </button>
                <button 
                    onClick={() => setActiveTab('adicionar')} 
                    className={activeTab === 'adicionar' ? styles.active : ''}
                >
                    <FaPlus /> Adicionar Personagem
                </button>
            </div>

            {/* Content Area */}
            <div className={styles.tabContent}>
                
                {/* TAB: CATÁLOGO */}
                {activeTab === 'catalogo' && (
                    <div className={styles.catalogoSection}>
                        
                        {/* Campo de filtro */}
                        <div className={styles.filterContainer}>
                            <input
                                type="text"
                                value={filterQuery}
                                onChange={(e) => setFilterQuery(e.target.value)}
                                placeholder="Filtrar por nome, editora, alinhamento..."
                                className={styles.filterInput}
                            />
                        </div>

                        {filteredPersonagens.length > 0 ? (
                            <div className={styles.personagensGrid}>
                                {filteredPersonagens.map(personagem => (
                                    <div 
                                        key={personagem.id} 
                                        className={styles.personagemCard}
                                        onClick={() => handleViewDetails(personagem.id)}
                                    >
                                        <div className={styles.cardImage}>
                                            <img
                                                src={personagem.imagemUrl || '/placeholder-character.png'}
                                                alt={personagem.nome}
                                                className={styles.personagemImage}
                                            />
                                        </div>
                                        <div className={styles.cardBody}>
                                            <h3 className={styles.personagemNome}>{personagem.nome}</h3>
                                            {personagem.nomeCompleto && (
                                                <p className={styles.personagemNomeCompleto}>{personagem.nomeCompleto}</p>
                                            )}
                                            <p className={styles.personagemEditora}>
                                                <strong>Editora:</strong> {personagem.editora || 'N/A'}
                                            </p>
                                            <button
                                                className={styles.deleteButton}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeletePersonagem(personagem.id);
                                                }}
                                            >
                                                <FaTrash /> Deletar do Catálogo
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className={styles.emptyState}>
                                <FaUser size={48} />
                                <p>
                                    {filterQuery 
                                        ? 'Nenhum personagem encontrado com o filtro atual.' 
                                        : 'Nenhum personagem adicionado ao catálogo ainda.'}
                                </p>
                            </div>
                        )}
                    </div>
                )}

                {/* TAB: ADICIONAR */}
                {activeTab === 'adicionar' && (
                    <div className={styles.adicionarSection}>
                        <div className={styles.addFormCard}>
                            <h3 className={styles.sectionTitle}>Adicionar Novo Personagem</h3>
                            <p className={styles.helpText}>
                                Digite o nome do personagem (em inglês) para buscá-lo na Superhero API.
                            </p>
                            <div className={styles.searchWrapper}>
                                <div className={styles.searchInputContainer}>
                                    <FaSearch className={styles.searchIcon} />
                                    <input 
                                        type="text" 
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className={styles.searchInput}
                                        placeholder="Ex: Batman, Spider-Man..."
                                        autoComplete="off"
                                    />
                                    {isSearching && <div className={styles.inputSpinner}></div>}
                                </div>
                                <button 
                                    className={styles.searchButton}
                                    onClick={() => fetchExternalPersonagens(searchQuery)}
                                    disabled={!searchQuery.trim() || isSearching}
                                >
                                    <FaSearch /> Buscar
                                </button>
                            </div>
                        </div>

                        {/* Resultados da Busca */}
                        <div className={styles.resultsCard}>
                            <h4 className={styles.resultsTitle}>
                                {isSearching 
                                    ? `Buscando por "${searchQuery}"...` 
                                    : searchQuery 
                                        ? 'Resultados da Busca' 
                                        : 'Resultados da Busca'}
                            </h4>
                            {isSearching ? (
                                <div className={styles.loadingContainer}>
                                    <div className={styles.loadingSpinner}></div>
                                </div>
                            ) : searchResults.length > 0 ? (
                                <div className={styles.searchResultsList}>
                                    {searchResults.map((result) => {
                                        const isAdding = addingPersonagemId === result.id;
                                        return (
                                            <div
                                                key={result.id}
                                                className={`${styles.searchResultItem} ${isAdding ? styles.adding : ''}`}
                                                onClick={() => !isAdding && handleAddPersonagem(result.id)}
                                            >
                                                <div className={styles.resultImage}>
                                                    <img
                                                        src={result.image?.url || '/placeholder-character.png'}
                                                        alt={result.name}
                                                    />
                                                </div>
                                                <div className={styles.resultInfo}>
                                                    <strong className={styles.resultName}>{result.name}</strong>
                                                    <small className={styles.resultFullName}>
                                                        {result.biography?.['full-name'] || 'Nome completo não disponível'}
                                                    </small>
                                                </div>
                                                {isAdding && (
                                                    <div className={styles.addingSpinner}></div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : searchQuery ? (
                                <p className={styles.emptyMessage}>Nenhum resultado encontrado.</p>
                            ) : (
                                <p className={styles.emptyMessage}>Os resultados da busca aparecerão aqui.</p>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

