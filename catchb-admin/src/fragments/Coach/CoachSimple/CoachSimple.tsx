import { useState } from "react";
import styled from "styled-components";

import { CoachType } from "@models/products";
import { approveCoach, rejectCoach } from "@services/products";

interface Props {
  type: string;
}

export function CoachSimpleHeader({ type }: Readonly<Props>) {
  return (
    <Header>
      <div>코치 ID</div>
      <div>이름</div>
      <div>소속 아카데미</div>
      {type === "승인 완료" && <div>승인일</div>}
      {type === "승인 거부" && (
        <>
          <div>사업자 등록증</div>
          <div>거절 사유</div>
        </>
      )}
      {type === "승인 대기" && (
        <>
          <div>사업자 등록증</div>
          <div>승인하기</div>
        </>
      )}
    </Header>
  );
}

interface ObjectProps {
  coach: CoachType;
  type: string;
}

export function CoachSimple({ coach, type }: Readonly<ObjectProps>) {
  const [rejectReason, setRejectReason] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const handleApprove = async () => {
    if (window.confirm(`${coach.name} 코치의 등록을 승인하시겠습니까?`)) {
      const response = await approveCoach(coach.uuid);

      if (response) {
        alert("승인되었습니다.");
        window.location.reload();
      } else {
        alert("오류가 발생했습니다.");
      }
    }
  };

  const handleReject = async () => {
    const response = await rejectCoach(coach.uuid, rejectReason);

    if (response) {
      window.alert("거절되었습니다.");
      window.location.reload();
    } else {
      window.alert("오류가 발생했습니다.");
    }
  };

  return (
    <>
      <Container>
        <div>{coach.uuid}</div>
        <div>{coach.name}</div>
        <div>{coach.academy}</div>
        {type === "승인 완료" && <div>{coach.verified_at}</div>}
        {type === "승인 거부" && (
          <>
            <a href={coach.certificate} target="_blank" rel="noreferrer">
              사업자 등록증
            </a>
            <div>{coach.reject_reason}</div>
          </>
        )}
        {type === "승인 대기" && (
          <>
            <a rel="" href={coach.certificate} target="_blank">
              사업자 등록증
            </a>
            <Buttons>
              <Button onClick={handleApprove}>승인</Button>
              <Button $negative onClick={openModal}>
                거절
              </Button>
            </Buttons>
          </>
        )}
      </Container>
      <Overlay $open={isModalOpen}>
        <Modal $open={isModalOpen}>
          <div>거절 사유</div>
          <input
            type="text"
            placeholder="거절 사유를 입력하세요."
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            data-testid="reject-reason"
          />
          <Buttons>
            <Button $negative onClick={handleReject}>
              확인
            </Button>
            <Button onClick={() => setIsModalOpen(false)}>취소</Button>
          </Buttons>
        </Modal>
      </Overlay>
    </>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 32px;

  font-size: 16px;
  color: ${({ theme }) => theme.colors.foreground700};

  border-top: 1px solid ${({ theme }) => theme.colors.borderLight};

  > div {
    width: 160px;
  }

  > a {
    width: 140px;
  }

  > div:first-child {
    width: 320px;
    padding: 0 8px;
  }
`;

const Button = styled.button<{ $negative?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 24px;
  padding: 0 8px;

  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.background100};
  border-radius: 4px;
  background-color: ${({ theme, $negative }) =>
    $negative ? "#f00" : theme.colors.primary};
  border: none;

  cursor: pointer;
`;

const Header = styled(Container)`
  font-weight: 700;
  color: ${({ theme }) => theme.colors.foreground900};

  border-top: none;
`;

const Modal = styled.div<{ $open: boolean }>`
  display: ${({ $open }) => ($open ? "flex" : "none")};
  flex-direction: column;
  position: absolute;
  top: 30%;
  left: 45%;
  width: 400px;
  padding: 24px;
  gap: 16px;

  border-radius: 8px;
  background-color: ${({ theme }) => theme.colors.background500};

  transition: background-color 0.3s;
`;

const Overlay = styled.div<{ $open: boolean }>`
  display: ${({ $open }) => ($open ? "flex" : "none")};
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 16px 0 0 16px;
  background-color: rgba(0, 0, 0, 0.5);
`;

const Buttons = styled.div`
  display: flex;
  gap: 8px;
`;
