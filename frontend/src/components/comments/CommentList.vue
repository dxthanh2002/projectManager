<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, computed } from 'vue';
import { useCommentStore } from '@/store/useCommentStore';
import { authClient } from '@/lib/auth-client';
import CommentItem from './CommentItem.vue';

const props = defineProps<{
    taskId: string;
    isManager?: boolean;
}>();

const commentStore = useCommentStore();
const session = authClient.useSession();

const newComment = ref('');
const isSubmitting = ref(false);

// Fetch comments when taskId changes or on mount
const loadComments = async () => {
    if (props.taskId) {
        await commentStore.fetchComments(props.taskId);
    }
};

onMounted(() => {
    loadComments();
});

watch(() => props.taskId, () => {
    loadComments();
});

onUnmounted(() => {
    commentStore.clearComments();
});

const handleSubmit = async () => {
    if (!newComment.value.trim() || isSubmitting.value) return;
    
    isSubmitting.value = true;
    try {
        await commentStore.addComment(props.taskId, newComment.value.trim());
        newComment.value = '';
    } catch (error) {
        // Error handled in store
    } finally {
        isSubmitting.value = false;
    }
};

const currentUserId = computed(() => session.value?.data?.user?.id || '');
</script>

<template>
    <div class="comments-section">
        <h4 class="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            Comments ({{ commentStore.commentCount }})
        </h4>

        <!-- Loading State -->
        <div v-if="commentStore.isLoading && commentStore.comments.length === 0" 
            class="flex items-center justify-center py-8">
            <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span class="ml-2 text-sm text-gray-500">Loading comments...</span>
        </div>

        <!-- Empty State -->
        <div v-else-if="commentStore.comments.length === 0" 
            class="text-center py-6 text-gray-500 bg-gray-50 rounded-lg">
            <svg class="w-8 h-8 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p class="text-sm">No comments yet</p>
            <p class="text-xs text-gray-400">Be the first to comment</p>
        </div>

        <!-- Comments List -->
        <div v-else class="space-y-3 mb-4 max-h-64 overflow-y-auto">
            <CommentItem
                v-for="comment in commentStore.sortedComments"
                :key="comment.id"
                :comment="comment"
                :current-user-id="currentUserId"
                :is-manager="isManager || false"
            />
        </div>

        <!-- New Comment Form -->
        <div class="mt-4 border-t pt-4">
            <div class="flex gap-2">
                <textarea
                    v-model="newComment"
                    placeholder="Add a comment..."
                    rows="2"
                    maxlength="2000"
                    class="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg 
                           focus:ring-2 focus:ring-blue-500 focus:border-transparent
                           resize-none placeholder-gray-400"
                    :disabled="isSubmitting"
                    @keydown.ctrl.enter="handleSubmit"
                ></textarea>
                <button
                    @click="handleSubmit"
                    :disabled="!newComment.trim() || isSubmitting"
                    class="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg
                           hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed
                           transition-colors duration-200 self-end"
                >
                    <span v-if="isSubmitting" class="flex items-center">
                        <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-1"></div>
                    </span>
                    <span v-else>Send</span>
                </button>
            </div>
            <p class="text-xs text-gray-400 mt-1">Ctrl+Enter to send</p>
        </div>
    </div>
</template>

<style scoped>
.comments-section {
    background-color: white;
    border-radius: 0.5rem;
}
</style>
