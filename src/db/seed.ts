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
  const orgComisionPolId = crypto.randomUUID();
  const orgComiteCentralId = crypto.randomUUID();
  const orgDnsId = crypto.randomUUID();
  const orgDnsupId = crypto.randomUUID();
  const orgRMId = crypto.randomUUID();
  const orgComunalStgoId = crypto.randomUUID();
  const orgBusUchileId = crypto.randomUUID();
  const orgNucleoJGMId = crypto.randomUUID();

  await db.insert(organizationTable).values([
    {
      id: orgNacionalId,
      name: 'Dirección Nacional',
      type: 'nacional',
      description: 'Órgano ejecutivo máximo de la juventud',
      territoryScope: 'Nacional'
    },
    {
      id: orgComisionPolId,
      name: 'Comisión Política',
      type: 'comision_politica',
      parentId: orgNacionalId,
      description: 'Órgano deliberativo político',
    },
    {
      id: orgComiteCentralId,
      name: 'Comité Central',
      type: 'comite_central',
      parentId: orgNacionalId,
      description: 'Máximo órgano deliberativo entre congresos',
    },
    {
      id: orgDnsId,
      name: 'Dirección Nacional Secundaria',
      type: 'dns',
      parentId: orgNacionalId,
    },
    {
      id: orgDnsupId,
      name: 'Dirección Nacional de Ed. Superior',
      type: 'dnsup',
      parentId: orgNacionalId,
    },
    {
      id: orgRMId,
      name: 'Dirección Regional Metropolitana',
      type: 'regional',
      parentId: orgNacionalId,
      territoryScope: 'RM'
    },
    {
      id: orgComunalStgoId,
      name: 'Dirección Comunal Santiago',
      type: 'comunal',
      parentId: orgRMId,
      territoryScope: 'Santiago'
    },
    {
      id: orgBusUchileId,
      name: 'BUS Universidad de Chile',
      type: 'brigada',
      parentId: orgRMId,
      territoryScope: 'U. de Chile'
    },
    {
      id: orgNucleoJGMId,
      name: 'Núcleo JGM',
      type: 'nucleo',
      parentId: orgBusUchileId,
      territoryScope: 'Campus JGM'
    }
  ]);
  console.log('✅ Estructura Orgánica creada');

  // 2. Crear Cargos Funcionales Base
  const roles = {
    admin: crypto.randomUUID(),
    presidente: crypto.randomUUID(),
    secGeneral: crypto.randomUUID(),
    secPolitico: crypto.randomUUID(),
    secOrganico: crypto.randomUUID(),
    secGenero: crypto.randomUUID(),
    integranteCC: crypto.randomUUID(),
    militante: crypto.randomUUID(),
  };

  await db.insert(positionTypeTable).values([
    { id: roles.admin, title: 'Administrador Técnico', functionalArea: 'general', baseClearance: 4 },
    { id: roles.presidente, title: 'Presidente', functionalArea: 'presidencia', baseClearance: 4 },
    { id: roles.secGeneral, title: 'Secretario General', functionalArea: 'general', baseClearance: 4 },
    { id: roles.secPolitico, title: 'Secretario Político', functionalArea: 'politico', baseClearance: 3 },
    { id: roles.secOrganico, title: 'Secretario Orgánico', functionalArea: 'organico', baseClearance: 3 },
    { id: roles.secGenero, title: 'Secretaria de Género', functionalArea: 'genero', baseClearance: 3 },
    { id: roles.integranteCC, title: 'Integrante Comité Central', functionalArea: 'representativo', baseClearance: 3 },
    { id: roles.militante, title: 'Militante Base', functionalArea: 'militante', baseClearance: 1 },
  ]);
  console.log('✅ Cargos Funcionales creados');

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
      positionTypeId: roles.admin, // Admin Técnico con poder total
      organizationId: orgNacionalId,
      startDate: new Date(),
      endDate: nextYear,
      status: 'activo',
      resolutionRef: 'Soporte Técnico'
    });
    console.log(`✅ Nombramiento técnico provisorio inyectado para ${user.email}`);
  }

  // 5. Crear Políticas Base (Simples, la lógica pesada va en authorize)
  await db.insert(policyTable).values([
    {
      id: crypto.randomUUID(),
      resourceType: 'all',
      action: 'manage',
      condition: 'global', // Admin global fallback
      organizationId: orgNacionalId
    }
  ]);
  console.log('✅ Políticas estructurales base inyectadas');

  console.log('🌳 Seed institucional completado con éxito.');
}

seed().catch(console.error);
