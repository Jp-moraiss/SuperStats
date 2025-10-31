-- Conteúdo para V8__Add_external_ids_to_media.sql

-- Adiciona a coluna para o ID do TMDB na tabela de filmes com uma restrição de unicidade.
ALTER TABLE Filme ADD COLUMN tmdb_id INT UNIQUE;

-- Adiciona a coluna para a URL de detalhe da API na tabela de HQs.
ALTER TABLE HQ ADD COLUMN api_detail_url VARCHAR(255) UNIQUE;