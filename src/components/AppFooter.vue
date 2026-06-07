<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { GithubOutlined } from '@ant-design/icons-vue';

interface HitokotoResponse {
  id: number;
  hitokoto: string;
  type: string;
  from: string;
  from_who: string | null;
  creator: string;
  creator_uid: number;
  reviewer: number;
  uuid: string;
  commit_from: string;
  created_at: string;
  length: number;
}

const hitokoto = ref('');
const fromText = ref('');
const loading = ref(false);

const fetchHitokoto = async () => {
  loading.value = true;
  try {
    const response = await fetch('https://v1.hitokoto.cn/');
    const data: HitokotoResponse = await response.json();
    hitokoto.value = data.hitokoto;
    fromText.value = data.from ? `—— 《${data.from}》` : '';
  } catch (error) {
    console.error('获取每日一言失败:', error);
    hitokoto.value = '生活不止眼前的苟且，还有诗和远方。';
    fromText.value = '';
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchHitokoto();
});
</script>

<template>
  <footer class="app-footer">
    <!-- 每日一言 -->
    <div class="hitokoto-section">
      <div v-if="loading" class="hitokoto-loading">
        加载中...
      </div>
      <div v-else class="hitokoto-content" @click="fetchHitokoto">
        <span class="hitokoto-text">{{ hitokoto }}</span>
        <span v-if="fromText" class="hitokoto-from">{{ fromText }}</span>
      </div>
    </div>

    <!-- 页脚说明 -->
    <div class="footer-info">
      <p class="footer-line1">所有数据均保存在前端，请放心使用</p>
      <div class="footer-line2">
        <span class="author-text">Created By MMJSW</span>
        <a href="" target="_blank" class="github-link">
          <GithubOutlined class="github-icon" />
        </a>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.app-footer {
  text-align: center;
  padding: 16px 20px;
  background: white;
  border-top: 1px solid #eee;
  width: 100%;
  box-sizing: border-box;
}

.hitokoto-section {
  padding-bottom: 12px;
  border-bottom: 1px solid #f0f0f0;
  margin-bottom: 12px;
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
  margin-top: 2px;
}

.footer-info {
  text-align: center;
}

.footer-line1 {
  font-size: 14px;
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
  font-size: 14px;
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
  font-size: 20px;
}
</style>
