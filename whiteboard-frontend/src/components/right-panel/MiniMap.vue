<template>
  <div class="minimap-wrapper">
    <v-card variant="outlined" class="mini-map">
      <canvas ref="miniMapCanvasRef" class="mini-map-canvas" :width="MINI_MAP_SIZE" :height="MINI_MAP_SIZE"
        @mousedown="startNavigation" />
      <MinimapViewportIndicator :width="MINI_MAP_SIZE" :height="MINI_MAP_SIZE" />
    </v-card>

    <div class="d-flex align-center justify-space-between px-2">
      <v-btn icon="mdi-minus" size="x-small" variant="text" @click="changeZoom(-0.1)"></v-btn>
      <span class="text-caption font-weight-bold">{{ Math.round(state.zoom * 100) }}%</span>
      <v-btn icon="mdi-plus" size="x-small" variant="text" @click="changeZoom(0.1)"></v-btn>
      <v-btn icon="mdi-magnify-minus-outline" size="x-small" variant="text" @click="setZoom(1)" title="Сброс"></v-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import { useWhiteboardStore } from "@/stores/whiteboard-store";
import { useViewport } from "@/composables/useViewport";

const store = useWhiteboardStore();
const { handleMinimapAction, setZoom, state } = useViewport();

// Константы
const MINI_MAP_SIZE = 250;

// Refs
const miniMapCanvasRef = ref<HTMLCanvasElement | null>(null);

// Обновление мини-карты
const renderMiniMap = async () => {
  if (!miniMapCanvasRef.value) return;

  const ctx = miniMapCanvasRef.value.getContext("2d");

  ctx.fillStyle = "#f5f5f5";
  ctx.fillRect(0, 0, MINI_MAP_SIZE, MINI_MAP_SIZE);

  const scaleFactor = MINI_MAP_SIZE / store.WORLD_SIZE;

  const sortedLayers = [...store.layers]
    .filter((layer) => layer.visible)
    .reverse();

  for (const layer of sortedLayers) {
    const canvasEl = document.querySelector(
      `#layer-${layer.id}`
    ) as HTMLCanvasElement;
    if (canvasEl) {
      ctx.save();
      ctx.scale(scaleFactor, scaleFactor);
      ctx.drawImage(canvasEl, 0, 0);
      ctx.restore();
    }
  }
};

const startNavigation = (e: MouseEvent) => {
  const el = miniMapCanvasRef.value;
  handleMinimapAction(e, el);

  const onMove = (moveEvent: MouseEvent) => {
    handleMinimapAction(moveEvent, el);
  };

  const onStop = () => {
    window.removeEventListener("mousemove", onMove);
    window.removeEventListener("mouseup", onStop);
  };

  window.addEventListener("mousemove", onMove);
  window.addEventListener("mouseup", onStop);
};

const changeZoom = (delta: number) => {
  setZoom(state.zoom + delta);
};
watch(
  () => 
    store.historyManager,
  () => console.log(store.historyManager)
);

watch(
  () => [
    store.historyManager?.currentIndex,
    store.layers.map((layer) => layer.visible),
  ],
  () => setTimeout(renderMiniMap, 200)
);

onMounted(() => {
  renderMiniMap();
});
</script>

<style lang="css" scoped>
.mini-map {
  position: relative;
  height: calc(v-bind(MINI_MAP_SIZE) * 1px);
  width: calc(v-bind(MINI_MAP_SIZE) * 1px);
  border: 1px solid #ccc;
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  background: #f5f5f5;
  cursor: grab;
}
</style>
