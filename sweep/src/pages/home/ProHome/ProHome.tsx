import { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

import { Filters } from "@components/Filters";
import { AppIcon } from "@components/Icons";
import { Scroll } from "@components/ScrollView";
import { Searchbar } from "@components/Search";
import { Text } from "@components/Texts";
import { useTheme } from "@contexts/theme";
import { AcademyCard, AcademySimple } from "@fragments/Academy";
import { AcademySimpleType } from "@models/products";
import { sampleAcademies } from "@testdata/products";
import { ThemeColorType } from "@themes/colors";

const sortOptions = ["인기순", "최신순", "평점순"];
const filters = ["투수전문", "타격전문", "수비전문", "포수전문"];

export function ProHome() {
  const [academies, setAcademies] = useState<AcademySimpleType[]>([]);

  const [query, setQuery] = useState<string>("");
  const [selectedSort, setSelectedSort] = useState<string>("인기순");
  const [selectedFilter, setSelectedFilter] = useState<string>("");

  const { theme } = useTheme();
  const styles = createStyles(theme);

  const handleFilterSelect = (filter: string) => {
    if (filter === selectedFilter) {
      setSelectedFilter("");
    } else {
      setSelectedFilter(filter);
    }
  };

  useEffect(() => {
    setAcademies(sampleAcademies);
  }, []);

  return (
    <Scroll showsVerticalScrollIndicator={false}>
      <View style={styles.container}>
        <AcademyCard mode="pro" />
        <View style={styles.horizontal}>
          <Card
            title="예약 추가"
            subtitle="빠르고 손쉽게!"
            icon="calendar-pointer"
          />
          <Card title="프로필" subtitle="아카데미 소개" icon="user-pin" />
          <Card title="리뷰 관리" subtitle="완성도 3/8" icon="" />
        </View>
        <View style={styles.search}>
          <Text style={styles.subtitle}>아카데미 찾기</Text>
          <View style={styles.searchbar}>
            <Searchbar
              placeholder="제목, 내용으로 검색하세요"
              value={query}
              onChange={setQuery}
              onSubmit={() => {}}
            />
          </View>
          <View style={styles.filters}>
            <TouchableOpacity
              style={styles.sortButton}
              onPress={() => {}}
              testID="sort-button"
            >
              <AppIcon icon="sort" size={18} color={theme.background} />
              <Text style={styles.text}>{selectedSort}</Text>
            </TouchableOpacity>
            <Filters
              filters={filters}
              selectedFilter={selectedFilter}
              onSelect={handleFilterSelect}
            />
          </View>
        </View>
        <View style={styles.academies}>
          {academies.map((academy) => (
            <AcademySimple key={academy.uuid} academy={academy} quote />
          ))}
        </View>
      </View>
    </Scroll>
  );
}

interface Props {
  title: string;
  subtitle: string;
  icon: string;
}

function Card({ title, subtitle, icon }: Readonly<Props>) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardSubtitle}>{subtitle}</Text>
      <View style={styles.cardIcon}>
        <AppIcon icon={icon} color={theme.primary} size={50} />
      </View>
    </View>
  );
}

const createStyles = (theme: ThemeColorType) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      gap: 24,
      backgroundColor: theme.background,
    },
    horizontal: {
      flexDirection: "row",
      gap: 16,
    },
    card: {
      flex: 1,
      paddingHorizontal: 16,
      paddingTop: 16,
      paddingBottom: 8,
      gap: 8,
      backgroundColor: theme.background,
      borderRadius: 8,
      shadowColor: theme.highEmphasis,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 4,
    },
    cardTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: theme.highEmphasis,
    },
    cardSubtitle: {
      fontSize: 16,
      color: theme.mediumEmphasis,
    },
    cardIcon: {
      alignSelf: "flex-end",
      marginTop: 4,
    },
    search: {
      gap: 8,
    },
    subtitle: {
      fontSize: 20,
      fontWeight: "bold",
      color: theme.highEmphasis,
    },
    searchbar: {
      flexDirection: "row",
    },
    filters: {
      flexDirection: "row",
      alignItems: "center",
      marginHorizontal: 4,
      gap: 8,
    },
    text: {
      fontSize: 16,
      color: theme.background,
    },
    sortButton: {
      flexDirection: "row",
      alignItems: "center",
      marginVertical: 8,
      paddingHorizontal: 8,
      paddingVertical: 4,
      gap: 4,
      backgroundColor: theme.primary,
      borderRadius: 4,
      shadowColor: theme.lowEmphasis,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.24,
      shadowRadius: 4,
      elevation: 4,
    },
    academies: {
      gap: 24,
    },
  });
