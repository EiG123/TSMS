<script setup lang="ts">
import { useRouter } from "vue-router";

const router = useRouter();

const go = (path: string) => {
  router.push(path);
};

// Card data with icons
const adminCards = [
  {
    title: "User Management",
    subtitle: "NodeB",
    description: "Mobile NodeB",
    path: "/pm_nodeb",
    gradient: "from-blue-500 to-cyan-500",
    icon: "M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z",
    stats: "",
  },
  {
    title: "PM Small Exchange",
    subtitle: "AN / PN / DN",
    description: "CX-Node",
    path: "/small",
    gradient: "from-purple-500 to-pink-500",
    icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10",
    stats: "",
  },
];
</script>

<template>
  <div
    class="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 md:p-8"
  >
    <div class="max-w-7xl mx-auto">
      <!-- Header Section -->
      <div class="mb-8 animate-fade-in">
        <h1
          class="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-3"
        >
          Admin Dashboard
        </h1>
        <p class="text-slate-400 text-lg">
          Preventive Maintenance Management System
        </p>

        <!-- Stats Overview -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div
            class="bg-slate-800/40 backdrop-blur-xl rounded-xl border border-slate-700/50 p-4"
          >
            <p class="text-slate-400 text-sm mb-1">Total Sites</p>
            <p
              class="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400"
            >
              404
            </p>
          </div>
          <div
            class="bg-slate-800/40 backdrop-blur-xl rounded-xl border border-slate-700/50 p-4"
          >
            <p class="text-slate-400 text-sm mb-1">Active</p>
            <p class="text-3xl font-bold text-green-400">387</p>
          </div>
          <div
            class="bg-slate-800/40 backdrop-blur-xl rounded-xl border border-slate-700/50 p-4"
          >
            <p class="text-slate-400 text-sm mb-1">Scheduled</p>
            <p class="text-3xl font-bold text-yellow-400">12</p>
          </div>
          <div
            class="bg-slate-800/40 backdrop-blur-xl rounded-xl border border-slate-700/50 p-4"
          >
            <p class="text-slate-400 text-sm mb-1">Completed</p>
            <p class="text-3xl font-bold text-purple-400">5</p>
          </div>
        </div>
      </div>

      <!-- PM Cards Grid -->
      <div
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-slide-up"
      >
        <div
          v-for="(card, index) in adminCards"
          :key="index"
          @click="go(card.path)"
          class="group relative bg-slate-800/40 backdrop-blur-xl rounded-2xl border border-slate-700/50 overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-2 hover:border-blue-500/40 cursor-pointer"
        >
          <!-- Gradient Overlay -->
          <div
            class="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300"
            :class="`bg-gradient-to-br ${card.gradient}`"
          ></div>

          <!-- Card Header -->
          <div class="relative border-b border-slate-700/50 p-6">
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <h2
                  class="text-xl font-bold text-slate-200 mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r transition-all"
                  :class="`group-hover:${card.gradient}`"
                >
                  {{ card.title }}
                </h2>
                <p class="text-sm text-slate-400 mb-3">{{ card.subtitle }}</p>
                <p class="text-slate-300 text-sm">{{ card.description }}</p>
              </div>

              <!-- Icon -->
              <div
                class="w-14 h-14 rounded-xl flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:rotate-6"
                :class="`bg-gradient-to-br ${card.gradient}`"
              >
                <svg
                  class="w-7 h-7 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    :d="card.icon"
                  />
                </svg>
              </div>
            </div>
          </div>

          <!-- Card Footer -->
          <div class="relative p-6 flex items-center justify-between">
            <div class="flex items-center gap-2">
              <div
                class="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-lg shadow-green-500/50"
              ></div>
              <span class="text-slate-400 text-sm font-medium">{{
                card.stats
              }}</span>
            </div>

            <div
              class="flex items-center gap-2 text-blue-400 group-hover:text-blue-300 transition-colors"
            >
              <span class="text-sm font-medium">View Details</span>
              <svg
                class="w-5 h-5 transform group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </div>

          <!-- Hover Effect Border -->
          <div
            class="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
            :class="`ring-1 ring-inset ${card.gradient
              .replace('from-', 'ring-')
              .replace(' to-', '/30 ring-')}`"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slide-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.6s ease-out;
}

.animate-slide-up {
  animation: slide-up 0.6s ease-out 0.2s both;
}
</style>
