<script setup lang="ts">
import type { HTMLAttributes } from "vue"
import { ref } from "vue"
import { cn } from "@/lib/utils"
import { useForm, useField } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { useRouter } from "vue-router"
import { useToast } from 'vue-toast-notification'
import Button from "@/components/ui/button/Button.vue"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { signUpSchema, type SignUpFormData } from "@/schemas/authSchema"
import { authClient } from "@/lib/auth-client"

const props = defineProps<{
    class?: HTMLAttributes["class"]
}>()

const router = useRouter()
const toast = useToast()
const isLoading = ref(false)
const serverError = ref<string | null>(null)

// Set up form with Vee-Validate and Zod
const validationSchema = toTypedSchema(signUpSchema)
const { handleSubmit, errors } = useForm<SignUpFormData>({
    validationSchema,
})

// Individual field bindings
const { value: name } = useField<string>('name')
const { value: email } = useField<string>('email')
const { value: password } = useField<string>('password')

// Handle form submission
const onSubmit = handleSubmit(async (data: SignUpFormData) => {
    try {
        isLoading.value = true
        serverError.value = null

        console.log('Submitting sign up form', data)

        const { data: result, error } = await authClient.signUp.email({
            email: data.email,
            password: data.password,
            name: data.name,
            callbackURL: "/welcome"
        }, {
            onRequest: () => {
                isLoading.value = true
            },
            onSuccess: () => {
                console.log('Sign up successful')
                toast.success('Sign up successful! Please login.')
                router.push('/signin')
            },
            onError: (ctx: any) => {
                serverError.value = ctx.error.message
                console.error('Sign up error:', ctx.error.message)
                toast.error(ctx.error.message)
                isLoading.value = false
            }
        })

        if (error) {
            serverError.value = error.message
            console.error('Sign up failed:', error)
            toast.error(error.message)
        } else if (result) {
            console.log('Sign up successful:', result)
            router.push('/signin')
        }
    } catch (err: unknown) {
        const error = err as any
        const serverMsg = error?.message ?? error?.toString() ?? 'Sign up failed'
        serverError.value = serverMsg
        console.error('Error during sign up:', serverMsg)
        toast.error(serverMsg)
    } finally {
        isLoading.value = false
    }
})
</script>

<template>
    <div :class="cn('flex flex-col gap-6', props.class)">
        <Card>
            <CardHeader class="text-center">
                <CardTitle class="text-xl">
                    Create your account
                </CardTitle>
                <CardDescription>
                    Enter your email below to create your account
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form @submit.prevent="onSubmit">
                    <FieldGroup>
                        <Field v-if="serverError">
                            <FieldDescription class="text-red-500 bg-red-50 p-3 rounded">
                                {{ serverError }}
                            </FieldDescription>
                        </Field>
                        <Field>
                            <FieldLabel for="name">
                                Full Name
                            </FieldLabel>
                            <Input id="name" name="name" type="text" placeholder="John Doe" v-model="name"
                                :disabled="isLoading" />
                            <FieldDescription v-if="errors.name" class="text-red-500">
                                {{ errors.name }}
                            </FieldDescription>
                        </Field>
                        <Field>
                            <FieldLabel for="email">
                                Email
                            </FieldLabel>
                            <Input id="email" name="email" type="email" placeholder="m@example.com" v-model="email"
                                :disabled="isLoading" />
                            <FieldDescription v-if="errors.email" class="text-red-500">
                                {{ errors.email }}
                            </FieldDescription>
                        </Field>
                        <Field>
                            <FieldLabel for="password">
                                Password
                            </FieldLabel>
                            <Input id="password" name="password" type="password" v-model="password"
                                :disabled="isLoading" />
                            <FieldDescription v-if="errors.password" class="text-red-500">
                                {{ errors.password }}
                            </FieldDescription>
                            <FieldDescription v-else>
                                Must be at least 8 characters long.
                            </FieldDescription>
                        </Field>
                        <Field>
                            <Button type="submit" :disabled="isLoading">
                                {{ isLoading ? 'Creating Account...' : 'Create Account' }}
                            </Button>
                            <FieldDescription class="text-center">
                                Already have an account? <a href="/signin">Sign in</a>
                            </FieldDescription>
                        </Field>
                    </FieldGroup>
                </form>
            </CardContent>
        </Card>
        <FieldDescription class="px-6 text-center">
            By clicking continue, you agree to our <a href="#">Terms of Service</a>
            and <a href="#">Privacy Policy</a>.
        </FieldDescription>
    </div>
</template>
