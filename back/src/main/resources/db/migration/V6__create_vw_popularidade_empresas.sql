CREATE OR REPLACE VIEW vw_popularidade_empresas AS

SELECT
    hq.editora AS empresa_nome,
    'HQ' AS tipo_midia,
    COUNT(ch.fk_HQ_id) AS total_consumido
    FROM HQ hq
    JOIN Consome_HQ ch ON hq.id = ch.fk_HQ_id
    WHERE hq.editora IS NOT NULL AND hq.editora != ''
    GROUP BY hq.editora

UNION ALL

SELECT
    filme.produtora AS empresa_nome,
    'Filme' AS tipo_midia,
    COUNT(cf.fk_Filme_id) AS total_consumido
    FROM Filme filme
    JOIN Consome_Filme cf ON filme.id = cf.fk_Filme_id
    WHERE filme.produtora IS NOT NULL AND filme.produtora != ''
    GROUP BY filme.produtora;