"use client";

import { useState, useEffect } from 'react';

interface User {
  id: number;
  username: string;
  nome: string;
  email: string;
  genero?: string;
  idade?: number;
  univ_fav?: string;
  tempoGeek?: number;
  ocupacao?: string;
}

export const useUser = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('jwtToken');
        const username = localStorage.getItem('username');
        
        if (!token || !username) {
          setLoading(false);
          return;
        }

        const response = await fetch(`${API_URL}/fa/username/${username}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        } else {
          // Se o token for inválido, limpa o localStorage
          localStorage.removeItem('jwtToken');
          localStorage.removeItem('username');
        }
      } catch (err) {
        console.error('Erro ao buscar dados do usuário:', err);
        setError('Erro ao carregar dados do usuário');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [API_URL]);

  const isLoggedIn = !!user && !!localStorage.getItem('jwtToken');

  const logout = () => {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('username');
    setUser(null);
  };

  return {
    user,
    loading,
    error,
    isLoggedIn,
    logout,
  };
};
