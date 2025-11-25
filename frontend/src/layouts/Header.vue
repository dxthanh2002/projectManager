<script setup lang="ts">
</script>
<template>
    <header class="relative z-50">
      <div class="flex items-center justify-center navbar">
        <div
          class="max-w-[1536px] w-full px-4 py-4 md:py-10 md:px-[72px] flex items-center justify-between"
        >
          <!-- Logo -->
          <a
            href="./"
            class="flex items-center justify-center flex-none"
          >
            <img
              src="../assets/logo.png"
              alt="logo"
              class="w-16 h-16"
            />
            <p class="text-lg capitalize font-lobster text-p-900">Tea Station</p>
          </a>

          <!-- Nav Links -->
          <nav class="items-center justify-end hidden w-full gap-4 lg:flex lg:gap-8">
            <a
              href="./products.html"
              class="navLink"
              >Sản Phẩm</a
            >
            <a
              href="./#story"
              class="navLink"
              >Giới Thiệu</a
            >
            <a
              href="./#contact"
              class="navLink"
              >Liên Hệ</a
            >
          </nav>

          <!-- Hamburger Icon -->
          <div
            class="block cursor-pointer lg:hidden"
            id="toggle_btn"
          >
            <img
              src="./assets/Menu Icon.svg"
              alt="hamburger icon"
              class="size-5"
            />
          </div>

          <!-- Mobile Menu -->
          <div class="dropdown-menu lg:hidden">
            <a
              href="./products.html"
              class="navLink mobileNavLink"
              >Sản Phẩm</a
            >
            <a
              href="#story"
              class="navLink mobileNavLink"
              >Giới Thiệu</a
            >
            <a
              href="#contact"
              class="navLink mobileNavLink"
              >Liên Hệ</a
            >
          </div>
        </div>
      </div>
    </header>
</template>