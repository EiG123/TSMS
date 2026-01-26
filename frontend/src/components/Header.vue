<script setup>
import { useRouter } from "vue-router";
import { computed } from "vue";
import { useAuthStore } from "../stores/auth";

const router = useRouter();
const authStore = useAuthStore();

const isLoggedIn = computed(() => {
  return authStore.isAuthenticated;
});

const goHome = () => {
  router.push("/home");
};

const goPM = () => {
  router.push("/PM");
};

const logout = () => {
  authStore.logout();
  router.push("/");
};
</script>

<template>
  <header class="navbar bg-base-100 shadow-md px-6">
    <!-- LEFT -->
    <div class="flex-1">
      <span class="text-xl font-bold cursor-pointer" @click="goHome">
        PM SYSTEM
      </span>
    </div>

    <!-- RIGHT -->
    <div v-if="isLoggedIn" class="flex gap-2">
      <button class="btn btn-ghost" @click="goHome">Home</button>
      <button class="btn btn-ghost" @click="goPM">PM</button>
      <button class="btn btn-ghost" @click="logout">Logout</button>
    </div>
  </header>
</template>
