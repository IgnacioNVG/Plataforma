import { db } from '../db';
import { 
  appointmentTable, 
  organizationTable, 
  policyTable, 
  positionTypeTable,
  accessRequestTable
} from '../db/schema';
import { eq, and, gt } from 'drizzle-orm';

/**
 * authorizationEngine evaluates if a user can perform an action on a resource.
 * It queries the user's active appointments and the defined policies.
 */
export async function authorize(
  userId: string | undefined,
  action: 'create' | 'read' | 'update' | 'delete' | 'manage',
  resourceType: 'document' | 'news' | 'event' | 'forum' | 'organization' | 'all',
  resourceClassification: 'publico' | 'interno' | 'reservado' | 'confidencial' = 'publico',
  resourceOrgId?: string,
  resourceId?: string
): Promise<boolean> {
  
  if (!userId) return false;

  // 1. Check explicit document access requests for read
  if (action === 'read' && resourceType === 'document' && resourceId) {
    const access = await db.select().from(accessRequestTable)
      .where(
        and(
          eq(accessRequestTable.documentId, resourceId),
          eq(accessRequestTable.requesterUserId, userId),
          eq(accessRequestTable.status, 'approved')
        )
      ).get();
    if (access) return true;
  }

  // 2. Public resources are readable
  if (action === 'read' && resourceClassification === 'publico') {
    return true;
  }

  // 3. Get Active Appointments
  const now = new Date();
  const rawAppointments = await db.select().from(appointmentTable)
    .where(eq(appointmentTable.userId, userId));
  
  const activeAppointments = rawAppointments.filter(app => {
    return app.status === 'activo' && (!app.endDate || new Date(app.endDate) > now);
  });

  if (activeAppointments.length === 0) {
    if (action === 'read' && resourceClassification === 'interno') return true;
    return false;
  }

  const policies = await db.select().from(policyTable);
  const requiredClearance = getClearanceLevel(resourceClassification);

  // 4. Functional Permissions Mapping
  const allowedFunctionsForResource: Record<string, string[]> = {
    'event': ['politico', 'general', 'presidencia'],
    'news': ['politico', 'general', 'presidencia'],
    'forum': ['politico', 'general', 'presidencia'],
    'organization': ['organico', 'general', 'presidencia'],
    'document': ['general', 'presidencia', 'organico', 'politico', 'genero', 'finanzas'] // Todos los secretarios pueden manejar sus propios documentos
  };

  // 5. Evaluate
  for (const app of activeAppointments) {
    const [position] = await db.select().from(positionTypeTable)
      .where(eq(positionTypeTable.id, app.positionTypeId));
      
    if (!position) continue;

    const clearance = position.baseClearance || 1;
    if (clearance < requiredClearance) continue;

    const funcArea = position.functionalArea;

    // Check Global/Override Policies
    for (const policy of policies) {
      if ((policy.resourceType === 'all' || policy.resourceType === resourceType) && 
          (policy.action === 'all' || policy.action === action || policy.action === 'manage')) {
        if (policy.condition === 'global') return true;
        
        // Retained for specific explicit same_org overrides
        if (policy.condition === 'same_org' && app.organizationId === resourceOrgId) return true;
      }
    }

    // Check Functional Permissions (Conducción Colectiva)
    if (action === 'manage' || action === 'create' || action === 'update' || action === 'delete') {
       const allowedFuncs = allowedFunctionsForResource[resourceType] || [];
       if (allowedFuncs.includes(funcArea)) {
         // Funcional Area Matches. Does it match the Org?
         // In "Conducción Colectiva", you can manage resources OF YOUR ORG.
         // We do not allow 'parent_org' downward management automatically anymore!
         if (!resourceOrgId || app.organizationId === resourceOrgId) {
           return true;
         }
       }
    }

    // Check Read Permissions within the same org (Conducción Colectiva)
    if (action === 'read' && resourceOrgId === app.organizationId) {
      // Todos los secretarios de una misma org pueden ver las actas/recursos de su propia org
      return true;
    }
  }

  return false;
}

// ----------------------------------------------------------------------
// HELPER FUNCTIONS
// ----------------------------------------------------------------------

function getClearanceLevel(classification: string): number {
  switch (classification) {
    case 'publico': return 1;
    case 'interno': return 2;
    case 'reservado': return 3;
    case 'confidencial': return 4;
    default: return 1;
  }
}

/**
 * Verifica de forma recursiva (hacia arriba) si `potentialParentId` es padre de `childOrgId`
 */
async function isParentOrganization(potentialParentId: string, childOrgId?: string): Promise<boolean> {
  if (!childOrgId) return false;
  if (potentialParentId === childOrgId) return true;

  const [childOrg] = await db.select().from(organizationTable).where(eq(organizationTable.id, childOrgId));
  if (!childOrg || !childOrg.parentId) return false;

  // Evitar bucles en un árbol corrupto
  let currentParentId: string | null = childOrg.parentId;
  let depth = 0;
  
  while (currentParentId && depth < 10) {
    if (currentParentId === potentialParentId) return true;
    const [parentOrg] = await db.select().from(organizationTable).where(eq(organizationTable.id, currentParentId));
    if (!parentOrg || !parentOrg.parentId) break;
    
    // Check if the current organization is 'autonomo' (Tribunales). If so, vertical inheritance breaks!
    if (parentOrg.type === 'autonomo') return false;

    currentParentId = parentOrg.parentId;
    depth++;
  }

  return false;
}
