import { create } from "zustand";
import { FlyToInterpolator, MapViewState } from "deck.gl";

interface MapStore {
  viewState: MapViewState;
  setViewState: (viewState: MapViewState) => void;
  updateViewState: (updates: Partial<MapViewState>) => void;
  flyTo: (longitude: number, latitude: number, zoom?: number) => void;
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

  setViewState: (viewState: MapViewState) => {
    set({ viewState });
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
}));
