-- Inserindo dados na tabela "muscle_groups"
INSERT INTO "muscle_groups" (id, name) VALUES 
(1, 'Peito'),
(2, 'Costas'),
(3, 'Pernas'),
(4, 'Ombros'),
(5, 'Braços'),
(6, 'Abdômen');

-- Inserindo dados na tabela "predefined_exercises"
INSERT INTO "predefined_exercises" (name, "muscleGroupId") VALUES 
-- Peito (ID 1)
('Peck Deck', 1),
('Flexão de Braços', 1),
('Crucifixo Inverso', 1),
('Supino Declinado', 1),
('Fly', 1),

-- Costas (ID 2)
('Remada Baixa', 2),
('Puxada Frontal', 2),
('Levantamento Terra Romeno', 2),
('Remada Curvada', 2),
('Hiperextensão', 2),

-- Pernas (ID 3)
('Agachamento Frontal', 3),
('Agachamento Sumô', 3),
('Cadeira Abdutora', 3),
('Cadeira Adutora', 3),
('Step', 3),
('Panturrilha em Leg Press', 3),

-- Ombros (ID 4)
('Desenvolvimento Militar', 4),
('Elevação Frontal', 4),
('Elevação Lateral com Halteres', 4),
('Encolhimento de Ombros', 4),

-- Braços (ID 5)
('Barra Fixa com Pegada Supinada', 5),
('Rosca Martelo', 5),
('Tríceps Francês', 5),
('Mergulho', 5),

-- Abdômen (ID 6)
('Prancha', 6),
('Abdominal Tradicional', 6),
('Elevação de Pernas', 6),
('Crunch', 6),
('Abdominal com Peso', 6);
