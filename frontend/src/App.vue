<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useAuthStore } from "./stores/auth";
import Header from "./components/Header.vue";
import Sidebar from "./components/Sidebar.vue";



const authStore = useAuthStore();

onMounted(() => {
  authStore.initAuth();
});

const isLoggedIn = computed(() => authStore.isAuthenticated);
</script>

<template>
  <!-- Sidebar -->
  <Sidebar v-if="isLoggedIn" />
  
  <!-- Header -->
  <Header v-if="isLoggedIn" />

  <!-- Content -->
  <main :class="isLoggedIn ? 'ml-64 pt-16 p-6' : 'p-6'">
    <router-view />
  </main>
</template>
