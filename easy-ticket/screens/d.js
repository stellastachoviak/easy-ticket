import AsyncStorage from '@react-native-async-storage/async-storage';
AsyncStorage.clear().then(() => console.log("AsyncStorage limpo!"));
