DELIMITER $
CREATE FUNCTION fn_calcula_perfil_consumo(p_fa_id INT)
    RETURNS VARCHAR(20)
    DETERMINISTIC
BEGIN
    DECLARE v_filmes_count INT;
    DECLARE v_hqs_count INT;

SELECT COUNT(*) INTO v_filmes_count FROM Consome_Filme WHERE fk_Fa_id = p_fa_id;
SELECT COUNT(*) INTO v_hqs_count FROM Consome_HQ WHERE fk_Fa_id = p_fa_id;

IF v_filmes_count > 0 AND v_hqs_count > 0 THEN
        RETURN 'Ambos';
    ELSEIF v_filmes_count > 0 AND v_hqs_count = 0 THEN
        RETURN 'Apenas Filmes';
    ELSEIF v_filmes_count = 0 AND v_hqs_count > 0 THEN
        RETURN 'Apenas HQs';
ELSE
        RETURN 'Nenhum Consumo';
END IF;
END $
DELIMITER ;

DELIMITER $
CREATE FUNCTION fn_formata_tempo_geek(p_anos INT)
    RETURNS VARCHAR(50)
    DETERMINISTIC
BEGIN
    IF p_anos IS NULL OR p_anos <= 0 THEN
        RETURN 'Iniciante';
    ELSEIF p_anos = 1 THEN
        RETURN '1 ano de experiência';
ELSE
        RETURN CONCAT(p_anos, ' anos de experiência');
END IF;
END $
DELIMITER ;