"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { API_URL } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (token) {
      router.push("/");
    }
    // Adiciona a classe de background ao body
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

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Usuário ou senha inválidos");

      const data = await res.json();
      localStorage.setItem("jwtToken", data.token);
      localStorage.setItem("username", form.username);
      router.push("/");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <>
      {/* Dynamic Background for Login */}
      <div className="auth-page-bg default"></div> {/* Adicionei essa div para o fundo de pontinhos */}
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

          <button type="submit" className="btn-cta">Entrar</button>
        </form>

        {error && <div className="alert mt-3">{error}</div>}

        <p className="auth-link">
          Não tem conta? <a href="/register">Cadastre-se</a>
        </p>
      </div>
    </>
  );
}