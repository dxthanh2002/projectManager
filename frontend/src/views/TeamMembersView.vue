<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTeamStore } from '@/store/useTeamStore'
import { useTaskStore } from '@/store/useTaskStore'
import TeamSidebar from '@/components/TeamSidebar.vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Users, 
  Plus, 
  Loader2, 
  Trash2, 
  Mail,
  Crown,
  User,
  Hash,
  X,
  UserPlus
} from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const teamStore = useTeamStore()
const taskStore = useTaskStore()

const teamId = computed(() => route.params.teamId as string)
const members = computed(() => teamStore.members[teamId.value] || [])
const currentTeam = computed(() => teamStore.currentTeam)
const isLoading = computed(() => teamStore.isLoading)
const isManager = computed(() => currentTeam.value?.role === 'manager')

// Task count for sidebar
const taskCount = computed(() => {
  const tasks = taskStore.getTasksByTeam(teamId.value)
  return tasks?.length || 0
})

// Add member modal state
const showAddModal = ref(false)
const newMemberEmail = ref('')
const isAddingMember = ref(false)

// Member to remove (for confirmation)
const memberToRemove = ref<ITeamMember | null>(null)
const isRemovingMember = ref(false)

onMounted(async () => {
  await Promise.all([
    teamStore.fetchTeamDetails(teamId.value),
    teamStore.fetchTeamMembers(teamId.value),
    taskStore.fetchTasks(teamId.value)
  ])
})

const openAddModal = () => {
  newMemberEmail.value = ''
  showAddModal.value = true
}

const closeAddModal = () => {
  showAddModal.value = false
  newMemberEmail.value = ''
}

const handleAddMember = async () => {
  if (!newMemberEmail.value.trim()) return
  isAddingMember.value = true
  try {
    await teamStore.addTeamMember(teamId.value, newMemberEmail.value.trim())
    closeAddModal()
  } catch (error) {}
  finally { isAddingMember.value = false }
}

const confirmRemoveMember = (member: ITeamMember) => {
  memberToRemove.value = member
}

const cancelRemove = () => {
  memberToRemove.value = null
}

const handleRemoveMember = async () => {
  if (!memberToRemove.value) return
  isRemovingMember.value = true
  try {
    await teamStore.removeTeamMember(teamId.value, memberToRemove.value.id)
    memberToRemove.value = null
  } catch (error) {}
  finally { isRemovingMember.value = false }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}
</script>

<template>
  <div class="flex h-screen bg-white">
    <!-- Shared Sidebar -->
    <TeamSidebar 
      :team-id="teamId"
      :team-name="currentTeam?.name || 'Team'"
      :task-count="taskCount"
      :member-count="members.length"
      active-tab="members"
    />

    <!-- Main Content -->
    <div class="flex-1 flex flex-col">
      <!-- Header -->
      <div class="h-14 border-b border-gray-200 flex items-center justify-between px-6">
        <div class="flex items-center gap-2">
          <Hash class="h-5 w-5 text-gray-400" />
          <h1 class="text-lg font-semibold">Members</h1>
          <span class="text-sm text-gray-500">{{ members.length }} members</span>
        </div>
        <Button v-if="isManager" size="sm" @click="openAddModal" class="bg-purple-600 hover:bg-purple-700">
          <UserPlus class="h-4 w-4 mr-1" />
          Invite Teammate
        </Button>
      </div>

      <!-- Members List -->
      <div class="flex-1 overflow-y-auto p-6">
        <!-- Loading -->
        <div v-if="isLoading && members.length === 0" class="flex items-center justify-center h-64">
          <Loader2 class="h-8 w-8 animate-spin text-gray-400" />
        </div>

        <!-- Empty State -->
        <div v-else-if="members.length === 0" class="text-center py-16">
          <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users class="h-8 w-8 text-gray-400" />
          </div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">No members yet</h3>
          <p class="text-gray-500 mb-6">Add team members to get started</p>
          <Button v-if="isManager" @click="openAddModal" class="bg-purple-600 hover:bg-purple-700">
            <UserPlus class="h-4 w-4 mr-2" />
            Invite First Teammate
          </Button>
        </div>

        <!-- Members Table -->
        <div v-else class="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <table class="w-full">
            <thead class="bg-gray-50 border-b border-gray-200">
              <tr>
                <th class="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Member</th>
                <th class="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider w-32">Role</th>
                <th class="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider w-40">Joined</th>
                <th class="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider w-20">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr v-for="member in members" :key="member.id" class="hover:bg-gray-50">
                <td class="px-4 py-3">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <User class="h-5 w-5 text-gray-500" />
                    </div>
                    <div>
                      <div class="font-medium text-gray-900 flex items-center gap-2">
                        {{ member.name }}
                        <Crown v-if="member.role === 'manager'" class="h-4 w-4 text-yellow-500" />
                      </div>
                      <div class="text-sm text-gray-500 flex items-center gap-1">
                        <Mail class="h-3 w-3" />
                        {{ member.email }}
                      </div>
                    </div>
                  </div>
                </td>
                <td class="px-4 py-3">
                  <span :class="[
                    'text-xs px-2 py-1 rounded-full font-medium',
                    member.role === 'manager' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'
                  ]">
                    {{ member.role }}
                  </span>
                </td>
                <td class="px-4 py-3 text-sm text-gray-500">
                  {{ formatDate(member.joinedAt) }}
                </td>
                <td class="px-4 py-3 text-right">
                  <Button 
                    v-if="isManager && member.role !== 'manager'" 
                    variant="ghost" 
                    size="sm"
                    class="text-red-500 hover:text-red-700 hover:bg-red-50"
                    @click="confirmRemoveMember(member)"
                  >
                    <Trash2 class="h-4 w-4 mr-1" />
                    Remove
                  </Button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Add Member Modal -->
    <div v-if="showAddModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" @click.self="closeAddModal">
      <div class="bg-white rounded-lg w-full max-w-md mx-4 shadow-xl">
        <div class="flex items-center justify-between p-4 border-b">
          <h2 class="text-lg font-semibold">Invite Teammate</h2>
          <button @click="closeAddModal" class="text-gray-400 hover:text-gray-600">
            <X class="h-5 w-5" />
          </button>
        </div>
        <form @submit.prevent="handleAddMember" class="p-4 space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <Input v-model="newMemberEmail" type="email" placeholder="member@example.com" required :disabled="isAddingMember" />
          </div>
          <div class="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" @click="closeAddModal" :disabled="isAddingMember">Cancel</Button>
            <Button type="submit" :disabled="isAddingMember || !newMemberEmail.trim()" class="bg-purple-600 hover:bg-purple-700">
              <Loader2 v-if="isAddingMember" class="h-4 w-4 mr-2 animate-spin" />
              <UserPlus v-else class="h-4 w-4 mr-2" />
              Send Invite
            </Button>
          </div>
        </form>
      </div>
    </div>

    <!-- Remove Confirmation Modal -->
    <div v-if="memberToRemove" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" @click.self="cancelRemove">
      <div class="bg-white rounded-lg w-full max-w-md mx-4 shadow-xl">
        <div class="flex items-center justify-between p-4 border-b">
          <h2 class="text-lg font-semibold text-red-600">Remove Member</h2>
          <button @click="cancelRemove" class="text-gray-400 hover:text-gray-600">
            <X class="h-5 w-5" />
          </button>
        </div>
        <div class="p-4">
          <p class="text-gray-600 mb-6">
            Are you sure you want to remove <strong>{{ memberToRemove.name }}</strong> from this team? They will lose access to all team tasks.
          </p>
          <div class="flex justify-end gap-3">
            <Button variant="outline" @click="cancelRemove" :disabled="isRemovingMember">Cancel</Button>
            <Button variant="destructive" @click="handleRemoveMember" :disabled="isRemovingMember">
              <Loader2 v-if="isRemovingMember" class="h-4 w-4 mr-2 animate-spin" />
              Remove
            </Button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
