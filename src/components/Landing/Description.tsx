import styled from "styled-components";

const DescriptionText = styled.p`
  margin: 0 0 15px 0;
  font-size: 20px;
  line-height: 1.6;
  font-weight: 300;
  color: #ccc;

  @media screen and (max-width: 1280px) {
    font-size: 18px;
  }

  @media screen and (max-width: 768px) {
    font-size: 14px;
    margin: 0 0 5px 0;
  }
`;

export default function Description() {
  return (
    <DescriptionText>
      LLM을 활용한 도시 환경 모니터링 인터페이스
    </DescriptionText>
  );
}
