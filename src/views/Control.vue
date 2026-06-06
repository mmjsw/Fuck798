<script setup lang="ts">
import { getBaseUrl } from '../utils/BaseURL';
import DeviceList from '../components/DeviceList.vue';
import LogoutBtn from '../components/LogoutBtn.vue';

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
</style>