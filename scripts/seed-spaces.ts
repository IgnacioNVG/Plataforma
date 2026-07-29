import { db } from '../src/db';
import { organizationTable, appointmentTable, userTable, positionTypeTable } from '../src/db/schema';
import { eq, like } from 'drizzle-orm';
import crypto from 'node:crypto';

async function main() {
  console.log('🌱 Seeding orgs...');

  // 1. Encontrar al usuario Ignacio
  const user = await db.select().from(userTable).where(like(userTable.email, '%ignacio%')).get();
  if (!user) {
    console.error('No se encontró al usuario Ignacio');
    return;
  }

  // 2. Insertar Organizaciones
  const comunalId = crypto.randomUUID();
  const busId = crypto.randomUUID();
  const jgmId = crypto.randomUUID();

  await db.insert(organizationTable).values([
    {
      id: comunalId,
      name: 'Comunal Macul',
      type: 'comunal',
      territoryScope: 'Macul'
    },
    {
      id: busId,
      name: 'Brigada Universitaria Socialista (BUS)',
      type: 'brigada',
      territoryScope: 'Universidad de Chile'
    },
    {
      id: jgmId,
      name: 'Núcleo Jaime Robotham',
      type: 'nucleo',
      parentId: busId,
      territoryScope: 'Campus JGM'
    }
  ]);
  
  console.log('Organizaciones insertadas');

  // 3. Conseguir un cargo base y uno directivo
  const basePosition = await db.select().from(positionTypeTable).where(eq(positionTypeTable.title, 'Militante Base')).get();
  const secPolitico = await db.select().from(positionTypeTable).where(eq(positionTypeTable.title, 'Secretario Político')).get();
  
  // 4. Asignar al usuario
  await db.insert(appointmentTable).values([
    {
      id: crypto.randomUUID(),
      userId: user.id,
      positionTypeId: basePosition?.id || 'militante-base',
      organizationId: comunalId,
      startDate: new Date()
    },
    {
      id: crypto.randomUUID(),
      userId: user.id,
      positionTypeId: basePosition?.id || 'militante-base',
      organizationId: busId,
      startDate: new Date()
    },
    {
      id: crypto.randomUUID(),
      userId: user.id,
      positionTypeId: secPolitico?.id || 'secretario-politico', // Le damos un cargo de mesa para que pueda probar la interfaz de aprobaciones
      organizationId: jgmId,
      startDate: new Date()
    }
  ]);
  
  console.log('Usuario afiliado a los espacios exitosamente');
}

main().catch(console.error);
