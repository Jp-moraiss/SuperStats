CREATE TABLE Pesquisa (
                          id_pesquisa SERIAL PRIMARY KEY,
                          nome VARCHAR(100) NOT NULL
);

CREATE TABLE Fa (
                    id SERIAL PRIMARY KEY,
                    username VARCHAR(50) NOT NULL UNIQUE,
                    email VARCHAR(100) NOT NULL UNIQUE,
                    nome VARCHAR(100) NOT NULL,
                    genero VARCHAR(30),
                    data_nascimento DATE DEFAULT NULL,
                    univ_fav VARCHAR(30),
                    tempo_geek INT,
                    ocupacao VARCHAR(50),
                    password VARCHAR(255) NOT NULL
);

CREATE TABLE Personagem (
                            id INT PRIMARY KEY,
                            nome VARCHAR(100) NOT NULL,
                            genero VARCHAR(30),
                            altura INT NULL,
                            peso INT NULL,
                            ocupacao VARCHAR(150),
                            raca VARCHAR(30),
                            nome_completo VARCHAR(150),
                            naturalidade VARCHAR(100),
                            primeira_aparicao VARCHAR(150),
                            editora VARCHAR(100),
                            alinhamento VARCHAR(10),
                            inteligencia INT,
                            forca INT,
                            velocidade INT,
                            durabilidade INT,
                            poder INT,
                            combate INT,
                            imagem_url VARCHAR(255) NULL
);

CREATE TABLE Personagem_Novo (
                                 id SERIAL PRIMARY KEY,
                                 nome VARCHAR(100) NOT NULL,
                                 alinhamento VARCHAR(10),
                                 altura DOUBLE PRECISION,
                                 peso DOUBLE PRECISION,
                                 poder VARCHAR(100),
                                 genero VARCHAR(30),
                                 fa_criador_id INT NULL,
                                 CONSTRAINT fk_fa_criador_id FOREIGN KEY (fa_criador_id)
                                     REFERENCES Fa(id) ON DELETE SET NULL
);

CREATE TABLE HQ (
                    api_detail_url VARCHAR(255) UNIQUE,
                    id SERIAL PRIMARY KEY,
                    edicao VARCHAR(50),
                    editora VARCHAR(100),
                    titulo VARCHAR(100),
                    volume_name VARCHAR(255) NULL,
                    data_lancamento DATE,
                    cover_url VARCHAR(512) NULL
);

CREATE TABLE Filme (
                       tmdb_id INT UNIQUE,
                       id SERIAL PRIMARY KEY,
                       titulo VARCHAR(100) NOT NULL,
                       produtora VARCHAR(100),
                       diretor VARCHAR(100),
                       data_lancamento DATE,
                       poster_url VARCHAR(512) NULL,
                       avaliacao_tmdb DECIMAL(4, 2) NULL,
                       trailer_url VARCHAR(255) NULL
);

CREATE TABLE Pergunta (
                          id SERIAL PRIMARY KEY,
                          tipo VARCHAR(50),
                          texto_pergunta VARCHAR(255) NULL,
                          fk_Pesquisa_id INT,
                          CONSTRAINT fk_pergunta_pesquisa FOREIGN KEY (fk_Pesquisa_id)
                              REFERENCES Pesquisa(id_pesquisa) ON DELETE CASCADE
);

CREATE TABLE Resposta (
                          id SERIAL PRIMARY KEY,
                          fk_Personagem_id INT NULL,
                          fk_Fa_id INT NULL,
                          fk_Pergunta_id INT NOT NULL,
                          data_resposta DATE,
                          CONSTRAINT fk_resposta_personagem FOREIGN KEY (fk_Personagem_id)
                              REFERENCES Personagem(id) ON DELETE SET NULL,
                          CONSTRAINT fk_resposta_fa_id FOREIGN KEY (fk_Fa_id)
                              REFERENCES Fa(id) ON DELETE CASCADE,
                          CONSTRAINT fk_resposta_pergunta FOREIGN KEY (fk_Pergunta_id)
                              REFERENCES Pergunta(id) ON DELETE CASCADE,
                          CONSTRAINT uq_fa_pergunta UNIQUE (fk_Fa_id, fk_Pergunta_id)
);