<script setup lang="ts">
import { ref, onMounted } from 'vue';

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

interface Props {
  align?: 'left' | 'center' | 'right';
}

withDefaults(defineProps<Props>(), {
  align: 'center',
});

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
  <div class="hitokoto" :class="`hitokoto-${align}`">
    <div v-if="loading" class="hitokoto-loading">
      加载中...
    </div>
    <div v-else class="hitokoto-content" @click="fetchHitokoto">
      <span class="hitokoto-text">{{ hitokoto }}</span>
      <span v-if="fromText" class="hitokoto-from">{{ fromText }}</span>
    </div>
  </div>
</template>

<style scoped>
.hitokoto {
  padding: 4px 0;
}

.hitokoto-center {
  text-align: center;
}

.hitokoto-left {
  text-align: left;
}

.hitokoto-right {
  text-align: right;
}

.hitokoto-loading {
  color: #999;
  font-size: 14px;
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
</style>
