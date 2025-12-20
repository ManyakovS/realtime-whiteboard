<template>
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
            :disabled="layer.locked"
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
        <v-btn variant="text" @click="layerDialog.show = false">Отмена</v-btn>
        <v-btn color="primary" variant="text" @click="saveLayer">ОК</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import { useWhiteboardStore } from "@/stores/whiteboard-store";

const store = useWhiteboardStore();
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

  const layer = store.layers.find((l) => l.id === id);
  if (layer?.locked) {
    return;
  }

  const index = store.layers.findIndex((l) => l.id === id);
  if (index !== -1) {
    store.layers.splice(index, 1);

    // Если удалили активный слой, переключаемся на первый доступный
    if (store.activeLayerId === id) {
      store.activeLayerId = store.layers[0].id;
    }
  }
};
</script>

<style scoped></style>
