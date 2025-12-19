import { defineStore } from 'pinia';
import { ref, shallowRef } from 'vue';

export type ToolType = 'brush' | 'rect' | 'circle' | 'eraser';

interface Layer {
  id: number;
  name: string;
  visible: boolean;
  locked: boolean;
}

export const useWhiteboardStore = defineStore('whiteboard', () => {
  const WORLD_SIZE = 4000;
  
  // Состояние инструментов
  const historyApi = shallowRef<any>(null); 

  const canUndo = ref(false);
  const canRedo = ref(false);
  const strokeColor = ref('#6366F1');
  const strokeWidth = ref(5);
  const currentTool = ref('brush');

  // Слои
  const layers = ref<Layer[]>([
    { id: 1, name: 'Верхний слой', visible: true, locked: false },
    { id: 2, name: 'Эскиз', visible: true, locked: false },
    { id: 3, name: 'Фон', visible: true, locked: false },
  ]);
  const activeLayerId = ref(1);

  // Ссылки на контексты (будут установлены при инициализации)
  const mainCtx = shallowRef<CanvasRenderingContext2D | null>(null);
  const mainCanvas = shallowRef<HTMLCanvasElement | null>(null);

  const setTool = (tool: ToolType) => (currentTool.value = tool);
  
  return {
    WORLD_SIZE,
    currentTool,
    strokeColor,
    strokeWidth,
    layers,
    activeLayerId,
    canUndo,
    canRedo,
    mainCtx,
    mainCanvas,
    historyApi,
    setTool
  };
});