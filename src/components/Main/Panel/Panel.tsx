import styled from "styled-components";
import { bgColor } from "../../../utils/colors";
import { LayerOneState, LayerTwoState } from "../../../atoms";
import { useRecoilState } from "recoil";
import LayerSetting from "./LayerSetting";

const PanelContainer = styled.div`
  width: 50%;
  height: 100vh;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  background-color: ${bgColor};
  position: relative;

  font-family: "Roboto", sans-serif;
  font-optical-sizing: auto;
  font-style: normal;

  @media (max-width: 960px) {
    width: 100vw;
    height: 100%;
    padding: 0;
    flex-direction: column;
    justify-content: center;
  }
`;

const LeftPanel = styled.div`
  width: calc(100% - 210px);
  height: 100%;
  box-sizing: border-box;
  padding: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: white;
`;

const RightPanel = styled.div`
  width: 210px;
  height: 100%;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  padding: 10px;
  margin-right: 10px;

  @media (max-width: 960px) {
    width: 100%;
    flex-direction: row;
    justify-content: space-around;
    overflow-x: auto;
  }
`;

export default function Panel() {
  const layerOneRecoilState = useRecoilState(LayerOneState);
  const layerTwoRecoilState = useRecoilState(LayerTwoState);
  return (
    <PanelContainer>
      <LeftPanel />
      <RightPanel>
        <LayerSetting
          layer={"Layer 1"}
          layerRecoilState={layerOneRecoilState}
          height={true}
        />
        <LayerSetting
          layer={"Layer 2"}
          layerRecoilState={layerTwoRecoilState}
          height={true}
        />
        <LayerSetting
          layer={"Layer 3"}
          layerRecoilState={layerTwoRecoilState}
          height={false}
        />
      </RightPanel>
    </PanelContainer>
  );
}
