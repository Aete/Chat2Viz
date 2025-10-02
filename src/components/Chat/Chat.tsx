import styled from "styled-components";
import ChatInput from "./ChatInput";
import RowUser from "./RowUser";
import RowAI from "./RowAI";
import { useEffect, useState } from "react";

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
  useEffect(() => {
    if (chat.length && chat[chat.length - 1].role === "user") {
      setTimeout(() => {
        setChat((prev) => {
          return [
            ...prev,
            { role: "assistant", content: "This is a response from AI." },
          ];
        });
      }, 1000);
    }
  }, [chat]);

  return (
    <ChatContainer>
      <ChatInput handleInput={setChat} />
      <ChatLog>
        {chat.map((c, i) => {
          if (c.role === "user") {
            return <RowUser key={`chat-${i}`} message={c.content} />;
          } else {
            return <RowAI key={`chat-${i}`} message={c.content} />;
          }
        })}
      </ChatLog>
    </ChatContainer>
  );
}
