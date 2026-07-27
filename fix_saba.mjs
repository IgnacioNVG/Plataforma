import fs from 'fs';

const sql = `
UPDATE organization 
SET name = 'Dirección Nacional' 
WHERE name = 'Juventud Socialista';

UPDATE position_type 
SET title = 'Presidente' 
WHERE title = 'Presidente de la Juventud';
`;

fs.writeFileSync('fix_saba.sql', sql, 'utf8');
console.log('File written to fix_saba.sql');
