CREATE OR REPLACE VIEW vw_perfil_completo_fa AS
SELECT
    f.id AS fa_id,
    f.username,
    f.nome,
    f.genero,
    f.idade,
    f.ocupacao,
    f.tempo_geek,
    f.univ_fav,

    (SELECT JSON_ARRAYAGG(JSON_OBJECT(
            'id', filme.id,
            'titulo', filme.titulo,
            'posterUrl', filme.poster_url,
            'trailerUrl', filme.trailer_url,
            'produtora', filme.produtora,
            'dataLancamento', filme.data_lancamento
                          ))
     FROM Consome_Filme cf_inner
              JOIN Filme filme ON cf_inner.fk_Filme_id = filme.id
     WHERE cf_inner.fk_Fa_id = f.id) AS filmes_assistidos_json,

    (SELECT JSON_ARRAYAGG(JSON_OBJECT(
            'id', hq.id,
            'titulo', hq.titulo,
            'coverUrl', hq.cover_url,
            'edicao', hq.edicao,
            'editora', hq.editora,
            'dataLancamento', hq.data_lancamento
                          ))
     FROM Consome_HQ ch_inner
              JOIN HQ hq ON ch_inner.fk_HQ_id = hq.id
     WHERE ch_inner.fk_Fa_id = f.id) AS hqs_lidas_json

FROM
    Fa f;