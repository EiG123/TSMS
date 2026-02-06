<script setup lang="ts">
import { ref, onMounted, computed, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { pmTitleManage } from "../../../services/PmTitle/pmTitleManage.api";

const router = useRouter();
const route = useRoute();
const pmId = ref(route.params.id as string);

const title_child_name = ref("");
const description = ref("");
const sub_type = ref("");
const status = ref("inactive");
const reportable = ref("inactive");
const rank = ref(0);

const fso = ref(false);
const update_all_rank = ref(false);

const result_status = ref("inactive");
const result_name = ref("");
const result_type = ref("");

const dropdown_checkbox_name = ref("");
const dropdown_checkbox_value = ref("");

// Dynamic Values
const value_status = ref("inactive");
const value_number = ref(0);
const values = ref<Array<{ name: string; input_type: string }>>([]);

const image_status = ref("inactive");
const image_number = ref(0);
const image_descriptions = ref<string[]>([]);

// Watch value_number to update values array
watch(value_number, (newVal) => {
  const num = Number(newVal) || 0;
  values.value = Array(num)
    .fill(null)
    .map(() => ({ name: "", input_type: "" }));
});

// Watch image_number to update descriptions array
watch(image_number, (newVal) => {
  const num = Number(newVal) || 0;
  image_descriptions.value = Array(num).fill("");
});

const handleCancel = () => {
  router.push(`/pm_title_child/${pmId.value}`);
};

const handleSubmit = async () => {
  console.log("Submitting...");
  const res = await pmTitleManage.AddpmTitleChild(
    {pm_id: pmId.value,
    title_child_name: title_child_name.value,
    description: description.value,
    sub_type: sub_type.value,
    status: status.value,
    reportable: reportable.value,
    rank: rank.value,
    fso: fso.value,
    update_all_rank: update_all_rank.value,
    result_status: result_status.value,
    result_name: result_name.value,
    result_type: result_type.value,
    dropdown_checkbox_name: dropdown_checkbox_name.value,
    dropdown_checkbox_value: dropdown_checkbox_value.value,
    value_status: value_status.value,
    value_number: value_number.value,
    values: values.value,
    image_status: image_status.value,
    image_number: image_number.value,
    image_descriptions: image_descriptions.value}
  );
  if(res.data.success){
    router.push(`/pm_title_child/${pmId.value}`);
  }else{
    alert("Submit ไม่ผ่าน");
  }
};
</script>

<template>
  <div class="max-w-5xl mx-auto p-6">
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Header -->
      <div class="bg-white shadow-md rounded-lg p-6">
        <h1 class="text-2xl font-bold text-gray-800">New NodeB Title Child</h1>
      </div>

      <!-- Basic Information -->
      <div class="bg-white shadow-md rounded-lg p-6 space-y-4">
        <h2 class="text-lg font-semibold text-gray-800 mb-4">
          Basic Information
        </h2>

        <!-- Title Child Name -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Title Child Name
          </label>
          <input
            v-model="title_child_name"
            type="text"
            placeholder="ชื่อหัวข้อ"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
          />
        </div>

        <!-- Description -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <input
            v-model="description"
            type="text"
            placeholder="Description"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
          />
        </div>

        <!-- Sub Type -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Sub Type
          </label>
          <select
            v-model="sub_type"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-white"
          >
            <option value="">Select...</option>
            <option value="type1">Type 1</option>
            <option value="type2">Type 2</option>
          </select>
        </div>

        <!-- Status -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-3">
            Status
          </label>
          <div class="flex gap-6">
            <label class="flex items-center gap-2 cursor-pointer">
              <input
                v-model="status"
                type="radio"
                value="active"
                class="w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-500"
              />
              <span class="text-gray-700">Active</span>
            </label>
            <label class="flex items-center gap-2 cursor-pointer">
              <input
                v-model="status"
                type="radio"
                value="inactive"
                class="w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-500"
              />
              <span class="text-gray-700">Inactive</span>
            </label>
          </div>
        </div>

        <!-- Report Status -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-3">
            Report Status
          </label>
          <div class="flex gap-6">
            <label class="flex items-center gap-2 cursor-pointer">
              <input
                v-model="reportable"
                type="radio"
                value="active"
                class="w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-500"
              />
              <span class="text-gray-700">Active</span>
            </label>
            <label class="flex items-center gap-2 cursor-pointer">
              <input
                v-model="reportable"
                type="radio"
                value="inactive"
                class="w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-500"
              />
              <span class="text-gray-700">Inactive</span>
            </label>
          </div>
        </div>

        <!-- Rank -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Rank
          </label>
          <input
            v-model="rank"
            type="number"
            min="0"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
          />
        </div>

        <!-- FSO and Update All Rank -->
        <div class="space-y-2">
          <label class="flex items-center gap-2 cursor-pointer">
            <input
              v-model="fso"
              type="checkbox"
              class="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
            />
            <span class="text-gray-700">FSO</span>
          </label>
          <label class="flex items-center gap-2 cursor-pointer">
            <input
              v-model="update_all_rank"
              type="checkbox"
              class="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
            />
            <span class="text-gray-700">Update all rank current position</span>
          </label>
        </div>
      </div>

      <!-- Result Section -->
      <div class="bg-white shadow-md rounded-lg p-6 space-y-4">
        <h2 class="text-lg font-semibold text-gray-800 mb-4">Result</h2>

        <!-- Result Status -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-3">
            Result Status
          </label>
          <div class="flex gap-6">
            <label class="flex items-center gap-2 cursor-pointer">
              <input
                v-model="result_status"
                type="radio"
                value="active"
                class="w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-500"
              />
              <span class="text-gray-700">Active</span>
            </label>
            <label class="flex items-center gap-2 cursor-pointer">
              <input
                v-model="result_status"
                type="radio"
                value="inactive"
                class="w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-500"
              />
              <span class="text-gray-700">Inactive</span>
            </label>
          </div>
        </div>

        <!-- Show only when result_status is active -->
        <div
          v-show="result_status === 'active'"
          class="space-y-4 pt-4 border-t border-gray-200"
        >
          <!-- Result Name -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Name
            </label>
            <input
              v-model="result_name"
              type="text"
              placeholder="Name"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            />
          </div>

          <!-- Result Type -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-3">
              Result Type
            </label>
            <div class="flex gap-6">
              <label class="flex items-center gap-2 cursor-pointer">
                <input
                  v-model="result_type"
                  type="radio"
                  value="dropdown"
                  class="w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-500"
                />
                <span class="text-gray-700">Dropdown</span>
              </label>
              <label class="flex items-center gap-2 cursor-pointer">
                <input
                  v-model="result_type"
                  type="radio"
                  value="checkbox"
                  class="w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-500"
                />
                <span class="text-gray-700">Checkbox</span>
              </label>
            </div>
          </div>

          <!-- Dropdown/Checkbox Options -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Dropdown/Checkbox Name
              </label>
              <select
                v-model="dropdown_checkbox_name"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-white"
              >
                <option value="">...</option>
                <option value="OK">OK</option>
                <option value="NOT OK">NOT OK</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Dropdown/Checkbox Value
              </label>
              <select
                v-model="dropdown_checkbox_value"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-white"
              >
                <option value="">...</option>
                <option value="N/A">N/A</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <!-- Dynamic Values Section -->
      <div class="bg-white shadow-md rounded-lg p-6 space-y-4">
        <h2 class="text-lg font-semibold text-gray-800 mb-4">Values</h2>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-3">
            Value Status
          </label>
          <div class="flex gap-6">
            <label class="flex items-center gap-2 cursor-pointer">
              <input
                v-model="value_status"
                type="radio"
                value="active"
                class="w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-500"
              />
              <span class="text-gray-700">Active</span>
            </label>
            <label class="flex items-center gap-2 cursor-pointer">
              <input
                v-model="value_status"
                type="radio"
                value="inactive"
                class="w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-500"
              />
              <span class="text-gray-700">Inactive</span>
            </label>
          </div>
        </div>

        <!-- Show only when value_status is active -->
        <div
          v-show="value_status === 'active'"
          class="space-y-4 pt-4 border-t border-gray-200"
        >
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Number of Values
            </label>
            <input
              v-model.number="value_number"
              type="number"
              min="0"
              max="10"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            />
          </div>

          <!-- Dynamic Value Fields -->
          <div v-if="value_number > 0" class="space-y-4 mt-4">
            <div
              v-for="(value, index) in values"
              :key="index"
              class="border-l-4 border-green-500 pl-4 py-3 bg-gray-50 rounded-r-lg space-y-3"
            >
              <h3 class="text-sm font-semibold text-gray-700">
                Value #{{ index + 1 }}
              </h3>

              <!-- Value Name -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                <input
                  v-model="values[index].name"
                  type="text"
                  :placeholder="`Value #${index + 1} Name`"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                />
              </div>

              <!-- Input Type -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-3">
                  Input Type
                </label>
                <div class="flex gap-6">
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input
                      v-model="values[index].input_type"
                      type="radio"
                      value="text"
                      class="w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-500"
                    />
                    <span class="text-gray-700">Text</span>
                  </label>
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input
                      v-model="values[index].input_type"
                      type="radio"
                      value="number"
                      class="w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-500"
                    />
                    <span class="text-gray-700">Number</span>
                  </label>
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input
                      v-model="values[index].input_type"
                      type="radio"
                      value="date"
                      class="w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-500"
                    />
                    <span class="text-gray-700">Date</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Image Section -->
      <div class="bg-white shadow-md rounded-lg p-6 space-y-4">
        <h2 class="text-lg font-semibold text-gray-800 mb-4">Image</h2>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-3">
            Image Status
          </label>
          <div class="flex gap-6">
            <label class="flex items-center gap-2 cursor-pointer">
              <input
                v-model="image_status"
                type="radio"
                value="active"
                class="w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-500"
              />
              <span class="text-gray-700">Active</span>
            </label>
            <label class="flex items-center gap-2 cursor-pointer">
              <input
                v-model="image_status"
                type="radio"
                value="inactive"
                class="w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-500"
              />
              <span class="text-gray-700">Inactive</span>
            </label>
          </div>
        </div>

        <!-- Show only when image_status is active -->
        <div
          v-show="image_status === 'active'"
          class="space-y-4 pt-4 border-t border-gray-200"
        >
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Number of Images
            </label>
            <input
              v-model.number="image_number"
              type="number"
              min="0"
              max="10"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            />
          </div>

          <!-- Dynamic Image Descriptions -->
          <div v-if="image_number > 0" class="space-y-3 mt-4">
            <div
              v-for="(desc, index) in image_descriptions"
              :key="index"
              class="border-l-4 border-blue-500 pl-4"
            >
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Description of Image #{{ index + 1 }}
              </label>
              <input
                v-model="image_descriptions[index]"
                type="text"
                :placeholder="`Description of Image #${index + 1}`"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex gap-4 pt-4">
        <button
          @click="handleCancel"
          type="button"
          class="flex-1 px-6 py-3 bg-gray-500 text-white font-medium rounded-lg hover:bg-gray-600 transition-colors duration-200"
        >
          Cancel
        </button>
        <button
          type="submit"
          class="flex-1 px-6 py-3 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors duration-200"
        >
          Submit
        </button>
      </div>
    </form>
  </div>
</template>