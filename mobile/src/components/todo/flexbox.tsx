import { View, StyleSheet } from 'react-native';


const Styles = StyleSheet.create({
    // default displey is flex : column
    // flexDirection: 'column' | 'row'
    // justifyContent: phụ thuộc vào flexDirection trục Ox
    //   
    // alignItems: phụ thuộc vào flexDirection trục Oy
    //  AlighSelf: chỉ ảnh hưởng đến phần tử con
      
    container : {
        marginTop: 50,
        borderWidth: 1,
        borderColor: 'red',
    }
});
const FlexBox = () => {
    return (
        <View style={ Styles.container}>
            <View style={{ flex: 1, backgroundColor: 'red' }} />
            <View style={{ flex: 2, backgroundColor: 'green' }} />
            <View style={{ flex: 3, backgroundColor: 'yellow' }} />
        </View>
    );
}
export default FlexBox;