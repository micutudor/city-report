import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveAuthToken = async (value) => {
  try {
    await AsyncStorage.setItem('@auth_token', value);
  } catch (e) {
    console.log("Error: " + e);
  }
}

export const deleteAuthToken = async () => {
  try {
    await AsyncStorage.removeItem('@auth_token');
  } catch (e) {
    console.log("Error: " + e);
  }
}

export const getAuthToken = async () => {
  try {
    const value = await AsyncStorage.getItem('@auth_token');
    return value;
  } catch(e) {
    console.log("Error: " + e);
  }
}