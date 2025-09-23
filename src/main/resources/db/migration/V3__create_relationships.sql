CREATE TABLE Participa_Evento (
    fk_Fa_email VARCHAR(100) NOT NULL,
    fk_Evento_id INT NOT NULL,
    PRIMARY KEY (fk_Fa_email, fk_Evento_id),
    CONSTRAINT fk_participa_evento_fa FOREIGN KEY (fk_Fa_email)
    REFERENCES Fa(email) ON DELETE CASCADE,
    CONSTRAINT fk_participa_evento_evento FOREIGN KEY (fk_Evento_id)
    REFERENCES Evento(id) ON DELETE CASCADE
);

CREATE TABLE Participa_Filme (
    fk_Personagem_id INT NOT NULL,
    fk_Filme_id INT NOT NULL,
    PRIMARY KEY (fk_Personagem_id, fk_Filme_id),
    CONSTRAINT fk_participa_filme_personagem FOREIGN KEY (fk_Personagem_id)
    REFERENCES Personagem(id) ON DELETE CASCADE,
    CONSTRAINT fk_participa_filme_filme FOREIGN KEY (fk_Filme_id)
    REFERENCES Filme(id) ON DELETE CASCADE
);

CREATE TABLE Participa_HQ (
    fk_Personagem_id INT NOT NULL,
    fk_HQ_id INT NOT NULL,
    PRIMARY KEY (fk_Personagem_id, fk_HQ_id),
    CONSTRAINT fk_participa_hq_personagem FOREIGN KEY (fk_Personagem_id)
    REFERENCES Personagem(id) ON DELETE CASCADE,
    CONSTRAINT fk_participa_hq_hq FOREIGN KEY (fk_HQ_id)
    REFERENCES HQ(id) ON DELETE CASCADE
);

CREATE TABLE Consome_Filme (
    fk_Fa_email VARCHAR(100) NOT NULL,
    fk_Filme_id INT NOT NULL,
    PRIMARY KEY (fk_Fa_email, fk_Filme_id),
    CONSTRAINT fk_cons_filme_fa FOREIGN KEY (fk_Fa_email)
    REFERENCES Fa(email) ON DELETE CASCADE,
    CONSTRAINT fk_cons_filme_filme FOREIGN KEY (fk_Filme_id)
    REFERENCES Filme(id) ON DELETE CASCADE
);

CREATE TABLE Consome_HQ (
    fk_Fa_email VARCHAR(100) NOT NULL,
    fk_HQ_id INT NOT NULL,
    PRIMARY KEY (fk_Fa_email, fk_HQ_id),
    CONSTRAINT fk_cons_hq_fa FOREIGN KEY (fk_Fa_email)
    REFERENCES Fa(email) ON DELETE CASCADE,
    CONSTRAINT fk_cons_hq_hq FOREIGN KEY (fk_HQ_id)
    REFERENCES HQ(id) ON DELETE CASCADE
);
