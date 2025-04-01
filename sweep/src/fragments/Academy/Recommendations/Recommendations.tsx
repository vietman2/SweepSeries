import { useEffect, useState } from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";

import { LoadingComponent } from "@components/Fallbacks";
import { AppIcon } from "@components/Icons";
import { Scroll } from "@components/ScrollView";
import { Text } from "@components/Texts";
import { useTheme } from "@contexts/theme";
import { AcademySimpleType } from "@models/products";
import { getRecommendations } from "@services/products";
import { ThemeColorType } from "@themes/colors";

interface Props {
  refreshCount: number;
}

export function Recommendations({
  refreshCount,
}: Readonly<Props>) {
  const [suggestions, setSuggestions] = useState<AcademySimpleType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const { theme } = useTheme();
  const styles = createStyles(theme);

  const handleAcademySelect = (academy: AcademySimpleType) => {
    router.push({
      pathname: "/home/academy/[id]/information",
      params: { id: academy.uuid },
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const response = await getRecommendations();

      if (response) {
        setSuggestions(response);
      }

      setLoading(false);
    };

    fetchData();
  }, [refreshCount]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>나에게 딱 맞는 캐치비 추천!</Text>
        <Text style={styles.subtitle}>Catch B가 추천하는 아카데미/레슨</Text>
      </View>
      {loading ? (
        <LoadingComponent />
      ) : (
        <Scroll horizontal showsHorizontalScrollIndicator={false}>
          {suggestions.map((academy) => (
            <TouchableOpacity
              key={academy.uuid}
              onPress={() => handleAcademySelect(academy)}
              testID={`academy-${academy.uuid}`}
            >
              <Academy academy={academy} />
            </TouchableOpacity>
          ))}
        </Scroll>
      )}
    </View>
  );
}

interface AcademyProps {
  academy: AcademySimpleType;
}

function Academy({ academy }: Readonly<AcademyProps>) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.academy}>
      <Image style={styles.image} src={academy.logo} />
      <Text style={styles.name}>{academy.name}</Text>
      <Text>{academy.location}</Text>
      <View style={styles.rating}>
        <AppIcon icon="star" size={16} color="#F2B517" />
        <Text>
          {academy.rating.toFixed(1)}
          <Text style={styles.grayText}> ({academy.num_reviews})</Text>
        </Text>
      </View>
    </View>
  );
}

const createStyles = (theme: ThemeColorType) =>
  StyleSheet.create({
    container: {
      gap: 8,
    },
    header: {
      gap: 4,
    },
    title: {
      fontSize: 20,
      fontWeight: "bold",
    },
    subtitle: {
      fontSize: 16,
      color: theme.lowEmphasis,
    },
    academy: {
      marginHorizontal: 8,
      gap: 4,
    },
    image: {
      width: 185,
      height: 105,
      borderRadius: 8,
    },
    name: {
      fontSize: 16,
      fontWeight: "bold",
    },
    rating: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
    },
    grayText: {
      color: theme.lowEmphasis,
    },
  });
