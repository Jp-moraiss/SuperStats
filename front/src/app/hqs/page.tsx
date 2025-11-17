"use client";
import { useState, useEffect, useMemo, useRef } from "react";
import styles from './HqsPage.module.css';
import { debounce } from 'lodash';

// Componentes
import HqCard from "../../components/hqs/HqCard";
import AddHqForm from "../../components/hqs/AddHqForm";
import HqSearchResults from "../../components/hqs/HqSearchResults";

// Tipos
import { Hq, ComicVineSearchResult } from "../../types/hqs";

// Serviços centralizados
import { ApiService, API_ENDPOINTS, formatDate } from "../../shared";

export default function HqsPage() {
    // --- MUDANÇA 1: SIMPLIFICAR O ESTADO ---
    // Apenas uma fonte de verdade para todas as HQs.
    const [hqs, setHqs] = useState<Hq[]>([]); 
    
    const [activeTab, setActiveTab] = useState('catalogo');
    const [isLoading, setIsLoading] = useState(true);
    
    // Estados de busca (permanecem os mesmos)
    const [searchQuery, setSearchQuery] = useState('');
    const [lastSearchQuery, setLastSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<ComicVineSearchResult[]>([]);
    const [volumeIssues, setVolumeIssues] = useState<ComicVineSearchResult[]>([]);
    const [selectedVolumeTitle, setSelectedVolumeTitle] = useState<string | null>(null);
    const [searchView, setSearchView] = useState<'search' | 'volume'>('search');
    const [isSearching, setIsSearching] = useState(false);
    const [isLoadingVolume, setIsLoadingVolume] = useState(false);
    const [addingHqUrl, setAddingHqUrl] = useState<string | null>(null);

    const hqsLidas = useMemo(() => hqs.filter(hq => hq.lido), [hqs]);
    const [hqsBaixoEngajamento, setHqsBaixoEngajamento] = useState<Hq[]>([]);
    
    // Estado para o filtro do catálogo
    const [filterQuery, setFilterQuery] = useState('');
    
    const isFirstRender = useRef(true);
    
    useEffect(() => {
        loadInitialData();
    }, []);

    // Refresh automático quando muda de aba (mas não na primeira renderização)
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        if (activeTab) {
            loadInitialData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeTab]);

   const loadInitialData = async () => {
        setIsLoading(true);
        try {
            // Fazemos as duas chamadas em paralelo
            const [userHqsRes, baixoEngajamentoRes] = await Promise.all([
                ApiService.get(API_ENDPOINTS.HQS), // Dados do usuário
                ApiService.get(API_ENDPOINTS.HQS_UNREAD) // Dados globais
            ]);

            const userHqs = await userHqsRes.json();
            const baixoEngajamentoHqs = await baixoEngajamentoRes.json();
            
            setHqs(userHqs);
            setHqsBaixoEngajamento(baixoEngajamentoHqs);

        } catch (error) {
            console.error("Falha ao carregar dados:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleToggleRead = async (id: number) => {
    const originalHqs = [...hqs];
    const originalHqsBaixoEngajamento = [...hqsBaixoEngajamento];

    const updatedHqs = hqs.map(hq => 
        hq.id === id ? { ...hq, lido: !hq.lido } : hq
    );
    setHqs(updatedHqs); 
    const updatedBaixoEngajamento = hqsBaixoEngajamento.filter(hq => hq.id !== id);
    setHqsBaixoEngajamento(updatedBaixoEngajamento);

    try {
        await ApiService.post(API_ENDPOINTS.HQS_TOGGLE_READ(id));


    } catch (error) {
        console.error("Erro ao alterar status de leitura:", error);
        alert("Não foi possível alterar o status da HQ. A alteração foi desfeita.");
        
        // 5. REVERTE AMBAS AS MUDANÇAS em caso de falha
        setHqs(originalHqs); 
        setHqsBaixoEngajamento(originalHqsBaixoEngajamento);
    }
};

    // O resto do seu código de busca e adição permanece o mesmo, pois já está ótimo.
    // ... (fetchExternalHqs, handleFetchVolumeIssues, handleSelectResult, etc.)
    const fetchExternalHqs = useMemo(
        () => 
          debounce(async (query: string) => {
            if (query.length < 3) {
              setSearchResults([]);
              setIsSearching(false);
              return;
            }
            setIsSearching(true);
            setSearchView('search'); 
            setLastSearchQuery(query);
            try {
              const res = await ApiService.get(`${API_ENDPOINTS.HQS_SEARCH}?titulo=${encodeURIComponent(query)}`);
              const results: ComicVineSearchResult[] = await res.json();
              const uniqueResults = Array.from(new Map(results.map(item => [item.apiDetailUrl || `vol-${item.id}`, item])).values());
              setSearchResults(uniqueResults);
            } catch (error) {
              console.error("Erro ao buscar HQs:", error);
            } finally {
              setIsSearching(false);
            }
          }, 800),
        []
    );
    
    useEffect(() => {
        if (searchQuery !== lastSearchQuery) {
          setIsSearching(true);
          fetchExternalHqs(searchQuery);
        }
    }, [searchQuery, lastSearchQuery, fetchExternalHqs]);

    const handleFetchVolumeIssues = async (volumeId: number, volumeTitle: string) => {
        setSearchView('volume');
        setSelectedVolumeTitle(volumeTitle);
        setIsLoadingVolume(true);
        setVolumeIssues([]);
        try {
          const res = await ApiService.get(`${API_ENDPOINTS.HQS_VOLUME_ISSUES}?volumeId=${volumeId}`);
          const issues: ComicVineSearchResult[] = await res.json();
          setVolumeIssues(issues);
        } catch (error) {
          console.error("Erro ao buscar edições do volume:", error);
        } finally {
          setIsLoadingVolume(false);
        }
    };

    const handleSelectResult = (item: ComicVineSearchResult) => {
        if (item.resourceType === 'issue') {
          handleAddHq(item.apiDetailUrl);
        } else if (item.resourceType === 'volume' && item.id) {
          handleFetchVolumeIssues(item.id, item.title);
        }
    };

    const handleBackToSearch = () => {
        setSearchView('search');
        setSelectedVolumeTitle(null);
        setVolumeIssues([]);
    };

    const handleAddHq = async (apiDetailUrl: string) => {
        setAddingHqUrl(apiDetailUrl);
        try {
            const dto = { apiDetailUrl };
            await ApiService.post(API_ENDPOINTS.HQS, dto);
            await loadInitialData(); 
            setSearchQuery('');
            setLastSearchQuery('');
            setSearchResults([]);
            setVolumeIssues([]);
            setSearchView('search');
        } catch (error) {
            console.error("Erro ao adicionar HQ:", error);
            alert(`Erro ao adicionar HQ: ${error instanceof Error ? error.message : 'Tente novamente'}`);
        } finally {
            setAddingHqUrl(null);
        }
    };

    // Lógica para filtrar as HQs do catálogo
    const filteredHqs = useMemo(() => {
        if (!filterQuery) {
            return hqs;
        }
        const lowercasedFilter = filterQuery.toLowerCase();
        return hqs.filter(hq => 
            hq.titulo.toLowerCase().includes(lowercasedFilter) ||
            hq.volumeName.toLowerCase().includes(lowercasedFilter) ||
            (hq.editora && hq.editora.toLowerCase().includes(lowercasedFilter)) ||
            (hq.edicao && hq.edicao.toLowerCase().includes(lowercasedFilter))
        );
    }, [hqs, filterQuery]);

    const renderContent = () => {
        if (isLoading) { return <div className={styles.loadingSpinner}></div>; }
        
        switch (activeTab) {
          case 'catalogo':
            return (
              <>
                {/* Campo de input para o filtro */}
                <div className={styles.filterContainer}>
                    <input
                        type="text"
                        value={filterQuery}
                        onChange={(e) => setFilterQuery(e.target.value)}
                        placeholder="Filtrar por título, volume, editora, edição..."
                        className={styles.filterInput}
                    />
                </div>
                {/* Usa filteredHqs em vez de hqs */}
                <div className={styles.hqsGrid}>
                  {filteredHqs.length > 0 ? filteredHqs.map(hq => (
                    <HqCard 
                      key={hq.id} 
                      hq={hq}
                      onToggleRead={handleToggleRead}
                    />
                  )) : (
                    <p className={styles.noResults}>
                      {filterQuery ? 'Nenhuma HQ encontrada com o filtro atual.' : 'Seu catálogo está vazio. Adicione HQs na aba \'Adicionar\'.'}
                    </p>
                  )}
                </div>
              </>
            );
          case 'lidas':
            return (
              <div className="card">
                <h2 className="cardTitle">Minha Lista de Leitura</h2>
                <div className="tableContainer">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Título</th>
                        <th>Volume</th>
                        <th>Editora</th>
                        <th>Edição</th>
                        <th>Lançamento</th>
                      </tr>
                    </thead>
                    <tbody>
                      {hqsLidas.length > 0 ? hqsLidas.map(hq => (
                        <tr key={hq.id}>
                          <td>{hq.id}</td>
                          <td>{hq.titulo}</td>
                          <td>{hq.volumeName}</td>
                          <td>{hq.editora}</td>
                          <td>{hq.edicao || 'N/A'}</td>
                          <td>{formatDate(hq.dataLancamento)}</td>
                        </tr>
                      )) : (
                        <tr>
                          <td colSpan={6} style={{ textAlign: 'center' }}>
                            Nenhuma HQ lida ainda.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            );
              case 'naoLidas':
                return (
                    <div className={styles.baixoEngajamentoSection}>
                        <div className={styles.baixoEngajamentoHeader}>
                            <div className={styles.headerContent}>
                                <h2 className={styles.sectionTitle}>HQs Nunca Lidas por Ninguém</h2>
                                <p className={styles.sectionDescription}>
                                    Descubra HQs que ainda não foram lidas por nenhum membro da comunidade. 
                                    Seja o primeiro a marcar como lida e ganhe pontos de pioneiro!
                                </p>
                            </div>
                            <div className={styles.statsBadge}>
                                <span className={styles.statsNumber}>{hqsBaixoEngajamento.length}</span>
                                <span className={styles.statsLabel}>HQs Disponíveis</span>
                            </div>
                        </div>
                        {hqsBaixoEngajamento.length > 0 ? (
                            <div className={styles.hqsGrid}>
                                {hqsBaixoEngajamento.map(hq => (
                                    <HqCard
                                        key={hq.id}
                                        hq={hq}
                                        onToggleRead={handleToggleRead}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className={styles.emptyState}>
                                <div className={styles.emptyIcon}>🎉</div>
                                <h3 className={styles.emptyTitle}>Parabéns!</h3>
                                <p className={styles.emptyMessage}>
                                    Ótima notícia! Todas as HQs do catálogo já foram lidas por alguém.
                                </p>
                                <p className={styles.emptySubMessage}>
                                    Continue adicionando novas HQs para aumentar o catálogo!
                                </p>
                            </div>
                        )}
                    </div>
                );
            case 'gerenciar':
              return (
                <>
                  <AddHqForm 
                    query={searchQuery}
                    onQueryChange={setSearchQuery}
                    isLoading={isSearching}
                  />
                  <HqSearchResults
                    results={searchView === 'search' ? searchResults : volumeIssues}
                    onSelectResult={handleSelectResult}
                    onBackToSearch={handleBackToSearch}
                    view={searchView}
                    isSearching={isSearching}
                    isLoadingVolume={isLoadingVolume}
                    searchQuery={lastSearchQuery}
                    volumeTitle={selectedVolumeTitle}
                    addingHqUrl={addingHqUrl}
                  />
                </>
              );
            default: return null;
        }
    };

    return (
        <div className={styles.hqsContainer}>
            <div className={styles.tabsContainer}>
                <button onClick={() => setActiveTab('catalogo')} className={activeTab === 'catalogo' ? styles.active : ''}>Catálogo</button>
                <button onClick={() => setActiveTab('lidas')} className={activeTab === 'lidas' ? styles.active : ''}>HQs Lidas</button>
                <button onClick={() => setActiveTab('naoLidas')} className={activeTab === 'naoLidas' ? styles.active : ''}>Baixo Engajamento</button>
                <button onClick={() => setActiveTab('gerenciar')} className={activeTab === 'gerenciar' ? styles.active : ''}>Adicionar</button>
            </div>
            <div className={styles.tabContent}>
                {renderContent()}
            </div>
        </div>
    );
}