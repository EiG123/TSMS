<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { UserLocation } from "../../services/user/UserLoaction.api";

interface UserLocationData {
  user_id: number;
  latitude: number | string;
  longitude: number | string;
  updated_at?: string;
}

const map = ref<L.Map | null>(null);
const markers = ref<Map<number, L.Marker>>(new Map());
let pollingInterval: ReturnType<typeof setInterval> | null = null;

const initMap = () => {
  map.value = L.map("map").setView([18.78, 98.98], 13);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors",
  }).addTo(map.value);
};

const normalizeLocations = (res: unknown): UserLocationData[] => {
  if (Array.isArray(res)) return res;
  if (res && typeof res === "object") {
    for (const key of ["data", "locations", "results"]) {
      const val = (res as Record<string, unknown>)[key];
      if (Array.isArray(val)) return val;
    }
  }
  console.warn("Unexpected response format:", res);
  return [];
};
const useFormatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("th-TH", {
    dateStyle: "full",
    timeStyle: "short",
  }).format(date);
};
const updateMarkers = (locations: UserLocationData[]) => {
  if (!map.value) return;

  const activeIds = new Set(locations.map((u) => u.user_id));

  // ลบ marker ของ user ที่หายไป
  markers.value.forEach((marker, id) => {
    if (!activeIds.has(id)) {
      marker.remove();
      markers.value.delete(id);
    }
  });

  locations.forEach((user) => {
    const lat = Number(user.latitude);
    const lng = Number(user.longitude);
    if (isNaN(lat) || isNaN(lng)) return;

    const existing = markers.value.get(user.user_id);
    if (existing) {
      existing.setLatLng([lat, lng]);
    } else {
      const marker = L.marker([lat, lng]).addTo(map.value!).bindPopup(`
          <b>User:</b> ${user.user_id}<br/>
          <b>Updated:</b> ${useFormatDate(user.updated_at) ?? "-"}
        `);
      markers.value.set(user.user_id, marker);
    }
  });
};

// ✅ ใช้ service เดียวกันทั้ง initial load และ polling
const fetchAndUpdate = async () => {
  try {
    const res = await UserLocation.getLocation();
    console.log(res);
    updateMarkers(normalizeLocations(res));
  } catch (err) {
    console.error("Failed to fetch locations:", err);
  }
};

const startPolling = () => {
  pollingInterval = setInterval(fetchAndUpdate, 5000);
};

onMounted(async () => {
  initMap();
  await fetchAndUpdate();
  startPolling();
});

onUnmounted(() => {
  if (pollingInterval) clearInterval(pollingInterval);
  map.value?.remove();
});
</script>

<template>
  <div class="h-screen flex flex-col">
    <!-- Header -->
    <div class="bg-white shadow px-6 py-4 flex justify-between items-center">
      <h1 class="text-xl font-semibold">User Location Dashboard</h1>
      <span class="text-sm text-gray-500">Auto refresh every 5s</span>
    </div>

    <!-- Content -->
    <div class="flex-1 grid grid-cols-4 gap-4 p-4 bg-gray-100">
      <!-- Sidebar -->
      <div class="col-span-1 bg-white rounded-2xl shadow p-4 overflow-y-auto">
        <h2 class="font-medium mb-3">Users</h2>
        <ul class="space-y-2 text-sm">
          <li class="p-2 rounded hover:bg-gray-100 cursor-pointer">
            User list here (optional)
          </li>
        </ul>
      </div>

      <!-- Map -->
      <div class="col-span-3 bg-white rounded-2xl shadow overflow-hidden">
        <div id="map" class="w-full h-full"></div>
      </div>
    </div>
  </div>
</template>

<style>
#map {
  height: 100%;
}
</style>
