<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { authClient } from '@/lib/auth-client'
import { 
  Home,
  ListTodo,
  Users,
  Settings,
  User,
  ChevronDown,
  Hash,
  LogOut
} from 'lucide-vue-next'

interface Props {
  teamId: string
  teamName: string
  taskCount?: number
  memberCount?: number
  activeTab?: 'home' | 'tasks' | 'members' | 'settings'
}

const props = withDefaults(defineProps<Props>(), {
  taskCount: 0,
  memberCount: 0,
  activeTab: 'tasks'
})

const router = useRouter()

// Get current user session
const session = authClient.useSession()
const userName = computed(() => session.value?.data?.user?.name || 'User')

const goHome = () => router.push('/')
const goToTasks = () => router.push(`/teams/${props.teamId}/tasks`)
const goToMembers = () => router.push(`/teams/${props.teamId}/members`)

const handleLogout = async () => {
  try {
    await authClient.signOut()
    router.push('/signin')
  } catch (error) {
    console.error('Logout failed:', error)
  }
}

</script>

<template>
  <div class="w-64 bg-gray-900 text-white flex flex-col flex-shrink-0">
    <!-- Team Header -->
    <div class="p-4 border-b border-gray-700">
      <button 
        class="flex items-center gap-2 w-full hover:bg-gray-800 rounded-md p-2 -m-2"
        @click="goHome"
      >
        <div class="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
          <Users class="h-4 w-4 text-white" />
        </div>
        <span class="font-semibold truncate flex-1 text-left">{{ teamName }}</span>
        <ChevronDown class="h-4 w-4 text-gray-400" />
      </button>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 p-2 space-y-1">
      <button 
        @click="goHome"
        class="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-800 text-gray-300 hover:text-white w-full text-left"
      >
        <Home class="h-5 w-5" />
        <span>Home</span>
      </button>
      <button 
        @click="goToTasks"
        :class="[
          'flex items-center gap-3 px-3 py-2 rounded-md w-full text-left',
          activeTab === 'tasks' ? 'bg-gray-800 text-white' : 'hover:bg-gray-800 text-gray-300 hover:text-white'
        ]"
      >
        <ListTodo class="h-5 w-5" />
        <span>Tasks</span>
        <span class="ml-auto text-xs bg-gray-700 px-2 py-0.5 rounded-full">{{ taskCount }}</span>
      </button>
      <button 
        @click="goToMembers"
        :class="[
          'flex items-center gap-3 px-3 py-2 rounded-md w-full text-left',
          activeTab === 'members' ? 'bg-gray-800 text-white' : 'hover:bg-gray-800 text-gray-300 hover:text-white'
        ]"
      >
        <Users class="h-5 w-5" />
        <span>Members</span>
        <span class="ml-auto text-xs bg-gray-700 px-2 py-0.5 rounded-full">{{ memberCount }}</span>
      </button>
      <button class="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-800 text-gray-300 hover:text-white w-full text-left">
        <Settings class="h-5 w-5" />
        <span>Settings</span>
      </button>
    </nav>

    <!-- Slot for additional sidebar content (e.g., status filters) -->
    <slot name="filters"></slot>

    <!-- User -->
    <div class="p-4 border-t border-gray-700">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
            <User class="h-4 w-4 text-gray-300" />
          </div>
          <span class="text-sm text-gray-300 truncate">{{ userName }}</span>
        </div>
        <button 
          @click="handleLogout"
          class="p-2 rounded-md text-gray-400 hover:text-red-400 hover:bg-gray-800 transition-colors"
          title="Logout"
        >
          <LogOut class="h-4 w-4" />
        </button>
      </div>
    </div>
  </div>
</template>
