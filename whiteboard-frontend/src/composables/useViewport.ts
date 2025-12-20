import { ref, reactive } from 'vue';
import { useWhiteboardStore } from '@/stores/whiteboard-store';

// Создаем состояние вне функции, чтобы оно было единым (Singleton)
const state = reactive({
  scrollX: 0,
  scrollY: 0,
  viewWidth: 0,
  viewHeight: 0,
});

const viewportRef = ref<HTMLElement | null>(null);

export function useViewport() {
  const store = useWhiteboardStore();

  const initViewport = (el: HTMLElement) => {
    viewportRef.value = el;
    update();
    el.addEventListener('scroll', update);
    window.addEventListener('resize', update);
  };

  const update = () => {
    if (!viewportRef.value) return;
    state.scrollX = viewportRef.value.scrollLeft;
    state.scrollY = viewportRef.value.scrollTop;
    state.viewWidth = viewportRef.value.clientWidth;
    state.viewHeight = viewportRef.value.clientHeight;
  };

  const scrollTo = (x: number, y: number) => {
    if (!viewportRef.value) return;
    viewportRef.value.scrollLeft = x - state.viewWidth / 2;
    viewportRef.value.scrollTop = y - state.viewHeight / 2;
  };

  const getIndicatorStyle = (minimapWidth: number, minimapHeight: number) => {
    const scaleX = minimapWidth / store.WORLD_SIZE;
    const scaleY = minimapHeight / store.WORLD_SIZE;

    return {
      width: `${state.viewWidth * scaleX}px`,
      height: `${state.viewHeight * scaleY}px`,
      transform: `translate(${state.scrollX * scaleX}px, ${state.scrollY * scaleY}px)`,
    };
  };

  /**
   * Метод для навигации через мини-карту
   * @param e - MouseEvent из мини-карты
   * @param minimapEl - Элемент мини-карты (холст или контейнер)
   */
  const handleMinimapAction = (e: MouseEvent, minimapEl: HTMLElement | null) => {
    if (!minimapEl || !viewportRef.value) return;

    // 1. Получаем физические размеры мини-карты в DOM
    const rect = minimapEl.getBoundingClientRect();
    
    // 2. Рассчитываем масштаб (World / DOM)
    // Используем ширину, так как пропорции холста и миникарты обычно совпадают
    const scale = store.WORLD_SIZE / rect.width;

    // 3. Вычисляем координаты клика относительно мини-карты
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    // 4. Переводим в мировые координаты
    const worldX = clickX * scale;
    const worldY = clickY * scale;

    // 5. Выполняем перемещение
    scrollTo(worldX, worldY);
  };

  return {
    ...reactive(state),
    viewportRef,
    initViewport,
    scrollTo,
    getIndicatorStyle,
    handleMinimapAction,
  };
}