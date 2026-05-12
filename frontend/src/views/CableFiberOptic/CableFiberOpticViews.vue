<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { CableFiberOpticManage } from "../../services/CableFiberOptic/CableFiberOpticManage.api";

// ── Types ──────────────────────────────────────────────
interface CableProperties {
  cable_code: string;
  [key: string]: unknown;
}

interface Cable {
  geom: GeoJSON.LineString | GeoJSON.MultiLineString | null;
  cable_code: string;
}

// ✅ แยก type ออกมาก่อน แทนที่จะเขียน generic inline ใน .ts
type CableFeature = GeoJSON.Feature<
  GeoJSON.LineString | GeoJSON.MultiLineString,
  CableProperties
>;

type CableGeom = GeoJSON.LineString | GeoJSON.MultiLineString;

// ── State ──────────────────────────────────────────────
let map: maplibregl.Map | null = null;
let popup: maplibregl.Popup | null = null;

const isLoading = ref(true);
const error = ref<string | null>(null);
const cableCount = ref(0);

// ── Map init ───────────────────────────────────────────
const initMap = () => {
  map = new maplibregl.Map({
    container: "map",
    // style: "https://tiles.openfreemap.org/styles/liberty"
    // style: "https://tiles.openfreemap.org/styles/bright"
    style: "https://tiles.openfreemap.org/styles/positron",
    center: [98.9853, 18.7883], // เชียงใหม่
    zoom: 13, // เห็นภาคเหนือ
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
    const cables = (response.data ?? []) as Cable[];

    // ✅ ใช้ type alias แทน inline generic → Vue template compiler ไม่สับสน
    const features: CableFeature[] = cables
      .filter((c): c is Cable & { geom: CableGeom } => Boolean(c.geom))
      .map((c) => ({
        type: "Feature" as const,
        geometry: c.geom,
        properties: { cable_code: c.cable_code },
      }));

    cableCount.value = features.length;

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

    const geometry = e.features[0].geometry;
    if (geometry.type !== "LineString" && geometry.type !== "MultiLineString")
      return;

    const coords =
      geometry.type === "LineString"
        ? geometry.coordinates
        : geometry.coordinates.flat();

    const bounds = coords.reduce(
      (b, coord) => b.extend(coord as [number, number]),
      new maplibregl.LngLatBounds(
        coords[0] as [number, number],
        coords[0] as [number, number]
      )
    );

    map.fitBounds(bounds, { padding: 80, maxZoom: 16, duration: 800 });
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
  <div class="flex flex-col gap-3 p-4">
    <!-- Header -->
    <header class="flex items-center gap-3">
      <h1 class="m-0 text-2xl font-semibold">Cable Fiber Optic GIS</h1>
      <span
        v-if="!isLoading && !error"
        class="rounded-full border border-sky-500/40 bg-sky-500/10 px-3 py-0.5 text-xs text-sky-400"
      >
        {{ cableCount.toLocaleString() }} cables
      </span>
    </header>

    <!-- Map wrapper -->
    <div class="relative h-[700px] w-full overflow-hidden rounded-xl">
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
          <!-- Spinner -->
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
  </div>
</template>