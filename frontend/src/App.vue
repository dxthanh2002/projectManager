<script setup lang="ts">
import { RouterView } from 'vue-router';
import Footer from './layouts/Footer.vue';
import Navbar from './layouts/Navbar.vue';


import { onMounted } from 'vue'
import { initDropdowns } from 'flowbite'

onMounted(() => {
  initDropdowns()
})
</script>

<template>

  <div class="flex flex-col items-center p-7 rounded-2xl">
    <div class=" max-w-7xl mb-2">
      <Navbar />
    </div>
    <div class=" flex-1 max-w-7xl mx-72">
      <RouterView />
    </div>

    <div class="pt-4  bottom-0">
      <Footer />
    </div>


  </div>
</template>
<style scoped></style>
