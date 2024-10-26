import { StyleSheet, View } from "react-native";
import { SvgCssUri } from "react-native-svg/css";

import { Text } from "@components/Texts";
import { useTheme } from "@contexts/theme";
import { TagType } from "@models/community";
import { ThemeColorType } from "@themes/colors";

interface Props {
  tag: TagType;
  type?: 1 | 2;
  selected?: boolean;
}

export function Tag({ tag, type = 1, selected = false }: Readonly<Props>) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  if (type === 1) {
    const width = tag.forum_id === 1 ? 16 : 40;
    const size = tag.forum_id === 1 ? 16 : 20;

    return (
      <View style={[styles.tag, { backgroundColor: tag.bgcolor }]}>
        <SvgCssUri uri={tag.icon} width={width} height={size} />
        {tag.forum_id === 1 ? (
          <Text style={[styles.text, { color: tag.color }]}>{tag.name}</Text>
        ) : null}
      </View>
    );
  } else {
    return (
      <View
        style={[
          styles.type2,
          {
            backgroundColor: selected
              ? tag.bgcolor
              : theme.background,
          },
        ]}
      >
        <SvgCssUri
          uri={tag.icon}
          width={tag.forum_id === 1 ? 20 : 40}
          height={20}
        />
      </View>
    );
  }
}

const createStyles = (theme: ThemeColorType) =>
  StyleSheet.create({
    tag: {
      flexDirection: "row",
      alignItems: "center",
      alignSelf: "flex-start",
      borderRadius: 5,
      paddingHorizontal: 7.5,
      paddingVertical: 5,
    },
    text: {
      marginLeft: 5,
    },
    type2: {
      marginRight: 15,
      padding: 10,
      borderRadius: 10,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowColor: theme.highEmphasis,
      shadowOpacity: 0.25,
      shadowRadius: 2,
      elevation: 2,
    },
  });
