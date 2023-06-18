import AsyncStorage from "@react-native-async-storage/async-storage";

export const storeData = async (key, value) => {
    try {
        //console.log('stored '+key+' '+value);
        await AsyncStorage.setItem('@' + key, value);
    } catch (e) {
        // saving error
    }
};


export const getData = async (key) => {
    try {
        const value = await AsyncStorage.getItem('@'+key);
        //console.log('get '+key+' '+value);
        return value;
    } catch (e) {
        // error reading value
    }
}

export const rmData=async(key)=>{
    await AsyncStorage.removeItem('@'+key);
}
  