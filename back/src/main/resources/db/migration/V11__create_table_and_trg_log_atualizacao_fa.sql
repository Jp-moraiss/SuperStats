CREATE TABLE IF NOT EXISTS Log_Alteracoes_Fa (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fa_id INT,
    campo_alterado VARCHAR(50),
    valor_antigo VARCHAR(255),
    valor_novo VARCHAR(255),
    data_alteracao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    usuario_modificador VARCHAR(100)
    );

DELIMITER $
CREATE TRIGGER trg_log_atualizacao_fa
    AFTER UPDATE ON Fa
    FOR EACH ROW
BEGIN
    IF COALESCE(OLD.ocupacao, '') <> COALESCE(NEW.ocupacao, '') THEN
        INSERT INTO Log_Alteracoes_Fa (fa_id, campo_alterado, valor_antigo, valor_novo, usuario_modificador)
        VALUES (OLD.id, 'ocupacao', OLD.ocupacao, NEW.ocupacao, CURRENT_USER());
END IF;

IF COALESCE(OLD.univ_fav, '') <> COALESCE(NEW.univ_fav, '') THEN
        INSERT INTO Log_Alteracoes_Fa (fa_id, campo_alterado, valor_antigo, valor_novo, usuario_modificador)
        VALUES (OLD.id, 'univ_fav', OLD.univ_fav, NEW.univ_fav, CURRENT_USER());
END IF;
END $
DELIMITER ;