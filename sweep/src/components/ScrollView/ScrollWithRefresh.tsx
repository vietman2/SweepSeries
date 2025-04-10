import { Keyboard, ViewStyle } from "react-native";
import { RefreshControl, ScrollView } from "react-native-gesture-handler";

interface Props {
  children: React.ReactNode;
  refreshing: boolean;
  onRefresh: () => void;
  stickyIndex?: number;
  hideKeyboardOnScroll?: boolean;
  style?: ViewStyle;
}

export default function ScrollWithRefresh({
  children,
  refreshing,
  onRefresh,
  stickyIndex,
  hideKeyboardOnScroll = false,
  style,
}: Readonly<Props>) {
  const onScroll = () => {
    if (hideKeyboardOnScroll) {
      Keyboard.dismiss();
    }
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} enabled />
      }
      onScroll={onScroll}
      scrollEventThrottle={16}
      stickyHeaderIndices={stickyIndex ? [stickyIndex] : undefined}
      overScrollMode="always"
      contentContainerStyle={{ flexGrow: 1 }}
      style={style}
      testID="scroll-view"
    >
      {children}
    </ScrollView>
  );
}
