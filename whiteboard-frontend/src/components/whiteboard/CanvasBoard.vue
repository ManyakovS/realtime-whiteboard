<template>
  <div class="viewport" ref="viewportRef">
    <div 
      class="canvas-wrapper" 
      :style="{ width: store.WORLD_SIZE + 'px', height: store.WORLD_SIZE + 'px' }"
    >
      <UserCursor 
        v-for="user in store.activeUsers" 
        :key="user.id" 
        :style="{ transform: `translate(${user.x}px, ${user.y}px)` }"
        :user="user" 
      />

      <canvas
        ref="canvasRef"
        :width="store.WORLD_SIZE"
        :height="store.WORLD_SIZE"
        @mousedown="handleStart"
        @mousemove="handleMove"
        @mouseup="handleEnd"
        @mouseleave="handleEnd"
        @touchstart.prevent="handleStart"
        @touchmove.prevent="handleMove"
        @touchend.prevent="handleEnd"
        class="main-canvas"
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
    initCanvas(canvasRef.value);
    
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
</style>