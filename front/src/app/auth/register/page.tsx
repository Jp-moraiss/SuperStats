"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

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

  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  
  const [loading, setLoading] = useState(false);

  // Variável auxiliar para classe do universo
  const universeClass = form.univ_fav === "Marvel" ? "marvel" : form.univ_fav === "DC" ? "dc" : "default";

  useEffect(() => {
    // --- CORREÇÃO AQUI ---
    // Manipulamos APENAS a cor de fundo sólida no body
    document.body.classList.add("auth-body-bg");
    document.body.classList.remove("marvel", "dc", "default");
    
    // Aplica a classe de cor baseada no estado
    document.body.classList.add(universeClass);
    
    return () => {
      // Limpeza ao sair da página
      document.body.classList.remove("auth-body-bg", "marvel", "dc", "default");
    };
  }, [universeClass]); // Dependência atualizada para a variável auxiliar

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUniverseSelect = (universe: "Marvel" | "DC") => {
    // Permite desmarcar se clicar no mesmo
    setForm({ ...form, univ_fav: form.univ_fav === universe ? "" : universe });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          // Garante que campos vazios sejam enviados como null se necessário
          idade: form.idade ? parseInt(form.idade) : null,
          tempoGeek: form.tempoGeek ? parseInt(form.tempoGeek) : null,
          genero: form.genero || null,
          ocupacao: form.ocupacao || null,
          univ_fav: form.univ_fav || null,
        }),
      });

      if (!res.ok) {
        try {
          const errorData = await res.json();
          throw new Error(
            errorData.message ||
              "Não foi possível completar o cadastro. Verifique os dados informados."
          );
        } catch {
          throw new Error(
            (await res.text()) ||
              "Não foi possível completar o cadastro. Verifique os dados informados."
          );
        }
      }

      localStorage.setItem("username", form.username);
      setMessage({
        type: "success",
        text: "Cadastro realizado com sucesso! Redirecionando para o login...",
      });
      setTimeout(() => router.push("/auth/login"), 2000);
    } catch (err) {
      if (err instanceof Error) {
        setMessage({
          type: "error",
          text: err.message || "Ocorreu um erro desconhecido no cadastro.",
        });
      } else {
        setMessage({
          type: "error",
          text: "Ocorreu um erro desconhecido no cadastro.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* --- NOVO: Div separada para o fundo de pontos --- */}
      {/* Ela herda a classe do universo para mudar a cor dos pontos */}
      <div className={`auth-page-bg ${universeClass}`} />

      <div className="auth-container">
        <h2 className="auth-title">Cadastro de Novo Fã</h2>
      <form className="auth-form" onSubmit={handleSubmit}>

        {/* ALTERADO: Agrupado com Fieldset */}
        <fieldset>
          <legend>Informações de Acesso</legend>
          <div className="form-group">
            <label htmlFor="username">Usuário*</label>
            <input type="text" id="username" name="username" value={form.username} onChange={handleChange} placeholder="Seu nome de herói" required />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email*</label>
            <input type="email" id="email" name="email" value={form.email} onChange={handleChange} placeholder="ex: peter.parker@clarim.com" required />
          </div>
          <div className="form-group">
            <label htmlFor="password">Senha*</label>
            <input type="password" id="password" name="password" value={form.password} onChange={handleChange} required />
          </div>
        </fieldset>

        {/* ALTERADO: Agrupado com Fieldset */}
        <fieldset>
          <legend>Perfil</legend>
          <div className="form-group">
            <label htmlFor="nome">Nome Completo*</label>
            <input type="text" id="nome" name="nome" value={form.nome} onChange={handleChange} placeholder="Sua identidade civil" required />
          </div>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="idade">Idade</label>
              <input type="number" id="idade" name="idade" value={form.idade} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label htmlFor="genero">Gênero</label>
              <select id="genero" name="genero" value={form.genero} onChange={handleChange}>
                <option value="">Selecione...</option>
                <option value="Masculino">Masculino</option>
                <option value="Feminino">Feminino</option>
                <option value="Outro">Outro</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="ocupacao">Ocupação</label>
              <input type="text" id="ocupacao" name="ocupacao" value={form.ocupacao} onChange={handleChange} placeholder="Ex: Fotógrafo, Cientista..." />
            </div>
            <div className="form-group">
              <label htmlFor="tempoGeek">Fã há (anos)</label>
              <input type="number" id="tempoGeek" name="tempoGeek" value={form.tempoGeek} onChange={handleChange} />
            </div>
          </div>
        </fieldset>

        {/* ALTERADO: Agrupado com Fieldset */}
        <fieldset>
          <legend>Universo Favorito</legend>
          <div className="universe-choice">
            <button
              type="button"
              className={`universe-btn marvel ${form.univ_fav === "Marvel" ? "active" : ""}`}
              onClick={() => handleUniverseSelect("Marvel")}
              aria-label="Escolher Marvel"
            >
              <Image src="/marvel.png" alt="Marvel" width={80} height={34} />
            </button>
            <button
              type="button"
              className={`universe-btn dc ${form.univ_fav === "DC" ? "active" : ""}`}
              onClick={() => handleUniverseSelect("DC")}
              aria-label="Escolher DC"
            >
              <Image src="/dc.png" alt="DC" width={80} height={45} />
            </button>
          </div>
        </fieldset>
        
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