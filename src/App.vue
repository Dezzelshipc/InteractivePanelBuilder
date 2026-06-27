<script lang="ts" setup>
import { ref } from 'vue'
import type { Ref } from 'vue'
import { get_default_schema } from '@/schema/schema'
import type { SchemaMain } from '@/schema/schema'
import GridContainer from './components/grid/GridContainer.vue'

let schema = ref(get_default_schema())
fetch('./examples/simple.json')
  .then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }
    return response.json()
  })
  .then((jsonContent) => {
    schema.value = jsonContent
    console.log(jsonContent)
  })
  .catch((error) => {
    console.error('Fetch error:', error)
  })
</script>

<template>
  <GridContainer :layout="schema.layout" :widgets="schema.widgets" />
</template>
