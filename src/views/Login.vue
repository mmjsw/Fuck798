<script setup lang="ts">
import { getBaseUrl } from '../utils/BaseURL';
import LoginForm from '../components/LoginForm.vue';

const base_url = getBaseUrl();
const s = Math.random();
const r = new Date().getTime();
</script>

<template>
  <div class="login-container">
    <!-- 登录卡片 -->
    <div class="login-card">
      <!-- 头部 -->
      <div class="login-header">
        <div class="logo-container">
          <img src="/fuck798.png" alt="logo" class="logo" />
        </div>
        <h1 class="title">去你的慧生活</h1>
        <p class="subtitle">简洁无广告 · 便捷控制</p>
      </div>

      <!-- 表单 -->
      <div class="login-form-wrapper">
        <LoginForm :base_url="base_url" :s="s" :r="r" />
      </div>

      <!-- 底部 -->
      <div class="login-footer">
        <p class="footer-text">Fuck Shake-to-Open Ads</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f7fa;
  padding: 20px;
}

/* 登录卡片 */
.login-card {
  width: 100%;
  max-width: 400px;
  background: white;
  border-radius: 20px;
  padding: 40px 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

/* 头部 */
.login-header {
  text-align: center;
  margin-bottom: 32px;
}

.logo-container {
  margin-bottom: 16px;
}

.logo {
  width: 60px;
  height: 60px;
  border-radius: 14px;
}

.title {
  font-size: 24px;
  font-weight: 700;
  color: #1a1a2e;
  margin: 0 0 6px 0;
}

.subtitle {
  font-size: 13px;
  color: #666;
  margin: 0;
}

/* 表单 */
.login-form-wrapper {
  margin-bottom: 20px;
}

/* 底部 */
.login-footer {
  text-align: center;
  padding-top: 16px;
  border-top: 1px solid #eee;
}

.footer-text {
  font-size: 12px;
  color: #999;
  margin: 0;
}
</style>