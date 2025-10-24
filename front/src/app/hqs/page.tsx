"use client";
import { useState, useEffect, useMemo } from "react";
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
  const [hqs, setHqs] = useState<Hq[]>([]);
  const [hqsLidas, setHqsLidas] = useState<Hq[]>([]);
  const [activeTab, setActiveTab] = useState('catalogo');
  const [isLoading, setIsLoading] = useState(true);
  
  // --- Novo Estado de Busca ---
  const [searchQuery, setSearchQuery] = useState(''); // O que o usuário está digitando
  const [lastSearchQuery, setLastSearchQuery] = useState(''); // A última busca executada
  const [searchResults, setSearchResults] = useState<ComicVineSearchResult[]>([]);
  const [volumeIssues, setVolumeIssues] = useState<ComicVineSearchResult[]>([]);
  const [selectedVolumeTitle, setSelectedVolumeTitle] = useState<string | null>(null);
  const [searchView, setSearchView] = useState<'search' | 'volume'>('search');
  const [isSearching, setIsSearching] = useState(false); // Loading da busca inicial
  const [isLoadingVolume, setIsLoadingVolume] = useState(false); // Loading das edições do volume
  const [addingHqUrl, setAddingHqUrl] = useState<string | null>(null);
  // --- Fim do Novo Estado de Busca ---

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    setIsLoading(true);
    try {
      const [hqsRes, hqsLidasRes] = await Promise.all([
        ApiService.get(API_ENDPOINTS.HQS),
        ApiService.get(API_ENDPOINTS.HQS_READ),
      ]);
      setHqs(await hqsRes.json());
      setHqsLidas(await hqsLidasRes.json());
    } catch (error) {
      console.error("Falha ao carregar dados de HQs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleRead = async (id: number, isRead: boolean) => {
    const originalHqs = [...hqs];
    const updatedHqs = hqs.map(hq => 
      hq.id === id ? { ...hq, lido: !isRead } : hq
    );
    setHqs(updatedHqs);

    try {
      await ApiService.post(API_ENDPOINTS.HQS_TOGGLE_READ(id));
      // Recarrega discretamente a lista de lidos para garantir consistência
      const hqsLidasRes = await ApiService.get(API_ENDPOINTS.HQS_READ);
      setHqsLidas(await hqsLidasRes.json());
    } catch (error) {
      console.error("Erro ao marcar como lido:", error);
      alert("Não foi possível alterar o status da HQ.");
      setHqs(originalHqs); // Reverte em caso de erro
    }
  };

  // Debounce da busca externa
  const fetchExternalHqs = useMemo(
    () => 
      debounce(async (query: string) => {
        if (query.length < 3) {
          setSearchResults([]);
          setIsSearching(false);
          return;
        }
        setIsSearching(true);
        setSearchView('search'); // Reseta a view para a busca
        setLastSearchQuery(query); // Salva a busca
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
    // Só busca se o texto tiver mudado
    if (searchQuery !== lastSearchQuery) {
      setIsSearching(true); // Mostra loading assim que digita
      fetchExternalHqs(searchQuery);
    }
  }, [searchQuery, lastSearchQuery, fetchExternalHqs]);

  // Função para buscar edições de um volume
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

  // Função chamada ao clicar em um resultado
  const handleSelectResult = (item: ComicVineSearchResult) => {
    if (item.resourceType === 'issue') {
      handleAddHq(item.apiDetailUrl);
    } else if (item.resourceType === 'volume' && item.id) {
      handleFetchVolumeIssues(item.id, item.title);
    }
  };

  // Função para voltar para a busca inicial
  const handleBackToSearch = () => {
    setSearchView('search');
    setSelectedVolumeTitle(null);
    setVolumeIssues([]);
  };

  // Função para adicionar a HQ (chamada por handleSelectResult)
  const handleAddHq = async (apiDetailUrl: string) => {
    setAddingHqUrl(apiDetailUrl);
    try {
      const dto = { apiDetailUrl };
      await ApiService.post(API_ENDPOINTS.HQS, dto);
      
      // Sucesso
      await loadInitialData(); // Recarrega tudo
      
      // Limpa o estado da busca
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
  
  const renderContent = () => {
    if (isLoading) { return <div className={styles.loadingSpinner}></div>; }
    
    switch (activeTab) {
      case 'catalogo':
        return (
          <div className={styles.hqsGrid}>
            {hqs.length > 0 ? hqs.map(hq => (
              <HqCard 
                key={hq.id} 
                hq={hq}
                onToggleRead={handleToggleRead}
              />
            )) : <p>Seu catálogo está vazio. Adicione HQs na aba Adicionar;.</p>}
          </div>
        );
      case 'lidas':
        return (
          // Tabela de Lidos Atualizada
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
      case 'gerenciar':
        return (
          <>
            <AddHqForm 
              query={searchQuery}
              onQueryChange={setSearchQuery}
              isLoading={isSearching}
            />
            <HqSearchResults
              // Decide quais resultados mostrar
              results={searchView === 'search' ? searchResults : volumeIssues}
              onSelectResult={handleSelectResult}
              onBackToSearch={handleBackToSearch}
              view={searchView}
              isSearching={isSearching}
              isLoadingVolume={isLoadingVolume}
              searchQuery={lastSearchQuery} // A query que gerou os resultados
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
        <button onClick={() => setActiveTab('gerenciar')} className={activeTab === 'gerenciar' ? styles.active : ''}>Adicionar</button>
      </div>
      <div className={styles.tabContent}>
        {renderContent()}
      </div>
    </div>
  );
}