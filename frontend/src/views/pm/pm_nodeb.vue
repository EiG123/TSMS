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

// ===== lifecycle =====
onMounted(async () => {
  loading.value = true;
  try {
    const res = await getPmList.getPmList();
    console.log(res.data);
    siteList.value = res.data;
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

// Reset to page 1 when search changes
const handleSearch = () => {
  currentPage.value = 1;
};
</script>

<template>
  <div
    class="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 md:p-8"
  >
    <!-- Header -->
    <div class="mb-8 animate-fade-in">
      <h1
        class="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-2"
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
          class="bg-slate-800/60 border border-slate-700/50 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm transition-all"
        >
          <option>2025/2026</option>
          <option>2026/2027</option>
          <option>2027/2028</option>
        </select>

        <!-- Search Input -->
        <div class="relative flex-1 min-w-[250px]">
          <svg
            class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
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
            class="w-full bg-slate-800/60 border border-slate-700/50 rounded-xl pl-10 pr-4 py-3 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm transition-all"
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
      <p class="text-slate-400 text-lg">Loading site data...</p>
    </div>

    <!-- Card Grid -->
    <div v-else class="animate-slide-up">
      <!-- Empty State -->
      <div
        v-if="paginatedList.length === 0"
        class="flex flex-col items-center justify-center py-16 text-slate-500 bg-slate-800/40 backdrop-blur-xl rounded-2xl border border-slate-700/50"
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
        <p class="text-lg font-semibold text-slate-400 mb-1">No sites found</p>
        <span class="text-sm text-slate-500"
          >Try adjusting your search or filters</span
        >
      </div>

      <!-- Cards Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="(row, index) in paginatedList"
          :key="row.id"
          class="group bg-slate-800/40 backdrop-blur-xl rounded-2xl border border-slate-700/50 overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/40"
        >
          <!-- Card Header -->
          <div
            class="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-b border-slate-700/50 px-6 py-4"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div
                  class="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm"
                >
                  {{ (currentPage - 1) * pageSize + index + 1 }}
                </div>
                <div>
                  <h3 class="text-slate-300 font-semibold text-lg">
                    {{ row.site_name || "N/A" }}
                  </h3>
                  <p class="text-slate-500 text-xs font-mono">Site ID</p>
                </div>
              </div>
              <!-- Status Indicator -->
              <div
                class="w-2 h-2 rounded-full shadow-lg"
                :class="{
                  'bg-green-500 shadow-green-500/50':
                    row.service_status === 'onService',
                  'bg-red-500 shadow-red-500/50': row.service_status === 'cancel',
                  'bg-gray-500 shadow-gray-500/50': row.service_status === '',
                }"
              ></div>
            </div>
          </div>

          <!-- Card Body -->
          <div class="px-6 py-5 space-y-4">
            <!-- Region -->
            <div class="flex items-center gap-3">
              <div
                class="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  class="text-blue-400"
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
              <div class="flex-1 min-w-0">
                <p class="text-xs text-slate-500 uppercase tracking-wide">
                  Region
                </p>
                <p class="text-slate-300 font-medium truncate">
                  {{ row.region || "N/A" }}
                </p>
              </div>
            </div>

            <!-- PM Date -->
            <div class="flex items-center gap-3">
              <div
                class="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center flex-shrink-0"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  class="text-purple-400"
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
              <div class="flex-1 min-w-0">
                <p class="text-xs text-slate-500 uppercase tracking-wide">
                  PM Date
                </p>
                <p
                  class="text-slate-300 font-medium font-mono text-sm truncate"
                >
                  {{ row.date || "Not scheduled" }}
                </p>
              </div>
            </div>
          </div>

          <!-- Card Footer -->
          <div
            class="px-6 py-4 bg-slate-900/40 border-t border-slate-700/50 flex gap-2"
          >
            <button
              @click="goView(row.id)"
              class="flex-1 inline-flex items-center justify-center gap-1.5 bg-blue-500/15 border border-blue-500/30 hover:bg-blue-500/25 hover:border-blue-500/50 text-blue-300 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 hover:-translate-y-0.5"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
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
              View
            </button>
            <button
              @click="goEdit(row.id)"
              class="flex-1 inline-flex items-center justify-center gap-1.5 bg-purple-500/15 border border-purple-500/30 hover:bg-purple-500/25 hover:border-purple-500/50 text-purple-300 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 hover:-translate-y-0.5"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M11.333 2A1.886 1.886 0 0 1 14 4.667l-9 9-3.667 1 1-3.667 9-9z"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              Edit
            </button>
            <button
              @click="handleDelete(row.id)"
              class="flex-1 inline-flex items-center justify-center gap-1.5 bg-red-500/15 border border-red-500/30 hover:bg-red-500/25 hover:border-red-500/50 text-red-300 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 hover:-translate-y-0.5"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M11.333 2A1.886 1.886 0 0 1 14 4.667l-9 9-3.667 1 1-3.667 9-9z"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              Delete
            </button>
          </div>
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
        class="flex items-center gap-2 bg-slate-800/60 border border-slate-700/50 hover:bg-slate-800 hover:border-blue-500/40 disabled:opacity-30 disabled:cursor-not-allowed text-slate-300 px-5 py-2.5 rounded-xl font-medium transition-all duration-200 backdrop-blur-sm disabled:hover:bg-slate-800/60 disabled:hover:border-slate-700/50"
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
        <span class="text-blue-400 text-xl">{{ currentPage }}</span>
        <span class="text-slate-600">/</span>
        <span class="text-slate-400">{{ totalPages }}</span>
      </div>

      <button
        @click="nextPage"
        :disabled="currentPage === totalPages"
        class="flex items-center gap-2 bg-slate-800/60 border border-slate-700/50 hover:bg-slate-800 hover:border-blue-500/40 disabled:opacity-30 disabled:cursor-not-allowed text-slate-300 px-5 py-2.5 rounded-xl font-medium transition-all duration-200 backdrop-blur-sm disabled:hover:bg-slate-800/60 disabled:hover:border-slate-700/50"
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