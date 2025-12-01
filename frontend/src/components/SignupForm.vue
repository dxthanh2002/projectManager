<script setup lang="ts">
import type { HTMLAttributes } from "vue"
import { cn } from "@/lib/utils"
import { useForm, useField } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
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

const props = defineProps<{
    class?: HTMLAttributes["class"]
}>()

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
        console.log("tesst");
        console.log('Form data:', data);
        // Call API endpoint
        const response = await fetch('/api/auth/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                
            },
            body: JSON.stringify(data),
        })

        if (!response.ok) {
            throw new Error('Sign up failed')
        }

        const result = await response.json()
        console.log('Sign up successful:', result)
        // Handle success - redirect or show message
    } catch (error) {
        console.error('Error during sign up:', error)
        // Handle error - show error message
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
                        <Field>
                            <FieldLabel for="name">
                                Full Name
                            </FieldLabel>
                            <Input id="name" name="name" type="text" placeholder="John Doe" v-model="name" />
                            <FieldDescription v-if="errors.name" class="text-red-500">
                                {{ errors.name }}
                            </FieldDescription>
                        </Field>
                        <Field>
                            <FieldLabel for="email">
                                Email
                            </FieldLabel>
                            <Input id="email" name="email" type="email" placeholder="m@example.com"
                                v-model="email" />
                            <FieldDescription v-if="errors.email" class="text-red-500">
                                {{ errors.email }}
                            </FieldDescription>
                        </Field>
                        <Field>
                            <FieldLabel for="password">
                                Password
                            </FieldLabel>
                            <Input id="password" name="password" type="password" v-model="password" />
                            <FieldDescription v-if="errors.password" class="text-red-500">
                                {{ errors.password }}
                            </FieldDescription>
                            <FieldDescription v-else>
                                Must be at least 8 characters long.
                            </FieldDescription>
                        </Field>
                        <Field>
                            <Button type="submit">
                                Create Account
                            </Button>
                            <FieldDescription class="text-center">
                                Already have an account? <a href="#">Sign in</a>
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
