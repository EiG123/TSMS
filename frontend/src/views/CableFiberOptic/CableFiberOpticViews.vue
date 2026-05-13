<script setup lang="ts">
import { onMounted, onUnmounted, ref, computed } from "vue";
import { useRouter } from "vue-router";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { CableFiberOpticManage } from "../../services/CableFiberOptic/CableFiberOpticManage.api";

// ── Types ──────────────────────────────────────────────
interface CableProperties {
  cable_code: string;
  [key: string]: unknown;
}

interface Cable {
  id?: number | string;
  geom: GeoJSON.LineString | GeoJSON.MultiLineString | null;
  cable_code: string;
  [key: string]: unknown;
}

type CableFeature = GeoJSON.Feature<
  GeoJSON.LineString | GeoJSON.MultiLineString,
  CableProperties
>;

type CableGeom = GeoJSON.LineString | GeoJSON.MultiLineString;

// ── Router ─────────────────────────────────────────────
const router = useRouter();

// ── State ──────────────────────────────────────────────
let map: maplibregl.Map | null = null;
let popup: maplibregl.Popup | null = null;

const isLoading = ref(true);
const error = ref<string | null>(null);
const cables = ref<Cable[]>([]);

// ── Pagination ─────────────────────────────────────────
const PAGE_SIZE = 20;
const currentPage = ref(1);

const totalPages = computed(() => Math.ceil(cables.value.length / PAGE_SIZE));

const pagedCables = computed(() => {
  const start = (currentPage.value - 1) * PAGE_SIZE;
  return cables.value.slice(start, start + PAGE_SIZE);
});

// Show max 7 page buttons with ellipsis
const pageButtons = computed(() => {
  const total = totalPages.value;
  const cur = currentPage.value;
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages: (number | "…")[] = [1];
  if (cur > 3) pages.push("…");
  for (let p = Math.max(2, cur - 1); p <= Math.min(total - 1, cur + 1); p++) {
    pages.push(p);
  }
  if (cur < total - 2) pages.push("…");
  pages.push(total);
  return pages;
});

const goToPage = (page: number | "…") => {
  if (typeof page !== "number") return;
  currentPage.value = page;
};

// ── Map init ───────────────────────────────────────────
const initMap = () => {
  map = new maplibregl.Map({
    container: "map",
    style: "https://tiles.openfreemap.org/styles/positron",
    center: [98.9853, 18.7883],
    zoom: 13,
  });

  map.addControl(new maplibregl.NavigationControl(), "top-right");
  map.addControl(new maplibregl.ScaleControl(), "bottom-left");

  popup = new maplibregl.Popup({
    closeButton: false,
    closeOnClick: false,
  });

  map.on("load", loadCables);
};

// ── Data ───────────────────────────────────────────────
const loadCables = async () => {
  if (!map) return;

  try {
    isLoading.value = true;
    error.value = null;

    const response = await CableFiberOpticManage.getAllCable();
    cables.value = (response.data ?? []) as Cable[];

    const features: CableFeature[] = cables.value
      .filter((c): c is Cable & { geom: CableGeom } => Boolean(c.geom))
      .map((c) => ({
        type: "Feature" as const,
        geometry: c.geom,
        properties: { cable_code: c.cable_code },
      }));

    map.addSource("cables", {
      type: "geojson",
      data: { type: "FeatureCollection", features },
    });

    map.addLayer({
      id: "cables-glow",
      type: "line",
      source: "cables",
      paint: {
        "line-color": "#38bdf8",
        "line-width": 8,
        "line-opacity": 0.2,
        "line-blur": 4,
      },
    });

    map.addLayer({
      id: "cables-layer",
      type: "line",
      source: "cables",
      paint: {
        "line-color": "#0ea5e9",
        "line-width": 2.5,
        "line-opacity": 0.9,
      },
    });

    map.addLayer({
      id: "cables-hover",
      type: "line",
      source: "cables",
      paint: {
        "line-color": "#fbbf24",
        "line-width": 4,
        "line-opacity": 0,
      },
    });

    setupInteractions();
  } catch (err) {
    error.value =
      err instanceof Error ? err.message : "Failed to load cable data";
    console.error("[CableMap] loadCables error:", err);
  } finally {
    isLoading.value = false;
  }
};

// ── Interactions ───────────────────────────────────────
const setupInteractions = () => {
  if (!map || !popup) return;

  map.on("mousemove", "cables-layer", (e) => {
    if (!map || !popup || !e.features?.length) return;
    map.getCanvas().style.cursor = "pointer";
    const props = e.features[0].properties as CableProperties;
    map.setPaintProperty("cables-hover", "line-opacity", 1);
    popup
      .setLngLat(e.lngLat)
      .setHTML(
        `<div style="font-family:monospace;font-size:13px;padding:4px 10px;background:#0f172a;color:#38bdf8;border-radius:6px;border:1px solid #1e3a5f;">
          📡 ${props.cable_code}
        </div>`
      )
      .addTo(map);
  });

  map.on("mouseleave", "cables-layer", () => {
    if (!map || !popup) return;
    map.getCanvas().style.cursor = "";
    map.setPaintProperty("cables-hover", "line-opacity", 0);
    popup.remove();
  });

  map.on("click", "cables-layer", (e) => {
    if (!map || !e.features?.length) return;
    const props = e.features[0].properties as CableProperties;
    const cable = cables.value.find((c) => c.cable_code === props.cable_code);
    if (cable) goToDetail(cable);
  });
};

// ── Navigate ───────────────────────────────────────────
const goToDetail = (cable: Cable) => {
  router.push({
    name: "CableFiberOpticDetail",
    query: { id: cable.id ?? cable.cable_code },
  });
};

// ── Retry ──────────────────────────────────────────────
const retry = () => {
  if (!map) return;
  ["cables-hover", "cables-layer", "cables-glow"].forEach((id) => {
    if (map!.getLayer(id)) map!.removeLayer(id);
  });
  if (map.getSource("cables")) map.removeSource("cables");
  loadCables();
};

// ── Lifecycle ──────────────────────────────────────────
onMounted(initMap);

onUnmounted(() => {
  popup?.remove();
  map?.remove();
  map = null;
  popup = null;
});
</script>

<template>
  <div class="flex flex-col gap-4 p-4">
    <!-- Header -->
    <header class="flex items-center gap-3">
      <h1 class="m-0 text-2xl font-semibold">Cable Fiber Optic GIS</h1>
      <span
        v-if="!isLoading && !error"
        class="rounded-full border border-sky-500/40 bg-sky-500/10 px-3 py-0.5 text-xs text-sky-400"
      >
        {{ cables.length.toLocaleString() }} cables
      </span>
    </header>

    <!-- Map wrapper -->
    <div class="relative h-[500px] w-full overflow-hidden rounded-xl">
      <div id="map" class="h-full w-full" />

      <!-- Loading overlay -->
      <Transition
        enter-active-class="transition-opacity duration-300"
        leave-active-class="transition-opacity duration-300"
        enter-from-class="opacity-0"
        leave-to-class="opacity-0"
      >
        <div
          v-if="isLoading"
          class="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-slate-900/65 backdrop-blur-sm"
        >
          <div
            class="h-9 w-9 animate-spin rounded-full border-[3px] border-slate-700 border-t-sky-400"
          />
          <p class="text-sm text-slate-300">Loading cables…</p>
        </div>
      </Transition>

      <!-- Error overlay -->
      <Transition
        enter-active-class="transition-opacity duration-300"
        leave-active-class="transition-opacity duration-300"
        enter-from-class="opacity-0"
        leave-to-class="opacity-0"
      >
        <div
          v-if="error"
          class="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-red-950/75 backdrop-blur-sm"
        >
          <p class="text-sm text-red-300">⚠️ {{ error }}</p>
          <button
            class="rounded-lg border border-red-300/60 px-4 py-1.5 text-sm text-red-300 transition hover:bg-red-300/10"
            @click="retry"
          >
            Retry
          </button>
        </div>
      </Transition>
    </div>

    <!-- ── Table section ── -->
    <div
      class="rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900"
    >
      <!-- Table header bar -->
      <div
        class="flex items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-slate-700"
      >
        <p class="text-sm font-medium text-slate-700 dark:text-slate-300">
          รายการ Cable
        </p>
        <p class="text-xs text-slate-400">
          หน้า {{ currentPage }} / {{ totalPages || 1 }}
          &nbsp;·&nbsp; ทั้งหมด {{ cables.length.toLocaleString() }} รายการ
        </p>
      </div>

      <!-- Table -->
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr
              class="border-b border-slate-200 bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-400"
            >
              <th class="w-14 px-4 py-3">#</th>
              <th class="px-4 py-3">ID</th>
              <th class="px-4 py-3">Cable Code</th>
              <th class="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            <!-- Loading skeleton rows -->
            <template v-if="isLoading">
              <tr
                v-for="i in PAGE_SIZE"
                :key="i"
                class="border-b border-slate-100 dark:border-slate-800"
              >
                <td class="px-4 py-3">
                  <div
                    class="h-3 w-6 animate-pulse rounded bg-slate-200 dark:bg-slate-700"
                  />
                </td>
                <td class="px-4 py-3">
                  <div
                    class="h-3 w-16 animate-pulse rounded bg-slate-200 dark:bg-slate-700"
                  />
                </td>
                <td class="px-4 py-3">
                  <div
                    class="h-3 w-48 animate-pulse rounded bg-slate-200 dark:bg-slate-700"
                  />
                </td>
                <td class="px-4 py-3" />
              </tr>
            </template>

            <!-- Actual data -->
            <template v-else>
              <tr
                v-for="(cable, i) in pagedCables"
                :key="cable.id ?? cable.cable_code"
                class="border-b border-slate-100 transition-colors hover:bg-sky-50/60 dark:border-slate-800 dark:hover:bg-sky-900/10"
              >
                <!-- Row number -->
                <td class="px-4 py-3 text-xs text-slate-400">
                  {{ (currentPage - 1) * PAGE_SIZE + i + 1 }}
                </td>

                <!-- ID -->
                <td
                  class="px-4 py-3 font-mono text-xs text-slate-500 dark:text-slate-400"
                >
                  {{ cable.id ?? "—" }}
                </td>

                <!-- Cable Code -->
                <td
                  class="px-4 py-3 font-medium text-slate-800 dark:text-slate-200"
                >
                  {{ cable.cable_code }}
                </td>

                <!-- Action button -->
                <td class="px-4 py-3 text-right">
                  <button
                    class="inline-flex items-center gap-1.5 rounded-lg border border-sky-500/40 bg-sky-500/10 px-3 py-1.5 text-xs font-medium text-sky-600 transition hover:bg-sky-500/20 dark:text-sky-400"
                    @click="goToDetail(cable)"
                  >
                    ดูรายละเอียด
                    <span class="text-[10px] opacity-70">→</span>
                  </button>
                </td>
              </tr>

              <!-- Empty state -->
              <tr v-if="cables.length === 0">
                <td
                  colspan="4"
                  class="px-4 py-12 text-center text-sm text-slate-400"
                >
                  ไม่พบข้อมูล cable
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>

      <!-- ── Pagination bar ── -->
      <div
        v-if="totalPages > 1"
        class="flex items-center justify-between border-t border-slate-200 px-4 py-3 dark:border-slate-700"
      >
        <!-- Prev -->
        <button
          :disabled="currentPage === 1"
          class="flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-600 transition hover:bg-slate-100 disabled:pointer-events-none disabled:opacity-40 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
          @click="currentPage--"
        >
          ← ก่อนหน้า
        </button>

        <!-- Page number buttons -->
        <div class="flex items-center gap-1">
          <button
            v-for="(page, idx) in pageButtons"
            :key="idx"
            :disabled="page === '…'"
            class="min-w-[32px] rounded-lg border px-2 py-1.5 text-xs transition"
            :class="
              page === currentPage
                ? 'border-sky-500 bg-sky-500 font-semibold text-white'
                : page === '…'
                  ? 'cursor-default border-transparent text-slate-400'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800'
            "
            @click="goToPage(page)"
          >
            {{ page }}
          </button>
        </div>

        <!-- Next -->
        <button
          :disabled="currentPage === totalPages"
          class="flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-600 transition hover:bg-slate-100 disabled:pointer-events-none disabled:opacity-40 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
          @click="currentPage++"
        >
          ถัดไป →
        </button>
      </div>
    </div>
  </div>
</template>