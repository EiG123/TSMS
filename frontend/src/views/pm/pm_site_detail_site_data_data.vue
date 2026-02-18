<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getPmList } from "../../services/pm_nodeb_list.api";
import { pmServiceManage } from "../../services/pmServiceManage.api";
import { useAuthStore } from "../../stores/auth";
import { pmTitleManage } from "../../services/PmTitle/pmTitleManage.api";

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const pmId = ref(route.params.id as string);
const type = ref(route.params.type as string);

const loading = ref(false);
const pMsiteData = ref<any>(null);
const kwh_meters_list = ref<any[]>([]);
const title_list = ref<any[]>([]);
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
  const confirmed = window.confirm("คุณต้องการลบ PM นี้ใช่หรือไม่?");
  if (!confirmed) return;

  loading.value = true;

  try {
    await pmServiceManage.deletePmById(pmId.value);
    router.push(`/pm_nodeb`);
  } catch (error) {
    alert("ไม่สามารถลบข้อมูลได้");
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  loading.value = true;
  try {
    const res = await getPmList.getPmById(pmId.value);
    pMsiteData.value = res.data.data;
    kwh_meters_list.value = res.data.data.kwh_meters || [];

    console.log(type.value);
    const res_title = await pmTitleManage.getTitleByType(type.value);
    title_list.value = res_title.data.result || [];
    console.log("Title List:", title_list.value);
  } catch (error) {
    console.error("Failed to load PM data:", error);
    alert("ไม่เจอ API SiteList");
  } finally {
    loading.value = false;
  }
});

// Get section title based on type
const getSectionTitle = () => {
  const titles: Record<string, string> = {
    'ac_power': 'AC Power',
    'generator': 'Generator',
    'site_info': 'Site Info',
    'site_facility': 'Site Facility',
    'grounding': 'Grounding System',
    'external_alarm': 'External Alarm'
  };
  return titles[type.value] || 'Site Data';
};

// Handle add new item
const handleAddNew = () => {
  alert(`Add new ${getSectionTitle()} item`);
};
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
      <button @click="goBack" class="flex items-center gap-2 text-slate-400 hover:text-slate-200 transition-colors duration-200 mb-4">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        <span class="font-medium">Back to Site Data</span>
      </button>

      <!-- Header Section -->
      <div class="bg-slate-800/40 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-2xl overflow-hidden">
        <div class="relative">
          <div class="absolute inset-0 bg-gradient-to-r from-yellow-500/10 to-orange-500/10"></div>
          
          <div class="relative px-8 py-6">
            <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 class="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400 mb-2">
                  {{ getSectionTitle() }}
                </h1>
                <div class="flex items-center gap-3 flex-wrap">
                  <div class="flex items-center gap-2">
                    <span class="text-sm text-slate-400">Site:</span>
                    <span class="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-lg text-sm font-semibold border border-blue-500/30">
                      {{ pMsiteData.site_name }}
                    </span>
                  </div>
                  <div class="flex items-center gap-2">
                    <span class="text-sm text-slate-400">Total:</span>
                    <span class="px-3 py-1 bg-yellow-500/20 text-yellow-300 rounded-lg text-sm font-semibold border border-yellow-500/30">
                      {{ kwh_meters_list.length }} items
                    </span>
                  </div>
                  <div class="flex items-center gap-2">
                    <div class="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-lg shadow-green-500/50"></div>
                    <span class="text-xs text-green-400">Active</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- AC Power List -->
      <div v-if="kwh_meters_list.length > 0" class="space-y-4">
        <div
          v-for="(kwh, index) in kwh_meters_list"
          :key="index"
          class="bg-slate-800/40 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-lg overflow-hidden hover:shadow-2xl hover:shadow-yellow-500/10 hover:border-yellow-500/40 transition-all duration-300"
        >
          <!-- Card Header -->
          <div class="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-b border-slate-700/50 px-6 py-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center shadow-lg shadow-yellow-500/30">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h3 class="text-xl font-semibold text-slate-200">
                    {{ getSectionTitle() }} {{ kwh.number || index + 1 }}
                  </h3>
                  <p class="text-sm text-slate-400 mt-0.5">
                    Phase: <span class="text-yellow-400 font-semibold">{{ kwh.phase || 'N/A' }}</span>
                  </p>
                </div>
              </div>

              
            </div>
          </div>

          <!-- Card Body - Title List -->
          <div v-if="title_list.length > 0" class="p-6">
            <h4 class="text-lg font-semibold text-slate-300 mb-4 flex items-center gap-2">
              <svg class="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
              Checklist Items
            </h4>
            
            <div class="space-y-3">
              <div 
                v-for="(title, titleIndex) in title_list"
                :key="titleIndex"
                class="flex items-start gap-3 p-4 bg-slate-900/40 border border-slate-700/50 rounded-xl hover:bg-slate-900/60 hover:border-slate-600/50 transition-all duration-200"
              >
                <!-- Number Badge -->
                <div class="flex-shrink-0 w-8 h-8 rounded-lg bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
                  <span class="text-blue-300 font-bold text-sm">{{ titleIndex + 1 }}</span>
                </div>

                <!-- Title Content -->
                <div class="flex-1 min-w-0">
                  <p class="text-slate-200 font-medium">{{ title.title }}</p>
                  <p v-if="title.description" class="text-sm text-slate-400 mt-1">{{ title.description }}</p>
                </div>

                <!-- Checkbox/Status -->
                <div class="flex-shrink-0">
                  <button class="w-6 h-6 rounded border-2 border-slate-600 hover:border-green-500 transition-colors flex items-center justify-center">
                    <!-- You can add checkmark icon when checked -->
                    <svg class="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Empty State for Titles -->
          <div v-else class="p-6">
            <div class="text-center py-8 bg-slate-900/40 border border-slate-700/50 rounded-xl">
              <svg class="w-12 h-12 mx-auto text-slate-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p class="text-slate-400 text-sm">No checklist items available</p>
            </div>
          </div>

          <!-- Card Footer -->
          <div class="px-6 py-4 bg-slate-900/40 border-t border-slate-700/50">
            <div class="flex items-center justify-between text-sm">
              <div class="flex items-center gap-4">
                <span class="text-slate-400">
                  Progress: 
                  <span class="text-green-400 font-semibold">0 / {{ title_list.length }}</span>
                </span>
                <span class="text-slate-400">
                  Last updated: <span class="text-slate-300">{{ new Date().toLocaleString('th-TH') }}</span>
                </span>
              </div>
              <button class="text-blue-400 hover:text-blue-300 font-medium transition-colors">
                View Details →
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="bg-slate-800/40 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-lg p-12">
        <div class="text-center">
          <div class="w-20 h-20 bg-yellow-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg class="w-10 h-10 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-slate-300 mb-2">No {{ getSectionTitle() }} Found</h3>
          <p class="text-slate-400 mb-6">Get started by adding your first item</p>
          <button @click="handleAddNew" class="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg shadow-yellow-500/30 hover:shadow-yellow-500/50 transition-all duration-200">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Add First Item
          </button>
        </div>
      </div>

      <!-- Quick Stats -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="bg-slate-800/40 backdrop-blur-xl rounded-xl border border-slate-700/50 p-6">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <svg class="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p class="text-sm text-slate-400">Total Items</p>
              <p class="text-2xl font-bold text-slate-200">{{ kwh_meters_list.length }}</p>
            </div>
          </div>
        </div>

        <div class="bg-slate-800/40 backdrop-blur-xl rounded-xl border border-slate-700/50 p-6">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-lg bg-yellow-500/20 flex items-center justify-center">
              <svg class="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div>
              <p class="text-sm text-slate-400">Checklist Items</p>
              <p class="text-2xl font-bold text-yellow-400">{{ title_list.length }}</p>
            </div>
          </div>
        </div>

        <div class="bg-slate-800/40 backdrop-blur-xl rounded-xl border border-slate-700/50 p-6">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center">
              <svg class="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p class="text-sm text-slate-400">Completed</p>
              <p class="text-2xl font-bold text-green-400">0</p>
            </div>
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