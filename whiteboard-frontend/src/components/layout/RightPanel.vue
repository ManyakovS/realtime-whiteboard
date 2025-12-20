<template>
  <v-navigation-drawer location="right" width="280" permanent elevation="2" class="border-l">
    <div class="pa-4 d-flex flex-column fill-height">
      <div class="text-subtitle-2 mb-2 text-grey-darken-1">Навигатор</div>
      <MiniMap />

      <div class="text-subtitle-2 mb-2 mt-2">История</div>
      <div class="d-flex gap-2 mb-6">
        <v-btn icon="mdi-undo" :disabled="!store.historyApi?.canUndo" variant="tonal" color="primary" @click="wb.undo"
          class="flex-grow-1"></v-btn>
        <v-btn icon="mdi-redo" :disabled="!store.historyApi?.canRedo" variant="tonal" color="primary" @click="wb.redo"
          class="flex-grow-1"></v-btn>
      </div>

      <v-divider class="mb-4"></v-divider>
      <layers />

      <v-btn prepend-icon="mdi-delete-sweep-outline" variant="text" color="error" block @click="wb.clear">
        Очистить доску
      </v-btn>
    </div>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { useWhiteboardStore } from "@/stores/whiteboard-store";
import { useWhiteboard } from "@/composables/useWhiteboard";

const store = useWhiteboardStore();
const wb = useWhiteboard();
</script>

<style scoped>
.gap-2 {
  gap: 8px;
}
</style>
