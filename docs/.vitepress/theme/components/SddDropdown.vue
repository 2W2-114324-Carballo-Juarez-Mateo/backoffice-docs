<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const open = ref(false)
const root = ref(null)

function toggle() {
  open.value = !open.value
}

function close() {
  open.value = false
}

function onDocClick(e) {
  if (root.value && !root.value.contains(e.target)) close()
}

onMounted(() => document.addEventListener('click', onDocClick))
onBeforeUnmount(() => document.removeEventListener('click', onDocClick))
</script>

<template>
  <div ref="root" class="sdd-nav-item">
    <button class="sdd-button" :aria-expanded="open" @click="toggle">
      <svg class="sdd-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
      </svg>
      <span class="sdd-label">Descargar SDD</span>
    </button>

    <transition name="sdd-fade">
      <div v-if="open" class="sdd-menu" role="menu">
        <div class="sdd-menu-title">Software Design Documents</div>
        <a class="sdd-item" role="menuitem" href="/sdd/sdd-frontend.zip" download>
          <span>SDD — Frontend</span>
          <span class="sdd-tag">.zip</span>
        </a>
        <a class="sdd-item" role="menuitem" href="/sdd/sdd-backend.zip" download>
          <span>SDD — Backend</span>
          <span class="sdd-tag">.zip</span>
        </a>
        <div class="sdd-menu-note">Cada archivo contiene la carpeta completa + AGENTS.md. Se regenera al cambiar los planes.</div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.sdd-nav-item {
  position: relative;
  display: inline-flex;
  margin-left: 8px;
}

.sdd-button {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 0 10px;
  height: 34px;
  border-radius: 8px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-button-alt-bg);
  color: var(--vp-c-text-1);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: border-color 0.25s, background-color 0.25s;
}

.sdd-button:hover {
  border-color: var(--vp-c-brand-1);
  background: var(--vp-button-alt-hover-bg);
}

.sdd-icon {
  width: 16px;
  height: 16px;
}

.sdd-menu {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  min-width: 240px;
  padding: 8px;
  border-radius: 10px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-elv);
  box-shadow: var(--vp-shadow-3);
  z-index: 100;
}

.sdd-menu-title {
  font-size: 12px;
  font-weight: 600;
  color: var(--vp-c-text-2);
  padding: 4px 8px 8px;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.sdd-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 8px 10px;
  border-radius: 8px;
  font-size: 13px;
  color: var(--vp-c-text-1);
}

.sdd-item.disabled {
  cursor: not-allowed;
  opacity: 0.55;
}

.sdd-tag {
  font-size: 11px;
  color: var(--vp-c-brand-1);
  border: 1px solid var(--vp-c-divider);
  border-radius: 999px;
  padding: 2px 8px;
  white-space: nowrap;
}

.sdd-menu-note {
  font-size: 11px;
  color: var(--vp-c-text-2);
  padding: 8px 8px 4px;
  border-top: 1px solid var(--vp-c-divider);
  margin-top: 6px;
}

.sdd-fade-enter-active,
.sdd-fade-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.sdd-fade-enter-from,
.sdd-fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

@media (max-width: 768px) {
  .sdd-nav-item {
    display: none;
  }
}
</style>