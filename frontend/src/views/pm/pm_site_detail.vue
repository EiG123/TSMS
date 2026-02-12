<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { getPmList } from "../../services/pm_nodeb_list.api";
import { pmServiceManage } from "../../services/pmServiceManage.api";

const router = useRouter();
const route = useRoute();
const pmId = ref(route.params.id as string);

// ===== state =====
const siteList = ref<any[]>([]);
const loading = ref(false);


// ===== lifecycle =====
onMounted(async () => {
  loading.value = true;
  try {
    const res = await getPmList.getPmById(pmId.value);
    console.log(res.data);
    siteList.value = res.data;
  } catch {
    alert("ไม่เจอ API SiteList");
  } finally {
    loading.value = false;
  }
});
</script>

<template>
    <div>

    </div>
</template>