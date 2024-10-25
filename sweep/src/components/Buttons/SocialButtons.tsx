import { Image, StyleSheet, Text, TouchableOpacity } from "react-native";

interface Props {
  onPress: () => void;
}

export function NaverButton({ onPress }: Readonly<Props>) {
  const imageSource = {
    uri: "https://kr.object.ncloudstorage.com/catchb.resources/appicons/naver-icon.png",
  };

  return (
    <TouchableOpacity
      style={[styles.social, styles.naverBackground]}
      onPress={onPress}
    >
      <Image
        style={[styles.image, styles.naverHeight]}
        source={imageSource}
        resizeMode="contain"
      />
      <Text style={[styles.socialText, styles.naverColor]}>
        네이버로 로그인
      </Text>
    </TouchableOpacity>
  );
}

export function KakaoButton({ onPress }: Readonly<Props>) {
  const imageSource = {
    uri: "https://kr.object.ncloudstorage.com/catchb.resources/appicons/kakao-icon.png",
  };

  return (
    <TouchableOpacity
      style={[styles.social, styles.kakaoBackground]}
      onPress={onPress}
    >
      <Image
        style={[styles.image, styles.kakaoHeight]}
        source={imageSource}
        resizeMode="contain"
      />
      <Text style={[styles.socialText, styles.kakaoColor]}>
        카카오로 로그인
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  social: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 35,
    marginTop: 10,
    borderRadius: 5,
  },
  socialText: {
    fontSize: 18,
    textAlign: "center",
    fontWeight: "bold",
  },
  image: {
    width: 40,
  },
  naverHeight: {
    height: 35,
  },
  naverBackground: {
    backgroundColor: "#03C75A",
  },
  naverColor: {
    color: "white",
  },
  kakaoHeight: {
    height: 30,
  },
  kakaoBackground: {
    backgroundColor: "#FEE500",
  },
  kakaoColor: {
    color: "rgba(0, 0, 0, 0.85)",
  },
});
