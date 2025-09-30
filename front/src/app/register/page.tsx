"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { API_URL } from "@/lib/api";

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUniverseSelect = (universe: "Marvel" | "DC") => {
    setForm({ ...form, univ_fav: universe });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

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

      if (!res.ok) throw new Error(await res.text());
      
      localStorage.setItem("username", form.username);

      setMessage({ type: "success", text: "Cadastro realizado com sucesso! Faça o login." });
      setTimeout(() => router.push("/login"), 2000);
    } catch (err: any) {
      setMessage({ type: "error", text: `Erro no cadastro: ${err.message}` });
    }
  };

  return (
    <div
      className={`auth-container universe-${
        form.univ_fav.toLowerCase() || "default"
      }`}
    >
      <h2 className="auth-title">Cadastro de Novo Fã</h2>
      <form className="auth-form" onSubmit={handleSubmit}>
        {/* Usuário estilo TAG */}
        <label>Usuário*</label>
        <div className="auth-tag-input">
          <input
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            placeholder="Digite seu usuário"
            required
          />
          <div className="username-preview">{form.username || ""}</div>
        </div>

        {/* Nome + Email */}
        <div className="form-grid">
          <div>
            <label>Nome Completo*</label>
            <input type="text" name="nome" value={form.nome} onChange={handleChange} required />
          </div>

          <div>
            <label>Email*</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} required />
          </div>
        </div>

        {/* Senha */}
        <label>Senha*</label>
        <input type="password" name="password" value={form.password} onChange={handleChange} required />

        {/* Gênero + Idade */}
        <div className="form-grid">
          <div>
            <label>Gênero</label>
            <select name="genero" value={form.genero} onChange={handleChange}>
              <option value="">Selecione...</option>
              <option value="Masculino">Masculino</option>
              <option value="Feminino">Feminino</option>
              <option value="Outro">Outro</option>
            </select>
          </div>
          <div>
            <label>Idade</label>
            <input type="number" name="idade" value={form.idade} onChange={handleChange} />
          </div>
        </div>

        {/* Universo Favorito */}
        <label>Universo Favorito</label>
        <div className="universe-choice">
          <button
            type="button"
            className={`universe-btn marvel ${form.univ_fav === "Marvel" ? "active" : ""}`}
            onClick={() => handleUniverseSelect("Marvel")}
          >
            <img src="/marvel.png" alt="Marvel" />
          </button>
          <button
            type="button"
            className={`universe-btn dc ${form.univ_fav === "DC" ? "active" : ""}`}
            onClick={() => handleUniverseSelect("DC")}
          >
            <img src="/dc.png" alt="DC" />
          </button>
        </div>

        {/* Tempo Geek + Ocupação */}
        <div className="form-grid">
          <div>
            <label>Tempo Geek (anos)</label>
            <input type="number" name="tempoGeek" value={form.tempoGeek} onChange={handleChange} />
          </div>
          <div>
            <label>Ocupação</label>
            <input type="text" name="ocupacao" value={form.ocupacao} onChange={handleChange} />
          </div>
        </div>

        <button type="submit" className="btn-cta">Cadastrar</button>
      </form>

      {message && (
        <div className={`alert mt-3 ${message.type === "success" ? "alert-success" : "alert-danger"}`}>
          {message.text}
        </div>
      )}

      <p className="auth-link">
        Já tem conta? <a href="/login">Faça o login</a>
      </p>
    </div>
  );
}
