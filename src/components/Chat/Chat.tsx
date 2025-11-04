import styled from "styled-components";
import ChatInput from "./ChatInput";
import RowUser from "./RowUser";
import RowAI from "./RowAI";
import { useEffect, useState } from "react";
import { getChatCompletionMapView } from "../../utils/openai";
import { executeMapCommand } from "../../utils/mapCommands";

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

export default function Chat() {
  const [chat, setChat] = useState<Chat[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (chat.length && chat[chat.length - 1].role === "user" && !isLoading) {
      const getAIResponse = async () => {
        setIsLoading(true);
        try {
          const response = await getChatCompletionMapView(chat);

          // AI 응답을 맵 명령으로 실행
          const commandExecuted = executeMapCommand(response);

          // 명령 실행 결과에 따라 다른 메시지 표시
          let displayMessage = response;
          if (commandExecuted) {
            try {
              const parsedCommand = JSON.parse(response);
              const placeName = parsedCommand.payload?.placeName;
              displayMessage = placeName
                ? `${placeName}으로 이동했습니다.`
                : "맵 위치를 변경했습니다.";
            } catch {
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
