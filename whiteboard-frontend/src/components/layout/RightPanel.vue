<template>
  <v-navigation-drawer
    location="right"
    width="280"
    permanent
    elevation="2"
    class="border-l"
  >
    <div class="pa-4 d-flex flex-column fill-height">
      
      <div class="text-subtitle-2 mb-2 text-grey-darken-1">Навигатор</div>
      <v-card
        variant="outlined"
        class="minimap-container mb-6 overflow-hidden position-relative"
        height="180"
        @click="handleMinimapClick"
      >
        <canvas ref="minimapCanvas" width="280" height="180" class="minimap-preview"></canvas>
        <div class="viewport-indicator" :style="indicatorStyle"></div>
      </v-card>

      <div class="text-subtitle-2 mb-2">История</div>
      <div class="d-flex gap-2 mb-6">
        <v-btn
          icon="mdi-undo"
          :disabled="!store.canUndo"
          variant="tonal"
          color="primary"
          @click="wb.undo"
          class="flex-grow-1"
        ></v-btn>
        <v-btn
          icon="mdi-redo"
          :disabled="!store.canRedo"
          variant="tonal"
          color="primary"
          @click="wb.redo"
          class="flex-grow-1"
        ></v-btn>
      </div>

      <v-divider class="mb-4"></v-divider>

      <div class="text-subtitle-2 mb-2">Слои</div>
      <v-list density="compact" class="pa-0 flex-grow-1 overflow-y-auto">
        <v-list-item
          v-for="layer in store.layers"
          :key="layer.id"
          :active="store.activeLayerId === layer.id"
          @click="store.activeLayerId = layer.id"
          color="primary"
          rounded="lg"
          class="mb-1"
        >
          <template v-slot:prepend>
            <v-icon 
              size="small" 
              @click.stop="layer.visible = !layer.visible"
            >
              {{ layer.visible ? 'mdi-eye' : 'mdi-eye-off' }}
            </v-icon>
          </template>
          
          <v-list-item-title>{{ layer.name }}</v-list-item-title>

          <template v-slot:append>
            <v-icon 
              size="x-small" 
              @click.stop="layer.locked = !layer.locked"
              :color="layer.locked ? 'primary' : ''"
            >
              {{ layer.locked ? 'mdi-lock' : 'mdi-lock-outline' }}
            </v-icon>
          </template>
        </v-list-item>
      </v-list>

      <v-btn
        prepend-icon="mdi-delete-sweep-outline"
        variant="text"
        color="error"
        block
        @click="wb.clear"
      >
        Очистить доску
      </v-btn>
    </div>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useWhiteboardStore } from '@/stores/whiteboard-store';
import { useWhiteboard } from '@/composables/useWhiteboard';

const store = useWhiteboardStore();
const wb = useWhiteboard();

const minimapCanvas = ref<HTMLCanvasElement | null>(null);
const scrollX = ref(0);
const scrollY = ref(0);
const viewportWidth = ref(window.innerWidth);
const viewportHeight = ref(window.innerHeight);

// Расчет рамки на мини-карте
const indicatorStyle = computed(() => {
  const minimapEl = minimapCanvas.value;
  if (!minimapEl) return {};

  const scale = minimapEl.offsetWidth / store.WORLD_SIZE;
  return {
    width: `${(viewportWidth.value - 280) * scale}px`, // вычитаем ширину панели
    height: `${viewportHeight.value * scale}px`,
    left: `${scrollX.value * scale}px`,
    top: `${scrollY.value * scale}px`,
  };
});

// Обновление мини-карты (рисуем основной холст в маленький)
const updateMinimap = () => {
  const miniCtx = minimapCanvas.value?.getContext('2d');
  const mainCanvas = document.querySelector('.main-canvas') as HTMLCanvasElement;
  
  if (miniCtx && mainCanvas) {
    miniCtx.clearRect(0, 0, 280, 180);
    miniCtx.drawImage(mainCanvas, 0, 0, store.WORLD_SIZE, store.WORLD_SIZE, 0, 0, 280, 180);
  }
};

// Клик по мини-карте для быстрого перемещения
const handleMinimapClick = (e: MouseEvent) => {
  const viewport = document.querySelector('.viewport');
  if (!viewport || !minimapCanvas.value) return;

  const rect = minimapCanvas.value.getBoundingClientRect();
  const scale = store.WORLD_SIZE / rect.width;
  
  viewport.scrollLeft = (e.clientX - rect.left) * scale - viewportWidth.value / 2;
  viewport.scrollTop = (e.clientY - rect.top) * scale - viewportHeight.value / 2;
};

onMounted(() => {
  const viewport = document.querySelector('.viewport');
  viewport?.addEventListener('scroll', (e: any) => {
    scrollX.value = e.target.scrollLeft;
    scrollY.value = e.target.scrollTop;
  });

  // Обновляем мини-карту каждые 2 секунды (для производительности)
  setInterval(updateMinimap, 2000);
});
</script>

<style scoped>
.minimap-container {
  background-color: #fff;
  cursor: pointer;
}
.minimap-preview {
  width: 100%;
  height: 100%;
  opacity: 0.8;
}
.viewport-indicator {
  position: absolute;
  border: 1.5px solid #6366f1;
  background-color: rgba(99, 102, 241, 0.05);
  pointer-events: none;
  transition: all 0.1s ease-out;
}
.gap-2 { gap: 8px; }
</style>