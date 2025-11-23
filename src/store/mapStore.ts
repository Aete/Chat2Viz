import { create } from "zustand";
import { FlyToInterpolator, MapViewState } from "deck.gl";

interface MapStore {
  viewState: MapViewState;
  viewport: any | null; // DeckGL Viewport 객체
  setViewState: (viewState: MapViewState) => void;
  setViewport: (viewport: any) => void;
  updateViewState: (updates: Partial<MapViewState>) => void;
  flyTo: (longitude: number, latitude: number, zoom?: number) => void;
  getBoundingBox: () => {
    topLeft: { latitude: number; longitude: number };
    bottomRight: { latitude: number; longitude: number };
  } | null;
}

export const useMapStore = create<MapStore>((set) => ({
  viewState: {
    longitude: 126.978,
    latitude: 37.5665,
    zoom: 10,
    pitch: 0,
    bearing: 0,
    transitionDuration: 1000,
    transitionInterpolator: new FlyToInterpolator(),
  },

  viewport: null,

  setViewState: (viewState: MapViewState) => {
    set({ viewState });
  },

  setViewport: (viewport: any) => {
    set({ viewport });
  },

  updateViewState: (updates: Partial<MapViewState>) => {
    set((state) => ({
      viewState: { ...state.viewState, ...updates },
    }));
  },

  flyTo: (longitude: number, latitude: number, zoom = 10) => {
    set((state) => ({
      viewState: {
        ...state.viewState,
        longitude,
        latitude,
        zoom,
        transitionDuration: 2000,
        transitionInterpolator: new FlyToInterpolator(),
      },
    }));
  },

  // DeckGL viewport를 활용한 정확한 bounding box 계산
  getBoundingBox: (): {
    topLeft: { latitude: number; longitude: number };
    bottomRight: { latitude: number; longitude: number };
  } | null => {
    const state: MapStore = useMapStore.getState();
    const { viewport }: { viewport: any } = state;

    if (!viewport) {
      console.warn("Viewport가 아직 초기화되지 않았습니다.");
      return null;
    }

    try {
      // 뷰포트의 실제 크기를 사용하여 두 모서리 좌표만 계산
      const { width, height } = viewport;

      // 좌측상단과 우측하단 두 점만 계산하면 충분
      const topLeft: [number, number] = viewport.unproject([0, 0]);
      const bottomRight: [number, number] = viewport.unproject([width, height]);

      return {
        topLeft: {
          latitude: topLeft[1], // Y좌표 = latitude
          longitude: topLeft[0], // X좌표 = longitude
        },
        bottomRight: {
          latitude: bottomRight[1],
          longitude: bottomRight[0],
        },
      };
    } catch (error) {
      console.error("Bounding box 계산 오류:", error);
      return null;
    }
  },
}));
