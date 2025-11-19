<img width="1024" height="618" alt="SuperStats Banner" src="https://github.com/user-attachments/assets/c0946b57-7d9d-4588-88d9-49d5c086a4d4" />

## 📋 Índice 

- [Sobre o Projeto](#sobre-o-projeto)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Pré-requisitos](#pré-requisitos)
- [Configuração e Instalação](#configuração-e-instalação)
- [Como Executar o Projeto](#como-executar-o-projeto)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Documentação das Etapas](#documentação-das-etapas)
  - [Etapa 1 - Modelagem Relacional](#etapa-1---modelagem-relacional)
  - [Etapa 2 - Criação de Tabelas e Inserção de Dados](#etapa-2---criação-de-tabelas-e-inserção-de-dados)
  - [Etapa 3 - Interface Funcional com Dashboard (Primeira Versão)](#etapa-3---interface-funcional-com-dashboard-primeira-versão)
  - [Etapa 4 - Consultas Avançadas, Visões e Índices](#etapa-4---consultas-avançadas-visões-e-índices)
  - [Etapa 5 - Funções, Procedimentos e Triggers](#etapa-5---funções-procedimentos-e-triggers)
  - [Etapa 6 - Interface Funcional com Dashboard (Versão Final)](#etapa-6---interface-funcional-com-dashboard-versão-final)
- [APIs Externas Utilizadas](#apis-externas-utilizadas)
- [Contribuição](#contribuição)

---

O **SuperStats** é uma aplicação web completa para gerenciamento e análise de dados sobre personagens de super-heróis, desenvolvida como projeto acadêmico para a disciplina de Banco de Dados. O sistema permite que usuários (Fãs) cadastrem, visualizem e analisem informações sobre personagens, HQs, filmes e participem de pesquisas sobre seus personagens favoritos.

---

## 🛠️ Tecnologias Utilizadas

### Backend
- **Java 21**
- **Spring Boot 3.5.6**
- **MySQL** (SGBD)
- **Flyway** (Migração de Banco de Dados)
- **Spring Security** (Autenticação JWT)
- **JWT** (JSON Web Tokens)

### Frontend
- **Next.js 15.5.6**
- **React 19.1.0**
- **TypeScript**
- **Recharts** (Gráficos)
- **Tailwind CSS**
- **Styled Components**

### APIs Externas
- **Superhero API** (Dados de personagens)
- **Comic Vine API** (Dados de HQs)
- **TMDB API** (Dados de filmes)

---

## 📦 Pré-requisitos

Antes de começar, você precisará ter instalado:

1. **Java 21** ou superior
2. **Maven 3.6+**
3. **Node.js 18+** e **npm**
4. **MySQL 8.0+**
5. **Chaves de API**:
   - Superhero API Token
   - Comic Vine API Key
   - TMDB API Key

---

## ⚙️ Configuração e Instalação

### 1. Clone o repositório

```bash
git clone <url-do-repositório>
cd SuperStats
```

### 2. Configuração do Banco de Dados

O banco de dados será criado automaticamente pelo Flyway na primeira execução. Certifique-se de que o MySQL está rodando.

### 3. Configuração das Variáveis de Ambiente

#### Backend (Windows PowerShell)

No diretório `back/`, configure as variáveis de ambiente:

```powershell
$env:MYSQL_USER="seu_usuario_mysql"
$env:MYSQL_PASSWORD="sua_senha_mysql"
$env:TMDB_API_KEY="sua_chave_tmdb"
$env:COMICVINE_API_KEY="sua_chave_comicvine"
$env:SUPERHERO_API_TOKEN="seu_token_superhero"
```

#### Backend (Linux/Mac)

No diretório `back/`, configure as variáveis de ambiente:

```bash
export MYSQL_USER="seu_usuario_mysql"
export MYSQL_PASSWORD="sua_senha_mysql"
export TMDB_API_KEY="sua_chave_tmdb"
export COMICVINE_API_KEY="sua_chave_comicvine"
export SUPERHERO_API_TOKEN="seu_token_superhero"
```

### 4. Instalação das Dependências

#### Backend

```bash
cd back
mvn clean install
```

#### Frontend

```bash
cd front
npm install
```

---

## 🚀 Como Executar o Projeto

### Backend

1. Configure as variáveis de ambiente (conforme seção anterior)
2. No diretório `back/`, execute:

```bash
mvn spring-boot:run
```

O servidor estará disponível em `http://localhost:8080`

### Frontend

1. No diretório `front/`, execute:

```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:3000`

---

## 📁 Estrutura do Projeto

```
SuperStats/
├── back/                          # Backend (Spring Boot)
│   ├── src/main/java/com/cesar/superstats/
│   │   ├── config/                 # Configurações (Security, Flyway, etc.)
│   │   ├── controller/            # Controllers REST
│   │   ├── service/                 # Lógica de negócio
│   │   ├── repository/            # Acesso a dados
│   │   ├── model/entities/        # Entidades JPA
│   │   ├── dto/                    # Data Transfer Objects
│   │   └── database/               # Configuração de conexão
│   └── src/main/resources/
│       ├── db/migration/          # Scripts SQL do Flyway
│       └── application.properties  # Configurações da aplicação
│
└── front/                          # Frontend (Next.js)
    ├── src/
    │   ├── app/                    # Rotas e páginas
    │   ├── components/             # Componentes React
    │   │   ├── charts/             # Componentes de gráficos
    │   │   ├── dashboard/          # Componentes do dashboard
    │   │   └── lazy/               # Componentes lazy-loaded
    │   ├── lib/                    # Utilitários
    │   ├── shared/                 # Código compartilhado
    │   └── styles/                 # Estilos globais
    └── public/                     # Arquivos estáticos
```

---

## 📚 Documentação das Etapas

### Etapa 1 - Modelagem Relacional

**Descrição**: Modelagem do esquema relacional do banco de dados, incluindo:
- Entidades principais: `Fa`, `Personagem`, `Personagem_Novo`, `HQ`, `Filme`, `Pesquisa`, `Pergunta`, `Resposta`
- Entidades auxiliares: `Base`, `Alter_Egos`, `Conexoes`, `Consome_Filme`, `Consome_HQ`
- Relacionamentos entre entidades
- Cardinalidades e integridade referencial

---

### Etapa 2 - Criação de Tabelas e Inserção de Dados

#### 📍 Localização dos Arquivos

**Arquivo Principal**: `back/src/main/resources/db/migration/V1__create_core_tables.sql`

**Conteúdo**:
- Criação das tabelas principais com todas as constraints necessárias
- Definição de chaves primárias, estrangeiras e únicas
- Constraints CHECK, DEFAULT, UNIQUE
- **ON DELETE CASCADE**: Tabelas `Pergunta`, `Resposta`, `Base`, `Alter_Egos`, `Conexoes`
- **ON DELETE SET NULL**: Tabelas `Personagem_Novo` (fk_fa_criador_id), `Resposta` (fk_Personagem_id)

**Arquivo Auxiliar**: `back/src/main/resources/db/migration/V2__create_aux_tables.sql`

**Conteúdo**:
- Tabelas auxiliares: `Base`, `Alter_Egos`, `Conexoes`, `Consome_Filme`, `Consome_HQ`
- Constraints de integridade referencial

**Inserção de Dados**: `back/src/main/resources/db/migration/V3__insert_initial_survey_data.sql`

**Conteúdo**:
- Inserção de dados iniciais para `Pesquisa` e `Pergunta`
- Mínimo de 30 tuplas por tabela (inserções via aplicação e APIs externas)

**Constraints Implementadas**:

1. **UNIQUE**:
   - `Fa.username` (linha 8)
   - `Fa.email` (linha 9)
   - `HQ.api_detail_url` (linha 55)
   - `Filme.tmdb_id` (linha 66)
   - `Resposta.uq_fa_pergunta` (linha 98)

2. **NOT NULL**:
   - `Fa.username`, `Fa.email`, `Fa.nome`, `Fa.password`
   - `Personagem.nome`
   - `Personagem_Novo.nome`
   - `Filme.titulo`
   - `Resposta.fk_Pergunta_id`

3. **DEFAULT**:
   - `Fa.data_nascimento` (DEFAULT NULL)
   - `Conquistas_Fa.data_conquista` (CURRENT_TIMESTAMP)
   - `Log_Alteracoes_Fa.data_alteracao` (CURRENT_TIMESTAMP)

4. **ON DELETE CASCADE**:
   - `Pergunta` → `Pesquisa` (linha 83)
   - `Resposta` → `Fa`, `Pergunta` (linhas 95, 97)
   - `Base` → `Personagem` (linha 6)
   - `Alter_Egos` → `Personagem` (linha 14)
   - `Conexoes` → `Personagem` (linhas 22, 24)
   - `Consome_Filme` → `Fa`, `Filme` (linhas 32, 34)
   - `Consome_HQ` → `Fa`, `HQ` (linhas 42, 44)

5. **ON DELETE SET NULL**:
   - `Personagem_Novo.fa_criador_id` → `Fa.id` (linha 51)
   - `Resposta.fk_Personagem_id` → `Personagem.id` (linha 93)

---

### Etapa 3 - Interface Funcional com Dashboard (Primeira Versão)

#### 📍 Operações CRUD

##### ✅ Inserção (CREATE)

**Tabelas com Inserção Implementada**:

1. **Fa (Usuários)**
   - **Arquivo**: `back/src/main/java/com/cesar/superstats/repository/FaRepository.java`
   - **Método**: `save(Fa fa)` (linha 59)
   - **Controller**: `back/src/main/java/com/cesar/superstats/controller/AuthController.java`
   - **Endpoint**: `POST /api/auth/register`
   - **Frontend**: `front/src/app/auth/register/page.tsx`

2. **Personagem_Novo**
   - **Arquivo**: `back/src/main/java/com/cesar/superstats/repository/PersonagemNovoRepository.java`
   - **Método**: `save(PersonagemNovo personagem)` (linha 91)
   - **Controller**: `back/src/main/java/com/cesar/superstats/controller/PersonagemNovoController.java`
   - **Endpoint**: `POST /api/personagens-novo`
   - **Frontend**: `front/src/app/personagens/page.tsx`

3. **HQ**
   - **Arquivo**: `back/src/main/java/com/cesar/superstats/repository/HQRepository.java`
   - **Método**: `save(HQ hq)` (linha 65)
   - **Controller**: `back/src/main/java/com/cesar/superstats/controller/HQController.java`
   - **Endpoint**: `POST /api/hqs`
   - **Frontend**: `front/src/app/hqs/page.tsx` (via busca e adição)

4. **Filme**
   - **Arquivo**: `back/src/main/java/com/cesar/superstats/repository/FilmeRepository.java`
   - **Método**: `save(Filme filme)` (linha 70)
   - **Controller**: `back/src/main/java/com/cesar/superstats/controller/FilmeController.java`
   - **Endpoint**: `POST /api/filmes`
   - **Frontend**: `front/src/app/filmes/page.tsx` (via busca e adição)

5. **Resposta**
   - **Arquivo**: `back/src/main/java/com/cesar/superstats/repository/RespostaRepository.java`
   - **Método**: `save(Resposta resposta)` (linha 30)
   - **Controller**: `back/src/main/java/com/cesar/superstats/controller/PesquisaController.java`
   - **Endpoint**: `POST /api/pesquisas/respostas`
   - **Frontend**: `front/src/app/pesquisa/page.tsx`

##### ✅ Deleção (DELETE)

**Tabelas com Deleção Implementada**:

1. **Fa**
   - **Arquivo**: `back/src/main/java/com/cesar/superstats/repository/FaRepository.java`
   - **Método**: `deleteById(Integer id)` (linha 87)
   - **Controller**: `back/src/main/java/com/cesar/superstats/controller/FaController.java`
   - **Endpoint**: `DELETE /api/fas/{id}`

2. **Personagem_Novo**
   - **Arquivo**: `back/src/main/java/com/cesar/superstats/repository/PersonagemNovoRepository.java`
   - **Método**: `deleteById(Integer id)` (linha 117)
   - **Controller**: `back/src/main/java/com/cesar/superstats/controller/PersonagemNovoController.java`
   - **Endpoint**: `DELETE /api/personagens-novo/{id}`
   - **Frontend**: `front/src/app/personagens/page.tsx`

3. **HQ**
   - **Arquivo**: `back/src/main/java/com/cesar/superstats/repository/HQRepository.java`
   - **Método**: `deleteById(Integer id)` (linha 104)
   - **Controller**: `back/src/main/java/com/cesar/superstats/controller/HQController.java`
   - **Endpoint**: `DELETE /api/hqs/{id}`

4. **Filme**
   - **Arquivo**: `back/src/main/java/com/cesar/superstats/repository/FilmeRepository.java`
   - **Método**: `deleteById(Integer id)` (linha 113)
   - **Controller**: `back/src/main/java/com/cesar/superstats/controller/FilmeController.java`
   - **Endpoint**: `DELETE /api/filmes/{id}`

##### ✅ Alteração (UPDATE)

**Tabelas com Alteração Implementada**:

1. **Fa**
   - **Arquivo**: `back/src/main/java/com/cesar/superstats/repository/FaRepository.java`
   - **Método**: `update(Integer id, FaDTO fa)` (linha 74)
   - **Controller**: `back/src/main/java/com/cesar/superstats/controller/FaController.java`
   - **Endpoint**: `PUT /api/fas/{id}`
   - **Frontend**: `front/src/app/perfil/page.tsx`

2. **Personagem_Novo**
   - **Arquivo**: `back/src/main/java/com/cesar/superstats/repository/PersonagemNovoRepository.java`
   - **Método**: `update(Integer id, PersonagemNovoDTO dto)` (linha 104)
   - **Controller**: `back/src/main/java/com/cesar/superstats/controller/PersonagemNovoController.java`
   - **Endpoint**: `PUT /api/personagens-novo/{id}`
   - **Frontend**: `front/src/app/personagens/page.tsx`

3. **HQ**
   - **Arquivo**: `back/src/main/java/com/cesar/superstats/repository/HQRepository.java`
   - **Método**: `update(Integer id, HQDTO hq)` (linha 93)
   - **Controller**: `back/src/main/java/com/cesar/superstats/controller/HQController.java`
   - **Endpoint**: `PUT /api/hqs/{id}`

4. **Filme**
   - **Arquivo**: `back/src/main/java/com/cesar/superstats/repository/FilmeRepository.java`
   - **Método**: `update(Integer id, FilmeDTO filme)` (linha 102)
   - **Controller**: `back/src/main/java/com/cesar/superstats/controller/FilmeController.java`
   - **Endpoint**: `PUT /api/filmes/{id}`

5. **Resposta**
   - **Arquivo**: `back/src/main/java/com/cesar/superstats/repository/RespostaRepository.java`
   - **Método**: `update(Resposta resposta)` (linha 40)
   - **Controller**: `back/src/main/java/com/cesar/superstats/controller/PesquisaController.java`
   - **Endpoint**: `PUT /api/pesquisas/respostas/{id}`

#### 📊 Visualização de Dados e Gráficos

**Dashboard Principal**: `front/src/app/dashboard/[filter]/page.tsx`

**Componentes de Gráficos**:
- `front/src/components/charts/PowerRadarChart.tsx` - Gráfico radar de poderes
- `front/src/components/charts/AlignmentChart.tsx` - Gráfico de pizza de alinhamentos
- `front/src/components/charts/PublisherChart.tsx` - Gráfico de barras de editoras
- `front/src/components/charts/AlterEgoChart.tsx` - Gráfico de alter egos
- `front/src/components/charts/PhysicalStatsCharts.tsx` - Gráficos de estatísticas físicas
- `front/src/components/charts/PowerDistributionChart.tsx` - Distribuição de poderes
- `front/src/components/charts/PesquisaResultsCharts.tsx` - Resultados da pesquisa

**Página de Gráficos**: `front/src/app/graficos/page.tsx`

#### 📝 Consultas Implementadas (Etapa 3)

**Mínimo de 4 consultas com JOIN**:

1. **Consulta 1 - Personagens com suas bases**
   - **Arquivo**: `back/src/main/java/com/cesar/superstats/repository/BaseRepository.java`
   - **Tipo**: JOIN simples
   - **Uso**: Visualização de personagens e suas bases

2. **Consulta 2 - HQs lidas por usuário**
   - **Arquivo**: `back/src/main/java/com/cesar/superstats/repository/HQRepository.java`
   - **Método**: `findAll(Integer faId)` (linha 27)
   - **Tipo**: LEFT JOIN
   - **SQL**: 
     ```sql
     SELECT h.*, (ch.fk_Fa_id IS NOT NULL) AS lido 
     FROM HQ h 
     LEFT JOIN Consome_HQ ch ON h.id = ch.fk_HQ_id AND ch.fk_Fa_id = ?
     ```

3. **Consulta 3 - Filmes assistidos por usuário**
   - **Arquivo**: `back/src/main/java/com/cesar/superstats/repository/FilmeRepository.java`
   - **Método**: `findAll(Integer faId)` (linha 28)
   - **Tipo**: LEFT JOIN
   - **SQL**: 
     ```sql
     SELECT f.*, (cf.fk_Fa_id IS NOT NULL) AS assistido 
     FROM Filme f 
     LEFT JOIN Consome_Filme cf ON f.id = cf.fk_Filme_id AND cf.fk_Fa_id = ?
     ```

4. **Consulta 4 - Resultados da pesquisa com personagens**
   - **Arquivo**: `back/src/main/java/com/cesar/superstats/repository/RespostaRepository.java`
   - **Método**: `getResultadosPorPergunta(Integer perguntaId)` (linha 49)
   - **Tipo**: JOIN com GROUP BY
   - **SQL**: 
     ```sql
     SELECT p.nome AS nome, COUNT(r.id) AS votos
     FROM Resposta r
     JOIN Personagem p ON r.fk_Personagem_id = p.id
     WHERE r.fk_Pergunta_id = ?
     GROUP BY p.nome
     ORDER BY votos DESC
     ```

---

### Etapa 4 - Consultas Avançadas, Visões e Índices

#### 📍 Índices

**Arquivo**: `back/src/main/resources/db/migration/V4__add_indexes.sql`

**Justificativa Geral**: As consultas para buscar o que um fã consumiu (`findAssistidosByFaId`, `findLidosByFaId`) ou para verificar se uma relação existe (`marcarComoAssistido`, `marcarComoLido`) dependem diretamente das chaves estrangeiras (`fk_Fa_id`, `fk_Filme_id`, `fk_HQ_id`). Os índices criados nessas colunas irão acelerar drasticamente essas operações. *"Com grandes dados, vêm grandes responsabilidades... e grandes índices!"* 🚀

**Índices Criados**:

1. **idx_consome_filme_fa_filme**
   - **Tabela**: `Consome_Filme`
   - **Campos**: `(fk_Fa_id, fk_Filme_id)`
   - **SQL**:
     ```sql
     CREATE INDEX idx_consome_filme_fa_filme ON Consome_Filme (fk_Fa_id, fk_Filme_id);
     ```
   - **Justificativa**: Este índice composto otimiza a busca por filmes assistidos por um fã específico, acelerando consultas como `findAssistidosByFaId` e verificações de existência em `marcarComoAssistido`.

2. **idx_consome_hq_fa_hq**
   - **Tabela**: `Consome_HQ`
   - **Campos**: `(fk_Fa_id, fk_HQ_id)`
   - **SQL**:
     ```sql
     CREATE INDEX idx_consome_hq_fa_hq ON Consome_HQ (fk_Fa_id, fk_HQ_id);
     ```
   - **Justificativa**: Da mesma forma, este otimiza a busca por HQs lidas por um fã, melhorando performance de `findLidosByFaId` e `marcarComoLido`.

#### 📍 Consultas Avançadas

##### 1. Anti Join (LEFT JOIN com WHERE IS NULL)

**Arquivo**: `back/src/main/java/com/cesar/superstats/repository/HQRepository.java`

**Método**: `findHQsNaoLidasPorNinguem()` (linha 143)

**Objetivo**: Encontrar HQs que nunca foram lidas por nenhum fã. Isso é útil para identificar conteúdo com baixo engajamento na plataforma. *"Até mesmo as HQs mais épicas precisam de leitores!"* 📚

**SQL**:
```sql
SELECT h.* 
FROM HQ h 
LEFT JOIN Consome_HQ ch ON h.id = ch.fk_HQ_id 
WHERE ch.fk_HQ_id IS NULL
```

**Justificativa**: Utiliza LEFT JOIN para encontrar registros em `HQ` que não possuem correspondência em `Consome_HQ`, identificando HQs órfãs de leitores.

##### 2. Full Outer Join (Simulado com UNION)

**Arquivo**: `back/src/main/java/com/cesar/superstats/repository/FaRepository.java`

**Método**: `findPerfilDeConsumoDosFas()` (linha 101)

**Objetivo**: Segmentar os fãs com base em seus hábitos de consumo de mídia, categorizando-os em "Apenas Filmes", "Apenas HQs" ou "Ambos". *"Nem todos os heróis usam capa... alguns preferem pipoca!"* 🍿

**SQL**:
```sql
WITH 
  FilmesConsumidos AS (SELECT DISTINCT fk_Fa_id FROM Consome_Filme), 
  HQsConsumidas AS (SELECT DISTINCT fk_Fa_id FROM Consome_HQ) 
SELECT 
  f.id as fa_id, f.username, f.nome, 
  CASE WHEN hc.fk_Fa_id IS NOT NULL THEN 'Ambos' ELSE 'Apenas Filmes' END as tipo_consumo 
FROM FilmesConsumidos fc 
LEFT JOIN HQsConsumidas hc ON fc.fk_Fa_id = hc.fk_Fa_id 
JOIN Fa f ON f.id = fc.fk_Fa_id 
UNION 
SELECT 
  f.id as fa_id, f.username, f.nome, 'Apenas HQs' as tipo_consumo 
FROM FilmesConsumidos fc 
RIGHT JOIN HQsConsumidas hc ON fc.fk_Fa_id = hc.fk_Fa_id 
JOIN Fa f ON f.id = hc.fk_Fa_id 
WHERE fc.fk_Fa_id IS NULL 
ORDER BY tipo_consumo, username
```

**Justificativa**: Simula um FULL OUTER JOIN usando UNION de LEFT JOIN e RIGHT JOIN com CTEs (Common Table Expressions), permitindo classificar todos os usuários independentemente de consumirem apenas filmes, apenas HQs, ou ambos.

##### 3. Subconsulta 1

**Arquivo**: `back/src/main/java/com/cesar/superstats/repository/FaRepository.java`

**Método**: `findFasByTituloFilmeAssistido(String tituloFilme)` (linha 92)

**Objetivo**: Encontrar todos os fãs que assistiram a um filme específico, buscando o filme pelo título. Útil para análises de comunidade. *"Quem assistiu 'Vingadores'? Levante a mão!"* ✋

**SQL**:
```sql
SELECT * FROM Fa 
WHERE id IN 
  (SELECT fk_Fa_id FROM Consome_Filme 
   WHERE fk_Filme_id = 
      (SELECT id FROM Filme WHERE LOWER(titulo) = LOWER(?))
  )
```

**Justificativa**: Utiliza subconsultas aninhadas para primeiro encontrar o ID do filme pelo título (case-insensitive) e depois identificar todos os fãs que consumiram esse filme.

##### 4. Subconsulta 2

**Arquivo**: `back/src/main/java/com/cesar/superstats/repository/FilmeRepository.java`

**Método**: `findAllWithAssistidoCount()` (linha 153)

**Objetivo**: Listar todos os filmes e, para cada um, exibir a contagem de quantos fãs já o assistiram. Ótimo para criar uma lista de "filmes populares". *"O filme mais assistido ganha um troféu... virtual, claro!"* 🏆

**SQL**:
```sql
SELECT f.*, 
  (SELECT COUNT(*) FROM Consome_Filme cf WHERE cf.fk_Filme_id = f.id) as total_assistido 
FROM Filme f 
ORDER BY total_assistido DESC, f.titulo ASC
```

**Justificativa**: Utiliza subconsulta correlacionada para calcular a contagem de assistências por filme, permitindo ordenação por popularidade.

#### 📍 Visões (Views)

##### 1. vw_perfil_completo_fa

**Arquivo**: `back/src/main/resources/db/migration/V5__create_vw_perfil_completo_fa.sql`

**Descrição**: View que agrega informações completas do perfil do usuário, incluindo filmes assistidos e HQs lidas em formato JSON. Utiliza as funções `fn_calcula_idade`, `fn_formata_tempo_geek` e `fn_calcula_perfil_consumo` para enriquecer os dados.

**Justificativa Semântica**: Esta visão cria um resumo completo da atividade de cada fã na plataforma. Ela consolida em um só lugar quantas HQs o fã leu, quantos filmes assistiu e quantos personagens criou. É extremamente útil para gerar páginas de perfil de usuário ou para dashboards administrativos sem precisar executar JOINs complexos toda vez. *"Um perfil para governar todos os dados!"* 💍

**Estrutura**:
```sql
CREATE OR REPLACE VIEW vw_perfil_completo_fa AS
SELECT
   f.id AS fa_id,
   f.username,
   f.nome,
   f.genero,
   fn_calcula_idade(f.data_nascimento) AS idade,
   f.ocupacao,
   fn_formata_tempo_geek(f.tempo_geek) AS tempo_geek_formatado,
   f.univ_fav,
   fn_calcula_perfil_consumo(f.id) AS perfil_consumo,
   (SELECT JSON_ARRAYAGG(JSON_OBJECT(...)) FROM Consome_Filme ...) AS filmes_assistidos_json,
   (SELECT JSON_ARRAYAGG(JSON_OBJECT(...)) FROM Consome_HQ ...) AS hqs_lidas_json
FROM Fa f;
```

**Uso**:
- **Repository**: `back/src/main/java/com/cesar/superstats/repository/FaRepository.java`
- **Método**: `findPerfilCompletoById(Integer faId)` (linha 146)
- **Controller**: `back/src/main/java/com/cesar/superstats/controller/FaController.java`
- **Endpoint**: `GET /api/fas/{id}/perfil-completo`

##### 2. vw_popularidade_empresas

**Arquivo**: `back/src/main/resources/db/migration/V6__create_vw_popularidade_empresas.sql`

**Descrição**: View que agrega a popularidade de editoras (HQs) e produtoras (Filmes) baseada no consumo dos usuários usando UNION ALL.

**Justificativa Semântica**: Esta visão funciona como uma ferramenta de Business Intelligence, agregando dados brutos de consumo para gerar um ranking de popularidade das empresas de mídia (editoras de HQs e produtoras de filmes). Ela realiza o trabalho pesado de unir as tabelas de mídia (`Filme`, `HQ`) com suas respectivas tabelas de consumo (`Consome_Filme`, `Consome_HQ`), agrupando os resultados por empresa e contando o total de "leituras" ou "visualizações". O resultado é uma tabela de resumo, pré-calculada e otimizada, pronta para ser consumida diretamente pela aplicação para a criação de gráficos, relatórios ou dashboards que respondem a perguntas de negócio sobre as preferências da comunidade, sem a necessidade de processamento de dados complexo e repetitivo na camada de aplicação. *"Marvel vs DC? A resposta está nos dados!"* ⚔️

**Estrutura**:
```sql
CREATE OR REPLACE VIEW vw_popularidade_empresas AS
SELECT hq.editora AS empresa_nome, 'HQ' AS tipo_midia, COUNT(ch.fk_HQ_id) AS total_consumido
FROM HQ hq JOIN Consome_HQ ch ON hq.id = ch.fk_HQ_id
WHERE hq.editora IS NOT NULL AND hq.editora != ''
GROUP BY hq.editora
UNION ALL
SELECT filme.produtora AS empresa_nome, 'Filme' AS tipo_midia, COUNT(cf.fk_Filme_id) AS total_consumido
FROM Filme filme JOIN Consome_Filme cf ON filme.id = cf.fk_Filme_id
WHERE filme.produtora IS NOT NULL AND filme.produtora != ''
GROUP BY filme.produtora;
```

**Uso**:
- **Repository**: `back/src/main/java/com/cesar/superstats/repository/AnaliseRepository.java`
- **Método**: `findPopularidadeEmpresas()` (linha 17)
- **Controller**: `back/src/main/java/com/cesar/superstats/controller/AnaliseController.java`
- **Endpoint**: `GET /api/analise/popularidade-empresas`
- **Frontend**: `front/src/components/charts/PopularidadeEmpresasChart.tsx`

---

### Etapa 5 - Funções, Procedimentos e Triggers

#### 📍 Funções

**Arquivo**: `back/src/main/resources/db/migration/V7__create_functions.sql`

##### 1. fn_calcula_perfil_consumo

**Linha**: 2-22

**Parâmetros**: `p_fa_id INT`

**Retorno**: `VARCHAR(20)`

**Descrição**: A função `fn_calcula_perfil_consumo` centraliza a regra de negócio para determinar o perfil de consumo de um fã individualmente. É crucial diferenciar seu propósito do método de análise que simula o FULL OUTER JOIN: o método de análise é uma ferramenta de macroanálise, projetada para gerar um relatório de segmentação de todos os usuários de uma vez. Em contrapartida, a função é uma ferramenta de cálculo pontual (micro), otimizada para ser reutilizada em diversas consultas. Sua principal aplicação no projeto é ser chamada diretamente de dentro da view `vw_perfil_completo_fa`. *"Nem todos os fãs são iguais... alguns preferem HQs, outros filmes, e os verdadeiros heróis consomem ambos!"* 🦸

**Valores de Retorno**:
- `'Ambos'`: Consome filmes e HQs
- `'Apenas Filmes'`: Consome apenas filmes
- `'Apenas HQs'`: Consome apenas HQs
- `'Nenhum Consumo'`: Não consome nenhum

**Justificativa Semântica**: Ao ser invocada pela view, a função injeta o perfil de consumo calculado em cada linha, garantindo que a view sirva como uma fonte de dados rica e pré-processada. Isso demonstra o encapsulamento da lógica de negócio no banco de dados e simplifica drasticamente o código da aplicação.

**Uso**:
- **Repository**: `back/src/main/java/com/cesar/superstats/repository/FaRepository.java`
- **Método**: `getPerfilDeConsumoPorId(Integer faId)` (linha 155)
- **View**: Utilizada em `vw_perfil_completo_fa` para calcular o perfil de consumo automaticamente

##### 2. fn_formata_tempo_geek

**Linha**: 24-37

**Parâmetros**: `p_anos INT`

**Retorno**: `VARCHAR(50)`

**Descrição**: A função `fn_formata_tempo_geek` padroniza a formatação de exibição do campo `tempo_geek`, convertendo um valor numérico (anos) em uma string de texto amigável (ex: "5 anos de experiência"). Seu uso é demonstrado diretamente na view `vw_perfil_completo_fa`, onde a função é chamada para pré-formatar o dado antes mesmo que ele chegue à aplicação. *"Com grandes anos de experiência, vêm grandes responsabilidades... e grandes badges!"* 🎖️

**Valores de Retorno**:
- `'Iniciante'`: Se anos <= 0 ou NULL
- `'1 ano de experiência'`: Se anos = 1
- `'{anos} anos de experiência'`: Para outros valores

**Justificativa Semântica**: Ao embutir essa lógica na view, garantimos que qualquer consulta a ela receba o dado já pronto para exibição, centralizando a regra de formatação e simplificando o código do front-end, que apenas exibe o valor recebido sem precisar de tratamento adicional.

##### 3. fn_calcula_idade

**Linha**: 39-50

**Parâmetros**: `p_data_nascimento DATE`

**Retorno**: `INT`

**Descrição**: A função `fn_calcula_idade` garante que a idade do fã seja sempre precisa e atualizada, calculando-a dinamicamente a partir de um dado imutável (a data de nascimento), o que elimina a inconsistência de se armazenar uma idade estática. Seu uso é demonstrado diretamente na view `vw_perfil_completo_fa`, onde a função é chamada para gerar o campo idade em tempo real. *"A idade é apenas um número... mas esse número precisa estar correto!"* 🎂

**Justificativa Semântica**: Ao embutir essa lógica na view, o banco de dados entrega o dado já calculado para a aplicação, garantindo que o front-end exiba uma informação sempre correta, sem a necessidade de lógicas de cálculo adicionais nas camadas de serviço ou de apresentação.

#### 📍 Procedimentos

**Arquivo**: `back/src/main/resources/db/migration/V9__create_achievements_system_and_procedures.sql`

##### 1. sp_atualiza_perfil_fa (Procedimento de Atualização)

**Linha**: 24-36

**Parâmetros**:
- `p_fa_id INT`
- `p_ocupacao VARCHAR(255)`
- `p_univ_fav VARCHAR(255)`

**Descrição**: Este procedimento cumpre o requisito de uma procedure para atualização de dados. Sua finalidade é criar uma interface segura e controlada para modificar informações de perfil do fã (`ocupacao` e `univ_fav`). Ao encapsular a lógica de UPDATE, ele garante que as alterações sejam feitas de maneira consistente e previsível, servindo como um ponto de entrada único no banco de dados para esta operação. *"Atualizar perfil nunca foi tão épico!"* ⚡

**Justificativa Semântica**: Na aplicação, ele é invocado pela funcionalidade de "Editar Perfil", demonstrando seu uso prático e centralizando a lógica de atualização de perfil, garantindo consistência.

**Uso**:
- **Repository**: `back/src/main/java/com/cesar/superstats/repository/FaRepository.java`
- **Método**: `callSpAtualizaPerfil(Integer faId, String ocupacao, String univFav)` (linha 160)
- **Controller**: `back/src/main/java/com/cesar/superstats/controller/FaController.java`
- **Endpoint**: `PUT /api/fas/{id}/perfil`

##### 2. sp_processa_conquistas_em_lote (Procedimento com Cursor)

**Linha**: 42-102

**Parâmetros**: Nenhum

**Descrição**: Este procedimento cumpre o requisito de um processo que exige o uso de um CURSOR. Sua função é executar uma tarefa de manutenção em lote (batch) que varre todos os fãs da tabela `Fa`, um por um. Para cada fã, ele realiza cálculos (COUNT), comparações e, condicionalmente, executa ações de DELETE e INSERT para atualizar seus badges de HQs e Filmes. O uso de um cursor é indispensável, pois uma única instrução UPDATE não conseguiria executar essa lógica iterativa e condicional complexa para cada linha individualmente. *"Processando conquistas... porque até os heróis precisam de badges!"* 🏅

**Justificativa Semântica**: Na aplicação, ele é chamado pela funcionalidade administrativa "Recalcular Todas as Conquistas". Processa conquistas de forma eficiente para todos os usuários, utilizando cursor para iterar sobre cada usuário e calcular suas conquistas baseadas em consumo de HQs e filmes.

**Conquistas Implementadas**:
- **HQs**: "Portador do Darkhold" (16+), "Leitor Voraz" (6+), "Leitor Casual" (1+)
- **Filmes**: "O Vigia Cósmico" (16+), "Cinéfilo Amador" (6+), "Espectador Ocasional" (1+)

**Uso**:
- **Repository**: `back/src/main/java/com/cesar/superstats/repository/AnaliseRepository.java`
- **Método**: `callSpProcessaConquistasEmLote()` (linha 22)
- **Controller**: `back/src/main/java/com/cesar/superstats/controller/AnaliseController.java`
- **Endpoint**: `POST /api/analise/processar-conquistas`

**Procedimentos Auxiliares "On-Demand"**:

Estes dois procedimentos, embora não utilizem cursor, são essenciais para a performance e a lógica "on-demand" da aplicação. Em vez de executar o custoso procedimento em lote a cada visita de perfil, a aplicação chama estas versões granulares, que operam em um único fã. Toda vez que um usuário visita uma página de perfil, estes procedimentos são executados primeiro para garantir que os badges daquele fã específico estejam 100% atualizados antes que seus dados sejam exibidos. Esta abordagem garante uma experiência de usuário rápida e em tempo real.

- `sp_atualiza_conquistas_leitor_por_fa` (linha 111): Atualiza conquistas de leitura para um usuário específico
- `sp_atualiza_conquistas_cinefilo_por_fa` (linha 133): Atualiza conquistas de cinema para um usuário específico

#### 📍 Triggers

##### 1. trg_log_atualizacao_fa (Atualiza uma Tabela de Logs)

**Arquivo**: `back/src/main/resources/db/migration/V11__create_table_and_trg_log_atualizacao_fa.sql`

**Linha**: 12-26

**Tipo**: `AFTER UPDATE`

**Tabela**: `Fa`

**Descrição**: Este trigger cria um registro de auditoria imutável, cumprindo o requisito de log. Sempre que informações de um fã (como `ocupacao` ou `univ_fav`) são alteradas, o trigger é disparado automaticamente e salva uma cópia do dado antigo e do novo em uma tabela de log. *"Big Brother está de olho... mas de forma legal e para auditoria!"* 👁️

**Tabela de Log**: `Log_Alteracoes_Fa`

**Justificativa Semântica**: Isso é crucial para a segurança e rastreabilidade, permitindo auditar quem alterou o quê e quando, e garantindo a integridade histórica dos dados do sistema.

**Campos Registrados**:
- `fa_id`: ID do usuário alterado
- `campo_alterado`: Nome do campo alterado
- `valor_antigo`: Valor anterior
- `valor_novo`: Valor novo
- `data_alteracao`: Timestamp da alteração (DEFAULT CURRENT_TIMESTAMP)
- `usuario_modificador`: Usuário que fez a alteração (CURRENT_USER())

##### 2. trg_concede_badge_boas_vindas

**Arquivo**: `back/src/main/resources/db/migration/V12__create_trg_concede_badge_boas_vindas.sql`

**Linha**: 2-9

**Tipo**: `AFTER INSERT`

**Tabela**: `Fa`

**Descrição**: Este trigger implementa uma regra de negócio de "gamificação" e engajamento. Ele é disparado após a criação de um novo fã na tabela `Fa` e automaticamente insere uma conquista de "boas-vindas" na tabela `Conquistas_Fa`. Isso garante que todo novo usuário seja imediatamente recompensado por se juntar à plataforma, melhorando a experiência inicial sem que a camada de aplicação precise se preocupar com essa lógica. *"Bem-vindo ao time! Aqui está seu badge de boas-vindas!"* 🎁

**Justificativa Semântica**: É um trigger diferente do primeiro, pois responde a um evento INSERT (em vez de UPDATE) e realiza uma ação de negócio (em vez de auditoria). Garante que todos os novos usuários recebam uma conquista inicial, melhorando o engajamento.

**Conquista Concedida**: "Primeira Edição" (tipo: 'Sistema')

**Tabela de Conquistas**: `Conquistas_Fa`

---

### Etapa 6 - Interface Funcional com Dashboard (Versão Final)

#### 📍 CRUD Expandido

**Total de Tabelas com CRUD Completo**: 4+

1. **Fa** ✅ (Create, Read, Update, Delete)
2. **Personagem_Novo** ✅ (Create, Read, Update, Delete)
3. **HQ** ✅ (Create, Read, Update, Delete)
4. **Filme** ✅ (Create, Read, Update, Delete)
5. **Resposta** ✅ (Create, Read, Update)

#### 📍 Integração com Funções, Procedimentos e Triggers

##### Funções na Interface

- **fn_calcula_perfil_consumo**: Utilizada no perfil do usuário
  - **Frontend**: `front/src/app/perfil/page.tsx`
  - **Endpoint**: `GET /api/fas/{id}/perfil-consumo`

##### Procedimentos na Interface

- **sp_atualiza_perfil_fa**: Utilizado na edição de perfil
  - **Frontend**: `front/src/app/perfil/page.tsx`
  - **Endpoint**: `PUT /api/fas/{id}/perfil`

- **sp_processa_conquistas_em_lote**: Disponível no dashboard de análise
  - **Frontend**: `front/src/app/analise/page.tsx` (se implementado)
  - **Endpoint**: `POST /api/analise/processar-conquistas`

##### Triggers na Interface

- **trg_log_atualizacao_fa**: Executado automaticamente ao atualizar perfil
  - **Visualização**: Logs podem ser consultados via endpoint (se implementado)

- **trg_concede_badge_boas_vindas**: Executado automaticamente ao cadastrar novo usuário
  - **Visualização**: Conquistas visíveis no perfil do usuário

#### 📍 Consultas e Views na Interface

##### Views Acessíveis

1. **vw_perfil_completo_fa**
   - **Frontend**: `front/src/app/perfil/page.tsx`
   - **Endpoint**: `GET /api/fas/{id}/perfil-completo`
   - **Visualização**: Perfil completo com filmes e HQs em JSON

2. **vw_popularidade_empresas**
   - **Frontend**: `front/src/components/charts/PopularidadeEmpresasChart.tsx`
   - **Página**: `front/src/app/graficos/page.tsx`
   - **Endpoint**: `GET /api/analise/popularidade-empresas`
   - **Visualização**: Gráfico de barras comparando popularidade de editoras e produtoras

##### Consultas com Filtros

- **Dashboard de Personagens**: `front/src/app/dashboard/[filter]/page.tsx`
  - Filtros por alinhamento (Herói, Vilão, Anti-Herói)
  - Filtros por editora (Marvel, DC)
  - Filtro "Todos"

#### 📍 Dashboard Estatístico Integrado

**Localização Principal**: `front/src/app/dashboard/[filter]/page.tsx`

**Componente Principal**: `front/src/components/dashboard/DashboardClient.tsx`

##### Indicadores Resumidos

**Arquivo**: `front/src/components/dashboard/StatCard.tsx`

**Métricas Exibidas**:
- Total de personagens
- Total de personagens da Marvel
- Total de personagens da DC
- Estatísticas calculadas em tempo real baseadas nos dados do banco

**Cálculos**:
- Média de poderes
- Distribuição por alinhamento
- Distribuição por editora

##### Gráficos Dinâmicos (6+)

1. **PowerRadarChart** - Gráfico Radar de Poderes
   - **Arquivo**: `front/src/components/charts/PowerRadarChart.tsx`
   - **Tipo**: Radar
   - **Dados**: Inteligência, Força, Velocidade, Durabilidade, Poder, Combate

2. **AlignmentChart** - Distribuição por Alinhamento
   - **Arquivo**: `front/src/components/charts/AlignmentChart.tsx`
   - **Tipo**: Pizza
   - **Dados**: Herói, Vilão, Anti-Herói

3. **PublisherChart** - Distribuição por Editora
   - **Arquivo**: `front/src/components/charts/PublisherChart.tsx`
   - **Tipo**: Barras
   - **Dados**: Marvel Comics, DC Comics, Outros

4. **AlterEgoChart** - Distribuição de Alter Egos
   - **Arquivo**: `front/src/components/charts/AlterEgoChart.tsx`
   - **Tipo**: Pizza
   - **Dados**: Personagens com/sem alter ego

5. **PhysicalStatsCharts** - Estatísticas Físicas
   - **Arquivo**: `front/src/components/charts/PhysicalStatsCharts.tsx`
   - **Tipo**: Múltiplos (Barras, Linha)
   - **Dados**: Altura, Peso, Distribuições

6. **PowerDistributionChart** - Distribuição de Poderes
   - **Arquivo**: `front/src/components/charts/PowerDistributionChart.tsx`
   - **Tipo**: Histograma
   - **Dados**: Distribuição de valores de poder total

7. **PopularidadeEmpresasChart** - Popularidade de Editoras/Produtoras
   - **Arquivo**: `front/src/components/charts/PopularidadeEmpresasChart.tsx`
   - **Tipo**: Barras
   - **Dados**: Dados da view `vw_popularidade_empresas`

8. **PesquisaResultsCharts** - Resultados da Pesquisa
   - **Arquivo**: `front/src/components/charts/PesquisaResultsCharts.tsx`
   - **Tipo**: Múltiplos (Barras, Pizza)
   - **Dados**: Resultados das pesquisas de personagens

##### Análises Estatísticas Implementadas

**Arquivo**: `front/src/lib/superheroes.ts`

**Cálculos Realizados**:
- **Média**: Cálculo de médias de poderes e estatísticas físicas
- **Mediana**: Distribuição de valores
- **Moda**: Valores mais frequentes
- **Variância e Desvio Padrão**: Dispersão dos dados
- **Distribuições de Frequência**: Histogramas e gráficos de barras
- **Correlações**: Análise de relações entre variáveis

##### Visualizações Interativas

**Filtros Disponíveis**:
- Por alinhamento (Herói, Vilão, Anti-Herói)
- Por editora (Marvel, DC)
- Por período (se implementado)
- Por categoria (se implementado)

**Interatividade**:
- Seleção de personagens para comparação
- Zoom e pan em gráficos
- Tooltips informativos
- Atualização dinâmica ao alterar filtros

---

## 🔑 APIs Externas Utilizadas

### 1. Superhero API
- **URL**: https://superheroapi.com/
- **Uso**: Busca e dados de personagens de super-heróis
- **Variável de Ambiente**: `SUPERHERO_API_TOKEN`

### 2. Comic Vine API
- **URL**: https://comicvine.gamespot.com/api/
- **Uso**: Busca e dados de HQs
- **Variável de Ambiente**: `COMICVINE_API_KEY`

### 3. TMDB API
- **URL**: https://www.themoviedb.org/documentation/api
- **Uso**: Busca e dados de filmes
- **Variável de Ambiente**: `TMDB_API_KEY`

**Como Obter as Chaves**:
1. **Superhero API**: Registre-se em https://superheroapi.com/
2. **Comic Vine**: Registre-se em https://comicvine.gamespot.com/api/
3. **TMDB**: Registre-se em https://www.themoviedb.org/settings/api

---

## 📝 Notas Importantes

### Variáveis de Ambiente no Windows (PowerShell)

No Windows, use o formato `$env:` para definir variáveis de ambiente:

```powershell
$env:MYSQL_USER="root"
$env:MYSQL_PASSWORD="senha123"
$env:TMDB_API_KEY="sua_chave_aqui"
$env:COMICVINE_API_KEY="sua_chave_aqui"
$env:SUPERHERO_API_TOKEN="seu_token_aqui"
```

### Variáveis de Ambiente no Linux/Mac

No Linux/Mac, use o formato `export`:

```bash
export MYSQL_USER="root"
export MYSQL_PASSWORD="senha123"
export TMDB_API_KEY="sua_chave_aqui"
export COMICVINE_API_KEY="sua_chave_aqui"
export SUPERHERO_API_TOKEN="seu_token_aqui"
```

### Portas Padrão

- **Backend**: `http://localhost:8080`
- **Frontend**: `http://localhost:3000`
- **MySQL**: `localhost:3306`

---

## 🤝 Contribuição

Este é um projeto acadêmico desenvolvido para a disciplina de Banco de Dados. Para contribuições, por favor, entre em contato com os desenvolvedores.

> *"Com grandes projetos, vêm grandes contribuições... e grandes responsabilidades de revisão de código!"* 🦸‍♂️

---

## 📄 Licença

Este projeto é de uso acadêmico.

---

**Última atualização**: 2025
