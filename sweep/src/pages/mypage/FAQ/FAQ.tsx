import { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

import { Divider } from "@components/Dividers";
import { AppIcon } from "@components/Icons";
import { Scroll } from "@components/ScrollView";
import { FAQTabs } from "@components/Tabs";
import { Text } from "@components/Texts";
import { useTheme } from "@contexts/theme";
import { FAQType } from "@models/customers";
import { sampleFAQs } from "@testdata/customers";
import { ThemeColorType } from "@themes/colors";

const tabs = ["전체", "예약", "아카데미", "레슨", "이벤트", "프로모드"];

export function FAQ() {
  const [FAQs, setFAQs] = useState<FAQType[]>([]);
  const [openFAQnumber, setOpenFAQnumber] = useState<number>(-1);
  const [selectedTab, setSelectedTab] = useState<string>("전체");

  const { theme } = useTheme();
  const styles = createStyles(theme);

  const toggleFAQ = (index: number) => {
    if (openFAQnumber === index) {
      setOpenFAQnumber(-1);
    } else {
      setOpenFAQnumber(index);
    }
  };

  useEffect(() => {
    setFAQs(sampleFAQs);
  }, [selectedTab]);

  return (
    <View style={styles.container}>
      <FAQTabs
        tabs={tabs}
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
      />
      <Divider />
      <Scroll>
        {FAQs.map((FAQ) => (
          <View key={FAQ.id} style={styles.listitem}>
            <TouchableOpacity
              onPress={() => toggleFAQ(FAQ.id)}
              style={styles.horizontal}
            >
              <Text
                style={[
                  styles.title,
                  openFAQnumber === FAQ.id ? { fontWeight: "bold" } : {},
                ]}
              >
                {FAQ.question}
              </Text>
              <AppIcon
                icon={openFAQnumber === FAQ.id ? "chevron-up" : "chevron-down"}
                size={14}
                color={theme.lowEmphasis}
              />
            </TouchableOpacity>
            {openFAQnumber === FAQ.id ? (
              <Text style={styles.content}>{FAQ.answer}</Text>
            ) : null}
          </View>
        ))}
      </Scroll>
    </View>
  );
}

const createStyles = (theme: ThemeColorType) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    listitem: {
      paddingHorizontal: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    horizontal: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 16,
    },
    title: {
      flex: 1,
    },
    content: {
      marginTop: 8,
      marginBottom: 24,
    },
    center: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
  });
