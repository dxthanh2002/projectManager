<script setup lang="ts">
import { onMounted, watch, nextTick, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { initDropdowns } from 'flowbite'
import { authClient } from '@/lib/auth-client'

const router = useRouter()
const session = authClient.useSession()
const isDropdownOpen = ref(false)

function toggleDropdown() {
    isDropdownOpen.value = !isDropdownOpen.value
}

onMounted(() => {
    initDropdowns()
})

watch(() => session.data, async () => {
    await nextTick()
    initDropdowns()
})

async function handleLogout() {
    try {
        await authClient.signOut()
        router.push('/signin')
    } catch (error) {
        console.error("Logout failed:", error)
        // Force redirect anyway?
        router.push('/signin')
    }
}
</script>
<template>
    <nav class="bg-neutral-primary fixed w-full z-20 top-0 start-0 border-default">
        <div class="max-w-screen-7xl flex flex-wrap items-center justify-between mx-auto p-4">
            <RouterLink to="/" class="flex items-center space-x-3 rtl:space-x-reverse">
                <img src="https://flowbite.com/docs/images/logo.svg" class="h-7" alt="Flowbite Logo" />
                <span class="self-center text-xl text-heading font-semibold whitespace-nowrap">ManagerCheck</span>
            </RouterLink>
            
            <div class="flex gap-2 md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse" v-if="!session.data && !session.isPending">
                <RouterLink to="/signin" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Login</RouterLink>
                <RouterLink to="/signup" class="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-4 py-2 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">Sign Up</RouterLink>
            </div>

            <button data-collapse-toggle="navbar-dropdown" type="button"
                class="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-body rounded-base md:hidden hover:bg-neutral-secondary-soft hover:text-heading focus:outline-none focus:ring-2 focus:ring-neutral-tertiary"
                aria-controls="navbar-dropdown" aria-expanded="false">
                <span class="sr-only">Open main menu</span>
                <svg class="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                    fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M5 7h14M5 12h14M5 17h14" />
                </svg>
            </button>
            <div class="hidden w-full md:block md:w-auto" id="navbar-dropdown">
                <ul
                    class="flex flex-col font-medium p-4 md:p-0 mt-4 border border-default rounded-base bg-neutral-secondary-soft md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-neutral-primary">
                    <li>
                        <RouterLink to="/"
                            class="block py-2 px-3 text-heading rounded hover:bg-neutral-tertiary md:hover:bg-transparent md:border-0 md:hover:text-fg-brand md:p-0"
                            aria-current="page">Home</RouterLink>
                    </li>
                    <li v-if="session.data" class="relative">
                        <button @click="toggleDropdown"
                            class="flex items-center justify-between w-full py-2 px-3 rounded font-medium text-heading md:w-auto hover:bg-neutral-tertiary md:hover:bg-transparent md:border-0 md:hover:text-fg-brand md:p-0">
                            {{ session.data.user.name }}
                            <svg class="w-4 h-4 ms-1.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24"
                                height="24" fill="none" viewBox="0 0 24 24">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                    stroke-width="2" d="m19 9-7 7-7-7" />
                            </svg>
                        </button>
                        <!-- Dropdown menu -->
                        <div v-show="isDropdownOpen"
                            class="absolute right-0 z-10 bg-neutral-primary-medium border border-default-medium rounded-base shadow-lg w-44 mt-2">
                            <ul class="p-2 text-sm text-body font-medium">
                                <li>
                                    <RouterLink to="/dashboard"
                                        class="inline-flex items-center w-full p-2 hover:bg-neutral-tertiary-medium hover:text-heading rounded">Dashboard</RouterLink>
                                </li>
                                <li>
                                    <a href="#"
                                        class="inline-flex items-center w-full p-2 hover:bg-neutral-tertiary-medium hover:text-heading rounded">Settings</a>
                                </li>
                                <li>
                                    <RouterLink to="/teams/create"
                                        class="inline-flex items-center w-full p-2 hover:bg-neutral-tertiary-medium hover:text-heading rounded">Create Team</RouterLink>
                                </li>
                                <li>
                                    <button @click="handleLogout"
                                        class="inline-flex items-center w-full p-2 hover:bg-neutral-tertiary-medium hover:text-heading rounded text-left">Sign
                                        out</button>
                                </li>
                            </ul>
                        </div>
                    </li>
                    <li>
                        <RouterLink :to="{ name:'About'}"
                            class="block py-2 px-3 text-heading rounded hover:bg-neutral-tertiary md:hover:bg-transparent md:border-0 md:hover:text-fg-brand md:p-0 md:dark:hover:bg-transparent">
                            About</RouterLink>
                    </li>
                    <li>
                        <RouterLink :to="{ name:'Detail'}"
                            class="block py-2 px-3 text-heading rounded hover:bg-neutral-tertiary md:hover:bg-transparent md:border-0 md:hover:text-fg-brand md:p-0 md:dark:hover:bg-transparent">
                            Details</RouterLink>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
</template>
<style scoped></style>
