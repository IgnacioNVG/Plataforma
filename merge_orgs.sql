
-- Move appointments from the duplicate org to the original org
UPDATE appointment 
SET organization_id = '56a8a903-84ff-42f6-b713-5f0079b17fd6' 
WHERE organization_id = '4ecab8da-bfac-4e47-b80d-9fe4aa1b0e59';

-- Delete the duplicate org
DELETE FROM organization 
WHERE id = '4ecab8da-bfac-4e47-b80d-9fe4aa1b0e59';
