"use client";

import { useEffect, useState } from 'react';
import { useUser } from '../../hooks/useUser';
import { ApiService } from '../../shared/services/api';
import styles from './UsuarioPage.module.css';
import Image from 'next/image';
import { FaYoutube, FaTrophy, FaFilm, FaBookOpen, FaUserEdit, FaChartBar, FaStar, FaCalendarAlt, FaUser } from 'react-icons/fa';

interface SimpleFilme {
  id: number;
  titulo: string;
  posterUrl: string;
  trailerUrl?: string;
  produtora: string;
  dataLancamento: string;
}

interface SimpleHq {
  id: number;
  titulo: string;
  coverUrl: string;
  edicao: string;
  editora: string;
  dataLancamento: string;
}

interface PerfilCompleto {
  faId: number;
  username: string;
  nome: string;
  genero?: string;
  ocupacao?: string;
  univFav?: string;
  idade?: number;
  perfilConsumo?: string;
  tempoGeekFormatado?: string;
  filmesAssistidos: SimpleFilme[];
  hqsLidas: SimpleHq[];
  conquistas?: string;
}

type TabType = 'sobre' | 'filmes' | 'hqs' | 'estatisticas';

export default function UsuarioPage() {
  const { user, loading: userLoading } = useUser();
  const [perfil, setPerfil] = useState<PerfilCompleto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('sobre');
  
  const [editOcupacao, setEditOcupacao] = useState('');
  const [editUnivFav, setEditUnivFav] = useState('');
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    const loadPerfil = async () => {
      if (!user) return;

      try {
        setLoading(true);
        setError(null);

        const usernameRes = await ApiService.get(`/fa/username/${user.username}`);
        const faData = await usernameRes.json();
        const faId = faData.id;

        const token = localStorage.getItem('jwtToken');
        if (token) {
          try {
            const decoded = JSON.parse(atob(token.split('.')[1]));
            setIsOwner(decoded.sub === user.username);
          } catch (e) {
            console.error('Erro token:', e);
          }
        }

        const perfilRes = await ApiService.get(`/fa/perfil-completo/${faId}`);
        const perfilData: PerfilCompleto = await perfilRes.json();
        setPerfil(perfilData);
        setEditOcupacao(perfilData.ocupacao || '');
        setEditUnivFav(perfilData.univFav || '');
      } catch (err) {
        console.error('Erro ao carregar perfil:', err);
        setError('Não foi possível convocar este herói.');
      } finally {
        setLoading(false);
      }
    };

    if (!userLoading && user) {
      loadPerfil();
    } else if (!userLoading && !user) {
      setLoading(false);
      setError('Usuário não encontrado');
    }
  }, [user, userLoading]);

  const handleUpdateProfile = async () => {
    if (!perfil) return;
    try {
      await ApiService.put(`/fa/perfil/${perfil.faId}`, {
        ocupacao: editOcupacao,
        univFav: editUnivFav,
      });
      setPerfil(prev => prev ? ({ ...prev, ocupacao: editOcupacao, univFav: editUnivFav }) : null);
      setShowEditModal(false);
    } catch {
      alert('Falha ao atualizar os dados da missão.');
    }
  };

  const handleUniverseSelect = (universe: "Marvel" | "DC") => {
    setEditUnivFav(editUnivFav === universe ? "" : universe);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('pt-BR');
    } catch {
      return dateString;
    }
  };

  if (loading || userLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Carregando QG...</p>
      </div>
    );
  }

  if (error || !perfil) {
    return (
      <div className={styles.errorContainer}>
        <h2>{error || 'Perfil off-line'}</h2>
      </div>
    );
  }

  const conquistas = perfil.conquistas ? perfil.conquistas.split(', ') : [];
  const totalMedia = perfil.filmesAssistidos.length + perfil.hqsLidas.length;
  const mediaPorMes = totalMedia > 0 ? Math.round(totalMedia / 12) : 0;

  return (
    <div className={styles.usuarioContainer}>
      {/* Hero Banner Section */}
      <div className={styles.heroBanner}>
        <div className={styles.bannerContent}>
          <div className={styles.profileIdentity}>
            <div className={styles.nameBadge}>
              <h1 className={styles.profileName}>{perfil.nome || perfil.username}</h1>
              <span className={styles.usernameTag}>@{perfil.username}</span>
            </div>
            
            {isOwner && (
              <button className={styles.editButton} onClick={() => setShowEditModal(true)}>
                <FaUserEdit /> Editar
              </button>
            )}
          </div>

          {/* Quick Stats */}
          <div className={styles.quickStats}>
            <div className={styles.quickStatItem}>
              <FaFilm className={styles.statIcon} />
              <div>
                <span className={styles.quickStatNumber}>{perfil.filmesAssistidos.length}</span>
                <span className={styles.quickStatLabel}>Filmes</span>
              </div>
            </div>
            <div className={styles.quickStatItem}>
              <FaBookOpen className={styles.statIcon} />
              <div>
                <span className={styles.quickStatNumber}>{perfil.hqsLidas.length}</span>
                <span className={styles.quickStatLabel}>HQs</span>
              </div>
            </div>
            <div className={styles.quickStatItem}>
              <FaTrophy className={styles.statIcon} />
              <div>
                <span className={styles.quickStatNumber}>{conquistas.length}</span>
                <span className={styles.quickStatLabel}>Badges</span>
              </div>
            </div>
            <div className={styles.quickStatItem}>
              <FaChartBar className={styles.statIcon} />
              <div>
                <span className={styles.quickStatNumber}>{totalMedia}</span>
                <span className={styles.quickStatLabel}>Total</span>
              </div>
            </div>
          </div>
        </div>

        {/* Conquistas */}
        {conquistas.length > 0 && (
          <div className={styles.badgesSection}>
            {conquistas.map((badge, index) => (
              <span key={index} className={styles.achievementBadge}>
                <FaTrophy /> {badge}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Navigation Tabs */}
      <div className={styles.tabsContainer}>
        <button 
          className={`${styles.tabButton} ${activeTab === 'sobre' ? styles.active : ''}`}
          onClick={() => setActiveTab('sobre')}
        >
          <FaUser /> Sobre
        </button>
        <button 
          className={`${styles.tabButton} ${activeTab === 'filmes' ? styles.active : ''}`}
          onClick={() => setActiveTab('filmes')}
        >
          <FaFilm /> Filmes
        </button>
        <button 
          className={`${styles.tabButton} ${activeTab === 'hqs' ? styles.active : ''}`}
          onClick={() => setActiveTab('hqs')}
        >
          <FaBookOpen /> HQs
        </button>
        <button 
          className={`${styles.tabButton} ${activeTab === 'estatisticas' ? styles.active : ''}`}
          onClick={() => setActiveTab('estatisticas')}
        >
          <FaChartBar /> Estatísticas
        </button>
      </div>

      {/* Content Area */}
      <div className={styles.contentArea}>
        
        {/* TAB: SOBRE */}
        {activeTab === 'sobre' && (
          <div className={styles.aboutSection}>
            <div className={styles.infoCard}>
              <h3 className={styles.cardTitle}>Informações Pessoais</h3>
              <div className={styles.infoList}>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Universo Favorito</span>
                  <span className={`${styles.infoValue} ${perfil.univFav === 'Marvel' ? styles.marvelText : perfil.univFav === 'DC' ? styles.dcText : ''}`}>
                    {perfil.univFav || 'Neutro'}
                  </span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Ocupação</span>
                  <span className={styles.infoValue}>{perfil.ocupacao || 'Confidencial'}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Tempo Geek</span>
                  <span className={styles.infoValue}>{perfil.tempoGeekFormatado || 'Recém chegado'}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Gênero</span>
                  <span className={styles.infoValue}>{perfil.genero || '-'}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Idade</span>
                  <span className={styles.infoValue}>{perfil.idade ? `${perfil.idade} anos` : '-'}</span>
                </div>
              </div>
            </div>

            {perfil.perfilConsumo && (
              <div className={styles.consumoCard}>
                <h3 className={styles.cardTitle}>Perfil de Consumo</h3>
                <div className={styles.consumoBadge}>
                  {perfil.perfilConsumo}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB: FILMES */}
        {activeTab === 'filmes' && (
          <div className={styles.mediaSection}>
            {perfil.filmesAssistidos.length > 0 ? (
              <div className={styles.mediaGrid}>
                {perfil.filmesAssistidos.map((filme) => (
                  <div key={filme.id} className={styles.mediaCard}>
                    <div className={styles.posterWrapper}>
                      <Image 
                        src={filme.posterUrl || '/placeholder-movie.png'} 
                        alt={filme.titulo} 
                        fill
                        className={styles.mediaImg}
                      />
                      {filme.trailerUrl && (
                        <a 
                          href={filme.trailerUrl} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className={styles.trailerOverlay}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <FaYoutube size={32} />
                        </a>
                      )}
                    </div>
                    <div className={styles.mediaInfo}>
                      <h4 className={styles.mediaTitle}>{filme.titulo}</h4>
                      <div className={styles.mediaMeta}>
                        <span className={styles.metaItem}>
                          <FaCalendarAlt /> {formatDate(filme.dataLancamento)}
                        </span>
                        <span className={styles.metaItem}>{filme.produtora}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.emptyState}>
                <FaFilm size={48} />
                <p>Nenhum filme registrado na base de dados.</p>
              </div>
            )}
          </div>
        )}

        {/* TAB: HQS */}
        {activeTab === 'hqs' && (
          <div className={styles.mediaSection}>
            {perfil.hqsLidas.length > 0 ? (
              <div className={styles.mediaGrid}>
                {perfil.hqsLidas.map((hq) => (
                  <div key={hq.id} className={styles.mediaCard}>
                    <div className={styles.posterWrapper}>
                      <Image 
                        src={hq.coverUrl || '/placeholder-comic.png'} 
                        alt={hq.titulo} 
                        fill
                        className={styles.mediaImg}
                      />
                    </div>
                    <div className={styles.mediaInfo}>
                      <h4 className={styles.mediaTitle}>{hq.titulo}</h4>
                      <div className={styles.mediaMeta}>
                        <span className={styles.metaItem}>#{hq.edicao}</span>
                        <span className={styles.metaItem}>{hq.editora}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.emptyState}>
                <FaBookOpen size={48} />
                <p>Nenhuma HQ registrada nos arquivos.</p>
              </div>
            )}
          </div>
        )}

        {/* TAB: ESTATÍSTICAS */}
        {activeTab === 'estatisticas' && (
          <div className={styles.statsSection}>
            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <div className={styles.statCardIcon}>
                  <FaFilm />
                </div>
                <div className={styles.statCardContent}>
                  <div className={styles.statCardNumber}>{perfil.filmesAssistidos.length}</div>
                  <div className={styles.statCardLabel}>Filmes Assistidos</div>
                </div>
              </div>
              
              <div className={styles.statCard}>
                <div className={styles.statCardIcon}>
                  <FaBookOpen />
                </div>
                <div className={styles.statCardContent}>
                  <div className={styles.statCardNumber}>{perfil.hqsLidas.length}</div>
                  <div className={styles.statCardLabel}>HQs Lidas</div>
                </div>
              </div>
              
              <div className={styles.statCard}>
                <div className={styles.statCardIcon}>
                  <FaChartBar />
                </div>
                <div className={styles.statCardContent}>
                  <div className={styles.statCardNumber}>{totalMedia}</div>
                  <div className={styles.statCardLabel}>Total de Mídia</div>
                </div>
              </div>
              
              <div className={styles.statCard}>
                <div className={styles.statCardIcon}>
                  <FaStar />
                </div>
                <div className={styles.statCardContent}>
                  <div className={styles.statCardNumber}>{mediaPorMes}</div>
                  <div className={styles.statCardLabel}>Média Mensal</div>
                </div>
              </div>
            </div>

            {perfil.perfilConsumo && (
              <div className={styles.consumoHighlight}>
                <FaTrophy className={styles.consumoIcon} />
                <div>
                  <strong>Perfil de Consumo</strong>
                  <span>{perfil.perfilConsumo}</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal de Edição */}
      {showEditModal && (
        <div className={styles.modalOverlay} onClick={() => setShowEditModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>Atualizar Identidade</h3>
              <button className={styles.modalClose} onClick={() => setShowEditModal(false)}>×</button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.formGroup}>
                <label htmlFor="editOcupacao">Ocupação Civil</label>
                <input
                  type="text"
                  id="editOcupacao"
                  value={editOcupacao}
                  onChange={(e) => setEditOcupacao(e.target.value)}
                  className={styles.formInput}
                  placeholder="Ex: Fotógrafo, Cientista..."
                />
              </div>
              <div className={styles.formGroup}>
                <label>Universo de Preferência</label>
                <div className={styles.universeChoice}>
                  <button
                    type="button"
                    className={`${styles.universeBtn} ${editUnivFav === "Marvel" ? styles.active : ""}`}
                    onClick={() => handleUniverseSelect("Marvel")}
                    aria-label="Escolher Marvel"
                  >
                    <Image src="/marvel.png" alt="Marvel" width={80} height={34} />
                  </button>
                  <button
                    type="button"
                    className={`${styles.universeBtn} ${editUnivFav === "DC" ? styles.active : ""}`}
                    onClick={() => handleUniverseSelect("DC")}
                    aria-label="Escolher DC"
                  >
                    <Image src="/dc.png" alt="DC" width={80} height={45} />
                  </button>
                </div>
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button className={styles.cancelButton} onClick={() => setShowEditModal(false)}>Cancelar</button>
              <button className={styles.saveButton} onClick={handleUpdateProfile}>Salvar Dados</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
