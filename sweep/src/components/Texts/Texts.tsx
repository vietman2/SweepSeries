import { StyleSheet, Text, View } from "react-native";

interface Props {
  title: string;
  subtitle?: string;
}

export function InputTitle({ title, subtitle }: Readonly<Props>) {
  const styles = createStyles();

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
    </View>
  );
}

const createStyles = () =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    title: {
      fontSize: 16,
      fontWeight: "bold",
    },
    subtitle: {
      fontSize: 14,
      color: "#666666",
    },
  });
