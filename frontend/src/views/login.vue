<script setup lang="ts">
import { ref } from 'vue';
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
    router.push('/home');
  } else {
    error.value = result.error || 'เข้าสู่ระบบไม่สำเร็จ';
    router.push('/home');
  }
};
</script>

<template>
  <div class="login-container">
    <form @submit.prevent="handleLogin" class="login-form">
      <h2>เข้าสู่ระบบ</h2>
      
      <div class="form-group">
        <input 
          v-model="email" 
          type="email" 
          placeholder="อีเมล" 
          required
          :disabled="loading"
        />
      </div>
      
      <div class="form-group">
        <input 
          v-model="password" 
          type="password" 
          placeholder="รหัสผ่าน" 
          required
          :disabled="loading"
        />
      </div>
      
      <button type="submit" :disabled="loading" class="btn-login">
        {{ loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ' }}
      </button>
      
      <p v-if="error" class="error-message">{{ error }}</p>
    </form>
  </div>
</template>