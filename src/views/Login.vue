<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { GithubOutlined } from '@ant-design/icons-vue';
import { getBaseUrl } from '../utils/BaseURL';
import LoginForm from '../components/LoginForm.vue';

const base_url = getBaseUrl();
const s = Math.random();
const r = new Date().getTime();

const hitokotoText = ref('');
const hitokotoFrom = ref('');
const hitokotoLoading = ref(false);

const fetchHitokoto = async () => {
  hitokotoLoading.value = true;
  try {
    const response = await fetch('https://v1.hitokoto.cn/');
    const data = await response.json();
    hitokotoText.value = data.hitokoto;
    hitokotoFrom.value = data.from ? `—— 《${data.from}》` : '';
  } catch (error) {
    hitokotoText.value = '生活不止眼前的苟且，还有诗和远方。';
    hitokotoFrom.value = '';
  } finally {
    hitokotoLoading.value = false;
  }
};

onMounted(() => {
  fetchHitokoto();
});
</script>

<template>
  <div class="login-wrapper">
    <div class="login-container">
      <!-- 登录卡片 -->
      <div class="login-card">
        <!-- 头部 -->
        <div class="login-header">
          <div class="logo-container">
            <img src="/fuck798.png" alt="logo" class="logo" />
          </div>
          <h1 class="title">去你的慧生活</h1>
          <p class="subtitle">让工具成为工具</p>
        </div>

        <!-- 表单 -->
        <div class="login-form-wrapper">
          <LoginForm :base_url="base_url" :s="s" :r="r" />
        </div>

        <!-- 每日一言 -->
        <div class="card-hitokoto">
          <div v-if="hitokotoLoading" class="hitokoto-loading">加载中...</div>
          <div v-else class="hitokoto-content" @click="fetchHitokoto">
            <span class="hitokoto-text">{{ hitokotoText }}</span>
            <span v-if="hitokotoFrom" class="hitokoto-from">{{ hitokotoFrom }}</span>
          </div>
        </div>

        <!-- 页脚信息 -->
        <div class="card-footer">
          <p class="footer-line1">所有数据均保存在浏览器，请放心使用</p>
          <div class="footer-line2">
            <span class="author-text">Created By MMJSW</span>
            <a href="" target="_blank" class="github-link">
              <GithubOutlined class="github-icon" />
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f5f7fa;
}

.login-container {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
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
  font-weight: 400;
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

/* 卡片内每日一言 */
.card-hitokoto {
  padding: 12px 0;
  border-top: 1px solid #f0f0f0;
  text-align: center;
}

.hitokoto-loading {
  color: #999;
  font-size: 13px;
}

.hitokoto-content {
  cursor: pointer;
  transition: all 0.2s;
}

.hitokoto-content:hover {
  opacity: 0.8;
}

.hitokoto-text {
  display: block;
  color: #333;
  font-size: 13px;
  line-height: 1.5;
  font-style: italic;
}

.hitokoto-from {
  display: block;
  color: #999;
  font-size: 11px;
  margin-top: 4px;
}

/* 卡片内页脚 */
.card-footer {
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;
  text-align: center;
}

.footer-line1 {
  font-size: 13px;
  color: #8B0000;
  margin: 0 0 6px 0;
}

.footer-line2 {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.author-text {
  font-size: 13px;
  color: #8A2BE2;
}

.github-link {
  color: #8A2BE2;
  text-decoration: none;
  display: flex;
  align-items: center;
}

.github-link:hover {
  opacity: 0.8;
}

.github-icon {
  font-size: 18px;
}
</style>