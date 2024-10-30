import { useEffect, useState } from "react";
import { Linking, StyleSheet, TouchableOpacity, View } from "react-native";

import { TextButton } from "@components/Buttons";
import { AppIcon } from "@components/Icons";
import { Text } from "@components/Texts";
import { useTheme } from "@contexts/theme";
import { InquirySimple } from "@fragments/Inquiry";
import { InquirySimpleType } from "@models/customers";
import { sampleInquiries } from "@testdata/customers";
import { ThemeColorType } from "@themes/colors";

export function CustomerService() {
  const [inquiries, setInquiries] = useState<InquirySimpleType[]>([]);

  const { theme } = useTheme();
  const styles = createStyles(theme);

  const guideText =
    "Catch B 서비스 이용 시 불편사항이나 문의사항을 보내주시면 신속하고 친절하게 안내해 드리겠습니다.\n\n빠른 처리를 원하시는 경우, 대표 이메일로 문의 부탁드립니다.\n\n사용환경 및 상세사항을 적어주시면 정확하고 빠른 답변이 가능하며, 메일을 보내시기 전 이름, 이메일, 질문유형이 정확한지 다시 한 번 확인해주세요!";

  const handleEmail = () => {
    Linking.openURL("mailto:support@sweepseries.com");
  };

  const handleAsk = () => {};

  useEffect(() => {
    setInquiries(sampleInquiries);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.guide}>
        <View style={styles.contact}>
          <AppIcon icon="envelope" size={32} color={theme.primary} />
          <TouchableOpacity onPress={handleEmail} testID="email">
            <Text style={styles.contactText}>support@sweepseries.com</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.guideText}>{guideText}</Text>
        <TextButton text="1:1 문의하기" onPress={handleAsk} />
      </View>
      {inquiries.length === 0 ? (
        <View style={styles.empty}>
          <AppIcon icon="warning-circle" size={48} color={theme.lowEmphasis} />
          <Text style={styles.warningText}>{"문의한 내역이 없습니다.\n"}</Text>
        </View>
      ) : (
        <View style={styles.content}>
          {inquiries.map((inquiry) => (
            <InquirySimple key={inquiry.id} inquiry={inquiry} />
          ))}
        </View>
      )}
    </View>
  );
}

const createStyles = (theme: ThemeColorType) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    guide: {
      paddingVertical: 16,
      paddingHorizontal: 24,
      gap: 24,
    },
    contact: {
      flexDirection: "row",
      alignItems: "center",
      gap: 16,
    },
    contactText: {
      fontSize: 24,
      fontWeight: "bold",
      color: theme.primary,
    },
    guideText: {
      fontSize: 14,
      lineHeight: 20,
      color: theme.lowEmphasis,
    },
    empty: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.background,
      gap: 8,
    },
    warningText: {
      fontSize: 20,
      fontWeight: "bold",
      textAlign: "center",
      color: theme.lowEmphasis,
      lineHeight: 32,
    },
    content: {
      flex: 1,
      backgroundColor: theme.background,
    },
  });
