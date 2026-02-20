CREATE OR REPLACE VIEW vw_perfil_completo_fa AS
SELECT
    f.id AS fa_id,
    f.username,
    f.nome,
    f.genero,
    fn_calcula_idade(f.data_nascimento) AS idade,
    f.ocupacao,
    f.univ_fav,
    fn_formata_tempo_geek(f.tempo_geek) AS tempo_geek_formatado,
    fn_calcula_perfil_consumo(f.id) AS perfil_consumo,

    (SELECT COALESCE(json_agg(json_build_object(
            'id', filme.id,
            'titulo', filme.titulo,
            'posterUrl', filme.poster_url,
            'trailerUrl', filme.trailer_url,
            'produtora', filme.produtora,
            'dataLancamento', filme.data_lancamento
                              )), '[]')
     FROM Consome_Filme cf_inner
              JOIN Filme filme ON cf_inner.fk_Filme_id = filme.id
     WHERE cf_inner.fk_Fa_id = f.id) AS filmes_assistidos_json,

    (SELECT COALESCE(json_agg(json_build_object(
            'id', hq.id,
            'titulo', hq.titulo,
            'coverUrl', hq.cover_url,
            'edicao', hq.edicao,
            'editora', hq.editora,
            'dataLancamento', hq.data_lancamento
                              )), '[]')
     FROM Consome_HQ ch_inner
              JOIN HQ hq ON ch_inner.fk_HQ_id = hq.id
     WHERE ch_inner.fk_Fa_id = f.id) AS hqs_lidas_json

FROM
    Fa f;