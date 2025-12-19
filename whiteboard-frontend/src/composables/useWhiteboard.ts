import { ref, watch } from "vue";
import { useWhiteboardStore } from "@/stores/whiteboard-store";
import { useHistory } from "./useHistory";
import { storeToRefs } from "pinia";

export function useWhiteboard() {
  const store = useWhiteboardStore();
  const { mainCtx, mainCanvas } = storeToRefs(useWhiteboardStore());

  const isDrawing = ref(false);

  watch(() => store.activeLayerId, (newId) => {
    const canvasEl = document.querySelector(`#layer-${newId}`) as HTMLCanvasElement;
    if (canvasEl) {
      const newCtx = canvasEl.getContext('2d', { willReadFrequently: true });
      if (newCtx) {
        // Переносим настройки кисти на новый контекст
        newCtx.lineCap = 'round';
        newCtx.lineJoin = 'round';
        store.mainCtx = newCtx;
        store.mainCanvas = canvasEl;
      }
    }
  }, { immediate: true, });

  const initCanvas = (el: HTMLCanvasElement) => {
    let canvas: HTMLCanvasElement | null = null;
    let ctx: CanvasRenderingContext2D | null = null;

    canvas = el;
    ctx = el.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    mainCanvas.value = el;
    mainCtx.value = ctx;

    const history = useHistory(ctx, canvas);
    store.historyApi = history;

    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    history.saveState();
    updateStatus();
  };

  const updateStatus = () => {
    if (store.historyApi) {
      store.canUndo = store.historyApi.canUndo?.value;
      store.canRedo = store.historyApi.canRedo?.value;
    }
  };

  const updateHistoryStatus = () => {
    if (!history) return;
    store.canUndo = history.canUndo?.value;
    store.canRedo = history.canRedo?.value;
  };

  const startX = ref(0);
  const startY = ref(0);
  const startImageData = ref<ImageData | null>(null); // Для предпросмотра фигур

  const handleStart = (event: MouseEvent | TouchEvent) => {
    const currentLayer = store.layers.find(l => l.id === store.activeLayerId);

    if (!currentLayer || !currentLayer.visible || currentLayer.locked) {
      return;
    }

    if (!store.mainCtx || !store.mainCanvas) return;
    isDrawing.value = true;

    const { x, y } = getCoordinates(event);
    startX.value = x;
    startY.value = y;

    // Сохраняем текущее состояние холста, чтобы "стирать" временные фигуры при движении
    startImageData.value = store.mainCtx.getImageData(
      0,
      0,
      store.WORLD_SIZE,
      store.WORLD_SIZE
    );

    store.mainCtx.beginPath();
    store.mainCtx.moveTo(x, y);
    
    if (store.currentTool === 'eraser') {
      store.mainCtx.globalCompositeOperation = 'destination-out';
      store.mainCtx.lineWidth = store.strokeWidth;
    } else {
      store.mainCtx.globalCompositeOperation = 'source-over';
      store.mainCtx.strokeStyle = store.strokeColor;
      store.mainCtx.lineWidth = store.strokeWidth;
  }
  };

  const handleMove = (event: MouseEvent | TouchEvent) => {
    if (!isDrawing.value || !store.mainCtx) return;
    const { x, y } = getCoordinates(event);

    if (store.currentTool === "brush" || store.currentTool === "eraser") {
      store.mainCtx.lineTo(x, y);
      store.mainCtx.stroke();
    } else {
      // Для фигур (прямоугольник/круг):
      // 1. Восстанавливаем холст до начала рисования текущей фигуры
      if (startImageData.value) {
        store.mainCtx.putImageData(startImageData.value, 0, 0);
      }

      // 2. Рисуем временную фигуру
      if (store.currentTool === "rect") {
        store.mainCtx.strokeRect(
          startX.value,
          startY.value,
          x - startX.value,
          y - startY.value
        );
      } else if (store.currentTool === "circle") {
        const radius = Math.sqrt(
          Math.pow(x - startX.value, 2) + Math.pow(y - startY.value, 2)
        );
        store.mainCtx.beginPath();
        store.mainCtx.arc(startX.value, startY.value, radius, 0, 2 * Math.PI);
        store.mainCtx.stroke();
      }
    }
  };

  const handleEnd = () => {
    if (!isDrawing.value) return;
    isDrawing.value = false;
    mainCtx.value?.closePath();

    mainCtx.value.globalCompositeOperation = 'source-over';

    store.historyApi?.saveState();
    updateStatus();
  };

  const getCoordinates = (event: MouseEvent | TouchEvent) => {
    if (!mainCanvas.value) return { x: 0, y: 0 };
    if (event instanceof MouseEvent)
      return { x: event.offsetX, y: event.offsetY };
    const rect = mainCanvas.value.getBoundingClientRect();
    return {
      x: event.touches[0].clientX - rect.left,
      y: event.touches[0].clientY - rect.top,
    };
  };

  const undo = () => {
    store.historyApi?.undo();
    updateStatus();
  };
  const redo = () => {
    store.historyApi?.redo();
    updateStatus();
  };
  const clear = () => {
    if (!mainCtx.value || !mainCanvas.value) return;

    mainCtx.value.clearRect(
      0,
      0,
      mainCanvas.value.width,
      mainCanvas.value.height
    );
    store.historyApi?.saveState();
    updateStatus();
  };

  return { initCanvas, handleStart, handleMove, handleEnd, undo, redo, clear };
}
