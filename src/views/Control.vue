<script setup lang="ts">
import { getBaseUrl } from '../utils/BaseURL';
import DeviceList from '../components/DeviceList.vue';
import LogoutBtn from '../components/LogoutBtn.vue';
import { GithubOutlined } from '@ant-design/icons-vue';

const base_url = getBaseUrl();
</script>

<template>
  <div class="control-container">
    <!-- 顶部导航栏 -->
    <header class="header">
      <div class="header-content">
        <div class="header-left">
          <img src="/fuck798.png" alt="logo" class="header-logo" />
          <h1 class="header-title">设备控制</h1>
        </div>
        <div class="header-right">
          <LogoutBtn :base_url="base_url" />
        </div>
      </div>
    </header>

    <!-- 主内容区 -->
    <main class="main-content">
      <DeviceList :base_url="base_url" />
    </main>

    <!-- 底部页脚 -->
    <footer class="control-footer">
      <p class="footer-line1">所有数据均保存在浏览器，请放心使用</p>
      <div class="footer-line2">
        <span class="author-text">Created By MMJSW</span>
        <a href="" target="_blank" class="github-link">
          <GithubOutlined class="github-icon" />
        </a>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.control-container {
  min-height: 100vh;
  background: #f5f7fa;
  display: flex;
  flex-direction: column;
}

/* 顶部导航栏 */
.header {
  background: white;
  box-shadow: 0 1px 8px rgba(0, 0, 0, 0.06);
  padding: 12px 0;
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  padding: 0 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-logo {
  width: 36px;
  height: 36px;
  border-radius: 8px;
}

.header-title {
  font-size: 18px;
  font-weight: 600;
  color: #1a1a2e;
  margin: 0;
}

/* 主内容区 */
.main-content {
  flex: 1;
  padding: 16px;
}

/* 底部页脚 */
.control-footer {
  text-align: center;
  padding: 16px;
  background: white;
  border-top: 1px solid #eee;
}

.footer-line1 {
  font-size: 13px;
  color: black;
  margin: 0 0 8px 0;
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