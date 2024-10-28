import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";

import { Filters } from "@components/Filters";
import { Scroll } from "@components/ScrollView";
import { Searchbar } from "@components/Search";
import { Sort } from "@components/Sorts";
import { Text } from "@components/Texts";
import { useTheme } from "@contexts/theme";
import { AcademySimple, AcademySuggest, MyAcademy } from "@fragments/Academy";
import { AcademySimpleType } from "@models/products";
import { sampleAcademies } from "@testdata/products";
import { ThemeColorType } from "@themes/colors";

const sortOptions = ["인기순", "최신순", "평점순"];
const filters = ["투수전문", "타격전문", "수비전문", "포수전문"];

export function NormalHome() {
  const [suggestions, setSuggestions] = useState<AcademySimpleType[]>([]);
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
    setSuggestions(sampleAcademies);
    setAcademies(sampleAcademies);
  }, []);

  return (
    <Scroll style={styles.container}>
      <MyAcademy />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>나에게 딱 맞는 캐치비 추천!</Text>
          <Text style={styles.subtitle}>Catch B가 추천하는 아카데미/레슨</Text>
        </View>
        <Scroll horizontal>
          {suggestions.map((academy) => (
            <AcademySuggest key={academy.uuid} academy={academy} />
          ))}
        </Scroll>
      </View>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>아카데미 찾기</Text>
          <View style={styles.searchbar}>
            <Searchbar
              placeholder="제목, 내용으로 검색하세요"
              value={query}
              onChange={setQuery}
              onSubmit={() => {}}
            />
          </View>
          <View style={styles.filters}>
            <Sort
              options={sortOptions}
              selectedOption={selectedSort}
              onSelect={setSelectedSort}
            />
            <Filters
              filters={filters}
              selectedFilter={selectedFilter}
              onSelect={handleFilterSelect}
            />
          </View>
        </View>
        <View style={styles.academies}>
          {academies.map((academy) => (
            <AcademySimple key={academy.uuid} academy={academy} />
          ))}
        </View>
      </View>
      <View style={styles.void} />
    </Scroll>
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
    }
  });
