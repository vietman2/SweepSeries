import Slider from "react-slick";
import styled from "styled-components";

import mlbimage1 from "@assets/mlbimage1.jpg";
import mlbimage2 from "@assets/mlbimage2.jpg";
import mlbimage3 from "@assets/mlbimage3.jpg";
import Logo from "@assets/Logo.svg";

const sliderSettings = {
  dots: false,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 3000,
  fade: true,
};

export function Header() {
  return (
    <Container>
      <Slider {...sliderSettings} className="slider-container">
        <div>
          <HeaderImage src={mlbimage1} alt="MLB 1" className="header-image" />
        </div>
        <div>
          <HeaderImage src={mlbimage2} alt="MLB 2" className="header-image" />
        </div>
        <div>
          <HeaderImage src={mlbimage3} alt="MLB 3" className="header-image" />
        </div>
      </Slider>
      <HeaderGradient />
      <Overlay>
        <TitleContainer>
          <h1>Catch the Best, Play Your Best</h1>
          <img src={Logo} alt="Catch B" />
          <h3>Coming Soon!</h3>
        </TitleContainer>
      </Overlay>
    </Container>
  );
}

const Container = styled.div`
  height: 100vh;
  width: 100%;
  max-height: 600px;
  position: relative;
  overflow: hidden;

  @media (max-width: 768px) {
    height: auto;
    max-height: none;
  }
`;

const HeaderImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: relative;
  z-index: -1;
`;

const HeaderGradient = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 40%;
  background: linear-gradient(to top, #111111, rgba(17, 17, 17, 0.7), rgba(0, 0, 0, 0));
  z-index: 1;
`;

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(17, 17, 17, 0.5);
  display: flex;
  justify-content: center;
  align-items: end;
  color: #f2f2f2;
  text-align: center;
  padding: 20px 80px;
  box-sizing: border-box;
  z-index: 1;
`;

const TitleContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 50px;

  > h1 {
    font-family: "Racing Sans One", sans-serif;
    font-size: 60px;
    margin: 0;
    font-weight: 300;
    color: #fcfde9;
  }

  > img {
    width: 150px;
    height: auto;
    margin: 40px 0 50px 0;
  }

  > h3 {
    font-family: "Racing Sans One", sans-serif;
    font-size: 28px;
    font-weight: 300;
    margin: 0;
  }

  @media (max-width: 768px) {
    margin-bottom: 20px;

    > h1 {
      font-size: 23px;
      margin-bottom: 20px;
      white-space: nowrap;
    }

    > img {
      width: 50px;
      margin: 0 0 10px 0;
    }

    > h3 {
      font-family: "Racing Sans One", sans-serif;
      font-size: 16px;
      font-weight: 300;
      margin: 0;
    }
  }
`;
