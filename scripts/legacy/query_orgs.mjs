import fs from 'fs';

const sql = `
SELECT id, name FROM organization WHERE name = 'Dirección Nacional';
`;
fs.writeFileSync('query_orgs.sql', sql, 'utf8');
