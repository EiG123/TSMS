<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { PMApiService } from "../../services/pm_nodeb.api";
import { ApiGetData } from "../../services/pmGetSiteData.api";
const router = useRouter();
const route = useRoute();

// Get ID from route params
const pmId = ref(route.params.id as string);

// Loading state
const isSubmitting = ref(false);
const isLoading = ref(false);

const showPmInfo = ref(true);

// Form data
const site_id = ref("");
const region = ref("");
const datetime = ref("");
const status = ref("");
const generator = ref("");
const transformer = ref("");
const kwh_meter = ref("");
const solar_cell = ref("");
const mowing = ref("");
const created_by = ref("");
const remark = ref("");

// Checkbox states
const generatorEnabled = ref(false);
const transformerEnabled = ref(false);
let kwhMeterEnabled = ref(false);
const solarCellEnabled = ref(false);
const mowingEnabled = ref(false);

// KWH Meter specific states
let kwhMeterCount = ref(1);
let kwh_meters = ref();

// Load existing data
onMounted(async () => {
  isLoading.value = true;
  try {
    // TODO: Replace with your actual API call to get PM data by ID
    const data = await ApiGetData.getDataById(pmId.value);
    console.log(data);
    // Mock data for demonstration
    // Uncomment and replace with actual API call

    site_id.value = data.data.pm_nodeb[0].site_id;
    // region.value = data.region;
    datetime.value = data.data.pm_nodeb[0].datetime;
    // status.value = data.status;
    // generator.value = data.generator;
    // transformer.value = data.transformer;
    kwhMeterEnabled = ref(true);
    kwhMeterCount = ref(data.data.pm_kwh_meter.length);
    kwh_meters = ref(data.data.pm_kwh_meter);
    // solar_cell.value = data.solar_cell;
    // mowing.value = data.mowing;
    // created_by.value = data.created_by;
    // remark.value = data.remark;

    // // Set checkboxes based on data
    // generatorEnabled.value = !!data.generator;
    // transformerEnabled.value = !!data.transformer;
    // kwhMeterEnabled.value = !!data.kwh_meter;
    // solarCellEnabled.value = !!data.solar_cell;
    // mowingEnabled.value = !!data.mowing;
  } catch (error) {
    console.error("Error loading PM data:", error);
    alert("ไม่สามารถโหลดข้อมูลได้");
  } finally {
    isLoading.value = false;
  }
});

const togglePmInfo = () => {
  showPmInfo.value = !showPmInfo.value;
};

// const handleUpdate = async () => {
//   if (isSubmitting.value) return;

//   isSubmitting.value = true;

//   try {
//     // TODO: Replace with your actual update API call
//     const pmResult = await PMApiService.updatePmNodeB(
//       pmId.value,
//       site_id.value,
//       region.value,
//       datetime.value,
//       status.value,
//       generatorEnabled.value ? generator.value : "",
//       transformerEnabled.value ? transformer.value : "",
//       kwhMeterEnabled.value ? kwh_meter.value : "",
//       solarCellEnabled.value ? solar_cell.value : "",
//       mowingEnabled.value ? mowing.value : "",
//       created_by.value,
//       remark.value
//     );

//     if (pmResult.success) {
//       alert("อัพเดทข้อมูลสำเร็จ");
//       router.push("/pm_nodeb");
//     } else {
//       alert(pmResult.message || "ไม่สามารถอัพเดทข้อมูลได้");
//     }
//   } catch (error) {
//     console.error("PM NodeB Update Error:", error);
//     alert("เกิดข้อผิดพลาด: " + (error.message || "ไม่สามารถอัพเดทข้อมูลได้"));
//   } finally {
//     isSubmitting.value = false;
//   }
// };

// Watch for count changes
watch(kwhMeterCount, (newCount) => {
  const currentLength = kwh_meters.value.length;

  if (newCount > currentLength) {
    // เพิ่มช่องใหม่
    for (let i = currentLength; i < newCount; i++) {
      kwh_meters.value.push({ phase: "P1" });
    }
  } else if (newCount < currentLength) {
    // ลดช่อง
    kwh_meters.value = kwh_meters.value.slice(0, newCount);
  }
});

// Reset เมื่อ disable checkbox
watch(kwhMeterEnabled, (enabled) => {
  if (!enabled) {
    kwhMeterCount.value = 1;
    kwh_meters.value = [{ phase: "P1" }];
  }
});

const handleCancel = () => {
  router.push("/pm_nodeb");
};
</script>

<template>
  <div
    class="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 md:p-8"
  >
    <!-- Header -->
    <div class="mb-8 animate-fade-in">
      <div class="flex items-center gap-3 mb-2">
        <button
          @click="handleCancel"
          class="text-slate-400 hover:text-slate-200 transition-colors"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M19 12H5M5 12l7 7M5 12l7-7"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>
        <h1
          class="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400"
        >
          Edit Site PM
        </h1>
      </div>
      <p class="text-slate-400 text-lg ml-12">
        Update preventive maintenance information
      </p>
    </div>

    <!-- Loading State -->
    <div
      v-if="isLoading"
      class="flex flex-col items-center justify-center py-16 animate-fade-in"
    >
      <div
        class="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mb-4"
      ></div>
      <p class="text-slate-400 text-lg">Loading PM data...</p>
    </div>

    <!-- Form -->
    <form
      v-else
      @submit.prevent="handleUpdate"
      class="max-w-4xl animate-slide-up"
    >
      <!-- PM Information Section -->
      <div
        class="bg-slate-800/40 backdrop-blur-xl rounded-2xl border border-slate-700/50 overflow-hidden shadow-2xl mb-6"
      >
        <div
          @click="togglePmInfo"
          class="flex justify-between items-center p-6 cursor-pointer hover:bg-slate-700/20 transition-colors"
        >
          <h2 class="text-2xl font-bold text-slate-200">PM Information</h2>
          <button
            type="button"
            class="text-slate-400 hover:text-slate-200 transition-colors text-2xl font-bold w-8 h-8 flex items-center justify-center"
          >
            {{ showPmInfo ? "−" : "+" }}
          </button>
        </div>

        <transition name="slide">
          <div v-show="showPmInfo" class="p-6 pt-0 space-y-5">
            <!-- Site ID -->
            <div class="form-group">
              <label class="block text-sm font-semibold text-slate-300 mb-2">
                Site ID <span class="text-red-400">*</span>
              </label>
              <input
                v-model="site_id"
                type="text"
                required
                class="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            <!-- Region -->
            <div class="form-group">
              <label class="block text-sm font-semibold text-slate-300 mb-2">
                Region <span class="text-red-400">*</span>
              </label>
              <select
                v-model="region"
                class="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="">Select...</option>
                <option value="UPC01">UPC01</option>
                <option value="UPC02">UPC02</option>
              </select>
            </div>

            <!-- PM Date -->
            <div class="form-group">
              <label class="block text-sm font-semibold text-slate-300 mb-2">
                PM Date <span class="text-red-400">*</span>
              </label>
              <input
                v-model="datetime"
                type="datetime-local"
                required
                class="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            <!-- Service Status -->
            <div class="form-group">
              <label class="block text-sm font-semibold text-slate-300 mb-2">
                Service Status <span class="text-red-400">*</span>
              </label>
              <select
                v-model="status"
                class="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="">Select...</option>
                <option value="onService">On Service</option>
                <option value="cancel">Cancel</option>
              </select>
            </div>

            <!-- Generator -->
            <div class="form-group">
              <label
                class="flex items-center gap-3 text-sm font-semibold text-slate-300 mb-2"
              >
                <input
                  v-model="generatorEnabled"
                  type="checkbox"
                  class="w-5 h-5 rounded border-slate-600 text-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 focus:ring-offset-slate-900 bg-slate-900"
                />
                Generator
              </label>
              <input
                v-model="generator"
                type="text"
                :disabled="!generatorEnabled"
                class="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              />
            </div>

            <!-- Transformer -->
            <div class="form-group">
              <label
                class="flex items-center gap-3 text-sm font-semibold text-slate-300 mb-2"
              >
                <input
                  v-model="transformerEnabled"
                  type="checkbox"
                  class="w-5 h-5 rounded border-slate-600 text-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 focus:ring-offset-slate-900 bg-slate-900"
                />
                Transformer
              </label>
              <input
                v-model="transformer"
                type="text"
                :disabled="!transformerEnabled"
                class="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              />
            </div>

            <!-- KWH Meter - Enhanced Version -->
            <div
              class="form-group border-2 border-gray-200 rounded-lg p-4 bg-gray-50"
            >
              <label
                class="flex items-center text-sm font-medium text-gray-700 mb-3"
              >
                <span>KWH Meter</span>
                <input
                  v-model="kwhMeterEnabled"
                  type="checkbox"
                  class="ml-2 w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
              </label>

              <!-- จำนวน Meter - แสดงตลอดแต่ disable ถ้าไม่ tick -->
              <div class="flex items-center gap-3 mb-4">
                <label class="text-sm font-medium text-gray-700">
                  จำนวน Meter:
                </label>
                <input
                  v-model.number="kwhMeterCount"
                  type="number"
                  min="0"
                  max="10"
                  :disabled="!kwhMeterEnabled"
                  class="w-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>

              <!-- Meter Phase Selection -->
              <div v-if="kwhMeterEnabled" class="space-y-3">
                <div
                  v-for="(meter, index) in kwh_meters"
                  :key="index"
                  class="bg-white p-4 rounded-md border border-gray-300 shadow-sm"
                >
                  <div class="flex items-center gap-4">
                    <span
                      class="text-sm font-semibold text-gray-700 min-w-[80px]"
                    >
                      Meter {{ index + 1 }}:
                    </span>

                    <!-- Phase Choice Buttons -->
                    <div class="flex gap-2">
                      <button
                        type="button"
                        @click="meter.phase = 'P1'"
                        :class="[
                          'px-4 py-2 rounded-md font-medium text-sm transition-all',
                          meter.phase === 'P1'
                            ? 'bg-blue-600 text-white shadow-md'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300',
                        ]"
                      >
                        1 Phase
                      </button>
                      <button
                        type="button"
                        @click="meter.phase = 'P3'"
                        :class="[
                          'px-4 py-2 rounded-md font-medium text-sm transition-all',
                          meter.phase === 'P3'
                            ? 'bg-blue-600 text-white shadow-md'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300',
                        ]"
                      >
                        3 Phase
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Solar Cell -->
            <div class="form-group">
              <label
                class="flex items-center gap-3 text-sm font-semibold text-slate-300 mb-2"
              >
                <input
                  v-model="solarCellEnabled"
                  type="checkbox"
                  class="w-5 h-5 rounded border-slate-600 text-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 focus:ring-offset-slate-900 bg-slate-900"
                />
                Solar Cell
              </label>
              <input
                v-model="solar_cell"
                type="text"
                :disabled="!solarCellEnabled"
                class="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              />
            </div>

            <!-- Mowing -->
            <div class="form-group">
              <label
                class="flex items-center gap-3 text-sm font-semibold text-slate-300 mb-2"
              >
                <input
                  v-model="mowingEnabled"
                  type="checkbox"
                  class="w-5 h-5 rounded border-slate-600 text-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 focus:ring-offset-slate-900 bg-slate-900"
                />
                Mowing
              </label>
              <input
                v-model="mowing"
                type="text"
                :disabled="!mowingEnabled"
                class="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              />
            </div>

            <!-- Created by (hidden) -->
            <div class="form-group" hidden>
              <label class="block text-sm font-semibold text-slate-300 mb-2"
                >Created by</label
              >
              <input
                v-model="created_by"
                type="text"
                class="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3 text-slate-200"
              />
            </div>

            <!-- Remark -->
            <div class="form-group">
              <label class="block text-sm font-semibold text-slate-300 mb-2"
                >Remark</label
              >
              <textarea
                v-model="remark"
                rows="3"
                class="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
              ></textarea>
            </div>
          </div>
        </transition>
      </div>

      <!-- Action Buttons -->
      <div class="flex gap-4 justify-end">
        <button
          type="button"
          @click="handleCancel"
          class="px-6 py-3 bg-slate-700/50 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl border border-slate-600/50 transition-all duration-200"
        >
          Cancel
        </button>
        <button
          type="submit"
          :disabled="isSubmitting"
          class="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-slate-600 disabled:to-slate-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 disabled:shadow-none hover:-translate-y-0.5 disabled:translate-y-0 disabled:cursor-not-allowed transition-all duration-300"
        >
          {{ isSubmitting ? "Updating..." : "Update PM" }}
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

.animate-slide-up {
  animation: slide-up 0.6s ease-out 0.2s both;
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
  max-height: 2000px;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  max-height: 0;
  overflow: hidden;
}
</style>