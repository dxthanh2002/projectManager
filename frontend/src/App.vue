<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router';
import { computed } from 'vue';
import Footer from './layouts/Footer.vue';
import Navbar from './layouts/Navbar.vue';
import NotificationToast from './components/NotificationToast.vue';

import { onMounted, onUnmounted, watch } from 'vue'
import { initDropdowns } from 'flowbite'
import { authClient } from './lib/auth-client';
import { connectSocket, disconnectSocket, setCurrentUserId } from './lib/socket';
import { initSocketEventHandlers, cleanupSocketEventHandlers } from './lib/socketEventHandlers';

// Get auth session
const session = authClient.useSession();

onMounted(async () => {
  initDropdowns();
  
  // Initialize socket if user is authenticated
  if (session.value?.data?.user) {
    setCurrentUserId(session.value.data.user.id);
    connectSocket();
    initSocketEventHandlers();
  }
});

// Watch for auth state changes
watch(() => session.value?.data?.user, (user) => {
  if (user) {
    setCurrentUserId(user.id);
    connectSocket();
    initSocketEventHandlers();
  } else {
    cleanupSocketEventHandlers();
    disconnectSocket();
    setCurrentUserId(null);
  }
});

onUnmounted(() => {
  cleanupSocketEventHandlers();
  disconnectSocket();
});

const route = useRoute();
const isFullWidth = computed(() => route.meta?.fullWidth === true);
</script>

<template>
  <!-- Notification Toast Container -->
  <NotificationToast />

  <!-- Full Width Layout (Dashboard, TaskList) - no Navbar -->
  <div v-if="isFullWidth" class="min-h-screen">
    <RouterView />
  </div>

  <!-- Normal Layout -->
  <div v-else class="flex flex-col items-center p-7 rounded-2xl">
    <div class="max-w-7xl mb-2">
      <Navbar />
    </div>
    <div class="flex-1 max-w-7xl mx-72">
      <RouterView />
    </div>

    <div class="pt-4 bottom-0">
      <Footer />
    </div>
  </div>
</template>
<style scoped></style>

