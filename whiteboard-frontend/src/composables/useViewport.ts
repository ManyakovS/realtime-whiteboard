import { ref, reactive } from "vue";
import { useWhiteboardStore } from "@/stores/whiteboard-store";

const state = reactive({
  scrollX: 0,
  scrollY: 0,
  viewWidth: 0,
  viewHeight: 0,
  zoom: 1,
});

const viewportRef = ref<HTMLElement | null>(null);

export function useViewport() {
  const store = useWhiteboardStore();

  const initViewport = (el: HTMLElement) => {
    viewportRef.value = el;
    update();

    centerViewport();

    el.addEventListener("scroll", update);
    window.addEventListener("resize", update);
  };

  const update = () => {
    if (!viewportRef.value) return;
    state.scrollX = viewportRef.value.scrollLeft;
    state.scrollY = viewportRef.value.scrollTop;
    state.viewWidth = viewportRef.value.clientWidth;
    state.viewHeight = viewportRef.value.clientHeight;
  };

  const setZoom = (newZoom: number) => {
    if (!viewportRef.value) return;

    const oldZoom = state.zoom;
    const clampedZoom = Math.min(Math.max(newZoom, 0.25), 3);

    if (oldZoom === clampedZoom) return;

    const centerX =
      (viewportRef.value.scrollLeft + state.viewWidth / 2) / oldZoom;
    const centerY =
      (viewportRef.value.scrollTop + state.viewHeight / 2) / oldZoom;

    state.zoom = clampedZoom;

    viewportRef.value.scrollLeft = centerX * clampedZoom - state.viewWidth / 2;
    viewportRef.value.scrollTop = centerY * clampedZoom - state.viewHeight / 2;
  };

  const scrollTo = (x: number, y: number) => {
    if (!viewportRef.value) return;
    viewportRef.value.scrollLeft = x - state.viewWidth / 2;
    viewportRef.value.scrollTop = y - state.viewHeight / 2;
  };

  const getIndicatorStyle = (minimapWidth: number, minimapHeight: number) => {
    const scaleX = minimapWidth / (store.WORLD_SIZE * state.zoom);
    const scaleY = minimapHeight / (store.WORLD_SIZE * state.zoom);

    return {
      width: `${state.viewWidth * scaleX}px`,
      height: `${state.viewHeight * scaleY}px`,
      transform: `translate(${state.scrollX * scaleX}px, ${
        state.scrollY * scaleY
      }px)`,
    };
  };

  const centerViewport = () => {
    if (!viewportRef.value) return;

    const targetX = (store.WORLD_SIZE - state.viewWidth) / 2;
    const targetY = (store.WORLD_SIZE - state.viewHeight) / 2;

    viewportRef.value.scrollLeft = targetX;
    viewportRef.value.scrollTop = targetY;
  };

  const handleMinimapAction = (
    e: MouseEvent,
    minimapEl: HTMLElement | null
  ) => {
    if (!minimapEl || !viewportRef.value) return;

    const rect = minimapEl.getBoundingClientRect();

    const scale = (store.WORLD_SIZE * state.zoom) / rect.width;

    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const worldX = clickX * scale;
    const worldY = clickY * scale;

    scrollTo(worldX, worldY);
  };

  return {
    state,
    viewportRef,
    initViewport,
    scrollTo,
    getIndicatorStyle,
    handleMinimapAction,
    centerViewport,
    setZoom,
  };
}
