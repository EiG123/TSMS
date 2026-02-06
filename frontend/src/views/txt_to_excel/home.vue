<script setup lang="ts">
import { ref } from "vue";
import { v } from "vue-router/dist/router-CWoNjPRp.mjs";
import { txt_to_excelManage } from "../../services/TxtToExcel/txt_to_excelManage.api";

const taskId = ref<string | null>(null);
const progress = ref<number>(0);
const progressMessage = ref<string>("");

let progressTimer: number | null = null;

const selectedFile = ref<File | null>(null);

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    selectedFile.value = target.files[0];
  }
};

const isLoading = ref(false); // เพิ่มสถานะ Loading

const startProgressPolling = () => {
  if (!taskId.value) return;

  progressTimer = window.setInterval(async () => {
    try {
      const res = await fetch(`http://localhost:8000/progress/${taskId.value}`);
      const data = await res.json();

      progress.value = data.progress ?? 0;
      progressMessage.value = data.message ?? "";

      console.log(data);

      if (data.status === "done") {
        stopProgressPolling();
        isLoading.value = false;
        downloadResult();
      }

      if (data.status === "error") {
        stopProgressPolling();
        isLoading.value = false;
        alert("เกิดข้อผิดพลาดระหว่างแปลงไฟล์");
      }
    } catch (err) {
      console.error("Progress error:", err);
    }
  }, 1500);
};

const stopProgressPolling = () => {
  if (progressTimer) {
    clearInterval(progressTimer);
    progressTimer = null;
  }
};

const downloadResult = () => {
  if (!taskId.value) return;

  const url = `http://localhost:8000/download/${taskId.value}`;
  window.location.href = url;
};


const handleSubmit = async () => {
  // 1. Validation
  if (!selectedFile.value) {
    alert("กรุณาเลือกไฟล์ก่อนครับ");
    return;
  }

  try {
    isLoading.value = true; // เริ่มโหลด

    const formData = new FormData();
    formData.append("file", selectedFile.value);

    // 2. Call API
    const response = await txt_to_excelManage.txt_to_excel(formData);
    // backend ต้อง return { task_id }
    taskId.value = response.task_id;
    // เริ่ม polling progress
    startProgressPolling();

    // (Optional) เคลียร์ค่าไฟล์หลังจากส่งเสร็จ
    selectedFile.value = null;
  } catch (error) {
    // 4. Handle Error
    console.error("เกิดข้อผิดพลาด:", error);
    alert("เกิดข้อผิดพลาดในการส่งข้อมูล กรุณาลองใหม่อีกครั้ง");
  } finally {
    isLoading.value = false; // ปิด Loading ไม่ว่าจะสำเร็จหรือไม่ก็ตาม
  }
};
</script>


<template>
  <form @submit.prevent="handleSubmit">
    <div>
      <input
        type="file"
        accept=".txt"
        @change="handleFileChange"
        :disabled="isLoading"
      />
    </div>

    <button type="submit" :disabled="isLoading">
      {{ isLoading ? "กำลังประมวลผล..." : "Convert" }}
    </button>

    <div v-if="isLoading" style="margin-top: 16px;">
      <progress :value="progress" max="100"></progress>
      <p>{{ progressMessage }}</p>
    </div>
  </form>
</template>

