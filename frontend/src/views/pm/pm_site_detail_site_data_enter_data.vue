<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getPmList } from "../../services/pm_nodeb_list.api";
import { pmServiceManage } from "../../services/pmServiceManage.api";
import { useAuthStore } from "../../stores/auth";
import { pmTitleManage } from "../../services/PmTitle/pmTitleManage.api";

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const props = defineProps<{
  id: string;
  title?: string;
  title_id?: any;
}>();

const pmId = computed(() => props.id);
const title = computed(() => props.title);
const title_id = computed(() => props.title_id);

const loading = ref(false);
const pMsiteData = ref<any>(null);
const title_child_list = ref<any[]>([]);
const showModules = ref(true);

const hide = () => {
  showModules.value = !showModules.value;
};

const goBack = () => {
  router.back();
};

// Group title_child by title_child_name
const groupedTitleChild = computed(() => {
  const groups: Record<string, any[]> = {};

  title_child_list.value.forEach((item) => {
    const groupName = item.title_child_name || "Uncategorized";

    if (!groups[groupName]) {
      groups[groupName] = [];
    }

    groups[groupName].push(item);
  });

  return groups;
});

onMounted(async () => {
  loading.value = true;
  try {
    const res_title_child = await pmTitleManage.getTitleChildByTitle({
      title: title.value,
      title_id: title_id.value,
    });
    title_child_list.value = res_title_child.data.result || [];
    console.log("Title Child List:", title_child_list.value);
  } catch (error) {
    console.error("Failed to load title child:", error);
  } finally {
    loading.value = false;
  }
});

const handleEnterData = (title_id: any, title_child_id: any) => {
  router.push({
    name: "pm_enter_data",
    query: { pmId: pmId.value, title_id: title_id, title_child_id: title_child_id},
  });
};
</script>

<template>
  <div
    class="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 md:p-8"
  >
    <!-- Loading State -->
    <div
      v-if="loading"
      class="flex flex-col items-center justify-center h-96 animate-fade-in"
    >
      <div
        class="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mb-4"
      ></div>
      <p class="text-slate-400 text-lg">Loading checklist...</p>
    </div>

    <!-- Main Content -->
    <div v-else class="max-w-7xl mx-auto space-y-6 animate-slide-up">
      <!-- Back Button -->
      <button
        @click="goBack"
        class="flex items-center gap-2 text-slate-400 hover:text-slate-200 transition-colors duration-200 mb-4"
      >
        <svg
          class="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 19l-7-7 7-7"
          />
        </svg>
        <span class="font-medium">Back</span>
      </button>

      <!-- Header Section -->
      <div
        class="bg-slate-800/40 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-2xl overflow-hidden"
      >
        <div class="relative">
          <div
            class="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10"
          ></div>

          <div class="relative px-8 py-6">
            <div class="flex items-center gap-4">
              <div
                class="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/30"
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
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                  />
                </svg>
              </div>
              <div>
                <h1
                  class="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400"
                >
                  {{ title }}
                </h1>
                <p class="text-slate-400 mt-1">
                  {{ Object.keys(groupedTitleChild).length }} categories •
                  {{ title_child_list.length }} items
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Grouped Title Child List -->
      <div class="space-y-6">
        <div
          v-for="(items, groupName) in groupedTitleChild"
          :key="groupName"
          class="bg-slate-800/40 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-lg overflow-hidden"
        >
          <!-- Group Header -->
          <div
            class="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-b border-slate-700/50 px-6 py-4"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div
                  class="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/30"
                >
                  <svg
                    class="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 class="text-xl font-semibold text-slate-200">
                    {{ groupName }}
                  </h3>
                  <p class="text-sm text-slate-400 mt-0.5">
                    {{ items.length }}
                    {{ items.length === 1 ? "item" : "items" }}
                  </p>
                </div>
              </div>

              <div
                class="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-lg text-sm font-semibold border border-blue-500/30"
              >
                {{ items.length }} Total
              </div>
            </div>
          </div>

          <!-- Group Items -->
          <div class="p-6">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div
                v-for="(item, index) in items"
                :key="index"
                class="group bg-slate-900/40 border border-slate-700/50 rounded-xl overflow-hidden hover:bg-slate-900/60 hover:border-blue-500/40 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-1"
              >
                <!-- Enter Data Button -->
                <button
                  @click="handleEnterData(item.title_id, item.id)"
                  class="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-lg shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all duration-200 hover:-translate-y-0.5"
                >
                  <svg
                    class="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  Enter Data
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div
        v-if="Object.keys(groupedTitleChild).length === 0"
        class="bg-slate-800/40 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-lg p-12"
      >
        <div class="text-center">
          <div
            class="w-20 h-20 bg-blue-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4"
          >
            <svg
              class="w-10 h-10 text-blue-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-slate-300 mb-2">
            No Checklist Items
          </h3>
          <p class="text-slate-400">No items found for this category</p>
        </div>
      </div>

      <!-- Summary Stats -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div
          class="bg-slate-800/40 backdrop-blur-xl rounded-xl border border-slate-700/50 p-6"
        >
          <div class="flex items-center gap-4">
            <div
              class="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center"
            >
              <svg
                class="w-6 h-6 text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                />
              </svg>
            </div>
            <div>
              <p class="text-sm text-slate-400">Categories</p>
              <p class="text-2xl font-bold text-slate-200">
                {{ Object.keys(groupedTitleChild).length }}
              </p>
            </div>
          </div>
        </div>

        <div
          class="bg-slate-800/40 backdrop-blur-xl rounded-xl border border-slate-700/50 p-6"
        >
          <div class="flex items-center gap-4">
            <div
              class="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center"
            >
              <svg
                class="w-6 h-6 text-purple-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <div>
              <p class="text-sm text-slate-400">Total Items</p>
              <p class="text-2xl font-bold text-slate-200">
                {{ title_child_list.length }}
              </p>
            </div>
          </div>
        </div>

        <div
          class="bg-slate-800/40 backdrop-blur-xl rounded-xl border border-slate-700/50 p-6"
        >
          <div class="flex items-center gap-4">
            <div
              class="w-12 h-12 rounded-lg bg-yellow-500/20 flex items-center justify-center"
            >
              <svg
                class="w-6 h-6 text-yellow-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <p class="text-sm text-slate-400">Status</p>
              <p class="text-lg font-bold text-yellow-400">Pending</p>
            </div>
          </div>
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