import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";

import { ErrorComponent, Loading } from "@components/Fallbacks";
import { FAQType } from "@models/apps";
import { getFAQs } from "@services/apps";

const tabs = ["전체", "예약", "아카데미", "레슨", "이벤트", "프로모드"];

export function FAQsList() {
  const [faqs, setFAQs] = useState<FAQType[]>([]);
  const [selectedTab, setSelectedTab] = useState<string>("전체");

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [refreshCount, setRefreshCount] = useState<number>(0);

  const location = useLocation();
  const navigate = useNavigate();

  const handleRefresh = () => {
    setRefreshCount(refreshCount + 1);
  };

  const handleCreate = () => {
    navigate("/apps/faqs/create");
  };

  const handleDetail = (faqId: number) => {
    navigate(`/apps/faqs/${faqId}`);
  };

  useEffect(() => {
    const fetchFAQs = async () => {
      setLoading(true);
      const response = await getFAQs(selectedTab);

      if (response) {
        setFAQs(response);
        setError(false);
      } else {
        setError(true);
      }

      setLoading(false);
    };

    if (location.pathname === "/apps/faqs") {
      fetchFAQs();
    }
  }, [refreshCount, location, selectedTab]);

  if (error) {
    return (
      <Container>
        <ErrorComponent onRefresh={handleRefresh} label="새로고침" />
      </Container>
    );
  }

  return (
    <Container>
      <Categories>
        {tabs.map((tab, index) => (
          <Category
            key={index}
            $selected={selectedTab === tab}
            onClick={() => setSelectedTab(tab)}
          >
            {tab}
          </Category>
        ))}
      </Categories>
      <ButtonWrapper>
        <Button onClick={handleCreate}>FAQ 추가</Button>
      </ButtonWrapper>
      {loading ? (
        <Loading />
      ) : (
        <List>
          <Header>
            <div>No.</div>
            <div>Q</div>
            <div>A</div>
          </Header>
          {faqs.map((faq) => (
            <button
              key={faq.id}
              onClick={() => handleDetail(faq.id)}
              data-testid={`faq-${faq.id}`}
            >
              <Item>
                <div>{faq.id}</div>
                <div>{faq.question}</div>
                <div>{faq.answer}</div>
              </Item>
            </button>
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
  padding: 0 16px;
  gap: 8px;
`;

const Categories = styled.div`
  display: flex;
  gap: 16px;
`;

const Category = styled.div<{ $selected: boolean }>`
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

const ButtonWrapper = styled.div`
  padding: 4px 0;
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 16px;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.colors.background100};
  color: ${({ theme }) => theme.colors.foreground900};
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
`;

const Item = styled.div`
  display: flex;
  align-items: center;

  font-size: 16px;

  border-top: 1px solid ${({ theme }) => theme.colors.borderLight};

  > div {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding: 8px 12px;
    width: 140px;

    border-right: 1px solid ${({ theme }) => theme.colors.borderLight};

    white-space: nowrap;
    overflow: hidden;
  }

  > div:first-child {
    justify-content: center;
    width: 40px;
  }

  > div:nth-child(2) {
    flex: 1;
  }

  > div:last-child {
    flex: 4;
    border-right: none;
  }
`;

const Header = styled(Item)`
  font-size: 18px;
  font-weight: bold;

  border-top: none;

  > div {
    justify-content: center;
  }
`;
