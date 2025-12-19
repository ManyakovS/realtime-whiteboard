import { ref, computed } from 'vue';

export function useHistory(ctx: CanvasRenderingContext2D | null, canvas: HTMLCanvasElement | null) {
  const history = ref<string[]>([]); // Массив DataURL (снимков)
  const currentIndex = ref(-1);
  const maxHistory = 20; // Ограничение для экономии памяти

  const canUndo = computed(() => currentIndex.value > 0);
  const canRedo = computed(() => currentIndex.value < history.value.length - 1);

  // Сохранить текущее состояние
  const saveState = () => {
    if (!canvas) return;
    
    // Если мы что-то нарисовали после Undo, удаляем "будущую" ветку истории
    if (currentIndex.value < history.value.length - 1) {
      history.value = history.value.slice(0, currentIndex.value + 1);
    }

    const snapshot = canvas.toDataURL('image/png', 0.5); // Сжатие для экономии памяти
    history.value.push(snapshot);

    if (history.value.length > maxHistory) {
      history.value.shift();
    } else {
      currentIndex.value++;
    }

  };

  const undo = () => {
    if (!canUndo.value || !ctx || !canvas) return;
    currentIndex.value--;
    restoreState(history.value[currentIndex.value]);
  };

  const redo = () => {
    if (!canRedo.value || !ctx || !canvas) return;
    currentIndex.value++;
    restoreState(history.value[currentIndex.value]);
  };

  const restoreState = (dataUrl: string) => {
    const img = new Image();
    img.src = dataUrl;
    img.onload = () => {
      ctx?.clearRect(0, 0, canvas!.width, canvas!.height);
      ctx?.drawImage(img, 0, 0);
    };
  };

  return { saveState, undo, redo, canUndo, canRedo };
}