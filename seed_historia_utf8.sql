
-- 1. Create School
INSERT INTO school (id, name, description, target_audience, status, created_at)
VALUES ('0f959894-5608-4f8c-a289-48df414c82ac', 'Escuela de Formación Carlos Lorca', 'Formación y capacitación política para la militancia.', 'Nuevos militantes, aspirantes y simpatizantes', 'publicado', strftime('%s','now') * 1000);

-- 2. Create Course
INSERT INTO course (id, school_id, title, description, is_mandatory, status, created_at)
VALUES ('51d7622f-048f-4827-a363-bb516950076e', '0f959894-5608-4f8c-a289-48df414c82ac', 'Historia y Memoria: Datos Curiosos de la JS', 'Primer curso de la plataforma, enfocado en la historia de la JS y el Partido Socialista, utilizando un formato lúdico y de Fun Facts.', 1, 'publicado', strftime('%s','now') * 1000);

-- 3. Create Modules
INSERT INTO module (id, course_id, title, content, `order`, created_at)
VALUES 
('e77b6155-a8f1-4367-b7e3-ef9cc245698c', '51d7622f-048f-4827-a363-bb516950076e', 'Módulo 1: Los Inicios (1933) y el Mito Fundacional', '## Fun Facts de los inicios
- **Fun Fact 1**: ¿Sabías que el PS se fundó en un café? (El Café Iris, en la calle San Diego, Santiago).
- **Fun Fact 2**: La Juventud Socialista nace casi al mismo tiempo, siendo clave en la organización de los estudiantes y obreros jóvenes de la época.

**Lección**: La importancia de la unión de distintas corrientes (marxistas, anarquistas, masones) para formar un frente común.', 1, strftime('%s','now') * 1000),

('2cc388be-4dda-4281-8209-fd455f3aed3e', '51d7622f-048f-4827-a363-bb516950076e', 'Módulo 2: Símbolos y Mística', '## Símbolos Históricos
- **Fun Fact 3**: El hacha toqui y el mapa de América Latina. ¿Por qué el hacha mapuche? Representa la resistencia indígena y el componente indoamericano del socialismo chileno.
- **Fun Fact 4**: La camisa de los milicianos socialistas (las "Camisas de Acero") y por qué dejaron de usarse.

**Lección**: Entender la iconografía, el himno (La Marsellesa Socialista) y el grito del partido.', 2, strftime('%s','now') * 1000),

('d25f8668-793c-41b7-846e-d06e773524b1', '51d7622f-048f-4827-a363-bb516950076e', 'Módulo 3: Figuras Históricas (Más allá del bronce)', '## Líderes Jóvenes
- **Fun Fact 5**: Salvador Allende fue campeón de decatlón en su juventud y un ávido jugador de ajedrez.
- **Fun Fact 6**: Michelle Bachelet fue una destacada dirigente estudiantil y parte de la JS antes del golpe de Estado.

**Lección**: Humanizar a los líderes históricos y mostrar que todos comenzaron como jóvenes militantes de base.', 3, strftime('%s','now') * 1000),

('96215433-1a20-4dc8-99e5-125d47cdae19', '51d7622f-048f-4827-a363-bb516950076e', 'Módulo 4: Resistencia y Retorno a la Democracia', '## Años Difíciles
- **Fun Fact 7**: Las radios clandestinas y cómo los jóvenes se comunicaban eludiendo la censura durante los años 70 y 80.
- **Fun Fact 8**: La JS fue fundamental en las protestas estudiantiles de los 80, organizando desde las universidades y liceos.

**Lección**: El rol de la juventud en la recuperación de la democracia y el costo de la dictadura.', 4, strftime('%s','now') * 1000),

('bab6306c-17bb-4d67-82e3-aaf8c50e9e4e', '51d7622f-048f-4827-a363-bb516950076e', 'Módulo 5: Desafíos del Presente', '## La JS de Hoy
- **Reflexión final**: ¿Qué significa ser joven y socialista hoy? (Feminismo, ecología, descentralización).
- **Evaluación**: Un pequeño cuestionario interactivo ("Trivia Socialista") para comprobar lo aprendido y desbloquear la insignia del curso.', 5, strftime('%s','now') * 1000);

-- 4. Enroll ALL users in this course (Dynamic INSERT)
INSERT INTO enrollment (id, user_id, course_id, status, progress_percentage, created_at)
SELECT lower(hex(randomblob(16))), id, '51d7622f-048f-4827-a363-bb516950076e', 'en_progreso', 0, strftime('%s','now') * 1000
FROM user;
