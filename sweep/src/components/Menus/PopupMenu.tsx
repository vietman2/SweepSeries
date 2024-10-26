import { ReactNode, useRef, useState } from "react";
import {
  Dimensions,
  GestureResponderEvent,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useTheme } from "@contexts/theme";
import { ThemeColorType } from "@themes/colors";

interface MenuItem {
  label: string;
  onPress: () => void;
}

interface Props {
  items: MenuItem[];
  children: ReactNode;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export function PopupMenu({ items, children }: Readonly<Props>) {
  const [visible, setVisible] = useState<boolean>(false);
  const [anchorPosition, setAnchorPosition] = useState({ x: 0, y: 0 });

  const { theme } = useTheme();
  const styles = createStyles(theme);

  const showMenu = (event: GestureResponderEvent) => {
    const { pageX, pageY } = event.nativeEvent;
    let newX = pageX;
    let newY = pageY;

    // Adjust x if the menu goes over the right edge
    if (newX + 120 > screenWidth) {
      newX = screenWidth - 130; // Offset to keep it inside the screen
    }

    // Adjust y if the menu goes over the bottom edge
    if (newY + 150 > screenHeight) {
      newY = screenHeight - 160; // Offset to keep it inside the screen
    }

    setAnchorPosition({ x: newX, y: newY + 10 });
    setVisible(true);
  };

  const hideMenu = () => {
    setVisible(false);
  };

  const handleItemPress = (item: MenuItem) => {
    hideMenu();
    item.onPress();
  };

  return (
    <View>
      <TouchableOpacity onPress={showMenu} testID="open">
        {children}
      </TouchableOpacity>
      <Modal
        transparent
        visible={visible}
        animationType="fade"
        onRequestClose={hideMenu}
      >
        <Pressable style={styles.overlay} onPressIn={hideMenu} testID="hide">
          <View
            style={[
              styles.menu,
              { top: anchorPosition.y, left: anchorPosition.x },
            ]}
          >
            {items.map((item, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleItemPress(item)}
              >
                <View style={styles.item}>
                  <Text>{item.label}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const createStyles = (theme: ThemeColorType) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
    },
    menu: {
      position: "absolute",
      backgroundColor: "white",
      borderRadius: 5,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      elevation: 5,
    },
    item: {
      width: 120,
      marginHorizontal: 5,
      paddingTop: 10,
      paddingBottom: 7.5,
      paddingLeft: 5,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
  });
