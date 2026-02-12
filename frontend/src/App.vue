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
  <div class="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
    <!-- Overlay สำหรับ mobile -->
    <div
      v-if="isLoggedIn && isMobileMenuOpen"
      @click="closeMobileMenu"
      class="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden transition-all duration-300"
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
        isLoggedIn ? 'md:ml-64 md:pt-16 pt-16 p-4 md:p-6' : '',
        'min-h-screen'
      ]"
    >
      <router-view />
    </main>
  </div>
</template>

<style>
/* Global Styles */
* {
  scroll-behavior: smooth;
}

/* Custom Scrollbar for dark theme */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #1e293b;
}

::-webkit-scrollbar-thumb {
  background: #475569;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #64748b;
}

/* Firefox Scrollbar */
* {
  scrollbar-width: thin;
  scrollbar-color: #475569 #1e293b;
}
</style>