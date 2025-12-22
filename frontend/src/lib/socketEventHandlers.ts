/**
 * Socket Event Handlers
 * Connects socket events to notification store and task updates
 */
import { useNotificationStore } from '@/store/useNotificationStore';
import { useTaskStore } from '@/store/useTaskStore';
import { getSocket, getCurrentUserId, onSocketEvent } from './socket';

// Event payload types
interface TaskAssignedPayload {
    taskId: string;
    title: string;
    assigneeId: string;
    assignedBy: string;
    teamId: string;
}

interface TaskStatusChangedPayload {
    taskId: string;
    title: string;
    newStatus: string;
    previousStatus: string;
    userId: string;
    userName: string;
    assigneeId: string;
    teamId: string;
}

interface CommentAddedPayload {
    taskId: string;
    commentId: string;
    content: string;
    authorId: string;
    authorName: string;
    teamId: string;
}

// Cleanup functions
let cleanupFns: (() => void)[] = [];

/**
 * Initialize socket event listeners
 */
export function initSocketEventHandlers(): void {
    const socket = getSocket();
    if (!socket) return;

    const notificationStore = useNotificationStore();
    const taskStore = useTaskStore();

    // Task Assigned Event
    cleanupFns.push(
        onSocketEvent<TaskAssignedPayload>('task:assigned', (data) => {
            const currentUserId = getCurrentUserId();

            // Show notification if current user is the assignee
            if (data.assigneeId === currentUserId) {
                notificationStore.info(
                    'New Task Assigned',
                    `${data.assignedBy} assigned you: "${data.title}"`
                );
            }

            // Refresh task list for the team
            if (data.teamId) {
                taskStore.fetchTasks(data.teamId);
            }
        })
    );

    // Task Status Changed Event
    cleanupFns.push(
        onSocketEvent<TaskStatusChangedPayload>('task:status_changed', (data) => {
            const currentUserId = getCurrentUserId();

            // Show notification based on status change
            if (data.newStatus === 'blocked') {
                // Notify manager when task is blocked
                if (data.userId !== currentUserId) {
                    notificationStore.warning(
                        'Task Blocked',
                        `${data.userName} blocked: "${data.title}"`
                    );
                }
            } else if (data.newStatus === 'done') {
                // Notify when task is completed
                if (data.userId !== currentUserId) {
                    notificationStore.success(
                        'Task Completed',
                        `${data.userName} completed: "${data.title}"`
                    );
                }
            }

            // Update task in store without refetching
            if (data.teamId) {
                const tasks = taskStore.getTasksByTeam(data.teamId);
                const taskIndex = tasks.findIndex(t => t.id === data.taskId);
                if (taskIndex !== -1 && tasks[taskIndex]) {
                    tasks[taskIndex].status = data.newStatus as 'todo' | 'in_progress' | 'done' | 'blocked';
                }
            }
        })
    );

    // Comment Added Event
    cleanupFns.push(
        onSocketEvent<CommentAddedPayload>('comment:added', (data) => {
            const currentUserId = getCurrentUserId();

            // Don't notify the author of their own comment
            if (data.authorId !== currentUserId) {
                notificationStore.info(
                    'New Comment',
                    `${data.authorName} commented on a task`
                );
            }
        })
    );

    console.log('Socket event handlers initialized');
}

/**
 * Cleanup socket event listeners
 */
export function cleanupSocketEventHandlers(): void {
    cleanupFns.forEach(fn => fn());
    cleanupFns = [];
    console.log('Socket event handlers cleaned up');
}
