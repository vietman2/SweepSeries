import { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";

import { SvgIconButton, TextButton } from "@components/Buttons";
import { TextInput } from "@components/Inputs";
import { Text } from "@components/Texts";
import { useTheme } from "@contexts/theme";
import { alert } from "@services/alert";
import { getTargets, getPositions, createProgram } from "@services/products";
import { ThemeColorType } from "@themes/colors";
import { formatPrice } from "@utils/formatters";

const timeOptions = [
  "30분",
  "60분",
  "90분",
  "120분",
  "150분",
  "180분",
];

type OptionType = {
  id: number;
  name: string;
};

type RowType = {
  id: number;
  num_lessons: number;
  price: number;
};

export function CreateProgram() {
  const [title, setTitle] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("30분");
  const [selectedTarget, setSelectedTarget] = useState<number>(-1);
  const [selectedPosition, setSelectedPosition] = useState<number>(-1);
  const [rows, setRows] = useState<RowType[]>([
    { id: 1, num_lessons: 0, price: 0 },
  ]);

  const [targetOptions, setTargetOptions] = useState<OptionType[]>([]);
  const [positionOptions, setPositionOptions] = useState<OptionType[]>([]);
  const { uuid } = useLocalSearchParams<{ uuid: string }>();

  const { theme } = useTheme();
  const styles = createStyles(theme);

  const selectTarget = (value: string) => {
    setSelectedTarget(
      targetOptions.findIndex((option) => option.name === value)
    );
  };

  const selectPosition = (value: string) => {
    setSelectedPosition(
      positionOptions.findIndex((option) => option.name === value)
    );
  };

  const handleCreate = async () => {
    const minutes = parseInt(selectedTime.split("분")[0]);

    const response = await createProgram(
      uuid,
      title,
      minutes,
      targetOptions[selectedTarget].id,
      [positionOptions[selectedPosition].id],
      rows
    );

    if (response) {
      alert("성공", "프로그램이 생성되었습니다.", router.back);
    } else {
      alert("오류", "프로그램 생성 중 오류가 발생했습니다.");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const response1 = await getTargets();
      const response2 = await getPositions();

      if (response1 && response2) {
        setTargetOptions(response1);
        setPositionOptions(response2);
        setSelectedTarget(0);
        setSelectedPosition(0);
      } else {
        alert(
          "오류 발생",
          "데이터를 불러오는 중 오류가 발생했습니다.",
          router.back
        );
      }
    };

    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.wrapper}>
          <Text style={styles.subtitle}>프로그램 이름</Text>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="상품명을 입력하세요."
          />
        </View>
        <View style={styles.wrapper}>
          <Text style={styles.subtitle}>이용시간</Text>
          <SelectOption
            options={timeOptions}
            selected={selectedTime}
            setSelected={setSelectedTime}
          />
        </View>
        <View style={styles.wrapper}>
          <Text style={styles.subtitle}>대상</Text>
          <SelectOption
            options={targetOptions.map((option) => option.name)}
            selected={targetOptions[selectedTarget]?.name || ""}
            setSelected={(value) => selectTarget(value)}
          />
        </View>
        <View style={styles.wrapper}>
          <Text style={styles.subtitle}>포지션</Text>
          <SelectOption
            options={positionOptions.map((option) => option.name)}
            selected={positionOptions[selectedPosition]?.name || ""}
            setSelected={(value) => selectPosition(value)}
          />
        </View>
        <View style={styles.wrapper}>
          <Text style={styles.subtitle}>가격 정보</Text>
          <NewCurriculum rows={rows} setRows={setRows} />
        </View>
      </View>
      <TextButton text="저장" onPress={handleCreate} />
    </View>
  );
}

interface Props {
  options: string[];
  selected: string;
  setSelected: (value: string) => void;
}

function SelectOption({ options, selected, setSelected }: Readonly<Props>) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.selector}>
      {options.map((option) => (
        <TouchableOpacity
          key={option}
          onPress={() => setSelected(option)}
          style={[
            styles.chip,
            {
              backgroundColor:
                selected === option ? theme.primary : theme.background,
            },
          ]}
          testID={`${option}`}
        >
          <Text
            style={{
              color:
                selected === option ? theme.background : theme.highEmphasis,
            }}
          >
            {option}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

interface PriceProps {
  rows: RowType[];
  setRows: (rows: RowType[]) => void;
}

export function NewCurriculum({ rows, setRows }: Readonly<PriceProps>) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

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

const createStyles = (theme: ThemeColorType) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      paddingBottom: 48,
      backgroundColor: theme.background,
    },
    content: {
      flex: 1,
      gap: 16,
    },
    wrapper: {
      gap: 8,
    },
    subtitle: {
      fontSize: 16,
      fontWeight: "bold",
      color: theme.highEmphasis,
    },
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
  });
