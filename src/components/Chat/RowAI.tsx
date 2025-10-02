import styled from "styled-components";

const RowAIContainer = styled.div`
  box-sizing: border-box;
  display: flex;
  width: 300px;
  margin-left: auto;
  min-height: 40px;
  padding: 0 10px;
  border: none;
  border-radius: 20px;
  background-color: #2979ff;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  margin-bottom: 20px;
`;

const ChatText = styled.p`
  color: #fff;
  font-family: "Roboto", sans-serif;
  font-size: 20px;
`;

export default function RowAI({ message }: { message: string }) {
  return (
    <RowAIContainer>
      <ChatText>{message}</ChatText>
    </RowAIContainer>
  );
}
