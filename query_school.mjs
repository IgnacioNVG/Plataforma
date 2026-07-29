import fs from 'fs';

const sql = `
SELECT id, name FROM school;
`;
fs.writeFileSync('query_school.sql', sql, 'utf8');
