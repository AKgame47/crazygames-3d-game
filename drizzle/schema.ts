import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Player game progress and statistics
 */
export const playerProgress = mysqlTable("playerProgress", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  totalXP: int("totalXP").default(0).notNull(),
  totalCoins: int("totalCoins").default(0).notNull(),
  totalKills: int("totalKills").default(0).notNull(),
  totalPlayTime: int("totalPlayTime").default(0).notNull(),
  
  // Mode-specific high scores
  noobHighScore: int("noobHighScore").default(0).notNull(),
  proHighScore: int("proHighScore").default(0).notNull(),
  godHighScore: int("godHighScore").default(0).notNull(),
  psychoHighScore: int("psychoHighScore").default(0).notNull(),
  ultimateHighScore: int("ultimateHighScore").default(0).notNull(),
  
  // Unlocked content (JSON)
  unlockedModes: text("unlockedModes").notNull(),
  unlockedAbilities: text("unlockedAbilities").notNull(),
  unlockedWeapons: text("unlockedWeapons").notNull(),
  unlockedCostumes: text("unlockedCostumes").notNull(),
  
  // Achievements (JSON)
  achievements: text("achievements").notNull(),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type PlayerProgress = typeof playerProgress.$inferSelect;
export type InsertPlayerProgress = typeof playerProgress.$inferInsert;

/**
 * Game session records for leaderboards
 */
export const gameSessions = mysqlTable("gameSessions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  mode: mysqlEnum("mode", ["noob", "pro", "god", "psycho", "ultimate"]).notNull(),
  wavesSurvived: int("wavesSurvived").notNull(),
  enemiesDefeated: int("enemiesDefeated").notNull(),
  timeAlive: int("timeAlive").notNull(),
  xpEarned: int("xpEarned").notNull(),
  coinsEarned: int("coinsEarned").notNull(),
  skillsUsed: text("skillsUsed").notNull(),
  damageDealt: int("damageDealt").notNull(),
  damageTaken: int("damageTaken").notNull(),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type GameSession = typeof gameSessions.$inferSelect;
export type InsertGameSession = typeof gameSessions.$inferInsert;

/**
 * Leaderboard entries
 */
export const leaderboard = mysqlTable("leaderboard", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  userName: varchar("userName", { length: 255 }).notNull(),
  mode: mysqlEnum("mode", ["noob", "pro", "god", "psycho", "ultimate"]).notNull(),
  highScore: int("highScore").notNull(),
  totalKills: int("totalKills").notNull(),
  rank: int("rank").notNull(),
  
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Leaderboard = typeof leaderboard.$inferSelect;
export type InsertLeaderboard = typeof leaderboard.$inferInsert;

/**
 * Player achievements
 */
export const achievements = mysqlTable("achievements", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  achievementId: varchar("achievementId", { length: 64 }).notNull(),
  achievementName: varchar("achievementName", { length: 255 }).notNull(),
  description: text("description"),
  unlockedAt: timestamp("unlockedAt").defaultNow().notNull(),
});

export type Achievement = typeof achievements.$inferSelect;
export type InsertAchievement = typeof achievements.$inferInsert;
