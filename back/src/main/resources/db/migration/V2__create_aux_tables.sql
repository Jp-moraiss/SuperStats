CREATE TABLE Base (
                      base_PK SERIAL PRIMARY KEY,
                      nome_base VARCHAR(100),
                      fk_id_personagem INT NOT NULL,
                      CONSTRAINT fk_base_personagem FOREIGN KEY (fk_id_personagem)
                          REFERENCES Personagem(id) ON DELETE CASCADE
);

CREATE TABLE Alter_Egos (
                            alter_egos_PK SERIAL PRIMARY KEY,
                            alter_ego_name VARCHAR(100),
                            fk_Personagem_id INT NOT NULL,
                            CONSTRAINT fk_alter_ego_personagem FOREIGN KEY (fk_Personagem_id)
                                REFERENCES Personagem(id) ON DELETE CASCADE
);

CREATE TABLE Consome_Filme (
                               fk_Fa_id INT NOT NULL,
                               fk_Filme_id INT NOT NULL,
                               PRIMARY KEY (fk_Fa_id, fk_Filme_id),
                               CONSTRAINT fk_cons_filme_fa_id FOREIGN KEY (fk_Fa_id)
                                   REFERENCES Fa(id) ON DELETE CASCADE,
                               CONSTRAINT fk_cons_filme_filme FOREIGN KEY (fk_Filme_id)
                                   REFERENCES Filme(id) ON DELETE CASCADE
);

CREATE TABLE Consome_HQ (
                            fk_Fa_id INT NOT NULL,
                            fk_HQ_id INT NOT NULL,
                            PRIMARY KEY (fk_Fa_id, fk_HQ_id),
                            CONSTRAINT fk_cons_hq_fa_id FOREIGN KEY (fk_Fa_id)
                                REFERENCES Fa(id) ON DELETE CASCADE,
                            CONSTRAINT fk_cons_hq_hq FOREIGN KEY (fk_HQ_id)
                                REFERENCES HQ(id) ON DELETE CASCADE
);