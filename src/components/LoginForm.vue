<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Button, Input } from 'ant-design-vue';
import { UserOutlined, SafetyOutlined, MessageOutlined } from '@ant-design/icons-vue';
import Captcha from './Captcha.vue';
import { serializeToLocalStorage } from '../utils/Serializable';
import router from '../router';

interface LoginFormProps {
  base_url: string;
  s: number;
  r: number;
}

const props = defineProps<LoginFormProps>();

const phone = ref('');
const captcha = ref('');
const sms = ref('');
const loading = ref(false);
const countdown = ref(60);
const isRunning = ref(false);

onMounted(() => {
  const data = localStorage.getItem('data');
  if (data) {
    router.push('/control');
  }
});

const handlePhoneChange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  const value = target.value;
  if (/^\d*$/.test(value) && value.length <= 11) {
    phone.value = value;
  }
};

const handleCaptchaChange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  const value = target.value;
  if (/^\d*$/.test(value)) {
    captcha.value = value;
  }
};

const handleSmsChange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  const value = target.value;
  if (/^\d*$/.test(value) && value.length <= 6) {
    sms.value = value;
  }
};

let timer: ReturnType<typeof setInterval> | null = null;

const startCountdown = () => {
  countdown.value = 60;
  isRunning.value = true;
  timer = setInterval(() => {
    if (countdown.value <= 1) {
      if (timer) clearInterval(timer);
      isRunning.value = false;
      countdown.value = 60;
    } else {
      countdown.value--;
    }
  }, 1000);
};

const getCode = () => {
  loading.value = true;
  fetch(`${props.base_url}/api/v1/acc/login/code`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Connection': 'keep-alive',
      'ApplicationType': '1,1',
      'Accept': '*/*',
      'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148',
      'Content-Length': '62',
      'Accept-Language': 'zh-TW,zh-Hant;q=0.9',
      'Accept-Encoding': 'gzip, deflate, br'
    },
    body: JSON.stringify({
      s: props.s,
      authCode: captcha.value,
      un: phone.value
    })
  })
    .then(async (res) => {
      loading.value = false;
      if (res.ok) {
        const json = await res.json();
        if (json.code === 0) {
          alert('验证码已发送，请注意查收');
          startCountdown();
        } else if (json.code === -2) {
          alert('图形验证码错误');
        } else {
          alert('未知错误');
        }
      }
    })
    .catch(() => {
      loading.value = false;
      alert('发送失败，请重试');
    });
};

const login = () => {
  if (phone.value.length < 11) {
    alert('请输入正确的手机号');
    return;
  }
  if (captcha.value.length === 0) {
    alert('请输入图形验证码');
    return;
  }
  if (sms.value.length < 6) {
    alert('请输入短信验证码');
    return;
  }

  fetch(`${props.base_url}/api/v1/acc/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Connection': 'keep-alive',
      'ApplicationType': '1,1',
      'Accept': '*/*',
      'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148',
      'Content-Length': '95',
      'Accept-Language': 'zh-TW,zh-Hant;q=0.9',
      'Accept-Encoding': 'gzip, deflate, br'
    },
    body: JSON.stringify({
      openCode: '',
      un: phone.value,
      authCode: sms.value,
      cid: ''
    })
  })
    .then(async (res) => {
      if (res.ok) {
        const json = await res.json();
        if (json.code === 0) {
          serializeToLocalStorage('data', json.data);
          router.push('/control');
        } else if (json.code === -2) {
          alert('验证码错误');
        } else {
          alert('登录失败');
        }
      }
    })
    .catch(() => {
      alert('登录失败，请检查网络');
    });
};
</script>

<template>
  <div class="login-form">
    <!-- 手机号输入 -->
    <div class="form-item">
      <label class="form-label">手机号</label>
      <Input
        v-model:value="phone"
        placeholder="请输入手机号"
        size="large"
        class="custom-input"
        @input="handlePhoneChange"
      >
        <template #prefix>
          <UserOutlined class="input-icon" />
        </template>
      </Input>
    </div>

    <!-- 图形验证码 -->
    <div class="form-item">
      <label class="form-label">图形验证码</label>
      <div class="captcha-wrapper">
        <Input
          v-model:value="captcha"
          placeholder="请输入验证码"
          size="large"
          class="custom-input"
          @input="handleCaptchaChange"
        >
          <template #prefix>
            <SafetyOutlined class="input-icon" />
          </template>
        </Input>
        <div class="captcha-image-wrapper">
          <Captcha :base_url="base_url" :s="s" :r="r" />
        </div>
      </div>
    </div>

    <!-- 短信验证码 -->
    <div class="form-item">
      <label class="form-label">短信验证码</label>
      <div class="sms-wrapper">
        <Input
          v-model:value="sms"
          placeholder="请输入验证码"
          size="large"
          class="custom-input"
          @input="handleSmsChange"
        >
          <template #prefix>
            <MessageOutlined class="input-icon" />
          </template>
        </Input>
        <Button
          :disabled="phone.length < 11 || captcha.length === 0 || isRunning"
          @click="getCode"
          :loading="loading"
          class="sms-btn"
          size="large"
        >
          {{ isRunning ? `${countdown}s` : '获取' }}
        </Button>
      </div>
    </div>

    <!-- 登录按钮 -->
    <Button
      type="primary"
      size="large"
      :disabled="phone.length < 11 || captcha.length === 0 || sms.length < 6"
      @click="login"
      class="login-btn"
      block
    >
      登 录
    </Button>
  </div>
</template>

<style scoped>
.login-form {
  width: 100%;
}

.form-item {
  margin-bottom: 20px;
}

.form-label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin-bottom: 8px;
}

.custom-input {
  border-radius: 10px;
}

:deep(.ant-input-affix-wrapper-lg) {
  border-radius: 10px;
  border: 1px solid #e8e8e8;
}

:deep(.ant-input-affix-wrapper-lg:hover) {
  border-color: #1E90FF;
}

:deep(.ant-input-affix-wrapper-lg:focus-within) {
  border-color: #1E90FF;
  box-shadow: 0 0 0 2px rgba(30, 144, 255, 0.1);
}

.input-icon {
  color: #1E90FF;
  font-size: 16px;
}

.captcha-wrapper,
.sms-wrapper {
  display: flex;
  gap: 10px;
  align-items: stretch;
}

.captcha-image-wrapper {
  width: 130px;
  height: 48px;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid #e8e8e8;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
}

.captcha-image-wrapper:hover {
  border-color: #1E90FF;
}

.sms-btn {
  width: 80px;
  border-radius: 10px;
  background: #1E90FF;
  border: none;
  color: white;
  font-weight: 500;
  flex-shrink: 0;
}

.sms-btn:hover:not(:disabled) {
  background: #1c86ee;
}

.sms-btn:disabled {
  background: #e8e8e8;
  color: #999;
}

.login-btn {
  margin-top: 8px;
  height: 48px;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  background: #1E90FF;
  border: none;
}

.login-btn:hover:not(:disabled) {
  background: #1c86ee;
}

.login-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>