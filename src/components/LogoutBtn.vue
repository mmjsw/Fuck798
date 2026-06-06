<script setup lang="ts">
import { Button } from 'ant-design-vue';
import { LogoutOutlined } from '@ant-design/icons-vue';
import { deserializeFromLocalStorage } from '../utils/Serializable';
import router from '../router';

interface LocalData {
  al: {
    atype: number;
    dtype: number;
    eid: string;
    oid: string;
    stype: number;
    token: string;
    uid: string;
  };
  ar: {
    rids: [];
    types: [];
  };
  showAd: number;
}

interface LogoutBtnProps {
  base_url: string;
}

const props = defineProps<LogoutBtnProps>();

const logout = () => {
  const storage = deserializeFromLocalStorage<LocalData>('data');
  let token = null;
  if (storage) {
    token = storage.al.token;
  }
  if (token) {
    fetch(`${props.base_url}/api/v1/acc/logout`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Connection': 'keep-alive',
        'ApplicationType': '1,1',
        'Accept': '*/*',
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Html5Plus/1.0 (Immersed/20) uni-app',
        'Accept-Language': 'zh-TW,zh-Hant;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'Authorization': token
      }
    })
      .then(async (res) => {
        if (res.ok) {
          const json = await res.json();
          if (json.code === 0) {
            localStorage.removeItem('data');
            router.push('/');
          } else {
            alert('登出失败，请重试');
          }
        }
      });
  } else {
    localStorage.removeItem('data');
    router.push('/');
  }
};
</script>

<template>
  <Button @click="logout" class="logout-btn" size="small">
    <template #icon>
      <LogoutOutlined />
    </template>
    退出
  </Button>
</template>

<style scoped>
.logout-btn {
  border-radius: 8px;
  color: #ff4d4f;
  border-color: #ff4d4f;
  background: #fff1f0;
}

.logout-btn:hover {
  color: #ff4d4f !important;
  border-color: #ff4d4f !important;
  background: #fff2f0;
}
</style>