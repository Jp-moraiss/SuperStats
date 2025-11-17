"use client";
import { useState, useEffect, useMemo, useRef, useCallback, FormEvent } from "react";
import styles from './PersonagensPage.module.css';
import { debounce } from 'lodash';
import { FaSearch, FaTrash, FaUser, FaPlus, FaUsers, FaSync, FaPen, FaTimes, FaChartPie } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

// Tipos
import { Personagem, SuperheroApiSearchResult, PersonagemComunidade, ContagemAlinhamento } from "../../types/personagens";

// Serviços centralizados
import { ApiService, API_ENDPOINTS } from "../../shared";

type TabType = 'catalogo' | 'adicionar' | 'comunidade';

type CommunityFormState = {
    nome: string;
    poder: string;
    alinhamento: string;
    genero: string;
    altura: string;
    peso: string;
};

const COMMUNITY_FORM_INITIAL: CommunityFormState = {
    nome: '',
    poder: '',
    alinhamento: '',
    genero: '',
    altura: '',
    peso: '',
};

const buildCommunityPayload = (form: CommunityFormState) => ({
    nome: form.nome,
    poder: form.poder || null,
    alinhamento: form.alinhamento || null,
    genero: form.genero || null,
    altura: form.altura ? parseFloat(form.altura) : null,
    peso: form.peso ? parseFloat(form.peso) : null,
});

const getErrorMessage = (error: unknown, fallback = 'Ocorreu um erro inesperado.') =>
    error instanceof Error ? error.message : fallback;

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
    
    const [communityAll, setCommunityAll] = useState<PersonagemComunidade[]>([]);
    const [communityMine, setCommunityMine] = useState<PersonagemComunidade[]>([]);
    const [isCommunityLoading, setIsCommunityLoading] = useState(false);
    const [communityMessage, setCommunityMessage] = useState('Use as ferramentas de busca para ver os resultados aqui.');
    const [communityForm, setCommunityForm] = useState<CommunityFormState>(() => ({ ...COMMUNITY_FORM_INITIAL }));
    const [editingCommunityId, setEditingCommunityId] = useState<number | null>(null);
    const [communityIdQuery, setCommunityIdQuery] = useState('');
    const [communityAlignmentFilter, setCommunityAlignmentFilter] = useState('');
    const [isCommunitySearching, setIsCommunitySearching] = useState(false);
    const [isSavingCommunityHero, setIsSavingCommunityHero] = useState(false);
    
    const isFirstRender = useRef(true);
    const communityFormRef = useRef<HTMLDivElement | null>(null);
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

    const loadCommunityData = useCallback(async () => {
        setIsCommunityLoading(true);
        setCommunityMessage('Sincronizando heróis da comunidade...');
        try {
            const [allRes, myRes] = await Promise.all([
                ApiService.get(API_ENDPOINTS.PERSONAGENS_COMUNIDADE),
                ApiService.get(API_ENDPOINTS.PERSONAGENS_COMUNIDADE_MEUS)
            ]);
            const [allData, myData] = await Promise.all([allRes.json(), myRes.json()]);
            setCommunityAll(allData);
            setCommunityMine(myData);
            if (!allData.length && !myData.length) {
                setCommunityMessage('A comunidade ainda não criou nenhum personagem. Seja o primeiro!');
            } else {
                setCommunityMessage('Listas atualizadas! Use as ferramentas para buscas específicas.');
            }
        } catch (error) {
            setCommunityMessage(getErrorMessage(error));
        } finally {
            setIsCommunityLoading(false);
        }
    }, []);

    useEffect(() => {
        if (activeTab === 'comunidade') {
            loadCommunityData();
        }
    }, [activeTab, loadCommunityData]);

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

    const handleCommunityInputChange = (field: keyof CommunityFormState, value: string) => {
        setCommunityForm(prev => ({ ...prev, [field]: value }));
    };

    const resetCommunityForm = () => {
        setCommunityForm({ ...COMMUNITY_FORM_INITIAL });
        setEditingCommunityId(null);
    };

    const handleCommunityFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsSavingCommunityHero(true);
        setCommunityMessage(editingCommunityId !== null ? 'Atualizando personagem...' : 'Criando personagem...');
        const payload = buildCommunityPayload(communityForm);
        try {
            const response = editingCommunityId !== null
                ? await ApiService.put(API_ENDPOINTS.PERSONAGENS_COMUNIDADE_BY_ID(editingCommunityId), payload)
                : await ApiService.post(API_ENDPOINTS.PERSONAGENS_COMUNIDADE, payload);
            const text = await response.text();
            setCommunityMessage(text || 'Operação concluída com sucesso!');
            resetCommunityForm();
            await loadCommunityData();
        } catch (error) {
            setCommunityMessage(getErrorMessage(error));
        } finally {
            setIsSavingCommunityHero(false);
        }
    };

    const handleEditCommunityHero = async (id: number) => {
        setCommunityMessage(`Carregando personagem #${id}...`);
        try {
            const res = await ApiService.get(API_ENDPOINTS.PERSONAGENS_COMUNIDADE_BY_ID(id));
            const data: PersonagemComunidade = await res.json();
            setCommunityForm({
                nome: data.nome || '',
                poder: data.poder || '',
                alinhamento: data.alinhamento || '',
                genero: data.genero || '',
                altura: data.altura !== null && data.altura !== undefined ? String(data.altura) : '',
                peso: data.peso !== null && data.peso !== undefined ? String(data.peso) : ''
            });
            setEditingCommunityId(data.id);
            communityFormRef.current?.scrollIntoView({ behavior: 'smooth' });
        } catch (error) {
            setCommunityMessage(getErrorMessage(error));
        }
    };

    const handleDeleteCommunityHero = async (id: number) => {
        if (!confirm(`Tem certeza que deseja deletar o personagem com ID ${id}? Apenas o criador pode fazer isso.`)) {
            return;
        }
        try {
            await ApiService.delete(API_ENDPOINTS.PERSONAGENS_COMUNIDADE_BY_ID(id));
            setCommunityMessage('Personagem deletado com sucesso!');
            await loadCommunityData();
        } catch (error) {
            setCommunityMessage(getErrorMessage(error));
        }
    };

    const handleCommunitySearchById = async () => {
        if (!communityIdQuery.trim()) {
            setCommunityMessage('Por favor, insira um ID válido.');
            return;
        }
        setIsCommunitySearching(true);
        try {
            const res = await ApiService.get(API_ENDPOINTS.PERSONAGENS_COMUNIDADE_BY_ID(communityIdQuery.trim()));
            const data = await res.json();
            setCommunityMessage(JSON.stringify(data, null, 2));
        } catch (error) {
            setCommunityMessage(getErrorMessage(error, `Personagem com ID ${communityIdQuery} não encontrado.`));
        } finally {
            setIsCommunitySearching(false);
        }
    };

    const handleCommunityFilterByAlignment = async (alinhamento: string) => {
        setCommunityAlignmentFilter(alinhamento);
        if (!alinhamento) {
            setCommunityMessage('Filtro de alinhamento removido.');
            return;
        }
        setIsCommunitySearching(true);
        try {
            const res = await ApiService.get(API_ENDPOINTS.PERSONAGENS_COMUNIDADE_POR_ALINHAMENTO(alinhamento));
            const data = await res.json();
            if (!data.length) {
                setCommunityMessage(`Nenhum personagem encontrado para o alinhamento "${alinhamento}".`);
            } else {
                setCommunityMessage(JSON.stringify(data, null, 2));
            }
        } catch (error) {
            setCommunityMessage(getErrorMessage(error, 'Não foi possível aplicar o filtro de alinhamento.'));
        } finally {
            setIsCommunitySearching(false);
        }
    };

    const handleCommunityStats = async () => {
        setIsCommunitySearching(true);
        setCommunityMessage('Buscando estatísticas...');
        try {
            const res = await ApiService.get(API_ENDPOINTS.PERSONAGENS_COMUNIDADE_STATS);
            const data: ContagemAlinhamento[] = await res.json();
            if (!data.length) {
                setCommunityMessage('Nenhum personagem com alinhamento definido para gerar estatísticas.');
                return;
            }
            const formatted = data
                .map(item => `- ${item.alinhamento || 'Sem alinhamento'}: ${item.total} personagem(ns)`)
                .join('\n');
            setCommunityMessage(`Contagem de Personagens por Alinhamento:\n\n${formatted}`);
        } catch (error) {
            setCommunityMessage(getErrorMessage(error));
        } finally {
            setIsCommunitySearching(false);
        }
    };

    const renderCommunityTable = (data: PersonagemComunidade[], showActions = false) => {
        if (!data.length) {
            return <p className={styles.communityEmptyTable}>Nenhum personagem encontrado.</p>;
        }

        return (
            <div className={styles.communityTableWrapper}>
                <table className={styles.communityTable}>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nome</th>
                            <th>Poder</th>
                            <th>Alinhamento</th>
                            <th>Criador</th>
                            {showActions && <th>Ações</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((personagem) => (
                            <tr key={personagem.id}>
                                <td>{personagem.id}</td>
                                <td>{personagem.nome}</td>
                                <td>{personagem.poder || '-'}</td>
                                <td>{personagem.alinhamento || 'Sem alinhamento'}</td>
                                <td>{personagem.criador?.username || 'Desconhecido'}</td>
                                {showActions && (
                                    <td className={styles.communityActionsCell}>
                                        <button
                                            type="button"
                                            className={styles.communityActionButton}
                                            onClick={() => handleEditCommunityHero(personagem.id)}
                                        >
                                            <FaPen /> Editar
                                        </button>
                                        <button
                                            type="button"
                                            className={styles.communityDeleteButton}
                                            onClick={() => handleDeleteCommunityHero(personagem.id)}
                                        >
                                            <FaTrash /> Deletar
                                        </button>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

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
                <button 
                    onClick={() => setActiveTab('comunidade')} 
                    className={activeTab === 'comunidade' ? styles.active : ''}
                >
                    <FaUsers /> Heróis da Comunidade
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

                {/* TAB: COMUNIDADE */}
                {activeTab === 'comunidade' && (
                    <div className={styles.communitySection}>

                        <div className={styles.communityCardsWrapper}>
                            <div className={styles.communityCard} ref={communityFormRef}>
                                <h4 className={styles.communityCardTitle}>
                                    {editingCommunityId !== null ? 'Atualizar Personagem' : 'Criar Novo Personagem'}
                                </h4>
                                <form className={styles.communityForm} onSubmit={handleCommunityFormSubmit}>
                                    <div className={styles.communityFormGrid}>
                                        <label className={styles.communityFormField}>
                                            Nome*
                                            <input
                                                type="text"
                                                required
                                                value={communityForm.nome}
                                                onChange={(e) => handleCommunityInputChange('nome', e.target.value)}
                                                placeholder="Nome do personagem"
                                            />
                                        </label>
                                        <label className={styles.communityFormField}>
                                            Poder
                                            <input
                                                type="text"
                                                value={communityForm.poder}
                                                onChange={(e) => handleCommunityInputChange('poder', e.target.value)}
                                                placeholder="Poder principal"
                                            />
                                        </label>
                                        <label className={styles.communityFormField}>
                                            Alinhamento
                                            <select
                                                value={communityForm.alinhamento}
                                                onChange={(e) => handleCommunityInputChange('alinhamento', e.target.value)}
                                            >
                                                <option value="">Sem alinhamento</option>
                                                <option value="Herói">Herói</option>
                                                <option value="Anti-Herói">Anti-Herói</option>
                                                <option value="Vilão">Vilão</option>
                                            </select>
                                        </label>
                                        <label className={styles.communityFormField}>
                                            Gênero
                                            <input
                                                type="text"
                                                value={communityForm.genero}
                                                onChange={(e) => handleCommunityInputChange('genero', e.target.value)}
                                            />
                                        </label>
                                        <label className={styles.communityFormField}>
                                            Altura (m)
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={communityForm.altura}
                                                onChange={(e) => handleCommunityInputChange('altura', e.target.value)}
                                            />
                                        </label>
                                        <label className={styles.communityFormField}>
                                            Peso (kg)
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={communityForm.peso}
                                                onChange={(e) => handleCommunityInputChange('peso', e.target.value)}
                                            />
                                        </label>
                                    </div>
                                    <div className={styles.communityFormActions}>
                                        <button
                                            type="submit"
                                            className={styles.primaryButton}
                                            disabled={isSavingCommunityHero}
                                        >
                                            {isSavingCommunityHero
                                                ? 'Salvando...'
                                                : editingCommunityId !== null
                                                    ? 'Salvar Alterações'
                                                    : 'Criar Personagem'}
                                        </button>
                                        {editingCommunityId !== null && (
                                            <button
                                                type="button"
                                                className={styles.secondaryButton}
                                                onClick={resetCommunityForm}
                                            >
                                                <FaTimes /> Cancelar Edição
                                            </button>
                                        )}
                                    </div>
                                </form>
                            </div>

                            <div className={styles.communityCard}>
                                <h4 className={styles.communityCardTitle}>Ferramentas da Comunidade</h4>
                                <div className={styles.communityTools}>
                                    <div className={styles.communityInputGroup}>
                                        <label>Buscar por ID</label>
                                        <div className={styles.communityControlRow}>
                                            <input
                                                type="number"
                                                placeholder="Ex: 42"
                                                value={communityIdQuery}
                                                onChange={(e) => setCommunityIdQuery(e.target.value)}
                                            />
                                            <button
                                                type="button"
                                                onClick={handleCommunitySearchById}
                                                disabled={!communityIdQuery.trim() || isCommunitySearching}
                                            >
                                                <FaSearch /> Buscar
                                            </button>
                                        </div>
                                    </div>
                                    <div className={styles.communityInputGroup}>
                                        <label>Filtrar por alinhamento</label>
                                        <select
                                            value={communityAlignmentFilter}
                                            onChange={(e) => handleCommunityFilterByAlignment(e.target.value)}
                                            disabled={isCommunitySearching}
                                        >
                                            <option value="">Todos</option>
                                            <option value="Herói">Herói</option>
                                            <option value="Anti-Herói">Anti-Herói</option>
                                            <option value="Vilão">Vilão</option>
                                        </select>
                                    </div>
                                    <button
                                        type="button"
                                        className={styles.communityStatsButton}
                                        onClick={handleCommunityStats}
                                        disabled={isCommunitySearching}
                                    >
                                        <FaChartPie /> Ver Contagem por Alinhamento
                                    </button>
                                </div>
                                <pre className={styles.communityOutput}>
                                    {communityMessage}
                                </pre>
                            </div>
                        </div>

                        <div className={styles.communityTablesWrapper}>
                            <div className={styles.communityTableCard}>
                                <div className={styles.communityTableHeader}>
                                    <div>
                                        <h5>Todos os Personagens</h5>
                                        <span>{communityAll.length} registro(s)</span>
                                    </div>
                                </div>
                                {isCommunityLoading ? (
                                    <div className={styles.loadingContainer}>
                                        <div className={styles.loadingSpinner}></div>
                                        <p>Carregando heróis...</p>
                                    </div>
                                ) : (
                                    renderCommunityTable(communityAll)
                                )}
                            </div>
                            <div className={styles.communityTableCard}>
                                <div className={styles.communityTableHeader}>
                                    <div>
                                        <h5>Meus Personagens</h5>
                                        <span>{communityMine.length} registro(s)</span>
                                    </div>
                                </div>
                                {isCommunityLoading ? (
                                    <div className={styles.loadingContainer}>
                                        <div className={styles.loadingSpinner}></div>
                                        <p>Carregando heróis...</p>
                                    </div>
                                ) : (
                                    renderCommunityTable(communityMine, true)
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

