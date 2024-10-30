import { StyleSheet, View } from "react-native";

import { Divider } from "@components/Dividers";
import { Text } from "@components/Texts";
import { useTheme } from "@contexts/theme";
import { InquirySimpleType } from "@models/customers";
import { ThemeColorType } from "@themes/colors";

interface Props {
  inquiry: InquirySimpleType;
}

export function InquirySimple({ inquiry }: Readonly<Props>) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <>
      <View style={styles.container}>
        <Text>
          [{inquiry.category}] {inquiry.title}
        </Text>
        <Text
          style={[
            styles.statusText,
            {
              color:
                inquiry.status === "답변완료"
                  ? theme.primary
                  : theme.lowEmphasis,
            },
          ]}
        >
          {inquiry.status}
        </Text>
      </View>
      <Divider />
    </>
  );
}

const createStyles = (theme: ThemeColorType) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: 16,
    },
    statusText: {
      fontSize: 12,
    },
  });
