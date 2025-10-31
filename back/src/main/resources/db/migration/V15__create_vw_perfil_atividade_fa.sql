CREATE OR REPLACE VIEW vw_perfil_atividade_fa AS
SELECT
    f.id AS fa_id,
    f.username,
    f.nome,
    f.genero,
    f.idade,
    f.ocupacao,
    f.tempo_geek,
    f.univ_fav,
    (SELECT COUNT(*) FROM Consome_Filme cf WHERE cf.fk_Fa_id = f.id) AS total_filmes_assistidos,
    (SELECT COUNT(*) FROM Consome_HQ ch WHERE ch.fk_Fa_id = f.id) AS total_hqs_lidas,
    (SELECT COUNT(*) FROM Personagem_Novo pn WHERE pn.fa_criador_id = f.id) AS total_personagens_criados
FROM
    Fa f;