<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useTeamStore } from '@/store/useTeamStore'
import { authClient } from '@/lib/auth-client'
import { Button } from '@/components/ui/button'
import { Users, Plus, Loader2, ArrowRight, User } from 'lucide-vue-next'

const teamStore = useTeamStore()
const router = useRouter()
const session = authClient.useSession()

const userName = computed(() => session.value?.data?.user?.name || 'User')

onMounted(async () => {
  await teamStore.fetchTeams()
})

const teams = computed(() => teamStore.teams)
const isLoading = computed(() => teamStore.isLoading)

const goToCreateTeam = () => {
  router.push('/teams/create')
}

const selectTeam = (teamId: string) => {
  router.push(`/teams/${teamId}/tasks`)
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900">
    <!-- Header Section -->
    <div class="pt-16 pb-12 text-center">
      <h1 class="text-4xl md:text-5xl font-bold text-white mb-3">
        Welcome back 👋
      </h1>
      <p class="text-lg text-purple-200">
        Choose a workspace to get started.
      </p>
    </div>

    <!-- Main Content -->
    <div class="max-w-4xl mx-auto px-4 pb-16">
      <div class="grid md:grid-cols-3 gap-6">
        <!-- Workspaces Panel -->
        <div class="md:col-span-2">
          <div class="bg-white rounded-xl shadow-xl overflow-hidden">
            <!-- Workspaces Header -->
            <div class="px-6 py-4 border-b border-gray-100">
              <div class="flex items-center gap-2">
                <Users class="h-5 w-5 text-gray-500" />
                <span class="text-sm font-medium text-gray-700">My Workspaces</span>
              </div>
            </div>

            <!-- Workspaces Tab -->
            <div class="px-6 pt-4">
              <div class="inline-block border-b-2 border-purple-600 pb-2">
                <span class="text-sm font-medium text-gray-900">Workspaces</span>
              </div>
            </div>

            <!-- Loading State -->
            <div v-if="isLoading" class="flex items-center justify-center py-16">
              <Loader2 class="h-8 w-8 animate-spin text-purple-600" />
            </div>

            <!-- Empty State -->
            <div v-else-if="teams.length === 0" class="p-8 text-center">
              <div class="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users class="h-8 w-8 text-purple-600" />
              </div>
              <h3 class="text-lg font-semibold text-gray-900 mb-2">No workspaces yet</h3>
              <p class="text-sm text-gray-500 mb-6">
                Get started by creating your first workspace
              </p>
              <Button @click="goToCreateTeam" class="bg-purple-600 hover:bg-purple-700">
                <Plus class="mr-2 h-4 w-4" />
                Create Your First Workspace
              </Button>
            </div>

            <!-- Workspaces List -->
            <div v-else class="divide-y divide-gray-100">
              <div class="px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ready to launch
              </div>
              
              <div
                v-for="team in teams"
                :key="team.id"
                class="px-6 py-4 flex items-center gap-4 hover:bg-gray-50 cursor-pointer transition-colors group"
                @click="selectTeam(team.id)"
              >
                <!-- Team Icon -->
                <div class="flex-shrink-0">
                  <div class="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-md">
                    <Users class="h-6 w-6 text-white" />
                  </div>
                </div>

                <!-- Team Info -->
                <div class="flex-1 min-w-0">
                  <h3 class="text-base font-semibold text-gray-900 truncate">
                    {{ team.name }}
                  </h3>
                  <div class="flex items-center gap-3 mt-1">
                    <!-- Member Avatars -->
                    <div class="flex -space-x-2">
                      <div 
                        v-for="i in Math.min(team.memberCount || 1, 3)" 
                        :key="i"
                        class="w-6 h-6 rounded-full bg-gray-300 border-2 border-white flex items-center justify-center"
                      >
                        <User class="h-3 w-3 text-gray-600" />
                      </div>
                    </div>
                    <span class="text-sm text-gray-500">
                      {{ team.memberCount || 0 }} member{{ team.memberCount !== 1 ? 's' : '' }}
                    </span>
                    <span v-if="team.role === 'manager'" class="text-xs text-purple-600 font-medium">
                      • Manager
                    </span>
                  </div>
                </div>

                <!-- Arrow -->
                <ArrowRight class="h-5 w-5 text-gray-400 group-hover:text-purple-600 transition-colors" />
              </div>
            </div>

            <!-- Create New Workspace Link -->
            <div class="px-6 py-4 border-t border-gray-100 bg-gray-50">
              <button 
                @click="goToCreateTeam"
                class="text-sm text-purple-600 hover:text-purple-800 font-medium hover:underline"
              >
                Create a new workspace
              </button>
            </div>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="space-y-4">
          <!-- User Info Card -->
          <div class="bg-white rounded-xl shadow-lg p-4">
            <div class="flex items-center gap-3 mb-3">
              <div class="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
                <span class="text-sm">📁</span>
              </div>
              <span class="font-medium text-gray-900 text-sm">{{ userName }}</span>
            </div>
          </div>

          <!-- Quick Stats -->
          <div class="bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl shadow-lg p-5 text-white">
            <div class="text-sm font-medium opacity-90 mb-1">Total Workspaces</div>
            <div class="text-3xl font-bold">{{ teams.length }}</div>
            <div class="text-xs opacity-75 mt-2">
              Manage your teams efficiently
            </div>
          </div>

          <!-- Get Started Card -->
          <div class="bg-white rounded-xl shadow-lg p-5">
            <h4 class="font-semibold text-gray-900 mb-2">Get started with a template</h4>
            <p class="text-sm text-gray-500 mb-4">
              Kickstart projects with one click.
            </p>
            <Button variant="outline" size="sm" class="w-full" @click="goToCreateTeam">
              Create Workspace
            </Button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
