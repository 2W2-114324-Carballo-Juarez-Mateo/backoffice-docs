<script setup>
import { computed } from 'vue'
import FlowPlayer from './FlowPlayer.vue'
import { scenarios } from './scenarios.js'

const props = defineProps({
  name: { type: String, required: true }
})

const scenario = computed(() => scenarios[props.name])
</script>

<template>
  <div v-if="scenario" class="sp">
    <h2 class="sp-title">{{ scenario.title }}</h2>
    <p class="sp-intro">{{ scenario.intro }}</p>
    <FlowPlayer :scenario="scenario" />
  </div>
  <div v-else class="sp">
    <p>Escenario no encontrado: <code>{{ name }}</code></p>
  </div>
</template>

<style scoped>
.sp-title {
  margin-top: 0;
}
.sp-intro {
  color: var(--vp-c-text-2);
  margin-bottom: 16px;
}
</style>