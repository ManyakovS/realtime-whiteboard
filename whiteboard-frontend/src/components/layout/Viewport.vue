<template>
  <div class="viewport-container" ref="container">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useWhiteboardStore } from "@/stores/whiteboard-store";
import { useViewport } from "@/composables/useViewport";

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
  max-height: calc(100dvh - 64px);
  overflow: auto;
  cursor: crosshair;
  background-color: rgba(66, 66, 66, 0.016);
}
</style>
