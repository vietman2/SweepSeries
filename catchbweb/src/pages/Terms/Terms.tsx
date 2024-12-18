import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

import CatchBLogo from "@assets/catchb.svg";
import { getTerms } from "@services/terms";

type VersionType = {
  id: number;
  created_at: string;
  summary: string;
};

export function TermsOfService() {
  const [versionChoices, setVersionChoices] = useState<VersionType[]>([]);
  const [content, setContent] = useState<string>("");
  const [selectedVersionId, setSelectedVersionId] = useState<number>(-1);

  useEffect(() => {
    const fetchData = async () => {
      const response = await getTerms(
        "Catch B 서비스 이용약관",
        selectedVersionId
      );

      if (response) {
        setVersionChoices(response.history);
        setContent(response.content);

        if (selectedVersionId === -1) {
          setSelectedVersionId(response.history[0].id);
        }
      }
    };

    fetchData();
  }, [selectedVersionId]);

  return (
    <Container>
      <StyledLink to="/">
        <Logo src={CatchBLogo} />
      </StyledLink>
      <Content>
        <label htmlFor="version">서비스 이용약관 버전: </label>
        <select
          id="version"
          value={selectedVersionId}
          onChange={(e) => setSelectedVersionId(Number(e.target.value))}
          data-testid="version-select"
        >
          {versionChoices.map((version) => (
            <option key={version.id} value={version.id}>
              {version.created_at}
            </option>
          ))}
        </select>
        <h1>서비스 이용약관</h1>
        <p>{content}</p>
      </Content>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const StyledLink = styled(Link)`
  display: inline-block;
  width: fit-content;
  margin: 35px 80px;
`;

const Logo = styled.img`
  width: 200px;
  cursor: pointer;
`;

const Content = styled.div`
  margin: 0;
  padding: 20px 80px;
  background-color: #f9f9f9;
  border-radius: 10px 10px 0 0;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  color: #333;
  line-height: 1.6;
  font-family: "Noto Sans KR", sans-serif;
  text-align: left;
`;
