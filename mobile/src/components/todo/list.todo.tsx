import React from "react";
import { FlatList, StyleSheet, View,Text, TouchableOpacity } from "react-native";

interface Iprops {

    todoList: ITodo[];
    deleteTodo: (value: number) => void;

}

const styles = StyleSheet.create({
    todo: {
        fontSize: 20,
        backgroundColor: "pink",
        padding: 10,
        marginBottom: 5

    },
});
const ListTodo = (prop : Iprops) => {
    const { todoList } = prop;
    return (
        <FlatList
            data={todoList}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
                <TouchableOpacity
                    onPress={() => prop.deleteTodo(item.id)}
                >
                    <View style={styles.todo}>
                        <Text>{item.title}</Text>
                    </View>
                </TouchableOpacity>
            )}
        />
    )
}

export default ListTodo; 