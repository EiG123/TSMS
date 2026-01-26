<script setup>
import { useRouter } from "vue-router";
import { ref } from "vue";

const router = useRouter();

const handlePM = async () => {
  router.push("/PM");
};
</script>

<template>
  <div class="card-actions justify-end">
    <button @click="handlePM" class="btn btn-primary w-full text-lg">
      PM
    </button>
  </div>
</template>
