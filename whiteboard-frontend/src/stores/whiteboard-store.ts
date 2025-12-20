import { defineStore } from 'pinia';
import { ref, shallowRef, nextTick } from 'vue';
import { useHistory, type HistoryStep } from '@/composables/useHistory';

export type ToolType = 'brush' | 'rect' | 'circle' | 'eraser';

export const useWhiteboardStore = defineStore('whiteboard', () => {
  const WORLD_SIZE = 4000;
  
  const strokeColor = ref('#6366F1');
  const strokeWidth = ref(10);
  const currentTool = ref('brush');
  
  // Слои
  const layers = ref([
    { id: Date.now(), name: 'Первый слой', visible: true, locked: false },
  ] as const);
  const activeLayerId = ref(layers.value[0].id);

  const mainCtx = shallowRef<CanvasRenderingContext2D | null>(null);
  const mainCanvas = shallowRef<HTMLCanvasElement | null>(null);
  const viewPort = shallowRef<HTMLDivElement | null>(null);

  const historyManager = useHistory(30);

  const recordHistory = () => {
    historyManager.saveState(layers.value, activeLayerId.value);
  };

  const applyStep = async (step: HistoryStep | null) => {
    if (!step) return;

    layers.value = JSON.parse(JSON.stringify(step.layersMetadata));
    activeLayerId.value = step.activeLayerId;

    await nextTick();

    const loadPromises = Object.entries(step.images).map(([id, dataUrl]) => {
      return new Promise<{ id: string; img: HTMLImageElement }>((resolve) => {
        const img = new Image();
        img.src = dataUrl;
        img.onload = () => resolve({ id, img });
      });
    });

    const loadedImages = await Promise.all(loadPromises);

    loadedImages.forEach(({ id, img }) => {
      const canvas = document.querySelector(`#layer-${id}`) as HTMLCanvasElement;
      const ctx = canvas?.getContext('2d');
      if (ctx && canvas) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
      }
    });
  };

  const undo = async () => {
    await applyStep(historyManager.undo());
  };

  const redo = async () => {
    await applyStep(historyManager.redo());
  };

  const clearAllLayers = () => {
  layers.value.forEach(layer => {
    const canvas = document.querySelector(`#layer-${layer.id}`) as HTMLCanvasElement;
    const ctx = canvas?.getContext('2d');
    if (ctx && canvas) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  });

  recordHistory();
};

  return {
    WORLD_SIZE,
    currentTool,
    strokeColor,
    strokeWidth,
    layers,
    activeLayerId,
    mainCtx,
    mainCanvas,
    viewPort,
    undo,
    redo,
    recordHistory,
    clearAllLayers,
    canUndo: historyManager.canUndo,
    canRedo: historyManager.canRedo,
    historyManager,
  };
});