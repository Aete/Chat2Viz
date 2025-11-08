export interface SDotData {
  temp_celsius: number;
  humidity: number;
  defacto_pop: number;
  latitude: number;
  longitude: number;
}

export interface PointData {
  heightData: number;
  colorData: number;
  longitude: number;
  latitude: number;
}

export enum Column {
  TEMPERATURE = "temp_celsius",
  HUMIDITY = "humidity",
  DEFACTO = "defacto_pop",
  LATITUDE = "latitude",
  LONGITUDE = "longitude",
}

export type LayerState = {
  colorColumn: Column;
  heightColumn: Column;
};

export type MapCommand = {
  type: "setView";
  payload: {
    // 우선순위: bbox > center
    center?: { lat: number; lon: number };
    bbox?: [number, number, number, number]; // [minLon, minLat, maxLon, maxLat]
    zoom?: number; // center 있을 때만 사용
    pitch?: number;
    bearing?: number;
    // 애니메이션 옵션
    transition?: {
      type?: "flyTo" | "linear";
      durationMs?: number; // 기본 1200
    };
    // bbox 있을 때 fitBounds 옵션
    fit?: {
      padding?: number; // 기본 80
      maxZoom?: number; // 기본 15
    };
    // 지명만 온 경우(지오코딩 필요)
    placeName?: string;
  };
};
