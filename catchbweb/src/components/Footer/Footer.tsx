import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import naverLogo from "@assets/naver.svg";
import instagramLogo from "@assets/instragram.svg";
import { NoticeType } from "@constants/notice";
import { getNotices } from "@services/notices";

export function Footer() {
  const [notices, setNotices] = useState<NoticeType[]>([]);

  const navigate = useNavigate();

  const handleInstagramLink = () => {
    window.open(
      "https://www.instagram.com/catch.b__official/",
      "_blank",
      "noopener noreferrer"
    );
  };

  const handleBlogLink = () => {
    window.open(
      "https://blog.naver.com/catchbaseball",
      "_blank",
      "noopener noreferrer"
    );
  };

  const handleTermsLink = () => {
    navigate("/terms");
  };

  const handlePrivacyLink = () => {
    // TODO: 개인정보 처리방침 페이지로 이동
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await getNotices();

      if (response) {
        setNotices(response);
      }
    };

    fetchData();
  }, []);

  return (
    <Container>
      <Contents>
        <Main>
          <p>(주)스윕시리즈</p>
          <div>
            <button onClick={handleInstagramLink}>
              <img src={instagramLogo} alt="인스타그램" />
            </button>
            <button onClick={handleBlogLink}>
              <img src={naverLogo} alt="네이버 블로그" />
            </button>
          </div>
        </Main>
        <p>사업자 등록번호 354-87-03036 | 대표 홍승우</p>
        <p>인천 서구 청라한내로72번길 17 416호</p>
        <Links>
          <Link onClick={handleTermsLink}>서비스 이용약관</Link>
          <Link onClick={handlePrivacyLink}>개인정보 처리방침</Link>
        </Links>
      </Contents>
      <Notices>
        <p>공지사항</p>
        <hr />
        {notices.map((notice) => (
          <button key={notice.id}>
            <p>{notice.title}</p>
          </button>
        ))}
      </Notices>
      <Copyright>© 2024 SWEEP series. All rights reserved.</Copyright>
    </Container>
  );
}

const Container = styled.footer`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-between;
  padding: 30px 80px;

  color: #f2f2f2;
  background: #333;
  border-radius: 30px 30px 0 0;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    padding: 10px 20px 40px 20px;
    gap: 12px;
  }
`;

const Contents = styled.div`
  text-align: left;

  p {
    font-size: 12px;
    color: #d9d9d9;
  }

  @media (max-width: 768px) {
    text-align: left;
    width: 100%;
  }
`;

const Main = styled.div`
  display: flex;
  align-items: center;

  > div {
    display: flex;
    flex-direction: row;
    margin-left: 16px;
  }

  img {
    width: 30px;
    height: 30px;
    margin-left: 15px;
  }

  button {
    background-color: transparent;
    border: 0;
    color: #f2f2f2;
    font-size: 14px;
    cursor: pointer;
    display: flex;
    align-items: center;
  }

  @media (max-width: 768px) {
    flex-direction: row;
    justify-content: space-between;

    > div {
      flex-direction: row;
      gap: 16px;
    }

    img {
      margin-left: 0;
    }
  }
`;

const Links = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-top: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const Link = styled.button`
  background-color: transparent;
  border: 0;
  color: #f2f2f2;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
`;

const Notices = styled.div`
  text-align: right;
  width: 400px;

  > p:first-child {
    text-align: left;
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 5px;
  }

  > p:last-child {
    font-size: 14px;
    color: #d9d9d9;
  }

  > hr {
    width: 100%;
    border: 0;
    border-top: 1px solid #f2f2f2;
    margin-bottom: 10px;
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

const Copyright = styled.div`
  width: 100%;
  text-align: center;
  font-size: 12px;
  color: #a9a9a9;
  margin-top: 20px;

  @media (max-width: 768px) {
    text-align: center;
    width: 100%;
    margin-top: 10px;
  }
`;
