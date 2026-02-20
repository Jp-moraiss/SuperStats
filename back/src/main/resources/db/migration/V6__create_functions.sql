CREATE OR REPLACE FUNCTION fn_calcula_perfil_consumo(p_fa_id INT)
    RETURNS VARCHAR(20)
    LANGUAGE plpgsql
AS $$
DECLARE
v_filmes_count INT;
    v_hqs_count INT;
BEGIN
SELECT COUNT(*) INTO v_filmes_count FROM Consome_Filme WHERE fk_Fa_id = p_fa_id;
SELECT COUNT(*) INTO v_hqs_count FROM Consome_HQ WHERE fk_Fa_id = p_fa_id;

IF v_filmes_count > 0 AND v_hqs_count > 0 THEN
        RETURN 'Ambos';
    ELSIF v_filmes_count > 0 AND v_hqs_count = 0 THEN
        RETURN 'Apenas Filmes';
    ELSIF v_filmes_count = 0 AND v_hqs_count > 0 THEN
        RETURN 'Apenas HQs';
ELSE
        RETURN 'Nenhum Consumo';
END IF;
END;
$$;

CREATE OR REPLACE FUNCTION fn_formata_tempo_geek(p_anos INT)
    RETURNS VARCHAR(50)
    LANGUAGE plpgsql
AS $$
BEGIN
    IF p_anos IS NULL OR p_anos <= 0 THEN
        RETURN 'Iniciante';
    ELSIF p_anos = 1 THEN
        RETURN '1 ano de experiência';
ELSE
        RETURN p_anos || ' anos de experiência';
END IF;
END;
$$;

CREATE OR REPLACE FUNCTION fn_calcula_idade(p_data_nascimento DATE)
    RETURNS INT
    LANGUAGE plpgsql
AS $$
BEGIN
    IF p_data_nascimento IS NULL THEN
        RETURN NULL;
END IF;

RETURN EXTRACT(YEAR FROM age(CURRENT_DATE, p_data_nascimento))::INT;
END;
$$;