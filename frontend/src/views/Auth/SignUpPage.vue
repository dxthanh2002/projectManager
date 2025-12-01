<template>
  <!-- Radial Gradient Background from Top -->
  <div class="absolute inset-0 z-0" :style="{
    background: 'radial-gradient(125% 125% at 50% 10%, #fff 40%, #7c3aed 100%)',
  }" />
  <!-- Your Content/Components -->
  <div class="min-h-screen w-full relative z-10 flex flex-col items-center justify-center p-6 md:p-10">
    <div class="w-full max-w-sm md:max-w-4xl">
      <SignupForm />
    </div>
  </div>
</template>

<script setup lang="ts">

import SignupForm from '@/components/SignupForm.vue';


</script>

<style></style>