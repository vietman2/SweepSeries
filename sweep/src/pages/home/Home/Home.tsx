import React, { useCallback, useEffect, useRef, useState } from "react";
import { Keyboard, StyleSheet, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetView,
} from "@gorhom/bottom-sheet";

import { Filters } from "@components/Filters";
import { AppIcon } from "@components/Icons";
import { Scroll, ScrollView } from "@components/ScrollView";
import { Searchbar } from "@components/Search";
import { Text } from "@components/Texts";
import { useAuth } from "@contexts/auth";
import { useTheme } from "@contexts/theme";
import { AcademyCard, AcademySimple, AcademySuggest } from "@fragments/Academy";
import { AcademySimpleType } from "@models/products";
import { getAcademies } from "@services/products";
import { ThemeColorType } from "@themes/colors";

const sortOptions = ["인기순", "최신순", "평점순"];
const filters = ["투수전문", "타격전문", "수비전문", "포수전문"];

export function Home() {
  const [suggestions, setSuggestions] = useState<AcademySimpleType[]>([]);
  const [academies, setAcademies] = useState<AcademySimpleType[]>([]);

  const ref = useRef<BottomSheet>(null);
  const [query, setQuery] = useState<string>("");
  const [selectedSort, setSelectedSort] = useState<string>("인기순");
  const [selectedFilter, setSelectedFilter] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [refreshCount, setRefreshCount] = useState<number>(0);

  const { mode, selectedProfile } = useAuth();
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const handleRefresh = () => {
    setRefreshCount(refreshCount + 1);
  };

  const handleFilterSelect = (filter: string) => {
    if (filter === selectedFilter) {
      setSelectedFilter("");
    } else {
      setSelectedFilter(filter);
    }
  };

  const handleSortSelect = (sort: string) => {
    setSelectedSort(sort);
    ref.current?.close();
  };

  const handleAcademySelect = (academy: AcademySimpleType) => {
    router.push({
      pathname: "/home/academy/[id]",
      params: { id: academy.uuid },
    });
  };

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        enableTouchThrough={false}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
      />
    ),
    []
  );

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const response = await getAcademies(query);

      if (response) {
        setSuggestions(response.suggestions);
        setAcademies(response.academies);
      }

      setLoading(false);
    };

    fetchData();
  }, [query, refreshCount]);

  return (
    <>
      <ScrollView refreshing={loading} onRefresh={handleRefresh}>
        <View style={styles.container}>
        {selectedProfile && (
          <AcademyCard
            mode={mode === "pro" ? "pro" : "normal"}
            num_students={34}
            num_requests={5}
          />
        )}
        {mode === "pro" ? (
          <View style={styles.horizontal}>
            <Card
              title="예약 추가"
              subtitle="빠르고 손쉽게!"
              icon="calendar-pointer"
            />
            <Card title="프로필" subtitle="아카데미 소개" icon="user-pin" />
            <Card title="대시보드" subtitle="다양한 통계" icon="dashboard" />
          </View>
        ) : (
          <View style={styles.content}>
            <View style={styles.header}>
              <Text style={styles.title}>나에게 딱 맞는 캐치비 추천!</Text>
              <Text style={styles.subtitle}>
                Catch B가 추천하는 아카데미/레슨
              </Text>
            </View>
            <Scroll horizontal showsHorizontalScrollIndicator={false}>
              {suggestions.map((academy) => (
                <TouchableOpacity
                  key={academy.uuid}
                  onPress={() => handleAcademySelect(academy)}
                  testID={`academy-${academy.uuid}`}
                >
                  <AcademySuggest academy={academy} />
                </TouchableOpacity>
              ))}
            </Scroll>
          </View>
        )}
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>아카데미 찾기</Text>
            <View style={styles.searchbar}>
              <Searchbar
                placeholder="제목, 내용으로 검색하세요"
                value={query}
                onChange={setQuery}
                onSubmit={Keyboard.dismiss}
              />
            </View>
            <View style={styles.filters}>
              <TouchableOpacity
                style={styles.sortButton}
                onPress={() => ref.current?.expand()}
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
              <TouchableOpacity
                key={academy.uuid}
                onPress={() => handleAcademySelect(academy)}
                testID={`academy-detail-${academy.uuid}`}
              >
                <AcademySimple academy={academy} quote />
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <View style={styles.void} /></View>
      </ScrollView>
      <BottomSheet
        ref={ref}
        index={-1}
        enableDynamicSizing
        backdropComponent={renderBackdrop}
      >
        <BottomSheetView style={styles.sortChoicesContainer}>
          {sortOptions.map((option) => (
            <TouchableOpacity
              onPress={() => handleSortSelect(option)}
              key={option}
              testID={`sort-item-${option}`}
            >
              <Text
                style={[
                  styles.sortChoiceText,
                  option === selectedSort && styles.selectedText,
                ]}
              >
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </BottomSheetView>
      </BottomSheet>
    </>
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
      backgroundColor: theme.background,
    },
    content: {
      marginTop: 24,
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
    searchbar: {
      flexDirection: "row",
      marginTop: 8,
    },
    filters: {
      flexDirection: "row",
      alignItems: "center",
      marginHorizontal: 4,
      gap: 8,
    },
    academies: {
      gap: 24,
    },
    void: {
      height: 24,
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
    sortChoicesContainer: {
      flex: 0,
      minHeight: 100,
    },
    sortChoiceText: {
      padding: 16,
      textAlign: "center",
      fontSize: 24,
      fontWeight: "bold",
      color: "black",
    },
    selectedText: {
      color: theme.primary,
    },
    horizontal: {
      flexDirection: "row",
      marginTop: 16,
      gap: 8,
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
      fontSize: 14,
      color: theme.mediumEmphasis,
    },
    cardIcon: {
      alignSelf: "flex-end",
      marginTop: 4,
    },
  });
