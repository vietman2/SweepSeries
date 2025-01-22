import { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { AppIcon } from '@components/Icons';
import { Text } from '@components/Texts';
import { useTheme } from '@contexts/theme';
import { TodoType } from '@models/calendar';
import { ThemeColorType } from '@themes/colors';

interface Props {
  todo: TodoType;
  onPress: () => Promise<boolean>;
}

export function TodoSimple({ todo, onPress }: Readonly<Props>) {
  const [isDone, setIsDone] = useState(todo.completed);

  const { theme } = useTheme();
  const styles = createStyles(theme);

  const handleToggle = async () => {
    const result = await onPress();

    if (result) {
      setIsDone(!isDone);
    }
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={handleToggle}
      testID="toggle"
    >
      <View
        style={[
          styles.iconWrapper,
          { backgroundColor: isDone ? theme.primary : 'white' },
        ]}
      >
        <AppIcon icon="check" size={14} color="white" />
      </View>
      <Text style={styles.text}>{todo.title}</Text>
    </TouchableOpacity>
  );
}

const createStyles = (theme: ThemeColorType) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    iconWrapper: {
      padding: 2,
      borderWidth: 1,
      borderColor: theme.primary,
      borderRadius: 20,
    },
    text: {
      fontSize: 14,
      color: theme.highEmphasis,
    },
  });
