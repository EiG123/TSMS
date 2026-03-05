<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { devManage } from "../../services/dev/DevManage.api";

const router = useRouter();

const roles = ref<any[]>([]);
const allPermissions = ref<any[]>([]);
const selectedRole = ref<any>(null);
const selectedPermissions = ref<string[]>([]);

const loading = ref(false);
onMounted(async () => {
  loading.value = true;
  try {
    const allRoleWithPermission = await devManage.getAllRoleWithPermission();
    const allPermission = await devManage.getAllPermission();

    roles.value = allRoleWithPermission.data.result;
    allPermissions.value = allPermission.data.result;
  } catch (error) {
    alert("ไม่สามารถโหลดข้อมูลผู้ใช้ได้");
  } finally {
    loading.value = false;
  }
});

function selectRole(role: any) {
  selectedRole.value = role;

  // ดึง permission ของ role
  selectedPermissions.value = role.permissions.map((p: any) => p.name);
}

function togglePermission(name: string) {
  if (selectedPermissions.value.includes(name)) {
    selectedPermissions.value = selectedPermissions.value.filter(
      (p) => p !== name
    );
  } else {
    selectedPermissions.value.push(name);
  }
}

async function savePermissions() {
  //   await axios.post("/api/update-role-permission",{
  //     roleId: selectedRole.value.id,
  //     permissions: selectedPermissions.value
  //   });

  alert("บันทึกสำเร็จ");
}

const goBack = () => {
    router.back();
}
</script>

<template>
  <div>
    <button
      @click="goBack()"
      class="px-3 py-1 bg-yellow-500 text-white text-xs font-medium rounded hover:bg-yellow-600 transition-colors"
    >
      Back
    </button>
    <div class="grid grid-cols-2 gap-6">
      <!-- Role list -->
      <div class="bg-slate-800 p-4 rounded-xl">
        <h2 class="text-lg font-bold mb-4">Roles</h2>

        <div
          v-for="role in roles"
          :key="role.id"
          class="p-3 rounded-lg cursor-pointer hover:bg-slate-700"
          :class="selectedRole?.id === role.id ? 'bg-slate-700' : ''"
          @click="selectRole(role)"
        >
          {{ role.name }}
        </div>
      </div>

      <!-- Permission panel -->
      <div class="bg-slate-800 p-4 rounded-xl">
        <h2 class="text-lg font-bold mb-4">
          Permissions - {{ selectedRole?.name }}
        </h2>

        <div class="grid grid-cols-2 gap-3">
          <label
            v-for="perm in allPermissions"
            :key="perm.id"
            class="flex items-center gap-2 bg-slate-700 p-2 rounded-lg"
          >
            <input
              type="checkbox"
              :value="perm.name"
              :checked="selectedPermissions.includes(perm.name)"
              @change="togglePermission(perm.name)"
            />

            {{ perm.name }}
          </label>
        </div>

        <button
          class="mt-6 bg-blue-500 px-4 py-2 rounded-lg"
          @click="savePermissions"
          v-if="selectedRole"
        >
          Save
        </button>
      </div>
    </div>
  </div>
</template>
