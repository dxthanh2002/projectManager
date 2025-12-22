/**
 * Socket.io Server Configuration
 * Real-time communication for task notifications
 */
import { Server } from 'socket.io';
import { auth } from './auth.ts';
import { db } from './db.js';
import { userTeam } from '../schema/index.ts';
import { eq } from 'drizzle-orm';

let io = null;

/**
 * Initialize Socket.io server with the HTTP server
 * @param {import('http').Server} httpServer - Node HTTP server instance
 */
export function initSocket(httpServer) {
    io = new Server(httpServer, {
        cors: {
            origin: ['http://localhost:5173'],
            methods: ['GET', 'POST'],
            credentials: true,
        },
    });

    // Authentication middleware - parse better-auth session from cookies
    io.use(async (socket, next) => {
        try {
            const cookieHeader = socket.handshake.headers.cookie;
            if (!cookieHeader) {
                return next(new Error('Authentication required'));
            }

            // Parse cookies and create headers object for better-auth
            const headers = new Headers();
            headers.set('cookie', cookieHeader);

            const session = await auth.api.getSession({ headers });

            if (!session?.user) {
                return next(new Error('Invalid session'));
            }

            // Attach user to socket
            socket.user = session.user;
            next();
        } catch (error) {
            console.error('Socket auth error:', error);
            next(new Error('Authentication failed'));
        }
    });

    // Connection handler
    io.on('connection', async (socket) => {
        console.log(`User connected: ${socket.user.id} (${socket.user.email})`);

        // Auto-join all team rooms the user belongs to
        try {
            const userTeams = await db
                .select({ teamId: userTeam.teamId })
                .from(userTeam)
                .where(eq(userTeam.userId, socket.user.id));

            for (const { teamId } of userTeams) {
                socket.join(`team:${teamId}`);
                console.log(`User ${socket.user.id} joined room team:${teamId}`);
            }
        } catch (error) {
            console.error('Error joining team rooms:', error);
        }

        // Handle explicit team room join (for new team membership)
        socket.on('join:team', (teamId) => {
            socket.join(`team:${teamId}`);
            console.log(`User ${socket.user.id} joined room team:${teamId}`);
        });

        // Handle team room leave
        socket.on('leave:team', (teamId) => {
            socket.leave(`team:${teamId}`);
            console.log(`User ${socket.user.id} left room team:${teamId}`);
        });

        socket.on('disconnect', () => {
            console.log(`User disconnected: ${socket.user.id}`);
        });
    });

    console.log('Socket.io initialized');
    return io;
}

/**
 * Get the Socket.io server instance
 * @returns {Server} Socket.io server instance
 */
export function getIO() {
    if (!io) {
        throw new Error('Socket.io not initialized. Call initSocket first.');
    }
    return io;
}

/**
 * Emit an event to a specific team room
 * @param {string} teamId - Team ID
 * @param {string} event - Event name
 * @param {object} data - Event payload
 */
export function emitToTeam(teamId, event, data) {
    if (!io) {
        console.warn('Socket.io not initialized, skipping emit');
        return;
    }
    io.to(`team:${teamId}`).emit(event, data);
}
