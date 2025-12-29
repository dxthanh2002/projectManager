import { Router } from 'express';
import { db } from '../lib/db.js';
import { userTeam, team } from '../schema/index.ts';
import { user } from '../schema/auth.ts';
import { eq, and } from 'drizzle-orm';
import { randomUUID } from 'crypto';
import { requireAuth, requireTeamMembership, requireManagerRole } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { addMemberSchema } from '../validators/team.validators.ts';

const router = Router();

/**
 * GET /api/teams/:teamId/members
 * List all team members
 */
router.get('/teams/:teamId/members', requireAuth, requireTeamMembership, async (req, res) => {
    try {
        const { teamId } = req.params;

        const members = await db
            .select({
                id: user.id,
                name: user.name,
                email: user.email,
                role: userTeam.role,
                joinedAt: userTeam.joinedAt,
            })
            .from(userTeam)
            .innerJoin(user, eq(userTeam.userId, user.id))
            .where(eq(userTeam.teamId, teamId))
            .orderBy(userTeam.joinedAt);

        res.json(members);
    } catch (error) {
        console.error('Error fetching team members:', error);
        res.status(500).json({ error: 'INTERNAL_ERROR', message: 'Failed to fetch team members' });
    }
});

/**
 * POST /api/teams/:teamId/members
 * Add a member to the team (manager only)
 * - Requires email or userId
 */
router.post('/teams/:teamId/members', requireAuth, requireTeamMembership, requireManagerRole, validate(addMemberSchema), async (req, res) => {
    try {
        const { teamId } = req.params;
        const { email, userId } = req.body;

        // Validation
        if (!email && !userId) {
            return res.status(400).json({
                error: 'VALIDATION_ERROR',
                message: 'Email or userId is required'
            });
        }

        // 1. Find user by email or userId
        let targetUser;
        if (userId) {
            targetUser = await db.select().from(user).where(eq(user.id, userId)).limit(1);
        } else {
            targetUser = await db.select().from(user).where(eq(user.email, email)).limit(1);
        }

        if (!targetUser[0]) {
            return res.status(404).json({
                error: 'NOT_FOUND',
                message: 'User not found'
            });
        }

        // 2. Check if already a member
        const existing = await db
            .select()
            .from(userTeam)
            .where(and(
                eq(userTeam.teamId, teamId),
                eq(userTeam.userId, targetUser[0].id)
            ))
            .limit(1);

        if (existing[0]) {
            return res.status(409).json({
                error: 'CONFLICT',
                message: 'User is already a team member'
            });
        }

        // 3. Add as member
        const joinedAt = new Date();
        await db.insert(userTeam).values({
            id: randomUUID(),
            userId: targetUser[0].id,
            teamId: teamId,
            role: 'member',
            joinedAt: joinedAt,
        });

        res.status(201).json({
            message: 'Member added successfully',
            member: {
                id: targetUser[0].id,
                name: targetUser[0].name,
                email: targetUser[0].email,
                role: 'member',
                joinedAt: joinedAt.toISOString()
            }
        });
    } catch (error) {
        console.error('Error adding team member:', error);
        res.status(500).json({ error: 'INTERNAL_ERROR', message: 'Failed to add team member' });
    }
});

/**
 * DELETE /api/teams/:teamId/members/:userId
 * Remove a member from the team (manager only)
 * - Cannot remove yourself if you're the only manager
 */
router.delete('/teams/:teamId/members/:userId', requireAuth, requireTeamMembership, requireManagerRole, async (req, res) => {
    try {
        const { teamId, userId } = req.params;

        // Check if member exists
        const member = await db
            .select()
            .from(userTeam)
            .where(and(
                eq(userTeam.teamId, teamId),
                eq(userTeam.userId, userId)
            ))
            .limit(1);

        if (!member[0]) {
            return res.status(404).json({
                error: 'NOT_FOUND',
                message: 'Member not found in this team'
            });
        }

        // Prevent removing the last manager
        if (member[0].role === 'manager') {
            const managerCount = await db
                .select()
                .from(userTeam)
                .where(and(
                    eq(userTeam.teamId, teamId),
                    eq(userTeam.role, 'manager')
                ));

            if (managerCount.length === 1) {
                return res.status(400).json({
                    error: 'VALIDATION_ERROR',
                    message: 'Cannot remove the last manager. Transfer ownership or delete the team instead.'
                });
            }
        }

        // Remove member
        await db.delete(userTeam).where(and(
            eq(userTeam.teamId, teamId),
            eq(userTeam.userId, userId)
        ));

        res.status(204).send();
    } catch (error) {
        console.error('Error removing team member:', error);
        res.status(500).json({ error: 'INTERNAL_ERROR', message: 'Failed to remove team member' });
    }
});

/**
 * PATCH /api/teams/:teamId/members/:userId/role
 * Update member role (manager only)
 * - Promote member to manager or demote manager to member
 */
router.patch('/teams/:teamId/members/:userId/role', requireAuth, requireTeamMembership, requireManagerRole, async (req, res) => {
    try {
        const { teamId, userId } = req.params;
        const { role } = req.body;

        // Validation
        if (!role || !['manager', 'member'].includes(role)) {
            return res.status(400).json({
                error: 'VALIDATION_ERROR',
                message: 'Role must be either "manager" or "member"'
            });
        }

        // Check if member exists
        const member = await db
            .select()
            .from(userTeam)
            .where(and(
                eq(userTeam.teamId, teamId),
                eq(userTeam.userId, userId)
            ))
            .limit(1);

        if (!member[0]) {
            return res.status(404).json({
                error: 'NOT_FOUND',
                message: 'Member not found in this team'
            });
        }

        // Prevent demoting the last manager
        if (member[0].role === 'manager' && role === 'member') {
            const managerCount = await db
                .select()
                .from(userTeam)
                .where(and(
                    eq(userTeam.teamId, teamId),
                    eq(userTeam.role, 'manager')
                ));

            if (managerCount.length === 1) {
                return res.status(400).json({
                    error: 'VALIDATION_ERROR',
                    message: 'Cannot demote the last manager'
                });
            }
        }

        // Update role
        await db.update(userTeam)
            .set({ role })
            .where(and(
                eq(userTeam.teamId, teamId),
                eq(userTeam.userId, userId)
            ));

        res.json({ message: 'Member role updated successfully', role });
    } catch (error) {
        console.error('Error updating member role:', error);
        res.status(500).json({ error: 'INTERNAL_ERROR', message: 'Failed to update member role' });
    }
});


/**
 * POST /api/teams/:teamId/leave
 * Allow a member to leave the team
 * - Cannot leave if you're the last manager
 */
router.post('/teams/:teamId/leave', requireAuth, requireTeamMembership, async (req, res) => {
    try {
        const { teamId } = req.params;
        const userId = req.user.id;

        // 1. Check current role
        const member = await db
            .select()
            .from(userTeam)
            .where(and(
                eq(userTeam.teamId, teamId),
                eq(userTeam.userId, userId)
            ))
            .limit(1);

        if (!member[0]) {
            return res.status(404).json({
                error: 'NOT_FOUND',
                message: 'You are not a member of this team'
            });
        }

        // 2. Prevent "orphan" teams (but allow deleting if last manager)
        let message = 'Successfully left the team';

        if (member[0].role === 'manager') {
            const managerCount = await db
                .select()
                .from(userTeam)
                .where(and(
                    eq(userTeam.teamId, teamId),
                    eq(userTeam.role, 'manager')
                ));

            if (managerCount.length === 1) {
                // Last manager leaving -> Delete the Team
                await db.delete(team).where(eq(team.id, teamId));
                // Note: user_team and tasks will cascade delete based on schema
                return res.json({
                    message: 'Team deleted because you were the last manager',
                    action: 'deleted'
                });
            }
        }

        // 3. Remove self (if not deleting team)
        await db.delete(userTeam).where(and(
            eq(userTeam.teamId, teamId),
            eq(userTeam.userId, userId)
        ));

        res.json({ message });
    } catch (error) {
        console.error('Error leaving team:', error);
        res.status(500).json({ error: 'INTERNAL_ERROR', message: 'Failed to leave team' });
    }
});

export default router;
