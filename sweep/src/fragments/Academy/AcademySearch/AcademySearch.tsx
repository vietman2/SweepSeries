import { useCallback, useEffect, useRef, useState } from "react";
import {
  Keyboard,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { router } from "expo-router";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetView,
} from "@gorhom/bottom-sheet";

import { AcademySimple } from "../AcademySimple/AcademySimple";
import { LoadingComponent } from "@components/Fallbacks";
import { AppIcon } from "@components/Icons";
import { Searchbar } from "@components/Search";
import { useTheme } from "@contexts/theme";
import { AcademySimpleType } from "@models/products";
import { getAcademies } from "@services/products";
import { ThemeColorType } from "@themes/colors";

const sortOptions = ["기본순", "인기순", "평점순"];

interface Props {
  refreshCount: number;
}

export function AcademySearch({ refreshCount }: Readonly<Props>) {
  const [academies, setAcademies] = useState<AcademySimpleType[]>([]);
  const [query, setQuery] = useState<string>("");
  const [selectedSort, setSelectedSort] = useState<string>("기본순");
  //const [selectedFilter, setSelectedFilter] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(false);
  const ref = useRef<BottomSheet>(null);
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const handleSortButtonPress = () => {
    ref.current?.expand();
  };

  const handleSortSelect = (sort: string) => {
    setSelectedSort(sort);
    ref.current?.forceClose();
  };

  const handleAcademySelect = (academy: AcademySimpleType) => {
    router.push({
      pathname: "/home/academy/[id]/information",
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
      const response = await getAcademies(query, selectedSort);

      if (response) {
        setAcademies(response);
      }

      setLoading(false);
    };

    fetchData();
  }, [query, selectedSort, refreshCount]);

  return (
    <>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>아카데미 찾기</Text>
          <View style={styles.searchbar}>
            <Searchbar
              placeholder="아카데미 이름으로 검색하세요"
              value={query}
              onChange={setQuery}
              onSubmit={Keyboard.dismiss}
            />
          </View>
          <View style={styles.horizontal}>
            <TouchableOpacity
              style={styles.sortButton}
              onPress={handleSortButtonPress}
              testID="sort-button"
            >
              <AppIcon icon="sort" size={18} color={theme.background} />
              <Text style={styles.text}>{selectedSort}</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.academies}>
          {loading ? (
            <LoadingComponent />
          ) : (
            <>
              {academies.map((academy) => (
                <TouchableOpacity
                  key={academy.uuid}
                  onPress={() => handleAcademySelect(academy)}
                  testID={`academy-detail-${academy.uuid}`}
                >
                  <AcademySimple academy={academy} quote />
                </TouchableOpacity>
              ))}
            </>
          )}
        </View>
      </View>
      <BottomSheet
        ref={ref}
        index={-1}
        snapPoints={["60%"]}
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
    searchbar: {
      flexDirection: "row",
      marginTop: 8,
    },
    horizontal: {
      flexDirection: "row",
      alignItems: "center",
      marginHorizontal: 4,
      gap: 8,
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
    text: {
      fontSize: 16,
      color: theme.background,
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
  });
