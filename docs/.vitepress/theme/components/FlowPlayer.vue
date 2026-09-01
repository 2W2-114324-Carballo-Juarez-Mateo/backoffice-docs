<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  scenario: { type: Object, required: true }
})

const W = 1000
const H = 640

const BANDS = {
  front: { top: 26, bottom: 150 },
  back: { top: 176, bottom: 330 },
  msg: { top: 356, bottom: 470 },
  db: { top: 496, bottom: 616 }
}

const stepIndex = ref(0)
const playing = ref(false)
const root = ref(null)
const fsActive = ref(false)
let timer = null

const layers = computed(() => props.scenario.layers)
const nodes = computed(() => props.scenario.nodes)
const edges = computed(() => props.scenario.edges)
const steps = computed(() => props.scenario.steps)
const entities = computed(() => props.scenario.entities || [])

const currentStep = computed(() => steps.value[stepIndex.value] || steps.value[0])

const bandOf = (layerId) => BANDS[layerId] || { top: 0, bottom: 100 }

const nodeById = (id) => nodes.value.find((n) => n.id === id)
const nodeX = (id) => {
  const n = nodeById(id)
  return n ? (n.x / 100) * W : 0
}
const nodeY = (id) => {
  const n = nodeById(id)
  return n ? (bandOf(n.layer).top + bandOf(n.layer).bottom) / 2 : 0
}

const nodeActive = (id) => (currentStep.value.nodes || []).includes(id)
const edgeActive = (id) => (currentStep.value.edges || []).includes(id)

const dur = computed(() => props.scenario.duration || 1.6)

function go(step) {
  playing.value = false
  clearInterval(timer)
  stepIndex.value = Math.min(Math.max(0, step), steps.value.length - 1)
}

function next() { go(stepIndex.value + 1) }
function prev() { go(stepIndex.value - 1) }

function togglePlay() {
  playing.value = !playing.value
  if (playing.value) {
    timer = setInterval(() => {
      if (stepIndex.value >= steps.value.length - 1) {
        playing.value = false
        clearInterval(timer)
        stepIndex.value = 0
      } else {
        stepIndex.value++
      }
    }, (props.scenario.stepMs || 2400))
  } else {
    clearInterval(timer)
  }
}

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    root.value?.requestFullscreen?.()
  } else {
    document.exitFullscreen()
  }
}

function onFsChange() {
  fsActive.value = !!document.fullscreenElement
}

onMounted(() => document.addEventListener('fullscreenchange', onFsChange))
onBeforeUnmount(() => {
  clearInterval(timer)
  document.removeEventListener('fullscreenchange', onFsChange)
  if (document.fullscreenElement) document.exitFullscreen()
})
</script>

<template>
  <div ref="root" class="fp">
    <div class="fp-player">
      <svg class="fp-svg" :viewBox="`0 0 ${W} ${H}`" role="img" :aria-label="scenario.title">
        <defs>
          <marker id="fp-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto-start-reverse">
            <path d="M0 0 L10 5 L0 10 z" fill="var(--vp-c-text-3)"></path>
          </marker>
        </defs>

        <g v-for="layer in layers" :key="layer.id">
          <rect :x="0" :y="bandOf(layer.id).top" :width="W" :height="bandOf(layer.id).bottom - bandOf(layer.id).top" rx="12" class="fp-band" :data-layer="layer.id"></rect>
          <text :x="14" :y="bandOf(layer.id).top + 22" class="fp-band-label" :data-layer="layer.id">{{ layer.name }}</text>
        </g>

        <g v-for="edge in edges" :key="edge.id">
          <line :x1="nodeX(edge.from)" :y1="nodeY(edge.from)" :x2="nodeX(edge.to)" :y2="nodeY(edge.to)"
                class="fp-edge" :class="{ 'is-active': edgeActive(edge.id) }"
                :marker-end="'url(#fp-arrow)'"></line>
          <circle v-if="edgeActive(edge.id)" :key="stepIndex + '-' + edge.id" r="7" class="fp-packet">
            <animateMotion :dur="dur + 's'" repeatCount="indefinite" :path="`M ${nodeX(edge.from)} ${nodeY(edge.from)} L ${nodeX(edge.to)} ${nodeY(edge.to)}`"></animateMotion>
          </circle>
          <text v-if="edge.label" :x="(nodeX(edge.from) + nodeX(edge.to)) / 2" :y="(nodeY(edge.from) + nodeY(edge.to)) / 2 - 10"
                text-anchor="middle" class="fp-edge-label" :class="{ 'is-active': edgeActive(edge.id) }">{{ edge.label }}</text>
        </g>

        <g v-for="node in nodes" :key="node.id" class="fp-node" :class="{ 'is-active': nodeActive(node.id) }">
          <rect :x="nodeX(node.id) - 47" :y="nodeY(node.id) - 27" rx="9" width="94" height="54" class="fp-node-rect"></rect>
          <text :x="nodeX(node.id)" :y="nodeY(node.id) - 3" text-anchor="middle" class="fp-node-label">{{ node.label }}</text>
          <text :x="nodeX(node.id)" :y="nodeY(node.id) + 13" text-anchor="middle" class="fp-node-note">{{ node.note }}</text>
        </g>
      </svg>

      <div class="fp-controls">
        <button class="fp-btn" @click="prev" :disabled="stepIndex === 0" aria-label="Paso anterior">◀</button>
        <button class="fp-btn fp-btn-play" @click="togglePlay" :aria-label="playing ? 'Pausar' : 'Reproducir'">
          {{ playing ? '⏸' : '▶' }}
        </button>
        <button class="fp-btn" @click="next" :disabled="stepIndex >= steps.length - 1" aria-label="Paso siguiente">▶</button>
        <button class="fp-btn" @click="go(0)" aria-label="Reiniciar">↺</button>
        <div class="fp-progress">
          <span class="fp-dot" v-for="(s, i) in steps" :key="i" :class="{ 'is-active': i === stepIndex, 'is-done': i < stepIndex }" @click="go(i)" :title="`Paso ${i + 1}`"></span>
        </div>
        <button class="fp-btn fp-btn-fs" @click="toggleFullscreen" :aria-label="fsActive ? 'Salir de pantalla completa' : 'Pantalla completa'" :title="fsActive ? 'Salir de pantalla completa' : 'Pantalla completa'">
          <svg v-if="!fsActive" class="fp-fs-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M8 3H5a2 2 0 0 0-2 2v3"></path>
            <path d="M21 8V5a2 2 0 0 0-2-2h-3"></path>
            <path d="M3 16v3a2 2 0 0 0 2 2h3"></path>
            <path d="M16 21h3a2 2 0 0 0 2-2v-3"></path>
          </svg>
          <svg v-else class="fp-fs-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M8 3v3a2 2 0 0 1-2 2H3"></path>
            <path d="M21 8h-3a2 2 0 0 1-2-2V3"></path>
            <path d="M3 16h3a2 2 0 0 1 2 2v3"></path>
            <path d="M16 21v-3a2 2 0 0 1 2-2h3"></path>
          </svg>
        </button>
        <span class="fp-stepno">{{ stepIndex + 1 }} / {{ steps.length }}</span>
      </div>

      <div class="fp-step" :key="stepIndex">
        <strong>Paso {{ stepIndex + 1 }}.</strong> {{ currentStep.text }}
      </div>
    </div>

    <div v-if="entities.length" class="fp-entities">
      <div class="fp-entities-title">Entidades del proyecto (ejemplo)</div>
      <div class="fp-entity" v-for="e in entities" :key="e.name">
        <code>{{ e.name }}</code>
        <span>{{ e.detail }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.fp {
  --fp-front: #e8590c;
  --fp-back: #1971c2;
  --fp-msg: #862e9c;
  --fp-db: #2f9e44;
}
.fp-player {
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  padding: 10px;
  background: var(--vp-c-bg-soft);
}
.fp-svg {
  width: 100%;
  height: auto;
  display: block;
}
.fp-band {
  fill: transparent;
}
.fp-band[data-layer='front'] { fill: rgba(232, 89, 12, 0.09); }
.fp-band[data-layer='back'] { fill: rgba(25, 113, 194, 0.09); }
.fp-band[data-layer='msg'] { fill: rgba(134, 46, 156, 0.09); }
.fp-band[data-layer='db'] { fill: rgba(47, 158, 68, 0.09); }
.fp-band-label {
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.12em;
  fill: var(--vp-c-text-3);
}
.fp-band-label[data-layer='front'] { fill: #e8590c; }
.fp-band-label[data-layer='back'] { fill: #1971c2; }
.fp-band-label[data-layer='msg'] { fill: #862e9c; }
.fp-band-label[data-layer='db'] { fill: #2f9e44; }

.fp-edge {
  stroke: var(--vp-c-text-3);
  stroke-opacity: 0.35;
  stroke-width: 1.6;
  stroke-dasharray: 4 3;
}
.fp-edge.is-active {
  stroke: var(--vp-c-brand-1);
  stroke-opacity: 1;
  stroke-width: 2.4;
  stroke-dasharray: none;
}
.fp-edge-label {
  font-size: 10px;
  fill: var(--vp-c-text-3);
}
.fp-edge-label.is-active {
  fill: var(--vp-c-brand-1);
  font-weight: 600;
}
.fp-packet {
  fill: var(--vp-c-brand-1);
  filter: drop-shadow(0 0 4px var(--vp-c-brand-1));
}

.fp-node-rect {
  fill: var(--vp-c-bg-elv);
  stroke: var(--vp-c-divider);
  stroke-width: 1.4;
}
.fp-node.is-active .fp-node-rect {
  stroke: var(--vp-c-brand-1);
  stroke-width: 2.4;
  fill: var(--vp-c-bg-soft);
  filter: drop-shadow(0 0 6px rgba(var(--vp-c-brand-1-rgb), 0.55));
}
.fp-node-label {
  font-size: 12px;
  font-weight: 700;
  fill: var(--vp-c-text-1);
}
.fp-node-note {
  font-size: 8.5px;
  fill: var(--vp-c-text-2);
}
.fp-node.is-active .fp-node-label {
  fill: var(--vp-c-brand-1);
}

.fp-controls {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 10px;
  flex-wrap: wrap;
}
.fp-btn {
  width: 30px;
  height: 30px;
  border-radius: 8px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-button-alt-bg);
  color: var(--vp-c-text-1);
  cursor: pointer;
  font-size: 13px;
  transition: border-color 0.2s, background-color 0.2s;
}
.fp-btn:hover:not(:disabled) {
  border-color: var(--vp-c-brand-1);
}
.fp-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
.fp-btn-play {
  color: var(--vp-c-brand-1);
  font-weight: 700;
}
.fp-progress {
  display: flex;
  gap: 5px;
  align-items: center;
  margin-left: 6px;
}
.fp-dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: var(--vp-c-divider);
  cursor: pointer;
  transition: background-color 0.2s, transform 0.2s;
}
.fp-dot.is-active {
  background: var(--vp-c-brand-1);
  transform: scale(1.3);
}
.fp-dot.is-done {
  background: var(--vp-c-text-3);
}
.fp-stepno {
  font-size: 12px;
  color: var(--vp-c-text-2);
  margin-left: auto;
}
.fp-btn-fs {
  margin-left: 4px;
  color: var(--vp-c-text-2);
}
.fp-fs-icon {
  width: 15px;
  height: 15px;
  display: block;
}

/* Pantalla completa */
.fp:fullscreen {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 20px 28px 24px;
  background: var(--vp-c-bg);
  overflow: auto;
  box-sizing: border-box;
}
.fp:fullscreen .fp-player {
  flex: 1 1 auto;
  min-height: 0;
  display: flex;
  flex-direction: column;
}
.fp:fullscreen .fp-svg {
  flex: 1 1 auto;
  min-height: 0;
  width: 100%;
  height: auto;
}
.fp:fullscreen .fp-controls {
  margin-top: 12px;
}
.fp:fullscreen .fp-btn {
  width: 38px;
  height: 38px;
  font-size: 16px;
}
.fp:fullscreen .fp-btn-fs {
  width: 38px;
  height: 38px;
}
.fp:fullscreen .fp-dot {
  width: 12px;
  height: 12px;
}
.fp:fullscreen .fp-stepno {
  font-size: 14px;
}
.fp:fullscreen .fp-step {
  margin-top: 12px;
  padding: 16px 20px;
  font-size: 17px;
  line-height: 1.6;
}
.fp:fullscreen .fp-entities {
  margin-top: 8px;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
}
.fp:fullscreen .fp-entity {
  font-size: 14px;
}
.fp:fullscreen .fp-entities-title {
  font-size: 13px;
}

/* Escalar nodos y textos dentro del SVG en pantalla completa */
.fp:fullscreen .fp-node-rect {
  stroke-width: 2;
}
.fp:fullscreen .fp-node-label {
  font-size: 15px;
}
.fp:fullscreen .fp-node-note {
  font-size: 11px;
}
.fp:fullscreen .fp-edge {
  stroke-width: 2.2;
}
.fp:fullscreen .fp-edge.is-active {
  stroke-width: 3.4;
}
.fp:fullscreen .fp-edge-label {
  font-size: 12px;
}
.fp:fullscreen .fp-band-label {
  font-size: 16px;
}
.fp-step {
  margin-top: 10px;
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-elv);
  font-size: 13.5px;
  line-height: 1.5;
  color: var(--vp-c-text-1);
}
.fp-step strong {
  color: var(--vp-c-brand-1);
}

.fp-entities {
  margin-top: 14px;
  display: grid;
  gap: 8px;
}
.fp-entities-title {
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--vp-c-text-2);
}
.fp-entity {
  display: flex;
  align-items: baseline;
  gap: 10px;
  padding: 8px 12px;
  border-radius: 10px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  font-size: 13px;
}
.fp-entity code {
  color: var(--vp-c-brand-1);
  font-weight: 600;
  white-space: nowrap;
}
.fp-entity span {
  color: var(--vp-c-text-2);
}
</style>