import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Element } from "react-scroll";
import styled from "styled-components";

import { Header } from "@components/Header";
import { NavBar } from "@components/NavBar";
import { Footer } from "@components/Footer";
import TermsOfService from "@pages/Terms";
import PrivacyPolicy from "@pages/Privacy";

export default function App() {
  return (
    <Router
      future={{
        v7_relativeSplatPath: true,
        v7_startTransition: true,
      }}
    >
      <Container>
        <Routes>
          <Route path="/" element={<Elements />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
        </Routes>
      </Container>
    </Router>
  );
}

function Elements() {
  return (
    <>
      <Element name="Header">
        <Wrapper>
          <NavBar />
          <Header />
        </Wrapper>
      </Element>
      <div style={{ height: "600px" }} />{/* dummy content. TODO: Remove this later */}
      <Element name="Footer">
        <Footer />
      </Element>
    </>
  );
}

const Container = styled.div`
  min-height: 100vh;
  text-align: center;
  color: #f2f2f2;
  background-color: #111111;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;
