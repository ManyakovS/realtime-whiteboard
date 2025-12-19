<template>
  <div class="viewport" ref="viewportRef">
    <div 
      class="canvas-wrapper" 
      :style="{ width: store.WORLD_SIZE + 'px', height: store.WORLD_SIZE + 'px' }"
    >
      <!-- <UserCursor 
        v-for="user in store.activeUsers" 
        :key="user.id" 
        :style="{ transform: `translate(${user.x}px, ${user.y}px)` }"
        :user="user" 
      /> -->

      <canvas
        ref="canvasRef"
        v-for="layer in store.layers"
        :key="layer.id"
        :id="'layer-' + layer.id"
        :width="store.WORLD_SIZE"
        :height="store.WORLD_SIZE"
        :class="['layer-canvas', { 'active-layer': store.activeLayerId === layer.id }]"
        :style="{ 
          zIndex: layer.id, 
          visibility: layer.visible ? 'visible' : 'hidden',
          pointerEvents: store.activeLayerId === layer.id ? 'auto' : 'none' 
        }"
        @mousedown="handleStart"
        @mousemove="handleMove"
        @mouseup="handleEnd"
      ></canvas>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useWhiteboardStore } from '@/stores/whiteboard-store';
import { useWhiteboard } from '@/composables/useWhiteboard';

const store = useWhiteboardStore();
const viewportRef = ref<HTMLDivElement | null>(null);
const canvasRef = ref<HTMLCanvasElement | null>(null);

const { initCanvas, handleStart, handleMove, handleEnd } = useWhiteboard();

onMounted(() => {
  if (canvasRef.value) {
    initCanvas(canvasRef.value[0]);
    
    // Авто-скролл в центр при загрузке
    if (viewportRef.value) {
      viewportRef.value.scrollLeft = (store.WORLD_SIZE - window.innerWidth) / 2;
      viewportRef.value.scrollTop = (store.WORLD_SIZE - window.innerHeight) / 2;
    }
  }
});
</script>

<style scoped>
.viewport {
  width: 100vw;
  height: calc(100dvh - 64px);
  max-height: calc(100dvh - 64px);;
  overflow: auto;
  background-color: #f0f2f5;
  cursor: crosshair;
}

.canvas-wrapper {
  position: relative;
  background-image: 
    linear-gradient(#e5e7eb 1px, transparent 1px),
    linear-gradient(90deg, #e5e7eb 1px, transparent 1px);
  background-size: 40px 40px; /* Сетка */
}

.main-canvas {
  background-color: white;
  display: block;
  box-shadow: 0 0 40px rgba(0,0,0,0.1);
}

/* Стилизация скроллбара */
.viewport::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}
.viewport::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 5px;
}

.canvas-wrapper {
  position: relative;
  background-color: #f9f9f9;
}
.layer-canvas {
  position: absolute;
  top: 0;
  left: 0;
  background-color: transparent; /* Все слои кроме нижнего прозрачные */
}
/* Нижний слой может иметь белый фон */
.layer-canvas:last-child {
  background-color: white;
}
</style>