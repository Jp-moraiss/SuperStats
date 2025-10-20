"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// ALTERADO: Acessando a URL da API a partir das variáveis de ambiente
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  
  // NOVO: Estado de loading para feedback visual
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (token) {
      router.push("/");
    }
    document.body.classList.add("auth-page-bg", "auth-page-bg-default");
    return () => {
      document.body.classList.remove("auth-page-bg", "auth-page-bg-default");
    };
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true); // NOVO: Ativa o estado de loading

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        // NOVO: Tenta ler uma mensagem de erro estruturada (JSON) do backend
        try {
            const errorData = await res.json();
            // Supondo que seu backend envia um erro como { "message": "..." }
            throw new Error(errorData.message || "Usuário ou senha inválidos");
        } catch {
            // Fallback para texto plano se o erro não for JSON
            throw new Error(await res.text() || "Usuário ou senha inválidos");
        }
      }

      const data = await res.json();
      localStorage.setItem("jwtToken", data.token);
      localStorage.setItem("username", form.username);
      router.push("/");

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false); // NOVO: Desativa o loading em qualquer cenário (sucesso ou erro)
    }
  };

  return (
    <>
      <div className="auth-page-bg default"></div>
      <div className="auth-container">
        <h2 className="auth-title">Login</h2>
        <form className="auth-form" onSubmit={handleSubmit}>
          <label>Usuário</label>
          <input
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            required
          />

          <label>Senha</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
          />

          {/* ALTERADO: Botão com estado de loading */}
          <button type="submit" className="btn-cta" disabled={loading}>
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        {error && <div className="alert mt-3">{error}</div>}

        <p className="auth-link">
          Não tem conta? <a href="/auth/register">Cadastre-se</a>
        </p>
      </div>
    </>
  );
}