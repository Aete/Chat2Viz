import { useMapStore } from "../store";

// Unified command interface for AI responses
export interface UnifiedCommand {
  mapView?: {
    center?: { lat: number; lon: number };
    bbox?: [number, number, number, number]; // [minLon, minLat, maxLon, maxLat]
    zoom?: number;
    pitch?: number;
    bearing?: number;
    transition?: { type?: "flyTo" | "linear"; durationMs?: number };
    fit?: { padding?: number; maxZoom?: number };
    placeName?: string;
  } | null;
  dateQuery?: {
    date?: string; // YYYY-MM-DD | YYYY-MM | YYYY
    time?: string; // HH:mm | HH
  } | null;
  sensorQuery?: {
    value: "temperature" | "humidity" | "noise";
    aggregation?: "average" | "min" | "max" | "current";
  } | null;
}

export function executeMapCommand(commandJson: string): boolean {
  try {
    const command: UnifiedCommand = JSON.parse(commandJson);

    // Log all parts of the command for debugging
    if (command.dateQuery) {
      console.log("📅 Date Query:", command.dateQuery);
    }
    if (command.sensorQuery) {
      console.log("🌡️ Sensor Query:", command.sensorQuery);
    }

    // Only execute map commands if mapView is present
    if (!command.mapView) {
      console.log("지도 명령이 없습니다. 다른 쿼리만 처리합니다.");
      return false;
    }

    const mapView = command.mapView;
    const { flyTo, updateViewState } = useMapStore.getState();

    // center가 있으면 flyTo 실행
    if (mapView.center) {
      const zoom = mapView.zoom || 14;
      flyTo(mapView.center.lon, mapView.center.lat, zoom);
      console.log(
        `맵 이동: ${
          mapView.placeName || "지정된 위치"
        }로 이동 (줄 레벨: ${zoom})`
      );
      return true;
    }

    // bbox가 있으면 해당 영역에 fit
    if (mapView.bbox) {
      const [minLon, minLat, maxLon, maxLat] = mapView.bbox;
      const centerLon = (minLon + maxLon) / 2;
      const centerLat = (minLat + maxLat) / 2;
      const zoom = mapView.fit?.maxZoom || 12;

      flyTo(centerLon, centerLat, zoom);
      console.log(`맵 영역 맞춤: bbox [${mapView.bbox.join(", ")}]`);
      return true;
    }

    // zoom만 변경
    if (mapView.zoom !== undefined) {
      updateViewState({ zoom: mapView.zoom });
      console.log(`줄 레벨 변경: ${mapView.zoom}`);
      return true;
    }

    // pitch, bearing 등 다른 속성들 업데이트
    const updates: any = {};
    if (mapView.pitch !== undefined) updates.pitch = mapView.pitch;
    if (mapView.bearing !== undefined) updates.bearing = mapView.bearing;

    if (Object.keys(updates).length > 0) {
      updateViewState(updates);
      console.log("맵 속성 업데이트:", updates);
      return true;
    }

    console.warn("실행할 수 있는 맵 명령을 찾을 수 없습니다:", mapView);
    return false;
  } catch (error) {
    console.error("맵 명령 파싱 오류:", error);
    return false;
  }
}
