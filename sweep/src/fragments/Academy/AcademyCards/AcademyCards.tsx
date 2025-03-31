import { useEffect, useState } from "react";
import {
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
  View,
} from "react-native";
import { router } from "expo-router";
import styled from "styled-components/native";

import { EmptyCard, NormalCard, ProCard } from "./Cards";
import { Scroll } from "@components/ScrollView";
import { useAuth } from "@contexts/auth";
import { useHome } from "@contexts/home";
import { useTheme } from "@contexts/theme";
import { AcademySimpleType } from "@models/products";
import { getMyAcademies } from "@services/products";

const screenWidth = Dimensions.get("window").width;

export function AcademyCards() {
  const [myAcademies, setMyAcademies] = useState<AcademySimpleType[]>([]);
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const { mode } = useAuth();
  const { selectAcademy } = useHome();
  const { theme } = useTheme();

  const handleMyAcademyPress = (academy: AcademySimpleType) => {
    selectAcademy(academy);
    router.push("/home/academy/my");
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    // Calculate the current page index.
    const offsetX = event.nativeEvent.contentOffset.x;
    // Each session has a width of (width - 48) as per your styles.
    const index = Math.round(offsetX / (screenWidth - 48));
    setActiveIndex(index);
  };

  useEffect(() => {
    const getData = async () => {
      if (mode === "guest") {
        return;
      }

      const query = mode === "pro" ? "coach" : "student";
      const response = await getMyAcademies(query);

      if (response) {
        setMyAcademies(response);
      }
    };

    getData();
  }, [mode]);

  if (mode === "guest") {
    return null;
  }

  if (mode === "normal") {
    if (myAcademies.length === 0) {
      return <EmptyCard />;
    } else {
      return (
        <Container>
          <Scroll
            horizontal
            pagingEnabled
            snapToInterval={screenWidth}
            onScroll={handleScroll}
            decelerationRate="fast"
          >
            {myAcademies.map((academy) => (
              <View key={academy.uuid} style={{ width: screenWidth - 32 }}>
                <NormalCard
                  academy={academy}
                  onPress={() => handleMyAcademyPress(academy)}
                />
              </View>
            ))}
          </Scroll>
          <Dots>
            {myAcademies.map((_, index) => (
              <Dot
                key={index}
                style={{
                  backgroundColor:
                    activeIndex === index ? theme.primary : theme.border,
                }}
              />
            ))}
          </Dots>
        </Container>
      );
    }
  }

  return (
    <Container>
      <Scroll
        horizontal
        pagingEnabled
        snapToInterval={screenWidth}
        onScroll={handleScroll}
        decelerationRate="fast"
      >
        {myAcademies.map((academy) => (
          <View key={academy.uuid} style={{ width: screenWidth - 32 }}>
            <ProCard
              academy={academy}
              onPress={() => handleMyAcademyPress(academy)}
            />
          </View>
        ))}
      </Scroll>
      <Dots>
        {myAcademies.map((_, index) => (
          <Dot
            key={index}
            style={{
              backgroundColor:
                activeIndex === index ? theme.primary : theme.border,
            }}
          />
        ))}
      </Dots>
    </Container>
  );
}

const Container = styled.View`
  gap: 12px;
`;

const Dots = styled.View`
  flex-direction: row;
  justify-content: center;
`;

const Dot = styled.View`
  width: 6px;
  height: 6px;
  border-radius: 3px;
  margin: 0 4px;
`;
