<script setup lang="ts">
import Chart from 'chart.js/auto'
import type { SimpleChartWidgetProps, SimpleDataset } from '.'
import { onMounted, onUnmounted, ref, watch } from 'vue'

const { widgetProps: props } = defineProps<{ widgetProps: SimpleChartWidgetProps }>()

const chartCanvas = ref<HTMLCanvasElement>()

const chart = ref<Chart | null>()

function formatDataset(dataset: SimpleDataset) {
  return {
    ...dataset,
    borderWidth: 2,
    // tension: 0.2,
    pointRadius: 2,
  }
}

function destroyChart() {
  if (chart.value) {
    chart.value?.destroy()
    chart.value = null
  }
}

function initChart() {
  {
    if (!chartCanvas.value) return
    const ctx = chartCanvas.value.getContext('2d')
    if (!ctx) return

    if (chart.value) destroyChart()

    chart.value = new Chart(ctx, {
      type: props.type,
      data: {
        labels: props.labels,
        datasets: props.datasets.map(formatDataset),
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: false,
        ...props.options,
      },
    })
  }
}

onMounted(initChart)
onUnmounted(destroyChart)

watch(() => [props.type, props.labels, props.datasets, props.options], initChart, { deep: true })
</script>

<template>
  <div class="wh">
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>
