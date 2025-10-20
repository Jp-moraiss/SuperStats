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

// Funções de API
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('jwtToken');
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
    ...options.headers,
  };

  const response = await fetch(url, { ...options, headers });

  if (response.status === 401 || response.status === 403) {
    localStorage.removeItem('jwtToken');
    window.location.href = '/login';
    throw new Error('Sessão expirada ou não autorizada. Redirecionando para login...');
  }

  if (!response.ok) {
    const errorText = await response.text();
    // detecta se o backend mandou um erro de token expirado
    if (errorText.includes("JWT expired")) {
      localStorage.removeItem('jwtToken');
      window.location.href = '/login';
      throw new Error('Sessão expirada. Faça login novamente.');
    }

    throw new Error(`Erro na requisição: ${response.statusText || response.status} - ${errorText}`);
  }

  return response;
};

export default function HqsPage() {
  const [hqs, setHqs] = useState<Hq[]>([]);
  const [hqsLidas, setHqsLidas] = useState<Hq[]>([]);
  const [activeTab, setActiveTab] = useState('catalogo');
  const [isLoading, setIsLoading] = useState(true);
  
  // Estado da busca
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<ComicVineSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [addingHqUrl, setAddingHqUrl] = useState<string | null>(null);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    setIsLoading(true);
    try {
      const [hqsRes, hqsLidasRes] = await Promise.all([
        fetchWithAuth(`${API_URL}/hqs`),
        fetchWithAuth(`${API_URL}/hqs/lidos`),
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
      await fetchWithAuth(`${API_URL}/hqs/${id}/ler`, { 
        method: isRead ? 'DELETE' : 'POST' 
      });
      // Recarrega discretamente a lista de lidos para garantir consistência
      const hqsLidasRes = await fetchWithAuth(`${API_URL}/hqs/lidos`);
      setHqsLidas(await hqsLidasRes.json());
    } catch (error) {
      console.error("Erro ao marcar como lido:", error);
      alert("Não foi possível alterar o status da HQ.");
      setHqs(originalHqs); // Reverte em caso de erro
    }
  };

  const fetchExternalHqs = useMemo(
    () => 
        debounce(async (query: string) => {
        if (query.length < 3) {
            setSearchResults([]);
            return;
        }
        setIsSearching(true);
        try {
            // Assumindo que 'fetchWithAuth' e 'API_URL' são estáveis (definidos fora do componente ou memorizados)
            const res = await fetchWithAuth(`${API_URL}/hqs/buscar-externo?titulo=${encodeURIComponent(query)}`);
            const results: ComicVineSearchResult[] = await res.json();
            
            const uniqueResults = Array.from(new Map(results.map(item => [item.apiDetailUrl, item])).values());
            
            setSearchResults(uniqueResults);

        } catch (error) {
            console.error("Erro ao buscar HQs:", error);
        } finally {
            setIsSearching(false);
        }
        }, 800),
    [] // O array de dependências está vazio, veja a nota abaixo
  );

  useEffect(() => {
    fetchExternalHqs(searchQuery);
  }, [searchQuery, fetchExternalHqs]);

  const handleAddHq = async (apiDetailUrl: string) => {
    setAddingHqUrl(apiDetailUrl);
    try {
      const dto = { apiDetailUrl };
      await fetchWithAuth(`${API_URL}/hqs`, { method: 'POST', body: JSON.stringify(dto) });
      await loadInitialData();
      setSearchQuery('');
      setSearchResults([]);
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
            {hqs.map(hq => (
              <HqCard 
                key={hq.id} 
                hq={hq}
                onToggleRead={handleToggleRead}
              />
            ))}
          </div>
        );
      case 'lidas':
        return (
          <div className="card">
            <h2 className="cardTitle">Minha Lista de Leitura</h2>
            <div className="tableContainer">
              <table className="table">
                <thead><tr><th>ID</th><th>Título</th><th>Editora</th></tr></thead>
                <tbody>
                  {hqsLidas.length > 0 ? hqsLidas.map(hq => (
                    <tr key={hq.id}><td>{hq.id}</td><td>{hq.titulo}</td><td>{hq.editora}</td></tr>
                  )) : <tr><td colSpan={3}>Nenhuma HQ lida ainda.</td></tr>}
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
              results={searchResults}
              onAddHq={handleAddHq}
              isLoading={isSearching}
              searchQuery={searchQuery}
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