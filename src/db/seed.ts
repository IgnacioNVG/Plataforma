import { db } from './index';
import { 
  userTable, 
  organizationTable, 
  positionTypeTable, 
  appointmentTable, 
  policyTable 
} from './schema';
import { eq } from 'drizzle-orm';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { hashBlindIndex } from '../lib/crypto';

async function seed() {
  console.log('🌱 Iniciando inyección de Estructura Institucional (Seed)...');

  // 1. Crear Órganos Base
  const orgNacionalId = crypto.randomUUID();
  const orgRMId = crypto.randomUUID();

  await db.insert(organizationTable).values([
    {
      id: orgNacionalId,
      name: 'Dirección Nacional',
      type: 'nacional',
      description: 'Órgano ejecutivo máximo del partido',
      territoryScope: 'Nacional'
    },
    {
      id: orgRMId,
      name: 'Dirección Regional Metropolitana',
      type: 'regional',
      parentId: orgNacionalId,
      description: 'Dirección de la RM',
      territoryScope: 'RM'
    }
  ]);
  console.log('✅ Órganos creados');

  // 2. Crear Cargos Nominales
  const posAdminId = crypto.randomUUID();
  const posPresidenteId = crypto.randomUUID();

  await db.insert(positionTypeTable).values([
    {
      id: posAdminId,
      title: 'Administrador Técnico',
      baseClearance: 4 // Confidencial, para poder ver errores en el sistema
    },
    {
      id: posPresidenteId,
      title: 'Presidente',
      baseClearance: 4 
    }
  ]);
  console.log('✅ Cargos Nominales creados');

  // 3. Rescatar al usuario
  const email = 'navasgranizo.ignacio@gmail.com';
  let user = await db.select().from(userTable).where(eq(userTable.email, email)).get();
  
  if (!user) {
    const userId = crypto.randomUUID();
    const hashedPassword = await bcrypt.hash('Topstone2gvx', 10);
    const hashedRut = hashBlindIndex('11111111-1'); // Determinista
    await db.insert(userTable).values({
      id: userId,
      email: email,
      name: 'Ignacio',
      lastName: 'Navas',
      passwordHash: hashedPassword, 
      rutHash: hashedRut,
      isActive: true
    });
    user = await db.select().from(userTable).where(eq(userTable.email, email)).get();
  }
  
  if (user) {
    // 4. Crear Motor de Vigencia (Nombramiento Provisorio)
    const nextYear = new Date();
    nextYear.setFullYear(nextYear.getFullYear() + 2);

    await db.insert(appointmentTable).values({
      id: crypto.randomUUID(),
      userId: user.id,
      positionTypeId: posAdminId, // Admin Técnico, NO político
      organizationId: orgNacionalId,
      startDate: new Date(),
      endDate: nextYear,
      status: 'activo',
      resolutionRef: 'Soporte Técnico'
    });
    console.log(`✅ Nombramiento técnico provisorio inyectado para ${user.email}`);
  }

  // 5. Crear Políticas Base
  await db.insert(policyTable).values([
    {
      id: crypto.randomUUID(),
      resourceType: 'all',
      action: 'manage',
      condition: 'global',
      organizationId: orgNacionalId
    }
  ]);
  console.log('✅ Políticas estructurales base inyectadas');

  console.log('🌳 Seed institucional completado con éxito.');
}

seed().catch(console.error);
