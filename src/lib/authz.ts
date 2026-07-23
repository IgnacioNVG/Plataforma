import { db } from '../db';
import { 
  appointmentTable, 
  organizationTable, 
  policyTable, 
  positionTypeTable 
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
  resourceOrgId?: string
): Promise<boolean> {
  
  // 1. Recursos que no son públicos requieren estar autenticado. (Pero ahora exigimos auth para TODO)
  if (!userId) return false;

  // 2. Recursos Públicos son de lectura libre (solo para militantes autenticados)
  if (action === 'read' && resourceClassification === 'publico') {
    return true;
  }

  // 3. Obtener Nombramientos Vigentes del Usuario
  const now = new Date();
  const rawAppointments = await db.select().from(appointmentTable)
    .where(eq(appointmentTable.userId, userId));
  
  const activeAppointments = rawAppointments.filter(app => {
    return app.status === 'activo' && (!app.endDate || new Date(app.endDate) > now);
  });

  if (activeAppointments.length === 0) {
    // Es un militante base sin cargos. Solo puede leer interno.
    if (action === 'read' && resourceClassification === 'interno') return true;
    return false;
  }

  // 4. Cargar Políticas de la DB (Idealmente esto se cachea en Redis/Memoria)
  const policies = await db.select().from(policyTable);

  // 5. Evaluar Políticas contra los Nombramientos Activos
  for (const app of activeAppointments) {
    
    // Obtener detalles del cargo
    const [position] = await db.select().from(positionTypeTable)
      .where(eq(positionTypeTable.id, app.positionTypeId));
      
    const clearance = position?.baseClearance || 1; // 1: Pub, 2: Int, 3: Res, 4: Conf

    // Validar nivel de clasificación
    const requiredClearance = getClearanceLevel(resourceClassification);
    if (clearance < requiredClearance) continue; // Cargo no tiene suficiente nivel

    // Evaluar reglas
    for (const policy of policies) {
      // Coincide Acción y Recurso?
      if ((policy.resourceType === 'all' || policy.resourceType === resourceType) && 
          (policy.action === 'all' || policy.action === action || policy.action === 'manage')) {
        
        // Evaluar Condición (PBAC)
        if (policy.condition === 'global') {
          // El cargo otorga poder global (Ej: Presidente Nacional)
          return true;
        }

        if (policy.condition === 'same_org') {
          if (app.organizationId === resourceOrgId) return true;
        }

        if (policy.condition === 'parent_org') {
          // El cargo está en un órgano padre del recurso?
          const isParent = await isParentOrganization(app.organizationId, resourceOrgId);
          if (isParent) return true;
        }
      }
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
