import { StyleSheet, TouchableOpacity, View } from "react-native";

import { Text } from "@components/Texts";
import { useTheme } from "@contexts/theme";
import { ThemeColorType } from "@themes/colors";

type OptionType = {
  id: number;
  name: string;
};

interface SingleProps {
  options: OptionType[];
  selected: number;
  setSelected: (value: number) => void;
}

export function SingleSelect({
  options,
  selected,
  setSelected,
}: Readonly<SingleProps>) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.selector}>
      {options.map((option) => (
        <TouchableOpacity
          key={option.id}
          onPress={() => setSelected(option.id)}
          style={[
            styles.chip,
            {
              backgroundColor:
                selected === option.id ? theme.primary : theme.background,
            },
          ]}
          testID={`${option.id}`}
        >
          <Text
            style={{
              color:
                selected === option.id ? theme.background : theme.highEmphasis,
            }}
          >
            {option.name}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

interface MultiProps {
  options: OptionType[];
  selected: number[];
  setSelected: (value: number) => void;
}

export function MultiSelect({
  options,
  selected,
  setSelected,
}: Readonly<MultiProps>) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const isSelected = (option: OptionType) => selected.includes(option.id);

  return (
    <View style={styles.selector}>
      {options.map((option) => (
        <TouchableOpacity
          key={option.id}
          onPress={() => setSelected(option.id)}
          style={[
            styles.chip,
            {
              backgroundColor: isSelected(option)
                ? theme.primary
                : theme.background,
            },
          ]}
          testID={`${option.id}`}
        >
          <Text
            style={{
              color: isSelected(option) ? theme.background : theme.highEmphasis,
            }}
          >
            {option.name}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const createStyles = (theme: ThemeColorType) =>
  StyleSheet.create({
    selector: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
    },
    chip: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 4,
      borderWidth: 1,
      borderColor: theme.border,
    },
  });
