import { auth } from '../lib/auth.ts';
import { fromNodeHeaders } from 'better-auth/node';
import { db } from '../lib/db.js';
import { userTeam } from '../schema/index.ts';
import { eq, and } from 'drizzle-orm';

/**
 * Middleware: Require authentication
 * Validates user session using better-auth
 */
export async function requireAuth(req, res, next) {
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
 * Validates user is a member of the team specified in req.params.teamId
 */
export async function requireTeamMembership(req, res, next) {
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
 * Validates user has manager role within the current team context
 * Must be used after requireTeamMembership
 */
export function requireManagerRole(req, res, next) {
    if (req.teamRole !== 'manager') {
        return res.status(403).json({
            error: 'FORBIDDEN',
            message: 'Manager role required'
        });
    }
    next();
}
