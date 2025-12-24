import { Pressable, StyleSheet, Text, View } from "react-native";
import Entypo from '@expo/vector-icons/Entypo';

const styles = StyleSheet.create({
    text: {
        textTransform: 'uppercase',
        fontSize: 20,
        color: 'blue'
    },
    btnContainer: {
        borderWidth: 1,
        borderRadius: 5,
        borderColor: 'red',
        paddingHorizontal: 10,
        paddingVertical: 5,
        flexDirection: 'row',
        justifyContent: 'center', // Thêm dòng này để căn giữa theo chiều ngang
        alignItems: 'center',    // Căn giữa theo chiều dọc
        gap: 10,
        marginBottom: 20,
        alignSelf: 'center',     // Căn giữa container trong parent (nếu cần)
    }
});
interface IProps {
    title: string;
    onPress: () => void;
}
const MineButton = (props: IProps) => {
    const { title, onPress } = props;
    return (
        <Pressable
            style={({ pressed }) => ({
                opacity: pressed ? 0.5 : 1,
                alightSelf: "center", // Căn trái trong parent
            })}
            onPress={onPress}
        >
            <View style={styles.btnContainer}>
                <Entypo name="add-to-list" size={24} color="black" />
                <Text style={styles.text}>{title}</Text>
            </View>
        </Pressable >

    );
}

export default MineButton;