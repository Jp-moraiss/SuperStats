/**
 * Serviço centralizado de API para autenticação e requisições
 * 
 * @description Centraliza toda a lógica de autenticação, tratamento de erros
 * e comunicação com a API backend, eliminando duplicação de código.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

/**
 * Classe responsável por gerenciar todas as requisições autenticadas
 */
export class ApiService {
  /**
   * Executa uma requisição autenticada com tratamento de erros centralizado
   * 
   * @param url - URL da requisição (pode ser relativa ou absoluta)
   * @param options - Opções de fetch (método, body, headers, etc.)
   * @returns Promise<Response> - Resposta da requisição
   * @throws Error - Em caso de falha de autenticação ou requisição
   */
  static async fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
    const token = localStorage.getItem('jwtToken');

    // Verificação prévia do token (versão mais robusta)
    if (!token) {
      window.location.href = '/auth/login';
      throw new Error('Nenhum token de autenticação encontrado. Redirecionando...');
    }

    // Construção da URL completa se for relativa
    const fullUrl = url.startsWith('http') ? url : `${API_BASE_URL}${url}`;

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers,
    };

    const response = await fetch(fullUrl, { ...options, headers });

    // Tratamento de erros de autenticação
    if (response.status === 401 || response.status === 403) {
      localStorage.removeItem('jwtToken');
      window.location.href = '/auth/login';
      throw new Error('Sessão expirada ou não autorizada. Redirecionando para login...');
    }

    // Tratamento de outros erros
    if (!response.ok) {
      const errorText = await response.text();
      
      // Verificação específica para JWT expirado
      if (errorText.includes("JWT expired")) {
        localStorage.removeItem('jwtToken');
        window.location.href = '/auth/login';
        throw new Error('Sessão expirada. Faça login novamente.');
      }
      
      throw new Error(`Erro na requisição: ${response.statusText || response.status} - ${errorText}`);
    }

    return response;
  }

  /**
   * Método auxiliar para requisições GET com autenticação
   */
  static async get(url: string): Promise<Response> {
    return this.fetchWithAuth(url, { method: 'GET' });
  }

  /**
   * Método auxiliar para requisições POST com autenticação
   */
  static async post(url: string, body?: Record<string, unknown>): Promise<Response> {
    return this.fetchWithAuth(url, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  /**
   * Método auxiliar para requisições PUT com autenticação
   */
  static async put(url: string, body?: Record<string, unknown>): Promise<Response> {
    return this.fetchWithAuth(url, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  /**
   * Método auxiliar para requisições DELETE com autenticação
   */
  static async delete(url: string): Promise<Response> {
    return this.fetchWithAuth(url, { method: 'DELETE' });
  }
}

/**
 * Constantes para endpoints da API
 */
export const API_ENDPOINTS = {
  HQS: '/hqs',
  HQS_READ: '/hqs/lidos',
  HQS_SEARCH: '/hqs/buscar-externo',
  HQS_VOLUME_ISSUES: '/hqs/buscar-volume-issues',
  HQS_TOGGLE_READ: (id: number) => `/hqs/${id}/ler`,
  
  MOVIES: '/filmes',
  MOVIES_WATCHED: '/filmes/assistidos',
  MOVIES_TOGGLE_WATCHED: (id: number) => `/filmes/${id}/assistir`,
} as const;

/**
 * Tipos para as respostas da API
 */
export interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
  success: boolean;
}
