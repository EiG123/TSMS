<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getPmList } from "../../services/pm_nodeb_list.api";
import { pmServiceManage } from "../../services/pmServiceManage.api";
import { useAuthStore } from "../../stores/auth";
import { pmTitleManage } from "../../services/PmTitle/pmTitleManage.api";

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const props = defineProps<{
  id: string;
  title?: string;
  title_id?: any;
}>();

const pmId = computed(() => props.id);
const title = computed(() => props.title);
const title_id = computed(() => props.title_id);

const loading = ref(false);
const pMsiteData = ref<any>(null);
const kwh_meters_list = ref<any[]>([]);
const title_list = ref<any[]>([]);
const showModules = ref(true);

const hide = () => {
  showModules.value = !showModules.value;
};

const goBack = () => {
  router.back();
};

onMounted(async () => {
  loading.value = true;
  try {
    const res_title_child = await pmTitleManage.getTitleChildByTitle({
      title: title.value,
      title_id: title_id.value,
    });

    console.log(res_title_child);
  } catch (error) {
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div>hello</div>
</template>

