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
        <canvas
          ref="minimapCanvas"
          width="280"
          height="180"
          class="minimap-preview"
        ></canvas>
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

      <div class="d-flex align-center justify-space-between mb-2">
        <div class="text-subtitle-2">Слои</div>
        <v-btn
          icon="mdi-plus"
          variant="text"
          size="x-small"
          color="primary"
          @click="openLayerDialog(true)"
          title="Добавить слой"
        ></v-btn>
      </div>

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
              class="mr-2"
              @click.stop="layer.visible = !layer.visible"
            >
              {{ layer.visible ? "mdi-eye" : "mdi-eye-off" }}
            </v-icon>
          </template>

          <v-list-item-title
            class="text-caption font-weight-bold cursor-pointer"
            @dblclick.stop="openLayerDialog(false, layer)"
          >
            {{ layer.name }}
          </v-list-item-title>

          <template v-slot:append>
            <div class="d-flex align-center">
              <v-btn
                icon="mdi-pencil"
                variant="text"
                size="x-small"
                class="mr-1"
                @click.stop="openLayerDialog(false, layer)"
              ></v-btn>

              <v-icon
                size="x-small"
                @click.stop="layer.locked = !layer.locked"
                :color="layer.locked ? 'primary' : ''"
              >
                {{ layer.locked ? "mdi-lock" : "mdi-lock-outline" }}
              </v-icon>

              <v-btn
                v-if="store.layers.length > 1"
                icon="mdi-trash-can-outline"
                variant="text"
                size="x-small"
                color="grey-lighten-1"
                @click.stop="deleteLayer(layer.id)"
              ></v-btn>
            </div>
          </template>
        </v-list-item>
      </v-list>

      <v-dialog v-model="layerDialog.show" max-width="300px">
        <v-card>
          <v-card-title class="text-subtitle-1">
            {{ layerDialog.isNew ? "Новый слой" : "Переименовать" }}
          </v-card-title>
          <v-card-text>
            <v-text-field
              v-model="layerDialog.name"
              label="Название слоя"
              variant="underlined"
              hide-details
              autofocus
              @keyup.enter="saveLayer"
            ></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn variant="text" @click="layerDialog.show = false"
              >Отмена</v-btn
            >
            <v-btn color="primary" variant="text" @click="saveLayer">ОК</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

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
import { ref, computed, onMounted, watch, reactive } from "vue";
import { useWhiteboardStore } from "@/stores/whiteboard-store";
import { useWhiteboard } from "@/composables/useWhiteboard";

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
  const miniCtx = minimapCanvas.value?.getContext("2d");
  const mainCanvas = document.querySelector(
    ".main-canvas"
  ) as HTMLCanvasElement;

  if (miniCtx && mainCanvas) {
    miniCtx.clearRect(0, 0, 280, 180);
    miniCtx.drawImage(
      mainCanvas,
      0,
      0,
      store.WORLD_SIZE,
      store.WORLD_SIZE,
      0,
      0,
      280,
      180
    );
  }
};

// Клик по мини-карте для быстрого перемещения
const handleMinimapClick = (e: MouseEvent) => {
  const viewport = document.querySelector(".viewport");
  if (!viewport || !minimapCanvas.value) return;

  const rect = minimapCanvas.value.getBoundingClientRect();
  const scale = store.WORLD_SIZE / rect.width;

  viewport.scrollLeft =
    (e.clientX - rect.left) * scale - viewportWidth.value / 2;
  viewport.scrollTop =
    (e.clientY - rect.top) * scale - viewportHeight.value / 2;
};

// Состояние диалога
const layerDialog = reactive({
  show: false,
  isNew: true,
  name: "",
  editingId: null as number | null,
});

const openLayerDialog = (isNew: boolean, layer?: any) => {
  layerDialog.isNew = isNew;
  layerDialog.show = true;
  if (isNew) {
    layerDialog.name = `Слой ${store.layers.length + 1}`;
    layerDialog.editingId = null;
  } else {
    layerDialog.name = layer.name;
    layerDialog.editingId = layer.id;
  }
};

const saveLayer = () => {
  if (!layerDialog.name.trim()) return;

  if (layerDialog.isNew) {
    // Логика создания
    const nextId =
      store.layers.length > 0
        ? Math.max(...store.layers.map((l) => l.id)) + 1
        : 1;

    store.layers.unshift({
      id: nextId,
      name: layerDialog.name,
      visible: true,
      locked: false,
    });
    store.activeLayerId = nextId;
  } else {
    // Логика редактирования
    const layer = store.layers.find((l) => l.id === layerDialog.editingId);
    if (layer) {
      layer.name = layerDialog.name;
    }
  }

  layerDialog.show = false;
};

const deleteLayer = (id: number) => {
  if (store.layers.length <= 1) return;

  const index = store.layers.findIndex((l) => l.id === id);
  if (index !== -1) {
    store.layers.splice(index, 1);

    // Если удалили активный слой, переключаемся на первый доступный
    if (store.activeLayerId === id) {
      store.activeLayerId = store.layers[0].id;
    }
  }
};

onMounted(() => {
  const viewport = document.querySelector(".viewport");
  viewport?.addEventListener("scroll", (e: any) => {
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
.gap-2 {
  gap: 8px;
}
</style>
