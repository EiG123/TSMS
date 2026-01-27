<script setup lang="ts">
import { computed } from "vue";
import { useAuthStore } from "../stores/auth";

const authStore = useAuthStore();

const username = computed(() => authStore.user?.username || "User");
</script>

<template>
  <div class="text-lg font-semibold">
    Hello, {{ username }}
  </div>
</template>
