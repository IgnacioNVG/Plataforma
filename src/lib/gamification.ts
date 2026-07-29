import { db } from '../db';
import { userTable, badgeTable, userBadgeTable, notificationTable, enrollmentTable, moduleProgressTable, forumTopicTable, forumReplyTable } from '../db/schema';
import { eq, and } from 'drizzle-orm';

export async function evaluateBadges(userId: string) {
  // Fetch user data
  const user = await db.select().from(userTable).where(eq(userTable.id, userId)).get();
  if (!user) return;

  // Fetch all badges
  const badges = await db.select().from(badgeTable);
  
  // Fetch already unlocked badges for this user
  const unlockedBadges = await db.select().from(userBadgeTable).where(eq(userBadgeTable.userId, userId));
  const unlockedBadgeIds = new Set(unlockedBadges.map(ub => ub.badgeId));

  // Determine current metrics
  
  // 1. Streaks
  const streakDays = user.currentStreak || 0;
  
  // 2. Courses Completed
  const enrollments = await db.select().from(enrollmentTable).where(and(eq(enrollmentTable.userId, userId), eq(enrollmentTable.status, 'completado')));
  const coursesCompleted = enrollments.length;

  // 3. Modules Completed
  let modulesCompleted = 0;
  const userEnrollments = await db.select().from(enrollmentTable).where(eq(enrollmentTable.userId, userId));
  for (const e of userEnrollments) {
    const mods = await db.select().from(moduleProgressTable).where(eq(moduleProgressTable.enrollmentId, e.id));
    modulesCompleted += mods.length;
  }

  // 4. Forum Posts (Topics + Replies)
  const topics = await db.select().from(forumTopicTable).where(eq(forumTopicTable.authorId, userId));
  const replies = await db.select().from(forumReplyTable).where(eq(forumReplyTable.authorId, userId));
  const forumPosts = topics.length + replies.length;

  // Evaluate each badge
  for (const badge of badges) {
    if (unlockedBadgeIds.has(badge.id)) continue; // Already unlocked

    let achieved = false;
    
    switch (badge.conditionType) {
      case 'streak_days':
        if (streakDays >= badge.targetValue) achieved = true;
        break;
      case 'courses_completed':
        if (coursesCompleted >= badge.targetValue) achieved = true;
        break;
      case 'modules_completed':
        if (modulesCompleted >= badge.targetValue) achieved = true;
        break;
      case 'forum_posts':
        if (forumPosts >= badge.targetValue) achieved = true;
        break;
    }

    if (achieved) {
      // Award badge
      await db.insert(userBadgeTable).values({
        id: crypto.randomUUID(),
        userId: userId,
        badgeId: badge.id
      });

      // Send Notification
      await db.insert(notificationTable).values({
        id: crypto.randomUUID(),
        userId: userId,
        title: '¡Nueva Insignia Desbloqueada!',
        content: `Has conseguido la insignia: ${badge.iconSvg || ''} ${badge.name}. ${badge.description}`,
        priority: 'media',
        label: 'Logro',
        link: '/perfil'
      });
    }
  }
}
