ALTER TABLE Pergunta ADD COLUMN texto_pergunta VARCHAR(255) NULL;

INSERT INTO Pesquisa (id_pesquisa, nome) VALUES (1, 'Pesquisa de Personagens Favoritos');

INSERT INTO Pergunta (id, tipo, texto_pergunta, fk_Pesquisa_id) VALUES
    (1, 'Personagem', 'Qual o seu herói preferido?', 1),
    (2, 'Personagem', 'Qual o seu vilão preferido?', 1);