CREATE TABLE Base (
    base_PK INT PRIMARY KEY AUTO_INCREMENT,
    nome_base VARCHAR(100),
    fk_id_personagem INT NOT NULL,
    CONSTRAINT fk_base_personagem FOREIGN KEY (fk_id_personagem)
      REFERENCES Personagem(id) ON DELETE CASCADE
);

CREATE TABLE Alter_Egos (
    alter_egos_PK INT PRIMARY KEY AUTO_INCREMENT,
    alter_ego_name VARCHAR(100),
    fk_Personagem_id INT NOT NULL,
    CONSTRAINT fk_alter_ego_personagem FOREIGN KEY (fk_Personagem_id)
    REFERENCES Personagem(id) ON DELETE CASCADE
);

CREATE TABLE Conexoes (
    fk_Personagem_id INT NOT NULL,
    fk_Personagem_relacionado_id INT NOT NULL,
    PRIMARY KEY (fk_Personagem_id, fk_Personagem_relacionado_id),
    CONSTRAINT fk_conexoes_1 FOREIGN KEY (fk_Personagem_id)
      REFERENCES Personagem(id) ON DELETE CASCADE,
    CONSTRAINT fk_conexoes_2 FOREIGN KEY (fk_Personagem_relacionado_id)
      REFERENCES Personagem(id) ON DELETE CASCADE
);
