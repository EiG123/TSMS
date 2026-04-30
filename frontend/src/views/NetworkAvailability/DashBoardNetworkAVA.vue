<script setup lang="ts">
import { ref } from "vue";
import { networkAVAManage } from "../../services/network_ava/network_ava.api";
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  Tooltip,
  CategoryScale,
} from "chart.js";

Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  Tooltip,
  CategoryScale
);

const canvasRef = ref<HTMLCanvasElement | null>(null);
let chart: Chart | null = null;

// 🎯 filters
const siteCode = ref("");
const startDate = ref("");
const endDate = ref("");

const loading = ref(false);
const error = ref<string | null>(null);

// 🔌 fetch data
const fetchData = async () => {
  if (!siteCode.value) {
    error.value = "Please enter site code";
    return;
  }

  loading.value = true;
  error.value = null;

  try {
    console.log("Start Date", startDate.value);
    console.log("End Date", endDate.value);
    const res = await networkAVAManage.AVAChart({
      site_code: siteCode.value,
      start_date: startDate.value,
      end_date: endDate.value,
    });
    console.log(res);
    const data = await res.data;

    renderChart(data);
  } catch (err: any) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};

// 📊 render chart
const renderChart = (data: any[]) => {
  const labels = data.map((d) => d.date);
  const values = data.map((d) => d.availability);

  if (chart) chart.destroy();

  chart = new Chart(canvasRef.value as HTMLCanvasElement, {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "Availability (%)",
          data: values,
          tension: 0.3,
        },
      ],
    },
    options: {
      responsive: true,
      interaction: {
        mode: "index",
        intersect: false,
      },
      plugins: {
        tooltip: {
          callbacks: {
            afterBody: (ctx) => {
              const i = ctx[0].dataIndex;
              const incidents = data[i].incidents || [];

              if (!incidents.length) return "No incident";

              return incidents.map((x: any) => `• ${x.subject}`);
            },
          },
        },
      },
    },
  });
};
</script>

<template>
  <div class="dashboard">
    <h2>Availability Dashboard</h2>

    <!-- Filters -->
    <div class="filters">
      <input v-model="siteCode" placeholder="Site Code (e.g. CNX123)" />

      <input type="date" v-model="startDate" />
      <input type="date" v-model="endDate" />

      <button @click="fetchData" :disabled="loading">
        {{ loading ? "Loading..." : "Load" }}
      </button>
    </div>

    <!-- Chart -->
    <div class="chart-box">
      <canvas ref="canvasRef"></canvas>
    </div>

    <!-- Error -->
    <div v-if="error" class="error">
      {{ error }}
    </div>
  </div>
</template>

<style scoped>
.dashboard {
  max-width: 900px;
  margin: 20px auto;
  font-family: Arial;
}

.filters {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.chart-box {
  border: 1px solid #ddd;
  padding: 10px;
}

.error {
  color: red;
}
</style>