-- Conteúdo para V12__Create_all_procedures_and_achievements.sql

-- -----------------------------------------------------------------------------------
-- PARTE A: ESTRUTURA DA TABELA DE CONQUISTAS
-- -----------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS Conquistas_Fa (
                                             id INT AUTO_INCREMENT PRIMARY KEY,
                                             fk_Fa_id INT NOT NULL,
                                             nome_conquista VARCHAR(100) NOT NULL,
    tipo_conquista VARCHAR(10) NOT NULL,
    data_conquista TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (fk_Fa_id) REFERENCES Fa(id) ON DELETE CASCADE,
    UNIQUE KEY uq_fa_conquista_tipo (fk_Fa_id, tipo_conquista)
    );

-- -----------------------------------------------------------------------------------
-- PARTE B: PROCEDIMENTOS QUE CUMPREM OS REQUISITOS OBRIGATÓRIOS
-- -----------------------------------------------------------------------------------

-- REQUISITO 1: PROCEDIMENTO PARA ATUALIZAÇÃO DE DADOS
-- Será chamado pela funcionalidade de "Editar Perfil".
DELIMITER //
CREATE PROCEDURE sp_atualiza_perfil_fa(
    IN p_fa_id INT,
    IN p_ocupacao VARCHAR(255),
    IN p_univ_fav VARCHAR(255)
)
BEGIN
UPDATE Fa
SET
    ocupacao = p_ocupacao,
    univ_fav = p_univ_fav
WHERE id = p_fa_id;
END //
DELIMITER ;


-- REQUISITO 2: PROCEDIMENTO COM USO DE CURSOR
-- Será chamado pelo botão de "Recalcular Conquistas".
DELIMITER //
CREATE PROCEDURE sp_processa_conquistas_em_lote()
BEGIN
    DECLARE done INT DEFAULT FALSE;
    DECLARE v_fa_id INT;
    -- Variáveis para HQs
    DECLARE v_total_hqs INT;
    DECLARE v_badge_hq_merecido VARCHAR(100);
    DECLARE v_badge_hq_existente VARCHAR(100);
    -- Variáveis para Filmes
    DECLARE v_total_filmes INT;
    DECLARE v_badge_filme_merecido VARCHAR(100);
    DECLARE v_badge_filme_existente VARCHAR(100);

    DECLARE cur_fas CURSOR FOR SELECT id FROM Fa;
DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;

OPEN cur_fas;
loop_fas: LOOP
        FETCH cur_fas INTO v_fa_id;
        IF done THEN
            LEAVE loop_fas;
END IF;

        -- --- LÓGICA PARA HQs ---
SELECT COUNT(*) INTO v_total_hqs FROM Consome_HQ WHERE fk_Fa_id = v_fa_id;
SELECT nome_conquista INTO v_badge_hq_existente FROM Conquistas_Fa WHERE fk_Fa_id = v_fa_id AND tipo_conquista = 'HQ' LIMIT 1;

SET v_badge_hq_merecido = NULL;
        IF v_total_hqs >= 16 THEN SET v_badge_hq_merecido = 'Portador do Darkhold';
        ELSEIF v_total_hqs >= 6 THEN SET v_badge_hq_merecido = 'Leitor Voraz';
        ELSEIF v_total_hqs >= 1 THEN SET v_badge_hq_merecido = 'Leitor Casual';
END IF;

        IF COALESCE(v_badge_hq_merecido, '') <> COALESCE(v_badge_hq_existente, '') THEN
DELETE FROM Conquistas_Fa WHERE fk_Fa_id = v_fa_id AND tipo_conquista = 'HQ';
IF v_badge_hq_merecido IS NOT NULL THEN
                INSERT INTO Conquistas_Fa (fk_Fa_id, nome_conquista, tipo_conquista) VALUES (v_fa_id, v_badge_hq_merecido, 'HQ');
END IF;
END IF;

        -- --- LÓGICA PARA FILMES ---
SELECT COUNT(*) INTO v_total_filmes FROM Consome_Filme WHERE fk_Fa_id = v_fa_id;
SELECT nome_conquista INTO v_badge_filme_existente FROM Conquistas_Fa WHERE fk_Fa_id = v_fa_id AND tipo_conquista = 'Filme' LIMIT 1;

SET v_badge_filme_merecido = NULL;
        IF v_total_filmes >= 16 THEN SET v_badge_filme_merecido = 'O Vigia Cósmico';
        ELSEIF v_total_filmes >= 6 THEN SET v_badge_filme_merecido = 'Cinéfilo Amador';
        ELSEIF v_total_filmes >= 1 THEN SET v_badge_filme_merecido = 'Espectador Ocasional';
END IF;

        IF COALESCE(v_badge_filme_merecido, '') <> COALESCE(v_badge_filme_existente, '') THEN
DELETE FROM Conquistas_Fa WHERE fk_Fa_id = v_fa_id AND tipo_conquista = 'Filme';
IF v_badge_filme_merecido IS NOT NULL THEN
                INSERT INTO Conquistas_Fa (fk_Fa_id, nome_conquista, tipo_conquista) VALUES (v_fa_id, v_badge_filme_merecido, 'Filme');
END IF;
END IF;

END LOOP;
CLOSE cur_fas;
END //
DELIMITER ;


-- -----------------------------------------------------------------------------------
-- PARTE C: PROCEDIMENTOS "ON-DEMAND" USADOS PELA APLICAÇÃO (ESSENCIAIS)
-- Estes são os procedimentos que o seu Java Service chama para a automação do perfil.
-- -----------------------------------------------------------------------------------

DELIMITER //
CREATE PROCEDURE sp_atualiza_conquistas_leitor_por_fa(IN p_fa_id INT)
BEGIN
    DECLARE v_total_hqs INT;
    DECLARE v_badge_merecido VARCHAR(100);
    DECLARE v_badge_existente VARCHAR(100);
SELECT COUNT(*) INTO v_total_hqs FROM Consome_HQ WHERE fk_Fa_id = p_fa_id;
SELECT nome_conquista INTO v_badge_existente FROM Conquistas_Fa WHERE fk_Fa_id = p_fa_id AND tipo_conquista = 'HQ' LIMIT 1;
SET v_badge_merecido = NULL;
    IF v_total_hqs >= 16 THEN SET v_badge_merecido = 'Portador do Darkhold';
    ELSEIF v_total_hqs >= 6 THEN SET v_badge_merecido = 'Leitor Voraz';
    ELSEIF v_total_hqs >= 1 THEN SET v_badge_merecido = 'Leitor Casual';
END IF;
    IF COALESCE(v_badge_merecido, '') <> COALESCE(v_badge_existente, '') THEN
DELETE FROM Conquistas_Fa WHERE fk_Fa_id = p_fa_id AND tipo_conquista = 'HQ';
IF v_badge_merecido IS NOT NULL THEN
            INSERT INTO Conquistas_Fa (fk_Fa_id, nome_conquista, tipo_conquista) VALUES (p_fa_id, v_badge_merecido, 'HQ');
END IF;
END IF;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE sp_atualiza_conquistas_cinefilo_por_fa(IN p_fa_id INT)
BEGIN
    DECLARE v_total_filmes INT;
    DECLARE v_badge_merecido VARCHAR(100);
    DECLARE v_badge_existente VARCHAR(100);
SELECT COUNT(*) INTO v_total_filmes FROM Consome_Filme WHERE fk_Fa_id = p_fa_id;
SELECT nome_conquista INTO v_badge_existente FROM Conquistas_Fa WHERE fk_Fa_id = p_fa_id AND tipo_conquista = 'Filme' LIMIT 1;
SET v_badge_merecido = NULL;
    IF v_total_filmes >= 16 THEN SET v_badge_merecido = 'O Vigia Cósmico';
    ELSEIF v_total_filmes >= 6 THEN SET v_badge_merecido = 'Cinéfilo Amador';
    ELSEIF v_total_filmes >= 1 THEN SET v_badge_merecido = 'Espectador Ocasional';
END IF;
    IF COALESCE(v_badge_merecido, '') <> COALESCE(v_badge_existente, '') THEN
DELETE FROM Conquistas_Fa WHERE fk_Fa_id = p_fa_id AND tipo_conquista = 'Filme';
IF v_badge_merecido IS NOT NULL THEN
            INSERT INTO Conquistas_Fa (fk_Fa_id, nome_conquista, tipo_conquista) VALUES (p_fa_id, v_badge_merecido, 'Filme');
END IF;
END IF;
END //
DELIMITER ;