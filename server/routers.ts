import { z } from "zod";
import { eq } from "drizzle-orm";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { getOrCreatePlayerProgress, saveGameSession, getLeaderboard, updateLeaderboard, getPlayerStats, getDb } from "./db";
import { playerProgress } from "../drizzle/schema";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  game: router({
    // Get player progress
    getProgress: protectedProcedure.query(async ({ ctx }) => {
      const progress = await getOrCreatePlayerProgress(ctx.user.id);
      if (!progress) {
        return null;
      }

      return {
        ...progress,
        unlockedModes: JSON.parse(progress.unlockedModes || '["noob"]'),
        unlockedAbilities: JSON.parse(progress.unlockedAbilities || '["basicAttack"]'),
        unlockedWeapons: JSON.parse(progress.unlockedWeapons || '["sword"]'),
        unlockedCostumes: JSON.parse(progress.unlockedCostumes || '["default"]'),
        achievements: JSON.parse(progress.achievements || '[]'),
      };
    }),

    // Save game session
    saveSession: protectedProcedure
      .input(
        z.object({
          mode: z.enum(['noob', 'pro', 'god', 'psycho', 'ultimate']),
          wavesSurvived: z.number(),
          enemiesDefeated: z.number(),
          timeAlive: z.number(),
          xpEarned: z.number(),
          coinsEarned: z.number(),
          skillsUsed: z.array(z.string()),
          damageDealt: z.number(),
          damageTaken: z.number(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const result = await saveGameSession({
          userId: ctx.user.id,
          mode: input.mode,
          wavesSurvived: input.wavesSurvived,
          enemiesDefeated: input.enemiesDefeated,
          timeAlive: input.timeAlive,
          xpEarned: input.xpEarned,
          coinsEarned: input.coinsEarned,
          skillsUsed: JSON.stringify(input.skillsUsed),
          damageDealt: input.damageDealt,
          damageTaken: input.damageTaken,
        });

        // Update leaderboard
        if (result) {
          await updateLeaderboard(ctx.user.id, input.mode, input.wavesSurvived);
        }

        return { success: result };
      }),

    // Get leaderboard
    getLeaderboard: publicProcedure
      .input(
        z.object({
          mode: z.enum(['noob', 'pro', 'god', 'psycho', 'ultimate']),
          limit: z.number().default(10),
        })
      )
      .query(async ({ input }) => {
        return await getLeaderboard(input.mode, input.limit);
      }),

    // Get player stats
    getStats: protectedProcedure.query(async ({ ctx }) => {
      return await getPlayerStats(ctx.user.id);
    }),

    // Unlock mode
    unlockMode: protectedProcedure
      .input(z.object({ mode: z.enum(['noob', 'pro', 'god', 'psycho', 'ultimate']) }))
      .mutation(async ({ ctx, input }) => {
        const progress = await getOrCreatePlayerProgress(ctx.user.id);
        if (!progress) return { success: false };

        const modes = JSON.parse(progress.unlockedModes || '["noob"]');
        if (!modes.includes(input.mode)) {
          modes.push(input.mode);
          const db = await getDb();
          if (db) {
            await db.update(playerProgress).set({
              unlockedModes: JSON.stringify(modes),
            }).where(eq(playerProgress.userId, ctx.user.id));
          }
        }

        return { success: true };
      }),

    // Unlock ability
    unlockAbility: protectedProcedure
      .input(z.object({ ability: z.string() }))
      .mutation(async ({ ctx, input }) => {
        const progress = await getOrCreatePlayerProgress(ctx.user.id);
        if (!progress) return { success: false };

        const abilities = JSON.parse(progress.unlockedAbilities || '["basicAttack"]');
        if (!abilities.includes(input.ability)) {
          abilities.push(input.ability);
          const db = await getDb();
          if (db) {
            await db.update(playerProgress).set({
              unlockedAbilities: JSON.stringify(abilities),
            }).where(eq(playerProgress.userId, ctx.user.id));
          }
        }

        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
