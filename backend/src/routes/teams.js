import { Router } from 'express';
import { db } from '../lib/db.js';
import { team, userTeam } from '../schema/index.ts';
import { eq, and, sql } from 'drizzle-orm';
import { auth } from '../lib/auth.ts';
import { fromNodeHeaders } from 'better-auth/node';
import { randomUUID } from 'crypto';

const router = Router();

/**
 * Middleware: Require authentication
 */
async function requireAuth(req, res, next) {
    const session = await auth.api.getSession({
        headers: fromNodeHeaders(req.headers),
    });

    if (!session?.user) {
        return res.status(401).json({ error: 'UNAUTHORIZED', message: 'Authentication required' });
    }

    req.user = session.user;
    next();
}

/**
 * Middleware: Require team membership
 */
async function requireTeamMembership(req, res, next) {
    const { teamId } = req.params;
    const userId = req.user.id;

    const membership = await db
        .select()
        .from(userTeam)
        .where(and(
            eq(userTeam.teamId, teamId),
            eq(userTeam.userId, userId)
        ))
        .limit(1);

    if (!membership[0]) {
        return res.status(403).json({
            error: 'FORBIDDEN',
            message: 'Not a team member'
        });
    }

    req.teamRole = membership[0].role;
    req.teamId = teamId;
    next();
}

/**
 * Middleware: Require manager role
 */
function requireManagerRole(req, res, next) {
    if (req.teamRole !== 'manager') {
        return res.status(403).json({
            error: 'FORBIDDEN',
            message: 'Manager role required'
        });
    }
    next();
}

// ============================================
// Team Routes
// ============================================

/**
 * POST /api/teams
 * Create a new team
 * - User automatically becomes manager
 */
router.post('/teams', requireAuth, async (req, res) => {
    try {
        const { name, description } = req.body;
        const userId = req.user.id;

        // Validation
        if (!name || name.trim().length === 0) {
            return res.status(400).json({
                error: 'VALIDATION_ERROR',
                message: 'Team name is required'
            });
        }

        // 1. Create team
        const teamId = randomUUID();
        await db.insert(team).values({
            id: teamId,
            name: name.trim(),
            description: description?.trim() || null,
            createdById: userId,
        });

        // 2. Auto-assign manager role
        await db.insert(userTeam).values({
            id: randomUUID(),
            userId: userId,
            teamId: teamId,
            role: 'manager',
        });

        // 3. Fetch created team with role
        const createdTeam = await db
            .select({
                id: team.id,
                name: team.name,
                description: team.description,
                createdById: team.createdById,
                role: userTeam.role,
                createdAt: team.createdAt,
            })
            .from(team)
            .innerJoin(userTeam, eq(team.id, userTeam.teamId))
            .where(and(
                eq(team.id, teamId),
                eq(userTeam.userId, userId)
            ))
            .limit(1);

        res.status(201).json(createdTeam[0]);
    } catch (error) {
        console.error('Error creating team:', error);
        res.status(500).json({ error: 'INTERNAL_ERROR', message: 'Failed to create team' });
    }
});

/**
 * GET /api/teams
 * List all teams user is a member of
 */
router.get('/teams', requireAuth, async (req, res) => {
    try {
        const userId = req.user.id;

        const teams = await db
            .select({
                id: team.id,
                name: team.name,
                description: team.description,
                role: userTeam.role,
                createdAt: team.createdAt,
                memberCount: sql < number > `COUNT(DISTINCT ut2.user_id)`,
            })
            .from(userTeam)
            .innerJoin(team, eq(userTeam.teamId, team.id))
            .leftJoin(
                sql`user_team ut2`,
                sql`${team.id} = ut2.team_id`
            )
            .where(eq(userTeam.userId, userId))
            .groupBy(team.id, userTeam.role);

        res.json(teams);
    } catch (error) {
        console.error('Error fetching teams:', error);
        res.status(500).json({ error: 'INTERNAL_ERROR', message: 'Failed to fetch teams' });
    }
});

/**
 * GET /api/teams/:teamId
 * Get team details
 */
router.get('/teams/:teamId', requireAuth, requireTeamMembership, async (req, res) => {
    try {
        const { teamId } = req.params;

        const teamDetails = await db
            .select({
                id: team.id,
                name: team.name,
                description: team.description,
                createdById: team.createdById,
                role: userTeam.role,
                createdAt: team.createdAt,
            })
            .from(team)
            .innerJoin(userTeam, eq(team.id, userTeam.teamId))
            .where(and(
                eq(team.id, teamId),
                eq(userTeam.userId, req.user.id)
            ))
            .limit(1);

        res.json(teamDetails[0]);
    } catch (error) {
        console.error('Error fetching team:', error);
        res.status(500).json({ error: 'INTERNAL_ERROR', message: 'Failed to fetch team' });
    }
});

/**
 * PATCH /api/teams/:teamId
 * Update team details (manager only)
 */
router.patch('/teams/:teamId', requireAuth, requireTeamMembership, requireManagerRole, async (req, res) => {
    try {
        const { teamId } = req.params;
        const { name, description } = req.body;

        const updates = {};
        if (name !== undefined) updates.name = name.trim();
        if (description !== undefined) updates.description = description?.trim() || null;

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({ error: 'VALIDATION_ERROR', message: 'No fields to update' });
        }

        await db.update(team).set(updates).where(eq(team.id, teamId));

        res.json({ message: 'Team updated successfully' });
    } catch (error) {
        console.error('Error updating team:', error);
        res.status(500).json({ error: 'INTERNAL_ERROR', message: 'Failed to update team' });
    }
});

/**
 * DELETE /api/teams/:teamId
 * Delete team (manager only)
 * - Cascades to user_team and tasks
 */
router.delete('/teams/:teamId', requireAuth, requireTeamMembership, requireManagerRole, async (req, res) => {
    try {
        const { teamId } = req.params;

        await db.delete(team).where(eq(team.id, teamId));

        res.json({ message: 'Team deleted successfully' });
    } catch (error) {
        console.error('Error deleting team:', error);
        res.status(500).json({ error: 'INTERNAL_ERROR', message: 'Failed to delete team' });
    }
});

export default router;
export { requireAuth, requireTeamMembership, requireManagerRole };
