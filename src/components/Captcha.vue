<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface CaptchaProps {
  base_url: string
  s: number
  r: number
}

const props = defineProps<CaptchaProps>()

const captcha = ref<string | undefined>(undefined)

const getCaptcha = async (base_url: string, s: number, r: number) => {
  const res = await fetch(`${base_url}/api/v1/captcha/?s=${s}&r=${r}`, {
    method: 'GET',
    headers: {
      'Sec-Fetch-Dest': 'image',
      'Sec-Fetch-Site': 'cross-site',
      'Sec-Fetch-Mode': 'no-cors',
      'Connection': 'keep-alive',
      'Accept': 'image/webp,image/avif,image/jxl,image/heic,image/heic-sequence,video/*;q=0.8,image/png,image/svg+xml,image/*;q=0.8,*/*;q=0.5',
      'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Html5Plus/1.0 (Immersed/20) uni-app',
      'Accept-Language': 'zh-TW,zh-Hant;q=0.9',
      'Accept-Encoding': 'gzip, deflate, br'
    }
  })

  const buffer = await res.arrayBuffer()
  const bytes = new Uint8Array(buffer)
  let binary = ''
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  const base64Image = `data:image/jpeg;base64,${btoa(binary)}`
  return base64Image
}

const getCaptchaImage = () => {
  getCaptcha(props.base_url, props.s, props.r)
    .then((base64Image) => {
      captcha.value = base64Image
    })
    .catch((err) => {
      console.error(err)
    })
}

onMounted(() => {
  getCaptchaImage()
})
</script>

<template>
  <img :src="captcha" @click="getCaptchaImage" class="ml-2 cursor-pointer" />
</template>