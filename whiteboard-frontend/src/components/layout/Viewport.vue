<template>
  <div class="viewport-container" ref="container">
    <div 
      class="canvas-scroll-content"
      :style="{ width: store.WORLD_SIZE + 'px', height: store.WORLD_SIZE + 'px' }"
    >
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useWhiteboardStore } from '@/stores/whiteboard-store';
import { useViewport } from '@/composables/useViewport';

const store = useWhiteboardStore();
const container = ref<HTMLElement | null>(null);
const { initViewport } = useViewport();

onMounted(() => {
  if (container.value) {
    initViewport(container.value);
  }
});
</script>

<style scoped>
.viewport-container {
  width: 100vw;
  height: calc(100dvh - 64px);
  max-height: calc(100dvh - 64px);;
  overflow: auto;
  cursor: crosshair;
}

.canvas-scroll-content {
  position: relative;
  background-color: white;
  box-shadow: 0 0 40px rgba(0,0,0,0.1);
}
</style>