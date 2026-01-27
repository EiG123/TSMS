<script setup lang="ts">
import { useRouter } from "vue-router";
import { computed } from "vue";
import { useAuthStore } from "../stores/auth";

const router = useRouter();
const authStore = useAuthStore();

const isLoggedIn = computed(() => authStore.isAuthenticated);

const goProfile = () => {
  router.push("/profile");
};
</script>

<template>
  <header
    class="fixed top-0 left-64 right-0 h-16 bg-gradient-to-r from-slate-900 to-slate-800 border-b border-slate-700/50 shadow-lg z-50 flex items-center px-6"
  >
    <!-- CENTER - Title -->
    <div class="flex-1">
      <h1 class="text-xl font-bold text-white">TSM Platform</h1>
    </div>

    <!-- RIGHT - Actions -->
    <div class="flex items-center gap-3">
      <!-- Search Button (Optional) -->

      <!-- Notifications -->
      <div class="relative">
        <button class="relative p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700/50 transition-all duration-200 group">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
          </svg>
          <!-- Notification Badge -->
          <span class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full ring-2 ring-slate-900"></span>
        </button>
      </div>

      <!-- Divider -->
      <div class="w-px h-8 bg-slate-700/50"></div>

      <!-- User Profile -->
      <button 
        @click="goProfile"
        class="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700/50 transition-all duration-200 group"
      >
        <div class="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center ring-2 ring-slate-700 group-hover:ring-slate-600">
          <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
          </svg>
        </div>
        <div class="hidden lg:block text-left">
          <p class="text-sm font-medium text-white">User Name</p>
          <p class="text-xs text-slate-400">View Profile</p>
        </div>
        <svg class="hidden lg:block w-4 h-4 text-slate-400 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
        </svg>
      </button>
    </div>
  </header>
</template>