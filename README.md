## 🚀 SuperStats

Você já quis saber quem a comunidade realmente acha que venceria numa luta: *Superman ou Hulk?*  
Ou qual é o vilão mais popular de todos os tempos?

O **SuperStats** é uma plataforma full-stack que responde a essas perguntas. Pense nele como uma **Pokédex**, mas para todo o universo de heróis e vilões.

O sistema mergulha em APIs externas (Comic Vine, TMDB) para catalogar HQs, filmes e personagens, permitindo que os usuários gerenciem suas coleções e votem em pesquisas interativas.

> **Este foi um projeto acadêmico para a disciplina de Banco de Dados**, onde o foco foi criar um esquema relacional robusto, gerenciar migrações com Flyway e agregar dados de múltiplas fontes.

<!-- Adicione uma captura de tela do seu app aqui! -->
<img width="1882" height="835" alt="image" src="https://github.com/user-attachments/assets/3b75dd05-fb0b-4a7c-9a0a-9adb08191a5c" />

---

## ⚡ O que ele faz?

### 🔐 Login de Fã  
Sistema de autenticação via **JWT** para que cada usuário tenha sua própria experiência.

### 📚 Coleção Pessoal de HQs  
Adicione, gerencie e exiba sua coleção de quadrinhos, buscando-os diretamente de APIs externas.

### ✅ Controle de Leitura  
Marque HQs como lidas (ou não lidas) com um único clique.

### 🌐 Agregador de APIs  
Conecta-se à **Comic Vine**, **TMDB** e **SuperHero API** para buscar dados em tempo real.

### 🗳️ Votação da Comunidade  
Responda pesquisas como “Herói Mais Forte”, “Vilão Preferido”, “Mais Rápido” e muito mais.

### 📊 Dashboard de Stats  
Gráficos em tempo real usando **Chart.js** exibem todos os resultados das votações.

### 💾 Migrações com Flyway  
Gerenciamento automatizado e versionado do *schema* do banco de dados.

### 🐳 Pronto para Docker  
Back-end configurado para rodar em container Docker, simplificando o deploy.

---

## 💻 O Arsenal (Tecnologias)

| Categoria       | Tecnologias |
|----------------|-------------|
| **Back-end**   | Java 21, Spring Boot 3, Spring Security (JWT), Spring Data JDBC |
| **Front-end**  | React (Next.js), HTML5, Bootstrap 5, Tailwind CSS, Chart.js |
| **Banco**      | MySQL, Flyway |
| **DevOps**     | Docker, Maven |
| **APIs**       | Comic Vine API, TMDB API, SuperHero API |

