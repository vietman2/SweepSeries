import { useEffect, useState } from "react";
import styled from "styled-components";

import { ErrorComponent, Loading } from "@components/Fallbacks";
import { AcademySimple, AcademySimpleHeader } from "@fragments/Academy";
import { AcademyType } from "@models/products";
import { getAcademies } from "@services/products";

const options = ["승인 완료", "승인 대기", "승인 거부"];

export function AcademyList() {
  const [selectedTab, setSelectedTab] = useState<string>("승인 완료");
  const [academies, setAcademies] = useState<AcademyType[]>([]);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [refreshCount, setRefreshCount] = useState<number>(0);

  const handleRefresh = () => {
    setRefreshCount(refreshCount + 1);
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await getAcademies(selectedTab);

      if (response) {
        setAcademies(response);
        setError(false);
      } else {
        setError(true);
      }

      setLoading(false);
    };

    fetchData();
  }, [selectedTab, refreshCount]);

  return (
    <Container>
      <Tabs>
        {options.map((option) => (
          <Tab
            key={option}
            onClick={() => setSelectedTab(option)}
            $selected={selectedTab === option}
          >
            {option}
          </Tab>
        ))}
      </Tabs>
      {loading ? (
        <Loading />
      ) : error ? (
        <ErrorComponent onRefresh={handleRefresh} label="새로고침" />
      ) : (
        <List>
          <AcademySimpleHeader type={selectedTab} />
          {academies.map((academy) => (
            <AcademySimple
              key={academy.uuid}
              academy={academy}
              type={selectedTab}
            />
          ))}
        </List>
      )}
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 8px;
  padding: 0 16px;
`;

const Tabs = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Tab = styled.button<{ $selected: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 8px;
  gap: 4px;

  color: ${({ $selected, theme }) =>
    $selected ? theme.colors.foreground900 : theme.colors.foreground500};
  font-size: 18px;
  font-weight: 500;

  border-bottom: ${({ $selected, theme }) =>
    $selected ? `2px solid ${theme.colors.foreground900}` : "none"};
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  padding: 8px 0;
`;
