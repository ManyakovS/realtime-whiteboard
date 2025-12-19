<template>
  <v-app-bar elevation="1" color="white">
    <v-app-bar-title>Collaborative Whiteboard</v-app-bar-title>
    <v-spacer></v-spacer>
    
    <v-btn
      prepend-icon="mdi-download"
      color="primary"
      variant="flat"
      @click="exportToPNG"
      :loading="isExporting"
    >
      Скачать PNG
    </v-btn>
  </v-app-bar>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useWhiteboardStore } from '@/stores/whiteboard-store';

const store = useWhiteboardStore();
const isExporting = ref(false);

const exportToPNG = async () => {
  isExporting.value = true;
  
  // Создаем временный холст для склейки слоев
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = store.WORLD_SIZE;
  tempCanvas.height = store.WORLD_SIZE;
  const tempCtx = tempCanvas.getContext('2d');

  if (!tempCtx) return;

  // Отрисовываем слои снизу вверх (только видимые)
  const layerCanvases = document.querySelectorAll('.layer-canvas') as NodeListOf<HTMLCanvasElement>;
  
  // Важно: сортируем слои по порядку из store.layers
  const sortedLayers = [...store.layers].reverse(); 

  sortedLayers.forEach((layer) => {
    if (layer.visible) {
      const canvasEl = document.querySelector(`#layer-${layer.id}`) as HTMLCanvasElement;
      if (canvasEl) {
        tempCtx.drawImage(canvasEl, 0, 0);
      }
    }
  });

  // Скачивание
  const link = document.createElement('a');
  link.download = `whiteboard-${Date.now()}.png`;
  link.href = tempCanvas.toDataURL('image/png');
  link.click();
  
  isExporting.value = false;
};
</script>