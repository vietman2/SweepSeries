import { useEffect, useState } from "react";
import {
  Linking,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { router } from "expo-router";
import * as Clipboard from "expo-clipboard";

import { TextButton } from "@components/Buttons";
import { Empty } from "@components/Fallbacks";
import { AppIcon } from "@components/Icons";
import { Scroll } from "@components/ScrollView";
import { Text } from "@components/Texts";
import { useAuth } from "@contexts/auth";
import { useTheme } from "@contexts/theme";
import { InquirySimple } from "@fragments/Inquiry";
import { InquirySimpleType } from "@models/customers";
import { alert } from "@services/alert";
import { createInquiry, getInquiries } from "@services/app";
import { ThemeColorType } from "@themes/colors";

export function CustomerService() {
  const [inquiries, setInquiries] = useState<InquirySimpleType[]>([]);
  const [fillMode, setFillMode] = useState<boolean>(false);

  const { theme } = useTheme();
  const styles = createStyles(theme);

  const guideText =
    "Catch B 서비스 이용 시 불편사항이나 문의사항을 보내주시면 신속하고 친절하게 안내해 드리겠습니다.\n\n빠른 처리를 원하시는 경우, 대표 이메일로 문의 부탁드립니다.\n\n사용환경 및 상세사항을 적어주시면 정확하고 빠른 답변이 가능하며, 메일을 보내시기 전 이름, 이메일, 질문유형이 정확한지 다시 한 번 확인해주세요!";

  const handleEmail = () => {
    Linking.openURL("mailto:support@sweepseries.com");
  };

  const copyEmailAddress = async () => {
    await Clipboard.setStringAsync("support@sweepseries.com");

    alert("", "이메일 주소가 복사되었습니다.");
  };

  const handleFillMode = () => {
    setFillMode(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await getInquiries();

      if (response) {
        setInquiries(response);
      }
    };

    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.guide}>
        <View style={styles.contact}>
          <AppIcon icon="envelope" size={28} color={theme.primary} />
          <TouchableOpacity onPress={handleEmail} testID="email">
            <Text style={styles.contactText}>support@sweepseries.com</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={copyEmailAddress} testID="copy">
            <AppIcon icon="copy" size={28} color={theme.primary} />
          </TouchableOpacity>
        </View>
        <Text style={styles.guideText}>{guideText}</Text>
        {!fillMode && (
          <TextButton text="1:1 문의하기" onPress={handleFillMode} />
        )}
      </View>
      {fillMode ? <Form /> : <List inquiries={inquiries} />}
    </View>
  );
}

function Form() {
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");

  const { selectedProfile } = useAuth();
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const handleSubmit = async () => {
    if (!title || !content) {
      alert("", "제목과 내용을 입력해주세요.");
      return;
    }

    const response = await createInquiry(title, content);

    if (response) {
      alert("", "문의가 성공적으로 등록되었습니다.");
      router.back();
    } else {
      alert("", "문의 등록에 실패했습니다.");
    }
  };

  return (
    <Scroll>
      <View style={styles.form}>
        <View style={styles.wrapper}>
          <Text style={styles.subtitle}>고객정보</Text>
          <TextInput
            value={selectedProfile?.name}
            style={[styles.textinput, styles.disabled]}
            editable={false}
          />
        </View>
        <View style={styles.wrapper}>
          <Text style={styles.subtitle}>문의하기</Text>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="제목을 입력해주세요."
            style={styles.textinput}
            testID="title"
          />
          <TextInput
            value={content}
            onChangeText={setContent}
            placeholder="내용을 입력해주세요."
            style={[styles.textinput, styles.large]}
            multiline
            numberOfLines={4}
            testID="content"
          />
        </View>
        <View style={styles.buttonWrapper}>
          <TextButton text="문의하기" onPress={handleSubmit} />
        </View>
      </View>
    </Scroll>
  );
}

interface Props {
  inquiries: InquirySimpleType[];
}

function List({ inquiries }: Readonly<Props>) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  if (inquiries.length === 0) {
    return <Empty message="문의 내역이 없습니다." color={theme.lowEmphasis} />;
  }

  return (
    <View style={styles.content}>
      {inquiries.map((inquiry) => (
        <InquirySimple key={inquiry.id} inquiry={inquiry} />
      ))}
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
      fontSize: 20,
      fontWeight: "bold",
      color: theme.primary,
    },
    guideText: {
      fontSize: 14,
      lineHeight: 20,
      color: theme.lowEmphasis,
    },
    content: {
      flex: 1,
      backgroundColor: theme.background,
    },
    form: {
      flex: 1,
      paddingHorizontal: 24,
      paddingVertical: 16,
      gap: 16,
      backgroundColor: theme.background,
    },
    wrapper: {
      gap: 12,
    },
    subtitle: {
      fontSize: 16,
      fontWeight: "bold",
      color: theme.highEmphasis,
    },
    textinput: {
      height: 40,
      padding: 8,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 4,
    },
    disabled: {
      backgroundColor: theme.backgroundGray,
    },
    large: {
      height: 200,
    },
    buttonWrapper: {
      marginVertical: 8,
    },
  });
