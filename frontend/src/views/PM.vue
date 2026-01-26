<script setup lang="ts">
import { useRouter } from "vue-router";

const router = useRouter();

const go = (path: string) => {
  router.push(path);
};
</script>

<template>
  <div class="container mx-auto p-6">
    <h3 class="text-2xl font-bold mb-6">
      PM (Preventive Maintenance)
    </h3>

    <!-- grid -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">

      <!-- PM NodeB -->
      <div
        class="card bg-base-100 shadow hover:shadow-xl cursor-pointer"
        @click="go('/pm/pm_nodeb')"
      >
        <div class="card-body">
          <h1 class="text-xl font-bold">PM NodeB</h1>
          <h6 class="text-sm opacity-70">NodeB</h6>
          <p>Mobile NodeB</p>
        </div>
      </div>

      <!-- PM Small -->
      <div
        class="card bg-base-100 shadow hover:shadow-xl cursor-pointer"
        @click="go('/pm/small')"
      >
        <div class="card-body">
          <h1 class="text-xl font-bold">PM Small Exchange</h1>
          <h6 class="text-sm opacity-70">AN / PN / DN</h6>
          <p>CX-Node</p>
        </div>
      </div>

      <!-- PM Medium -->
      <div
        class="card bg-base-100 shadow hover:shadow-xl cursor-pointer"
        @click="go('/pm/medium')"
      >
        <div class="card-body">
          <h1 class="text-xl font-bold">PM Medium Exchange</h1>
          <h6 class="text-sm opacity-70">RN / AGN Node</h6>
          <p>TOC Node</p>
        </div>
      </div>

      <!-- PM Broadband -->
      <div
        class="card bg-base-100 shadow hover:shadow-xl cursor-pointer"
        @click="go('/pm/broadband')"
      >
        <div class="card-body">
          <h1 class="text-xl font-bold">PM Broadband</h1>
          <h6 class="text-sm opacity-70">OLT Indoor / Outdoor</h6>
          <p>NodeB / DSLAM / TVS</p>
        </div>
      </div>

      <!-- Mowing -->
      <div
        class="card bg-base-100 shadow hover:shadow-xl cursor-pointer"
        @click="go('/pm/mowing')"
      >
        <div class="card-body">
          <h1 class="text-xl font-bold">Mowing</h1>
          <h6 class="text-sm opacity-70">
            ตัดหญ้า NodeB / PN / DN
          </h6>
        </div>
      </div>

      <!-- Solar -->
      <div
        class="card bg-base-100 shadow hover:shadow-xl cursor-pointer"
        @click="go('/pm/solar')"
      >
        <div class="card-body">
          <h1 class="text-xl font-bold">PM Solar Cell</h1>
          <h6 class="text-sm opacity-70">Solar Cell NodeB</h6>
          <p>Mobile NodeB</p>
        </div>
      </div>

    </div>
  </div>
</template>