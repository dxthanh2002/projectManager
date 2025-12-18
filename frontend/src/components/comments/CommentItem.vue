<script setup lang="ts">
import { ref, computed } from 'vue';
import { useCommentStore } from '@/store/useCommentStore';

const props = defineProps<{
    comment: IComment;
    currentUserId: string;
    isManager: boolean;
}>();

const commentStore = useCommentStore();

const isEditing = ref(false);
const editContent = ref('');
const isDeleting = ref(false);
const showDeleteConfirm = ref(false);

// Check if current user can edit (only author)
const canEdit = computed(() => props.currentUserId === props.comment.userId);

// Check if current user can delete (author OR manager)
const canDelete = computed(() => 
    props.currentUserId === props.comment.userId || props.isManager
);

// Format relative time
const formatRelativeTime = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
};

const relativeTime = computed(() => formatRelativeTime(props.comment.createdAt));

const startEdit = () => {
    editContent.value = props.comment.content;
    isEditing.value = true;
};

const cancelEdit = () => {
    isEditing.value = false;
    editContent.value = '';
};

const saveEdit = async () => {
    if (!editContent.value.trim()) return;
    
    try {
        await commentStore.updateComment(props.comment.id, editContent.value.trim());
        isEditing.value = false;
        editContent.value = '';
    } catch (error) {
        // Error handled in store
    }
};

const confirmDelete = () => {
    showDeleteConfirm.value = true;
};

const cancelDelete = () => {
    showDeleteConfirm.value = false;
};

const executeDelete = async () => {
    isDeleting.value = true;
    try {
        await commentStore.deleteComment(props.comment.id);
    } catch (error) {
        // Error handled in store
    } finally {
        isDeleting.value = false;
        showDeleteConfirm.value = false;
    }
};
</script>

<template>
    <div class="comment-item bg-gray-50 rounded-lg p-3 transition-all duration-200"
        :class="{ 'opacity-50': isDeleting }">
        <!-- Header: Author + Time -->
        <div class="flex items-center justify-between mb-2">
            <div class="flex items-center gap-2">
                <div class="w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-medium">
                    {{ comment.author.name?.charAt(0)?.toUpperCase() || 'U' }}
                </div>
                <div>
                    <span class="text-sm font-medium text-gray-900">{{ comment.author.name || 'Unknown' }}</span>
                    <span class="text-xs text-gray-500 ml-2">{{ relativeTime }}</span>
                </div>
            </div>
            
            <!-- Action Buttons -->
            <div v-if="!isEditing && !showDeleteConfirm" class="flex gap-1">
                <button
                    v-if="canEdit"
                    @click="startEdit"
                    class="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                    title="Edit comment"
                >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                </button>
                <button
                    v-if="canDelete"
                    @click="confirmDelete"
                    class="p-1 text-gray-400 hover:text-red-600 transition-colors"
                    title="Delete comment"
                >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </button>
            </div>
        </div>

        <!-- Content / Edit Mode -->
        <div v-if="isEditing" class="mt-2">
            <textarea
                v-model="editContent"
                rows="2"
                class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg 
                       focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                @keydown.escape="cancelEdit"
            ></textarea>
            <div class="flex gap-2 mt-2">
                <button
                    @click="saveEdit"
                    :disabled="!editContent.trim()"
                    class="px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded
                           hover:bg-blue-700 disabled:bg-gray-300"
                >
                    Save
                </button>
                <button
                    @click="cancelEdit"
                    class="px-3 py-1 bg-gray-200 text-gray-700 text-xs font-medium rounded hover:bg-gray-300"
                >
                    Cancel
                </button>
            </div>
        </div>

        <!-- Delete Confirmation -->
        <div v-else-if="showDeleteConfirm" class="mt-2">
            <p class="text-sm text-red-600 mb-2">Delete this comment?</p>
            <div class="flex gap-2">
                <button
                    @click="executeDelete"
                    :disabled="isDeleting"
                    class="px-3 py-1 bg-red-600 text-white text-xs font-medium rounded
                           hover:bg-red-700 disabled:bg-gray-300"
                >
                    {{ isDeleting ? 'Deleting...' : 'Delete' }}
                </button>
                <button
                    @click="cancelDelete"
                    class="px-3 py-1 bg-gray-200 text-gray-700 text-xs font-medium rounded hover:bg-gray-300"
                >
                    Cancel
                </button>
            </div>
        </div>

        <!-- Normal Content Display -->
        <div v-else class="text-sm text-gray-700 whitespace-pre-wrap break-words">
            {{ comment.content }}
        </div>
    </div>
</template>

<style scoped>
.comment-item:hover {
    background-color: rgb(243 244 246);
}
</style>
