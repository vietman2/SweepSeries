import { useEffect, useState } from "react";
import { Dimensions, View } from "react-native";
import { router } from "expo-router";

import { EmptyCard, NormalCard, ProCard } from "./Cards";
import { Scroll } from "@components/ScrollView";
import { useAuth } from "@contexts/auth";
import { useHome } from "@contexts/home";
import { AcademySimpleType } from "@models/products";
import { getMyAcademies } from "@services/products";

export function AcademyCards() {
  const [myAcademies, setMyAcademies] = useState<AcademySimpleType[]>([]);

  const { mode } = useAuth();
  const { selectAcademy } = useHome();
  const screenWidth = Dimensions.get("window").width;

  const handleMyAcademyPress = (academy: AcademySimpleType) => {
    selectAcademy(academy);
    router.push("/home/academy/my");
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
        <Scroll
          horizontal
          pagingEnabled
          snapToInterval={screenWidth}
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
      );
    }
  }

  return (
    <Scroll
      horizontal
      pagingEnabled
      snapToInterval={screenWidth}
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
  );
}
