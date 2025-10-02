import styled from "styled-components";
import { textColor } from "../../utils/colors";
import { tablet } from "../../utils/helper";

const TitleText = styled.h1`
  font-size: 128px;
  font-weight: 700;
  text-align: center;
  line-height: 125%;
  color: ${textColor};
  letter-spacing: 0.05em;
  margin-bottom: 40px;

  @media (max-width: 1024px) {
    font-size: 108px;
    margin-bottom: 100px;
    line-height: 110%;
  }

  @media (max-width: ${tablet}px) {
    font-size: 48px;
    margin-bottom: 50px;
  }
`;

export default function Title() {
  return <TitleText>Chat2Viz</TitleText>;
}
