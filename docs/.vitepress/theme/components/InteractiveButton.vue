<script setup>
import { withBase } from 'vitepress'
</script>

<template>
  <div class="interactive-nav-item">
    <a class="interactive-button" :href="withBase('/interactivo/')" aria-label="Sección interactiva: flujos animados del BackOffice">
      <svg class="interactive-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <rect x="2" y="4" width="20" height="16" rx="2"></rect>
        <path d="M10 9l5 3-5 3z"></path>
        <path d="M7 4h2l-2 16H5z"></path>
      </svg>
      <span class="interactive-label">Flujos</span>
    </a>
    <div class="interactive-tip" role="tooltip">Flujos interactivos del BackOffice: Front · Back · BD · RabbitMQ · Multitenancy/RLS</div>
  </div>
</template>

<style scoped>
.interactive-nav-item {
  position: relative;
  display: inline-flex;
  margin-left: 8px;
}

.interactive-button {
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
  text-decoration: none;
  cursor: pointer;
  transition: border-color 0.25s, background-color 0.25s;
}

.interactive-button:hover {
  border-color: var(--vp-c-brand-1);
  background: var(--vp-button-alt-hover-bg);
  color: var(--vp-c-brand-1);
}

.interactive-icon {
  width: 16px;
  height: 16px;
}

.interactive-label {
  line-height: 1;
}

.interactive-tip {
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  max-width: 260px;
  padding: 8px 10px;
  border-radius: 8px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-elv);
  box-shadow: var(--vp-shadow-3);
  color: var(--vp-c-text-1);
  font-size: 12px;
  line-height: 1.4;
  white-space: normal;
  opacity: 0;
  pointer-events: none;
  transform: translateY(-4px);
  transition: opacity 0.18s ease, transform 0.18s ease;
  z-index: 120;
}

.interactive-nav-item:hover .interactive-tip,
.interactive-nav-item:focus-within .interactive-tip {
  opacity: 1;
  transform: translateY(0);
}

@media (max-width: 768px) {
  .interactive-nav-item {
    display: none;
  }
}
</style>