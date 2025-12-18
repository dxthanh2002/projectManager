import { defineStore } from 'pinia';
import { useToast } from 'vue-toast-notification';
import { fetchTaskCommentsAPI, createCommentAPI, updateCommentAPI, deleteCommentAPI } from '@/services/api';

export const useCommentStore = defineStore('comment', {
    state: () => ({
        comments: [] as IComment[],
        isLoading: false,
        error: null as string | null,
        currentTaskId: null as string | null,
    }),
    getters: {
        commentCount: (state) => state.comments.length,
        sortedComments: (state) => {
            return [...state.comments].sort((a, b) =>
                new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            );
        }
    },
    actions: {
        async fetchComments(taskId: string) {
            this.isLoading = true;
            this.error = null;
            this.currentTaskId = taskId;
            try {
                const response = await fetchTaskCommentsAPI(taskId);
                this.comments = Array.isArray(response) ? response : [];
            } catch (error: any) {
                console.error("Error fetching comments:", error);
                this.error = "Failed to load comments";
                const toast = useToast();
                toast.error("Failed to load comments");
            } finally {
                this.isLoading = false;
            }
        },

        async addComment(taskId: string, content: string) {
            this.isLoading = true;
            this.error = null;

            // Optimistic UI: Create temporary comment
            const tempId = `temp-${Date.now()}`;
            const tempComment: IComment = {
                id: tempId,
                content,
                taskId,
                userId: '',
                createdAt: new Date().toISOString(),
                author: { id: '', name: 'You', email: '' }
            };
            this.comments.push(tempComment);

            try {
                const createdComment = await createCommentAPI(taskId, content);
                // Replace temp comment with real one
                const index = this.comments.findIndex(c => c.id === tempId);
                if (index !== -1) {
                    this.comments[index] = createdComment;
                }
                const toast = useToast();
                this.error = null; // Clear error on success
                toast.success('Comment added');
                return createdComment;
            } catch (error: any) {
                // Rollback optimistic update
                this.comments = this.comments.filter(c => c.id !== tempId);
                console.error("Error creating comment:", error);
                this.error = "Failed to add comment";
                const toast = useToast();
                const status = error.response?.status;
                if (status === 404) {
                    toast.error("Task not found or access denied");
                } else {
                    toast.error("Failed to add comment");
                }
                throw error;
            } finally {
                this.isLoading = false;
            }
        },

        async updateComment(commentId: string, content: string) {
            this.isLoading = true;
            this.error = null;

            // Store old content for rollback
            const comment = this.comments.find(c => c.id === commentId);
            if (!comment) {
                this.isLoading = false;
                const toast = useToast();
                toast.error("Comment not found");
                return;
            }
            const oldContent = comment.content;

            // Optimistic update
            comment.content = content;

            try {
                await updateCommentAPI(commentId, content);
                this.error = null; // Clear error on success
                const toast = useToast();
                toast.success('Comment updated');
            } catch (error: any) {
                // Rollback
                comment.content = oldContent;
                console.error("Error updating comment:", error);
                this.error = "Failed to update comment";
                const toast = useToast();
                const status = error.response?.status;
                if (status === 403) {
                    toast.error("Only the author can edit this comment");
                } else if (status === 404) {
                    toast.error("Comment not found");
                } else {
                    toast.error("Failed to update comment");
                }
                throw error;
            } finally {
                this.isLoading = false;
            }
        },

        async deleteComment(commentId: string) {
            this.isLoading = true;
            this.error = null;

            // Store for rollback
            const index = this.comments.findIndex(c => c.id === commentId);
            if (index === -1) {
                this.isLoading = false;
                const toast = useToast();
                toast.error("Comment not found");
                return;
            }
            const deletedComment = this.comments[index];

            // Optimistic delete
            this.comments.splice(index, 1);

            try {
                await deleteCommentAPI(commentId);
                this.error = null; // Clear error on success
                const toast = useToast();
                toast.success('Comment deleted');
            } catch (error: any) {
                // Rollback
                this.comments.splice(index, 0, deletedComment);
                console.error("Error deleting comment:", error);
                this.error = "Failed to delete comment";
                const toast = useToast();
                const status = error.response?.status;
                if (status === 403) {
                    toast.error("Only the author or manager can delete this comment");
                } else if (status === 404) {
                    toast.error("Comment not found");
                } else {
                    toast.error("Failed to delete comment");
                }
                throw error;
            } finally {
                this.isLoading = false;
            }
        },

        clearComments() {
            this.comments = [];
            this.currentTaskId = null;
            this.error = null;
        }
    }
});
