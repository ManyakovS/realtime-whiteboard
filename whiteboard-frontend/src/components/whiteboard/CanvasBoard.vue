<template>
  <Viewport>
    <div class="canvas-wrapper" :style="{ width: store.WORLD_SIZE + 'px', height: store.WORLD_SIZE + 'px' }">
      <canvas ref="canvasRef" v-for="layer in store.layers" :key="layer.id" :id="'layer-' + layer.id"
        :width="store.WORLD_SIZE" :height="store.WORLD_SIZE"
        :class="['layer-canvas', { 'active-layer': store.activeLayerId === layer.id }]" :style="{
          zIndex: layer.id,
          visibility: layer.visible ? 'visible' : 'hidden',
          pointerEvents: store.activeLayerId === layer.id ? 'auto' : 'none'
        }" @mousedown="handleStart" @mousemove="handleMove" @mouseup="handleEnd" />
    </div>
  </Viewport>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useWhiteboardStore } from '@/stores/whiteboard-store';
import { useWhiteboard } from '@/composables/useWhiteboard';
const store = useWhiteboardStore();

const canvasRef = ref<HTMLCanvasElement | null>(null);

const { initCanvas, handleStart, handleMove, handleEnd } = useWhiteboard();

onMounted(() => {
  if (canvasRef.value) {
    initCanvas(canvasRef.value[0]);
  }
});
</script>

<style scoped>
.canvas-wrapper {
  position: relative;
  box-shadow: 0 0 50px rgba(0, 0, 0, 0.1);
  user-select: none;
  touch-action: none;
  background-image:
    radial-gradient(#e0e0e0 1px, transparent 1px);
  background-size: 40px 40px;
}

.layer-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: transparent;
  display: block;
  image-rendering: auto;
}
</style>