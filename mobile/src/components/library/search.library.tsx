import { APP_COLOR } from "@/utils/constant";
import { Pressable, StyleSheet, Text, View } from "react-native"
import EvilIcons from '@expo/vector-icons/EvilIcons';
import { router } from "expo-router";

const styles = StyleSheet.create({
    container: {
        backgroundColor: APP_COLOR.GREY,
        gap: 5,
        flexDirection: "row",
        margin: 5,
        paddingHorizontal: 3,
        paddingVertical: 7,
        borderRadius: 3
    }
})
const SearchLibrary = () => {
    return (
        <Pressable onPress={() => {router.navigate('/(auth)/libsearch')}} style={styles.container}>
            <EvilIcons
                name="search"
                size={24}
                color="black"
            />
            <Text style={{
                color: "#707070"
            }}>Sách ,Thẻ , Danh mục</Text>
        </Pressable>
        
    )
}

export default SearchLibrary;