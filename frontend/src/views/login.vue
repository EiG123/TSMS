<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { AuthApiService } from "../services/auth.api";

const router = useRouter();

const email = ref("");
const password = ref("");

const handleLogin = async () => {
  try {
    const data = await AuthApiService.login(email.value, password.value);

    alert("ยินดีต้อนรับ: " + data.user.username);

    // 👉 redirect ไปหน้า home
    router.push("/home");
  } catch (error: any) {
    alert(error.response?.data?.message || "Login Failed");
  }
};
</script>


<template>
  <div class="flex items-center justify-center h-screen bg-base-200">
    <div class="card w-96 bg-base-100 shadow-xl">
      <div class="card-body">
        <h2 class="card-title justify-center text-2xl mb-4">เข้าสู่ระบบ</h2>
        <div class="form-control">
          <input
            v-model="email"
            type="text"
            placeholder="Email"
            class="input input-bordered mb-4"
          />
          <input
            v-model="password"
            type="password"
            placeholder="Password"
            class="input input-bordered mb-6"
          />
        </div>
        <div class="card-actions justify-end">
          <button @click="handleLogin" class="btn btn-primary w-full text-lg">
            Login
          </button>
        </div>
      </div>
    </div>
  </div>
</template>