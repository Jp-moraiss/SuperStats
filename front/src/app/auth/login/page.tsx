"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (token) {
      router.push("/");
    }
    // Adiciona as classes de fundo ao <body>
    document.body.classList.add("auth-body-bg", "auth-page-bg", "default");
    return () => {
      document.body.classList.remove("auth-body-bg", "auth-page-bg", "default");
    };
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        try {
          const errorData = await res.json();
          throw new Error(
            errorData.message ||
              "Credenciais inválidas. Verifique seu usuário e senha."
          );
        } catch {
          throw new Error(
            (await res.text()) ||
              "Credenciais inválidas. Verifique seu usuário e senha."
          );
        }
      }

      const data = await res.json();
      localStorage.setItem("jwtToken", data.token);
      localStorage.setItem("username", form.username);
      router.push("/");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || "Ocorreu um erro desconhecido.");
      } else {
        setError("Ocorreu um erro desconhecido.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2 className="auth-title">Login</h2>
      <form className="auth-form" onSubmit={handleSubmit}>
        {/* ALTERADO: Agrupado para melhor espaçamento */}
        <div className="form-group">
          <label htmlFor="username">Usuário</label>
          <input
            type="text"
            id="username"
            name="username"
            value={form.username}
            onChange={handleChange}
            required
            autoComplete="username"
          />
        </div>

        {/* ALTERADO: Agrupado para melhor espaçamento */}
        <div className="form-group">
          <label htmlFor="password">Senha</label>
          <input
            type="password"
            id="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
            autoComplete="current-password"
          />
        </div>

        <button type="submit" className="btn-cta" disabled={loading}>
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>

      {error && <div className="alert mt-3">{error}</div>}

      <p className="auth-link">
        Não tem conta? <a href="/auth/register">Cadastre-se</a>
      </p>
    </div>
  );
}