<template>
  <div
    class="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex flex-col items-center justify-center p-4 relative overflow-hidden">
    <!-- Optional subtle background pattern -->
    <div class="absolute inset-0 opacity-5">
      <div class="absolute top-10 left-10 w-32 h-32 rounded-full bg-blue-400"></div>
      <div class="absolute bottom-20 right-20 w-48 h-48 rounded-full bg-indigo-300"></div>
    </div>

    <div class="text-center z-10 max-w-2xl">
      <!-- 404 Illustration -->
      <div class="mb-8 flex justify-center">
        <div class="relative">
          <div
            class="w-64 h-64 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 flex items-center justify-center">
            <span class="text-7xl font-black text-gray-700">404</span>
          </div>
          <div class="absolute -bottom-4 -right-4 bg-red-500 text-white p-2 rounded-full shadow-lg animate-bounce">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-1.147-2.302-1.146-3.072 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z">
              </path>
            </svg>
          </div>
        </div>
      </div>

      <!-- Text -->
      <h1 class="text-4xl md:text-5xl font-extrabold text-gray-800 mb-4">
        Trang không tồn tại 🥲
      </h1>
      <p class="text-lg text-gray-600 mb-8 max-w-xl mx-auto leading-relaxed">
        Có vẻ như đường dẫn bạn truy cập không tồn tại — hoặc đã bị đưa vào “vùng cấm” bởi một con rồng bảo vệ dữ liệu
        🐉
      </p>

      <!-- Buttons -->
      <div class="flex flex-wrap justify-center gap-4 mb-8">
        <router-link to="/"
          class="inline-flex items-center justify-center px-6 py-3 text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg shadow-md transition-all duration-300 transform hover:-translate-y-1">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6">
            </path>
          </svg>
          Về trang chủ
        </router-link>

        <button @click="goBack"
          class="inline-flex items-center justify-center px-6 py-3 text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg shadow-sm transition-colors duration-300">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18">
            </path>
          </svg>
          Quay lại
        </button>
      </div>

      <!-- Fun fact card -->
      <div class="bg-white/70 backdrop-blur-sm rounded-xl p-5 border border-gray-200 shadow-sm">
        <div class="flex items-start gap-3">
          <div class="mt-1 p-1 bg-amber-100 text-amber-700 rounded-full">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <p class="text-gray-700 text-sm italic">
            💡 <strong>Fun fact:</strong> Mã lỗi 404 được đặt theo phòng số 404 tại CERN — nơi mà Tim Berners-Lee đã
            phát minh ra World Wide Web!
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goBack = (): void => {
  if (window.history.length > 1) {
    router.go(-1)
  } else {
    router.push('/')
  }
}
</script>