<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getPmList } from "../../services/pm_nodeb_list.api";
import { pmServiceManage } from "../../services/pmServiceManage.api";
import { useAuthStore } from "../../stores/auth";

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const pmId = ref(route.params.id as string);
const type = ref(route.params.type as string);

const loading = ref(false);
const pMsiteData = ref<any>(null);
const kwh_meters_list = ref<any[]>([]);
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
    console.log(res.data.data);
    kwh_meters_list.value = res.data.data.kwh_meters || [];
    console.log("KWH Meters:", kwh_meters_list.value);
  } catch (error) {
    console.error("Failed to load PM data:", error);
    alert("ไม่เจอ API SiteList");
  } finally {
    loading.value = false;
  }
});

// Navigation functions
const activeTab = ref("Site Data");
const navigations = [
  {
    name: "Summary",
    icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
    action: () => router.push(`/pm_site_detail/${pmId.value}`),
  },
  {
    name: "Site Data",
    icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
    action: () => router.push(`/pm_site_detail_site_data/${pmId.value}`),
  },
  {
    name: "Cabinets",
    icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10",
    action: () => alert("Go to CabinetsPage"),
  },
  {
    name: "Problems",
    icon: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z",
    action: () => alert("Go to ProblemsPage"),
  },
  {
    name: "Audit",
    icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4",
    action: () => alert("Go to AuditPage"),
  },
];

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

              <div class="flex gap-3">
                <button @click="handleAddNew" class="flex items-center gap-2 bg-green-500/15 border border-green-500/30 hover:bg-green-500/25 hover:border-green-500/50 text-green-300 px-6 py-3 rounded-xl font-semibold transition-all duration-200 hover:-translate-y-0.5 shadow-lg shadow-green-500/10">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                  </svg>
                  Add New
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Navigation Tabs -->
      <div class="bg-slate-800/40 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-lg overflow-x-auto">
        <div class="flex gap-2 p-4">
          <button
            v-for="nav in navigations"
            :key="nav.name"
            @click="nav.action"
            :class="[
              'flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all duration-200 whitespace-nowrap',
              nav.name === activeTab
                ? 'bg-blue-500/20 border-2 border-blue-500/50 text-blue-300 shadow-lg shadow-blue-500/20'
                : 'bg-slate-700/30 hover:bg-slate-700/50 border border-slate-600/30 hover:border-blue-500/40 text-slate-300 hover:text-blue-300'
            ]"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="nav.icon" />
            </svg>
            {{ nav.name }}
          </button>
        </div>
      </div>

      <!-- AC Power List -->
      <div v-if="kwh_meters_list.length > 0" class="space-y-4">
        <div
          v-for="(kwh, index) in kwh_meters_list"
          :key="index"
          class="bg-slate-800/40 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-lg overflow-hidden hover:shadow-2xl hover:shadow-yellow-500/10 hover:border-yellow-500/40 transition-all duration-300 hover:-translate-y-1"
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
                    AC Power {{ kwh.number || index + 1 }}
                  </h3>
                  
                  <p class="text-sm text-slate-400 mt-0.5">
                    Phase: <span class="text-yellow-400 font-semibold">{{ kwh.phase || 'N/A' }}</span>
                  </p>
                </div>
              </div>

              <div class="flex gap-2">
                <button class="flex items-center gap-2 bg-blue-500/15 border border-blue-500/30 hover:bg-blue-500/25 text-blue-300 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit
                </button>
                <button class="flex items-center gap-2 bg-red-500/15 border border-red-500/30 hover:bg-red-500/25 text-red-300 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete
                </button>
              </div>
            </div>
          </div>

          <!-- Card Footer -->
          <div class="px-6 py-4 bg-slate-900/40 border-t border-slate-700/50">
            <div class="flex items-center justify-between text-sm">
              <span class="text-slate-400">Last updated: <span class="text-slate-300">{{ new Date().toLocaleString('th-TH') }}</span></span>
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
            <div class="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center">
              <svg class="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p class="text-sm text-slate-400">Active</p>
              <p class="text-2xl font-bold text-green-400">{{ kwh_meters_list.length }}</p>
            </div>
          </div>
        </div>

        <div class="bg-slate-800/40 backdrop-blur-xl rounded-xl border border-slate-700/50 p-6">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-lg bg-yellow-500/20 flex items-center justify-center">
              <svg class="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p class="text-sm text-slate-400">Last Updated</p>
              <p class="text-sm font-medium text-slate-300">{{ new Date().toLocaleDateString('th-TH') }}</p>
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