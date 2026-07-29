import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

// ---------------------------------------------------------
// MODELO ORGANIZACIONAL
// ---------------------------------------------------------

export const organizationTable = sqliteTable('organization', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  type: text('type').notNull(), // 'nacional', 'comite_central', 'comision_politica', 'dns', 'dnsup', 'regional', 'comunal', 'brigada', 'nucleo'
  parentId: text('parent_id'), // Self-referential tree handled in code
  territoryScope: text('territory_scope'), // ej: "RM", "Santiago"
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date())
});

export const positionTypeTable = sqliteTable('position_type', {
  id: text('id').primaryKey(),
  title: text('title').notNull(), // Ej: "Presidente", "Secretario General", "Militante"
  baseClearance: integer('base_clearance').default(1).notNull(), // 1=Público, 2=Interno, 3=Reservado, 4=Confidencial
  functionalArea: text('functional_area').default('general').notNull() // 'presidencia', 'politico', 'organico', 'genero', 'finanzas', 'representativo', 'general', 'militante'
});

// ---------------------------------------------------------
// MODELO DE USUARIOS Y VIGENCIA (NOMBRAMIENTOS)
// ---------------------------------------------------------

export const userTable = sqliteTable('user', {
  id: text('id').primaryKey(),
  rutHash: text('rut_hash').notNull(),
  email: text('email').unique(),
  name: text('name').notNull(),
  lastName: text('last_name').notNull(),
  biography: text('biography'),
  phone: text('phone'),
  avatarUrl: text('avatar_url'),
  passwordHash: text('password_hash').notNull(),
  isActive: integer('is_active', { mode: 'boolean' }).default(true).notNull(),
  lastLoginAt: integer('last_login_at', { mode: 'timestamp' }),
  currentStreak: integer('current_streak').default(0).notNull(),
  longestStreak: integer('longest_streak').default(0).notNull(),
  pronouns: text('pronouns'), // Ej: él/lo, ella/la, elle/le
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
  birthDate: text('birth_date'),
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
// GESTIÓN FLEXIBLE (REQUESTS)
// ---------------------------------------------------------

export const accessRequestTable = sqliteTable('access_request', {
  id: text('id').primaryKey(),
  documentId: text('document_id').notNull().references(() => documentTable.id),
  requesterUserId: text('requester_user_id').notNull().references(() => userTable.id),
  status: text('status').default('pending').notNull(), // 'pending', 'approved', 'rejected'
  requestedAt: integer('requested_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
  resolvedAt: integer('resolved_at', { mode: 'timestamp' }),
  resolvedByUserId: text('resolved_by_user_id').references(() => userTable.id)
});

export const roleRequestTable = sqliteTable('role_request', {
  id: text('id').primaryKey(),
  organizationId: text('organization_id').notNull().references(() => organizationTable.id),
  proposedTitle: text('proposed_title').notNull(),
  proposedFunctionalArea: text('proposed_functional_area').notNull(),
  requesterUserId: text('requester_user_id').notNull().references(() => userTable.id),
  status: text('status').default('pending').notNull(), // 'pending', 'approved', 'rejected'
  requestedAt: integer('requested_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
  resolvedAt: integer('resolved_at', { mode: 'timestamp' }),
  resolvedByUserId: text('resolved_by_user_id').references(() => userTable.id)
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
  fileUrl: text('file_url').notNull(), // Si es puro video, guardamos una cadena vacía o placeholder
  youtubeUrl: text('youtube_url'),
  category: text('category').notNull(), // Ej: "Acta", "Resolución", "Audiovisual"
  authorId: text('author_id').notNull().references(() => userTable.id),
  organizationId: text('organization_id').notNull().references(() => organizationTable.id),
  classification: text('classification').default('interno').notNull(),
  clearanceLevel: integer('clearance_level').default(1).notNull(), // 1=Público, 2=Interno, 3=Reservado, 4=Confidencial
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date())
});

export const eventTable = sqliteTable('event', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  location: text('location'),
  youtubeUrl: text('youtube_url'),
  documentId: text('document_id').references(() => documentTable.id),
  startDate: integer('start_date', { mode: 'timestamp' }).notNull(),
  organizationId: text('organization_id').references(() => organizationTable.id),
  classification: text('classification').default('publico').notNull(),
  status: text('status').default('propuesto').notNull(), // 'propuesto', 'aprobado', 'rechazado'
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

// ---------------------------------------------------------
// ESCUELA DE FORMACIÓN
// ---------------------------------------------------------

export const schoolTable = sqliteTable('school', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  targetAudience: text('target_audience'),
  status: text('status', { enum: ['borrador', 'publicado'] }).notNull().default('publicado'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date())
});

export const courseTable = sqliteTable('course', {
  id: text('id').primaryKey(),
  schoolId: text('school_id').notNull().references(() => schoolTable.id),
  title: text('title').notNull(),
  description: text('description').notNull(),
  imageUrl: text('image_url'),
  isMandatory: integer('is_mandatory', { mode: 'boolean' }).notNull().default(false),
  status: text('status', { enum: ['borrador', 'publicado'] }).notNull().default('borrador'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date())
});

export const moduleTable = sqliteTable('module', {
  id: text('id').primaryKey(),
  courseId: text('course_id').notNull().references(() => courseTable.id),
  title: text('title').notNull(),
  content: text('content').notNull(),
  order: integer('order').notNull(), // Para ordenar secuencialmente
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date())
});

export const enrollmentTable = sqliteTable('enrollment', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => userTable.id),
  courseId: text('course_id').notNull().references(() => courseTable.id),
  status: text('status').default('en_progreso').notNull(), // 'en_progreso', 'completado'
  progressPercentage: integer('progress_percentage').default(0).notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date())
});

export const moduleProgressTable = sqliteTable('module_progress', {
  id: text('id').primaryKey(),
  enrollmentId: text('enrollment_id').notNull().references(() => enrollmentTable.id),
  moduleId: text('module_id').notNull().references(() => moduleTable.id),
  completedAt: integer('completed_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date())
});

// ---------------------------------------------------------
// NOTIFICACIONES Y ALERTAS
// ---------------------------------------------------------

export const notificationTable = sqliteTable('notification', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => userTable.id),
  title: text('title').notNull(),
  content: text('content').notNull(),
  priority: text('priority', { enum: ['alta', 'media', 'baja'] }).default('media').notNull(),
  label: text('label').notNull(), // Ej: 'Curso', 'Foro', 'Resolución', 'Sistema'
  scheduledFor: integer('scheduled_for', { mode: 'timestamp' }), // Null = Inmediata
  isRead: integer('is_read', { mode: 'boolean' }).default(false).notNull(),
  isArchived: integer('is_archived', { mode: 'boolean' }).default(false).notNull(),
  link: text('link'), // URL a redirigir
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date())
});

// ---------------------------------------------------------
// GAMIFICACIÓN E INSIGNIAS
// ---------------------------------------------------------

export const badgeTable = sqliteTable('badge', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  iconSvg: text('icon_svg'), // Optional SVG string
  conditionType: text('condition_type').notNull(), // e.g., 'streak', 'course_completed', 'forum_post'
  targetValue: integer('target_value').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date())
});

export const userBadgeTable = sqliteTable('user_badge', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => userTable.id),
  badgeId: text('badge_id').notNull().references(() => badgeTable.id),
  unlockedAt: integer('unlocked_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date())
});

// ---------------------------------------------------------
// BITÁCORA DE ACTIVIDAD (TIMELINE PÚBLICO/PRIVADO)
// ---------------------------------------------------------

export const userActivityTable = sqliteTable('user_activity', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => userTable.id),
  actionType: text('action_type').notNull(), // 'document_uploaded', 'course_completed', 'forum_posted'
  title: text('title').notNull(),
  link: text('link'),
  organizationId: text('organization_id').references(() => organizationTable.id), // Para filtros de permiso
  classification: text('classification').default('publico').notNull(), // 'publico', 'interno', 'reservado', 'confidencial'
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date())
});
