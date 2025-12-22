<script setup lang="ts">
import { useNotificationStore } from '@/store/useNotificationStore';
import { IconX, IconCheck, IconAlertTriangle, IconInfoCircle } from '@tabler/icons-vue';

const notificationStore = useNotificationStore();

const iconMap = {
    info: IconInfoCircle,
    success: IconCheck,
    warning: IconAlertTriangle,
    error: IconAlertTriangle,
};

const colorMap = {
    info: 'bg-blue-500',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    error: 'bg-red-500',
};

const bgColorMap = {
    info: 'bg-blue-50 border-blue-200',
    success: 'bg-green-50 border-green-200',
    warning: 'bg-yellow-50 border-yellow-200',
    error: 'bg-red-50 border-red-200',
};
</script>

<template>
    <Teleport to="body">
        <div class="fixed top-4 right-4 z-[9999] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
            <TransitionGroup name="notification">
                <div
                    v-for="notification in notificationStore.activeNotifications"
                    :key="notification.id"
                    class="pointer-events-auto bg-white rounded-lg shadow-lg border overflow-hidden"
                    :class="bgColorMap[notification.type]"
                >
                    <div class="flex items-start p-4 gap-3">
                        <!-- Icon -->
                        <div
                            class="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
                            :class="colorMap[notification.type]"
                        >
                            <component
                                :is="iconMap[notification.type]"
                                class="w-5 h-5 text-white"
                            />
                        </div>

                        <!-- Content -->
                        <div class="flex-1 min-w-0">
                            <p class="text-sm font-semibold text-gray-900">
                                {{ notification.title }}
                            </p>
                            <p class="text-sm text-gray-600 mt-0.5">
                                {{ notification.message }}
                            </p>
                        </div>

                        <!-- Close button -->
                        <button
                            @click="notificationStore.dismissNotification(notification.id)"
                            class="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <IconX class="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </TransitionGroup>
        </div>
    </Teleport>
</template>

<style scoped>
.notification-enter-active {
    animation: slideIn 0.3s ease-out;
}

.notification-leave-active {
    animation: slideOut 0.2s ease-in;
}

@keyframes slideIn {
    from {
        opacity: 0;
        transform: translateX(100%);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
}

@keyframes slideOut {
    from {
        opacity: 1;
        transform: translateX(0);
    }
    to {
        opacity: 0;
        transform: translateX(100%);
    }
}
</style>
