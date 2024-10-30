import { StyleSheet, View } from "react-native";

import { Divider } from "@components/Dividers";
import { Text } from "@components/Texts";
import { useTheme } from "@contexts/theme";
import { InquirySimpleType } from "@models/customers";

interface Props {
  inquiry: InquirySimpleType;
}

export function InquirySimple({ inquiry }: Readonly<Props>) {
  const { theme } = useTheme();
  const styles = createStyles();

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

const createStyles = () =>
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
