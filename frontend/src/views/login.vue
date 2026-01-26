<script setup lang="ts">
import { ref, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const authStore = useAuthStore();
const router = useRouter();

const email = ref('');
const password = ref('');
const error = ref('');
const loading = ref(false);

const handleLogin = async () => {
  loading.value = true;
  error.value = '';
  
  const result = await authStore.login(email.value, password.value);
  
  loading.value = false;

  if (result.success) {
    window.location.href = "/home";
  } else {
    error.value = result.error;
  }
};
</script>

<template>
  <form @submit.prevent="handleLogin">
    <input v-model="email" type="email" placeholder="Email" required />
    <input v-model="password" type="password" placeholder="Password" required />
    <button type="submit" :disabled="loading">
      {{ loading ? 'กำลัง Login...' : 'Login' }}
    </button>
    <p v-if="error" style="color: red;">{{ error }}</p>
  </form>
</template>