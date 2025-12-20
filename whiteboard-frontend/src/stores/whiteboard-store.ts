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
  const historyApi = ref<any>(null); 

  const strokeColor = ref('#6366F1');
  const strokeWidth = ref(10);
  const currentTool = ref('brush');

  // Слои
  const layers = ref<Layer[]>([
    { id: 0, name: 'Первый слой', visible: true, locked: false },
  ]);
  const activeLayerId = ref(0);

  // Ссылки на контексты (будут установлены при инициализации)
  const mainCtx = shallowRef<CanvasRenderingContext2D | null>(null);
  const mainCanvas = shallowRef<HTMLCanvasElement | null>(null);
  const viewPort = shallowRef<HTMLDivElement | null>(null);

  const setTool = (tool: ToolType) => (currentTool.value = tool);
  
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
    historyApi,
    setTool,
  };
});