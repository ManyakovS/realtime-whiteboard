<template>
  <v-card
    class="toolbar-container pa-2 d-flex flex-column align-center"
    elevation="4"
    rounded="xl"
  >
    <v-btn-toggle
      v-model="store.currentTool"
      mandatory
      color="primary"
      variant="text"
      direction="vertical"
    >
      <v-btn value="brush" icon="mdi-brush" title="Кисть"></v-btn>
      <v-btn value="rect" icon="mdi-square-outline" title="Прямоугольник"></v-btn>
      <v-btn value="circle" icon="mdi-circle-outline" title="Круг"></v-btn>
      <v-btn value="arrow" icon="mdi-arrow-top-right" title="Стрелка"></v-btn>
      <v-btn value="eraser" icon="mdi-eraser" title="Ластик"></v-btn>
    </v-btn-toggle>

    <v-divider class="my-2 border-opacity-25" width="80%"></v-divider>

    <v-menu v-model="colorMenu" :close-on-content-click="false" location="end">
      <template v-slot:activator="{ props }">
        <v-btn
          v-bind="props"
          icon
          :disabled="store.currentTool === 'eraser'"
          class="color-dot-btn"
        >
          <div 
            class="color-preview" 
            :style="{ backgroundColor: store.strokeColor }"
          ></div>
        </v-btn>
      </template>
      <v-card class="pa-2">
        <v-color-picker
          v-model="store.strokeColor"
          hide-inputs
          show-swatches
        ></v-color-picker>
      </v-card>
    </v-menu>

    <v-menu location="end" :close-on-content-click="false">
      <template v-slot:activator="{ props }">
        <v-btn
          v-bind="props"
          icon
          class="color-dot-btn"
          title="Толщина"
        >
          <div 
            class="color-preview" 
            style="background-color: rgba(0,0,0, 0.87);" 
            :style="{ width: `${0.96 * store.strokeWidth}px`, height: `${0.96 * store.strokeWidth}px` }"
          ></div><!-- TODO: ЦВЕТОСХЕМА -->
        </v-btn>
      </template>
      <v-card width="200" class="pa-4">
        <div class="text-caption mb-2">Толщина: {{ store.strokeWidth }}px</div>
        <v-slider
          v-model="store.strokeWidth"
          min="1"
          max="50"
          step="1"
          hide-details
          color="primary"
        ></v-slider>
      </v-card>
    </v-menu>
  </v-card>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useWhiteboardStore } from '@/stores/whiteboard-store';

const store = useWhiteboardStore();
const colorMenu = ref(false);
</script>

<style scoped>
.toolbar-container {
  position: absolute;
  left: 20px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 100;
  background-color: rgba(255, 255, 255, 0.9) !important;
  backdrop-filter: blur(8px);
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.color-dot-btn {
  margin-top: 8px;
}

.color-preview {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 2px solid #eee;
  box-shadow: inset 0 0 2px rgba(0,0,0,0.2);
}

/* Стилизация активной кнопки в группе */
.v-btn--active {
  background-color: rgba(var(--v-theme-primary), 0.1) !important;
}
</style>