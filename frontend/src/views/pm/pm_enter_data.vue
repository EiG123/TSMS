<script setup lang="ts">
import { onMounted, ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { pmServiceManage } from "../../services/pmServiceManage.api";
import { pmTitleManage } from "../../services/PmTitle/pmTitleManage.api";
import { PMApiService } from "../../services/pm_nodeb.api";
import { useAuthStore } from "../../stores/auth";

const router = useRouter();
const authStore = useAuthStore();
const username = authStore.currentUser;

// Loading state
const isSubmitting = ref(false);
const loading = ref(false);

const props = defineProps<{
  pmId?: any;
  title_id?: any;
  title_child_id?: any;
}>();

const pmId = computed(() => props.pmId);
const title_id = computed(() => props.title_id);
const title_child_id = computed(() => props.title_child_id);

const handleCancel = () => {
  router.back();
};

const title_child_value_list = ref<any[]>([]);
const formData = ref<Record<string, any>>({});

onMounted(async () => {
  loading.value = true;
  try {
    const res_title_child_value = await pmTitleManage.getTitleChildValueByTitle(
      {
        title_id: title_id.value,
        title_child_id: title_child_id.value,
      }
    );
    title_child_value_list.value = res_title_child_value.data.result || [];
    console.log(title_child_value_list.value);

    // Initialize formData with default values
    title_child_value_list.value.forEach((item) => {
      formData.value[item.id] = item.default_value || "";
    });

    const idList = title_child_value_list.value.map((item) => item.id);

    const valuePmByIdTitleIdTitleChildId =
      await pmServiceManage.valuePmByIdTitleIdTitleChildId({
        pmId: pmId.value,
        title_child_value_list: idList,
      });

    console.log(valuePmByIdTitleIdTitleChildId.data);

    // ✅ เอาข้อมูลเก่ามาใส่ใน formData เพื่อ edit
    const existingValues = valuePmByIdTitleIdTitleChildId.data;
    Object.values(existingValues).forEach((item: any) => {
      if (item.title_child_value_id in formData.value) {
        formData.value[item.title_child_value_id] = item.value;
      }
    });
  } catch (error) {
    console.error("Failed to load data:", error);
  } finally {
    loading.value = false;
  }
});

const handleSubmit = async () => {
  if (isSubmitting.value) return;

  isSubmitting.value = true;

  try {
    // Prepare data for submission
    const submitData = title_child_value_list.value.map((item) => ({
      pmId: pmId.value,
      title_child_value_id: item.id,
      value: formData.value[item.id],
    }));

    console.log("Submitting:", submitData);

    // Call your API here
    await PMApiService.PmsubmitData(submitData);

    alert("Data saved successfully!");
    router.back();
  } catch (error) {
    console.error("Submit failed:", error);
    alert("Failed to save data");
  } finally {
    isSubmitting.value = false;
  }
};

// Get icon based on input type
const getInputIcon = (inputType: string) => {
  const icons: Record<string, string> = {
    text: "M4 6h16M4 12h16M4 18h16",
    number: "M7 20l4-16m2 16l4-16M6 9h14M4 15h14",
    date: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
    select: "M4 6h16M4 10h16M4 14h16M4 18h16",
    checkbox: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
    textarea:
      "M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z",
  };
  return icons[inputType] || icons.text;
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
      <p class="text-slate-400 text-lg">Loading form...</p>
    </div>

    <!-- Main Content -->
    <form
      v-else
      @submit.prevent="handleSubmit"
      class="max-w-4xl mx-auto space-y-6 animate-slide-up"
    >
      <!-- Back Button -->
      <button
        type="button"
        @click="handleCancel"
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
            class="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10"
          ></div>

          <div class="relative px-8 py-6">
            <div class="flex items-center gap-4">
              <div
                class="w-14 h-14 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/30"
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
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </div>
              <div>
                <h1
                  class="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400"
                >
                  Enter Data
                </h1>
                <p class="text-slate-400 mt-1">
                  {{ title_child_value_list.length }} fields to complete
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Form Fields -->
      <div
        class="bg-slate-800/40 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-lg overflow-hidden"
      >
        <div class="p-8 space-y-6">
          <div
            v-for="(item, index) in title_child_value_list"
            :key="index"
            class="space-y-3"
          >
            <!-- Field Label -->
            <label
              class="flex items-center gap-2 text-sm font-medium text-slate-300"
            >
              <svg
                class="w-4 h-4 text-slate-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  :d="getInputIcon(item.input_type)"
                />
              </svg>
              {{ item.name }}
              <span v-if="item.required" class="text-red-400">*</span>
            </label>

            <!-- Text Input -->
            <div v-if="item.input_type === 'text'" class="relative">
              <input
                v-model="formData[item.id]"
                type="text"
                :placeholder="`Enter ${item.name.toLowerCase()}`"
                :required="item.required"
                class="w-full px-4 py-3 bg-slate-900/40 border border-slate-700/50 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              />
            </div>

            <!-- Number Input -->
            <div v-else-if="item.input_type === 'number'" class="relative">
              <input
                v-model.number="formData[item.id]"
                type="number"
                min="0"
                :placeholder="`Enter ${item.name.toLowerCase()}`"
                :required="item.required"
                class="w-full px-4 py-3 bg-slate-900/40 border border-slate-700/50 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              />
            </div>

            <!-- Date Input -->
            <div v-else-if="item.input_type === 'date'" class="relative">
              <input
                v-model="formData[item.id]"
                type="date"
                :required="item.required"
                class="w-full px-4 py-3 bg-slate-900/40 border border-slate-700/50 rounded-xl text-slate-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              />
            </div>

            <!-- Datetime Input -->
            <div v-else-if="item.input_type === 'datetime'" class="relative">
              <input
                v-model="formData[item.id]"
                type="datetime-local"
                :required="item.required"
                class="w-full px-4 py-3 bg-slate-900/40 border border-slate-700/50 rounded-xl text-slate-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              />
            </div>

            <!-- Select Input -->
            <div v-else-if="item.input_type === 'select'" class="relative">
              <select
                v-model="formData[item.id]"
                :required="item.required"
                class="w-full px-4 py-3 bg-slate-900/40 border border-slate-700/50 rounded-xl text-slate-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              >
                <option value="" class="bg-slate-800">
                  Select an option...
                </option>
                <option
                  v-for="option in item.options"
                  :key="option.value"
                  :value="option.value"
                  class="bg-slate-800"
                >
                  {{ option.label }}
                </option>
              </select>
            </div>

            <!-- Textarea Input -->
            <div v-else-if="item.input_type === 'textarea'" class="relative">
              <textarea
                v-model="formData[item.id]"
                :placeholder="`Enter ${item.name.toLowerCase()}`"
                :required="item.required"
                rows="4"
                class="w-full px-4 py-3 bg-slate-900/40 border border-slate-700/50 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all resize-none"
              ></textarea>
            </div>

            <!-- Checkbox Input -->
            <div v-else-if="item.input_type === 'checkbox'" class="relative">
              <label
                class="flex items-center gap-3 p-4 bg-slate-900/40 border border-slate-700/50 rounded-xl cursor-pointer hover:bg-slate-900/60 transition-all"
              >
                <input
                  v-model="formData[item.id]"
                  type="checkbox"
                  class="w-5 h-5 text-green-500 bg-slate-800 border-slate-600 rounded focus:ring-2 focus:ring-green-500 focus:ring-offset-0"
                />
                <span class="text-slate-300">{{
                  item.checkbox_label || "Check this option"
                }}</span>
              </label>
            </div>

            <!-- Help Text -->
            <p
              v-if="item.help_text"
              class="text-xs text-slate-500 flex items-center gap-1"
            >
              <svg
                class="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {{ item.help_text }}
            </p>

            <!-- Divider (except for last item) -->
            <div
              v-if="index < title_child_value_list.length - 1"
              class="pt-3 border-b border-slate-700/30"
            ></div>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div
        class="flex flex-col sm:flex-row justify-end gap-4 bg-slate-800/40 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6"
      >
        <button
          type="button"
          @click="handleCancel"
          class="px-8 py-3.5 bg-slate-700/50 border border-slate-600/50 text-slate-200 font-semibold rounded-xl hover:bg-slate-700 hover:border-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-500 transition-all duration-200"
        >
          <span class="flex items-center justify-center gap-2">
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            Cancel
          </span>
        </button>

        <button
          type="submit"
          :disabled="isSubmitting"
          class="px-8 py-3.5 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold rounded-xl shadow-lg shadow-green-500/30 hover:shadow-green-500/50 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-green-500/20 transition-all duration-300"
        >
          <span
            v-if="isSubmitting"
            class="flex items-center justify-center gap-2"
          >
            <svg class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Saving...
          </span>
          <span v-else class="flex items-center justify-center gap-2">
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
                d="M5 13l4 4L19 7"
              />
            </svg>
            Save Data
          </span>
        </button>
      </div>
    </form>
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

/* Custom scrollbar for dark theme */
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
</style>