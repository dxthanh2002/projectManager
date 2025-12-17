import { defineStore } from 'pinia';
import { useToast } from 'vue-toast-notification';
import { fetchTeamTasksAPI, createTaskAPI, updateTaskAPI, deleteTaskAPI } from '@/services/api';

export const useTaskStore = defineStore('task', {
    state: () => ({
        tasks: {} as Record<string, ITask[]>,
        isLoading: false,
        filters: {
            status: '' as string,
            priority: '' as string,
            assigneeId: '' as string,
        }
    }),
    getters: {
        getTasksByTeam: (state) => {
            return (teamId: string) => state.tasks[teamId] || [];
        },
        tasksByStatus: (state) => {
            return (teamId: string) => {
                const teamTasks = state.tasks[teamId] || [];
                return {
                    todo: teamTasks.filter(t => t.status === 'todo'),
                    in_progress: teamTasks.filter(t => t.status === 'in_progress'),
                    done: teamTasks.filter(t => t.status === 'done'),
                    blocked: teamTasks.filter(t => t.status === 'blocked'),
                };
            };
        }
    },
    actions: {
        async fetchTasks(teamId: string, filters?: { status?: string; priority?: string; assigneeId?: string }) {
            this.isLoading = true;
            try {
                // axios interceptor returns response.data directly
                const response = await fetchTeamTasksAPI(teamId, filters);
                this.tasks[teamId] = Array.isArray(response) ? response : [];
            } catch (error: any) {
                console.error("Error fetching tasks:", error);
                const toast = useToast();
                toast.error("Failed to load tasks");
            } finally {
                this.isLoading = false;
            }
        },

        async createTask(teamId: string, data: ICreateTask) {
            this.isLoading = true;
            try {
                // axios interceptor returns response.data directly
                const response = await createTaskAPI(teamId, data);
                const toast = useToast();
                toast.success('Task created successfully');
                // Refresh task list
                await this.fetchTasks(teamId);
                return response;
            } catch (error: any) {
                console.error("Error creating task:", error);
                const toast = useToast();
                const status = error.response?.status;
                if (status === 400) {
                    toast.error(error.response?.data?.message || "Validation error");
                } else if (status === 403) {
                    toast.error("Only managers can create tasks");
                } else {
                    toast.error("Failed to create task");
                }
                throw error;
            } finally {
                this.isLoading = false;
            }
        },

        async updateTask(teamId: string, taskId: string, data: Partial<ICreateTask>) {
            this.isLoading = true;
            try {
                await updateTaskAPI(taskId, data);
                const toast = useToast();
                toast.success('Task updated successfully');
                // Refresh task list
                await this.fetchTasks(teamId);
            } catch (error: any) {
                console.error("Error updating task:", error);
                const toast = useToast();
                const status = error.response?.status;
                if (status === 403) {
                    toast.error("Only managers can update tasks");
                } else if (status === 404) {
                    toast.error("Task not found");
                } else {
                    toast.error("Failed to update task");
                }
                throw error;
            } finally {
                this.isLoading = false;
            }
        },

        async deleteTask(teamId: string, taskId: string) {
            this.isLoading = true;
            try {
                await deleteTaskAPI(taskId);
                const toast = useToast();
                toast.success('Task deleted successfully');
                // Refresh task list
                await this.fetchTasks(teamId);
            } catch (error: any) {
                console.error("Error deleting task:", error);
                const toast = useToast();
                const status = error.response?.status;
                if (status === 403) {
                    toast.error("Only managers can delete tasks");
                } else if (status === 404) {
                    toast.error("Task not found");
                } else {
                    toast.error("Failed to delete task");
                }
                throw error;
            } finally {
                this.isLoading = false;
            }
        },

        setFilters(filters: { status?: string; priority?: string; assigneeId?: string }) {
            if (filters.status !== undefined) this.filters.status = filters.status;
            if (filters.priority !== undefined) this.filters.priority = filters.priority;
            if (filters.assigneeId !== undefined) this.filters.assigneeId = filters.assigneeId;
        },

        clearFilters() {
            this.filters = { status: '', priority: '', assigneeId: '' };
        }
    }
});
