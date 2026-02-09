import styled from "styled-components";
import ChatInput from "./ChatInput";
import RowUser from "./RowUser";
import RowAI from "./RowAI";
import { useEffect, useState } from "react";
import { getChatCompletionMapView } from "../../utils/openai";
import { executeMapCommand } from "../../utils/mapCommands";
import {
  useMapStore,
  useGetSensorsInBounds,
  useSetFilteredSensors,
  useFetchEnvironmentAvgBySensors
} from "../../store";

const ChatContainer = styled.div`
  width: 400px;
  height: 100vh;
  display: flex;
  flex-direction: column-reverse;
  align-items: flex-start;
  padding: 10px 20px;
  box-sizing: border-box;
`;

const ChatLog = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

export interface Chat {
  role: "user" | "assistant";
  content: string;
}

const safeParseResponse = (raw: string): Record<string, any> | null => {
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

const normalizeDateTimeInput = (value?: string | null): string | null => {
  if (!value) return null;
  const trimmed = value.trim();
  if (!trimmed) return null;

  const withT = trimmed.includes("T") ? trimmed : trimmed.replace(" ", "T");
  const hasTimezone = /([+-]\d{2}:?\d{2}|Z)$/i.test(withT);
  if (hasTimezone) {
    return withT;
  }

  const segmentCount = withT.split(":").length;
  const withSeconds = segmentCount >= 3 ? withT : `${withT}:00`;
  return `${withSeconds}Z`;
};

export default function Chat() {
  const [chat, setChat] = useState<Chat[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { getBoundingBox } = useMapStore();
  const getSensorsInBounds = useGetSensorsInBounds();
  const setFilteredSensors = useSetFilteredSensors();
  const fetchEnvironmentAvgBySensors = useFetchEnvironmentAvgBySensors();

  useEffect(() => {
    if (chat.length && chat[chat.length - 1].role === "user" && !isLoading) {
      const getAIResponse = async () => {
        setIsLoading(true);
        try {
          const response = await getChatCompletionMapView(chat);

          // AI 응답을 맵 명령으로 실행
          const commandExecuted = executeMapCommand(response);
          const parsedPayload = safeParseResponse(response);
          const normalizedStartTime = normalizeDateTimeInput(
            parsedPayload?.dateQuery?.startDateTime
          );
          const normalizedEndTime = normalizeDateTimeInput(
            parsedPayload?.dateQuery?.endDateTime
          );
          const sensorParameter = parsedPayload?.sensorQuery?.value ?? null;

          console.log(response);

          // 맵이 변경되었으면 bounding box 기반으로 센서 조회
          if (commandExecuted) {
            setTimeout(async () => {
              const boundingBox = getBoundingBox();

              if (!boundingBox) {
                console.warn(
                  "⚠️ Bounding Box를 계산할 수 없습니다. Viewport가 아직 초기화되지 않았습니다."
                );
                return;
              }

              const { topLeft, bottomRight } = boundingBox;

              console.log("🗺️ 현재 맵 Bounding Box:", {
                topLeft,
                bottomRight,
              });

              // Use sensorStore to get sensors in bounding box
              const bounds = {
                minLat: bottomRight.latitude,
                maxLat: topLeft.latitude,
                minLon: topLeft.longitude,
                maxLon: bottomRight.longitude,
              };

              console.log("🔍 Getting sensors in bounds:", bounds);

              try {
                const sensorsInBounds = getSensorsInBounds(bounds);
                console.log("✅ Sensors in current bounding box:");
                console.table(sensorsInBounds); // serial, lat, lon
                console.log(
                  `Found ${sensorsInBounds.length} sensors in the current view`
                );

                if (
                  !normalizedStartTime ||
                  !normalizedEndTime ||
                  !sensorParameter
                ) {
                  setFilteredSensors(bounds);
                  setChat((prev) => [
                    ...prev,
                    {
                      role: "assistant",
                      content: "관심 있는 데이터와 날짜를 입력해주세요.",
                    },
                  ]);
                  return;
                }

                // Fetch environment data for sensors in bounds
                const sensorIds = sensorsInBounds.map((sensor) => sensor.serial);
                const environmentData = await fetchEnvironmentAvgBySensors(
                  sensorIds,
                  normalizedStartTime,
                  normalizedEndTime,
                  sensorParameter
                );

                // Update filtered sensors to show only sensors in current view
                setFilteredSensors(bounds);
              } catch (error) {
                console.error("❌ Error getting sensors in bounds or fetching data:", error);
              }
            }, 2500); // 맵 애니메이션 끝나는 시간 고려
          }

          // 명령 실행 결과에 따라 다른 메시지 표시
          let displayMessage = response;
          if (commandExecuted) {
            if (parsedPayload) {
              const placeName =
                parsedPayload?.payload?.placeName ?? parsedPayload?.mapView?.placeName;
              displayMessage = placeName
                ? `${placeName}으로 이동했습니다.`
                : "맵 위치를 변경했습니다.";
            } else {
              displayMessage = "맵 위치를 변경했습니다.";
            }
          }

          setChat((prev) => [
            ...prev,
            { role: "assistant", content: displayMessage },
          ]);
        } catch (error) {
          console.error("AI 응답 오류:", error);
          setChat((prev) => [
            ...prev,
            {
              role: "assistant",
              content: "죄송합니다. 응답을 생성할 수 없습니다.",
            },
          ]);
        } finally {
          setIsLoading(false);
        }
      };

      getAIResponse();
    }
  }, [chat, isLoading]);

  return (
    <ChatContainer>
      <ChatInput handleInput={setChat} disabled={isLoading} />
      <ChatLog>
        {chat.map((c, i) => {
          if (c.role === "user") {
            return <RowUser key={`chat-${i}`} message={c.content} />;
          } else {
            return <RowAI key={`chat-${i}`} message={c.content} />;
          }
        })}
        {isLoading && <RowAI message="AI가 응답을 생성 중입니다..." />}
      </ChatLog>
    </ChatContainer>
  );
}
