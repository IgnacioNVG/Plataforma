import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

// ---------------------------------------------------------
// MODELO ORGANIZACIONAL
// ---------------------------------------------------------

export const organizationTable = sqliteTable('organization', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  type: text('type').notNull(), // 'nacional', 'regional', 'comunal', 'nucleo', 'comision', 'autonomo'
  parentId: text('parent_id'), // Self-referential tree handled in code
  territoryScope: text('territory_scope'), // ej: "RM", "Santiago"
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date())
});

export const positionTypeTable = sqliteTable('position_type', {
  id: text('id').primaryKey(),
  title: text('title').notNull(), // Ej: "Presidente", "Secretario General", "Militante"
  baseClearance: integer('base_clearance').default(1).notNull(), // 1=Público, 2=Interno, 3=Reservado, 4=Confidencial
});

// ---------------------------------------------------------
// MODELO DE USUARIOS Y VIGENCIA (NOMBRAMIENTOS)
// ---------------------------------------------------------

export const userTable = sqliteTable('user', {
  id: text('id').primaryKey(),
  rutHash: text('rut_hash').notNull(),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  lastName: text('last_name').notNull(),
  biography: text('biography'),
  phone: text('phone'),
  avatarUrl: text('avatar_url'),
  passwordHash: text('password_hash').notNull(),
  isActive: integer('is_active', { mode: 'boolean' }).default(true).notNull(),
  // ELIMINADOS: role, clearanceLevel (Ahora dependen del motor de vigencia)
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date())
});

export const sessionTable = sqliteTable('session', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => userTable.id),
  expiresAt: integer('expires_at').notNull()
});

// ---------------------------------------------------------
// PADRÓN ELECTORAL / MILITANTES (SIMULADO)
// ---------------------------------------------------------

export const padronProvisorioTable = sqliteTable('padron_provisorio', {
  id: text('id').primaryKey(),
  rut: text('rut').notNull().unique(),
  name: text('name').notNull(),
  lastName: text('last_name').notNull(),
  region: text('region'),
  comuna: text('comuna'),
  status: text('status').default('Activo'),
  role: text('role').default('Militante Base'),
  joinDate: text('join_date'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date())
});

export const mockPadronTable = sqliteTable('mock_padron', {
  id: text('id').primaryKey(),
  rutHash: text('rut_hash').notNull().unique(),
  name: text('name'),
  lastName: text('last_name'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date())
});

// Motor de Vigencia Institucional
export const appointmentTable = sqliteTable('appointment', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => userTable.id),
  positionTypeId: text('position_type_id').notNull().references(() => positionTypeTable.id),
  organizationId: text('organization_id').notNull().references(() => organizationTable.id),
  startDate: integer('start_date', { mode: 'timestamp' }).notNull(),
  endDate: integer('end_date', { mode: 'timestamp' }), // Si es null o > hoy, es vigente. Si < hoy, es histórico.
  status: text('status').default('activo').notNull(), // 'activo', 'suspendido'
  resolutionRef: text('resolution_ref'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date())
});

// ---------------------------------------------------------
// MOTOR DE POLÍTICAS (PBAC)
// ---------------------------------------------------------

export const policyTable = sqliteTable('policy', {
  id: text('id').primaryKey(),
  resourceType: text('resource_type').notNull(), // 'document', 'news', 'event', 'forum', 'organization'
  action: text('action').notNull(), // 'create', 'read', 'update', 'delete', 'manage'
  condition: text('condition').notNull(), // Reglas como: 'same_org', 'parent_org', 'clearance_match', 'global'
  organizationId: text('organization_id').references(() => organizationTable.id), // Si la regla aplica a un órgano específico
});

// ---------------------------------------------------------
// RECURSOS (Clasificados)
// ---------------------------------------------------------
// classification: 'publico' | 'interno' | 'reservado' | 'confidencial'

export const newsTable = sqliteTable('news', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(),
  content: text('content').notNull(),
  imageUrl: text('image_url'),
  authorId: text('author_id').notNull().references(() => userTable.id),
  organizationId: text('organization_id').references(() => organizationTable.id),
  classification: text('classification').default('publico').notNull(),
  publishedAt: integer('published_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date())
});

export const documentTable = sqliteTable('document', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  fileUrl: text('file_url').notNull(),
  category: text('category').notNull(), // Ej: "Acta", "Resolución"
  authorId: text('author_id').notNull().references(() => userTable.id),
  organizationId: text('organization_id').notNull().references(() => organizationTable.id),
  classification: text('classification').default('interno').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date())
});

export const eventTable = sqliteTable('event', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  location: text('location'),
  startDate: integer('start_date', { mode: 'timestamp' }).notNull(),
  organizationId: text('organization_id').references(() => organizationTable.id),
  classification: text('classification').default('publico').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date())
});

export const forumCategoryTable = sqliteTable('forum_category', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  organizationId: text('organization_id').references(() => organizationTable.id),
  classification: text('classification').default('interno').notNull()
});

export const forumTopicTable = sqliteTable('forum_topic', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  categoryId: text('category_id').notNull().references(() => forumCategoryTable.id),
  authorId: text('author_id').notNull().references(() => userTable.id),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date())
});

export const forumReplyTable = sqliteTable('forum_reply', {
  id: text('id').primaryKey(),
  topicId: text('topic_id').notNull().references(() => forumTopicTable.id),
  content: text('content').notNull(),
  authorId: text('author_id').notNull().references(() => userTable.id),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date())
});

// Auditoría de Accesos (Obligatorio para Reservado/Confidencial)
export const auditLogTable = sqliteTable('audit_log', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => userTable.id),
  resourceType: text('resource_type').notNull(),
  resourceId: text('resource_id').notNull(),
  action: text('action').notNull(), // Ej: 'visualizacion_visor_seguro'
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  timestamp: integer('timestamp', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date())
});
