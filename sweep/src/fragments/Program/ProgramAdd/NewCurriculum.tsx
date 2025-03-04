import { StyleSheet, TouchableOpacity, View } from "react-native";

import { SvgIconButton } from "@components/Buttons";
import { TextInput } from "@components/Inputs";
import { Text } from "@components/Texts";
import { useTheme } from "@contexts/theme";
import { CurriculumType } from "@models/products";
import { formatPrice } from "@utils/formatters";

interface PriceProps {
  rows: CurriculumType[];
  setRows: (rows: CurriculumType[]) => void;
}

export function NewCurriculum({ rows, setRows }: Readonly<PriceProps>) {
  const { theme } = useTheme();
  const styles = createStyles();

  const handleDelete = (index: number) => {
    if (rows.length === 1) {
      return;
    }
    setRows(rows.filter((_, i) => i !== index));
  };

  const handleAdd = () => {
    setRows([
      ...rows,
      {
        id: rows[rows.length - 1].id + 1,
        num_lessons: 0,
        price: 0,
      },
    ]);
  };

  const handleInputChange = (index: number, key: string, value: string) => {
    if (value === "") {
      value = "0";
    }

    const valueInNumber = parseInt(value.replace(/[^0-9]/g, ""));

    setRows(
      rows.map((row, i) => {
        if (i === index) {
          return {
            ...row,
            [key]: key === "price" ? valueInNumber : parseInt(value),
          };
        }
        return row;
      })
    );
  };

  return (
    <View>
      {rows.map((row, index) => (
        <View key={index} style={styles.horizontal}>
          <View style={styles.input}>
            <View style={styles.textinput}>
              <TextInput
                value={row.num_lessons.toString()}
                onChangeText={(text) =>
                  handleInputChange(index, "num_lessons", text)
                }
                placeholder="수업 수"
                type="number-pad"
                compact
              />
            </View>
            <Text>회</Text>
          </View>
          <View style={styles.input}>
            <View style={styles.textinput}>
              <TextInput
                value={formatPrice(row.price)}
                onChangeText={(text) => handleInputChange(index, "price", text)}
                placeholder="가격"
                type="number-pad"
                compact
              />
            </View>
            <Text>원</Text>
          </View>
          <TouchableOpacity
            onPress={() => handleDelete(index)}
            style={styles.deleteButton}
            testID={`delete-button${index}`}
          >
            <Text style={styles.deleteText}>삭제</Text>
          </TouchableOpacity>
        </View>
      ))}
      <SvgIconButton
        icon="plus"
        text="추가"
        color={theme.primary}
        onPress={handleAdd}
        small
      />
    </View>
  );
}

interface Props {
  curriculums: CurriculumType[];
}

export function EditCurriculum({ curriculums }: Readonly<Props>) {
  const styles = createStyles();

  return (
    <View style={styles.list}>
      {curriculums.map((curriculum, index) => (
        <View key={index} style={styles.horizontal}>
          <View style={styles.disabledTextBox}>
            <Text>{curriculum.num_lessons.toString()} 회</Text>
          </View>
          <View style={styles.disabledTextBox}>
            <Text>{formatPrice(curriculum.price)} 원</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

const createStyles = () =>
  StyleSheet.create({
    horizontal: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 16,
    },
    input: {
      flex: 2,
      flexDirection: "row",
      alignItems: "center",
      gap: 5,
    },
    textinput: {
      flex: 1,
    },
    deleteButton: {
      padding: 5,
      borderRadius: 5,
      borderWidth: 1,
      borderColor: "red",
    },
    deleteText: {
      color: "red",
    },
    list: {
      gap: 8,
    },
    disabledTextBox: {
      width: "40%",
      alignItems: "flex-end",
      padding: 5,
      borderRadius: 5,
      borderWidth: 1,
      borderColor: "#D9D9D9",
    },
  });
