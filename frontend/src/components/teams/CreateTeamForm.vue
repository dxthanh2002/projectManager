<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useForm, useField } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'
import { useTeamStore } from '@/store/useTeamStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldDescription,
} from '@/components/ui/field'

const router = useRouter()
const teamStore = useTeamStore()

const formSchema = toTypedSchema(
  z.object({
    name: z.string().min(1, 'Team name is required').max(60, 'Name must be 60 characters or less'),
    description: z.string().optional(),
  })
)

const { handleSubmit, errors } = useForm({
  validationSchema: formSchema,
})

const { value: name } = useField<string>('name')
const { value: description } = useField<string>('description')

const onSubmit = handleSubmit(async (values) => {
  try {
     const newTeam = await teamStore.createTeam({
         name: values.name,
         description: values.description
     })
     if (newTeam) {
         // Redirect to team dashboard or list
         router.push(`/teams/${newTeam.id}`)
     }
  } catch (error) {
     // Error handled in store (toast)
  }
})
</script>

<template>
  <Card class="w-full max-w-md mx-auto">
    <CardHeader>
      <CardTitle>Create New Team</CardTitle>
      <CardDescription>Start a new team to manage tasks and members.</CardDescription>
    </CardHeader>
    <CardContent>
      <form @submit.prevent="onSubmit">
        <FieldGroup>
          <Field>
            <FieldLabel for="name">Team Name</FieldLabel>
            <Input id="name" v-model="name" placeholder="e.g. Engineering" :disabled="teamStore.isLoading" />
            <FieldDescription v-if="errors.name" class="text-red-500">{{ errors.name }}</FieldDescription>
          </Field>
          
          <Field>
             <FieldLabel for="description">Description (Optional)</FieldLabel>
             <Input id="description" v-model="description" placeholder="Brief description of the team" :disabled="teamStore.isLoading" />
             <FieldDescription v-if="errors.description" class="text-red-500">{{ errors.description }}</FieldDescription>
          </Field>
        </FieldGroup>
      </form>
    </CardContent>
    <CardFooter class="flex justify-end gap-2">
        <Button variant="outline" @click="router.back()" :disabled="teamStore.isLoading">Cancel</Button>
        <Button @click="onSubmit" :disabled="teamStore.isLoading">
            {{ teamStore.isLoading ? 'Creating...' : 'Create Team' }}
        </Button>
    </CardFooter>
  </Card>
</template>
