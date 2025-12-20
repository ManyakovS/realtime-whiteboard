<template>
  <div 
    class="minimap-indicator" 
    :style="getIndicatorStyle(width, height)"
  ></div>
</template>

<script setup lang="ts">
import { useViewport } from '@/composables/useViewport';

defineProps<{
  width: number;
  height: number;
}>();

const { getIndicatorStyle } = useViewport();
</script>

<style scoped>
.minimap-indicator {
  position: absolute;
  top: 0;
  left: 0;
  border: 2px solid #6366f1;
  background-color: rgba(99, 102, 241, 0.1);
  pointer-events: none; /* Чтобы не мешать кликам по самой карте */
  will-change: transform;
  z-index: 10;
}
</style>