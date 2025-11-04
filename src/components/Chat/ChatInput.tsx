import { KeyboardEvent, useState } from "react";
import styled from "styled-components";
import { type Chat } from "./Chat";

const ChatInputContainer = styled.div`
  width: 100%;
  min-height: 40px;
  background-color: ${"#f5f5f5"};
  border-radius: 20px;
  padding: 0 10px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
`;

const TextInput = styled.input`
  width: 300px;
  border: none;
  background-color: transparent;
  font-size: 20px;
  &:focus {
    border: none;
  }
  &:active {
    border: none;
  }
`;

const Icon = styled.input`
  width: 30px;
  height: 30px;
  border: none;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  background-color: #2979ff;
`;

export default function ChatInput({
  handleInput,
  disabled = false,
}: {
  handleInput: React.Dispatch<React.SetStateAction<Chat[]>>;
  disabled?: boolean;
}) {
  const [value, setValue] = useState<string>("");

  const uploadInput = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !disabled) {
      if (value.trim()) {
        handleInput((prev) => {
          return [...prev, { role: "user", content: value }];
        });
        setValue("");
      }
    }
  };

  return (
    <ChatInputContainer>
      <TextInput
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={uploadInput}
        placeholder={
          disabled ? "AI가 응답 중입니다..." : "메시지를 입력하세요..."
        }
        disabled={disabled}
      />
      <Icon />
    </ChatInputContainer>
  );
}
