import { useEffect, useState } from "react";
import styled from "styled-components";

import { ErrorComponent, Loading } from "@components/Fallbacks";
import { CoachSimple, CoachSimpleHeader } from "@fragments/Coach";
import { CoachType } from "@models/products";
import { getCoaches } from "@services/products";

const options = ["승인 완료", "승인 대기", "승인 거부"];

export function CoachList() {
  const [selectedTab, setSelectedTab] = useState<string>("승인 완료");
  const [coaches, setCoaches] = useState<CoachType[]>([]);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [refreshCount, setRefreshCount] = useState<number>(0);

  const handleRefresh = () => {
    setRefreshCount(refreshCount + 1);
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await getCoaches(selectedTab);

      if (response) {
        setCoaches(response);
        setError(false);
      } else {
        setError(true);
      }

      setLoading(false);
    };

    fetchData();
  }, [selectedTab, refreshCount]);

  return (
    <Wrapper>
      <Options>
        {options.map((option) => (
          <Option
            key={option}
            onClick={() => setSelectedTab(option)}
            $selected={selectedTab === option}
          >
            {option}
          </Option>
        ))}
      </Options>
      {loading ? (
        <Loading />
      ) : error ? (
        <ErrorComponent onRefresh={handleRefresh} label="새로고침" />
      ) : (
        <Table>
          <CoachSimpleHeader type={selectedTab} />
          {coaches.map((coach) => (
            <CoachSimple key={coach.uuid} coach={coach} type={selectedTab} />
          ))}
        </Table>
      )}
    </Wrapper>
  );
}

const Table = styled.div`
  display: flex;
  flex-direction: column;
  padding: 8px 0;
`;

const Wrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 8px;
  padding: 0 16px;
`;

const Option = styled.button<{ $selected: boolean }>`
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

const Options = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;
