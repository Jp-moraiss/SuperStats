CREATE TABLE Pesquisa (
    id_pesquisa INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL
);

CREATE TABLE Fa (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    nome VARCHAR(100) NOT NULL,
    genero VARCHAR(30),
    idade INT,
    univ_fav VARCHAR(30),
    tempo_geek INT,
    ocupacao VARCHAR(50)
);

CREATE TABLE Personagem (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    genero VARCHAR(30),
    altura DOUBLE,
    peso DOUBLE,
    ocupacao VARCHAR(50),
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
    combate INT
);

CREATE TABLE Personagem_Novo (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    alinhamento VARCHAR(10),
    altura DOUBLE,
    peso DOUBLE,
    poder VARCHAR(100),
    genero VARCHAR(30),
    fa_criador_id INT NULL,
    CONSTRAINT fk_fa_criador_id FOREIGN KEY (fa_criador_id)
     REFERENCES Fa(id) ON DELETE SET NULL
);

CREATE TABLE Evento (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    data DATE,
    rua VARCHAR(100),
    cep VARCHAR(15),
    bairro VARCHAR(50),
    cidade VARCHAR(50)
);

CREATE TABLE HQ (
    id INT PRIMARY KEY AUTO_INCREMENT,
    edicao VARCHAR(50),
    editora VARCHAR(100),
    titulo VARCHAR(100),
    data_lancamento DATE
);

CREATE TABLE Filme (
    id INT PRIMARY KEY AUTO_INCREMENT,
    titulo VARCHAR(100) NOT NULL,
    produtora VARCHAR(100),
    diretor VARCHAR(100),
    data_lancamento DATE
);

CREATE TABLE Pergunta (
    id INT PRIMARY KEY AUTO_INCREMENT,
    tipo VARCHAR(50),
    fk_Pesquisa_id INT,
    CONSTRAINT fk_pergunta_pesquisa FOREIGN KEY (fk_Pesquisa_id)
      REFERENCES Pesquisa(id_pesquisa) ON DELETE CASCADE
);

CREATE TABLE Resposta (
    id INT PRIMARY KEY AUTO_INCREMENT,
    fk_Personagem_id INT NULL,
    fk_Fa_id INT NULL,
    fk_Pergunta_id INT NOT NULL,
    data_resposta DATE,
    CONSTRAINT fk_resposta_personagem FOREIGN KEY (fk_Personagem_id)
      REFERENCES Personagem(id) ON DELETE SET NULL,
    CONSTRAINT fk_resposta_fa_id FOREIGN KEY (fk_Fa_id)
      REFERENCES Fa(id) ON DELETE CASCADE,
    CONSTRAINT fk_resposta_pergunta FOREIGN KEY (fk_Pergunta_id)
      REFERENCES Pergunta(id) ON DELETE CASCADE
);
