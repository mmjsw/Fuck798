<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Button } from 'ant-design-vue';
import { PoweroffOutlined, ThunderboltOutlined } from '@ant-design/icons-vue';
import { deserializeFromLocalStorage, serializeToLocalStorage } from '../utils/Serializable';
import router from '../router';
import { VueDraggable } from 'vue-draggable-plus';
import Hitokoto from './Hitokoto.vue';

interface Device {
  id: string;
  name: string;
  status: number;
  btype: number;
  gene: {
    status: number;
  };
  addr: {
    geo: {
      type: string;
      coordinates: number[];
    };
    detail: string;
    prov: string;
    city: string;
    dist: string;
  };
  ep: {
    id: string;
    name: string;
  };
  ltime: number;
  bm: {
    dtype: number;
    img: string;
  };
}

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

interface DeviceStatus {
  id: string;
  status: boolean;
}

interface DeviceListProps {
  base_url: string;
}

const props = defineProps<DeviceListProps>();

const devices = ref<Device[]>([]);
const tk = ref('');
const isRunning = ref<DeviceStatus[]>([]);
const loading = ref(false);
const refreshing = ref(false);

onMounted(() => {
  loadDevices();
});

// 保存设备顺序到 localStorage
const saveDeviceOrder = (orderedDevices: Device[]) => {
  const deviceOrder = orderedDevices.map(device => device.id);
  localStorage.setItem('deviceOrder', JSON.stringify(deviceOrder));
};

// 从 localStorage 加载设备顺序
const loadDeviceOrder = (allDevices: Device[]): Device[] => {
  const savedOrder = localStorage.getItem('deviceOrder');
  if (!savedOrder) {
    return allDevices;
  }
  
  try {
    const order: string[] = JSON.parse(savedOrder);
    const orderMap = new Map(order.map((id, index) => [id, index]));
    
    // 按照保存的顺序排序
    const sortedDevices = [...allDevices].sort((a, b) => {
      const orderA = orderMap.get(a.id) ?? Infinity;
      const orderB = orderMap.get(b.id) ?? Infinity;
      return orderA - orderB;
    });
    
    // 如果有新的设备（不在保存的顺序中），将其放到最后
    const sortedWithNewDevices = sortedDevices.filter(device => orderMap.has(device.id));
    const newDevices = allDevices.filter(device => !orderMap.has(device.id));
    
    return [...sortedWithNewDevices, ...newDevices];
  } catch {
    return allDevices;
  }
};

// 拖拽结束时保存新的顺序
const onDragEnd = () => {
  saveDeviceOrder(devices.value);
};

const loadDevices = () => {
  refreshing.value = true;
  const data = localStorage.getItem('data');
  if (!data) {
    router.push('/');
    return;
  }

  const storage = deserializeFromLocalStorage<LocalData>('data');
  let token = null;
  if (storage) {
    token = storage.al.token;
    tk.value = token;
  }

  if (token) {
    fetch(`${props.base_url}/api/v1/ui/app/master?`, {
      method: 'GET',
      headers: {
        'Connection': 'keep-alive',
        'ApplicationType': '1,1',
        'Accept': '*/*',
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148',
        'Authorization': token,
        'Accept-Language': 'zh-TW,zh-Hant;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br'
      }
    })
      .then(async (res) => {
        refreshing.value = false;
        const json = await res.json();
        if (json.code !== 0 || !json.data || !json.data.favos) {
          localStorage.removeItem('data');
          alert('Token无效或已过期，请重新登录');
          router.push('/');
          return;
        }
        
        // 应用保存的设备顺序
        const loadedDevices = loadDeviceOrder(json.data.favos);
        devices.value = loadedDevices;
        isRunning.value = loadedDevices.map((device: Device) => ({
          id: device.id,
          status: device.gene.status === 99
        }));
      })
      .catch(() => {
        refreshing.value = false;
        alert('获取设备列表失败');
      });
  }
};

const startOrEnd = (did: string) => {
  loading.value = true;
  const deviceStatus = isRunning.value.find((item) => item.id === did)?.status;

  if (deviceStatus) {
    fetch(`${props.base_url}/api/v1/dev/start?did=${did}&upgrade=true&ptype=91&rcp=false`, {
      method: 'GET',
      headers: {
        'Connection': 'keep-alive',
        'ApplicationType': '1,1',
        'Accept': '*/*',
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148',
        'Authorization': tk.value,
        'Accept-Language': 'zh-TW,zh-Hant;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br'
      }
    })
      .then(async (res) => {
        loading.value = false;
        const json = await res.json();
        if (json.code === 0) {
          isRunning.value = isRunning.value.map((item) =>
            item.id === did ? { ...item, status: false } : item
          );
        } else {
          alert('设备可能已经开启或者开启失败');
        }
      })
      .catch(() => {
        alert('设备开启失败');
        loading.value = false;
      });
  } else {
    fetch(`${props.base_url}/api/v1/dev/end?did=${did}`, {
      method: 'GET',
      headers: {
        'Connection': 'keep-alive',
        'ApplicationType': '1,1',
        'Accept': '*/*',
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148',
        'Authorization': tk.value,
        'Accept-Language': 'zh-TW,zh-Hant;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br'
      }
    })
      .then(async (res) => {
        loading.value = false;
        const json = await res.json();
        if (json.code === 0) {
          isRunning.value = isRunning.value.map((item) =>
            item.id === did ? { ...item, status: true } : item
          );
        } else {
          alert('设备可能已经关闭或者关闭失败');
        }
      })
      .catch(() => {
        alert('设备关闭失败');
        loading.value = false;
      });
  }
};
</script>

<template>
  <div class="device-list">
    <!-- 刷新按钮和每日一言 -->
    <div class="refresh-bar">
      <div class="hitokoto-container">
        <Hitokoto align="left" />
      </div>
      <Button @click="loadDevices" :loading="refreshing" class="refresh-btn">
        刷新列表
      </Button>
    </div>

    <!-- 空状态 -->
    <div v-if="devices.length === 0 && !refreshing" class="empty-state">
      <div class="empty-icon">📱</div>
      <p class="empty-text">暂无设备</p>
    </div>

    <!-- 设备卡片列表 - 可拖拽排序 -->
    <VueDraggable
      v-else
      v-model="devices"
      class="device-grid"
      ghost-class="ghost-card"
      :animation="200"
      @end="onDragEnd"
    >
      <div
        v-for="device in devices"
        :key="device.id"
        class="device-card"
        :class="{ 'device-inuse': !isRunning.find(item => item.id === device.id)?.status }"
      >
        <!-- 设备头部 -->
        <div class="device-header">
          <div class="device-icon">
            <ThunderboltOutlined class="icon" />
          </div>
          <div class="device-status">
            <span
              :class="[
                'status-dot',
                isRunning.find(item => item.id === device.id)?.status ? 'status-online' : 'status-busy'
              ]"
            ></span>
            <span class="status-text">
              {{ isRunning.find(item => item.id === device.id)?.status ? '空闲中' : '使用中' }}
            </span>
          </div>
        </div>

        <!-- 设备信息 -->
        <div class="device-info">
          <h3 class="device-name">{{ device.name }}</h3>
          <p v-if="device.addr?.detail" class="device-address">
            {{ device.addr.detail }}
          </p>
        </div>

        <!-- 设备控制 -->
        <div class="device-action">
          <Button
            :type="isRunning.find(item => item.id === device.id)?.status ? 'primary' : 'default'"
            :loading="loading"
            @click="startOrEnd(device.id)"
            class="action-btn"
            size="large"
            block
          >
            <template #icon>
              <PoweroffOutlined />
            </template>
            {{ isRunning.find(item => item.id === device.id)?.status ? '立即开启' : '立即关闭' }}
          </Button>
        </div>
      </div>
    </VueDraggable>
  </div>
</template>

<style scoped>
.device-list {
  width: 100%;
}

.refresh-bar {
  margin-bottom: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}

.hitokoto-container {
  flex: 1;
  text-align: left;
}

.refresh-btn {
  border-radius: 8px;
  color: #1E90FF;
  border-color: #1E90FF;
  flex-shrink: 0;
}

.refresh-btn:hover {
  color: #1E90FF !important;
  border-color: #1E90FF !important;
  background: rgba(30, 144, 255, 0.05);
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 60px 20px;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 12px;
}

.empty-text {
  font-size: 14px;
  color: #999;
  margin: 0;
}

/* 设备卡片列表 - 可拖拽 */
.device-grid {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* 拖拽时的占位符样式 */
.ghost-card {
  opacity: 0.5;
  background: #f0f9ff;
  border: 2px dashed #1E90FF;
  border-radius: 16px;
}

/* 设备卡片 */
.device-card {
  background: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  border: 1px solid #f0f0f0;
  cursor: grab;
  transition: box-shadow 0.2s, transform 0.2s;
}

.device-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.device-card:active {
  cursor: grabbing;
}

.device-card.device-inuse {
  opacity: 0.85;
}

/* 设备头部 */
.device-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 16px;
}

.device-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: #1E90FF;
  display: flex;
  align-items: center;
  justify-content: center;
}

.device-card.device-inuse .device-icon {
  background: #999;
}

.icon {
  font-size: 24px;
  color: white;
}

.device-status {
  display: flex;
  align-items: center;
  gap: 6px;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.status-online {
  background: #52c41a;
  box-shadow: 0 0 8px rgba(82, 196, 26, 0.4);
}

.status-busy {
  background: #faad14;
}

.status-text {
  font-size: 12px;
  color: #666;
  font-weight: 500;
}

/* 设备信息 */
.device-info {
  margin-bottom: 16px;
}

.device-name {
  font-size: 16px;
  font-weight: 600;
  color: #1a1a2e;
  margin: 0 0 6px 0;
}

.device-address {
  font-size: 12px;
  color: #999;
  margin: 0;
  line-height: 1.4;
}

/* 设备控制 */
.device-action {
  padding-top: 14px;
  border-top: 1px solid #f0f0f0;
}

.action-btn {
  height: 44px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 14px;
}

.action-btn:not(.ant-btn-primary) {
  color: #ff4d4f;
  border-color: #ff4d4f;
  background: #fff1f0;
}

.action-btn:not(.ant-btn-primary):hover {
  color: #ff4d4f !important;
  border-color: #ff4d4f !important;
  background: #fff2f0;
}

.action-btn.ant-btn-primary {
  background: #1E90FF;
  border: none;
}

.action-btn.ant-btn-primary:hover {
  background: #1c86ee;
}
</style>