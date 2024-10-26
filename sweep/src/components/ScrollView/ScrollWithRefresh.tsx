/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Keyboard, RefreshControl } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

interface Props {
  children: React.ReactNode;
  refreshing: boolean;
  onRefresh: () => void;
  stickyIndex?: number;
  hideKeyboardOnScroll?: boolean;
}

export default function ScrollWithRefresh({
  children,
  refreshing,
  onRefresh,
  stickyIndex,
  hideKeyboardOnScroll = false,
}: Readonly<Props>) {
  const [isPulledDown, setIsPulledDown] = useState<boolean>(false);

  const onScroll = (event: any) => {
    const scrollY = event.nativeEvent.contentOffset.y;

    if (scrollY < -100) {
      setIsPulledDown(true);
    } else {
      setIsPulledDown(false);
    }

    if (hideKeyboardOnScroll) {
      Keyboard.dismiss();
    }
  };

  const onScrollEndDrag = () => {
    if (isPulledDown && !refreshing) {
      onRefresh();
    }
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={refreshing} />}
      onScroll={onScroll}
      onScrollEndDrag={onScrollEndDrag}
      scrollEventThrottle={16}
      stickyHeaderIndices={stickyIndex ? [stickyIndex] : undefined}
      testID="scroll-view"
    >
      {children}
    </ScrollView>
  );
}
