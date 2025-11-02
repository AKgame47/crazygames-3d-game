import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, playerProgress, InsertPlayerProgress, gameSessions, InsertGameSession, leaderboard } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getUserById(id: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getOrCreatePlayerProgress(userId: number) {
  const db = await getDb();
  if (!db) return null;

  const existing = await db.select().from(playerProgress).where(eq(playerProgress.userId, userId)).limit(1);
  
  if (existing.length > 0) {
    return existing[0];
  }

  // Create new progress record
  const newProgress: InsertPlayerProgress = {
    userId,
    unlockedModes: JSON.stringify(['noob']),
    unlockedAbilities: JSON.stringify(['basicAttack']),
    unlockedWeapons: JSON.stringify(['sword']),
    unlockedCostumes: JSON.stringify(['default']),
    achievements: JSON.stringify([]),
  };

  await db.insert(playerProgress).values(newProgress);
  const result = await db.select().from(playerProgress).where(eq(playerProgress.userId, userId)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function saveGameSession(session: InsertGameSession) {
  const db = await getDb();
  if (!db) return null;

  await db.insert(gameSessions).values(session);
  
  // Update player progress
  const progress = await getOrCreatePlayerProgress(session.userId);
  if (progress) {
    const updates: any = {
      totalXP: progress.totalXP + session.xpEarned,
      totalCoins: progress.totalCoins + session.coinsEarned,
      totalKills: progress.totalKills + session.enemiesDefeated,
      totalPlayTime: progress.totalPlayTime + session.timeAlive,
    };

    // Update mode-specific high scores
    const modeKey = `${session.mode}HighScore` as const;
    if (progress[modeKey] < session.wavesSurvived) {
      updates[modeKey] = session.wavesSurvived;
    }

    await db.update(playerProgress).set(updates).where(eq(playerProgress.userId, session.userId));
  }

  return true;
}

export async function getLeaderboard(mode: 'noob' | 'pro' | 'god' | 'psycho' | 'ultimate', limit: number = 10) {
  const db = await getDb();
  if (!db) return [];

  const result = await db
    .select()
    .from(leaderboard)
    .where(eq(leaderboard.mode, mode))
    .orderBy((t) => t.rank)
    .limit(limit);

  return result;
}

export async function updateLeaderboard(userId: number, mode: 'noob' | 'pro' | 'god' | 'psycho' | 'ultimate', score: number) {
  const db = await getDb();
  if (!db) return null;

  const user = await getUserById(userId);
  if (!user) return null;

  const existing = await db
    .select()
    .from(leaderboard)
    .where(eq(leaderboard.userId, userId))
    .limit(1);

  if (existing.length > 0) {
    await db.update(leaderboard).set({
      highScore: score,
    }).where(eq(leaderboard.userId, userId));
  } else {
    await db.insert(leaderboard).values({
      userId,
      userName: user.name || 'Anonymous',
      mode,
      highScore: score,
      totalKills: 0,
      rank: 1,
    });
  }

  return true;
}

export async function getPlayerStats(userId: number) {
  const db = await getDb();
  if (!db) return null;

  const progress = await db.select().from(playerProgress).where(eq(playerProgress.userId, userId)).limit(1);
  return progress.length > 0 ? progress[0] : null;
}
