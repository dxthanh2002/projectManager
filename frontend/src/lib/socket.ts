/**
 * Socket.io Client
 * Manages real-time connection for notifications
 */
import { io, Socket } from 'socket.io-client';

// Socket instance
let socket: Socket | null = null;

// Current user ID for filtering notifications
let currentUserId: string | null = null;

/**
 * Initialize and connect the socket
 */
export function connectSocket(): Socket {
    if (socket?.connected) {
        return socket;
    }

    socket = io('http://localhost:5001', {
        withCredentials: true,
        autoConnect: true,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
    });

    socket.on('connect', () => {
        console.log('Socket connected:', socket?.id);
    });

    socket.on('disconnect', (reason) => {
        console.log('Socket disconnected:', reason);
    });

    socket.on('connect_error', (error) => {
        console.error('Socket connection error:', error.message);
    });

    // Expose socket to window for debugging
    if (typeof window !== 'undefined') {
        (window as any).socket = socket;
    }

    return socket;
}

/**
 * Disconnect the socket
 */
export function disconnectSocket(): void {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
    if (typeof window !== 'undefined') {
        (window as any).socket = null;
    }
}

/**
 * Get the socket instance
 */
export function getSocket(): Socket | null {
    return socket;
}

/**
 * Set the current user ID for notification filtering
 */
export function setCurrentUserId(userId: string | null): void {
    currentUserId = userId;
}

/**
 * Get the current user ID
 */
export function getCurrentUserId(): string | null {
    return currentUserId;
}

/**
 * Join a team room
 */
export function joinTeam(teamId: string): void {
    if (socket?.connected) {
        socket.emit('join:team', teamId);
    }
}

/**
 * Leave a team room
 */
export function leaveTeam(teamId: string): void {
    if (socket?.connected) {
        socket.emit('leave:team', teamId);
    }
}

/**
 * Subscribe to socket events
 */
export function onSocketEvent<T>(event: string, callback: (data: T) => void): () => void {
    if (socket) {
        socket.on(event, callback);
        return () => socket?.off(event, callback);
    }
    return () => { };
}
