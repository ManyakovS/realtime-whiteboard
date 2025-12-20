import { ref, computed } from 'vue';

export interface LayerMetadata {
  id: number;
  name: string;
  visible: boolean;
  locked: boolean;
}

export interface HistoryStep {
  layersMetadata: LayerMetadata[];
  images: Record<number, string>;
  activeLayerId: number;
}

export function useHistory(maxHistory = 30) {
  const history = ref<HistoryStep[]>([]);
  const currentIndex = ref(-1);

  const canUndo = computed(() => currentIndex.value > 0);
  const canRedo = computed(() => currentIndex.value < history.value.length - 1);

  const saveState = (layers: LayerMetadata[], activeLayerId: number) => {
    // Удаляем ветку Redo, если мы сделали новое действие после Undo
    if (currentIndex.value < history.value.length - 1) {
      history.value = history.value.slice(0, currentIndex.value + 1);
    }

    const images: Record<number, string> = {};
    layers.forEach(layer => {
      const canvas = document.querySelector(`#layer-${layer.id}`) as HTMLCanvasElement;
      if (canvas) {
        // Сохраняем состояние холста
        images[layer.id] = canvas.toDataURL('image/png', 0.5);
      }
    });

    history.value.push({
      layersMetadata: JSON.parse(JSON.stringify(layers)),
      images,
      activeLayerId
    });

    if (history.value.length > maxHistory) {
      history.value.shift();
    } else {
      currentIndex.value++;
    }
  };

  const undo = () => {
    if (!canUndo.value) return null;
    currentIndex.value--;
    return history.value[currentIndex.value];
  };

  const redo = () => {
    if (!canRedo.value) return null;
    currentIndex.value++;
    return history.value[currentIndex.value];
  };

  return { saveState, undo, redo, canUndo, canRedo, currentIndex, history };
}