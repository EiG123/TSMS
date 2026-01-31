<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { PMApiService } from "../../services/pm_nodeb.api";

// Loading state
const isSubmitting = ref(false);
const showPmInfo = ref(true);

const togglePmInfo = () => {
  showPmInfo.value = !showPmInfo.value;
};

const handlePmNodeB = async () => {
  if (isSubmitting.value) return;

  isSubmitting.value = true;

  try {
    // แปลง kwh_meters array เป็น string หรือ JSON ตามที่ API ต้องการ
    const kwhMeterData = kwhMeterEnabled.value 
      ? JSON.stringify(kwh_meters.value) 
      : "";

    const pmResult = await PMApiService.pm_nodeb(
      site_id.value,
      region.value,
      datetime.value,
      status.value,
      generatorEnabled.value ? generator.value : "",
      transformerEnabled.value ? transformer.value : "",
      kwhMeterData,
      solarCellEnabled.value ? solar_cell.value : "",
      mowingEnabled.value ? mowing.value : "",
      created_by.value,
      remark.value
    );

    if (pmResult.success) {
      window.location.href = "/pm_nodeb";
    } else {
      alert(pmResult.message || "ไม่สามารถลงข้อมูลได้");
    }
  } catch (error) {
    console.error("PM NodeB Error:", error);
    alert("เกิดข้อผิดพลาด: " + (error.message || "ไม่สามารถลงข้อมูลได้"));
  } finally {
    isSubmitting.value = false;
  }
};

const site_id = ref("");
const region = ref("");
const datetime = ref("");
const status = ref("");
const generator = ref("");
const transformer = ref("");
const solar_cell = ref("");
const mowing = ref("");
const created_by = ref("");
const remark = ref("");

// Checkbox states
const generatorEnabled = ref(false);
const transformerEnabled = ref(false);
const kwhMeterEnabled = ref(false);
const solarCellEnabled = ref(false);
const mowingEnabled = ref(false);

// KWH Meter specific states
const kwhMeterCount = ref(1);
const kwh_meters = ref([
  { phase: "1phase" }
]);

// Watch for count changes
watch(kwhMeterCount, (newCount) => {
  const currentLength = kwh_meters.value.length;
  
  if (newCount > currentLength) {
    // เพิ่มช่องใหม่
    for (let i = currentLength; i < newCount; i++) {
      kwh_meters.value.push({ phase: "1phase" });
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
    kwh_meters.value = [{ phase: "1phase" }];
  }
});
</script>

<template>
  <form @submit.prevent="handlePmNodeB" class="max-w-4xl mx-auto p-4">
    <!-- PM Information Section -->
    <div class="bg-white rounded-lg shadow-md mb-6">
      <div 
        class="flex items-center justify-between p-4 cursor-pointer border-b hover:bg-gray-50"
        @click="togglePmInfo"
      >
        <h2 class="text-xl font-semibold text-gray-800">New Site PM</h2>
        <button 
          type="button" 
          class="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
        >
          {{ showPmInfo ? "−" : "+" }}
        </button>
      </div>

      <transition
        enter-active-class="transition-all duration-300 ease-out"
        leave-active-class="transition-all duration-200 ease-in"
        enter-from-class="opacity-0 max-h-0"
        enter-to-class="opacity-100 max-h-[2000px]"
        leave-from-class="opacity-100 max-h-[2000px]"
        leave-to-class="opacity-0 max-h-0"
      >
        <div v-show="showPmInfo" class="overflow-hidden">
          <div class="p-6 space-y-4">
            <!-- Site ID -->
            <div class="form-group">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Site ID :
              </label>
              <input 
                v-model="site_id" 
                type="text" 
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <!-- PM Date -->
            <div class="form-group">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                PM Date
              </label>
              <input
                v-model="datetime"
                type="datetime-local"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <!-- Service Status -->
            <div class="form-group">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Service Status
              </label>
              <select 
                v-model="status"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select...</option>
                <option value="onService">On Service</option>
                <option value="cancel">Cancel</option>
              </select>
            </div>

            <!-- Generator -->
            <div class="form-group">
              <label class="flex items-center text-sm font-medium text-gray-700 mb-2">
                <span>Generator</span>
                <input
                  v-model="generatorEnabled"
                  type="checkbox"
                  class="ml-2 w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
              </label>
              <input
                v-model="generator"
                type="text"
                :disabled="!generatorEnabled"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>

            <!-- Transformer -->
            <div class="form-group">
              <label class="flex items-center text-sm font-medium text-gray-700 mb-2">
                <span>Transformer</span>
                <input
                  v-model="transformerEnabled"
                  type="checkbox"
                  class="ml-2 w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
              </label>
              <input
                v-model="transformer"
                type="text"
                :disabled="!transformerEnabled"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>

            <!-- KWH Meter - Enhanced Version -->
            <div class="form-group border-2 border-gray-200 rounded-lg p-4 bg-gray-50">
              <label class="flex items-center text-sm font-medium text-gray-700 mb-3">
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
                    <span class="text-sm font-semibold text-gray-700 min-w-[80px]">
                      Meter {{ index + 1 }}:
                    </span>
                    
                    <!-- Phase Choice Buttons -->
                    <div class="flex gap-2">
                      <button
                        type="button"
                        @click="meter.phase = '1phase'"
                        :class="[
                          'px-4 py-2 rounded-md font-medium text-sm transition-all',
                          meter.phase === '1phase'
                            ? 'bg-blue-600 text-white shadow-md'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        ]"
                      >
                        1 Phase
                      </button>
                      <button
                        type="button"
                        @click="meter.phase = '3phase'"
                        :class="[
                          'px-4 py-2 rounded-md font-medium text-sm transition-all',
                          meter.phase === '3phase'
                            ? 'bg-blue-600 text-white shadow-md'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
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
              <label class="flex items-center text-sm font-medium text-gray-700 mb-2">
                <span>Solar Cell</span>
                <input
                  v-model="solarCellEnabled"
                  type="checkbox"
                  class="ml-2 w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
              </label>
              <input
                v-model="solar_cell"
                type="text"
                :disabled="!solarCellEnabled"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>

            <!-- Mowing -->
            <div class="form-group">
              <label class="flex items-center text-sm font-medium text-gray-700 mb-2">
                <span>Mowing</span>
                <input
                  v-model="mowingEnabled"
                  type="checkbox"
                  class="ml-2 w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
              </label>
              <input
                v-model="mowing"
                type="text"
                :disabled="!mowingEnabled"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>

            <!-- Created by (hidden) -->
            <div class="form-group" hidden>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Created by
              </label>
              <input 
                v-model="created_by" 
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <!-- Remark -->
            <div class="form-group">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Remark
              </label>
              <input
                v-model="remark"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </transition>
    </div>

    <!-- Submit Button -->
    <div class="flex justify-center">
      <button
        type="submit"
        :disabled="isSubmitting"
        class="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        {{ isSubmitting ? "กำลังบันทึก..." : "Create" }}
      </button>
    </div>
  </form>
</template>