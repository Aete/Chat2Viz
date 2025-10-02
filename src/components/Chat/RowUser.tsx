import styled from "styled-components";

const RowUserContainer = styled.div`
  box-sizing: border-box;
  display: flex;
  width: 100%;
  max-width: 300px;
  min-height: 40px;
  padding: 0 10px;
  border: 1px solid #2979ff;
  border-radius: 20px;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  margin-bottom: 20px;
`;

const ChatText = styled.p`
  color: #2979ff;
  font-family: "Roboto", sans-serif;
  font-size: 20px;
`;

export default function RowUser({ message }: { message: string }) {
  return (
    <RowUserContainer>
      <ChatText>{message}</ChatText>;
    </RowUserContainer>
  );
}
