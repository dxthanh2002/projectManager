<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTeamStore } from '@/store/useTeamStore'
import { useTaskStore } from '@/store/useTaskStore'
import { authClient } from '@/lib/auth-client'
import CommentList from '@/components/comments/CommentList.vue'
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
import { useToast } from 'vue-toast-notification'
import { 
  ListTodo, 
  Plus, 
  Loader2, 
  ArrowLeft,
  Calendar,
  User,
  CheckCircle2,
  Clock,
  Ban,
  X
} from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const teamStore = useTeamStore()
const taskStore = useTaskStore()


const teamId = computed(() => route.params.teamId as string)
const tasks = computed(() => taskStore.getTasksByTeam(teamId.value))
const currentTeam = computed(() => teamStore.currentTeam)
const isLoading = computed(() => taskStore.isLoading || teamStore.isLoading)
const isManager = computed(() => currentTeam.value?.role === 'manager')
const members = computed(() => teamStore.members[teamId.value] || [])

// Get current user session for assignee check
const session = authClient.useSession()
const currentUserId = computed(() => session.value?.data?.user?.id || null)

// Check if current user is the assignee of selected task
const isAssignee = computed(() => {
  if (!selectedTask.value || !currentUserId.value) return false
  return selectedTask.value.assigneeId === currentUserId.value
})

// Can edit task: manager or assignee
const canEditTask = computed(() => isManager.value || isAssignee.value)

// Create task modal state
const showCreateModal = ref(false)
const isCreating = ref(false)
const newTask = ref<ICreateTask>({
  title: '',
  description: '',
  priority: 'medium',
  dueDate: null,
  assigneeId: null,
})

// Task detail modal state
const selectedTask = ref<ITask | null>(null)

// Filter state
const statusFilter = ref('')
const priorityFilter = ref('')

onMounted(async () => {
  await Promise.all([
    teamStore.fetchTeamDetails(teamId.value),
    teamStore.fetchTeamMembers(teamId.value),
    taskStore.fetchTasks(teamId.value)
  ])
})

// Watch for filter changes
watch([statusFilter, priorityFilter], () => {
  const filters: any = {}
  if (statusFilter.value) filters.status = statusFilter.value
  if (priorityFilter.value) filters.priority = priorityFilter.value
  taskStore.fetchTasks(teamId.value, filters)
})

const goBack = () => {
  router.push('/dashboard')
}

const openCreateModal = () => {
  newTask.value = {
    title: '',
    description: '',
    priority: 'medium',
    dueDate: null,
    assigneeId: null,
  }
  showCreateModal.value = true
}

const closeCreateModal = () => {
  showCreateModal.value = false
}

const handleCreateTask = async () => {
  if (!newTask.value.title.trim()) return
  
  isCreating.value = true
  try {
    await taskStore.createTask(teamId.value, {
      title: newTask.value.title.trim(),
      description: newTask.value.description?.trim() || null,
      priority: newTask.value.priority,
      dueDate: newTask.value.dueDate || null,
      assigneeId: newTask.value.assigneeId || null,
    })
    closeCreateModal()
  } catch (error) {
    // Error handled by store
  } finally {
    isCreating.value = false
  }
}

const openTaskDetail = (task: ITask) => {
  selectedTask.value = task
  isEditMode.value = false
}

const closeTaskDetail = () => {
  selectedTask.value = null
  isEditMode.value = false
  showDeleteConfirm.value = false
}

// Edit mode state
const isEditMode = ref(false)
const isUpdating = ref(false)
const editTask = ref<any>({
  title: '',
  description: '',
  priority: 'medium',
  status: 'todo',
  dueDate: null,
  assigneeId: null,
  blockerComment: '', // Comment required when status = blocked
})

// Delete confirmation state
const showDeleteConfirm = ref(false)
const isDeleting = ref(false)

const openEditMode = () => {
  if (!selectedTask.value) return
  editTask.value = {
    title: selectedTask.value.title,
    description: selectedTask.value.description || '',
    priority: selectedTask.value.priority,
    status: selectedTask.value.status,
    dueDate: selectedTask.value.dueDate,
    assigneeId: selectedTask.value.assigneeId,
    blockerComment: '', // Reset comment
  }
  isEditMode.value = true
}

const cancelEdit = () => {
  isEditMode.value = false
}

const handleUpdateTask = async () => {
  if (!selectedTask.value || !editTask.value.title.trim()) return
  
  // Blocker validation: require comment when status = blocked
  if (editTask.value.status === 'blocked' && !editTask.value.blockerComment?.trim()) {
    const toast = useToast()
    toast.error('Comment is required when marking task as blocked')
    return
  }
  
  isUpdating.value = true
  try {
    // If status changed to blocked, use status endpoint with comment
    if (editTask.value.status === 'blocked' && selectedTask.value.status !== 'blocked') {
      await taskStore.updateTaskStatus(
        teamId.value, 
        selectedTask.value.id, 
        editTask.value.status,
        editTask.value.blockerComment?.trim()
      )
    }
    
    // Update other task fields
    await taskStore.updateTask(teamId.value, selectedTask.value.id, {
      title: editTask.value.title.trim(),
      description: editTask.value.description?.trim() || null,
      priority: editTask.value.priority,
      status: editTask.value.status,
      dueDate: editTask.value.dueDate || null,
      assigneeId: editTask.value.assigneeId || null,
    })
    closeTaskDetail()
  } catch (error) {
    // Error handled by store
  } finally {
    isUpdating.value = false
  }
}

const handleDeleteTask = async () => {
  if (!selectedTask.value) return
  
  isDeleting.value = true
  try {
    await taskStore.deleteTask(teamId.value, selectedTask.value.id)
    closeTaskDetail()
  } catch (error) {
    // Error handled by store
  } finally {
    isDeleting.value = false
  }
}

const formatDate = (dateString: string | null) => {
  if (!dateString) return 'No due date'
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const formatDateTime = (dateString: string) => {
  return new Date(dateString).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'todo': return Clock
    case 'in_progress': return Loader2
    case 'done': return CheckCircle2
    case 'blocked': return Ban
    default: return Clock
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'todo': return 'secondary'
    case 'in_progress': return 'default'
    case 'done': return 'default'
    case 'blocked': return 'destructive'
    default: return 'secondary'
  }
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high': return 'destructive'
    case 'medium': return 'default'
    case 'low': return 'secondary'
    default: return 'secondary'
  }
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
              {{ currentTeam?.name || 'Team' }} Tasks
            </h1>
            <p class="text-muted-foreground">
              Manage and track team tasks
            </p>
          </div>
        </div>
        <Button v-if="isManager" @click="openCreateModal">
          <Plus class="mr-2 h-4 w-4" />
          Create Task
        </Button>
      </div>

      <!-- Filters -->
      <div class="flex gap-4 flex-wrap items-center">

        <select 
          v-model="statusFilter" 
          class="px-3 py-2 border rounded-md bg-background text-sm"
        >
          <option value="">All Status</option>
          <option value="todo">To Do</option>
          <option value="in_progress">In Progress</option>
          <option value="done">Done</option>
          <option value="blocked">Blocked</option>
        </select>
        <select 
          v-model="priorityFilter" 
          class="px-3 py-2 border rounded-md bg-background text-sm"
        >
          <option value="">All Priority</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading && tasks.length === 0" class="flex items-center justify-center min-h-[400px]">
        <Loader2 class="h-8 w-8 animate-spin text-muted-foreground" />
      </div>

      <!-- Empty State -->
      <div v-else-if="tasks.length === 0" class="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <ListTodo class="h-16 w-16 text-muted-foreground" />
        <div class="text-center">
          <h3 class="text-lg font-semibold">No tasks yet</h3>
          <p class="text-sm text-muted-foreground mb-4">
            Create your first task to get started
          </p>
          <Button v-if="isManager" @click="openCreateModal">
            <Plus class="mr-2 h-4 w-4" />
            Create First Task
          </Button>
        </div>
      </div>

      <!-- Tasks Grid -->
      <div v-else class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card
          v-for="task in tasks"
          :key="task.id"
          class="transition-all hover:shadow-md cursor-pointer"
          @click="openTaskDetail(task)"
        >
          <CardHeader class="pb-2">
            <div class="flex items-start justify-between gap-2">
              <CardTitle class="text-lg line-clamp-2">{{ task.title }}</CardTitle>
              <Badge :variant="getStatusColor(task.status)" :class="['shrink-0', task.status === 'blocked' ? 'text-white' : '']">
                <component :is="getStatusIcon(task.status)" class="h-3 w-3 mr-1" />
                {{ task.status.replace('_', ' ') }}
              </Badge>
            </div>
            <CardDescription v-if="task.description" class="line-clamp-2">
              {{ task.description }}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div class="flex flex-wrap gap-2 mb-3">
              <Badge :variant="getPriorityColor(task.priority)" :class="['text-xs', task.priority === 'high' ? 'text-white' : '']">
                {{ task.priority }}
              </Badge>
            </div>
            <div class="flex items-center justify-between text-xs text-muted-foreground">
              <div class="flex items-center gap-1">
                <User class="h-3 w-3" />
                <span>{{ task.assignee?.name || 'Unassigned' }}</span>
              </div>
              <div class="flex items-center gap-1">
                <Calendar class="h-3 w-3" />
                <span>{{ formatDate(task.dueDate) }}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- Create Task Modal -->
      <div 
        v-if="showCreateModal" 
        class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        @click.self="closeCreateModal"
      >
        <Card class="w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
          <CardHeader>
            <CardTitle>Create New Task</CardTitle>
            <CardDescription>
              Fill in the details to create a new task
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form @submit.prevent="handleCreateTask" class="space-y-4">
              <div class="space-y-2">
                <label class="text-sm font-medium">Title *</label>
                <Input 
                  v-model="newTask.title"
                  placeholder="Task title"
                  required
                  :disabled="isCreating"
                />
              </div>

              <div class="space-y-2">
                <label class="text-sm font-medium">Description</label>
                <textarea 
                  v-model="newTask.description"
                  placeholder="Task description (optional)"
                  class="w-full px-3 py-2 border rounded-md bg-background text-sm min-h-[80px] resize-none"
                  :disabled="isCreating"
                ></textarea>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-2">
                  <label class="text-sm font-medium">Priority</label>
                  <select 
                    v-model="newTask.priority"
                    class="w-full px-3 py-2 border rounded-md bg-background text-sm"
                    :disabled="isCreating"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div class="space-y-2">
                  <label class="text-sm font-medium">Due Date</label>
                  <input 
                    v-model="newTask.dueDate"
                    type="date"
                    class="w-full px-3 py-2 border rounded-md bg-background text-sm"
                    :disabled="isCreating"
                  />
                </div>
              </div>

              <div class="space-y-2">
                <label class="text-sm font-medium">Assignee</label>
                <select 
                  v-model="newTask.assigneeId"
                  class="w-full px-3 py-2 border rounded-md bg-background text-sm"
                  :disabled="isCreating"
                >
                  <option :value="null">Unassigned</option>
                  <option v-for="member in members" :key="member.id" :value="member.id">
                    {{ member.name }} ({{ member.email }})
                  </option>
                </select>
              </div>

              <div class="flex gap-2 justify-end pt-4">
                <Button type="button" variant="outline" @click="closeCreateModal" :disabled="isCreating">
                  Cancel
                </Button>
                <Button type="submit" :disabled="isCreating || !newTask.title.trim()">
                  <Loader2 v-if="isCreating" class="mr-2 h-4 w-4 animate-spin" />
                  Create Task
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      <!-- Task Detail Modal -->
      <div 
        v-if="selectedTask" 
        class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        @click.self="closeTaskDetail"
      >
        <Card class="w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
          <CardHeader>
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <CardTitle class="text-xl">{{ selectedTask.title }}</CardTitle>
                <div class="flex gap-2 mt-2">
                  <Badge :variant="getStatusColor(selectedTask.status)" :class="selectedTask.status === 'blocked' ? 'text-white' : ''">
                    <component :is="getStatusIcon(selectedTask.status)" class="h-3 w-3 mr-1" />
                    {{ selectedTask.status.replace('_', ' ') }}
                  </Badge>
                  <Badge :variant="getPriorityColor(selectedTask.priority)" :class="selectedTask.priority === 'high' ? 'text-white' : ''">
                    {{ selectedTask.priority }}
                  </Badge>
                </div>
              </div>
              <Button variant="ghost" size="icon" @click="closeTaskDetail">
                <X class="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent class="space-y-4">
            <!-- View Mode -->
            <template v-if="!isEditMode">
              <div v-if="selectedTask.description">
                <h4 class="text-sm font-medium text-muted-foreground mb-1">Description</h4>
                <p class="text-sm whitespace-pre-wrap">{{ selectedTask.description }}</p>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <h4 class="text-sm font-medium text-muted-foreground mb-1">Assignee</h4>
                  <div class="flex items-center gap-2">
                    <User class="h-4 w-4 text-muted-foreground" />
                    <span class="text-sm">{{ selectedTask.assignee?.name || 'Unassigned' }}</span>
                  </div>
                </div>
                <div>
                  <h4 class="text-sm font-medium text-muted-foreground mb-1">Due Date</h4>
                  <div class="flex items-center gap-2">
                    <Calendar class="h-4 w-4 text-muted-foreground" />
                    <span class="text-sm">{{ formatDate(selectedTask.dueDate) }}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 class="text-sm font-medium text-muted-foreground mb-1">Created</h4>
                <span class="text-sm">{{ formatDateTime(selectedTask.createdAt) }}</span>
              </div>

              <!-- Comments Section -->
              <div class="border-t pt-4 mt-4">
                <CommentList 
                  :task-id="selectedTask.id" 
                  :is-manager="isManager" 
                />
              </div>

              <!-- Action Buttons -->
              <div class="flex justify-between pt-2">
                <div class="flex gap-2">
                  <Button v-if="canEditTask" variant="outline" @click="openEditMode">
                    Edit
                  </Button>
                  <Button v-if="isManager" variant="destructive" @click="showDeleteConfirm = true" class="text-white">
                    Delete
                  </Button>
                </div>
                <Button variant="outline" @click="closeTaskDetail">
                  Close
                </Button>
              </div>

              <!-- Delete Confirmation -->
              <div v-if="showDeleteConfirm" class="p-4 bg-destructive/10 rounded-lg">
                <p class="text-sm font-medium mb-3">Are you sure you want to delete this task?</p>
                <div class="flex gap-2">
                  <Button variant="destructive" size="sm" @click="handleDeleteTask" :disabled="isDeleting" class="text-white">
                    <Loader2 v-if="isDeleting" class="mr-2 h-4 w-4 animate-spin" />
                    Yes, Delete
                  </Button>
                  <Button variant="outline" size="sm" @click="showDeleteConfirm = false" :disabled="isDeleting">
                    Cancel
                  </Button>
                </div>
              </div>
            </template>

            <!-- Edit Mode -->
            <template v-else>
              <form @submit.prevent="handleUpdateTask" class="space-y-4">
                <div class="space-y-2">
                  <label class="text-sm font-medium">Title *</label>
                  <Input 
                    v-model="editTask.title"
                    placeholder="Task title"
                    required
                    :disabled="isUpdating"
                  />
                </div>

                <div class="space-y-2">
                  <label class="text-sm font-medium">Description</label>
                  <textarea 
                    v-model="editTask.description"
                    placeholder="Task description (optional)"
                    class="w-full px-3 py-2 border rounded-md bg-background text-sm min-h-[80px] resize-none"
                    :disabled="isUpdating"
                  ></textarea>
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div class="space-y-2">
                    <label class="text-sm font-medium">Status</label>
                    <select 
                      v-model="editTask.status"
                      class="w-full px-3 py-2 border rounded-md bg-background text-sm"
                      :disabled="isUpdating"
                    >
                      <option value="todo">To Do</option>
                      <option value="in_progress">In Progress</option>
                      <option value="done">Done</option>
                      <option value="blocked">Blocked</option>
                    </select>
                  </div>

                  <div class="space-y-2">
                    <label class="text-sm font-medium">Priority</label>
                    <select 
                      v-model="editTask.priority"
                      class="w-full px-3 py-2 border rounded-md bg-background text-sm"
                      :disabled="isUpdating"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>

                <!-- Blocker Comment (required when status = blocked) -->
                <div v-if="editTask.status === 'blocked'" class="space-y-2 p-3 border border-destructive/30 rounded-lg bg-destructive/5">
                  <label class="text-sm font-medium text-destructive">Blocker Comment *</label>
                  <textarea 
                    v-model="editTask.blockerComment"
                    placeholder="Explain why this task is blocked..."
                    class="w-full px-3 py-2 border border-destructive/30 rounded-md bg-background text-sm min-h-[80px] resize-none"
                    :disabled="isUpdating"
                    required
                  ></textarea>
                  <p class="text-xs text-muted-foreground">A comment is required when marking a task as blocked.</p>
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div class="space-y-2">
                    <label class="text-sm font-medium">Due Date</label>
                    <input 
                      v-model="editTask.dueDate"
                      type="date"
                      class="w-full px-3 py-2 border rounded-md bg-background text-sm"
                      :disabled="isUpdating"
                    />
                  </div>
                  
                  <div class="space-y-2">
                    <label class="text-sm font-medium">Assignee</label>
                    <select 
                      v-model="editTask.assigneeId"
                      class="w-full px-3 py-2 border rounded-md bg-background text-sm"
                      :disabled="isUpdating"
                    >
                      <option :value="null">Unassigned</option>
                      <option v-for="member in members" :key="member.id" :value="member.id">
                        {{ member.name }} ({{ member.email }})
                      </option>
                    </select>
                  </div>
                </div>

                <div class="flex gap-2 justify-end pt-4">
                  <Button type="button" variant="outline" @click="cancelEdit" :disabled="isUpdating">
                    Cancel
                  </Button>
                  <Button type="submit" :disabled="isUpdating || !editTask.title.trim()">
                    <Loader2 v-if="isUpdating" class="mr-2 h-4 w-4 animate-spin" />
                    Save Changes
                  </Button>
                </div>
              </form>
            </template>
          </CardContent>
        </Card>
      </div>
    </div>
  </SidebarApp>
</template>
