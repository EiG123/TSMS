<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useAuthStore } from "./stores/auth";
import Header from "./components/Header.vue";
import Sidebar from "./components/Sidebar.vue";

const authStore = useAuthStore();
const isMobileMenuOpen = ref(false);

onMounted(() => {
  authStore.initAuth();
});

const isLoggedIn = computed(() => authStore.isAuthenticated);

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false;
};
</script>

<template>
  <div>
    <!-- Overlay สำหรับ mobile -->
    <div
      v-if="isLoggedIn && isMobileMenuOpen"
      @click="closeMobileMenu"
      class="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden transition-opacity"
    ></div>

    <!-- Sidebar -->
    <Sidebar
      v-if="isLoggedIn"
      :is-open="isMobileMenuOpen"
      @close="closeMobileMenu"
    />

    <!-- Header -->
    <Header
      v-if="isLoggedIn"
      :on-menu-click="toggleMobileMenu"
    />

    <!-- Content -->
    <main
      :class="[
        isLoggedIn ? 'md:ml-64 md:pt-16 pt-16 p-4 md:p-6' : 'p-6',
        'min-h-screen bg-slate-50'
      ]"
    >
      <router-view />
    </main>
  </div>
</template>