CREATE OR REPLACE FUNCTION fn_trg_concede_badge_boas_vindas()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
INSERT INTO Conquistas_Fa (fk_Fa_id, nome_conquista, tipo_conquista)
VALUES (NEW.id, 'Primeira Edição', 'Sistema');

RETURN NEW;
END;
$$;

CREATE TRIGGER trg_concede_badge_boas_vindas
    AFTER INSERT ON Fa
    FOR EACH ROW
    EXECUTE FUNCTION fn_trg_concede_badge_boas_vindas();