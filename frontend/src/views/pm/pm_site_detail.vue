<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { getPmList } from "../../services/pm_nodeb_list.api";

const route = useRoute();
const pmId = ref(route.params.id as string);

const loading = ref(false);
const pMsiteData = ref<any>(null);
const showModules = ref(true);

const hide = () => {
  showModules.value = !showModules.value;
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
  <div class="min-h-screen bg-gray-50 p-6">
    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>

    <!-- Main Content -->
    <div v-else-if="pMsiteData" class="max-w-7xl mx-auto space-y-6">
      <!-- Header Section -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-800">
              {{ pMsiteData.site_name }}
            </h1>
            <p class="text-sm text-gray-500 mt-1">
              Round: <span class="font-semibold">{{ pMsiteData.round }}</span>
            </p>
          </div>
          <div class="flex gap-3">
            <button
              class="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium shadow-sm"
            >
              Edit
            </button>
            <button
              class="px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 font-medium shadow-sm"
            >
              Delete
            </button>
          </div>
        </div>
      </div>

      <!-- Site Information Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Main Info Box -->
        <div class="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
          <h2 class="text-xl font-semibold text-gray-800 mb-4">Site Information</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Column 1 -->
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-500 mb-1">Site ID</label>
                <p class="text-base text-gray-800">{{ pMsiteData.site_name }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-500 mb-1">Region</label>
                <p class="text-base text-gray-800">{{ pMsiteData.region }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-500 mb-1">Company</label>
                <p class="text-base text-gray-800">{{ pMsiteData.company }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-500 mb-1">Created by</label>
                <p class="text-base text-gray-800">{{ pMsiteData.created_by }}</p>
              </div>
            </div>

            <!-- Column 2 -->
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-500 mb-1">Plan Date</label>
                <p class="text-base text-gray-800">{{ pMsiteData.plan_date }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-500 mb-1">PM Date</label>
                <p class="text-base text-gray-800">{{ pMsiteData.pm_date }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-500 mb-1">Date Created</label>
                <p class="text-base text-gray-800">{{ pMsiteData.date }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Side Stats -->
        <div class="space-y-4">
          <!-- AC Power Card -->
          <div class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-500">AC Power</p>
                <p class="text-3xl font-bold text-blue-600 mt-1">
                  {{ pMsiteData.kwh_meters?.length || 0 }}
                </p>
              </div>
              <div class="bg-blue-100 p-3 rounded-full">
                <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
          </div>

          <!-- Generator Card -->
          <div class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-500">Generator</p>
                <p class="text-3xl font-bold text-green-600 mt-1">
                  {{ pMsiteData.generators?.length || 0 }}
                </p>
              </div>
              <div class="bg-green-100 p-3 rounded-full">
                <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                </svg>
              </div>
            </div>
          </div>

          <!-- Broadband Card -->
          <div class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-500">Broadband</p>
                <p class="text-3xl font-bold text-purple-600 mt-1">
                  {{ pMsiteData.boardband?.length || 0 }}
                </p>
              </div>
              <div class="bg-purple-100 p-3 rounded-full">
                <svg class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Modules Section -->
      <div class="bg-white rounded-lg shadow-md overflow-hidden">
        <div
          @click="hide"
          class="flex items-center justify-between p-6 cursor-pointer hover:bg-gray-50 transition-colors duration-200"
        >
          <h2 class="text-xl font-semibold text-gray-800">Modules</h2>
          <button class="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-2">
            {{ showModules ? 'Hide' : 'Show' }}
            <svg
              class="w-5 h-5 transition-transform duration-200"
              :class="{ 'rotate-180': !showModules }"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        <div v-if="showModules" class="px-6 pb-6 space-y-4">
          <!-- Mowing Module -->
          <div v-if="pMsiteData.mowing?.length" class="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
            <div class="flex items-center gap-3">
              <div class="bg-green-500 p-2 rounded-lg">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <div>
                <p class="font-semibold text-gray-800">Mowing</p>
                <p class="text-sm text-gray-600">{{ pMsiteData.mowing.length }} items</p>
              </div>
            </div>
          </div>

          <!-- Solar Cell Module -->
          <div v-if="pMsiteData.solar_cell?.length" class="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-4 border border-yellow-200">
            <div class="flex items-center gap-3">
              <div class="bg-yellow-500 p-2 rounded-lg">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div>
                <p class="font-semibold text-gray-800">Solar Cell</p>
                <p class="text-sm text-gray-600">{{ pMsiteData.solar_cell.length }} items</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- No Data State -->
    <div v-else class="flex items-center justify-center h-64">
      <p class="text-gray-500">No data available</p>
    </div>
  </div>
</template>