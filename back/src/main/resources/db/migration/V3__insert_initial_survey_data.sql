INSERT INTO Pesquisa (id_pesquisa, nome) VALUES (1, 'Pesquisa de Personagens');

INSERT INTO Pergunta (id, tipo, texto_pergunta, fk_Pesquisa_id) VALUES
    (1, 'Personagem', 'Qual o seu herói preferido?', 1),
    (2, 'Personagem', 'Qual o seu vilão preferido?', 1),
    (3, 'Personagem', 'Qual personagem você considera mais forte?', 1),
    (4, 'Personagem', 'Qual personagem você considera mais inteligente?', 1),
    (5, 'Personagem', 'Qual personagem você considera mais rápido?', 1);

SELECT setval(pg_get_serial_sequence('Pesquisa', 'id_pesquisa'), (SELECT MAX(id_pesquisa) FROM Pesquisa));
SELECT setval(pg_get_serial_sequence('Pergunta', 'id'), (SELECT MAX(id) FROM Pergunta));