import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import { Loading } from "@components/Fallbacks";
import { MainLogo } from "@components/Icons";
import { TextInput } from "@components/Inputs";
import { useAuth } from "@contexts/auth";
import { login as loginRequest } from "@services/auth";

export function Login() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const navigate = useNavigate();
  const { isAuthenticated, login } = useAuth();

  const handleLogin = async () => {
    setLoading(true);
    const response = await loginRequest(username, password);

    if (response) {
      login(response.access);
      navigate("/home");
    } else {
      window.alert("로그인에 실패했습니다.");
    }

    setLoading(false);
  };

  useEffect(() => {
    const handleEnterKey = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        handleLogin();
      }
    };

    window.addEventListener("keydown", handleEnterKey);
    return () => {
      window.removeEventListener("keydown", handleEnterKey);
    };
  }, [handleLogin]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/home");
    }
  }, []);

  if (loading) {
    return (
      <Container>
        <Loading />
      </Container>
    );
  }

  return (
    <Container>
      <MainLogo size={280} />
      <Wrapper>
        <TextInput
          value={username}
          onChange={setUsername}
          placeholder="아이디"
        />
        <TextInput
          value={password}
          onChange={setPassword}
          placeholder="비밀번호"
          password
        />
      </Wrapper>
      <Button onClick={handleLogin}>로그인</Button>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100dvh;
  gap: 36px;

  background-color: ${({ theme }) => theme.colors.background300};
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 24px;
`;

const Button = styled.button`
  width: 25vw;
  height: 40px;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.colors.foreground900};
  color: ${({ theme }) => theme.colors.background100};
  font-size: 18px;
  font-weight: 500;
  cursor: pointer;
`;
