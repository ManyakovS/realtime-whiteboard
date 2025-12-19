import { ref, watch } from 'vue';
import { useWhiteboardStore } from '@/stores/whiteboard-store';
import { useHistory } from './useHistory';
import { storeToRefs } from 'pinia';

export function useWhiteboard() {
  const store = useWhiteboardStore();
  const {mainCtx, mainCanvas} = storeToRefs(useWhiteboardStore())

  const isDrawing = ref(false);

  const initCanvas = (el: HTMLCanvasElement) => {
    let canvas: HTMLCanvasElement | null = null;
    let ctx: CanvasRenderingContext2D | null = null;

    canvas = el;
    ctx = el.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    mainCanvas.value = el;
    mainCtx.value = ctx;

    const history = useHistory(ctx, canvas);
    store.historyApi = history; 
    
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
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

  const handleStart = (event: MouseEvent | TouchEvent) => {
    if (!mainCtx.value || isDrawing.value) return;
    isDrawing.value = true;
    const { x, y } = getCoordinates(event);
    mainCtx.value.beginPath();
    mainCtx.value.moveTo(x, y);
    mainCtx.value.strokeStyle = store.currentTool === 'eraser' ? '#FFFFFF' : store.strokeColor;
    mainCtx.value.lineWidth = store.strokeWidth;
  };

  const handleMove = (event: MouseEvent | TouchEvent) => {
    if (!isDrawing.value || !mainCtx.value) return;
    const { x, y } = getCoordinates(event);
    mainCtx.value.lineTo(x, y);
    mainCtx.value.stroke();
  };

  const handleEnd = () => {
    if (!isDrawing.value) return;
    isDrawing.value = false;
    mainCtx.value?.closePath();
    store.historyApi?.saveState();
    updateStatus();
  };

  const getCoordinates = (event: MouseEvent | TouchEvent) => {
    if (!mainCanvas.value) return { x: 0, y: 0 };
    if (event instanceof MouseEvent) return { x: event.offsetX, y: event.offsetY };
    const rect = mainCanvas.value.getBoundingClientRect();
    return {
      x: event.touches[0].clientX - rect.left,
      y: event.touches[0].clientY - rect.top
    };
  };

  const undo = () => { store.historyApi?.undo(); updateStatus(); };
  const redo = () => { store.historyApi?.redo(); updateStatus(); };
  const clear = () => {
    if (!mainCtx.value || !mainCanvas.value) return;

    mainCtx.value.clearRect(0, 0, mainCanvas.value.width, mainCanvas.value.height);
    store.historyApi?.saveState();
    updateStatus();
  };

  return { initCanvas, handleStart, handleMove, handleEnd, undo, redo, clear };
}