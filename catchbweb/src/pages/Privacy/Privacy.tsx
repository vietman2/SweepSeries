import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

import CatchBLogo from "@assets/catchb.svg";
import { getPrivacyPolicy } from "@services/terms";

type VersionType = {
  id: number;
  created_at: string;
  summary: string;
};

export function PrivacyPolicy() {
  const [versions, setVersions] = useState<VersionType[]>([]);
  const [content, setContent] = useState<string>("");
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedId(Number(e.target.value));
  };

  useEffect(() => {
    const fetchPrivacyPolicy = async () => {
      const response = await getPrivacyPolicy(selectedId);

      if (response) {
        setVersions(response.versions);
        setContent(response.content);
        setSelectedId(response.versions[0].id);
      }
    };

    fetchPrivacyPolicy();
  }, [selectedId]);

  return (
    <Wrapper>
      <LinkWrapper to="/">
        <Logo src={CatchBLogo} />
      </LinkWrapper>
      <Content>
        <label htmlFor="version">개인정보 처리방침 버전: </label>
        <select
          id="version"
          value={selectedId ?? -1}
          onChange={handleSelect}
          data-testid="version-select"
        >
          {versions.map((version) => (
            <option key={version.id} value={version.id}>
              {version.created_at}
            </option>
          ))}
        </select>
        <h1>개인정보 처리방침</h1>
        <div>{content}</div>
      </Content>
    </Wrapper>
  );
}

const Logo = styled.img`
  width: 200px;
  cursor: pointer;
`;

const LinkWrapper = styled(Link)`
  display: inline-block;
  width: fit-content;
  margin: 35px 80px;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const Content = styled.div`
  margin: 0;
  padding: 20px 80px;

  color: #333;
  line-height: 1.6;
  font-family: "Noto Sans KR", sans-serif;
  text-align: left;

  white-space: pre-wrap;
  background-color: #f9f9f9;
  border-radius: 10px 10px 0 0;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;
