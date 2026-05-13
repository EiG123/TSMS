<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed } from "vue";

const props = defineProps<{
  id: any;
}>();

const id = computed(() => props.id);

</script>

<template>
    <div>
        hello Cable details Cable ID: {{id}}
    </div>
</template>
