"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

// ALTERADO: Acessando a URL da API a partir das variáveis de ambiente
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    username: "",
    nome: "",
    email: "",
    password: "",
    genero: "",
    idade: "",
    univ_fav: "",
    tempoGeek: "",
    ocupacao: "",
  });

  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  
  // NOVO: Estado de loading para feedback visual
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.body.classList.remove("auth-marvel-bg", "auth-dc-bg");
    if (form.univ_fav === "Marvel") {
      document.body.classList.add("auth-marvel-bg");
    } else if (form.univ_fav === "DC") {
      document.body.classList.add("auth-dc-bg");
    }
    return () => {
      document.body.classList.remove("auth-marvel-bg", "auth-dc-bg");
    };
  }, [form.univ_fav]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUniverseSelect = (universe: "Marvel" | "DC") => {
    setForm({ ...form, univ_fav: universe });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true); // NOVO: Ativa o estado de loading

    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          idade: form.idade ? parseInt(form.idade) : null,
          tempoGeek: form.tempoGeek ? parseInt(form.tempoGeek) : null,
        }),
      });

      if (!res.ok) {
        // NOVO: Tenta ler uma mensagem de erro estruturada (JSON) do backend
        try {
            const errorData = await res.json();
            // Supondo que seu backend envia um erro como { "message": "..." }
            throw new Error(errorData.message || "Não foi possível completar o cadastro.");
        } catch {
             // Fallback para texto plano se o erro não for JSON
            throw new Error(await res.text() || "Não foi possível completar o cadastro.");
        }
      }
      
      localStorage.setItem("username", form.username);
      setMessage({ type: "success", text: "Cadastro realizado com sucesso! Redirecionando para o login..." });
      setTimeout(() => router.push("/auth/login"), 2000);

    } catch (err) { // Remove o ": any"
          if (err instanceof Error) {
            // Agora é seguro acessar err.message
            setMessage({ type: "error", text: `Erro no cadastro: ${err.message}` });
          } else {
            // Um fallback para erros que não são objetos 'Error'
            setMessage({ type: "error", text: "Ocorreu um erro desconhecido no cadastro." });
          }
    } finally {
      setLoading(false); // NOVO: Desativa o loading em qualquer cenário (sucesso ou erro)
    }
  };

  return (
    <>
      <div className={`auth-page-bg ${form.univ_fav.toLowerCase() || 'default'}`}></div>
      <div className="auth-container">
        <h2 className="auth-title">Cadastro de Novo Fã</h2>
        <form className="auth-form" onSubmit={handleSubmit}>
          <label>Usuário*</label>
          <input type="text" name="username" value={form.username} onChange={handleChange} placeholder="Digite seu usuário" required />
          <div className="form-grid">
            <div><label>Nome Completo*</label><input type="text" name="nome" value={form.nome} onChange={handleChange} required /></div>
            <div><label>Email*</label><input type="email" name="email" value={form.email} onChange={handleChange} required /></div>
          </div>
          <label>Senha*</label>
          <input type="password" name="password" value={form.password} onChange={handleChange} required />
          <div className="form-grid">
            <div><label>Gênero</label><select name="genero" value={form.genero} onChange={handleChange}><option value="">Selecione...</option><option value="Masculino">Masculino</option><option value="Feminino">Feminino</option><option value="Outro">Outro</option></select></div>
            <div><label>Idade</label><input type="number" name="idade" value={form.idade} onChange={handleChange} /></div>
          </div>
          <label>Universo Favorito</label>
          <div className="universe-choice">
            <button type="button" className={`universe-btn marvel ${form.univ_fav === "Marvel" ? "active" : ""}`} onClick={() => handleUniverseSelect("Marvel")}><Image src="/marvel.png" alt="Marvel" width={50} height={50} /></button>
            <button type="button" className={`universe-btn dc ${form.univ_fav === "DC" ? "active" : ""}`} onClick={() => handleUniverseSelect("DC")}><Image src="/dc.png" alt="DC" width={50} height={50} /></button>
          </div>
          <div className="form-grid">
            <div><label>Tempo Geek (anos)</label><input type="number" name="tempoGeek" value={form.tempoGeek} onChange={handleChange} /></div>
            <div><label>Ocupação</label><input type="text" name="ocupacao" value={form.ocupacao} onChange={handleChange} /></div>
          </div>

          {/* ALTERADO: Botão com estado de loading */}
          <button type="submit" className="btn-cta" disabled={loading}>
            {loading ? "Cadastrando..." : "Cadastrar"}
          </button>
        </form>

        {message && (
          <div className={`alert mt-3 ${message.type === "success" ? "alert-success" : "alert-danger"}`}>
            {message.text}
          </div>
        )}

        <p className="auth-link">
          Já tem conta? <a href="/auth/login">Faça o login</a>
        </p>
      </div>
    </>
  );
}