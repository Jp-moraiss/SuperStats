ALTER TABLE Resposta DROP FOREIGN KEY fk_resposta_personagem;
ALTER TABLE Base DROP FOREIGN KEY fk_base_personagem;
ALTER TABLE Alter_Egos DROP FOREIGN KEY fk_alter_ego_personagem;
ALTER TABLE Conexoes DROP FOREIGN KEY fk_conexoes_1;
ALTER TABLE Conexoes DROP FOREIGN KEY fk_conexoes_2;
ALTER TABLE Participa_Filme DROP FOREIGN KEY fk_participa_filme_personagem;
ALTER TABLE Participa_HQ DROP FOREIGN KEY fk_participa_hq_personagem;

ALTER TABLE Personagem MODIFY COLUMN id INT NOT NULL;

ALTER TABLE Resposta ADD CONSTRAINT fk_resposta_personagem
    FOREIGN KEY (fk_Personagem_id) REFERENCES Personagem(id) ON DELETE SET NULL;

ALTER TABLE Base ADD CONSTRAINT fk_base_personagem
    FOREIGN KEY (fk_id_personagem) REFERENCES Personagem(id) ON DELETE CASCADE;

ALTER TABLE Alter_Egos ADD CONSTRAINT fk_alter_ego_personagem
    FOREIGN KEY (fk_Personagem_id) REFERENCES Personagem(id) ON DELETE CASCADE;

ALTER TABLE Conexoes ADD CONSTRAINT fk_conexoes_1
    FOREIGN KEY (fk_Personagem_id) REFERENCES Personagem(id) ON DELETE CASCADE;

ALTER TABLE Conexoes ADD CONSTRAINT fk_conexoes_2
    FOREIGN KEY (fk_Personagem_relacionado_id) REFERENCES Personagem(id) ON DELETE CASCADE;

ALTER TABLE Participa_Filme ADD CONSTRAINT fk_participa_filme_personagem
    FOREIGN KEY (fk_Personagem_id) REFERENCES Personagem(id) ON DELETE CASCADE;

ALTER TABLE Participa_HQ ADD CONSTRAINT fk_participa_hq_personagem
    FOREIGN KEY (fk_Personagem_id) REFERENCES Personagem(id) ON DELETE CASCADE;