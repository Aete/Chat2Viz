import styled from "styled-components";
import { bgColor } from "./utils/colors";
import Dashboard from "./components/Main/Dashboard";
import Landing from "./components/Landing/Landing";

const AppContainer = styled.div`
  width: 100vw;
  min-height: 100vh;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  background-color: ${bgColor};
  position: relative;

  font-family: "Roboto", sans-serif;
  font-optical-sizing: auto;
  font-style: normal;

  @media (max-width: 960px) {
    width: 100%;
  }
`;

export default function App() {
  return (
    <AppContainer>
      <Landing />
      <Dashboard />
    </AppContainer>
  );
}
