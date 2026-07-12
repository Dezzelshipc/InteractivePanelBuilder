<script setup lang="ts">
import { Chart } from 'chart.js'
import type { JsonChartWidgetProps } from '.'
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { useWebSocket } from '@/composable/useWebSocket'

const { widgetProps: props } = defineProps<{ widgetProps: JsonChartWidgetProps }>()
const chartCanvas = ref<HTMLCanvasElement>()

const chart = ref<Chart | null>()

const error = ref<string | null>(null)

function destroyChart() {
  const canvas = chartCanvas.value
  if (!canvas) return

  const ctx = canvas.getContext('2d')
  if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height)

  const existingChart = Chart.getChart(canvas)
  if (existingChart) {
    existingChart.destroy()
  }
  if (chart.value && chart.value !== existingChart) {
    chart.value.destroy()
  }
  chart.value = null
}

function initChart(data?: any) {
  error.value = null

  data = { ...(data ?? props.data ?? {}) }

  if (!data || Object.keys(data).length === 0) {
    error.value = 'JSON Chart: No data'
    return
  }

  data['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    animation: false,
    ...data['options'],
  }

  {
    if (!chartCanvas.value) return
    const ctx = chartCanvas.value.getContext('2d')
    if (!ctx) return

    if (chart.value) destroyChart()

    try {
      chart.value = new Chart(ctx, data)
    } catch (e) {
      destroyChart()
      error.value = e instanceof Error ? e.message : 'Failed to render chart'
      //   console.error(e)
    }
  }
}

onMounted(initChart)
onUnmounted(destroyChart)

watch(
  () => props.data,
  () => initChart(),
  { deep: true },
)

const { data } = useWebSocket(() => props.dataSource, 200)

watch(data, () => {
  initChart(data.value)
})
</script>

<template>
  <div class="wh flex items-center justify-center">
    <canvas v-if="!error" ref="chartCanvas"></canvas>
    <p v-else>{{ error }}</p>
  </div>
</template>
