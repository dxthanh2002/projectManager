<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTeamStore } from '@/store/useTeamStore'
import { useTaskStore } from '@/store/useTaskStore'
import { authClient } from '@/lib/auth-client'
import CommentList from '@/components/comments/CommentList.vue'
import TeamSidebar from '@/components/TeamSidebar.vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from 'vue-toast-notification'
import { 
  ListTodo, 
  Plus, 
  Loader2, 
  Calendar,
  User,
  CheckCircle2,
  Clock,
  Ban,
  X,
  Hash
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

// Get current user session
const session = authClient.useSession()
const currentUserId = computed(() => session.value?.data?.user?.id || null)

// Task selection
const selectedTask = ref<ITask | null>(null)
const isAssignee = computed(() => {
  if (!selectedTask.value || !currentUserId.value) return false
  return selectedTask.value.assigneeId === currentUserId.value
})
const canEditTask = computed(() => isManager.value || isAssignee.value)

// Create task modal
const showCreateModal = ref(false)
const isCreating = ref(false)
const newTask = ref<ICreateTask>({
  title: '',
  description: '',
  priority: 'medium',
  dueDate: null,
  assigneeId: null,
})

// Filter state
const statusFilter = ref('')
const priorityFilter = ref('')
const assigneeFilter = ref('')

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
  blockerComment: '',
})

// Delete state
const showDeleteConfirm = ref(false)
const isDeleting = ref(false)

onMounted(async () => {
  await Promise.all([
    teamStore.fetchTeamDetails(teamId.value),
    teamStore.fetchTeamMembers(teamId.value),
    taskStore.fetchTasks(teamId.value)
  ])
})

watch([statusFilter, priorityFilter, assigneeFilter], () => {
  const filters: any = {}
  if (statusFilter.value) filters.status = statusFilter.value
  if (priorityFilter.value) filters.priority = priorityFilter.value
  if (assigneeFilter.value) filters.assigneeId = assigneeFilter.value
  taskStore.fetchTasks(teamId.value, filters)
})

const openCreateModal = () => {
  newTask.value = { title: '', description: '', priority: 'medium', dueDate: null, assigneeId: null }
  showCreateModal.value = true
}

const closeCreateModal = () => { showCreateModal.value = false }

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
  } catch (error) {}
  finally { isCreating.value = false }
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

const openEditMode = () => {
  if (!selectedTask.value) return
  editTask.value = {
    title: selectedTask.value.title,
    description: selectedTask.value.description || '',
    priority: selectedTask.value.priority,
    status: selectedTask.value.status,
    dueDate: selectedTask.value.dueDate,
    assigneeId: selectedTask.value.assigneeId,
    blockerComment: '',
  }
  isEditMode.value = true
}

const cancelEdit = () => { isEditMode.value = false }

const handleUpdateTask = async () => {
  if (!selectedTask.value || !editTask.value.title.trim()) return
  if (editTask.value.status === 'blocked' && !editTask.value.blockerComment?.trim()) {
    const toast = useToast()
    toast.error('Comment required for blocked status')
    return
  }
  isUpdating.value = true
  try {
    if (editTask.value.status === 'blocked' && selectedTask.value.status !== 'blocked') {
      await taskStore.updateTaskStatus(teamId.value, selectedTask.value.id, editTask.value.status, editTask.value.blockerComment?.trim())
    }
    await taskStore.updateTask(teamId.value, selectedTask.value.id, {
      title: editTask.value.title.trim(),
      description: editTask.value.description?.trim() || null,
      priority: editTask.value.priority,
      status: editTask.value.status,
      dueDate: editTask.value.dueDate || null,
      assigneeId: editTask.value.assigneeId || null,
    })
    closeTaskDetail()
  } catch (error) {}
  finally { isUpdating.value = false }
}

const handleDeleteTask = async () => {
  if (!selectedTask.value) return
  isDeleting.value = true
  try {
    await taskStore.deleteTask(teamId.value, selectedTask.value.id)
    closeTaskDetail()
  } catch (error) {}
  finally { isDeleting.value = false }
}

const formatDate = (dateString: string | null) => {
  if (!dateString) return 'No due date'
  return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
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
    case 'todo': return 'text-gray-500'
    case 'in_progress': return 'text-blue-500'
    case 'done': return 'text-green-500'
    case 'blocked': return 'text-red-500'
    default: return 'text-gray-500'
  }
}

const getPriorityBadge = (priority: string) => {
  switch (priority) {
    case 'high': return 'bg-red-100 text-red-700'
    case 'medium': return 'bg-yellow-100 text-yellow-700'
    case 'low': return 'bg-gray-100 text-gray-600'
    default: return 'bg-gray-100 text-gray-600'
  }
}

// Task counts by status
const taskCounts = computed(() => ({
  all: tasks.value.length,
  todo: tasks.value.filter(t => t.status === 'todo').length,
  in_progress: tasks.value.filter(t => t.status === 'in_progress').length,
  done: tasks.value.filter(t => t.status === 'done').length,
  blocked: tasks.value.filter(t => t.status === 'blocked').length,
}))
</script>

<template>
  <div class="flex h-screen bg-white">
    <!-- Shared Sidebar -->
    <TeamSidebar 
      :team-id="teamId"
      :team-name="currentTeam?.name || 'Team'"
      :task-count="tasks.length"
      :member-count="members.length"
      active-tab="tasks"
    >
      <!-- Status Filters Slot -->
      <template #filters>
        <div class="p-2 border-t border-gray-700">
          <div class="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Status
          </div>
          <button 
            v-for="(count, status) in { all: taskCounts.all, todo: taskCounts.todo, in_progress: taskCounts.in_progress, done: taskCounts.done, blocked: taskCounts.blocked }"
            :key="status"
            @click="statusFilter = status === 'all' ? '' : status"
            :class="[
              'flex items-center gap-3 px-3 py-1.5 rounded-md w-full text-left text-sm',
              (statusFilter === status || (status === 'all' && statusFilter === '')) 
                ? 'bg-gray-800 text-white' 
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            ]"
          >
            <Hash class="h-4 w-4" />
            <span class="capitalize">{{ status === 'in_progress' ? 'In Progress' : status }}</span>
            <span class="ml-auto text-xs">{{ count }}</span>
          </button>
        </div>
      </template>
    </TeamSidebar>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col">
      <!-- Header -->
      <div class="h-14 border-b border-gray-200 flex items-center justify-between px-6">
        <div class="flex items-center gap-2">
          <Hash class="h-5 w-5 text-gray-400" />
          <h1 class="text-lg font-semibold">Tasks</h1>
          <span class="text-sm text-gray-500">{{ taskCounts.all }} tasks</span>
        </div>
        <div class="flex items-center gap-3">
          <!-- Filters -->
          <select v-model="priorityFilter" class="text-sm border border-gray-300 rounded-md px-3 py-1.5 bg-white">
            <option value="">All Priority</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          <select v-model="assigneeFilter" class="text-sm border border-gray-300 rounded-md px-3 py-1.5 bg-white">
            <option value="">All Members</option>
            <option v-for="member in members" :key="member.id" :value="member.id">{{ member.name }}</option>
          </select>
          <Button v-if="isManager" size="sm" @click="openCreateModal">
            <Plus class="h-4 w-4 mr-1" />
            New Task
          </Button>
        </div>
      </div>

      <!-- Task List -->
      <div class="flex-1 overflow-y-auto p-6">
        <!-- Loading -->
        <div v-if="isLoading && tasks.length === 0" class="flex items-center justify-center h-64">
          <Loader2 class="h-8 w-8 animate-spin text-gray-400" />
        </div>

        <!-- Empty State -->
        <div v-else-if="tasks.length === 0" class="text-center py-16">
          <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ListTodo class="h-8 w-8 text-gray-400" />
          </div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">No tasks yet</h3>
          <p class="text-gray-500 mb-6">Get started by creating your first task</p>
          <Button v-if="isManager" @click="openCreateModal">
            <Plus class="h-4 w-4 mr-2" />
            Create Task
          </Button>
        </div>

        <!-- Task Table -->
        <div v-else class="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <table class="w-full">
            <thead class="bg-gray-50 border-b border-gray-200">
              <tr>
                <th class="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Task</th>
                <th class="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider w-28">Status</th>
                <th class="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider w-24">Priority</th>
                <th class="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider w-36">Assignee</th>
                <th class="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider w-28">Due Date</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr 
                v-for="task in tasks" 
                :key="task.id" 
                class="hover:bg-gray-50 cursor-pointer transition-colors"
                @click="openTaskDetail(task)"
              >
                <td class="px-4 py-3">
                  <div class="font-medium text-gray-900">{{ task.title }}</div>
                  <div v-if="task.description" class="text-sm text-gray-500 truncate max-w-md">{{ task.description }}</div>
                </td>
                <td class="px-4 py-3">
                  <div class="flex items-center gap-2">
                    <component :is="getStatusIcon(task.status)" :class="['h-4 w-4', getStatusColor(task.status)]" />
                    <span class="text-sm capitalize">{{ task.status.replace('_', ' ') }}</span>
                  </div>
                </td>
                <td class="px-4 py-3">
                  <span :class="['text-xs px-2 py-1 rounded-full font-medium', getPriorityBadge(task.priority)]">
                    {{ task.priority }}
                  </span>
                </td>
                <td class="px-4 py-3">
                  <div class="flex items-center gap-2">
                    <div class="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                      <User class="h-3 w-3 text-gray-500" />
                    </div>
                    <span class="text-sm text-gray-600">{{ task.assignee?.name || 'Unassigned' }}</span>
                  </div>
                </td>
                <td class="px-4 py-3 text-sm text-gray-500">
                  {{ formatDate(task.dueDate) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Create Task Modal -->
    <div v-if="showCreateModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" @click.self="closeCreateModal">
      <div class="bg-white rounded-lg w-full max-w-lg mx-4 shadow-xl">
        <div class="flex items-center justify-between p-4 border-b">
          <h2 class="text-lg font-semibold">Create New Task</h2>
          <button @click="closeCreateModal" class="text-gray-400 hover:text-gray-600">
            <X class="h-5 w-5" />
          </button>
        </div>
        <form @submit.prevent="handleCreateTask" class="p-4 space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Title *</label>
            <Input v-model="newTask.title" placeholder="Task title" required />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea v-model="newTask.description" placeholder="Description (optional)" class="w-full border rounded-md px-3 py-2 text-sm min-h-[80px]"></textarea>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Priority</label>
              <select v-model="newTask.priority" class="w-full border rounded-md px-3 py-2 text-sm">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
              <input v-model="newTask.dueDate" type="date" class="w-full border rounded-md px-3 py-2 text-sm" />
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Assignee</label>
            <select v-model="newTask.assigneeId" class="w-full border rounded-md px-3 py-2 text-sm">
              <option :value="null">Unassigned</option>
              <option v-for="member in members" :key="member.id" :value="member.id">{{ member.name }}</option>
            </select>
          </div>
          <div class="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" @click="closeCreateModal">Cancel</Button>
            <Button type="submit" :disabled="isCreating || !newTask.title.trim()">
              <Loader2 v-if="isCreating" class="h-4 w-4 mr-2 animate-spin" />
              Create Task
            </Button>
          </div>
        </form>
      </div>
    </div>

    <!-- Task Detail Modal -->
    <div v-if="selectedTask" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" @click.self="closeTaskDetail">
      <div class="bg-white rounded-lg w-full max-w-lg mx-4 shadow-xl max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between p-4 border-b sticky top-0 bg-white">
          <h2 class="text-lg font-semibold">{{ selectedTask.title }}</h2>
          <button @click="closeTaskDetail" class="text-gray-400 hover:text-gray-600">
            <X class="h-5 w-5" />
          </button>
        </div>
        
        <!-- View Mode -->
        <div v-if="!isEditMode" class="p-4 space-y-4">
          <div class="flex gap-2">
            <span :class="['text-xs px-2 py-1 rounded-full font-medium', getPriorityBadge(selectedTask.priority)]">{{ selectedTask.priority }}</span>
            <span :class="['text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1', getStatusColor(selectedTask.status), 'bg-gray-100']">
              <component :is="getStatusIcon(selectedTask.status)" class="h-3 w-3" />
              {{ selectedTask.status.replace('_', ' ') }}
            </span>
          </div>
          
          <div v-if="selectedTask.description">
            <h4 class="text-sm font-medium text-gray-500 mb-1">Description</h4>
            <p class="text-sm whitespace-pre-wrap">{{ selectedTask.description }}</p>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <h4 class="text-sm font-medium text-gray-500 mb-1">Assignee</h4>
              <div class="flex items-center gap-2">
                <User class="h-4 w-4 text-gray-400" />
                <span class="text-sm">{{ selectedTask.assignee?.name || 'Unassigned' }}</span>
              </div>
            </div>
            <div>
              <h4 class="text-sm font-medium text-gray-500 mb-1">Due Date</h4>
              <div class="flex items-center gap-2">
                <Calendar class="h-4 w-4 text-gray-400" />
                <span class="text-sm">{{ formatDate(selectedTask.dueDate) }}</span>
              </div>
            </div>
          </div>

          <!-- Comments -->
          <div class="border-t pt-4">
            <CommentList :task-id="selectedTask.id" :is-manager="isManager" />
          </div>

          <!-- Actions -->
          <div class="flex justify-between pt-4 border-t">
            <div class="flex gap-2">
              <Button v-if="canEditTask" variant="outline" size="sm" @click="openEditMode">Edit</Button>
              <Button v-if="isManager" variant="destructive" size="sm" @click="showDeleteConfirm = true">Delete</Button>
            </div>
            <Button variant="outline" size="sm" @click="closeTaskDetail">Close</Button>
          </div>

          <!-- Delete Confirmation -->
          <div v-if="showDeleteConfirm" class="p-3 bg-red-50 rounded-lg">
            <p class="text-sm font-medium mb-2">Delete this task?</p>
            <div class="flex gap-2">
              <Button size="sm" variant="destructive" @click="handleDeleteTask" :disabled="isDeleting">
                <Loader2 v-if="isDeleting" class="h-4 w-4 mr-1 animate-spin" />
                Yes, Delete
              </Button>
              <Button size="sm" variant="outline" @click="showDeleteConfirm = false">Cancel</Button>
            </div>
          </div>
        </div>

        <!-- Edit Mode -->
        <form v-else @submit.prevent="handleUpdateTask" class="p-4 space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Title *</label>
            <Input v-model="editTask.title" required />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea v-model="editTask.description" class="w-full border rounded-md px-3 py-2 text-sm min-h-[80px]"></textarea>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select v-model="editTask.status" class="w-full border rounded-md px-3 py-2 text-sm">
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="done">Done</option>
                <option value="blocked">Blocked</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Priority</label>
              <select v-model="editTask.priority" class="w-full border rounded-md px-3 py-2 text-sm">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>
          <div v-if="editTask.status === 'blocked'" class="p-3 border border-red-200 rounded-lg bg-red-50">
            <label class="block text-sm font-medium text-red-700 mb-1">Blocker Comment *</label>
            <textarea v-model="editTask.blockerComment" placeholder="Why is this blocked?" class="w-full border border-red-200 rounded-md px-3 py-2 text-sm min-h-[60px]" required></textarea>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
              <input v-model="editTask.dueDate" type="date" class="w-full border rounded-md px-3 py-2 text-sm" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Assignee</label>
              <select v-model="editTask.assigneeId" class="w-full border rounded-md px-3 py-2 text-sm">
                <option :value="null">Unassigned</option>
                <option v-for="member in members" :key="member.id" :value="member.id">{{ member.name }}</option>
              </select>
            </div>
          </div>
          <div class="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" @click="cancelEdit">Cancel</Button>
            <Button type="submit" :disabled="isUpdating || !editTask.title.trim()">
              <Loader2 v-if="isUpdating" class="h-4 w-4 mr-2 animate-spin" />
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
