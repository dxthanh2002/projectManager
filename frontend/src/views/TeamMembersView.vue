<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTeamStore } from '@/store/useTeamStore'
import SidebarApp from '@/layouts/SiderBarApp.vue'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  Users, 
  Plus, 
  Loader2, 
  Trash2, 
  ArrowLeft,
  Mail,
  Crown
} from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const teamStore = useTeamStore()

const teamId = computed(() => route.params.teamId as string)
const members = computed(() => teamStore.members[teamId.value] || [])
const currentTeam = computed(() => teamStore.currentTeam)
const isLoading = computed(() => teamStore.isLoading)
const isManager = computed(() => currentTeam.value?.role === 'manager')

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
    teamStore.fetchTeamMembers(teamId.value)
  ])
})

const goBack = () => {
  router.push('/dashboard')
}

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
  } catch (error) {
    // Error already handled by store
  } finally {
    isAddingMember.value = false
  }
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
  } catch (error) {
    // Error already handled by store
  } finally {
    isRemovingMember.value = false
  }
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
  <SidebarApp>
    <div class="flex flex-1 flex-col gap-4 p-4 pt-0">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <Button variant="ghost" size="icon" @click="goBack">
            <ArrowLeft class="h-5 w-5" />
          </Button>
          <div>
            <h1 class="text-3xl font-bold tracking-tight">
              {{ currentTeam?.name || 'Team' }} Members
            </h1>
            <p class="text-muted-foreground">
              Manage team members and their roles
            </p>
          </div>
        </div>
        <Button v-if="isManager" @click="openAddModal">
          <Plus class="mr-2 h-4 w-4" />
          Add Member
        </Button>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading && members.length === 0" class="flex items-center justify-center min-h-[400px]">
        <Loader2 class="h-8 w-8 animate-spin text-muted-foreground" />
      </div>

      <!-- Empty State -->
      <div v-else-if="members.length === 0" class="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Users class="h-16 w-16 text-muted-foreground" />
        <div class="text-center">
          <h3 class="text-lg font-semibold">No members yet</h3>
          <p class="text-sm text-muted-foreground mb-4">
            Add team members to get started
          </p>
          <Button v-if="isManager" @click="openAddModal">
            <Plus class="mr-2 h-4 w-4" />
            Add First Member
          </Button>
        </div>
      </div>

      <!-- Members List -->
      <div v-else class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card
          v-for="member in members"
          :key="member.id"
          class="transition-all hover:shadow-md"
        >
          <CardHeader>
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <CardTitle class="text-lg flex items-center gap-2">
                  {{ member.name }}
                  <Crown v-if="member.role === 'manager'" class="h-4 w-4 text-yellow-500" />
                </CardTitle>
                <CardDescription class="flex items-center gap-1 mt-1">
                  <Mail class="h-3 w-3" />
                  {{ member.email }}
                </CardDescription>
              </div>
              <Badge :variant="member.role === 'manager' ? 'default' : 'secondary'">
                {{ member.role }}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div class="flex items-center justify-between">
              <span class="text-xs text-muted-foreground">
                Joined {{ formatDate(member.joinedAt) }}
              </span>
              <Button 
                v-if="isManager && member.role !== 'manager'" 
                variant="ghost" 
                size="sm"
                class="text-destructive hover:text-destructive hover:bg-destructive/10"
                @click="confirmRemoveMember(member)"
              >
                <Trash2 class="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- Add Member Modal -->
      <div 
        v-if="showAddModal" 
        class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        @click.self="closeAddModal"
      >
        <Card class="w-full max-w-md mx-4">
          <CardHeader>
            <CardTitle>Add Team Member</CardTitle>
            <CardDescription>
              Enter the email address of the user you want to add
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form @submit.prevent="handleAddMember" class="space-y-4">
              <div class="space-y-2">
                <label class="text-sm font-medium">Email Address</label>
                <Input 
                  v-model="newMemberEmail"
                  type="email"
                  placeholder="member@example.com"
                  required
                  :disabled="isAddingMember"
                />
              </div>
              <div class="flex gap-2 justify-end">
                <Button type="button" variant="outline" @click="closeAddModal" :disabled="isAddingMember">
                  Cancel
                </Button>
                <Button type="submit" :disabled="isAddingMember || !newMemberEmail.trim()">
                  <Loader2 v-if="isAddingMember" class="mr-2 h-4 w-4 animate-spin" />
                  Add Member
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      <!-- Remove Confirmation Modal -->
      <div 
        v-if="memberToRemove" 
        class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        @click.self="cancelRemove"
      >
        <Card class="w-full max-w-md mx-4">
          <CardHeader>
            <CardTitle class="text-destructive">Remove Member</CardTitle>
            <CardDescription>
              Are you sure you want to remove {{ memberToRemove.name }} from this team?
              They will lose access to all team tasks.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div class="flex gap-2 justify-end">
              <Button variant="outline" @click="cancelRemove" :disabled="isRemovingMember">
                Cancel
              </Button>
              <Button variant="destructive" @click="handleRemoveMember" :disabled="isRemovingMember">
                <Loader2 v-if="isRemovingMember" class="mr-2 h-4 w-4 animate-spin" />
                Remove
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </SidebarApp>
</template>
