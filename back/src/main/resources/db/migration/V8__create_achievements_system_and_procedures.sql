-- -----------------------------------------------------------------------------------
-- PARTE A: ESTRUTURA DA TABELA DE CONQUISTAS
-- -----------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS Conquistas_Fa (
                                             id SERIAL PRIMARY KEY,
                                             fk_Fa_id INT NOT NULL,
                                             nome_conquista VARCHAR(100) NOT NULL,
    tipo_conquista VARCHAR(10) NOT NULL,
    data_conquista TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_fa_conquista FOREIGN KEY (fk_Fa_id) REFERENCES Fa(id) ON DELETE CASCADE,
    CONSTRAINT uq_fa_conquista_tipo UNIQUE (fk_Fa_id, tipo_conquista)
    );

-- -----------------------------------------------------------------------------------
-- PARTE B: PROCEDIMENTOS OBRIGATÓRIOS
-- -----------------------------------------------------------------------------------

-- REQUISITO 1: PROCEDIMENTO PARA ATUALIZAÇÃO DE DADOS
CREATE OR REPLACE PROCEDURE sp_atualiza_perfil_fa(
    p_fa_id INT,
    p_ocupacao VARCHAR(255),
    p_univ_fav VARCHAR(255)
)
LANGUAGE plpgsql
AS $$
BEGIN
UPDATE Fa
SET ocupacao = p_ocupacao,
    univ_fav = p_univ_fav
WHERE id = p_fa_id;
END;
$$;


-- REQUISITO 2: PROCEDIMENTO COM USO DE CURSOR (Processamento em Lote)
CREATE OR REPLACE PROCEDURE sp_processa_conquistas_em_lote()
LANGUAGE plpgsql
AS $$
DECLARE
v_fa_id INT;
    v_total_hqs INT;
    v_badge_hq_merecido VARCHAR(100);
    v_badge_hq_existente VARCHAR(100);
    v_total_filmes INT;
    v_badge_filme_merecido VARCHAR(100);
    v_badge_filme_existente VARCHAR(100);

    -- Declaração do Cursor
    cur_fas CURSOR FOR SELECT id FROM Fa;
BEGIN
OPEN cur_fas;

LOOP
FETCH cur_fas INTO v_fa_id;
        EXIT WHEN NOT FOUND; -- Sai do loop quando não houver mais registros

        -- --- LÓGICA PARA HQs ---
SELECT COUNT(*) INTO v_total_hqs FROM Consome_HQ WHERE fk_Fa_id = v_fa_id;

-- Pegamos a conquista atual (se existir)
SELECT nome_conquista INTO v_badge_hq_existente
FROM Conquistas_Fa
WHERE fk_Fa_id = v_fa_id AND tipo_conquista = 'HQ'
    LIMIT 1;

v_badge_hq_merecido := NULL;
        IF v_total_hqs >= 16 THEN v_badge_hq_merecido := 'Portador do Darkhold';
        ELSIF v_total_hqs >= 6 THEN v_badge_hq_merecido := 'Leitor Voraz';
        ELSIF v_total_hqs >= 1 THEN v_badge_hq_merecido := 'Leitor Casual';
END IF;

        -- Comparação e atualização
        IF COALESCE(v_badge_hq_merecido, '') <> COALESCE(v_badge_hq_existente, '') THEN
DELETE FROM Conquistas_Fa WHERE fk_Fa_id = v_fa_id AND tipo_conquista = 'HQ';
IF v_badge_hq_merecido IS NOT NULL THEN
                INSERT INTO Conquistas_Fa (fk_Fa_id, nome_conquista, tipo_conquista)
                VALUES (v_fa_id, v_badge_hq_merecido, 'HQ');
END IF;
END IF;

        -- --- LÓGICA PARA FILMES ---
SELECT COUNT(*) INTO v_total_filmes FROM Consome_Filme WHERE fk_Fa_id = v_fa_id;

SELECT nome_conquista INTO v_badge_filme_existente
FROM Conquistas_Fa
WHERE fk_Fa_id = v_fa_id AND tipo_conquista = 'Filme'
    LIMIT 1;

v_badge_filme_merecido := NULL;
        IF v_total_filmes >= 16 THEN v_badge_filme_merecido := 'O Vigia Cósmico';
        ELSIF v_total_filmes >= 6 THEN v_badge_filme_merecido := 'Cinéfilo Amador';
        ELSIF v_total_filmes >= 1 THEN v_badge_filme_merecido := 'Espectador Ocasional';
END IF;

        IF COALESCE(v_badge_filme_merecido, '') <> COALESCE(v_badge_filme_existente, '') THEN
DELETE FROM Conquistas_Fa WHERE fk_Fa_id = v_fa_id AND tipo_conquista = 'Filme';
IF v_badge_filme_merecido IS NOT NULL THEN
                INSERT INTO Conquistas_Fa (fk_Fa_id, nome_conquista, tipo_conquista)
                VALUES (v_fa_id, v_badge_filme_merecido, 'Filme');
END IF;
END IF;

END LOOP;

CLOSE cur_fas;
END;
$$;

-- -----------------------------------------------------------------------------------
-- PARTE C: PROCEDIMENTOS "ON-DEMAND"
-- -----------------------------------------------------------------------------------

-- ATUALIZA CONQUISTAS LEITOR
CREATE OR REPLACE PROCEDURE sp_atualiza_conquistas_leitor_por_fa(p_fa_id INT)
LANGUAGE plpgsql
AS $$
DECLARE
v_total_hqs INT;
    v_badge_merecido VARCHAR(100);
    v_badge_existente VARCHAR(100);
BEGIN
SELECT COUNT(*) INTO v_total_hqs FROM Consome_HQ WHERE fk_Fa_id = p_fa_id;
SELECT nome_conquista INTO v_badge_existente
FROM Conquistas_Fa
WHERE fk_Fa_id = p_fa_id AND tipo_conquista = 'HQ'
    LIMIT 1;

v_badge_merecido := NULL;
    IF v_total_hqs >= 16 THEN v_badge_merecido := 'Portador do Darkhold';
    ELSIF v_total_hqs >= 6 THEN v_badge_merecido := 'Leitor Voraz';
    ELSIF v_total_hqs >= 1 THEN v_badge_merecido := 'Leitor Casual';
END IF;

    IF COALESCE(v_badge_merecido, '') <> COALESCE(v_badge_existente, '') THEN
DELETE FROM Conquistas_Fa WHERE fk_Fa_id = p_fa_id AND tipo_conquista = 'HQ';
IF v_badge_merecido IS NOT NULL THEN
            INSERT INTO Conquistas_Fa (fk_Fa_id, nome_conquista, tipo_conquista)
            VALUES (p_fa_id, v_badge_merecido, 'HQ');
END IF;
END IF;
END;
$$;

-- ATUALIZA CONQUISTAS CINÉFILO
CREATE OR REPLACE PROCEDURE sp_atualiza_conquistas_cinefilo_por_fa(p_fa_id INT)
LANGUAGE plpgsql
AS $$
DECLARE
v_total_filmes INT;
    v_badge_merecido VARCHAR(100);
    v_badge_existente VARCHAR(100);
BEGIN
SELECT COUNT(*) INTO v_total_filmes FROM Consome_Filme WHERE fk_Fa_id = p_fa_id;
SELECT nome_conquista INTO v_badge_existente
FROM Conquistas_Fa
WHERE fk_Fa_id = p_fa_id AND tipo_conquista = 'Filme'
    LIMIT 1;

v_badge_merecido := NULL;
    IF v_total_filmes >= 16 THEN v_badge_merecido := 'O Vigia Cósmico';
    ELSIF v_total_filmes >= 6 THEN v_badge_merecido := 'Cinéfilo Amador';
    ELSIF v_total_filmes >= 1 THEN v_badge_merecido := 'Espectador Ocasional';
END IF;

    IF COALESCE(v_badge_merecido, '') <> COALESCE(v_badge_existente, '') THEN
DELETE FROM Conquistas_Fa WHERE fk_Fa_id = p_fa_id AND tipo_conquista = 'Filme';
IF v_badge_merecido IS NOT NULL THEN
            INSERT INTO Conquistas_Fa (fk_Fa_id, nome_conquista, tipo_conquista)
            VALUES (p_fa_id, v_badge_merecido, 'Filme');
END IF;
END IF;
END;
$$;