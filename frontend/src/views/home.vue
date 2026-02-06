<script setup lang="ts">
import { useRouter } from "vue-router";
import { computed } from "vue";
import { useAuthStore } from "../stores/auth";

const authStore = useAuthStore();
const router = useRouter();

const username = computed(() => authStore.user?.username || "User");

const goPM = () => router.push("/PM");
const goCableSlack = () => router.push("/CableSlack")
const goTxTtoExcel = () => router.push("/txt_to_excel")

// Sample data for cards
const cards = [
  {
    id: 1,
    title: "PM",
    value: "",
    icon: "📊",
    color: "from-blue-500 to-blue-600",
    onclick: goPM,
  },
  {
    id: 2,
    title: "เก็บตกยกสาย",
    value: "",
    icon: "🎯",
    color: "from-purple-500 to-purple-600",
    onclick: goCableSlack,
  },
  {
    id: 3,
    title: "TxT To Excel",
    value: "",
    icon: "✅",
    color: "from-green-500 to-green-600",
    onclick: goTxTtoExcel,
  },
  {
    id: 4,
    title: "",
    value: "",
    icon: "👥",
    color: "from-orange-500 to-orange-600",
  },
  {
    id: 5,
    title: "",
    value: "",
    icon: "⏳",
    color: "from-yellow-500 to-yellow-600",
  },
  {
    id: 6,
    title: "",
    value: "",
    icon: "📈",
    color: "from-pink-500 to-pink-600",
  },
];
</script>

<template>
  <div
    class="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6"
  >
    <!-- Welcome Section -->
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-white mb-2">
        Hello,
        <span
          class="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent"
          >{{ username }}</span
        >
        👋
      </h1>
    </div>

    <!-- Big Image Container -->
    <div class="container mb-8">
      <div
        class="relative w-full h-[400px] rounded-2xl overflow-hidden shadow-2xl group"
      >
        <!-- Gradient Overlay -->
        <div
          class="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20 z-10"
        ></div>

        <!-- Background Pattern -->
        <div
          class="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900"
        >
          <div
            class="absolute inset-0 opacity-10"
            style="
              background-image: radial-gradient(
                circle at 2px 2px,
                white 1px,
                transparent 0
              );
              background-size: 40px 40px;
            "
          ></div>
        </div>

        <!-- Content -->
        <div
          class="relative z-20 h-full flex flex-col items-center justify-center p-8 text-center"
        >
          <h2 class="text-4xl font-bold text-white mb-4">Dashboard</h2>
          <p class="text-slate-300 text-lg max-w-2xl mb-6">Details</p>
        </div>

        <!-- Decorative Elements -->
        <div
          class="absolute top-10 right-10 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl"
        ></div>
        <div
          class="absolute bottom-10 left-10 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl"
        ></div>
      </div>
    </div>

    <!-- Stats Cards Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="card in cards"
        :key="card.id"
        @click="card.onclick"
        class="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 hover:border-slate-600 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1 group"
      >
        <!-- Card Header -->
        <div class="flex items-start justify-between mb-4">
          <div
            :class="`w-14 h-14 bg-gradient-to-br ${card.color} rounded-lg flex items-center justify-center text-2xl shadow-lg group-hover:scale-110 transition-transform duration-300`"
          >
            {{ card.icon }}
          </div>
        </div>

        <!-- Card Content -->
        <div>
          <h3 class="text-slate-400 text-sm font-medium mb-2">
            {{ card.title }}
          </h3>
        </div>
      </div>
    </div>
  </div>
</template>