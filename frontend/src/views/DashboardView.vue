<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
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
import { Users, Plus, Loader2 } from 'lucide-vue-next'

const teamStore = useTeamStore()
const router = useRouter()

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
  <SidebarApp>
    <div class="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold tracking-tight">Teams Dashboard</h1>
          <p class="text-muted-foreground">
            Manage and view all your teams
          </p>
        </div>
        <Button @click="goToCreateTeam">
          <Plus class="mr-2 h-4 w-4" />
          Create Team
        </Button>
      </div>

      <div v-if="isLoading" class="flex items-center justify-center min-h-[400px]">
        <Loader2 class="h-8 w-8 animate-spin text-muted-foreground" />
      </div>

      <div v-else-if="teams.length === 0" class="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Users class="h-16 w-16 text-muted-foreground" />
        <div class="text-center">
          <h3 class="text-lg font-semibold">No teams yet</h3>
          <p class="text-sm text-muted-foreground mb-4">
            Get started by creating your first team
          </p>
          <Button @click="goToCreateTeam">
            <Plus class="mr-2 h-4 w-4" />
            Create Your First Team
          </Button>
        </div>
      </div>

      <div v-else class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card
          v-for="team in teams"
          :key="team.id"
          class="cursor-pointer transition-all hover:shadow-lg hover:border-primary"
          @click="selectTeam(team.id)"
        >
          <CardHeader>
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <CardTitle class="text-xl">{{ team.name }}</CardTitle>
                <CardDescription v-if="team.description" class="mt-1">
                  {{ team.description }}
                </CardDescription>
              </div>
              <Badge :variant="team.role === 'manager' ? 'default' : 'secondary'">
                {{ team.role }}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div class="flex items-center gap-2 text-sm text-muted-foreground">
              <Users class="h-4 w-4" />
              <span>{{ team.memberCount || 0 }} member{{ team.memberCount !== 1 ? 's' : '' }}</span>
            </div>
            <div class="mt-2 text-xs text-muted-foreground">
              Created {{ new Date(team.createdAt).toLocaleDateString() }}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </SidebarApp>
</template>
