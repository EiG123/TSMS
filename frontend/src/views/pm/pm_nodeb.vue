<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { getPmList } from "../../services/pm_nodeb_list.api";
import { pmServiceManage } from "../../services/pmServiceManage.api";

const router = useRouter();
const goNew = () => router.push("/pm_nodeb_new");
const goEdit = (id: string) => router.push(`/pm_nodeb_edit/${id}`);
const goView = (id: string) => router.push(`/pm_site_detail/${id}`);
const handleDelete = async (id: number) => {
  const confirmed = window.confirm("คุณต้องการลบ Dropdown นี้ใช่หรือไม่?");

  if (!confirmed) return;

  loading.value = true;

  try {
    await pmServiceManage.deletePmById(id);
    window.location.reload();
  } catch (error) {
    alert("ไม่สามารถลบข้อมูลได้");
  } finally {
    loading.value = false;
  }
};

// ===== state =====
const siteList = ref<any[]>([]);
const loading = ref(false);
const searchQuery = ref("");
const selectedYear = ref("2025/2026");

// pagination
const currentPage = ref(1);
const pageSize = 10;

// Loading Data Function
const loadData = async () => {
  const res = await getPmList.getPmList();
  console.log(res.data);
  siteList.value = res.data;
};

// ===== lifecycle =====
onMounted(async () => {
  loading.value = true;
  try {
    loadData();
  } catch {
    alert("ไม่เจอ API SiteList");
  } finally {
    loading.value = false;
  }
});

// ===== search & filter =====
const filteredList = computed(() => {
  return siteList.value.filter((site) => {
    const matchSearch =
      !searchQuery.value ||
      site.site_id?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      site.region?.toLowerCase().includes(searchQuery.value.toLowerCase());
    return matchSearch;
  });
});

// ===== pagination logic =====
const totalPages = computed(() =>
  Math.ceil(filteredList.value.length / pageSize)
);

const paginatedList = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  return filteredList.value.slice(start, start + pageSize);
});

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

const handleSearch = () => {
  currentPage.value = 1;
};

const useFormatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("th-TH", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
};
</script>

<template>
  <div
    class="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-4 md:p-8 transition-colors duration-300"
  >
    <!-- Header -->
    <div class="mb-1 animate-fade-in">
      <h1
        class="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-400 dark:to-purple-400 mb-3"
      >
        PM NodeB List
      </h1>
    </div>

    <!-- Controls -->
    <div
      class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 animate-slide-down"
    >
      <div class="flex flex-col sm:flex-row gap-4 w-full md:w-auto flex-1">
        <!-- Year Select -->
        <select
          v-model="selectedYear"
          class="bg-white dark:bg-slate-800/60 border border-gray-300 dark:border-slate-700/50 rounded-xl px-4 py-3 text-gray-900 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm transition-all"
        >
          <option>2025/2026</option>
          <option>2026/2027</option>
          <option>2027/2028</option>
        </select>

        <!-- Search Input -->
        <div class="relative flex-1 min-w-[250px]">
          <svg
            class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500 pointer-events-none"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
          >
            <path
              d="M9 17A8 8 0 1 0 9 1a8 8 0 0 0 0 16zM19 19l-4.35-4.35"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <input
            v-model="searchQuery"
            @input="handleSearch"
            type="text"
            placeholder="Search Site ID or Region..."
            class="w-full bg-white dark:bg-slate-800/60 border border-gray-300 dark:border-slate-700/50 rounded-xl pl-10 pr-4 py-3 text-gray-900 dark:text-slate-200 placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm transition-all"
          />
        </div>
      </div>

      <!-- New Button -->
      <button
        @click="goNew"
        class="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-0.5 transition-all duration-300"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path
            d="M10 4v12M4 10h12"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
          />
        </svg>
        New Site PM
      </button>
    </div>

    <!-- Loading State -->
    <div
      v-if="loading"
      class="flex flex-col items-center justify-center py-16 animate-fade-in"
    >
      <div
        class="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mb-4"
      ></div>
      <p class="text-gray-600 dark:text-slate-400 text-lg">
        Loading site data...
      </p>
    </div>

    <!-- Table -->
    <div v-else class="animate-slide-up">
      <!-- Empty State -->
      <div
        v-if="paginatedList.length === 0"
        class="flex flex-col items-center justify-center py-16 text-gray-500 dark:text-slate-500 bg-white dark:bg-slate-800/40 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-slate-700/50 shadow-lg"
      >
        <svg
          width="64"
          height="64"
          viewBox="0 0 64 64"
          fill="none"
          class="mb-4 opacity-50"
        >
          <path
            d="M32 56c13.255 0 24-10.745 24-24S45.255 8 32 8 8 18.745 8 32s10.745 24 24 24z"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M22 32h20M32 22v20"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
          />
        </svg>
        <p class="text-lg font-semibold text-gray-600 dark:text-slate-400 mb-1">
          No sites found
        </p>
        <span class="text-sm text-gray-500 dark:text-slate-500">
          Try adjusting your search or filters
        </span>
      </div>

      <!-- Table Wrapper -->
      <div
        v-else
        class="bg-white dark:bg-slate-800/40 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-slate-700/50 shadow-lg overflow-hidden"
      >
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <!-- Table Head -->
            <thead>
              <tr
                class="bg-gradient-to-r from-blue-500/5 to-purple-500/5 dark:from-blue-500/10 dark:to-purple-500/10 border-b border-gray-200 dark:border-slate-700/50"
              >
                <!-- <th class="text-left px-6 py-4 text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider w-14">
                  #
                </th> -->
                <th
                  class="text-left px-6 py-4 text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider"
                >
                  Site Name
                </th>
                <th
                  class="text-left px-6 py-4 text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider"
                >
                  Cabinets
                </th>
                <th
                  class="text-left px-6 py-4 text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider"
                >
                  Mowing
                </th>
                <th
                  class="text-left px-6 py-4 text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider"
                >
                  Broadband
                </th>
                <th
                  class="text-left px-6 py-4 text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider"
                >
                  SolarCell
                </th>
                <th
                  class="text-left px-6 py-4 text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider"
                >
                  Region
                </th>
                <th
                  class="text-left px-6 py-4 text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider"
                >
                  Province
                </th>
                <th
                  class="text-left px-6 py-4 text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider"
                >
                  Vendor
                </th>
                <th
                  class="text-center px-6 py-4 text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider"
                >
                  Created By
                </th>
                <th
                  class="text-center px-6 py-4 text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider"
                >
                  Created At
                </th>
                <th
                  class="text-center px-6 py-4 text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider"
                >
                  Updated By
                </th>
                <th
                  class="text-center px-6 py-4 text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider"
                >
                  Updated At
                </th>
                <th
                  class="text-center px-6 py-4 text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider"
                >
                  Service Status
                </th>
                <th
                  class="text-left px-6 py-4 text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider"
                >
                  PM Date
                </th>
                <th
                  class="text-center px-6 py-4 text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider"
                >
                  Verify
                </th>
                <th
                  class="text-center px-6 py-4 text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>

            <!-- Table Body -->
            <tbody class="divide-y divide-gray-100 dark:divide-slate-700/50">
              <tr
                v-for="row in paginatedList"
                :key="row.id"
                class="group hover:bg-blue-50/50 dark:hover:bg-blue-500/5 transition-colors duration-150"
              >
                <!-- No. -->
                <!-- <td class="px-6 py-4">
                  <div
                    class="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs"
                  >
                    {{ (currentPage - 1) * pageSize + index + 1 }}
                  </div>
                </td> -->

                <!-- Site Name -->
                <td class="px-6 py-4">
                  <span class="font-semibold text-gray-800 dark:text-slate-200">
                    {{ row.site_name || "N/A" }}
                  </span>
                  <p
                    class="text-xs text-gray-400 dark:text-slate-500 font-mono mt-0.5"
                  >
                    {{ row.site_id || "" }}
                  </p>
                </td>

                <!-- Cabinets -->
                <td class="text-black dark:text-white px-6 py-4">
                  <div v-for="(cab, index) in row.cabinets" :key="index">
                    {{ cab.cabinet_name || "NONE" }}
                  </div>
                </td>

                <!-- Mowing -->
                <td class="text-black dark:text-white px-6 py-4">
                  <div v-for="(mow, index) in row.mowing" :key="index">
                    {{ mow.round || "NONE" }}
                  </div>
                </td>

                <!-- Broadband -->
                <td class="text-black dark:text-white px-6 py-4">
                  <div v-for="(bb, index) in row.broadband" :key="index">
                    {{ bb.count || "NONE" }}
                  </div>
                </td>

                <!-- Solar Cell -->
                <td class="text-black dark:text-white px-6 py-4">
                  <div v-for="(solar, index) in row.solarcell" :key="index">
                    {{ solar.status || "NONE" }}
                  </div>
                </td>

                <!-- Region -->
                <td class="px-6 py-4">
                  <div class="flex items-center gap-2">
                    <div
                      class="w-6 h-6 rounded-md bg-blue-500/10 flex items-center justify-center flex-shrink-0"
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 16 16"
                        fill="none"
                        class="text-blue-500 dark:text-blue-400"
                      >
                        <path
                          d="M8 14.667A6.667 6.667 0 1 0 8 1.333a6.667 6.667 0 0 0 0 13.334z"
                          stroke="currentColor"
                          stroke-width="1.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          d="M1.333 8h13.334M8 1.333A10.2 10.2 0 0 1 10.667 8 10.2 10.2 0 0 1 8 14.667 10.2 10.2 0 0 1 5.333 8 10.2 10.2 0 0 1 8 1.333z"
                          stroke="currentColor"
                          stroke-width="1.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </div>
                    <span class="text-gray-700 dark:text-slate-300">{{
                      row.region || "N/A"
                    }}</span>
                  </div>
                </td>

                <!-- Province -->
                <td class="text-black dark:text-white px-6 py-4"></td>

                <!-- Vendor -->
                <td class="text-black dark:text-white px-6 py-4">
                  {{ row.vendor || "NONE" }}
                </td>

                <!-- Created By -->
                <td class="text-black dark:text-white px-6 py-4">
                  {{ row.created_by || "NONE" }}
                </td>

                <!-- Created At -->
                <td class="px-6 py-4">
                  <div class="flex items-center gap-2">
                    <div
                      class="w-6 h-6 rounded-md bg-purple-500/10 flex items-center justify-center flex-shrink-0"
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 16 16"
                        fill="none"
                        class="text-purple-500 dark:text-purple-400"
                      >
                        <rect
                          x="2"
                          y="3.333"
                          width="12"
                          height="10.667"
                          rx="2"
                          stroke="currentColor"
                          stroke-width="1.5"
                        />
                        <path
                          d="M10.667 2v2.667M5.333 2v2.667M2 7.333h12"
                          stroke="currentColor"
                          stroke-width="1.5"
                          stroke-linecap="round"
                        />
                      </svg>
                    </div>
                    <span
                      class="text-gray-700 dark:text-slate-300 font-mono text-sm"
                    >
                      {{ useFormatDate(row.created_at) || "NONE" }}
                    </span>
                  </div>
                </td>

                <!-- Updated By -->
                <td class="text-black dark:text-white px-6 py-4">
                  {{ row.updated_by || "No Updated" }}
                </td>

                <!-- Updated At -->
                <td class="px-6 py-4">
                  <div class="flex items-center gap-2">
                    <div
                      class="w-6 h-6 rounded-md bg-purple-500/10 flex items-center justify-center flex-shrink-0"
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 16 16"
                        fill="none"
                        class="text-purple-500 dark:text-purple-400"
                      >
                        <rect
                          x="2"
                          y="3.333"
                          width="12"
                          height="10.667"
                          rx="2"
                          stroke="currentColor"
                          stroke-width="1.5"
                        />
                        <path
                          d="M10.667 2v2.667M5.333 2v2.667M2 7.333h12"
                          stroke="currentColor"
                          stroke-width="1.5"
                          stroke-linecap="round"
                        />
                      </svg>
                    </div>
                    <span
                      class="text-gray-700 dark:text-slate-300 font-mono text-sm"
                    >
                      {{ useFormatDate(row.updated_at) || "No Updated" }}
                    </span>
                  </div>
                </td>

                <!-- Status -->
                <td class="px-6 py-4 text-center">
                  <span
                    class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
                    :class="{
                      'bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-400':
                        row.service_status === 'onService',
                      'bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400':
                        row.service_status === 'cancel',
                      'bg-gray-100 text-gray-600 dark:bg-gray-500/15 dark:text-gray-400':
                        row.service_status === '' || !row.service_status,
                    }"
                  >
                    <span
                      class="w-1.5 h-1.5 rounded-full"
                      :class="{
                        'bg-green-500': row.service_status === 'onService',
                        'bg-red-500': row.service_status === 'cancel',
                        'bg-gray-400':
                          row.service_status === '' || !row.service_status,
                      }"
                    ></span>
                    {{
                      row.service_status === "onService"
                        ? "On Service"
                        : row.service_status === "cancel"
                        ? "Cancelled"
                        : "Unknown"
                    }}
                  </span>
                </td>

                <!-- PM Date -->
                <td class="px-6 py-4">
                  <div class="flex items-center gap-2">
                    <div
                      class="w-6 h-6 rounded-md bg-purple-500/10 flex items-center justify-center flex-shrink-0"
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 16 16"
                        fill="none"
                        class="text-purple-500 dark:text-purple-400"
                      >
                        <rect
                          x="2"
                          y="3.333"
                          width="12"
                          height="10.667"
                          rx="2"
                          stroke="currentColor"
                          stroke-width="1.5"
                        />
                        <path
                          d="M10.667 2v2.667M5.333 2v2.667M2 7.333h12"
                          stroke="currentColor"
                          stroke-width="1.5"
                          stroke-linecap="round"
                        />
                      </svg>
                    </div>
                    <span
                      class="text-gray-700 dark:text-slate-300 font-mono text-sm"
                    >
                      {{ useFormatDate(row.date) || "Not scheduled" }}
                    </span>
                  </div>
                </td>

                <!-- Verify -->
                <td class="text-black dark:text-white px-6 py-4">
                  {{ row.verify || "NONE" }}
                </td>

                <!-- Actions -->
                <td class="px-6 py-4">
                  <div class="flex items-center justify-center gap-2">
                    <!-- View -->
                    <button
                      @click="goView(row.id)"
                      title="View"
                      class="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-blue-500/10 dark:bg-blue-500/15 border border-blue-500/30 hover:bg-blue-500/20 dark:hover:bg-blue-500/25 hover:border-blue-500/50 text-blue-600 dark:text-blue-300 transition-all duration-200 hover:-translate-y-0.5"
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 16 16"
                        fill="none"
                      >
                        <path
                          d="M1 8s3-5 7-5 7 5 7 5-3 5-7 5-7-5-7-5z"
                          stroke="currentColor"
                          stroke-width="1.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <circle
                          cx="8"
                          cy="8"
                          r="2"
                          stroke="currentColor"
                          stroke-width="1.5"
                        />
                      </svg>
                    </button>

                    <!-- Edit -->
                    <button
                      @click="goEdit(row.id)"
                      title="Edit"
                      class="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-purple-500/10 dark:bg-purple-500/15 border border-purple-500/30 hover:bg-purple-500/20 dark:hover:bg-purple-500/25 hover:border-purple-500/50 text-purple-600 dark:text-purple-300 transition-all duration-200 hover:-translate-y-0.5"
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 16 16"
                        fill="none"
                      >
                        <path
                          d="M11.333 2A1.886 1.886 0 0 1 14 4.667l-9 9-3.667 1 1-3.667 9-9z"
                          stroke="currentColor"
                          stroke-width="1.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </button>

                    <!-- Delete -->
                    <button
                      @click="handleDelete(row.id)"
                      title="Delete"
                      class="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-red-500/10 dark:bg-red-500/15 border border-red-500/30 hover:bg-red-500/20 dark:hover:bg-red-500/25 hover:border-red-500/50 text-red-600 dark:text-red-300 transition-all duration-200 hover:-translate-y-0.5"
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 16 16"
                        fill="none"
                      >
                        <path
                          d="M2 4h12M5.333 4V2.667a1.333 1.333 0 011.334-1.334h2.666a1.333 1.333 0 011.334 1.334V4m2 0v9.333a1.333 1.333 0 01-1.334 1.334H4.667a1.333 1.333 0 01-1.334-1.334V4h9.334z"
                          stroke="currentColor"
                          stroke-width="1.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Table Footer: row count -->
        <div
          class="px-6 py-3 border-t border-gray-100 dark:border-slate-700/50 flex items-center justify-between bg-gray-50/50 dark:bg-slate-900/20"
        >
          <span class="text-xs text-gray-500 dark:text-slate-500">
            Showing {{ (currentPage - 1) * pageSize + 1 }}–{{
              Math.min(currentPage * pageSize, filteredList.length)
            }}
            of {{ filteredList.length }} entries
          </span>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div
      v-if="!loading && paginatedList.length > 0"
      class="flex justify-center items-center gap-6 mt-6 animate-fade-in"
    >
      <button
        @click="prevPage"
        :disabled="currentPage === 1"
        class="flex items-center gap-2 bg-white dark:bg-slate-800/60 border border-gray-300 dark:border-slate-700/50 hover:bg-gray-50 dark:hover:bg-slate-800 hover:border-blue-400 dark:hover:border-blue-500/40 disabled:opacity-30 disabled:cursor-not-allowed text-gray-700 dark:text-slate-300 px-5 py-2.5 rounded-xl font-medium transition-all duration-200 backdrop-blur-sm disabled:hover:bg-white dark:disabled:hover:bg-slate-800/60 disabled:hover:border-gray-300 dark:disabled:hover:border-slate-700/50"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path
            d="M12.5 15l-5-5 5-5"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        Previous
      </button>

      <div class="flex items-center gap-2 font-mono font-medium">
        <span class="text-blue-500 dark:text-blue-400 text-xl">{{
          currentPage
        }}</span>
        <span class="text-gray-400 dark:text-slate-600">/</span>
        <span class="text-gray-600 dark:text-slate-400">{{ totalPages }}</span>
      </div>

      <button
        @click="nextPage"
        :disabled="currentPage === totalPages"
        class="flex items-center gap-2 bg-white dark:bg-slate-800/60 border border-gray-300 dark:border-slate-700/50 hover:bg-gray-50 dark:hover:bg-slate-800 hover:border-blue-400 dark:hover:border-blue-500/40 disabled:opacity-30 disabled:cursor-not-allowed text-gray-700 dark:text-slate-300 px-5 py-2.5 rounded-xl font-medium transition-all duration-200 backdrop-blur-sm disabled:hover:bg-white dark:disabled:hover:bg-slate-800/60 disabled:hover:border-gray-300 dark:disabled:hover:border-slate-700/50"
      >
        Next
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path
            d="M7.5 15l5-5-5-5"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>
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

@keyframes slide-down {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slide-up {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.6s ease-out;
}
.animate-slide-down {
  animation: slide-down 0.6s ease-out 0.1s both;
}
.animate-slide-up {
  animation: slide-up 0.6s ease-out 0.2s both;
}
</style>