<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import Hls from 'hls.js'
import type { VideoWidgetProps } from '.'

const props = defineProps<{
  widgetProps: VideoWidgetProps
}>()

const videoElement = ref<HTMLVideoElement | null>(null)
const hlsInstance = ref<Hls | null>(null)
const error = ref(false)

// Проверка, является ли URL HLS-потоком (.m3u8)
const isHls = computed(
  () => props.widgetProps.url?.endsWith('.m3u8') || props.widgetProps.url?.includes('.m3u8'),
)

// Стиль для контейнера (object-fit)
const containerStyle = computed(() => ({
  width: '100%',
  height: '100%',
  'object-fit': props.widgetProps.objectFit || 'cover',
}))

// Инициализация плеера
function initPlayer() {
  if (!videoElement.value) return
  if (isHls.value && Hls.isSupported()) {
    const hls = new Hls({
      // Увеличение буфера для снижения дёрганья
      maxBufferLength: 30,
      maxMaxBufferLength: 60,
      // Настройки ABR (адаптивный битрейт)
      abrEwmaFastLive: 3.0,
      abrEwmaSlowLive: 9.0,
      abrBandWidthFactor: 0.95,
      abrBandWidthUpFactor: 0.7,
      // Оптимизация загрузки сегментов
      fragLoadingTimeOut: 20000,
      manifestLoadingTimeOut: 10000,
      // Использовать MediaSource (по умолчанию true)
      enableWorker: true, // использовать Web Worker для парсинга
      // Управление качеством – позволяем браузеру выбирать оптимальный уровень
      startLevel: -1, // авто
      // Отключаем излишнее логирование (для производительности)
      debug: false,
    })
    hls.loadSource(props.widgetProps.url)
    hls.attachMedia(videoElement.value)
    hls.on(Hls.Events.MANIFEST_PARSED, () => {
      if (props.widgetProps.autoplay) videoElement.value?.play()
    })
    hlsInstance.value = hls
  } else {
    videoElement.value.src = props.widgetProps.url
    if (props.widgetProps.autoplay) videoElement.value.play()
  }
}

function onLoaded() {
  error.value = false
}

function onError() {
  error.value = true
}

watch(
  () => props.widgetProps.url,
  (newURL, oldURL) => {
    if (newURL !== oldURL) {
      destroyPlayer()
      initPlayer()
    }
  },
)

function destroyPlayer() {
  if (hlsInstance.value) {
    hlsInstance.value.destroy()
    hlsInstance.value = null
  }
  if (videoElement.value) {
    videoElement.value.pause()
    videoElement.value.src = ''
  }
}

onMounted(initPlayer)
onBeforeUnmount(destroyPlayer)
</script>

<template>
  <div class="video-widget wh">
    <!-- HLS / MP4 -->
    <video
      ref="videoElement"
      :autoplay="props.widgetProps.autoplay"
      :muted="props.widgetProps.muted"
      :loop="props.widgetProps.loop"
      :controls="props.widgetProps.controls"
      playsinline
      @loadedmetadata="onLoaded"
      @error="onError"
      :style="containerStyle"
    />
    <div v-if="error" class="video-error">
      <span>⚠️ Не удалось загрузить видео</span>
    </div>
  </div>
</template>

<style scoped>
.video-widget {
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;

  will-change: transform;
}

.video-error {
  position: absolute;
  color: #fff;
  pointer-events: none;
}
</style>
