<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getPmList } from "../../services/pm_nodeb_list.api";

const route = useRoute();
const router = useRouter();
const pmId = ref(route.params.id as string);

const loading = ref(false);
const pMsiteData = ref<any>(null);
const showModules = ref(true);

const hide = () => {
  showModules.value = !showModules.value;
};

const goBack = () => {
  router.back();
};

const goEdit = () => {
  router.push(`/pm_nodeb_edit/${pmId.value}`);
};

const handleDelete = async () => {
  const confirmed = window.confirm("คุณต้องการลบ Site นี้ใช่หรือไม่?");
  if (!confirmed) return;
  
  // Add delete logic here
  alert("Delete functionality");
};

onMounted(async () => {
  loading.value = true;
  try {
    const res = await getPmList.getPmById(pmId.value);
    pMsiteData.value = res.data.data;
    console.log(res.data.data);
  } catch {
    alert("ไม่เจอ API SiteList");
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 md:p-8">
    <!-- Loading State -->
    <div v-if="loading" class="flex flex-col items-center justify-center h-96 animate-fade-in">
      <div class="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mb-4"></div>
      <p class="text-slate-400 text-lg">Loading site details...</p>
    </div>

    <!-- Main Content -->
    <div v-else-if="pMsiteData" class="max-w-7xl mx-auto space-y-6 animate-slide-up">
      
      <!-- Back Button -->
      <button
        @click="goBack"
        class="flex items-center gap-2 text-slate-400 hover:text-slate-200 transition-colors duration-200 mb-4"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        <span class="font-medium">Back to List</span>
      </button>

      <!-- Header Section -->
      <div class="bg-slate-800/40 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-2xl overflow-hidden">
        <div class="relative">
          <div class="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10"></div>
          
          <div class="relative px-8 py-6">
            <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 class="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-2">
                  {{ pMsiteData.site_name }}
                </h1>
                <div class="flex items-center gap-2">
                  <span class="text-sm text-slate-400">Round:</span>
                  <span class="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-lg text-sm font-semibold border border-blue-500/30">
                    {{ pMsiteData.round }}
                  </span>
                  <div class="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-lg shadow-green-500/50 ml-2"></div>
                  <span class="text-xs text-green-400">Active</span>
                </div>
              </div>
              
              <div class="flex gap-3">
                <button
                  @click="goEdit"
                  class="flex items-center gap-2 bg-blue-500/15 border border-blue-500/30 hover:bg-blue-500/25 hover:border-blue-500/50 text-blue-300 px-6 py-3 rounded-xl font-semibold transition-all duration-200 hover:-translate-y-0.5 shadow-lg shadow-blue-500/10"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit
                </button>
                <button
                  @click="handleDelete"
                  class="flex items-center gap-2 bg-red-500/15 border border-red-500/30 hover:bg-red-500/25 hover:border-red-500/50 text-red-300 px-6 py-3 rounded-xl font-semibold transition-all duration-200 hover:-translate-y-0.5 shadow-lg shadow-red-500/10"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Site Information Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <!-- Main Info Box -->
        <div class="lg:col-span-2 bg-slate-800/40 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-lg p-6">
          <h2 class="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-6">
            Site Information
          </h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Column 1 -->
            <div class="space-y-5">
              <div class="group">
                <label class="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">Site ID</label>
                <div class="bg-slate-900/40 border border-slate-700/50 rounded-lg px-4 py-3">
                  <p class="text-slate-200 font-medium">{{ pMsiteData.site_name }}</p>
                </div>
              </div>
              
              <div class="group">
                <label class="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">Region</label>
                <div class="bg-slate-900/40 border border-slate-700/50 rounded-lg px-4 py-3">
                  <p class="text-slate-200 font-medium">{{ pMsiteData.region }}</p>
                </div>
              </div>
              
              <div class="group">
                <label class="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">Company</label>
                <div class="bg-slate-900/40 border border-slate-700/50 rounded-lg px-4 py-3">
                  <p class="text-slate-200 font-medium">{{ pMsiteData.company }}</p>
                </div>
              </div>
              
              <div class="group">
                <label class="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">Created by</label>
                <div class="bg-slate-900/40 border border-slate-700/50 rounded-lg px-4 py-3">
                  <p class="text-slate-200 font-medium">{{ pMsiteData.created_by }}</p>
                </div>
              </div>
            </div>

            <!-- Column 2 -->
            <div class="space-y-5">
              <div class="group">
                <label class="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">Plan Date</label>
                <div class="bg-slate-900/40 border border-slate-700/50 rounded-lg px-4 py-3">
                  <p class="text-slate-200 font-medium font-mono">{{ pMsiteData.plan_date }}</p>
                </div>
              </div>
              
              <div class="group">
                <label class="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">PM Date</label>
                <div class="bg-slate-900/40 border border-slate-700/50 rounded-lg px-4 py-3">
                  <p class="text-slate-200 font-medium font-mono">{{ pMsiteData.pm_date }}</p>
                </div>
              </div>
              
              <div class="group">
                <label class="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">Date Created</label>
                <div class="bg-slate-900/40 border border-slate-700/50 rounded-lg px-4 py-3">
                  <p class="text-slate-200 font-medium font-mono">{{ pMsiteData.date }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Side Stats -->
        <div class="space-y-4">
          <!-- AC Power Card -->
          <div class="group bg-slate-800/40 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-lg p-6 hover:shadow-2xl hover:shadow-blue-500/10 hover:border-blue-500/40 transition-all duration-300 hover:-translate-y-1">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-slate-400 mb-1">AC Power</p>
                <p class="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">
                  {{ pMsiteData.kwh_meters?.length || 0 }}
                </p>
              </div>
              <div class="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
          </div>

          <!-- Generator Card -->
          <div class="group bg-slate-800/40 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-lg p-6 hover:shadow-2xl hover:shadow-green-500/10 hover:border-green-500/40 transition-all duration-300 hover:-translate-y-1">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-slate-400 mb-1">Generator</p>
                <p class="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600">
                  {{ pMsiteData.generators?.length || 0 }}
                </p>
              </div>
              <div class="w-14 h-14 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg shadow-green-500/30">
                <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                </svg>
              </div>
            </div>
          </div>

          <!-- Broadband Card -->
          <div class="group bg-slate-800/40 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-lg p-6 hover:shadow-2xl hover:shadow-purple-500/10 hover:border-purple-500/40 transition-all duration-300 hover:-translate-y-1">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-slate-400 mb-1">Broadband</p>
                <p class="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-purple-600">
                  {{ pMsiteData.boardband?.length || 0 }}
                </p>
              </div>
              <div class="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/30">
                <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Modules Section -->
      <div class="bg-slate-800/40 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-lg overflow-hidden">
        <div
          @click="hide"
          class="flex items-center justify-between px-8 py-6 cursor-pointer hover:bg-slate-800/60 transition-all duration-200 border-b border-slate-700/50"
        >
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h2 class="text-xl font-semibold text-slate-200">Modules</h2>
          </div>
          
          <button class="flex items-center gap-2 text-blue-400 hover:text-blue-300 font-medium text-sm transition-colors">
            {{ showModules ? 'Hide' : 'Show' }}
            <svg
              class="w-5 h-5 transition-transform duration-300"
              :class="{ 'rotate-180': !showModules }"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        <div 
          v-if="showModules" 
          class="px-8 py-6 space-y-4"
        >
          <!-- Mowing Module -->
          <div 
            v-if="pMsiteData.mowing?.length" 
            class="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-xl p-5 hover:from-green-500/15 hover:to-emerald-500/15 transition-all duration-200"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/30">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
                <div>
                  <p class="font-semibold text-slate-200 text-lg">Mowing</p>
                  <p class="text-sm text-slate-400">Lawn maintenance module</p>
                </div>
              </div>
              <div class="px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-lg">
                <span class="text-green-300 font-bold">{{ pMsiteData.mowing.length }}</span>
                <span class="text-green-400 text-sm ml-1">items</span>
              </div>
            </div>
          </div>

          <!-- Solar Cell Module -->
          <div 
            v-if="pMsiteData.solar_cell?.length" 
            class="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-xl p-5 hover:from-yellow-500/15 hover:to-orange-500/15 transition-all duration-200"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-lg bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center shadow-lg shadow-yellow-500/30">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <div>
                  <p class="font-semibold text-slate-200 text-lg">Solar Cell</p>
                  <p class="text-sm text-slate-400">Solar power system</p>
                </div>
              </div>
              <div class="px-4 py-2 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
                <span class="text-yellow-300 font-bold">{{ pMsiteData.solar_cell.length }}</span>
                <span class="text-yellow-400 text-sm ml-1">items</span>
              </div>
            </div>
          </div>

          <!-- Empty State for Modules -->
          <div 
            v-if="!pMsiteData.mowing?.length && !pMsiteData.solar_cell?.length"
            class="text-center py-8"
          >
            <svg class="w-16 h-16 mx-auto text-slate-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <p class="text-slate-400 font-medium">No modules available</p>
            <p class="text-slate-500 text-sm mt-1">Modules will appear here when added</p>
          </div>
        </div>
      </div>
    </div>

    <!-- No Data State -->
    <div v-else class="flex flex-col items-center justify-center h-96 animate-fade-in">
      <svg class="w-20 h-20 text-slate-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <p class="text-slate-400 text-lg font-medium">No data available</p>
      <p class="text-slate-500 text-sm mt-2">Unable to load site information</p>
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