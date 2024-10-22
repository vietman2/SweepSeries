import { StyleSheet, Text, TouchableOpacity } from "react-native";

import { AppIcon } from "@components/Icons";

interface Props {
  icon: string;
  text: string;
}

export function MainButton({ icon, text }: Props) {
  return (
    <TouchableOpacity style={styles.button}>
      <AppIcon icon={icon} color="#14863E" size={50} />
      <Text>{text}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    justifyContent: "center",
    width: 200,
    height: 200,
    gap: 8,
    borderRadius: 30,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
});
