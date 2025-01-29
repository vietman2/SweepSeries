import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useLocalSearchParams } from "expo-router";

interface SignupContextType {
  setNotificationsAgreed: (agreed: boolean) => void;
  setUsernameEmail: (username: string, email: string) => void;
  setPasswords: (password: string, password2: string) => void;
  setNamePhone: (name: string, phone: string) => void;
  mode: string;
  user: {
    username: string;
    email: string;
    password: string;
    password2: string;
    name: string;
    phone: string;
  };
  profile: {
    gender: string;
    birthdate: string;
    nickname: string;
    profileImage: string;
  };
  notificationsAgreed: boolean;
}

const SignupContext = createContext<SignupContextType | undefined>(undefined);

type SignupContextParams = {
  mode: string;
  username?: string;
  email?: string;
  name?: string;
  phone?: string;
  birthday?: string;
  birthyear?: string;
  gender?: string;
  nickname?: string;
  profileImage?: string;
};

export const SignupProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [mode, setMode] = useState<"catchb" | "naver" | "kakao">("catchb");

  const [notificationsAgreed, setNotificationsAgreed] =
    useState<boolean>(false);

  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  const [password, setPassword] = useState<string>("");
  const [password2, setPassword2] = useState<string>("");

  const [name, setName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [gender, setGender] = useState<string>("");
  const [birthdate, setBirthdate] = useState<string>("");
  const [nickname, setNickname] = useState<string>("");
  const [profileImage, setProfileImage] = useState<string>("");

  const params = useLocalSearchParams<SignupContextParams>();

  const setUsernameEmail = (username: string, email: string) => {
    setUsername(username);
    setEmail(email);
  };

  const setPasswords = (password: string, password2: string) => {
    setPassword(password);
    setPassword2(password2);
  };

  const setNamePhone = (name: string, phone: string) => {
    setName(name);
    setPhone(phone);
  };

  useEffect(() => {
    if (params.mode === "naver") {
      const getBirthdate = () => {
        if (params.birthday && params.birthyear) {
          return `${params.birthyear}-${params.birthday}`;
        }
        return "";
      };

      const getGender = () => {
        if (params.gender === "F") {
          return "여성";
        }

        return "남성";
      };

      setMode("naver");
      setUsername(params.username || "");
      setEmail(params.email || "");
      setName(params.name || "");
      setPhone(params.phone || "");
      setBirthdate(getBirthdate());
      setGender(getGender());
      setNickname(params.nickname || "");
      setProfileImage(params.profileImage || "");
    } else if (params.mode === "kakao") {
      const getGender = () => {
        if (params.gender === "female") {
          return "여성";
        }

        return "남성";
      };

      const getBirthdate = () => {
        if (params.birthday && params.birthyear) {
          const month = params.birthday.slice(0, 2);
          const day = params.birthday.slice(2, 4);

          return `${params.birthyear}-${month}-${day}`;
        }
        return "";
      };

      setMode("kakao");
      setUsername(params.username || "");
      setEmail(params.email || "");
      setName(params.name || "");
      setPhone(params.phone || "");
      setBirthdate(getBirthdate());
      setGender(getGender());
      setNickname(params.nickname || "");
      setProfileImage(params.profileImage || "");
    }
  }, []);

  const user = useMemo(
    () => ({ username, email, password, password2, name, phone }),
    [username, email, password, password2, name, phone]
  );

  const profile = useMemo(
    () => ({
      gender,
      birthdate,
      nickname,
      profileImage,
    }),
    [gender, birthdate, nickname, profileImage]
  );

  const value = useMemo(
    () => ({
      setNotificationsAgreed,
      setUsernameEmail,
      setPasswords,
      setNamePhone,
      mode,
      user: user,
      profile: profile,
      notificationsAgreed,
    }),
    [mode, user, profile, notificationsAgreed]
  );

  return (
    <SignupContext.Provider value={value}>{children}</SignupContext.Provider>
  );
};

export const useSignup = (): SignupContextType => {
  const context = useContext(SignupContext);

  if (!context) {
    throw new Error("useSignup must be used within a SignupProvider");
  }

  return context;
};
