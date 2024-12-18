import AsyncStorage from "@react-native-async-storage/async-storage";

export async function saveStorage(key: string, value: string) {
  await AsyncStorage.setItem(key, value);
}

export async function getStorage(key: string) {
  return await AsyncStorage.getItem(key);
}
