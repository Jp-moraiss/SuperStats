DELIMITER $
CREATE TRIGGER trg_concede_badge_boas_vindas
    AFTER INSERT ON Fa
    FOR EACH ROW
BEGIN
    INSERT INTO Conquistas_Fa (fk_Fa_id, nome_conquista, tipo_conquista)
    VALUES (NEW.id, 'Primeira Edição', 'Sistema');
END $
DELIMITER ;