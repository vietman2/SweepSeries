import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useTheme } from "@contexts/theme";
import { ThemeColorType } from "@themes/colors";

interface Props {
  filters: string[];
  selectedFilter: string;
  onSelect: (filter: string) => void;
}

export function Filters({
  filters,
  selectedFilter,
  onSelect,
}: Readonly<Props>) {
  return (
    <ScrollView horizontal>
      {filters.map((filter) => (
        <TouchableOpacity key={filter} onPress={() => onSelect(filter)}>
          <Filter text={filter} isSelected={filter === selectedFilter} />
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

interface FilterProps {
  text: string;
  isSelected: boolean;
}

function Filter({ text, isSelected }: Readonly<FilterProps>) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={[styles.filter, isSelected && styles.selectedFilter]}>
      <Text style={[styles.text, isSelected && styles.selectedText]}>
        {text}
      </Text>
    </View>
  );
}

const createStyles = (theme: ThemeColorType) =>
  StyleSheet.create({
    filter: {
      marginVertical: 8,
      marginHorizontal: 4,
      paddingHorizontal: 8,
      paddingVertical: 6,
      borderRadius: 4,
      backgroundColor: theme.background,
      shadowColor: theme.lowEmphasis,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.24,
      shadowRadius: 4,
      elevation: 4,
    },
    selectedFilter: {
      backgroundColor: theme.primary,
    },
    text: {
      fontSize: 16,
    },
    selectedText: {
      color: theme.background,
    },
  });
