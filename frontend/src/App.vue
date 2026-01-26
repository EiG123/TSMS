<script setup>
import { computed, onMounted } from "vue";
import { useAuthStore } from "../src/stores/auth";
import Header from "./components/Header.vue";

const authStore = useAuthStore();

// Restore session ตอน app load
onMounted(() => {
  authStore.initAuth();
});

const showHeader = computed(() => {
  return authStore.isAuthenticated;
});
</script>

<template>
  <Header />
  <router-view />
</template>