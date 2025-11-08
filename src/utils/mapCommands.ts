import { useMapStore } from "../store";

// AI 응답 JSON을 파싱해서 맵 명령을 실행하는 함수
export interface MapCommand {
  type: "setView";
  payload: {
    center?: { lat: number; lon: number };
    bbox?: [number, number, number, number]; // [minLon, minLat, maxLon, maxLat]
    zoom?: number;
    pitch?: number;
    bearing?: number;
    transition?: { type?: "flyTo" | "linear"; durationMs?: number };
    fit?: { padding?: number; maxZoom?: number };
    placeName?: string;
  };
}

export function executeMapCommand(commandJson: string): boolean {
  try {
    const command: MapCommand = JSON.parse(commandJson);

    if (command.type !== "setView") {
      console.warn("지원하지 않는 명령 타입:", command.type);
      return false;
    }

    const { payload } = command;
    const { flyTo, updateViewState } = useMapStore.getState();

    // center가 있으면 flyTo 실행
    if (payload.center) {
      const zoom = payload.zoom || 14;
      flyTo(payload.center.lon, payload.center.lat, zoom);
      console.log(
        `맵 이동: ${
          payload.placeName || "지정된 위치"
        }로 이동 (줌 레벨: ${zoom})`
      );
      return true;
    }

    // bbox가 있으면 해당 영역에 fit
    if (payload.bbox) {
      const [minLon, minLat, maxLon, maxLat] = payload.bbox;
      const centerLon = (minLon + maxLon) / 2;
      const centerLat = (minLat + maxLat) / 2;
      const zoom = payload.fit?.maxZoom || 12;

      flyTo(centerLon, centerLat, zoom);
      console.log(`맵 영역 맞춤: bbox [${payload.bbox.join(", ")}]`);
      return true;
    }

    // zoom만 변경
    if (payload.zoom !== undefined) {
      updateViewState({ zoom: payload.zoom });
      console.log(`줌 레벨 변경: ${payload.zoom}`);
      return true;
    }

    // pitch, bearing 등 다른 속성들 업데이트
    const updates: any = {};
    if (payload.pitch !== undefined) updates.pitch = payload.pitch;
    if (payload.bearing !== undefined) updates.bearing = payload.bearing;

    if (Object.keys(updates).length > 0) {
      updateViewState(updates);
      console.log("맵 속성 업데이트:", updates);
      return true;
    }

    console.warn("실행할 수 있는 맵 명령을 찾을 수 없습니다:", payload);
    return false;
  } catch (error) {
    console.error("맵 명령 파싱 오류:", error);
    return false;
  }
}
